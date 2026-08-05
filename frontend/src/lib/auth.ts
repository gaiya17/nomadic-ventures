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
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AdminTokenPayload;
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
