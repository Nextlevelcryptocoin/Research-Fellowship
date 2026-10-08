import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getIdTokenResult, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import {
  registerApplicant,
  sendApplicantPasswordReset,
  signInApplicantWithEmail,
  signOutApplicant,
  subscribeApplicantAuth
} from '../services/applicantAuth';
import {
  loadApplicantProfile,
  patchApplicantProfile,
  type ApplicantProfileData,
  type EditableApplicantProfile
} from '../services/applicantProfile';
import { auth } from '../services/firebase';
import { User, UserRole } from '../types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  stateProvince: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  highestQualification: string;
  institution: string;
  currentOccupation: string;
  researchInterests: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  authReady: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  switchRoleForDemo: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  saveProfile: () => Promise<void>;
}

const DEMO_USERS: Record<UserRole, User> = {
  applicant: {
    id: 'demo-applicant-1',
    email: 'applicant.chen@unspuniversity.com',
    firstName: 'Wei',
    lastName: 'Chen',
    country: 'Singapore',
    phone: '+65 9123 4567',
    highestQualification: 'Master of Science in Information Systems',
    professionalBackground: 'Data Systems Architect & Applied Research Fellow',
    researchInterests: 'Algorithmic Fairness, Ethical Machine Learning & Data Governance',
    role: 'applicant',
    createdAt: '2026-09-12'
  },
  fellow: {
    id: 'demo-fellow-1',
    email: 'fellow.elena@unspuniversity.com',
    firstName: 'Dr. Elena',
    lastName: 'Rostova',
    country: 'Austria',
    phone: '+43 664 123456',
    highestQualification: 'Ph.D. in Computational Linguistics',
    professionalBackground: 'Postdoctoral Research Associate',
    researchInterests: 'Multilingual Foundation Models & Societal Alignment',
    role: 'fellow',
    createdAt: '2026-06-01'
  },
  mentor: {
    id: 'demo-mentor-1',
    email: 'mentor.advisor@unspuniversity.com',
    firstName: 'Prof. David',
    lastName: 'Kaufman',
    country: 'Switzerland',
    phone: '+41 22 767 1111',
    highestQualification: 'Ph.D. in International Law',
    professionalBackground: 'Senior Research Fellow in International Jurisprudence',
    researchInterests: 'Humanitarian Law and Global Treaty Enforcement',
    role: 'mentor',
    createdAt: '2025-11-15'
  },
  evaluator: {
    id: 'demo-evaluator-1',
    email: 'evaluator.board@unspuniversity.com',
    firstName: 'Dr. Sarah',
    lastName: 'O’Connor',
    country: 'United Kingdom',
    phone: '+44 20 7946 0912',
    highestQualification: 'Ph.D. in Global Governance & Ethics',
    professionalBackground: 'Peer Review Committee Member',
    researchInterests: 'Research Methodology, Interdisciplinary Metrics & Academic Integrity',
    role: 'evaluator',
    createdAt: '2025-08-10'
  },
  admin: {
    id: 'demo-admin-1',
    email: 'admin.director@unspuniversity.com',
    firstName: 'Academic Secretariat',
    lastName: 'Administration',
    country: 'Global Office',
    phone: '+44 20 7946 0100',
    highestQualification: 'Executive Academic Administration',
    professionalBackground: 'Director of International Research Fellowships',
    researchInterests: 'Institutional Governance, Academic Standards & Programme Oversight',
    role: 'admin',
    createdAt: '2025-01-01'
  }
};

const VALID_ROLES: UserRole[] = ['applicant', 'fellow', 'mentor', 'evaluator', 'admin'];

function getRoleFromClaims(claims: Record<string, unknown>): UserRole {
  if (claims.admin === true) return 'admin';
  return typeof claims.role === 'string' && VALID_ROLES.includes(claims.role as UserRole)
    ? (claims.role as UserRole)
    : 'applicant';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseProfile, setFirebaseProfile] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const profilePatchRef = useRef<Partial<EditableApplicantProfile>>({});
  const profilePatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profilePatchSaveRef = useRef<Promise<void> | null>(null);

  const saveProfilePatch = (
    firebaseUser: NonNullable<typeof auth.currentUser>,
    patch: Partial<EditableApplicantProfile>
  ): Promise<void> => {
    const previousSave = profilePatchSaveRef.current;
    const save = (previousSave ? previousSave.catch(() => {}) : Promise.resolve())
      .then(() => patchApplicantProfile(firebaseUser, patch))
      .then(() => undefined);
    profilePatchSaveRef.current = save;
    void save.then(
      () => {
        if (profilePatchSaveRef.current === save) profilePatchSaveRef.current = null;
      },
      () => {
        if (profilePatchSaveRef.current === save) profilePatchSaveRef.current = null;
        setAuthError('Your profile changes could not be saved. Please try again.');
      }
    );
    return save;
  };

  const saveProfile = async (): Promise<void> => {
    while (true) {
      if (profilePatchTimerRef.current) {
        clearTimeout(profilePatchTimerRef.current);
        profilePatchTimerRef.current = null;
      }

      const pendingPatch = profilePatchRef.current;
      profilePatchRef.current = {};
      const pendingSave = profilePatchSaveRef.current;
      if (Object.keys(pendingPatch).length > 0) {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          throw new Error('Sign in before saving profile changes.');
        }
        await saveProfilePatch(firebaseUser, pendingPatch);
      } else if (pendingSave) {
        await pendingSave;
      } else {
        return;
      }
    }
  };

  useEffect(() => {
    let active = true;
    let authRequest = 0;
    const unsubscribe = subscribeApplicantAuth((firebaseUser) => {
      const requestId = ++authRequest;
      setAuthError(null);
      if (profilePatchTimerRef.current) {
        clearTimeout(profilePatchTimerRef.current);
        profilePatchTimerRef.current = null;
        profilePatchRef.current = {};
      }
      if (!firebaseUser) {
        setFirebaseProfile(null);
        setAuthReady(true);
        return;
      }

      setDemoUser(null);
      setAuthReady(false);
      void getIdTokenResult(firebaseUser)
        .then(async (tokenResult) => {
          if (!active || requestId !== authRequest) return;
          let profile: ApplicantProfileData | null = null;
          try {
            profile = await loadApplicantProfile(firebaseUser);
          } catch {
            if (active && requestId === authRequest) {
              setAuthError('You are signed in, but your saved profile could not be loaded.');
            }
          }
          if (!active || requestId !== authRequest) return;
          const [firstName = '', ...lastNameParts] = (
            firebaseUser.displayName || ''
          ).split(' ');
          setFirebaseProfile({
            id: firebaseUser.uid,
            email: profile?.email || firebaseUser.email || '',
            firstName: profile?.firstName || firstName,
            lastName: profile?.lastName || lastNameParts.join(' '),
            country: profile?.country || '',
            stateProvince: profile?.stateProvince || '',
            dateOfBirth: profile?.dateOfBirth || '',
            gender: profile?.gender || '',
            phone: profile?.phone || firebaseUser.phoneNumber || '',
            highestQualification: profile?.highestQualification || '',
            institution: profile?.institution || '',
            professionalBackground: profile?.currentOccupation || '',
            currentOccupation: profile?.currentOccupation || '',
            researchInterests: profile?.researchInterests || '',
            role: getRoleFromClaims(tokenResult.claims),
            createdAt: profile?.createdAt || (firebaseUser.metadata.creationTime
              ? new Date(firebaseUser.metadata.creationTime).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10))
          });
          setAuthReady(true);
        })
        .catch(() => {
          if (!active || requestId !== authRequest) return;
          const [firstName = '', ...lastNameParts] = (
            firebaseUser.displayName || ''
          ).split(' ');
          setFirebaseProfile({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName,
            lastName: lastNameParts.join(' '),
            country: '',
            phone: firebaseUser.phoneNumber || '',
            highestQualification: '',
            professionalBackground: '',
            researchInterests: '',
            role: 'applicant',
            createdAt: new Date().toISOString().slice(0, 10)
          });
          setAuthError('Your account is signed in, but role details could not be refreshed.');
          setAuthReady(true);
        });
    });

    return () => {
      active = false;
      if (profilePatchTimerRef.current) clearTimeout(profilePatchTimerRef.current);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setDemoUser(null);
    await signInApplicantWithEmail(email, password);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await registerApplicant(data);
    setDemoUser(null);
    return true;
  };

  const logout = async (): Promise<void> => {
    setDemoUser(null);
    if (!auth.currentUser) return;
    try {
      await signOutApplicant();
    } catch {
      setAuthError('We could not sign you out. Please try again.');
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (demoUser) setDemoUser((current) => (current ? { ...current, ...data } : current));
    const firebaseUser = auth.currentUser;
    if (!firebaseProfile || !firebaseUser) return;
    setFirebaseProfile((current) => (current ? { ...current, ...data } : current));
    const profileUpdate: Partial<EditableApplicantProfile> = {};
    if (data.firstName !== undefined) profileUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) profileUpdate.lastName = data.lastName;
    if (data.phone !== undefined) profileUpdate.phone = data.phone;
    if (data.country !== undefined) profileUpdate.country = data.country;
    if (data.stateProvince !== undefined) profileUpdate.stateProvince = data.stateProvince;
    if (data.dateOfBirth !== undefined) profileUpdate.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) profileUpdate.gender = data.gender;
    if (data.highestQualification !== undefined) {
      profileUpdate.highestQualification = data.highestQualification;
    }
    if (data.institution !== undefined) profileUpdate.institution = data.institution;
    if (data.currentOccupation !== undefined) {
      profileUpdate.currentOccupation = data.currentOccupation;
    } else if (data.professionalBackground !== undefined) {
      profileUpdate.currentOccupation = data.professionalBackground;
    }
    if (data.researchInterests !== undefined) {
      profileUpdate.researchInterests = data.researchInterests;
    }
    if (Object.keys(profileUpdate).length > 0) {
      Object.assign(profilePatchRef.current, profileUpdate);
      if (profilePatchTimerRef.current) clearTimeout(profilePatchTimerRef.current);
      profilePatchTimerRef.current = setTimeout(() => {
        const pendingUpdate = profilePatchRef.current;
        profilePatchRef.current = {};
        profilePatchTimerRef.current = null;
        void saveProfilePatch(firebaseUser, pendingUpdate).catch(() => {
          setAuthError('Your profile changes could not be saved. Please try again.');
        });
      }, 500);
    }
    const displayName = [data.firstName ?? firebaseProfile.firstName, data.lastName ?? firebaseProfile.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (displayName) {
      void updateFirebaseProfile(firebaseUser, { displayName }).catch(() => {
        setAuthError('Your profile name could not be saved to Firebase.');
      });
    }
  };

  const switchRoleForDemo = (role: UserRole) => {
    if (import.meta.env.DEV) setDemoUser(DEMO_USERS[role]);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await sendApplicantPasswordReset(email);
    return true;
  };

  const user = demoUser || firebaseProfile;
  const role = user?.role || 'applicant';
  const isAuthenticated =
    Boolean(firebaseProfile) || (import.meta.env.DEV && Boolean(demoUser));

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        authReady,
        authError,
        login,
        register,
        logout,
        updateProfile,
        switchRoleForDemo,
        forgotPassword,
        saveProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
