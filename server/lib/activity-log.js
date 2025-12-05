import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();

// Global event emitter for SSE connections
export const activityEmitter = new EventEmitter();
activityEmitter.setMaxListeners(100); // Allow many concurrent connections

/**
 * Sanitize internal log messages for public display
 * Removes technical details, API names, task IDs, etc.
 */
function sanitizeMessage(message, phase) {
  // Remove analysis ID prefix
  let clean = message.replace(/\[[\w-]+\]\s*/g, '');

  // Remove percentage prefix if present
  clean = clean.replace(/^\d+%\s*-\s*/, '');

  // Sanitize Parallel API references
  clean = clean.replace(/\[Parallel\]\s*/gi, '');
  clean = clean.replace(/Parallel\s+(Extract|Deep Research|FindAll|Enrich)\s+API/gi, 'research system');
  clean = clean.replace(/Calling Parallel\s+\w+\s+API/gi, 'Initiating research');

  // Sanitize task IDs and technical identifiers
  clean = clean.replace(/task ID:\s*[\w-]+/gi, '');
  clean = clean.replace(/\(isFindAll:\s*\w+\)/gi, '');
  clean = clean.replace(/trun_[\w]+/g, '');
  clean = clean.replace(/findall_[\w]+/g, '');

  // Make polling messages user-friendly
  clean = clean.replace(/Deep Research poll #(\d+)\s*\((\d+)min\):\s*status=(\w+)/gi,
    'Research poll #$1 ($2 min): $3');
  clean = clean.replace(/FindAll poll #(\d+)/gi, 'Discovery poll #$1');
  clean = clean.replace(/status=queued/gi, 'queued');
  clean = clean.replace(/status=running/gi, 'running');
  clean = clean.replace(/status=completed/gi, 'complete');

  // Sanitize enrichment references
  clean = clean.replace(/is_active=\w+,?\s*/gi, '');
  clean = clean.replace(/enrichments_active=\w+,?\s*/gi, '');
  clean = clean.replace(/matches=(\d+)/gi, '$1 matches found');

  // Make phase labels more user-friendly
  clean = clean.replace(/PHASE_\d+_\w+/gi, '');
  clean = clean.replace(/Aurora Core/gi, 'database');
  clean = clean.replace(/Anthropic Synthesizer/gi, 'AI synthesis');

  // Clean up extra whitespace
  clean = clean.replace(/\s+/g, ' ').trim();

  // Add phase context if missing
  if (phase && !clean.toLowerCase().includes('phase')) {
    const phaseLabels = {
      'PHASE_1_EXTRACT': 'Phase 1',
      'PHASE_2_DEEP_RESEARCH': 'Phase 2',
      'PHASE_3_COMPETITOR_DISCOVERY': 'Phase 3',
      'PHASE_4_COMPETITOR_ANALYSIS': 'Phase 4',
      'PHASE_5_SWOT_REPORT': 'Phase 5',
      'PHASE_6_TALK_TRACKS': 'Phase 6',
    };
    const label = phaseLabels[phase] || '';
    if (label && clean.length > 0) {
      clean = `${label}: ${clean}`;
    }
  }

  return clean;
}

/**
 * Log an activity event for an analysis
 * Stores in database and emits for SSE
 */
export async function logActivity(analysisId, message, options = {}) {
  const { phase = null, type = 'info', raw = false } = options;

  const timestamp = new Date().toISOString();
  const displayMessage = raw ? message : sanitizeMessage(message, phase);

  // Skip empty messages
  if (!displayMessage || displayMessage.trim().length === 0) {
    return;
  }

  const logEntry = {
    timestamp,
    message: displayMessage,
    type, // 'info', 'success', 'warning', 'error', 'milestone'
    phase,
  };

  try {
    // Append to database activity log
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { activityLog: true },
    });

    const currentLog = Array.isArray(analysis?.activityLog) ? analysis.activityLog : [];

    // Keep last 200 entries to prevent unbounded growth
    const updatedLog = [...currentLog, logEntry].slice(-200);

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { activityLog: updatedLog },
    });

    // Emit for SSE subscribers
    activityEmitter.emit(`activity:${analysisId}`, logEntry);

  } catch (error) {
    // Don't let logging errors break the pipeline
    console.error(`[Activity Log] Failed to log for ${analysisId}:`, error.message);
  }
}

/**
 * Log a milestone event (more prominent in UI)
 */
export async function logMilestone(analysisId, message, phase = null) {
  await logActivity(analysisId, message, { phase, type: 'milestone', raw: true });
}

/**
 * Log a success event
 */
export async function logSuccess(analysisId, message, phase = null) {
  await logActivity(analysisId, message, { phase, type: 'success', raw: true });
}

/**
 * Log a warning event
 */
export async function logWarning(analysisId, message, phase = null) {
  await logActivity(analysisId, message, { phase, type: 'warning', raw: true });
}

/**
 * Log an error event
 */
export async function logError(analysisId, message, phase = null) {
  await logActivity(analysisId, message, { phase, type: 'error', raw: true });
}

/**
 * Get activity log for an analysis
 */
export async function getActivityLog(analysisId) {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    select: { activityLog: true },
  });

  return Array.isArray(analysis?.activityLog) ? analysis.activityLog : [];
}

export default {
  logActivity,
  logMilestone,
  logSuccess,
  logWarning,
  logError,
  getActivityLog,
  activityEmitter,
};
