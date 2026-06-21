// src/controllers/authController.js
// ─────────────────────────────────────────────────────────────────────────────
// Contains the business logic for authentication:
//   - login()  → verify credentials → return JWT token
//   - getMe()  → return current logged-in admin's info (protected)
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Step 1: Validate input ─────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    // ── Step 2: Find admin in database by email ────────────────────────────
    const { data: admin, error: dbError } = await supabase
      .from('admin_users')
      .select('id, email, name, role, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single(); // expects exactly 1 row

    // IMPORTANT: Don't reveal whether email exists or not
    // Always return same generic message for security
    if (dbError || !admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // ── Step 3: Compare password with stored hash ──────────────────────────
    // bcrypt.compare() hashes the input and compares with stored hash
    // This is safe — we never store plain text passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // ── Step 4: Create JWT token ───────────────────────────────────────────
    // The token payload contains non-sensitive info we want to access quickly
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // ── Step 5: Update last_login timestamp ───────────────────────────────
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // ── Step 6: Respond with token + user info ─────────────────────────────
    // NEVER include password_hash in the response!
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

// ── GET ME (Protected) ────────────────────────────────────────────────────────
// GET /api/auth/me
// Requires: Authorization: Bearer <token>
// Returns the currently logged-in admin's info
export const getMe = async (req, res) => {
  try {
    // req.admin is set by the protect middleware
    const { id } = req.admin;

    // Fetch fresh data from DB (in case name/role changed)
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, created_at, last_login')
      .eq('id', id)
      .single();

    if (error || !admin) {
      return res.status(404).json({ success: false, error: 'Admin not found.' });
    }

    return res.status(200).json({ success: true, user: admin });
  } catch (err) {
    console.error('❌ getMe error:', err);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};
