import {
  browserLocalPersistence,
  getAuth,
  setPersistence
} from 'firebase/auth';
import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions
} from 'firebase/app';

const requiredFirebaseEnvironment = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
} satisfies Record<string, string | undefined>;

const missingFirebaseEnvironment = Object.entries(requiredFirebaseEnvironment)
  .filter(([, value]) => !value?.trim())
  .map(([name]) => name);

if (missingFirebaseEnvironment.length > 0) {
  throw new Error(
    `Firebase is not configured. Set all required Vite environment variables: ${missingFirebaseEnvironment.join(', ')}.`
  );
}

const firebaseOptions: FirebaseOptions = {
  apiKey: requiredFirebaseEnvironment.VITE_FIREBASE_API_KEY,
  authDomain: requiredFirebaseEnvironment.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: requiredFirebaseEnvironment.VITE_FIREBASE_PROJECT_ID,
  appId: requiredFirebaseEnvironment.VITE_FIREBASE_APP_ID,
  storageBucket: requiredFirebaseEnvironment.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: requiredFirebaseEnvironment.VITE_FIREBASE_MESSAGING_SENDER_ID
};

const existingDefaultApp = getApps().find((app) => app.name === '[DEFAULT]');
const mismatchedOptions = existingDefaultApp
  ? (Object.keys(firebaseOptions) as (keyof FirebaseOptions)[]).filter(
      (key) => existingDefaultApp.options[key] !== firebaseOptions[key]
    )
  : [];

if (mismatchedOptions.length > 0) {
  throw new Error(
    `The existing Firebase app does not match the configured Vite project (${mismatchedOptions.join(', ')}).`
  );
}

const app: FirebaseApp = existingDefaultApp || initializeApp(firebaseOptions);
export const auth = getAuth(app);

let persistenceSetup: Promise<void> | undefined;

export function ensureFirebaseAuthPersistence(): Promise<void> {
  persistenceSetup ??= setPersistence(auth, browserLocalPersistence);
  return persistenceSetup;
}
