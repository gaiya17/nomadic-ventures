import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verifies the JWT from the Authorization header.
 * Returns the decoded payload if valid, or null if missing/invalid/expired.
 * Use this inside protected API route handlers.
 */
export function verifyToken(request: NextRequest): AdminTokenPayload | null {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET || 'nv_secret_jwt_key_super_secure_2026_xyz_abc_123';
    const decoded = jwt.verify(token, secret) as AdminTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Returns a 401 JSON response for unauthenticated requests.
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ success: false, error: message }, { status: 401 });
}
