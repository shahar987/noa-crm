import { GoogleAuth } from 'google-auth-library';

let authInstance: GoogleAuth | null = null;

export function getGoogleAuth(): GoogleAuth {
  if (!authInstance) {
    authInstance = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
  }
  return authInstance;
}
