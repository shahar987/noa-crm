import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

export function getGoogleAuth(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      `Missing Google credentials. ` +
      `GOOGLE_SERVICE_ACCOUNT_EMAIL: ${email ? 'set' : 'MISSING'}, ` +
      `GOOGLE_PRIVATE_KEY: ${rawKey ? 'set' : 'MISSING'}`
    );
  }

  // Normalise the private key regardless of how Vercel stored it:
  // - strip accidental surrounding quotes
  // - convert literal \n → real newlines
  // - strip \r (Windows line endings)
  const privateKey = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // JWT bypasses the GoogleAuth.getClient() path that triggers the
  // OpenSSL 3 "DECODER routines::unsupported" error on Node 18+.
  return new JWT({ email, key: privateKey, scopes: SCOPES });
}
