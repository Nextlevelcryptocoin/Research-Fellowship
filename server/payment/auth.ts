import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
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

async function requireVerifiedFirebaseToken(request: ApiRequest): Promise<DecodedIdToken> {
  const token = getBearerToken(request);
  try {
    return await getAuth(getFirebaseAdminApp()).verifyIdToken(token, true);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'The Firebase sign-in token is invalid or expired.');
  }
}

export interface ApplicantIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export async function requireApplicantIdentity(
  request: ApiRequest
): Promise<ApplicantIdentity> {
  const decodedToken = await requireVerifiedFirebaseToken(request);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email || '',
    emailVerified: decodedToken.email_verified === true
  };
}

export async function requireApplicantUid(request: ApiRequest): Promise<string> {
  return (await requireApplicantIdentity(request)).uid;
}

export async function requireAdminUid(request: ApiRequest): Promise<string> {
  const decodedToken = await requireVerifiedFirebaseToken(request);
  if (decodedToken.admin !== true) {
    throw new ApiError(403, 'An authorized Firebase administrator is required.');
  }
  return decodedToken.uid;
}
