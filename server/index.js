import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';
import companyRoutes from './routes/company.js';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS - needed in development when using separate Vite dev server
// Also enable for Replit's proxied requests
app.use(cors({
  origin: isProduction ? true : ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
}));

// Health check endpoint (critical for Replit)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/webhooks', webhookRoutes);

// In production: Serve static files from built Vite app
if (isProduction) {
  const distPath = path.join(__dirname, '../dist');

  // Serve static assets
  app.use(express.static(distPath));

  // SPA fallback - all non-API routes serve index.html
  // Express 5 requires named parameter for catch-all routes
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: !isProduction ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aurora server running on port ${PORT}`);
  console.log(`📍 Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  if (isProduction) {
    console.log(`🌐 App: http://localhost:${PORT}`);
  }
});
