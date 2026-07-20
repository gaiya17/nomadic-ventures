import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import supabase from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const { data: admin, error: dbError } = await supabase
      .from('admin_users')
      .select('id, email, name, role, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (dbError || !admin) {
      return Response.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return Response.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const tokenPayload = { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
    
    // Sign JWT using jose for Edge compatibility
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nv_secret_jwt_key_super_secure_2026_xyz_abc_123');
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    // Set secure HTTP-Only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Use lax to allow top-level navigation
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    return Response.json({
      success: true,
      message: 'Login successful.',
      admin: tokenPayload, // Do not send token in body!
    });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
