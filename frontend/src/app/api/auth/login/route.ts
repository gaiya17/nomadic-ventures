import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import supabase from '@/lib/supabase';
import { cookies } from 'next/headers';
import { checkRateLimit, resetRateLimit, getClientIdentifier } from '@/lib/rateLimit';

// A real bcrypt hash with no matching plaintext password, compared against
// whenever the email lookup fails. This keeps response time the same whether
// or not the email exists — without it, "no such user" returns instantly
// while a real user with a wrong password waits for a bcrypt comparison,
// letting an attacker enumerate valid admin emails purely by timing.
const DUMMY_HASH = '$2b$10$wo7mnsPWaBD6//MnORwmY.lhTG2rUqivLo/Vwp0IWy8gDUI2RMLKa';

export async function POST(request: Request) {
  try {
    const identifier = getClientIdentifier(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(identifier);
    if (!allowed) {
      return Response.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, email, name, role, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    const isPasswordValid = await bcrypt.compare(password, admin?.password_hash || DUMMY_HASH);

    if (!admin || !isPasswordValid) {
      return Response.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const tokenPayload = { id: admin.id, email: admin.email, name: admin.name, role: admin.role };

    // Sign JWT using jose for Edge compatibility
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
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

    resetRateLimit(identifier);

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
