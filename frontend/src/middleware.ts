import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nv_secret_jwt_key_super_secure_2026_xyz_abc_123');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // 1. Protect Admin UI pages
  if (pathname.startsWith('/admin-dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err: any) {
      console.log("Middleware JWT Verify Error:", err.message);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // 2. Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    // Exclude public GET requests for tours, resorts, categories
    // Allow public read access to content
    const isPublicGet = request.method === 'GET' && (
      pathname.startsWith('/api/admin/tours') ||
      pathname.startsWith('/api/admin/resorts') ||
      pathname.startsWith('/api/admin/resorts/categories')
    );

    if (!isPublicGet) {
      if (!token) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Missing Token' }, { status: 401 });
      }
      try {
        await jwtVerify(token, JWT_SECRET);
      } catch (err) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Token' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-dashboard',
    '/admin-dashboard/:path*',
    '/api/admin/:path*'
  ]
};
