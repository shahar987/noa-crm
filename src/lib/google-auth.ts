import { GoogleAuth } from 'google-auth-library';

export function getGoogleAuth(): GoogleAuth {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      `Missing Google credentials. ` +
      `GOOGLE_SERVICE_ACCOUNT_EMAIL: ${email ? 'set' : 'MISSING'}, ` +
      `GOOGLE_PRIVATE_KEY: ${rawKey ? 'set' : 'MISSING'}`
    );
  }

  // Vercel may store the key with literal \n or with real newlines.
  // Strip accidental surrounding quotes, then normalise both formats.
  const privateKey = rawKey
    .replace(/^["']|["']$/g, '')   // remove leading/trailing quotes if any
    .replace(/\\n/g, '\n');         // convert \n literals → real newlines

  return new GoogleAuth({
    credentials: { client_email: email, private_key: privateKey },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });
}
