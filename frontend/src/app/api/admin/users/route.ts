import supabase from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { verifyToken, unauthorizedResponse } from '@/lib/auth';

// GET /api/admin/users — list all admin users (protected)
export async function GET(request: NextRequest) {
  const admin = verifyToken(request);
  if (!admin) return unauthorizedResponse();

  try {
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Response.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
