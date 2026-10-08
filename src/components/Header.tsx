import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User as UserIcon, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { user, role, logout, switchRoleForDemo, authError } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setRoleMenuOpen(false);
  };

  const rolesList: { label: string; role: UserRole }[] = [
    { label: 'Applicant View', role: 'applicant' },
    { label: 'Enrolled Fellow View', role: 'fellow' },
    { label: 'Mentor Advisor View', role: 'mentor' },
    { label: 'Evaluator View', role: 'evaluator' },
    { label: 'Administrator View', role: 'admin' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNav('/')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <span className="font-serif text-2xl tracking-tight text-[#121927] font-semibold group-hover:text-[#8c6a1e] transition-colors">
            UNSP University
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={() => handleNav('/fellowships')}
            className={`cursor-pointer transition-colors py-1 hover:text-slate-950 ${
              currentRoute.startsWith('/fellowships')
                ? 'text-slate-950 border-b-2 border-slate-900 font-semibold'
                : 'hover:border-b-2 hover:border-slate-300'
            }`}
          >
            Fellowships
          </button>

          <button
            onClick={() => handleNav('/research')}
            className={`cursor-pointer transition-colors py-1 hover:text-slate-950 ${
              currentRoute.startsWith('/research')
                ? 'text-slate-950 border-b-2 border-slate-900 font-semibold'
                : 'hover:border-b-2 hover:border-slate-300'
            }`}
          >
            Research Centre
          </button>

          <button
            onClick={() => handleNav('/how-it-works')}
            className={`cursor-pointer transition-colors py-1 hover:text-slate-950 ${
              currentRoute === '/how-it-works'
                ? 'text-slate-950 border-b-2 border-slate-900 font-semibold'
                : 'hover:border-b-2 hover:border-slate-300'
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNav('/verify')}
            className={`cursor-pointer transition-colors py-1 hover:text-slate-950 ${
              currentRoute.startsWith('/verify')
                ? 'text-slate-950 border-b-2 border-slate-900 font-semibold'
                : 'hover:border-b-2 hover:border-slate-300'
            }`}
          >
            Verify Certificate
          </button>

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="flex items-center gap-1 cursor-pointer transition-colors py-1 hover:text-slate-950"
            >
              <span>Institutional</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
            {moreMenuOpen && (
              <div
                className="absolute top-full mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50 text-xs"
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                <button
                  onClick={() => handleNav('/about')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  About UNSP
                </button>
                <button
                  onClick={() => handleNav('/faq')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Frequently Asked Questions
                </button>
                <button
                  onClick={() => handleNav('/contact')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Contact & Inquiries
                </button>
                <button
                  onClick={() => handleNav('/drive')}
                  className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] text-[#121927] font-medium flex items-center justify-between"
                >
                  <span>Google Drive Repository</span>
                  <span className="text-[10px] bg-[#b38a2c]/10 text-[#8c6a1e] px-1.5 py-0.5 rounded font-mono font-semibold">Drive</span>
                </button>
                <button
                  onClick={() => handleNav('/payment-support')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Payment & EMI Support
                </button>
                <div className="border-t border-stone-100 my-1" />
                <button
                  onClick={() => handleNav('/refund-request')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Refund Request Portal
                </button>
                <button
                  onClick={() => handleNav('/academic-integrity')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Academic Integrity
                </button>
                <button
                  onClick={() => handleNav('/research-ethics')}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 text-slate-700"
                >
                  Research Ethics
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Development-only demo role switcher; server APIs remain claim-protected. */}
          {import.meta.env.DEV && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
                title="Test role authorization views"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-stone-200 rounded-lg shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                    Simulate Role Access
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRoleForDemo(item.role);
                        setRoleMenuOpen(false);
                        if (item.role === 'admin') {
                          navigate('/admin');
                        } else {
                          navigate('/student/dashboard');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${
                        role === item.role ? 'font-semibold text-slate-900 bg-stone-50' : 'text-slate-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      {role === item.role && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {role === 'admin' ? (
                <button
                  onClick={() => handleNav('/admin')}
                  className={`px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer ${
                    currentRoute.startsWith('/admin') ? 'ring-2 ring-slate-400' : ''
                  }`}
                >
                  Admin Portal
                </button>
              ) : (
                <button
                  onClick={() => handleNav('/student/dashboard')}
                  className={`px-3.5 py-2 text-xs font-semibold text-slate-900 bg-stone-100 border border-stone-300 rounded-lg hover:bg-stone-200 transition-colors whitespace-nowrap cursor-pointer ${
                    currentRoute.startsWith('/student') ? 'ring-2 ring-slate-900' : ''
                  }`}
                >
                  Fellow Dashboard
                </button>
              )}

              <button
                onClick={() => logout()}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Log Out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
              >
                Student Login
              </button>
              <button
                onClick={() => handleNav('/apply')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Apply Now
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-950 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f5] border-b border-[#e6e2d8] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleNav('/')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/fellowships')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              13 Fellowships
            </button>
            <button
              onClick={() => handleNav('/research')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              Research Centre
            </button>
            <button
              onClick={() => handleNav('/how-it-works')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('/verify')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => handleNav('/drive')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800 flex items-center justify-between"
            >
              <span>Google Drive</span>
              <span className="text-[10px] bg-[#b38a2c]/20 text-[#8c6a1e] px-1.5 py-0.5 rounded font-mono font-semibold">1P</span>
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              About UNSP
            </button>
            <button
              onClick={() => handleNav('/faq')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              FAQs
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="text-left py-2 px-3 rounded hover:bg-stone-50 font-medium text-slate-800"
            >
              Contact
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNav(role === 'admin' ? '/admin' : '/student/dashboard')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 rounded-lg"
                >
                  {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800"
                >
                  Log Out ({user.email})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/apply')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-950 rounded-lg"
                >
                  Apply for Fellowship
                </button>
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-800 bg-stone-100 rounded-lg"
                >
                  Student Login
                </button>
              </>
            )}

            {import.meta.env.DEV && (
              <div className="pt-2 text-xs text-slate-500">
                <span className="block mb-1 font-medium text-slate-700">Simulate Role:</span>
                <div className="flex flex-wrap gap-1">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRoleForDemo(r.role);
                        handleNav(r.role === 'admin' ? '/admin' : '/student/dashboard');
                      }}
                      className={`px-2 py-1 text-[11px] rounded border ${
                        role === r.role ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-stone-200'
                      }`}
                    >
                      {r.role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {authError && (
        <div className="max-w-7xl mx-auto px-4 pb-2 text-xs text-amber-900" role="status">
          {authError}
        </div>
      )}
    </header>
  );
};
