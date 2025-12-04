import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';
import { processRealAnalysis } from '../lib/jobs/worker.js';

const router = express.Router();
const prisma = new PrismaClient();

// API configuration
const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Use real analysis only when BOTH APIs are configured and mock is not forced
const USE_MOCK_ANALYSIS = process.env.USE_MOCK_ANALYSIS === 'true' || !PARALLEL_API_KEY || !ANTHROPIC_API_KEY;

// Log which mode we're using on startup
console.log(`[Analysis] Mode: ${USE_MOCK_ANALYSIS ? 'MOCK' : 'REAL'}`);
if (!PARALLEL_API_KEY) console.log('[Analysis] Missing PARALLEL_API_KEY - using mock mode');
if (!ANTHROPIC_API_KEY) console.log('[Analysis] Missing ANTHROPIC_API_KEY - using mock mode');

// Create analysis
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url, mode } = req.body;
    const userId = req.user.userId;

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract domain from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, '');

    // Create or find company
    let company = await prisma.company.findFirst({
      where: {
        domain,
        teamId: user.teamId,
      },
    });

    if (!company) {
      const companyName = domain
        .split('.')[0]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      company = await prisma.company.create({
        data: {
          name: companyName,
          domain,
          url,
          teamId: user.teamId,
        },
      });
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        status: 'PENDING',
        mode: mode === 'sales' ? 'SALES' : 'FULL',
        config: {
          mode,
          competitorResearch: { deepDiveCount: mode === 'full' ? 5 : 3 },
        },
        companyId: company.id,
        userId: user.id,
        teamId: user.teamId,
        startedAt: new Date(),
      },
      include: {
        company: true,
      },
    });

    // Start analysis processing (synchronous for Replit compatibility)
    processAnalysis(analysis.id).catch(err => {
      console.error('Analysis processing failed:', err);
    });

    res.json({
      id: analysis.id,
      status: analysis.status,
      company: {
        id: company.id,
        name: company.name,
        domain: company.domain,
      },
    });
  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({ error: 'Failed to create analysis' });
  }
});

// Get analysis by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        teamId: user.teamId,
      },
      include: {
        company: true,
      },
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

// List analyses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, status = 'all' } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const where = { teamId: user.teamId };

    if (status !== 'all') {
      if (status === 'pending') {
        where.status = { notIn: ['COMPLETED', 'FAILED', 'CANCELLED'] };
      } else if (status === 'completed') {
        where.status = 'COMPLETED';
      } else if (status === 'failed') {
        where.status = { in: ['FAILED', 'CANCELLED'] };
      }
    }

    const analyses = await prisma.analysis.findMany({
      where,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json({ items: analyses });
  } catch (error) {
    console.error('List analyses error:', error);
    res.status(500).json({ error: 'Failed to list analyses' });
  }
});

/**
 * Start analysis processing
 *
 * Two modes:
 * 1. REAL: Uses Parallel API (data gathering) + Anthropic Claude (AI synthesis)
 *    - Full 4-phase pipeline with real API calls
 *    - Progress updates saved to database
 *    - Frontend polls every 5 seconds
 *
 * 2. MOCK: Simulated analysis for testing
 *    - Progresses through phases with delays
 *    - Returns sample data
 *
 * Flow:
 * 1. User submits URL -> Creates analysis record
 * 2. processAnalysis runs (real or mock)
 * 3. Database updated with status/progress
 * 4. Frontend polls GET /api/analysis/:id to show progress
 */
async function processAnalysis(analysisId) {
  try {
    // Get analysis with company info
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { company: true },
    });

    if (!analysis) {
      throw new Error('Analysis not found');
    }

    // Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'EXTRACTING_WEBSITE',
        progress: 5,
      },
    });

    // Use mock analysis if APIs are not configured
    if (USE_MOCK_ANALYSIS) {
      console.log(`[Analysis] Using MOCK analysis for ${analysisId}`);
      await runMockAnalysis(analysisId, analysis);
      return;
    }

    // Run REAL analysis with Parallel API + Anthropic Claude
    console.log(`[Analysis] Starting REAL analysis for ${analysisId}`);
    console.log(`[Analysis] Company: ${analysis.company.name} (${analysis.company.url})`);

    await processRealAnalysis(analysisId);

  } catch (error) {
    console.error(`[Analysis] ${analysisId} failed:`, error);
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        errorLog: {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }
}

/**
 * Mock analysis for testing without Parallel API
 * Simulates the analysis process with realistic timing
 */
async function runMockAnalysis(analysisId, analysis) {
  try {
    const steps = [
      { status: 'EXTRACTING_WEBSITE', progress: 10, delay: 3000 },
      { status: 'RESEARCHING_COMPANY', progress: 25, delay: 4000 },
      { status: 'SYNTHESIZING_PROFILE', progress: 45, delay: 5000 },
      { status: 'DISCOVERING_COMPETITORS', progress: 60, delay: 4000 },
      { status: 'ANALYZING_COMPETITION', progress: 75, delay: 5000 },
      { status: 'MAPPING_OPPORTUNITIES', progress: 85, delay: 3000 },
      { status: 'GENERATING_OUTPUTS', progress: 95, delay: 3000 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: step.status,
          progress: step.progress,
          currentStep: step.status,
        },
      });
    }

    // Mark as complete with mock results
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        companyProfile: {
          basics: {
            name: analysis.company.name,
            domain: analysis.company.domain,
            industry: 'Technology',
            employeeRange: '50-200',
            headquarters: 'San Francisco, CA',
            description: `${analysis.company.name} is a technology company focused on innovative solutions.`,
          },
          technologySignals: {
            techMaturity: 'Growth Stage',
            currentTechStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          },
          painPointIndicators: [
            { signal: 'Manual data entry processes', source: 'Website analysis', confidence: 'high' },
            { signal: 'Legacy system integration needs', source: 'Job postings', confidence: 'medium' },
          ],
        },
        cheatSheet: {
          summary: `${analysis.company.name} is showing strong signals for digital transformation initiatives, with particular interest in automation and process optimization.`,
          keyOpportunities: [
            'AI-powered automation to reduce manual data entry by 60%',
            'Modern API integration to replace legacy system connections',
            'Cloud migration to improve scalability and reduce costs',
          ],
          talkingPoints: [
            'Recent job postings indicate expansion in engineering team',
            'Website mentions commitment to innovation and efficiency',
            'Industry trends suggest high ROI for automation investments',
          ],
          objectionHandlers: [
            {
              objection: "We've tried automation before and it didn't work",
              response: 'Modern AI-powered solutions are significantly more capable than rule-based systems. Our approach includes thorough workflow analysis to ensure proper fit.',
            },
            {
              objection: "We don't have the budget right now",
              response: 'Most clients see ROI within 6 months through reduced manual processing time. We can start with a small pilot to demonstrate value before full rollout.',
            },
          ],
        },
        opportunities: {
          opportunities: [
            {
              rank: 1,
              title: 'Workflow Automation Platform',
              category: 'Efficiency',
              problem: { description: 'Manual data processing consuming 40+ hours per week across teams' },
              evidenceStrength: { score: 4 },
            },
            {
              rank: 2,
              title: 'API Integration Suite',
              category: 'Integration',
              problem: { description: 'Disconnected systems requiring duplicate data entry' },
              evidenceStrength: { score: 3 },
            },
            {
              rank: 3,
              title: 'Cloud Infrastructure Modernization',
              category: 'Infrastructure',
              problem: { description: 'On-premise systems limiting scalability and remote work' },
              evidenceStrength: { score: 3 },
            },
          ],
        },
        competitors: [],
      },
    });

    console.log(`[Mock Analysis] ${analysisId} completed`);
  } catch (error) {
    console.error(`[Mock Analysis] ${analysisId} failed:`, error);
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        errorLog: {
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }
}

export default router;
