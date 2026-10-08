import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from 'node:process';
import { ApiError, getBearerToken, type ApiRequest } from './http';

function getFirebaseAdminApp() {
  const projectId = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new ApiError(503, 'Secure payment authentication is not configured.');
  }

  const existingApp = getApps().find((app) => app.name === 'payment-auth');
  if (existingApp) return existingApp;

  return initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey })
    },
    'payment-auth'
  );
}

export async function requireApplicantUid(request: ApiRequest): Promise<string> {
  const token = getBearerToken(request);
  try {
    const decodedToken = await getAuth(getFirebaseAdminApp()).verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'The Firebase sign-in token is invalid or expired.');
  }
}
