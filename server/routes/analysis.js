import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

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

// Analysis processing function (runs synchronously)
async function processAnalysis(analysisId) {
  try {
    // Update status to processing
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'EXTRACTING_WEBSITE',
        progress: 10,
      },
    });

    // Get analysis with company info
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { company: true },
    });

    if (!analysis) {
      throw new Error('Analysis not found');
    }

    // TODO: Implement actual analysis logic
    // For now, simulate progress
    const steps = [
      { status: 'RESEARCHING_COMPANY', progress: 20 },
      { status: 'SYNTHESIZING_PROFILE', progress: 40 },
      { status: 'DISCOVERING_COMPETITORS', progress: 60 },
      { status: 'ANALYZING_COMPETITION', progress: 80 },
      { status: 'GENERATING_OUTPUTS', progress: 90 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: step.status,
          progress: step.progress,
          currentStep: step.status,
        },
      });
    }

    // Mark as complete
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        // Add mock results for now
        companyProfile: {
          basics: {
            name: analysis.company.name,
            domain: analysis.company.domain,
            industry: 'Technology',
            description: 'Company analysis completed',
          },
        },
        cheatSheet: {
          summary: `Analysis completed for ${analysis.company.name}`,
          keyOpportunities: [
            'AI/Automation integration opportunities',
            'Process optimization potential',
            'Digital transformation readiness',
          ],
        },
      },
    });

    console.log(`Analysis ${analysisId} completed`);
  } catch (error) {
    console.error(`Analysis ${analysisId} failed:`, error);
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
