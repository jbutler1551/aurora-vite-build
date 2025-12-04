import { PrismaClient } from '@prisma/client';
import { getParallelGateway } from '../parallel/gateway.js';
import { getClaudeService } from '../anthropic/service.js';
import {
  buildCompanyResearchQuery,
  buildRegionalCompetitorQuery,
  buildGlobalCompetitorQuery,
  buildCompetitorDeepDiveQuery,
  buildIndustryTrendsQuery,
  buildCompetitorTechQuery,
  buildCaseStudyQuery,
  COMPETITOR_ENRICHMENT_FIELDS,
} from '../parallel/queries.js';

const prisma = new PrismaClient();

/**
 * Convert data to Prisma JSON type
 */
const toJson = (data) => JSON.parse(JSON.stringify(data));

/**
 * Pipeline phases with progress ranges for dashboard display
 */
const PIPELINE_PHASES = {
  PHASE_1_EXTRACT: { start: 0, end: 15, label: 'Extracting Company Website' },
  PHASE_2_DEEP_RESEARCH: { start: 15, end: 30, label: 'Deep Company Research' },
  PHASE_3_COMPETITOR_DISCOVERY: { start: 30, end: 50, label: 'Discovering Competitors' },
  PHASE_4_COMPETITOR_ANALYSIS: { start: 50, end: 70, label: 'Analyzing Competitors' },
  PHASE_5_SWOT_REPORT: { start: 70, end: 90, label: 'Building SWOT & Report' },
  PHASE_6_TALK_TRACKS: { start: 90, end: 100, label: 'Generating Talk Tracks' },
};

/**
 * Update analysis status in Aurora Core database with detailed progress
 */
async function updateProgress(analysisId, phase, step, substep = null) {
  const phaseConfig = PIPELINE_PHASES[phase];
  const progress = substep
    ? Math.round(phaseConfig.start + (phaseConfig.end - phaseConfig.start) * substep)
    : phaseConfig.start;

  const stepDescription = substep ? `${phaseConfig.label}: ${step}` : step;

  console.log(`[${analysisId}] ${progress}% - ${stepDescription}`);

  await prisma.analysis.update({
    where: { id: analysisId },
    data: {
      status: 'PROCESSING',
      progress,
      currentPhase: phase,
      currentStep: stepDescription,
      updatedAt: new Date(),
    },
  });
}

/**
 * Save data to Aurora Core (database) for a specific pipeline step
 */
async function saveToAuroraCore(analysisId, field, data, costUSD = 0) {
  const updateData = { [field]: toJson(data), updatedAt: new Date() };

  // Accumulate costs
  const current = await prisma.analysis.findUnique({
    where: { id: analysisId },
    select: { totalCostUSD: true },
  });

  if (costUSD > 0) {
    updateData.totalCostUSD = (current?.totalCostUSD || 0) + costUSD;
  }

  await prisma.analysis.update({
    where: { id: analysisId },
    data: updateData,
  });

  console.log(`[${analysisId}] Saved to Aurora Core: ${field}`);
}

/**
 * Wait for Parallel API task completion with polling
 *
 * CRITICAL: Parallel API tasks are async and involve real-time web research.
 * Each task can take 10-30+ minutes to complete. We MUST poll until the API
 * explicitly returns status: 'completed' - we cannot trust any data in the
 * initial response as "complete".
 *
 * FindAll API uses different status indicators:
 * - is_active: whether the search is still running
 * - are_enrichments_active: whether enrichments are still running
 * - Complete when BOTH are false
 */
async function waitForParallelTask(parallel, response, taskType) {
  // Detect if this is a FindAll task (uses findall_id)
  const isFindAll = taskType.toLowerCase().includes('findall');

  // Get task ID from response - this is REQUIRED for async tasks
  const taskId = response.data?.findall_id || response.data?.findallId || response.data?.runId || response.data?.id || response.data?.run_id;

  if (!taskId) {
    // Only for truly synchronous endpoints (like simple extract)
    // Log a warning - most tasks SHOULD have a task ID
    console.warn(`[Parallel] WARNING: ${taskType} returned no task ID. Response may be incomplete.`);
    console.log(`[Parallel] Response data keys: ${Object.keys(response.data || {}).join(', ')}`);
    return response.data;
  }

  console.log(`[Parallel] ${taskType} started with task ID: ${taskId} (isFindAll: ${isFindAll})`);
  console.log(`[Parallel] ${taskType} - Beginning polling loop. This may take 10-30+ minutes...`);

  // Poll for completion - allow up to 45 minutes per task
  const maxWait = 2700000; // 45 minutes (tasks can take 10-30+ min)
  const pollInterval = 10000; // 10 seconds between polls
  const startTime = Date.now();
  let pollCount = 0;

  while (Date.now() - startTime < maxWait) {
    pollCount++;
    const elapsedMin = Math.round((Date.now() - startTime) / 60000);

    try {
      // Use the appropriate polling method based on task type
      const status = isFindAll
        ? await parallel.pollFindAllStatus(taskId)
        : await parallel.pollTaskStatus(taskId);

      // FindAll uses different completion signals
      if (isFindAll) {
        const isActive = status.data?.is_active;
        const areEnrichmentsActive = status.data?.are_enrichments_active;
        const matchCount = status.data?.results?.length || 0;

        console.log(`[Parallel] ${taskType} poll #${pollCount} (${elapsedMin}min): is_active=${isActive}, enrichments_active=${areEnrichmentsActive}, matches=${matchCount}`);

        // FindAll is complete when both is_active and are_enrichments_active are false
        if (isActive === false && areEnrichmentsActive === false) {
          console.log(`[Parallel] ✓ ${taskType} COMPLETED after ${elapsedMin} minutes with ${matchCount} matches`);
          return status.data;
        }
      } else {
        const currentStatus = status.data?.status || 'unknown';

        console.log(`[Parallel] ${taskType} poll #${pollCount} (${elapsedMin}min): status=${currentStatus}`);

        if (currentStatus === 'completed') {
          console.log(`[Parallel] ✓ ${taskType} COMPLETED after ${elapsedMin} minutes`);
          const result = await parallel.getTaskResult(taskId);
          return result.data;
        }

        if (currentStatus === 'failed') {
          const errorMsg = status.data?.error || status.data?.message || 'Unknown error';
          console.error(`[Parallel] ✗ ${taskType} FAILED: ${errorMsg}`);
          throw new Error(`${taskType} failed: ${errorMsg}`);
        }
      }
    } catch (pollError) {
      console.log(`[Parallel] ${taskType} poll error (will retry): ${pollError.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  const totalMin = Math.round(maxWait / 60000);
  console.error(`[Parallel] ✗ ${taskType} TIMED OUT after ${totalMin} minutes`);
  throw new Error(`${taskType} timed out after ${totalMin} minutes. Task ID: ${taskId}`);
}

/**
 * ============================================================
 * PHASE 1: EXTRACT COMPANY WEBSITE
 * - Parallel Extract API call
 * - Save to Aurora Core
 * - Anthropic Synthesizer determines deep research queries
 * ============================================================
 */
async function phase1Extract(analysisId, companyUrl, companyName, parallel, claude) {
  let totalCost = 0;

  // Step 1.1: Extract website content using Parallel API
  await updateProgress(analysisId, 'PHASE_1_EXTRACT', 'Calling Parallel Extract API...', 0.2);

  const extractResponse = await parallel.extract([companyUrl], {
    objective: `Extract comprehensive company information from ${companyName}'s website including: products, services, team members, leadership, company history, mission, values, contact information, locations, partners, customers, case studies, and any technology mentions.`,
    fullContent: true,
    excerpts: true,
  });
  totalCost += extractResponse.estimatedCostUSD;

  // Wait for Extract to complete
  await updateProgress(analysisId, 'PHASE_1_EXTRACT', 'Waiting for extraction to complete...', 0.4);
  const extractedContent = await waitForParallelTask(parallel, extractResponse, 'Extract');

  // Step 1.2: Save extracted content to Aurora Core
  await updateProgress(analysisId, 'PHASE_1_EXTRACT', 'Saving to Aurora Core...', 0.6);
  await saveToAuroraCore(analysisId, 'extractedContent', extractedContent, totalCost);

  // Step 1.3: Anthropic Synthesizer - Prepare for deep research
  await updateProgress(analysisId, 'PHASE_1_EXTRACT', 'Synthesizer preparing research queries...', 0.8);

  const synthesisPrompt = `Based on this extracted website content, identify key areas for deep research:

EXTRACTED CONTENT:
${JSON.stringify(extractedContent, null, 2)}

Identify:
1. Key products/services to research
2. Industry and market position to understand
3. Competitors mentioned or implied
4. Technology signals
5. Growth indicators
6. Pain points implied by their messaging

Output a JSON with research priorities.`;

  const researchPriorities = await claude.complete(
    'You are a research strategist preparing for deep company analysis.',
    synthesisPrompt
  );

  await updateProgress(analysisId, 'PHASE_1_EXTRACT', 'Phase 1 complete', 1.0);

  return { extractedContent, researchPriorities, cost: totalCost };
}

/**
 * ============================================================
 * PHASE 2: DEEP COMPANY RESEARCH
 * - Parallel Deep Research API call
 * - Save to Aurora Core
 * - Anthropic Synthesizer creates company profile
 * ============================================================
 */
async function phase2DeepResearch(analysisId, companyUrl, companyName, extractedContent, parallel, claude) {
  let totalCost = 0;

  // Step 2.1: Deep Research API call
  await updateProgress(analysisId, 'PHASE_2_DEEP_RESEARCH', 'Calling Parallel Deep Research API...', 0.2);

  const researchQuery = buildCompanyResearchQuery(companyName, companyUrl);
  const researchResponse = await parallel.deepResearch(researchQuery, {
    processor: 'pro',
    outputFormat: 'json',
  });
  totalCost += researchResponse.estimatedCostUSD;

  // Wait for deep research to complete
  await updateProgress(analysisId, 'PHASE_2_DEEP_RESEARCH', 'Waiting for deep research to complete...', 0.4);
  const companyResearch = await waitForParallelTask(parallel, researchResponse, 'Deep Research');

  // Step 2.2: Save to Aurora Core
  await updateProgress(analysisId, 'PHASE_2_DEEP_RESEARCH', 'Saving research to Aurora Core...', 0.6);
  await saveToAuroraCore(analysisId, 'companyResearch', companyResearch, totalCost);

  // Step 2.3: Anthropic Synthesizer - Create company profile
  await updateProgress(analysisId, 'PHASE_2_DEEP_RESEARCH', 'Synthesizer building company profile...', 0.8);
  const companyProfile = await claude.synthesizeCompanyProfile(extractedContent, companyResearch);

  // Save profile to Aurora Core
  await saveToAuroraCore(analysisId, 'companyProfile', companyProfile);

  await updateProgress(analysisId, 'PHASE_2_DEEP_RESEARCH', 'Phase 2 complete', 1.0);

  return { companyResearch, companyProfile, cost: totalCost };
}

/**
 * ============================================================
 * PHASE 3: COMPETITOR DISCOVERY
 * - Parallel FindAll API for regional competitors
 * - Parallel FindAll API for global competitors
 * - Save to Aurora Core
 * - Anthropic Synthesizer prepares competitor analysis
 * ============================================================
 */
async function phase3CompetitorDiscovery(analysisId, companyName, companyProfile, parallel, claude) {
  let totalCost = 0;
  const industry = companyProfile?.basics?.industry || 'Technology';
  const headquarters = companyProfile?.basics?.headquarters || 'United States';
  const targetCustomers = (companyProfile?.businessModel?.targetCustomers || []).join(', ') || 'businesses';

  // Step 3.1: Find regional competitors
  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Finding regional competitors...', 0.2);

  const regionalQueryConfig = buildRegionalCompetitorQuery(companyName, industry, headquarters, targetCustomers);
  const regionalResponse = await parallel.findAll(
    `Find regional competitors of ${companyName} in the ${industry} industry that operate in ${headquarters} and serve ${targetCustomers}`,
    {
      entityType: 'company',
      matchConditions: regionalQueryConfig.matchConditions,
      matchLimit: regionalQueryConfig.matchLimit || 10,
      generator: 'base',
    }
  );
  totalCost += regionalResponse.estimatedCostUSD;

  // Wait for regional discovery
  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Waiting for regional competitor discovery...', 0.3);
  const regionalCompetitors = await waitForParallelTask(parallel, regionalResponse, 'Regional FindAll');

  // Save to Aurora Core
  await saveToAuroraCore(analysisId, 'regionalCompetitorDiscovery', regionalCompetitors, totalCost);

  // Step 3.2: Find global competitors
  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Finding global competitors...', 0.5);

  const globalQueryConfig = buildGlobalCompetitorQuery(companyName, industry, targetCustomers);
  const globalResponse = await parallel.findAll(
    `Find global industry leaders and competitors of ${companyName} in the ${industry} industry serving ${targetCustomers}`,
    {
      entityType: 'company',
      matchConditions: globalQueryConfig.matchConditions,
      matchLimit: globalQueryConfig.matchLimit || 10,
      generator: 'base',
    }
  );
  totalCost += globalResponse.estimatedCostUSD;

  // Wait for global discovery
  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Waiting for global competitor discovery...', 0.7);
  const globalCompetitors = await waitForParallelTask(parallel, globalResponse, 'Global FindAll');

  // Save to Aurora Core
  await saveToAuroraCore(analysisId, 'globalCompetitorDiscovery', globalCompetitors, totalCost);

  // Step 3.3: Anthropic Synthesizer - Prepare competitor list for analysis
  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Synthesizer compiling competitor list...', 0.9);

  // Combine and deduplicate competitors
  const allCompetitors = [
    ...(regionalCompetitors?.results?.entities || regionalCompetitors?.entities || []),
    ...(globalCompetitors?.results?.entities || globalCompetitors?.entities || []),
  ].filter((c, index, self) =>
    c?.matchStatus === 'match' &&
    index === self.findIndex((t) => t?.name === c?.name)
  );

  await updateProgress(analysisId, 'PHASE_3_COMPETITOR_DISCOVERY', 'Phase 3 complete', 1.0);

  return { regionalCompetitors, globalCompetitors, allCompetitors, cost: totalCost };
}

/**
 * ============================================================
 * PHASE 4: COMPETITOR DEEP ANALYSIS
 * - Parallel Enrich API for all competitors
 * - Parallel Deep Research for top competitors
 * - Save to Aurora Core
 * - Anthropic Synthesizer creates competitive analysis
 * ============================================================
 */
async function phase4CompetitorAnalysis(analysisId, companyProfile, allCompetitors, parallel, claude, config) {
  let totalCost = 0;
  const deepDiveCount = config?.competitorResearch?.deepDiveCount || 3;

  // Step 4.1: Enrich all competitors
  await updateProgress(analysisId, 'PHASE_4_COMPETITOR_ANALYSIS', 'Enriching competitor data...', 0.1);

  let enrichedCompetitors = { results: [] };
  if (allCompetitors.length > 0) {
    const enrichResponse = await parallel.enrich(
      allCompetitors.slice(0, 10).map((c) => ({ name: c.name, url: c.url })),
      COMPETITOR_ENRICHMENT_FIELDS,
      { processor: 'core' }
    );
    totalCost += enrichResponse.estimatedCostUSD;

    await updateProgress(analysisId, 'PHASE_4_COMPETITOR_ANALYSIS', 'Waiting for enrichment...', 0.2);
    enrichedCompetitors = await waitForParallelTask(parallel, enrichResponse, 'Enrich');
  }

  // Save to Aurora Core
  await saveToAuroraCore(analysisId, 'competitorEnrichment', enrichedCompetitors, totalCost);

  // Step 4.2: Deep dive top competitors
  const topCompetitors = (enrichedCompetitors?.results || allCompetitors).slice(0, deepDiveCount);
  const competitorDeepDives = [];

  for (let i = 0; i < topCompetitors.length; i++) {
    const comp = topCompetitors[i];
    const compName = comp?.originalEntity?.name || comp?.name || `Competitor ${i + 1}`;
    const progressPct = 0.3 + (i / deepDiveCount) * 0.4;

    await updateProgress(
      analysisId,
      'PHASE_4_COMPETITOR_ANALYSIS',
      `Deep diving ${compName} (${i + 1}/${deepDiveCount})...`,
      progressPct
    );

    try {
      const deepDiveResponse = await parallel.deepResearch(
        buildCompetitorDeepDiveQuery(compName),
        { processor: 'pro' }
      );
      totalCost += deepDiveResponse.estimatedCostUSD;

      const deepDiveResult = await waitForParallelTask(parallel, deepDiveResponse, `Competitor ${compName}`);
      competitorDeepDives.push({
        competitor: comp?.originalEntity || comp,
        research: deepDiveResult,
      });
    } catch (error) {
      console.log(`[${analysisId}] Failed to deep dive ${compName}: ${error.message}`);
      competitorDeepDives.push({
        competitor: comp?.originalEntity || comp,
        error: error.message,
      });
    }
  }

  // Save to Aurora Core
  await saveToAuroraCore(analysisId, 'competitorDeepDives', competitorDeepDives, totalCost);

  // Step 4.3: Anthropic Synthesizer - Create competitive analysis
  await updateProgress(analysisId, 'PHASE_4_COMPETITOR_ANALYSIS', 'Synthesizer creating competitive analysis...', 0.9);
  const competitiveAnalysis = await claude.analyzeCompetitiveLandscape(
    companyProfile,
    enrichedCompetitors?.results || allCompetitors,
    competitorDeepDives
  );

  // Save to Aurora Core
  await saveToAuroraCore(analysisId, 'competitiveAnalysis', competitiveAnalysis);

  await updateProgress(analysisId, 'PHASE_4_COMPETITOR_ANALYSIS', 'Phase 4 complete', 1.0);

  return { enrichedCompetitors, competitorDeepDives, competitiveAnalysis, cost: totalCost };
}

/**
 * ============================================================
 * PHASE 5: SWOT ANALYSIS & REPORT
 * - Research industry trends
 * - Research competitor tech
 * - Anthropic SWOT Agent
 * - Anthropic Report Architect
 * ============================================================
 */
async function phase5SwotAndReport(analysisId, companyProfile, competitiveAnalysis, competitorDeepDives, parallel, claude, config) {
  let totalCost = 0;
  const industry = companyProfile?.basics?.industry || 'Technology';

  // Step 5.1: Research industry trends
  await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Researching industry AI/automation trends...', 0.1);

  const trendsResponse = await parallel.deepResearch(
    buildIndustryTrendsQuery(industry),
    { processor: 'core' }
  );
  totalCost += trendsResponse.estimatedCostUSD;

  const industryTrends = await waitForParallelTask(parallel, trendsResponse, 'Industry Trends');
  await saveToAuroraCore(analysisId, 'industryTrendsResearch', industryTrends, totalCost);

  // Step 5.2: Research competitor technology
  await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Analyzing competitor technology investments...', 0.3);

  const competitorNames = competitorDeepDives
    .filter((c) => c.competitor?.name)
    .map((c) => c.competitor.name)
    .slice(0, 5);

  const techResponse = await parallel.deepResearch(
    buildCompetitorTechQuery(competitorNames),
    { processor: 'core' }
  );
  totalCost += techResponse.estimatedCostUSD;

  const competitorTech = await waitForParallelTask(parallel, techResponse, 'Competitor Tech');
  await saveToAuroraCore(analysisId, 'competitorTechResearch', competitorTech, totalCost);

  // Step 5.3: Case studies (if full mode)
  let caseStudies = null;
  if (config?.mode === 'full' && config?.industryResearch?.includeCaseStudies) {
    await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Finding relevant case studies...', 0.4);

    const caseStudyResponse = await parallel.deepResearch(
      buildCaseStudyQuery(industry),
      { processor: 'core' }
    );
    totalCost += caseStudyResponse.estimatedCostUSD;

    caseStudies = await waitForParallelTask(parallel, caseStudyResponse, 'Case Studies');
    await saveToAuroraCore(analysisId, 'caseStudyResearch', caseStudies, totalCost);
  }

  // Step 5.4: Anthropic SWOT Agent - Identify opportunities
  await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'SWOT Agent analyzing opportunities...', 0.6);

  const context = {
    companyData: { profile: companyProfile },
    competitorData: competitiveAnalysis,
    industryData: { trends: industryTrends, competitorTech },
    caseStudies,
  };

  const opportunities = await claude.identifyOpportunities(context);
  await saveToAuroraCore(analysisId, 'opportunities', opportunities);

  // Step 5.5: AI Readiness Score (if full mode)
  let aiReadinessScore = null;
  if (config?.mode === 'full' && config?.outputs?.generateScorecard) {
    await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Calculating AI readiness score...', 0.75);
    aiReadinessScore = await claude.scoreAIReadiness(context);
    await saveToAuroraCore(analysisId, 'aiReadinessScore', aiReadinessScore);
  }

  // Step 5.6: Anthropic Report Architect - Generate full report
  await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Report Architect generating final report...', 0.85);

  let fullReport = null;
  if (config?.mode === 'full' && config?.outputs?.generateFullReport) {
    fullReport = await claude.generateFullReport(context, opportunities, aiReadinessScore);
    await saveToAuroraCore(analysisId, 'fullReport', fullReport);
  }

  await updateProgress(analysisId, 'PHASE_5_SWOT_REPORT', 'Phase 5 complete', 1.0);

  return { industryTrends, competitorTech, caseStudies, opportunities, aiReadinessScore, fullReport, cost: totalCost };
}

/**
 * ============================================================
 * PHASE 6: GENERATE TALK TRACKS
 * - Anthropic Synthesizer creates cheat sheet
 * - Generate sales talk tracks from comprehensive report
 * ============================================================
 */
async function phase6TalkTracks(analysisId, companyProfile, opportunities, competitiveAnalysis, claude) {
  // Step 6.1: Generate cheat sheet (sales talk tracks)
  await updateProgress(analysisId, 'PHASE_6_TALK_TRACKS', 'Generating sales cheat sheet...', 0.3);

  const context = {
    companyData: { profile: companyProfile },
    competitorData: competitiveAnalysis,
  };

  const cheatSheet = await claude.generateCheatSheet(context, opportunities);
  await saveToAuroraCore(analysisId, 'cheatSheet', cheatSheet);

  await updateProgress(analysisId, 'PHASE_6_TALK_TRACKS', 'Phase 6 complete', 1.0);

  return { cheatSheet };
}

/**
 * ============================================================
 * MAIN ANALYSIS PROCESSOR
 * Orchestrates the entire assembly line pipeline
 * ============================================================
 */
export async function processRealAnalysis(analysisId) {
  const parallel = getParallelGateway();
  const claude = getClaudeService();

  try {
    // Get analysis record
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { company: true },
    });

    if (!analysis) {
      throw new Error('Analysis not found');
    }

    const config = analysis.config || {
      mode: 'sales',
      competitorResearch: { deepDiveCount: 3 },
      industryResearch: { includeCaseStudies: false },
      outputs: { generateScorecard: false, generateFullReport: false },
    };

    const companyUrl = analysis.company.url;
    const companyName = analysis.company.name;

    // Mark as started
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING', startedAt: new Date(), totalCostUSD: 0 },
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[${analysisId}] Starting Aurora Analysis Pipeline`);
    console.log(`[${analysisId}] Company: ${companyName}`);
    console.log(`[${analysisId}] URL: ${companyUrl}`);
    console.log(`${'='.repeat(60)}\n`);

    // ========== PHASE 1: EXTRACT ==========
    console.log(`\n--- PHASE 1: EXTRACT ---`);
    const phase1Result = await phase1Extract(analysisId, companyUrl, companyName, parallel, claude);

    // ========== PHASE 2: DEEP RESEARCH ==========
    console.log(`\n--- PHASE 2: DEEP RESEARCH ---`);
    const phase2Result = await phase2DeepResearch(
      analysisId,
      companyUrl,
      companyName,
      phase1Result.extractedContent,
      parallel,
      claude
    );

    // ========== PHASE 3: COMPETITOR DISCOVERY ==========
    console.log(`\n--- PHASE 3: COMPETITOR DISCOVERY ---`);
    const phase3Result = await phase3CompetitorDiscovery(
      analysisId,
      companyName,
      phase2Result.companyProfile,
      parallel,
      claude
    );

    // ========== PHASE 4: COMPETITOR ANALYSIS ==========
    console.log(`\n--- PHASE 4: COMPETITOR ANALYSIS ---`);
    const phase4Result = await phase4CompetitorAnalysis(
      analysisId,
      phase2Result.companyProfile,
      phase3Result.allCompetitors,
      parallel,
      claude,
      config
    );

    // ========== PHASE 5: SWOT & REPORT ==========
    console.log(`\n--- PHASE 5: SWOT & REPORT ---`);
    const phase5Result = await phase5SwotAndReport(
      analysisId,
      phase2Result.companyProfile,
      phase4Result.competitiveAnalysis,
      phase4Result.competitorDeepDives,
      parallel,
      claude,
      config
    );

    // ========== PHASE 6: TALK TRACKS ==========
    console.log(`\n--- PHASE 6: TALK TRACKS ---`);
    const phase6Result = await phase6TalkTracks(
      analysisId,
      phase2Result.companyProfile,
      phase5Result.opportunities,
      phase4Result.competitiveAnalysis,
      claude
    );

    // ========== COMPLETE ==========
    const totalCost = phase1Result.cost + phase2Result.cost + phase3Result.cost +
                      phase4Result.cost + phase5Result.cost;

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        currentPhase: 'COMPLETED',
        currentStep: 'Analysis complete',
        completedAt: new Date(),
        totalCostUSD: totalCost,
      },
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[${analysisId}] ANALYSIS COMPLETE`);
    console.log(`[${analysisId}] Total Parallel API Cost: $${totalCost.toFixed(2)}`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n[${analysisId}] PIPELINE FAILED:`, error);

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        currentStep: `Error: ${errorMessage}`,
        errorLog: {
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        },
      },
    });

    throw error;
  }
}

export default processRealAnalysis;
