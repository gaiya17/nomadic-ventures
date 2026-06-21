// src/middleware/authMiddleware.js
// ─────────────────────────────────────────────────────────────────────────────
// This runs BEFORE protected route handlers.
// It checks the Authorization header for a valid JWT token.
//
// How it works:
//   1. Client sends: Authorization: Bearer <token>
//   2. We extract the token from the header
//   3. We verify it using our JWT_SECRET
//   4. If valid → attach decoded admin info to req.admin → call next()
//   5. If invalid/expired → return 401 Unauthorized
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check it exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.',
    });
  }

  // 3. Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify token — this also checks expiry automatically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach admin data to request so route handlers can use it
    // decoded contains: { id, email, role, iat, exp }
    req.admin = decoded;

    // 6. Pass control to the next middleware / route handler
    next();
  } catch (err) {
    // Token is invalid OR expired
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token expired. Please log in again.'
        : 'Invalid token.';

    return res.status(401).json({ success: false, error: message });
  }
};
