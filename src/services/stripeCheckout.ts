import { auth } from './googleDriveService';

export interface AuthoritativePaymentStatus {
  applicationStatus: string;
  fellowshipName: string;
  feeAmountMinor: number;
  feeCurrency: string;
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'expired';
  amountMinor: number | null;
  currency: string | null;
  updatedAt: string | null;
}

export async function requestPaymentApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error(
      'Secure Firebase sign-in is required. The demo applicant session cannot authorize a payment.'
    );
  }

  const idToken = await firebaseUser.getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  if (init.body) headers.set('Content-Type', 'application/json');

  const response = await fetch(path, {
    ...init,
    headers,
    cache: 'no-store'
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const errorMessage =
      typeof result === 'object' &&
      result !== null &&
      'error' in result &&
      typeof result.error === 'string'
        ? result.error
        : 'The secure payment request failed.';
    throw new Error(errorMessage);
  }
  return result as T;
}
