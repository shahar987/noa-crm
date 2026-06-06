import crypto from 'crypto';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

function normalizePem(raw: string): string {
  let pem = raw
    .replace(/^["']|["']$/g, '')   // strip accidental surrounding quotes
    .replace(/\\n/g, '\n')          // literal \n → real newline
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  // If the key ended up with no newlines (e.g. Vercel stripped them),
  // reconstruct proper PEM line-wrapping from the raw base64 block.
  if (!pem.includes('\n')) {
    const match = pem.match(/-----BEGIN ([^-]+)-----([A-Za-z0-9+/=]+)-----END ([^-]+)-----/);
    if (match) {
      const type = match[1];
      const b64  = match[2];
      const lines = b64.match(/.{1,64}/g) ?? [];
      pem = `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----\n`;
    }
  }

  return pem;
}

export function getGoogleAuth(): JWT {
  const email  = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      `Missing Google credentials. ` +
      `GOOGLE_SERVICE_ACCOUNT_EMAIL: ${email ? 'set' : 'MISSING'}, ` +
      `GOOGLE_PRIVATE_KEY: ${rawKey ? 'set' : 'MISSING'}`
    );
  }

  const pem = normalizePem(rawKey);
  const key = crypto.createPrivateKey(pem) as unknown as string;
  return new JWT({ email, key, scopes: SCOPES });
}
