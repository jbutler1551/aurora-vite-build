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
 * Extract domain from URL
 */
function extractDomain(url) {
  if (!url) return 'unknown.com';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Update analysis status in database
 */
async function updateStatus(analysisId, status, progress, currentStep = null) {
  console.log(`[${analysisId}] ${progress}% - ${status}${currentStep ? `: ${currentStep}` : ''}`);

  await prisma.analysis.update({
    where: { id: analysisId },
    data: {
      status,
      progress,
      currentStep: currentStep || status,
      updatedAt: new Date(),
    },
  });
}

/**
 * Main analysis processor
 * This is the complete 4-phase pipeline that orchestrates Parallel API and Claude
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

    let totalCost = 0;

    // ========== PHASE 1: Company Deep Dive ==========

    // Step 1.1: Extract website
    await updateStatus(analysisId, 'EXTRACTING_WEBSITE', 5, 'Extracting website content...');

    const extractResponse = await parallel.extract([analysis.company.url], {
      objective: 'Extract all company information, products, services, team, and contact details',
      fullContent: true,
    });
    totalCost += extractResponse.estimatedCostUSD;

    const extractedContent = extractResponse.data;

    // Step 1.2: Deep research
    await updateStatus(analysisId, 'RESEARCHING_COMPANY', 10, 'Researching company web presence...');

    const companyResearchQuery = buildCompanyResearchQuery(
      analysis.company.name,
      analysis.company.url
    );

    const researchResponse = await parallel.deepResearch(companyResearchQuery, {
      processor: 'pro',
    });
    totalCost += researchResponse.estimatedCostUSD;

    // Wait for research to complete if async
    let companyResearch = researchResponse.data;
    if (researchResponse.data.status !== 'completed' && researchResponse.data.runId) {
      companyResearch = await parallel.waitForTask(researchResponse.data.runId);
    }

    // Step 1.3: Synthesize profile
    await updateStatus(analysisId, 'SYNTHESIZING_PROFILE', 20, 'Building company profile...');

    const companyProfile = await claude.synthesizeCompanyProfile(
      extractedContent,
      companyResearch
    );

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { companyProfile: toJson(companyProfile) },
    });

    // Update company record with profile data
    await prisma.company.update({
      where: { id: analysis.company.id },
      data: {
        industry: companyProfile.basics?.industry,
        description: companyProfile.basics?.description,
      },
    });

    // ========== PHASE 2: Competitive Landscape ==========

    // Step 2.1: Discover regional competitors
    await updateStatus(analysisId, 'DISCOVERING_COMPETITORS', 30, 'Finding regional competitors...');

    const regionalQuery = buildRegionalCompetitorQuery(
      analysis.company.name,
      companyProfile.basics?.industry || 'Technology',
      companyProfile.basics?.headquarters || 'United States',
      (companyProfile.businessModel?.targetCustomers || []).join(', ') || 'businesses'
    );

    const regionalResponse = await parallel.findAll(
      `Find regional competitors of ${analysis.company.name}`,
      regionalQuery
    );
    totalCost += regionalResponse.estimatedCostUSD;

    let regionalCompetitors = regionalResponse.data;
    if (regionalResponse.data.status !== 'completed' && regionalResponse.data.findallId) {
      regionalCompetitors = await parallel.waitForTask(regionalResponse.data.findallId);
    }

    // Step 2.2: Discover global competitors
    await updateStatus(analysisId, 'DISCOVERING_COMPETITORS', 40, 'Finding global competitors...');

    const globalQuery = buildGlobalCompetitorQuery(
      analysis.company.name,
      companyProfile.basics?.industry || 'Technology',
      (companyProfile.businessModel?.targetCustomers || []).join(', ') || 'businesses'
    );

    const globalResponse = await parallel.findAll(
      `Find global competitors of ${analysis.company.name}`,
      globalQuery
    );
    totalCost += globalResponse.estimatedCostUSD;

    let globalCompetitors = globalResponse.data;
    if (globalResponse.data.status !== 'completed' && globalResponse.data.findallId) {
      globalCompetitors = await parallel.waitForTask(globalResponse.data.findallId);
    }

    // Step 2.3: Enrich competitors
    await updateStatus(analysisId, 'ANALYZING_COMPETITION', 50, 'Enriching competitor data...');

    const allCompetitorEntities = [
      ...(regionalCompetitors.results?.entities || []),
      ...(globalCompetitors.results?.entities || []),
    ].filter((c) => c.matchStatus === 'match');

    let enrichedCompetitors = { results: [] };

    if (allCompetitorEntities.length > 0) {
      const enrichResponse = await parallel.enrich(
        allCompetitorEntities.map((c) => ({ name: c.name, url: c.url })),
        COMPETITOR_ENRICHMENT_FIELDS,
        { processor: 'core' }
      );
      totalCost += enrichResponse.estimatedCostUSD;

      enrichedCompetitors = enrichResponse.data.status === 'completed'
        ? enrichResponse.data
        : await parallel.waitForTask(enrichResponse.data.runId);
    }

    // Step 2.4: Deep dive top competitors
    const deepDiveCount = config.competitorResearch?.deepDiveCount || 3;
    const competitorDeepDives = [];
    const topCompetitors = (enrichedCompetitors.results || []).slice(0, deepDiveCount);

    for (let i = 0; i < topCompetitors.length; i++) {
      const comp = topCompetitors[i];
      const progressPct = 55 + (i / deepDiveCount) * 10;
      await updateStatus(
        analysisId,
        'ANALYZING_COMPETITION',
        progressPct,
        `Deep diving competitor ${i + 1}/${deepDiveCount}: ${comp.originalEntity?.name || 'Unknown'}...`
      );

      const deepDiveResponse = await parallel.deepResearch(
        buildCompetitorDeepDiveQuery(comp.originalEntity?.name || 'competitor'),
        { processor: 'pro' }
      );
      totalCost += deepDiveResponse.estimatedCostUSD;

      const deepDiveResult = deepDiveResponse.data.status === 'completed'
        ? deepDiveResponse.data
        : await parallel.waitForTask(deepDiveResponse.data.runId);

      competitorDeepDives.push({
        competitor: comp.originalEntity,
        research: deepDiveResult,
      });
    }

    // Step 2.5: Synthesize competitive analysis
    await updateStatus(analysisId, 'ANALYZING_COMPETITION', 70, 'Analyzing competitive position...');

    const competitiveAnalysis = await claude.analyzeCompetitiveLandscape(
      companyProfile,
      enrichedCompetitors.results || [],
      competitorDeepDives
    );

    // ========== PHASE 3: Opportunity Mapping ==========

    // Step 3.1: Research industry trends
    await updateStatus(analysisId, 'MAPPING_OPPORTUNITIES', 75, 'Researching industry AI/automation trends...');

    const industryTrendsResponse = await parallel.deepResearch(
      buildIndustryTrendsQuery(companyProfile.basics?.industry || 'Technology'),
      { processor: 'core' }
    );
    totalCost += industryTrendsResponse.estimatedCostUSD;

    const industryTrends = industryTrendsResponse.data.status === 'completed'
      ? industryTrendsResponse.data
      : await parallel.waitForTask(industryTrendsResponse.data.runId);

    // Step 3.2: Research competitor tech
    await updateStatus(analysisId, 'MAPPING_OPPORTUNITIES', 80, 'Analyzing competitor technology investments...');

    const competitorNames = topCompetitors.map((c) => c.originalEntity?.name || 'Unknown');
    const competitorTechResponse = await parallel.deepResearch(
      buildCompetitorTechQuery(competitorNames),
      { processor: 'core' }
    );
    totalCost += competitorTechResponse.estimatedCostUSD;

    const competitorTech = competitorTechResponse.data.status === 'completed'
      ? competitorTechResponse.data
      : await parallel.waitForTask(competitorTechResponse.data.runId);

    // Step 3.3: Research case studies (full mode only)
    let caseStudies = null;
    if (config.mode === 'full' && config.industryResearch?.includeCaseStudies) {
      await updateStatus(analysisId, 'MAPPING_OPPORTUNITIES', 82, 'Finding relevant case studies...');

      const caseStudyResponse = await parallel.deepResearch(
        buildCaseStudyQuery(companyProfile.basics?.industry || 'Technology'),
        { processor: 'core' }
      );
      totalCost += caseStudyResponse.estimatedCostUSD;

      caseStudies = caseStudyResponse.data.status === 'completed'
        ? caseStudyResponse.data
        : await parallel.waitForTask(caseStudyResponse.data.runId);
    }

    // Step 3.4: Identify opportunities
    await updateStatus(analysisId, 'MAPPING_OPPORTUNITIES', 85, 'Identifying opportunities...');

    const opportunities = await claude.identifyOpportunities({
      companyData: { profile: companyProfile, research: companyResearch },
      competitorData: enrichedCompetitors.results || [],
      industryData: { trends: industryTrends, competitorTech },
      caseStudies,
    });

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { opportunities: toJson(opportunities) },
    });

    // Step 3.5: Score AI readiness (full mode only)
    let aiReadinessScore = null;
    if (config.mode === 'full' && config.outputs?.generateScorecard) {
      await updateStatus(analysisId, 'MAPPING_OPPORTUNITIES', 88, 'Calculating AI readiness score...');

      aiReadinessScore = await claude.scoreAIReadiness({
        companyData: { profile: companyProfile, research: companyResearch },
        competitorData: enrichedCompetitors.results || [],
        industryData: { trends: industryTrends, competitorTech },
        caseStudies,
      });
    }

    // ========== PHASE 4: Generate Outputs ==========

    // Step 4.1: Generate cheat sheet
    await updateStatus(analysisId, 'GENERATING_OUTPUTS', 90, 'Generating cheat sheet...');

    const cheatSheet = await claude.generateCheatSheet(
      {
        companyData: { profile: companyProfile, research: companyResearch },
        competitorData: enrichedCompetitors.results || [],
        industryData: { trends: industryTrends, competitorTech },
        caseStudies,
      },
      opportunities
    );

    // Step 4.2: Generate full report (full mode only)
    let fullReport = null;
    if (config.mode === 'full' && config.outputs?.generateFullReport) {
      await updateStatus(analysisId, 'GENERATING_OUTPUTS', 95, 'Generating full report...');

      fullReport = await claude.generateFullReport(
        {
          companyData: { profile: companyProfile, research: companyResearch },
          competitorData: enrichedCompetitors.results || [],
          industryData: { trends: industryTrends, competitorTech },
          caseStudies,
        },
        opportunities,
        aiReadinessScore
      );
    }

    // ========== COMPLETE ==========

    const completedAt = new Date();
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt,
        companyProfile: toJson(companyProfile),
        cheatSheet: toJson(cheatSheet),
        opportunities: toJson(opportunities),
        competitors: toJson(enrichedCompetitors.results || []),
        config: toJson({
          ...config,
          totalCostUSD: totalCost,
          competitorDeepDives: competitorDeepDives.length,
        }),
      },
    });

    console.log(`[${analysisId}] COMPLETED - Total cost: $${totalCost.toFixed(2)}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${analysisId}] FAILED:`, error);

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
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
