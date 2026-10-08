import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { CertificateView } from '../components/CertificateView';
import { InvoiceView } from '../components/InvoiceView';
import { GoogleDriveExplorer } from '../components/GoogleDriveExplorer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  requestPaymentApi,
  type AuthoritativePaymentStatus
} from '../services/stripeCheckout';
import {
  FileText,
  CreditCard,
  User,
  Bell,
  Award,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Upload,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  Printer,
  HardDrive
} from 'lucide-react';

interface StudentDashboardProps {
  navigate: (route: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardProps> = ({ navigate }) => {
  const { user, updateProfile, saveProfile, role } = useAuth();
  const {
    userApplication,
    userInvoice,
    userEnrollment,
    userProposal,
    userResearchProject,
    userCertificate,
    mentorRecord,
    notifications,
    markNotificationAsRead,
    retryEnrollmentSync,
    updateMentorMilestone
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'fellowship'
    | 'application'
    | 'payment'
    | 'progress'
    | 'proposal'
    | 'mentor'
    | 'project'
    | 'submission'
    | 'evaluation'
    | 'certificate'
    | 'drive'
    | 'profile'
    | 'notifications'
  >('overview');

  const [retryingLms, setRetryingLms] = useState(false);
  const [lmsNotice, setLmsNotice] = useState<string | null>(null);
  const [authoritativePayment, setAuthoritativePayment] =
    useState<AuthoritativePaymentStatus | null>(null);
  const [paymentStatusError, setPaymentStatusError] = useState<string | null>(null);
  const [profileSaveStatus, setProfileSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // Status variables
  const appStatus =
    authoritativePayment?.applicationStatus ||
    (userApplication?.status === 'Paid' ? 'Payment status checking' : userApplication?.status) ||
    'Draft';
  const isPaymentEligible =
    authoritativePayment?.applicationStatus === 'Submitted' ||
    authoritativePayment?.applicationStatus === 'Approved';
  const paymentEligibilityMessage = (() => {
    switch (authoritativePayment?.applicationStatus) {
      case 'Under Review':
        return 'Your application is currently under review. Payment will become available if your application reaches an eligible status.';
      case 'Additional Information Required':
        return 'Additional information is required for your application. Payment is currently unavailable.';
      case 'Rejected':
        return 'Your application is not currently eligible for fellowship fee payment.';
      case 'Withdrawn':
        return 'Your application is withdrawn. Payment is currently unavailable.';
      case 'Enrolled':
        return 'Your application is enrolled. No new fellowship fee payment is currently available.';
      case 'Submitted':
      case 'Approved':
        return 'Your application is currently eligible for fellowship fee payment.';
      default:
        return paymentStatusError
          ? 'Payment eligibility is unavailable because your application status could not be verified.'
          : 'Your application status is being checked. Payment eligibility will be shown when verification is complete.';
    }
  })();
  const paymentStatus =
    authoritativePayment?.paymentStatus ||
    (paymentStatusError ? 'unavailable' : 'checking');
  const isPaid = authoritativePayment?.paymentStatus === 'paid';
  const feeLabel = authoritativePayment
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: authoritativePayment.feeCurrency,
        maximumFractionDigits: 0
      }).format(authoritativePayment.feeAmountMinor / 100)
    : 'Server amount unavailable';
  const enrollmentStatus = userEnrollment?.status || 'Payment Pending';
  const proposalStatus = userProposal?.status || 'Draft';
  const hasCertificate = userCertificate && (appStatus === 'Completed' || userCertificate.status === 'VALID');

  useEffect(() => {
    if (!userApplication?.id) return;

    let active = true;
    setAuthoritativePayment(null);
    setPaymentStatusError(null);
    void requestPaymentApi<AuthoritativePaymentStatus>(
      `/api/payment/status?applicationId=${encodeURIComponent(userApplication.id)}`
    ).then(
      (status) => {
        if (active) setAuthoritativePayment(status);
      },
      (error: unknown) => {
        if (!active) return;
        setAuthoritativePayment(null);
        setPaymentStatusError(
          error instanceof Error ? error.message : 'Unable to read server payment status.'
        );
      }
    );

    return () => {
      active = false;
    };
  }, [userApplication?.id]);

  const handleRetryLms = async () => {
    if (!userEnrollment) return;
    setRetryingLms(true);
    setLmsNotice(null);
    const success = await retryEnrollmentSync(userEnrollment.id);
    setRetryingLms(false);
    if (success) {
      setLmsNotice('LMS synchronization confirmed. Your course access is now active.');
    } else {
      setLmsNotice('LMS retry request logged for administrative review.');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <DisclaimerBanner compact />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>UNSP International Research Fellowship</span>
              <span>·</span>
              <span className="uppercase text-[#8c6a1e] font-semibold">{role} View</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#121927]">
              Welcome, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-slate-600">
              Fellow ID: <code className="font-mono text-[#121927]">{user?.id}</code> · {user?.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isPaid && isPaymentEligible && (
              <button
                onClick={() => navigate('/checkout')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#121927] hover:bg-[#1e293b] rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Pay Fellowship Fee ({feeLabel})</span>
                <ArrowRight className="w-4 h-4 text-[#e5c36d]" />
              </button>
            )}
            <button
              onClick={() => navigate('/research')}
              className="px-4 py-2 text-xs font-semibold text-[#121927] bg-[#faf8f5] border border-[#e6e2d8] hover:border-[#121927] rounded-lg transition-colors cursor-pointer"
            >
              Research Centre Workspace →
            </button>
          </div>
        </div>

        {appStatus === 'Submitted' && (
          <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#121927]">
                {isPaid ? 'Payment Received' : 'Application Submitted'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {isPaid
                  ? 'Payment received successfully. Your application is now awaiting formal review.'
                  : 'Your application has been successfully submitted. You can now pay the fellowship fee.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Fellowship</span>
                <span className="font-semibold text-[#121927]">{userApplication?.fellowshipTitle}</span>
              </div>
              <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Fellowship Fee</span>
                <span className="font-semibold text-[#121927]">{feeLabel}</span>
              </div>
              <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Payment Status</span>
                <span className={`font-semibold ${isPaid ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {isPaid ? 'Payment Received' : paymentStatus}
                </span>
              </div>
            </div>
            {!isPaid && isPaymentEligible && (
              <button
                onClick={() => navigate('/checkout')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#121927] hover:bg-[#1e293b] rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Pay Fellowship Fee
              </button>
            )}
          </div>
        )}

        {/* Status Indicators Dashboard Strip (Requirement 6 & 20) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white border border-[#e6e2d8] rounded-lg p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Application
            </span>
            <span
              className={`font-semibold text-xs sm:text-sm block ${
                appStatus === 'Approved' || appStatus === 'Enrolled' || appStatus === 'Paid'
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {appStatus.toUpperCase()}
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Payment
            </span>
            <span
              className={`font-semibold text-xs sm:text-sm block ${
                isPaid ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {isPaid ? 'PAID' : paymentStatus.toUpperCase()} ({feeLabel})
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Enrollment
            </span>
            <span
              className={`font-semibold text-xs sm:text-sm block ${
                enrollmentStatus === 'Enrolled'
                  ? 'text-emerald-700'
                  : enrollmentStatus === 'Enrollment Failed'
                  ? 'text-red-700'
                  : 'text-slate-800'
              }`}
            >
              {enrollmentStatus.toUpperCase()}
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Research Proposal
            </span>
            <span className="font-semibold text-xs sm:text-sm text-slate-800 block">
              {proposalStatus.toUpperCase()}
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Certificate
            </span>
            <span
              className={`font-semibold text-xs sm:text-sm block ${
                hasCertificate ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {hasCertificate ? 'AVAILABLE' : 'NOT AVAILABLE'}
            </span>
          </div>
        </div>

        {/* Enrollment Failure Alert Notice (Requirement 22) */}
        {enrollmentStatus === 'Enrollment Failed' && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-800" />
                <span>Payment Verified (PAID), but LMS Course Enrollment Requires Additional Processing</span>
              </div>
              <p className="text-slate-700">
                Your payment of ₹1,50,000 has been verified. Course enrollment is temporarily pending queue retry. Please do NOT make another payment.
              </p>
            </div>
            <button
              onClick={handleRetryLms}
              disabled={retryingLms}
              className="px-4 py-2 bg-amber-900 text-white font-semibold rounded hover:bg-amber-800 text-xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              {retryingLms ? 'Retrying LMS...' : 'Retry LMS Sync'}
            </button>
          </div>
        )}

        {lmsNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>{lmsNotice}</span>
          </div>
        )}

        {/* Main Workspace with 12 Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-3 bg-white border border-[#e6e2d8] rounded-xl p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Fellowship Sections
            </p>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Layers },
              { id: 'fellowship', label: '1. My Fellowship', icon: BookOpen },
              { id: 'application', label: '2. Application Status', icon: FileText },
              { id: 'payment', label: '3. Payment Status & Invoicing', icon: CreditCard },
              { id: 'progress', label: '4. Programme Progress', icon: Clock },
              { id: 'proposal', label: '5. Research Proposal', icon: Send },
              { id: 'mentor', label: '6. Mentor Advisor', icon: User },
              { id: 'project', label: '7. Research Project', icon: BookOpen },
              { id: 'submission', label: '8. Research Submission', icon: Upload },
              { id: 'evaluation', label: '9. Evaluation', icon: CheckCircle },
              { id: 'certificate', label: '10. Certificate', icon: Award },
              { id: 'drive', label: '11. Google Drive Sync', icon: HardDrive },
              { id: 'profile', label: '12. Profile Management', icon: User },
              { id: 'notifications', label: '13. Notifications', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              );
            })}
          </nav>

          {/* Section Detail Panes */}
          <main className="lg:col-span-9 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 min-h-[600px]">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Fellowship Academic Overview
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track your research milestones, fee settlement, advisory feedback, and administrative verification status.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Active Fellowship Card */}
                  <div className="border border-stone-200 rounded-lg p-5 space-y-3 bg-stone-50/50">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Enrolled Track
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      {userApplication?.fellowshipTitle || 'Artificial Intelligence & Data Science'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Research Topic: “{userProposal?.researchTitle || 'Auditing Demographic Disparities in Multimodal Reasoning Models'}”
                    </p>
                    <div className="pt-2 flex items-center gap-3 text-xs">
                      <button
                        onClick={() => setActiveTab('proposal')}
                        className="text-slate-900 font-semibold hover:underline"
                      >
                        View Proposal →
                      </button>
                      <button
                        onClick={() => setActiveTab('progress')}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        Milestones →
                      </button>
                    </div>
                  </div>

                  {/* Payment & Order Card */}
                  <div className="border border-stone-200 rounded-lg p-5 space-y-3 bg-stone-50/50">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Fee & Order Overview
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-slate-950">{feeLabel}</span>
                      <span className={`text-xs font-semibold ${isPaid ? 'text-emerald-700' : 'text-amber-800'}`}>
                        Status: {paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Application #{userApplication?.id || '—'}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {!isPaid && isPaymentEligible && (
                        <button
                          onClick={() => navigate('/checkout')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          Proceed to Payment →
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('payment')}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-stone-300 rounded hover:bg-stone-50"
                      >
                        Invoice & Billing Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next Milestone Box */}
                <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <Clock className="w-4 h-4 text-amber-800" />
                    <span>Next Supervised Research Milestone</span>
                  </div>
                  <p className="font-serif text-base font-semibold text-slate-900">
                    {mentorRecord.nextMilestone}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Assigned Mentor: {mentorRecord.name}. Review meeting scheduled for October 18, 2026.
                  </p>
                </div>
              </div>
            )}

            {/* 1. My Fellowship */}
            {activeTab === 'fellowship' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    My Fellowship Programme
                  </h2>
                  <p className="text-xs text-slate-500">
                    Curriculum track and research parameters.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-700">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                    <p className="font-semibold text-sm text-slate-900">
                      {userApplication?.fellowshipTitle}
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Duration: 24 Weeks · Supervised International Fellowship · Privately Administered.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                      Selected Research Scope:
                    </h3>
                    <p className="p-3 bg-white border border-stone-200 rounded-lg text-slate-800">
                      {userApplication?.proposedResearchArea}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                      Proposed Working Monograph Title:
                    </h3>
                    <p className="p-3 bg-white border border-stone-200 rounded-lg font-serif italic text-sm text-slate-900">
                      “{userApplication?.proposedResearchTitle}”
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Application Status */}
            {activeTab === 'application' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Application Status Tracker
                    </h2>
                    <p className="text-xs text-slate-500">
                      Current status in the academic admissions pipeline.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                    {appStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="border border-stone-200 rounded-lg p-4 space-y-2 bg-stone-50/50">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Academic Committee Evaluation Note
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {userApplication?.adminNotes ||
                        'Your application has been accepted for cohort enrollment. Please finalize fee settlement to activate supervisory milestone scheduling.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-stone-200 rounded">
                      <span className="text-slate-500 block text-[10px] uppercase">Submitted At</span>
                      <span className="font-medium text-slate-900">{userApplication?.submittedAt || '2026-09-14'}</span>
                    </div>
                    <div className="p-3 border border-stone-200 rounded">
                      <span className="text-slate-500 block text-[10px] uppercase">Last Updated</span>
                      <span className="font-medium text-slate-900">{userApplication?.updatedAt || '2026-09-18'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/apply')}
                      className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded hover:bg-stone-50"
                    >
                      Review Submitted Application Fields
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Payment Status & Invoicing (Requirement 20) */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Fee Settlement, Invoicing & Orders
                    </h2>
                    <p className="text-xs text-slate-500">
                      Payment status is read from the verified server-side payment record.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/payment-support')}
                      className="text-xs text-slate-600 hover:text-slate-950 underline"
                    >
                      Payment Help & FAQs
                    </button>
                  </div>
                </div>

                {/* Payment action is shown only for a server-verified eligible application status. */}
                {!isPaid && isPaymentEligible && (
                  <div className="p-6 bg-slate-950 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-amber-300 uppercase tracking-widest font-semibold block">
                        Application status: {authoritativePayment?.applicationStatus}
                      </span>
                      <h3 className="font-serif text-xl font-bold">
                        Proceed to Fee Settlement
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md">
                        Your application is currently eligible for fellowship fee payment.
                      </p>
                    </div>

                    <button
                      onClick={() => navigate('/checkout')}
                      className="px-6 py-3 text-xs font-semibold text-slate-950 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-2 font-mono"
                    >
                      <span>PROCEED TO PAYMENT ({feeLabel})</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                )}
                {!isPaid && !isPaymentEligible && (
                  <div
                    role="status"
                    className="p-6 bg-stone-50 border border-stone-200 text-slate-700 rounded-xl space-y-2"
                  >
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      Payment Unavailable
                    </h3>
                    {authoritativePayment?.applicationStatus && (
                      <p className="text-xs font-medium text-slate-600">
                        Application status: {authoritativePayment.applicationStatus}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 max-w-2xl">
                      {paymentEligibilityMessage}
                    </p>
                  </div>
                )}

                {/* Transaction & Order Details Grid */}
                <div className="p-6 border border-stone-200 rounded-xl bg-stone-50 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-stone-200 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Application Status
                      </span>
                      <span className="font-semibold text-slate-900">{appStatus.toUpperCase()}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Payment Status
                      </span>
                      <span className={`font-semibold ${isPaid ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Amount
                      </span>
                      <span className="font-mono font-bold text-slate-950 text-sm">{feeLabel}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Application ID
                      </span>
                      <span className="font-mono text-slate-800">{userApplication?.id || '—'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Payment Method
                      </span>
                      <span className="font-medium text-slate-800">
                        Stripe-hosted Checkout
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Gateway Transaction ID
                      </span>
                      <span className="font-mono text-slate-800">
                        {isPaid ? 'Confirmed by verified Stripe webhook' : 'Awaiting verified Stripe webhook'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Refund Status
                      </span>
                      <span className="text-slate-700">
                        Payment API does not manage refund requests
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/refund-request')}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded text-slate-700 hover:bg-stone-50 cursor-pointer"
                      >
                        Request Refund / Withdrawal
                      </button>
                    </div>

                    {isPaid && (
                      <span className="text-emerald-800 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>Verified Server-Side via Stripe Webhook</span>
                      </span>
                    )}
                  </div>
                </div>

                {!authoritativePayment && paymentStatusError && (
                  <p className="text-xs text-amber-800">{paymentStatusError}</p>
                )}

                {userInvoice && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      Invoice preview from the existing local application data. It is not a Stripe receipt; payment is confirmed only by the server status above.
                    </p>
                    <InvoiceView
                      invoice={userInvoice}
                      isReceipt={false}
                      paymentVerified={isPaid}
                      paymentStatusLabel={
                        isPaid ? 'Paid — confirmed by Stripe webhook' : 'Not verified by Stripe'
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {/* 4. Programme Progress */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Programme Progress (24 Weeks)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Milestone adherence and research stage progress.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {userResearchProject?.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-stone-200 rounded-lg flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateMentorMilestone(idx, !m.completed)}
                          className={`w-5 h-5 rounded flex items-center justify-center border cursor-pointer ${
                            m.completed ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300'
                          }`}
                        >
                          {m.completed && '✓'}
                        </button>
                        <div>
                          <p className={`font-medium ${m.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                            {m.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">Target: {m.dueDate}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          m.completed ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-slate-500'
                        }`}
                      >
                        {m.completed ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Research Proposal */}
            {activeTab === 'proposal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Research Proposal
                    </h2>
                    <p className="text-xs text-slate-500">
                      Status: {proposalStatus.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/research')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 rounded"
                  >
                    Open in Research Centre
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Research Title</span>
                    <p className="font-serif text-base font-semibold text-slate-900">
                      {userProposal?.researchTitle}
                    </p>
                  </div>

                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Problem Statement</span>
                    <p className="text-slate-700 leading-relaxed">{userProposal?.problemStatement}</p>
                  </div>

                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Methodology</span>
                    <p className="text-slate-700 leading-relaxed">{userProposal?.methodology}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Mentor Advisor */}
            {activeTab === 'mentor' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Assigned Mentor Advisory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Faculty dialogue, consultation logs, and scheduled milestone reviews.
                  </p>
                </div>

                <div className="p-5 border border-amber-200 bg-amber-50/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <User className="w-4 h-4 text-amber-800" />
                    <span>{mentorRecord.name}</span>
                    <span className="text-[10px] font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950">
                      DEMO DATA
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Specialisation: {mentorRecord.area}
                  </p>
                  <p className="text-xs text-slate-600 italic pt-1">
                    “{mentorRecord.feedback}”
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                    Advisory Meeting Records:
                  </h3>
                  <div className="space-y-2 text-xs">
                    {mentorRecord.meetingRecords.map((rec, i) => (
                      <div key={i} className="p-3 border border-stone-200 rounded flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{rec.topic}</p>
                          <span className="text-slate-500 text-[11px] font-mono">{rec.date}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          rec.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Research Project */}
            {activeTab === 'project' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Research Project
                  </h2>
                  <p className="text-xs text-slate-500">
                    Working monograph abstract and document repository.
                  </p>
                </div>

                <div className="p-4 border border-stone-200 rounded-lg space-y-2 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Abstract</span>
                  <p className="text-slate-700 leading-relaxed font-serif text-sm">
                    {userResearchProject?.abstract}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-slate-800 block">Uploaded Working Drafts:</span>
                  {userResearchProject?.documents.map((d, i) => (
                    <div key={i} className="p-3 border border-stone-200 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{d.name}</span>
                        <span className="text-slate-400">({d.size})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{d.uploadedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Research Submission */}
            {activeTab === 'submission' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Research Submission
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload monograph chapters and final deliverables.
                  </p>
                </div>

                <div className="p-8 border-2 border-dashed border-stone-300 rounded-xl text-center space-y-3">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-800">
                    Upload Final Research Monograph (PDF, DOCX)
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Word count target: 8,000 – 12,000 words. Must follow UNSP Academic Integrity guidelines.
                  </p>
                  <button
                    onClick={() => navigate('/student/research')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 rounded hover:bg-slate-800 cursor-pointer"
                  >
                    Open Submission Portal
                  </button>
                </div>
              </div>
            )}

            {/* 9. Evaluation */}
            {activeTab === 'evaluation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Peer & Advisory Evaluation
                  </h2>
                  <p className="text-xs text-slate-500">
                    Grading rubric and committee feedback.
                  </p>
                </div>

                <div className="p-5 border border-stone-200 rounded-lg space-y-3 text-xs bg-stone-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Aggregate Assessment Score
                    </span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">
                      {userResearchProject?.evaluationScore || 'Pending Final Review'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Mentor Remarks: “{userResearchProject?.mentorFeedback}”
                  </p>
                </div>
              </div>
            )}

            {/* 10. Certificate */}
            {activeTab === 'certificate' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Fellowship Certificate
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official completion certificate and digital verification ledger.
                  </p>
                </div>

                {userCertificate ? (
                  <CertificateView certificate={userCertificate} />
                ) : (
                  <div className="p-8 border border-stone-200 rounded-lg text-center space-y-2 text-xs text-slate-500">
                    <Award className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-medium text-slate-800">Certificate Not Available</p>
                    <p>
                      Official certificates are issued upon final monograph defense, peer review evaluation, and fee verification.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 11. Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Fellow Profile Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your academic qualifications and contact coordinates.
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setProfileSaveStatus('saving');
                    try {
                      await saveProfile();
                      setProfileSaveStatus('saved');
                    } catch {
                      setProfileSaveStatus('error');
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  {profileSaveStatus === 'saved' && (
                    <p className="text-emerald-800" role="status">
                      Profile changes saved.
                    </p>
                  )}
                  {profileSaveStatus === 'error' && (
                    <p className="text-red-800" role="alert">
                      Profile changes could not be saved. Please try again.
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-medium">First Name</label>
                      <input
                        type="text"
                        value={user?.firstName}
                        onChange={(e) => {
                          setProfileSaveStatus('idle');
                          updateProfile({ firstName: e.target.value });
                        }}
                        className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-medium">Last Name</label>
                      <input
                        type="text"
                        value={user?.lastName}
                        onChange={(e) => {
                          setProfileSaveStatus('idle');
                          updateProfile({ lastName: e.target.value });
                        }}
                        className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-medium">Country</label>
                      <input
                        type="text"
                        value={user?.country}
                        onChange={(e) => {
                          setProfileSaveStatus('idle');
                          updateProfile({ country: e.target.value });
                        }}
                        className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-medium">Phone</label>
                      <input
                        type="text"
                        value={user?.phone}
                        onChange={(e) => {
                          setProfileSaveStatus('idle');
                          updateProfile({ phone: e.target.value });
                        }}
                        className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">Highest Qualification</label>
                    <input
                      type="text"
                      value={user?.highestQualification}
                      onChange={(e) => {
                        setProfileSaveStatus('idle');
                        updateProfile({ highestQualification: e.target.value });
                      }}
                      className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-medium">Research Interests</label>
                    <textarea
                      rows={3}
                      value={user?.researchInterests}
                      onChange={(e) => {
                        setProfileSaveStatus('idle');
                        updateProfile({ researchInterests: e.target.value });
                      }}
                      className="w-full p-2.5 border border-stone-200 rounded text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaveStatus === 'saving'}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 cursor-pointer"
                  >
                    {profileSaveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* 12. Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Notifications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Administrative updates and milestone alerts.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                        n.read ? 'bg-white border-stone-200' : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. Google Drive Sync Tab */}
            {activeTab === 'drive' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#121927]">
                    Fellowship Google Drive Cloud Sync
                  </h2>
                  <p className="text-xs text-slate-500">
                    Connect and manage research documents, datasets, and monograph drafts stored in your Google Drive.
                  </p>
                </div>

                <GoogleDriveExplorer defaultTitle="Fellowship Google Drive Files" />
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
