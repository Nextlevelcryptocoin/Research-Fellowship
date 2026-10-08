/**
 * UNSP University International Research Fellowship
 * Official Portal: https://fellowship.unspuniversity.com/
 * Stage 2 Production Architecture
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FellowshipProvider } from './context/FellowshipContext';
import { GoogleDriveProvider } from './context/GoogleDriveContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FellowshipsListPage } from './pages/FellowshipsListPage';
import { FellowshipDetailPage } from './pages/FellowshipDetailPage';
import { ResearchCentrePage } from './pages/ResearchCentrePage';
import { GoogleDrivePage } from './pages/GoogleDrivePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { VerifyPage } from './pages/VerifyPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { ApplyPage } from './pages/ApplyPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { StudentResearchPage } from './pages/StudentResearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { RefundRequestPage } from './pages/RefundRequestPage';
import { PaymentSupportPage } from './pages/PaymentSupportPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPages } from './pages/LegalPages';
import { AlertTriangle, Home } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, role, authReady, isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Keep route synced with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    try {
      window.history.pushState({}, '', route);
    } catch {
      // Ignore if iframe sandboxing restricts history API
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Parser
  const renderRoute = () => {
    const path = currentRoute.split('?')[0];
    const searchParams = new URLSearchParams(currentRoute.split('?')[1] || '');
    const requiresAuthentication =
      path === '/student/dashboard' ||
      path === '/student/research' ||
      path === '/checkout' ||
      path === '/refund-request' ||
      path.startsWith('/admin');

    if (requiresAuthentication && !authReady) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <p className="text-sm text-slate-600" role="status">Checking your secure session…</p>
        </div>
      );
    }

    if (requiresAuthentication && !isAuthenticated) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-slate-950">Sign in to continue</h1>
          <p className="text-sm text-slate-600">
            This area is available after you sign in to your Research Fellowship account.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800"
          >
            Go to Sign In
          </button>
        </div>
      );
    }

    if (path.startsWith('/admin') && role !== 'admin') {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-slate-950">Administrator access required</h1>
          <p className="text-sm text-slate-600">
            This account does not have an administrator role assigned by the institution.
          </p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-stone-100 rounded-lg hover:bg-stone-200"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    // Homepage
    if (path === '/' || path === '') {
      return <HomePage navigate={navigate} />;
    }

    // Fellowships Catalog
    if (path === '/fellowships') {
      return <FellowshipsListPage navigate={navigate} />;
    }

    // Dynamic Fellowship Detail: /fellowships/:slug
    if (path.startsWith('/fellowships/')) {
      const slug = path.replace('/fellowships/', '');
      return <FellowshipDetailPage slug={slug} navigate={navigate} />;
    }

    // Research Centre
    if (path === '/research') {
      return <ResearchCentrePage navigate={navigate} />;
    }

    // Google Drive Repository
    if (path === '/drive') {
      return <GoogleDrivePage navigate={navigate} />;
    }

    // How It Works
    if (path === '/how-it-works') {
      return <HowItWorksPage navigate={navigate} />;
    }

    // Certificate Verification: /verify or /verify/:id
    if (path.startsWith('/verify')) {
      const parts = path.split('/').filter(Boolean);
      const certId = parts.length > 1 ? parts[1] : undefined;
      return <VerifyPage initialCertId={certId} navigate={navigate} />;
    }

    // Institutional Pages
    if (path === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (path === '/faq') {
      return <FAQPage navigate={navigate} />;
    }
    if (path === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    // Apply Page
    if (path === '/apply') {
      const initialSlug = searchParams.get('fellowship') || undefined;
      return <ApplyPage navigate={navigate} initialFellowshipSlug={initialSlug} />;
    }

    // Checkout (Stage 3)
    if (path === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    // Refund Request (Stage 3)
    if (path === '/refund-request') {
      return <RefundRequestPage navigate={navigate} />;
    }

    // Payment Support & FAQs (Stage 3)
    if (path === '/payment-support') {
      return <PaymentSupportPage navigate={navigate} />;
    }

    // Login / Register
    if (path === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    // Student Dashboard (Protected)
    if (path === '/student/dashboard') {
      return <StudentDashboardPage navigate={navigate} />;
    }

    // Student Research Submission (Protected)
    if (path === '/student/research') {
      return <StudentResearchPage navigate={navigate} />;
    }

    // Admin Console (Protected & Subroutes)
    if (path === '/admin/payments') {
      return <AdminPage navigate={navigate} initialTab="payments" />;
    }
    if (path === '/admin/settings/payments') {
      return <AdminPage navigate={navigate} initialTab="settings_payments" />;
    }
    if (path.startsWith('/admin')) {
      return <AdminPage navigate={navigate} />;
    }

    // Legal & Governance Pages
    if (path === '/terms') {
      return <LegalPages type="terms" navigate={navigate} />;
    }
    if (path === '/privacy') {
      return <LegalPages type="privacy" navigate={navigate} />;
    }
    if (path === '/refund-policy') {
      return <LegalPages type="refund-policy" navigate={navigate} />;
    }
    if (path === '/research-ethics') {
      return <LegalPages type="research-ethics" navigate={navigate} />;
    }
    if (path === '/academic-integrity') {
      return <LegalPages type="academic-integrity" navigate={navigate} />;
    }
    if (path === '/ai-use-policy') {
      return <LegalPages type="ai-use-policy" navigate={navigate} />;
    }
    if (path === '/fellowship-disclaimer') {
      return <LegalPages type="fellowship-disclaimer" navigate={navigate} />;
    }

    // 404 Fallback
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Page Not Found (404)
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          The requested page <code className="bg-stone-100 px-1 py-0.5 rounded text-slate-800">{currentRoute}</code> could not be located in the UNSP Fellowship portal.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#121927] font-sans selection:bg-[#d8b04c]/30 selection:text-[#121927]">
      <Header currentRoute={currentRoute} navigate={navigate} />
      <div className="flex-1">
        {renderRoute()}
      </div>
      <Footer navigate={navigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FellowshipProvider>
        <GoogleDriveProvider>
          <AppContent />
        </GoogleDriveProvider>
      </FellowshipProvider>
    </AuthProvider>
  );
}
