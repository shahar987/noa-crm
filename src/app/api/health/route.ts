import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getClients } from '@/lib/sheets';

// Public health-check endpoint — no auth required.
// Visit /api/health on the live site to diagnose Sheets connectivity.
export async function GET() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? '';

  const processedKey = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  let createPrivateKeyResult = 'not tested';
  try {
    crypto.createPrivateKey(processedKey);
    createPrivateKeyResult = '✓ OK';
  } catch (e: unknown) {
    createPrivateKeyResult = `✗ ${e instanceof Error ? e.message : String(e)}`;
  }

  const checks = {
    node_version: process.version,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ set' : '✗ MISSING',
    GOOGLE_PRIVATE_KEY_raw: rawKey
      ? `${rawKey.length} chars | starts: "${rawKey.slice(0, 40).replace(/\n/g, '↵').replace(/\r/g, '⏎')}"`
      : '✗ MISSING',
    GOOGLE_PRIVATE_KEY_processed: processedKey
      ? `${processedKey.length} chars | lines: ${processedKey.split('\n').length} | starts: "${processedKey.slice(0, 40).replace(/\n/g, '↵').replace(/\r/g, '⏎')}"`
      : '✗ MISSING',
    GOOGLE_PRIVATE_KEY_parseTest: createPrivateKeyResult,
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? `✓ ${process.env.GOOGLE_SHEETS_ID}` : '✗ MISSING',
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
