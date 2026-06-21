// src/routes/authRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines the URL routes for authentication.
// Routes are mounted at /api/auth in index.js
//
// Public routes  (no token needed):
//   POST /api/auth/login   → login
//
// Protected routes (token required):
//   GET  /api/auth/me      → get current admin info
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public — anyone can hit this (but wrong credentials will be rejected)
router.post('/login', login);

// Protected — must send valid Bearer token in Authorization header
router.get('/me', protect, getMe);

export default router;
