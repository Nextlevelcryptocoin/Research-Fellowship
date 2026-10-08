import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User
} from 'firebase/auth';
import { auth } from './googleDriveService';

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
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
