import { NextResponse } from 'next/server';
import { getClients } from '@/lib/sheets';

// Public health-check endpoint — no auth required.
// Visit /api/health on the live site to diagnose Sheets connectivity.
export async function GET() {
  const checks = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ set' : '✗ MISSING',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
      ? `✓ set (${process.env.GOOGLE_PRIVATE_KEY.length} chars, starts: ${process.env.GOOGLE_PRIVATE_KEY.slice(0, 30).replace(/\n/g, '\\n')})`
      : '✗ MISSING',
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? `✓ ${process.env.GOOGLE_SHEETS_ID}` : '✗ MISSING',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✓ set' : '✗ MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? '✓ set' : '✗ MISSING',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? `✓ ${process.env.ADMIN_EMAIL}` : '✗ MISSING',
  };

  let sheetsTest: string;
  try {
    await getClients();
    sheetsTest = '✓ Google Sheets connection OK';
  } catch (err: unknown) {
    sheetsTest = `✗ ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({ checks, sheetsTest }, { status: 200 });
}
