import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = path.join(__dirname, '../../aurora.log');

/**
 * Simple file logger that writes to both console and file
 */
export function log(...args) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${args.join(' ')}`;

  // Write to console
  console.log(...args);

  // Append to file
  try {
    fs.appendFileSync(LOG_FILE, message + '\n');
  } catch (err) {
    // Ignore file write errors
  }
}

export function logError(...args) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ERROR: ${args.join(' ')}`;

  console.error(...args);

  try {
    fs.appendFileSync(LOG_FILE, message + '\n');
  } catch (err) {
    // Ignore file write errors
  }
}

// Clear log file on startup
try {
  fs.writeFileSync(LOG_FILE, `=== Aurora Log Started ${new Date().toISOString()} ===\n`);
} catch (err) {
  // Ignore
}

export default { log, logError };
