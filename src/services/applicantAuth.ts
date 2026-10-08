import {
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth, ensureFirebaseAuthPersistence } from './firebase';
import {
  createApplicantProfile,
  type ApplicantProfileData
} from './applicantProfile';

export function subscribeApplicantAuth(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentApplicantUser(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

export async function signInApplicantWithGoogle(): Promise<User> {
  await ensureFirebaseAuthPersistence();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInApplicantWithEmail(
  email: string,
  password: string
): Promise<User> {
  await ensureFirebaseAuthPersistence();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (!credential.user.emailVerified) {
    try {
      await sendEmailVerification(credential.user);
    } finally {
      await signOut(auth);
    }
    throw new Error('Please verify your email address. We sent you a new verification link.');
  }
  return credential.user;
}

export async function registerApplicant(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  stateProvince: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  highestQualification: string;
  institution: string;
  currentOccupation: string;
  researchInterests: string;
}): Promise<void> {
  await ensureFirebaseAuthPersistence();
  const credential = await createUserWithEmailAndPassword(
    auth,
    params.email.trim(),
    params.password
  );
  try {
    await updateProfile(credential.user, {
      displayName: `${params.firstName.trim()} ${params.lastName.trim()}`.trim()
    });
    await sendEmailVerification(credential.user);
    const profile: Omit<
      ApplicantProfileData,
      'email' | 'emailVerified' | 'createdAt' | 'updatedAt'
    > = {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      country: params.country,
      stateProvince: params.stateProvince,
      dateOfBirth: params.dateOfBirth,
      gender: params.gender,
      highestQualification: params.highestQualification,
      institution: params.institution,
      currentOccupation: params.currentOccupation,
      researchInterests: params.researchInterests
    };
    try {
      await createApplicantProfile(credential.user, profile);
    } catch {
      throw new Error(
        'Your account was created and a verification email was sent, but your profile could not be saved. Please contact support before creating another account.'
      );
    }
  } finally {
    await signOut(auth);
  }
}

export async function sendApplicantPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOutApplicant(): Promise<void> {
  await signOut(auth);
}

export function getApplicantAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.startsWith('Please verify your email address.')) {
    return error.message;
  }
  if (error instanceof Error && error.message.startsWith('Your account was created and')) {
    return error.message;
  }

  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';

  if (code.startsWith('auth/api-key-not-valid')) {
    return 'Sign-in is temporarily unavailable because the Firebase web configuration is invalid. Please contact support.';
  }

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email address or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email address. Sign in or reset your password.';
    case 'auth/weak-password':
      return 'Choose a stronger password with at least six characters.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'We could not connect to the sign-in service. Check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Allow popups and try again.';
    case 'auth/unauthorized-domain':
      return 'This site is not authorized for sign-in. Please contact support.';
    default:
      return 'We could not complete your sign-in. Please try again.';
  }
}
