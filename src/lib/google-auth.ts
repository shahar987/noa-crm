import crypto from 'crypto';
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

  const privateKeyPem = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Pre-parse the PEM into a KeyObject so that jwa/jws uses the
  // crypto.sign(keyObject) path instead of crypto.createSign().sign(pemString).
  // The PEM-string path goes through OpenSSL 3's legacy decoder which throws
  // "DECODER routines::unsupported" on Node 18. The KeyObject path does not.
  const key = crypto.createPrivateKey(privateKeyPem) as unknown as string;

  return new JWT({ email, key, scopes: SCOPES });
}
