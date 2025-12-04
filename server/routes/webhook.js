import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Webhook secret for verifying requests from Parallel
const PARALLEL_WEBHOOK_SECRET = process.env.PARALLEL_WEBHOOK_SECRET;

/**
 * Parallel API Webhook Handler
 *
 * This endpoint receives progress updates from Parallel API during long-running analyses.
 * Analyses can take hours, so Parallel sends periodic updates via webhook.
 * The frontend polls the database for these updates.
 *
 * Expected payload from Parallel:
 * {
 *   event: 'analysis.progress' | 'analysis.completed' | 'analysis.failed',
 *   runId: string,           // The Parallel run ID
 *   analysisId: string,      // Our internal analysis ID (passed as metadata)
 *   progress: number,        // 0-100
 *   status: string,          // Current step
 *   data?: object,           // Results when completed
 *   error?: string           // Error message when failed
 * }
 */
router.post('/parallel', async (req, res) => {
  try {
    // Verify webhook signature (optional but recommended)
    const signature = req.headers['x-parallel-signature'];
    if (PARALLEL_WEBHOOK_SECRET && signature) {
      // TODO: Implement HMAC signature verification
      // const expectedSig = crypto.createHmac('sha256', PARALLEL_WEBHOOK_SECRET)
      //   .update(JSON.stringify(req.body))
      //   .digest('hex');
      // if (signature !== expectedSig) {
      //   return res.status(401).json({ error: 'Invalid signature' });
      // }
    }

    const { event, analysisId, progress, status, data, error } = req.body;

    console.log(`[Webhook] Received ${event} for analysis ${analysisId}`);

    if (!analysisId) {
      return res.status(400).json({ error: 'Missing analysisId' });
    }

    // Find the analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis) {
      console.error(`[Webhook] Analysis ${analysisId} not found`);
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Handle different event types
    switch (event) {
      case 'analysis.progress':
        // Map Parallel status to our internal status
        const statusMap = {
          'extracting_website': 'EXTRACTING_WEBSITE',
          'researching_company': 'RESEARCHING_COMPANY',
          'synthesizing_profile': 'SYNTHESIZING_PROFILE',
          'discovering_competitors': 'DISCOVERING_COMPETITORS',
          'analyzing_competition': 'ANALYZING_COMPETITION',
          'mapping_opportunities': 'MAPPING_OPPORTUNITIES',
          'generating_outputs': 'GENERATING_OUTPUTS',
        };

        await prisma.analysis.update({
          where: { id: analysisId },
          data: {
            status: statusMap[status] || status?.toUpperCase() || 'PROCESSING',
            progress: progress || analysis.progress,
            currentStep: status,
            updatedAt: new Date(),
          },
        });
        break;

      case 'analysis.completed':
        await prisma.analysis.update({
          where: { id: analysisId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            completedAt: new Date(),
            companyProfile: data?.companyProfile || {},
            cheatSheet: data?.cheatSheet || {},
            opportunities: data?.opportunities || {},
            // Store raw results for debugging
            config: {
              ...analysis.config,
              parallelResults: data,
            },
          },
        });
        console.log(`[Webhook] Analysis ${analysisId} completed successfully`);
        break;

      case 'analysis.failed':
        await prisma.analysis.update({
          where: { id: analysisId },
          data: {
            status: 'FAILED',
            errorLog: {
              message: error || 'Analysis failed',
              timestamp: new Date().toISOString(),
              source: 'parallel_webhook',
            },
          },
        });
        console.error(`[Webhook] Analysis ${analysisId} failed: ${error}`);
        break;

      default:
        console.warn(`[Webhook] Unknown event type: ${event}`);
    }

    // Always respond 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error processing webhook:', err);
    // Still return 200 to prevent retries for processing errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});

/**
 * Stripe Webhook Handler (for subscription updates)
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  // TODO: Implement Stripe webhook handling for subscription events
  console.log('[Webhook] Stripe webhook received');
  res.status(200).json({ received: true });
});

export default router;
