// src/index.js
// ─────────────────────────────────────────────────────────────────────────────
// Main entry point for the Express server.
// Sets up middleware, mounts routes, and starts listening.
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env file FIRST — before any other imports that need env vars
dotenv.config();

import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
// 1. CORS — allow requests from our Next.js frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));

// 2. JSON body parser — so we can read req.body
app.use(express.json());

// 3. URL-encoded body parser — for form submissions
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
// Health check — useful for Docker/deployment to verify server is alive
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: '🚀 Nomadic Ventures API is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes — mounted at /api/auth
// So: POST /api/auth/login, GET /api/auth/me, etc.
app.use('/api/auth', authRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
// This catches any request that didn't match any route above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Catches any uncaught errors thrown inside route handlers
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Login endpoint: POST http://localhost:${PORT}/api/auth/login\n`);
});
