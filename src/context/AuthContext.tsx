import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  country: string;
  phone: string;
  highestQualification: string;
  professionalBackground: string;
  researchInterests: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  switchRoleForDemo: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPass: string) => Promise<boolean>;
}

const STORAGE_KEY = 'unsp_fellowship_user';

const DEMO_USERS: Record<UserRole, User> = {
  applicant: {
    id: 'usr-applicant-1',
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
    id: 'usr-fellow-1',
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
    id: 'usr-mentor-1',
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
    id: 'usr-evaluator-1',
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
    id: 'usr-admin-1',
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default to applicant demo for ease of exploration
    return DEMO_USERS.applicant;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    // Check if email matches any pre-configured role
    const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
      (r) => DEMO_USERS[r].email.toLowerCase() === cleanEmail
    );

    if (matchedRole) {
      setUser(DEMO_USERS[matchedRole]);
      return true;
    }

    // Otherwise create or sign in custom user
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      firstName: cleanEmail.split('@')[0].split('.')[0] || 'Research',
      lastName: 'Applicant',
      country: 'International',
      phone: '+1 555 0192',
      highestQualification: 'Master’s Degree',
      professionalBackground: 'Independent Scholar',
      researchInterests: 'Interdisciplinary International Studies',
      role: 'applicant',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      country: data.country.trim(),
      phone: data.phone.trim(),
      highestQualification: data.highestQualification.trim(),
      professionalBackground: data.professionalBackground.trim(),
      researchInterests: data.researchInterests.trim(),
      role: 'applicant',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const switchRoleForDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const forgotPassword = async (_email: string): Promise<boolean> => {
    return true;
  };

  const resetPassword = async (_email: string, _token: string, _newPass: string): Promise<boolean> => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'applicant',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        switchRoleForDemo,
        forgotPassword,
        resetPassword
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
