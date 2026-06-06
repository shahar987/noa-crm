import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const expectedEmail = (process.env.ADMIN_EMAIL ?? '').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD ?? '').trim();

  if (
    email?.trim() !== expectedEmail ||
    password?.trim() !== expectedPassword
  ) {
    return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
  }

  const token = await new SignJWT({ email: email.trim() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('noa_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
