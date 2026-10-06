import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ShieldCheck, UserCheck, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, register, switchRoleForDemo, role } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    phone: '',
    highestQualification: '',
    professionalBackground: '',
    researchInterests: ''
  });

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim()) {
      setError('Please provide an email address.');
      return;
    }
    await login(loginEmail, loginPassword);
    navigate('/student/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regForm.email || !regForm.firstName || !regForm.lastName) {
      setError('Please fill in all required fields.');
      return;
    }
    await register(regForm);
    navigate('/student/dashboard');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Toggle Mode */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            UNSP University Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-950">
            {mode === 'login'
              ? 'International Researcher Login'
              : mode === 'register'
              ? 'Register as International Researcher'
              : 'Password Recovery'}
          </h1>
          <p className="text-xs text-slate-600">
            Access your fellowship workspace, advisory milestone reports, and monograph submissions.
          </p>

          <div className="pt-2 flex justify-center gap-1">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-stone-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'register' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-stone-100'
              }`}
            >
              Register New Fellow
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 text-xs shadow-sm">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                placeholder="fellow@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Sign In to Dashboard →
            </button>

            {/* Quick Demo Login Preset Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Quick Simulation Logins (Evaluator Testing):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('applicant');
                    navigate('/student/dashboard');
                  }}
                  className="p-2 border border-stone-200 rounded text-left hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-semibold block text-slate-900">Applicant Persona</span>
                  <span className="text-[10px] text-slate-500">Wei Chen (Singapore)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('fellow');
                    navigate('/student/dashboard');
                  }}
                  className="p-2 border border-stone-200 rounded text-left hover:bg-stone-50 cursor-pointer"
                >
                  <span className="font-semibold block text-slate-900">Enrolled Fellow Persona</span>
                  <span className="text-[10px] text-slate-500">Dr. Elena Rostova</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('admin');
                    navigate('/admin');
                  }}
                  className="p-2 border border-stone-200 rounded text-left hover:bg-stone-50 cursor-pointer sm:col-span-2"
                >
                  <span className="font-semibold block text-slate-900">Academic Secretariat (Administrator)</span>
                  <span className="text-[10px] text-slate-500">Full administrative & LMS verification access</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 text-xs shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={regForm.firstName}
                  onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={regForm.lastName}
                  onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={regForm.country}
                  onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Telephone *</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Highest Academic Qualification *</label>
              <input
                type="text"
                required
                placeholder="e.g. Master of Science, LL.M., Ph.D."
                value={regForm.highestQualification}
                onChange={(e) => setRegForm({ ...regForm, highestQualification: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Professional Background *</label>
              <input
                type="text"
                required
                placeholder="Current academic or professional affiliation"
                value={regForm.professionalBackground}
                onChange={(e) => setRegForm({ ...regForm, professionalBackground: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Research Interests *</label>
              <textarea
                rows={3}
                required
                placeholder="List priority research areas and theoretical inquiries..."
                value={regForm.researchInterests}
                onChange={(e) => setRegForm({ ...regForm, researchInterests: e.target.value })}
                className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Complete Registration & Open Dashboard →
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 text-xs shadow-sm">
            {forgotSent ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Password Reset Instructions Dispatched
                </h2>
                <p className="text-slate-600">
                  A verification token has been routed to <strong>{forgotEmail}</strong>. Follow the instructions to reset your password credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded text-slate-800 font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Registered Email Address *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-slate-500 hover:text-slate-800 underline"
                  >
                    Back to Sign In
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg"
                  >
                    Send Reset Token
                  </button>
                </div>
              </>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
