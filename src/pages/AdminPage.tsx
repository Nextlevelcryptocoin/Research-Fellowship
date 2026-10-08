import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { FELLOWSHIPS } from '../data/fellowships';
import { masteriyoService, MasteriyoCourse } from '../services/masteriyoIntegration';
import { FINANCING_PROVIDERS } from '../data/financingPartners';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  ShieldAlert,
  Users,
  FileText,
  CreditCard,
  Award,
  BookOpen,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  Search,
  Filter,
  RefreshCw,
  RotateCcw,
  Sliders,
  Lock,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Application, ApplicationStatus, PaymentMethodCategory } from '../types';
import { requestPaymentApi } from '../services/stripeCheckout';
import { signInApplicantWithGoogle } from '../services/applicantAuth';

interface AdminPageProps {
  navigate: (route: string) => void;
  initialTab?: string;
}

async function requestAdminApplications(): Promise<Application[]> {
  const result = await requestPaymentApi<{ applications: Application[] }>('/api/admin/applications');
  return result.applications;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate, initialTab }) => {
  const { user, role, switchRoleForDemo } = useAuth();
  const {
    updateApplicationStatus,
    orders,
    invoices,
    enrollments,
    retryEnrollmentSync,
    refundRequests,
    processRefund,
    certificates,
    issueCertificate,
    revokeCertificate,
    paymentConfig,
    updatePaymentConfig,
    courseMappings,
    updateCourseMapping,
    auditLogs,
    simulateWebhookEvent
  } = useFellowship();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'applications'
    | 'fellowships'
    | 'fellows'
    | 'payments'
    | 'refunds'
    | 'mentors'
    | 'research'
    | 'evaluations'
    | 'certificates'
    | 'verification'
    | 'masteriyo'
    | 'settings_payments'
    | 'audit_logs'
  >((initialTab as any) || 'dashboard');

  // Filters for payments table
  const [paymentSearch, setPaymentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Webhook simulation state
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<string | null>(null);
  const [adminApplications, setAdminApplications] = useState<Application[]>([]);
  const [adminApplicationsLoading, setAdminApplicationsLoading] = useState(false);
  const [adminApplicationsError, setAdminApplicationsError] = useState<string | null>(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);

  // Masteriyo state
  const [lmsCourses, setLmsCourses] = useState<MasteriyoCourse[]>([]);
  const [lmsLoading, setLmsLoading] = useState(false);
  const [lmsSyncMessage, setLmsSyncMessage] = useState<string | null>(null);

  // New Certificate state
  const [newCert, setNewCert] = useState({
    certificateId: `UNSP-IRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    fellowName: '',
    fellowshipProgramme: FELLOWSHIPS[0].title,
    researchTitle: '',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    completionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    programmeType: 'Privately administered international research fellowship programme',
    verificationUrl: '',
    status: 'VALID' as const,
    disclaimer: 'UNSP International Research Fellowship is a privately administered research fellowship programme.'
  });

  const loadAdminApplications = async () => {
    setAdminApplicationsLoading(true);
    setAdminApplicationsError(null);
    try {
      const applications = await requestAdminApplications();
      setAdminApplications(applications);
    } catch (error) {
      setAdminApplicationsError(
        error instanceof Error ? error.message : 'Unable to load server applications.'
      );
    } finally {
      setAdminApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') void loadAdminApplications();
  }, [activeTab]);

  const handleAdminApplicantSignIn = async () => {
    try {
      await signInApplicantWithGoogle();
      await loadAdminApplications();
    } catch (error) {
      setAdminApplicationsError(
        error instanceof Error ? error.message : 'Firebase sign-in failed.'
      );
    }
  };

  const handleApplicationStatusChange = async (appId: string, status: ApplicationStatus) => {
    setUpdatingApplicationId(appId);
    setAdminApplicationsError(null);
    try {
      const result = await requestPaymentApi<{
        applicationId: string;
        status: ApplicationStatus;
      }>('/api/admin/application-status', {
        method: 'PATCH',
        body: JSON.stringify({ applicationId: appId, status })
      });
      setAdminApplications((current) =>
        current.map((application) =>
          application.id === result.applicationId
            ? { ...application, status: result.status }
            : application
        )
      );
      updateApplicationStatus(result.applicationId, result.status);
    } catch (error) {
      setAdminApplicationsError(
        error instanceof Error ? error.message : 'Application status update failed.'
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };
  const [certMessage, setCertMessage] = useState<string | null>(null);

  // RBAC protection check
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-700 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Access Restricted: Administrator Role Required
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You are currently signed in with the role <strong className="font-mono text-slate-800 uppercase">{role}</strong>. Administrative sections are restricted to institutional administrators.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          {import.meta.env.DEV && (
            <button
              onClick={() => switchRoleForDemo('admin')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Switch to Administrator View (Demo Simulation)
            </button>
          )}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 rounded-lg hover:bg-stone-200 cursor-pointer"
          >
            Return to Fellow Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Financial aggregates
  const paidOrders = orders.filter((o) => o.orderStatus === 'Paid' || o.paymentStatus === 'Payment Successful');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Created');
  const failedOrders = orders.filter((o) => o.orderStatus === 'Failed' || o.paymentStatus === 'Payment Failed');
  const refundedOrders = orders.filter((o) => o.orderStatus === 'Refunded' || o.paymentStatus === 'Payment Refunded');

  const totalCollected = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const outstandingAmount = pendingOrders.reduce((sum, o) => sum + o.amount, 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      o.fellowshipName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      o.userId.toLowerCase().includes(paymentSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === 'all' || o.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleTestMasteriyo = async () => {
    setLmsLoading(true);
    setLmsSyncMessage(null);
    try {
      const courses = await masteriyoService.getCourses();
      setLmsCourses(courses);
      setLmsSyncMessage('Successfully queried Masteriyo LMS interface contracts for https://student.unspuniversity.com/');
    } catch {
      setLmsSyncMessage('Error testing Masteriyo adapter.');
    } finally {
      setLmsLoading(false);
    }
  };

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.fellowName || !newCert.researchTitle) return;

    const certUrl = `https://fellowship.unspuniversity.com/verify/${newCert.certificateId}`;
    issueCertificate({
      ...newCert,
      verificationUrl: certUrl
    });

    setCertMessage(`Certificate ${newCert.certificateId} successfully issued and added to verification registry.`);
    setTimeout(() => setCertMessage(null), 5000);

    setNewCert({
      certificateId: `UNSP-IRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fellowName: '',
      fellowshipProgramme: FELLOWSHIPS[0].title,
      researchTitle: '',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      completionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      programmeType: 'Privately administered international research fellowship programme',
      verificationUrl: '',
      status: 'VALID',
      disclaimer: 'UNSP International Research Fellowship is a privately administered research fellowship programme.'
    });
  };

  const handleSimulateWebhook = async (orderId: string, event: 'payment.captured' | 'payment.failed') => {
    setWebhookTesting(true);
    setWebhookResult(null);
    const success = await simulateWebhookEvent(orderId, event);
    setWebhookTesting(false);
    if (success) {
      setWebhookResult(`Signed webhook event "${event}" processed successfully for Order ${orderId}.`);
    } else {
      setWebhookResult(`Webhook verification failed for Order ${orderId}.`);
    }
    setTimeout(() => setWebhookResult(null), 6000);
  };

  return (
    <div className="space-y-8 pb-20">
      <DisclaimerBanner compact />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-slate-950 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>UNSP University</span>
              <span>·</span>
              <span>Academic Secretariat Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Administrator Management Console
            </h1>
            <p className="text-xs text-slate-400">
              Role: <strong className="text-white uppercase font-mono">{role}</strong> · Signed in as {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Domain: https://fellowship.unspuniversity.com/
            </span>
          </div>
        </div>

        {/* Admin Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Admin Navigation */}
          <nav className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Admin Sections
            </p>

            {[
              { id: 'dashboard', label: 'Console Dashboard', icon: Layers },
              { id: 'applications', label: 'Applications (Admissions)', icon: FileText },
              { id: 'fellowships', label: '13 Fellowships', icon: BookOpen },
              { id: 'payments', label: 'Payments & Orders', icon: CreditCard },
              { id: 'refunds', label: 'Refund Requests', icon: RotateCcw },
              { id: 'masteriyo', label: 'Masteriyo LMS Sync', icon: Database },
              { id: 'settings_payments', label: 'Payment Settings', icon: Sliders },
              { id: 'certificates', label: 'Certificates Registry', icon: Award },
              { id: 'audit_logs', label: 'Payment Audit Logs', icon: FileText }
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

          {/* Admin Content Pane */}
          <main className="lg:col-span-9 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 min-h-[600px] text-xs">
            
            {/* 1. Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Secretariat & Financial Metrics
                  </h2>
                  <p className="text-slate-500">
                    Live operational overview covering applications, fee receipts, and LMS enrollments.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Orders</span>
                    <span className="font-mono text-2xl font-bold text-slate-900">{orders.length}</span>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Total Collected</span>
                    <span className="font-mono text-xl font-bold text-emerald-800">₹{totalCollected.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Outstanding Pending</span>
                    <span className="font-mono text-xl font-bold text-amber-800">₹{outstandingAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Refund Requests</span>
                    <span className="font-mono text-2xl font-bold text-slate-900">{refundRequests.length}</span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 border border-stone-200 rounded-lg space-y-2 bg-stone-50/50">
                    <span className="font-semibold text-slate-900 block">Payment Configuration</span>
                    <p className="text-slate-600">Switch between Sandbox and Live mode, toggle EMI, or configure gateways.</p>
                    <button onClick={() => setActiveTab('settings_payments')} className="text-slate-900 font-semibold hover:underline">
                      Configure Gateways →
                    </button>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg space-y-2 bg-stone-50/50">
                    <span className="font-semibold text-slate-900 block">Masteriyo LMS Sync</span>
                    <p className="text-slate-600">Review 13 fellowship course mappings and test automated enrollment dispatches.</p>
                    <button onClick={() => setActiveTab('masteriyo')} className="text-slate-900 font-semibold hover:underline">
                      Review LMS Mappings →
                    </button>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg space-y-2 bg-stone-50/50">
                    <span className="font-semibold text-slate-900 block">Audit Logs</span>
                    <p className="text-slate-600">Inspect server-side webhook verifications, signature receipts, and error logs.</p>
                    <button onClick={() => setActiveTab('audit_logs')} className="text-slate-900 font-semibold hover:underline">
                      View Immutable Logs →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Applications Section */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Application Admissions Review
                  </h2>
                  <p className="text-slate-500">
                    Server applications are visible only to Firebase accounts with the administrator claim.
                  </p>
                </div>

                {adminApplicationsError && (
                  <div role="alert" className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-3">
                    <p>{adminApplicationsError}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAdminApplicantSignIn()}
                        className="px-3 py-2 bg-slate-950 text-white rounded"
                      >
                        Sign in with Firebase
                      </button>
                      <button
                        type="button"
                        onClick={() => void loadAdminApplications()}
                        className="px-3 py-2 bg-white border border-amber-300 rounded"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {adminApplicationsLoading && (
                  <p className="text-xs text-slate-500">Loading server applications…</p>
                )}

                <div className="space-y-4">
                  {adminApplications.map((app) => (
                    <div key={app.id} className="p-5 border border-stone-200 rounded-lg space-y-3 bg-stone-50/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                        <div>
                          <span className="font-semibold text-sm text-slate-900 block">
                            {app.firstName} {app.lastName}
                          </span>
                          <span className="text-slate-500">{app.email} · {app.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-stone-200 text-slate-800">
                            Status: {app.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                        <p><strong>Track:</strong> {app.fellowshipTitle}</p>
                        <p><strong>Qualification:</strong> {app.highestQualification}</p>
                        <p className="sm:col-span-2"><strong>Proposed Title:</strong> “{app.proposedResearchTitle}”</p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-slate-500 font-medium">Update Status:</span>
                        {(
                          [
                            'Submitted',
                            'Under Review',
                            'Additional Information Required',
                            'Approved',
                            'Rejected',
                            'Withdrawn',
                            'Enrolled'
                          ] as ApplicationStatus[]
                        ).map((st) => (
                          <button
                            key={st}
                            onClick={() => void handleApplicationStatusChange(app.id, st)}
                            disabled={updatingApplicationId === app.id || app.status === st}
                            className={`px-2 py-1 rounded border text-[11px] cursor-pointer ${
                              app.status === st
                                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                                : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!adminApplicationsLoading &&
                    !adminApplicationsError &&
                    adminApplications.length === 0 && (
                      <p className="text-xs text-slate-500">
                        No server-side applications are available to this administrator account.
                      </p>
                    )}
                </div>
              </div>
            )}

            {/* 3. Fellowships Section */}
            {activeTab === 'fellowships' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    The 13 Fellowship Curricula
                  </h2>
                  <p className="text-slate-500">
                    Active international research disciplines.
                  </p>
                </div>

                <div className="space-y-2">
                  {FELLOWSHIPS.map((f, i) => (
                    <div key={f.id} className="p-3 border border-stone-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">{i + 1}. {f.title}</span>
                        <span className="text-slate-500 block text-[11px]">{f.duration} · Fee: {f.fee}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/fellowships/${f.slug}`)}
                        className="px-2.5 py-1 text-slate-700 bg-stone-100 rounded hover:bg-stone-200"
                      >
                        Preview Syllabus →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Payments & Orders Table (Requirement 19) */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Payment & Order Management
                    </h2>
                    <p className="text-slate-500">
                      Audit transactions, provider order tokens, and webhook confirmation records.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded font-mono text-[11px] bg-amber-100 text-amber-900 border border-amber-300">
                      MODE: {paymentConfig.testMode ? 'SANDBOX' : 'LIVE'}
                    </span>
                  </div>
                </div>

                {webhookResult && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                    {webhookResult}
                  </div>
                )}

                {/* Filter Controls */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter by Order ID, Fellowship, or User..."
                      value={paymentSearch}
                      onChange={(e) => setPaymentSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Payment Successful">Paid</option>
                      <option value="Payment Pending">Pending</option>
                      <option value="Payment Failed">Failed</option>
                      <option value="Payment Refunded">Refunded</option>
                    </select>

                    <select
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                      className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                    >
                      <option value="all">All Methods</option>
                      <option value="upi">UPI</option>
                      <option value="indian_credit_card">Indian Card</option>
                      <option value="international_credit_card">International Card</option>
                      <option value="emi">EMI</option>
                      <option value="financing">Financing</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-stone-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Fellowship</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500">
                            No orders found matching filters.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50/50">
                            <td className="p-3 font-mono font-semibold text-slate-900">
                              {ord.orderId}
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-3 text-slate-800 font-medium max-w-xs truncate">
                              {ord.fellowshipName}
                            </td>
                            <td className="p-3 font-mono text-slate-900 font-semibold">
                              ₹{ord.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 uppercase text-[11px] text-slate-600 font-mono">
                              {ord.paymentMethod.replace(/_/g, ' ')}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                                ord.paymentStatus === 'Payment Successful'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.paymentStatus === 'Payment Failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {ord.paymentStatus !== 'Payment Successful' && (
                                <button
                                  onClick={() => handleSimulateWebhook(ord.orderId, 'payment.captured')}
                                  disabled={webhookTesting}
                                  className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                                  title="Test trusted provider webhook confirmation"
                                >
                                  Test Webhook Pass
                                </button>
                              )}
                              <button
                                onClick={() => navigate('/refund-request')}
                                className="px-2 py-1 bg-stone-100 text-slate-700 rounded text-[10px] hover:bg-stone-200 cursor-pointer"
                              >
                                Refund Tab
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Refunds Management (Requirement 18) */}
            {activeTab === 'refunds' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Refund & Withdrawal Requests
                  </h2>
                  <p className="text-slate-500">
                    Audit requests under the UNSP Fee & Refund Policy (80% refund prior to Phase 1 orientation).
                  </p>
                </div>

                <div className="space-y-3">
                  {refundRequests.length === 0 ? (
                    <div className="p-8 text-center border border-stone-200 rounded-lg text-slate-500">
                      No active refund requests in the administrative review queue.
                    </div>
                  ) : (
                    refundRequests.map((r) => (
                      <div key={r.id} className="p-5 border border-stone-200 rounded-xl space-y-3 bg-stone-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                          <div>
                            <span className="font-mono font-semibold text-slate-900">{r.orderId}</span>
                            <span className="text-slate-600 block text-xs">{r.studentName} ({r.email})</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded font-mono font-semibold text-xs ${
                            r.status === 'Refunded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Status: {r.status}
                          </span>
                        </div>

                        <p className="text-slate-700"><strong>Reason:</strong> {r.reason}</p>
                        {r.supportingInformation && (
                          <p className="text-slate-600"><strong>Notes:</strong> {r.supportingInformation}</p>
                        )}

                        {r.status === 'Requested' && (
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => processRefund(r.id, 'Approved', 'Approved under 7-day pre-orientation refund policy.')}
                              className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs hover:bg-emerald-700 font-semibold cursor-pointer"
                            >
                              Approve & Process Gateway Refund (80%)
                            </button>
                            <button
                              onClick={() => processRefund(r.id, 'Rejected', 'Outside published refund policy window.')}
                              className="px-3 py-1.5 bg-red-800 text-white rounded text-xs hover:bg-red-700 font-semibold cursor-pointer"
                            >
                              Reject Request
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. Masteriyo LMS Sync & Course Mappings (Requirements 20 & 21) */}
            {activeTab === 'masteriyo' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950">
                      Masteriyo LMS Course Mappings & Sync
                    </h2>
                    <p className="text-slate-500">
                      Target Production LMS: <code className="font-mono text-slate-900">https://student.unspuniversity.com/</code>
                    </p>
                  </div>

                  <button
                    onClick={handleTestMasteriyo}
                    disabled={lmsLoading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 rounded hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    {lmsLoading ? 'Testing LMS API...' : 'Test LMS Contract Responses'}
                  </button>
                </div>

                {lmsSyncMessage && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                    {lmsSyncMessage}
                  </div>
                )}

                {/* Enrollment Queue with Manual Retry (Requirement 22 & 30) */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Fellow Enrollment Queue:</h3>
                  <div className="border border-stone-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Fellowship</th>
                          <th className="p-3">LMS Course ID</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {enrollments.map((enr) => (
                          <tr key={enr.id}>
                            <td className="p-3 font-mono">{enr.userId}</td>
                            <td className="p-3 font-medium text-slate-800">{enr.fellowshipName}</td>
                            <td className="p-3 font-mono text-slate-600">{enr.masteriyoCourseId}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                                enr.status === 'Enrolled'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : enr.status === 'Enrollment Failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {enr.status}
                              </span>
                              {enr.failureReason && (
                                <span className="block text-[10px] text-red-600 mt-0.5 max-w-xs">{enr.failureReason}</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => retryEnrollmentSync(enr.id)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Retry Sync
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 13 Fellowship Course Mappings */}
                <div className="space-y-3 pt-4">
                  <h3 className="font-semibold text-slate-900">Configurable Fellowship to Course Mappings:</h3>
                  <div className="border border-stone-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="p-3">Fellowship Programme</th>
                          <th className="p-3">Masteriyo Course ID</th>
                          <th className="p-3">LMS Slug</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {courseMappings.map((m) => (
                          <tr key={m.fellowshipId}>
                            <td className="p-3 font-medium text-slate-900">{m.fellowshipTitle}</td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={m.masteriyoCourseId}
                                onChange={(e) => updateCourseMapping(m.fellowshipId, e.target.value)}
                                className="p-1 border border-stone-300 rounded font-mono text-xs w-36 bg-white"
                              />
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[11px]">{m.masteriyoCourseSlug}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Payment Settings (Requirement 4) */}
            {activeTab === 'settings_payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Payment Gateway & Financing Settings
                  </h2>
                  <p className="text-slate-500">
                    Configure provider routing, currencies, EMI availability, and masked credentials.
                  </p>
                </div>

                <div className="p-5 border border-stone-200 rounded-xl bg-stone-50 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Active Gateway Provider</label>
                      <select
                        value={paymentConfig.activeProvider}
                        onChange={(e) => updatePaymentConfig({ activeProvider: e.target.value as any })}
                        className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                      >
                        <option value="sandbox">Sandbox / Simulator Provider</option>
                        <option value="razorpay">Razorpay (India - UPI, Cards, Net Banking)</option>
                        <option value="stripe">Stripe (International Cards & Currencies)</option>
                        <option value="cashfree">Cashfree Payments (India)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-800 block mb-1">Payment Environment Mode</label>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => updatePaymentConfig({ testMode: true })}
                          className={`px-3 py-1.5 rounded border text-xs cursor-pointer ${
                            paymentConfig.testMode ? 'bg-amber-600 text-white border-amber-600 font-semibold' : 'bg-white'
                          }`}
                        >
                          SANDBOX / TEST MODE
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePaymentConfig({ testMode: false })}
                          className={`px-3 py-1.5 rounded border text-xs cursor-pointer ${
                            !paymentConfig.testMode ? 'bg-emerald-700 text-white border-emerald-700 font-semibold' : 'bg-white'
                          }`}
                        >
                          LIVE / PRODUCTION
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Masked Secret Keys (Requirement 4) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Provider API Key ID (Masked)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={paymentConfig.maskedKeyId}
                        className="w-full p-2 bg-stone-200/60 border border-stone-300 rounded font-mono text-slate-700 text-xs"
                      />
                      <span className="text-[10px] text-slate-500">Never exposed in frontend. Managed via server secrets.</span>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Webhook Secret Key (Masked)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={paymentConfig.maskedWebhookSecret}
                        className="w-full p-2 bg-stone-200/60 border border-stone-300 rounded font-mono text-slate-700 text-xs"
                      />
                      <span className="text-[10px] text-slate-500">Used for server-side HMAC signature verification.</span>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="pt-2 border-t border-stone-200 space-y-2">
                    <span className="font-semibold text-slate-800 block">Feature & Method Toggles:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentConfig.emiEnabled}
                          onChange={(e) => updatePaymentConfig({ emiEnabled: e.target.checked })}
                        />
                        <span>Enable EMI Option</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentConfig.financingEnabled}
                          onChange={(e) => updatePaymentConfig({ financingEnabled: e.target.checked })}
                        />
                        <span>Enable Education Financing</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentConfig.autoEnrollOnPayment}
                          onChange={(e) => updatePaymentConfig({ autoEnrollOnPayment: e.target.checked })}
                        />
                        <span>Auto-Enroll in Masteriyo LMS</span>
                      </label>
                    </div>
                  </div>

                  {/* Invoicing Settings */}
                  <div className="pt-2 border-t border-stone-200 space-y-2">
                    <span className="font-semibold text-slate-800 block">Invoice Settings:</span>
                    <div>
                      <label className="text-slate-600 block mb-1">Invoice Tax Disclaimer Text</label>
                      <input
                        type="text"
                        value={paymentConfig.taxNotice}
                        onChange={(e) => updatePaymentConfig({ taxNotice: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Certificates Section */}
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Fellowship Certificate Issuance
                  </h2>
                  <p className="text-slate-500">
                    Issue digitally verifiable completion certificates or revoke counterfeit credentials.
                  </p>
                </div>

                {certMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                    {certMessage}
                  </div>
                )}

                <form onSubmit={handleIssueCert} className="p-5 border border-stone-200 rounded-xl bg-stone-50 space-y-4">
                  <h3 className="font-semibold text-slate-900 text-sm">Issue New Verified Certificate</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-600 font-medium block mb-1">Certificate ID *</label>
                      <input
                        type="text"
                        required
                        value={newCert.certificateId}
                        onChange={(e) => setNewCert({ ...newCert, certificateId: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium block mb-1">Fellow Name *</label>
                      <input
                        type="text"
                        required
                        value={newCert.fellowName}
                        onChange={(e) => setNewCert({ ...newCert, fellowName: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-600 font-medium block mb-1">Monograph Research Title *</label>
                    <input
                      type="text"
                      required
                      value={newCert.researchTitle}
                      onChange={(e) => setNewCert({ ...newCert, researchTitle: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-300 rounded"
                    />
                  </div>
                  <button type="submit" className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded hover:bg-slate-800">
                    Issue Official Certificate →
                  </button>
                </form>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Current Certificate Registry:</h3>
                  {certificates.map((c) => (
                    <div key={c.certificateId} className="p-4 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-mono font-semibold text-slate-900 block">{c.certificateId}</span>
                        <span className="font-serif italic text-slate-800">{c.fellowName}</span>
                        <span className="text-slate-500 block">{c.fellowshipProgramme}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
                          c.status === 'VALID' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {c.status}
                        </span>
                        <button
                          onClick={() => navigate(`/verify/${c.certificateId}`)}
                          className="px-2.5 py-1 text-slate-700 bg-stone-100 rounded hover:bg-stone-200"
                        >
                          View Live Page
                        </button>
                        {c.status === 'VALID' && (
                          <button
                            onClick={() => revokeCertificate(c.certificateId)}
                            className="px-2.5 py-1 text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Payment Audit Logs (Requirement 24) */}
            {activeTab === 'audit_logs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950">
                    Immutable Payment Audit Logs
                  </h2>
                  <p className="text-slate-500">
                    Detailed record of order creation, webhook validation events, and Masteriyo LMS enrollments.
                  </p>
                </div>

                <div className="border border-stone-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Event Type</th>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Details</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-semibold text-slate-800">{log.eventType}</td>
                          <td className="p-3 text-slate-600">{log.orderId || '—'}</td>
                          <td className="p-3 text-slate-700 font-sans">{log.details}</td>
                          <td className="p-3 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
