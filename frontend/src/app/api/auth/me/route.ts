import { NextRequest } from 'next/server';
import { verifyToken, unauthorizedResponse } from '@/lib/auth';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const admin = verifyToken(request);
  if (!admin) return unauthorizedResponse('Access denied. No token provided.');

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, created_at, last_login')
      .eq('id', admin.id)
      .single();

    if (error || !data) {
      return Response.json({ success: false, error: 'Admin not found.' }, { status: 404 });
    }

    return Response.json({ success: true, user: data });
  } catch (err) {
    console.error('getMe error:', err);
    return Response.json({ success: false, error: 'Server error.' }, { status: 500 });
  }
}
