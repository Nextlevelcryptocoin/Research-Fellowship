import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { FELLOWSHIPS, FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { FINANCING_PROVIDERS, FINANCING_DISCLAIMER_TEXT } from '../data/financingPartners';
import {
  STANDARD_EMI_PLANS,
  CURRENCY_CONVERSIONS,
  PaymentVerificationResult
} from '../services/paymentProvider';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { InvoiceView } from '../components/InvoiceView';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Calendar,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  RefreshCw,
  Info,
  ExternalLink,
  Download
} from 'lucide-react';
import { PaymentMethodCategory } from '../types';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const {
    userApplication,
    userOrder,
    createOrder,
    executePayment,
    userInvoice,
    userEnrollment,
    paymentConfig,
    submitFinancingApplication
  } = useFellowship();

  // Selected payment method category
  const [selectedCategory, setSelectedCategory] = useState<PaymentMethodCategory>('upi');
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const [selectedEmiId, setSelectedEmiId] = useState<string>('emi-6m');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Card tokenized fields state (UI only, never stored)
  const [cardHolder, setCardHolder] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [cardNumberMasked, setCardNumberMasked] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [upiId, setUpiId] = useState('scholar@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Amazon Pay');

  // Education financing partner selection
  const [selectedFinancingPartnerId, setSelectedFinancingPartnerId] = useState(FINANCING_PROVIDERS[0].id);
  const [financingTenure, setFinancingTenure] = useState(12);
  const [financingSubmitting, setFinancingSubmitting] = useState(false);
  const [financingDispatched, setFinancingDispatched] = useState(false);

  // Processing & Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationOutcome, setSimulationOutcome] = useState<'success' | 'failed' | 'cancelled'>('success');
  const [simulateEnrollmentFailure, setSimulateEnrollmentFailure] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Fellowship Info
  const fellowshipTitle = userApplication?.fellowshipTitle || FELLOWSHIPS[1].title;
  const fellowshipId = userApplication?.fellowshipId || FELLOWSHIPS[1].id;
  const isApproved = userApplication?.status === 'Approved' || userApplication?.status === 'Payment Pending' || userApplication?.status === 'Enrolled';

  // Guard: If application is not approved / payment pending, warn user
  if (!isApproved) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-700 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Payment Not Yet Available
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          In accordance with the admissions workflow, fellowship fee payments are accessible only after your application has undergone formal review and reached <strong>Approved</strong> status.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Current Application Status: {userApplication?.status || 'Draft'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800"
          >
            Return to Fellow Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStartPayment = async () => {
    if (!termsAgreed) {
      setErrorMessage('Please acknowledge the terms, refund policy and fellowship disclaimer before proceeding.');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Create Order
      const newOrder = await createOrder({
        userId: user?.id || 'usr-applicant-1',
        applicationId: userApplication?.id || 'app-1001',
        fellowshipId,
        fellowshipName: fellowshipTitle,
        amount: 150000,
        currency: selectedCurrency,
        paymentMethod: selectedCategory,
        emiPlanId: selectedCategory === 'emi' ? selectedEmiId : undefined
      });

      // 2. Execute provider verification
      const result = await executePayment({
        orderId: newOrder.orderId,
        simulationOutcome,
        forceEnrollmentFail: simulateEnrollmentFailure
      });

      setVerificationResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyFinancing = async () => {
    setFinancingSubmitting(true);
    const partner = FINANCING_PROVIDERS.find((p) => p.id === selectedFinancingPartnerId) || FINANCING_PROVIDERS[0];
    try {
      await submitFinancingApplication({
        providerId: partner.id,
        providerName: partner.providerName,
        amount: 150000,
        tenureMonths: financingTenure,
        notes: `Education financing application submitted by ${user?.firstName} ${user?.lastName} for ${fellowshipTitle}.`
      });
      setFinancingDispatched(true);
    } catch {
      setErrorMessage('Financing application dispatch encountered an issue.');
    } finally {
      setFinancingSubmitting(false);
    }
  };

  const selectedEmiPlan = STANDARD_EMI_PLANS.find((e) => e.id === selectedEmiId);

  // If verified successfully, show official receipt / success state
  if (verificationResult && verificationResult.verified) {
    return (
      <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded">
            {verificationResult.isTestMode ? 'TEST PAYMENT VERIFIED' : 'LIVE PAYMENT VERIFIED'}
          </span>
          <h1 className="font-serif text-3xl font-bold text-emerald-950">
            Payment Successfully Verified
          </h1>
          <p className="text-xs sm:text-sm text-emerald-900 max-w-lg mx-auto leading-relaxed">
            Your fellowship fee settlement of <strong>₹1,50,000</strong> has been confirmed by the payment gateway webhook.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto pt-2 text-xs font-mono text-slate-700 bg-white/80 p-3 rounded-lg border border-emerald-200">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Order ID</span>
              <span className="font-semibold">{verificationResult.orderId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Transaction ID</span>
              <span className="font-semibold">{verificationResult.providerPaymentId.substring(0, 14)}...</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Payment Status</span>
              <span className="text-emerald-700 font-semibold">PAID</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">LMS Enrollment</span>
              <span className="font-semibold text-slate-900">
                {userEnrollment?.status === 'Enrollment Failed' ? 'PROCESSING NOTE' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {userEnrollment?.status === 'Enrollment Failed' && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs max-w-xl mx-auto text-left space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-800" />
                <span>Enrollment Processing Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your payment has been successfully verified, but course enrollment requires additional processing. Please contact support. (Do NOT pay again).
              </p>
            </div>
          )}

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Go to Fellow Dashboard →
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors shadow-sm cursor-pointer"
            >
              Print Receipt
            </button>
          </div>
        </div>

        {/* Official Receipt Facsimile */}
        {userInvoice && (
          <div className="pt-4 space-y-2">
            <h2 className="font-serif text-lg font-bold text-slate-900 text-center">
              Official Tax & Enrollment Invoice
            </h2>
            <InvoiceView invoice={userInvoice} isReceipt={true} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="border-b border-stone-200 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
              Enrollment Formalization
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              PAYMENT MODE: {paymentConfig.testMode ? 'SANDBOX' : 'LIVE'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">
            Complete Your Fellowship Enrollment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Settle the programme fee for your 24-week international research fellowship. Upon verified settlement, your order and course enrollment credentials will be generated.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Checkout Column: Payment Methods & Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Payment Method Category Tabs */}
            <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#121927] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8c6a1e]" />
                <span>Select Payment Method</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode, enabled: paymentConfig.supportedMethods.upi },
                  { id: 'indian_credit_card', label: 'Indian Credit Card', icon: CreditCard, enabled: paymentConfig.supportedMethods.indian_credit_card },
                  { id: 'indian_debit_card', label: 'Indian Debit Card', icon: CreditCard, enabled: paymentConfig.supportedMethods.indian_debit_card },
                  { id: 'international_credit_card', label: 'International Cards', icon: CreditCard, enabled: paymentConfig.supportedMethods.international_credit_card },
                  { id: 'net_banking', label: 'Net Banking', icon: Building2, enabled: paymentConfig.supportedMethods.net_banking },
                  { id: 'wallets', label: 'Wallets', icon: Wallet, enabled: paymentConfig.supportedMethods.wallets },
                  { id: 'emi', label: 'EMI Installments', icon: Calendar, enabled: paymentConfig.emiEnabled },
                  { id: 'financing', label: 'Education Financing', icon: GraduationCap, enabled: paymentConfig.financingEnabled }
                ].filter((m) => m.enabled).map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCategory(item.id as PaymentMethodCategory)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-[#121927] bg-[#121927] text-white shadow-sm font-semibold'
                          : 'border-[#e6e2d8] bg-white hover:bg-[#faf8f5] text-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#e5c36d]' : 'text-slate-600'}`} />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Category-Specific Form Views */}
              <div className="pt-4 border-t border-stone-100 text-xs">
                
                {/* UPI Flow */}
                {selectedCategory === 'upi' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-800">Pay via Instant UPI / QR</p>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">VPA / UPI ID</span>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="font-mono text-slate-900 bg-white p-1.5 border border-stone-200 rounded w-56 text-xs"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">GPay, PhonePe, Paytm</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Payment request will be routed through the configured payment gateway provider in sandbox mode.
                    </p>
                  </div>
                )}

                {/* Card Flow (Tokenized simulation, PCI Compliant, no raw storage) */}
                {(selectedCategory === 'indian_credit_card' ||
                  selectedCategory === 'indian_debit_card' ||
                  selectedCategory === 'international_credit_card' ||
                  selectedCategory === 'international_debit_card') && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {selectedCategory.includes('international') ? 'International Card Checkout' : 'Card Checkout'}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3 text-emerald-700" />
                        PCI-DSS Tokenized Field
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-600 font-medium block mb-0.5">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-medium block mb-0.5">Card Number (Hosted Field)</label>
                        <input
                          type="text"
                          value={cardNumberMasked}
                          onChange={(e) => setCardNumberMasked(e.target.value)}
                          className="w-full p-2 border border-stone-300 rounded bg-stone-50 font-mono text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-600 font-medium block mb-0.5">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded bg-white font-mono text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 font-medium block mb-0.5">CVV (Provider Tokenized)</label>
                          <input
                            type="password"
                            placeholder="•••"
                            className="w-full p-2 border border-stone-300 rounded bg-white font-mono text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      Zero sensitive card or CVV details are logged or stored. Authorization handled exclusively by payment gateway.
                    </p>
                  </div>
                )}

                {/* Net Banking Flow */}
                {selectedCategory === 'net_banking' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-800">Select Bank</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-2 rounded border text-left cursor-pointer ${
                            selectedBank === b ? 'border-slate-900 bg-stone-100 font-semibold' : 'border-stone-200'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wallets Flow */}
                {selectedCategory === 'wallets' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-800">Select Digital Wallet</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Amazon Pay', 'Paytm Wallet', 'MobiKwik'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedWallet(w)}
                          className={`p-2 rounded border text-left cursor-pointer ${
                            selectedWallet === w ? 'border-slate-900 bg-stone-100 font-semibold' : 'border-stone-200'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMI Flow (Requirement 9) */}
                {selectedCategory === 'emi' && (
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-slate-800">Provider-Calculated EMI Plans</p>
                      <p className="text-[11px] text-slate-500">
                        Monthly installment breakdown for ₹1,50,000 on participating bank cards.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {STANDARD_EMI_PLANS.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedEmiId(plan.id)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                            selectedEmiId === plan.id
                              ? 'border-slate-900 bg-stone-50 font-medium'
                              : 'border-stone-200 hover:bg-stone-50/50'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-slate-900 text-sm">
                              {plan.months} Months EMI
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Interest: {plan.interestRateAnnual}% p.a. · Processing Fee: ₹{plan.processingFee}
                            </span>
                            <span className="text-[10px] text-slate-400 block pt-0.5">
                              {plan.eligibilityConditions}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-sm font-bold text-slate-950 block">
                              ₹{plan.monthlyInstallment.toLocaleString('en-IN')}/mo
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Total: ₹{plan.totalPayable.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-slate-600 leading-relaxed">
                      <strong>EMI Transparency Notice:</strong> The final interest rate, monthly installment, processing fee and approval terms are determined by your card-issuing bank at checkout. UNSP University does not set bank interest rates.
                    </div>
                  </div>
                )}

                {/* Education Financing / Loans Flow (Requirements 10 & 11) */}
                {selectedCategory === 'financing' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <GraduationCap className="w-4 h-4 text-amber-800" />
                        <span>Explore Education Financing Partners</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {FINANCING_DISCLAIMER_TEXT}
                      </p>
                    </div>

                    {financingDispatched ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg space-y-2 text-center">
                        <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto" />
                        <h4 className="font-serif text-base font-bold text-emerald-950">
                          Financing Inquiry Dispatched to Partner
                        </h4>
                        <p className="text-[11px] text-emerald-900">
                          Your application has been routed to the selected financial provider. Their credit officer will contact you regarding documentation and underwriting.
                        </p>
                        <button
                          type="button"
                          onClick={() => setFinancingDispatched(false)}
                          className="px-3 py-1 bg-white border border-emerald-300 rounded text-[11px] font-semibold text-emerald-900 mt-2"
                        >
                          Submit Another Partner Request
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[11px] text-slate-700 font-semibold block">
                          Select Approved Financing Partner:
                        </label>

                        <div className="space-y-2">
                          {FINANCING_PROVIDERS.map((fp) => (
                            <div
                              key={fp.id}
                              onClick={() => setSelectedFinancingPartnerId(fp.id)}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors space-y-1 ${
                                selectedFinancingPartnerId === fp.id
                                  ? 'border-slate-900 bg-stone-50'
                                  : 'border-stone-200 hover:bg-stone-50/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-900">{fp.providerName}</span>
                                <span className="text-[10px] font-mono bg-stone-200/70 px-1.5 py-0.5 rounded text-slate-700">
                                  {fp.providerType}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600">{fp.eligibilityInfo}</p>
                              <div className="pt-1 text-[10px] text-slate-500">
                                Requirements: {fp.documentationRequirements.join(' · ')}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[11px] text-slate-600 block mb-0.5 font-medium">Financing Amount</label>
                            <input
                              type="text"
                              disabled
                              value="₹1,50,000 (Full Fee)"
                              className="w-full p-2 bg-stone-100 border border-stone-200 rounded font-mono text-slate-700 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-600 block mb-0.5 font-medium">Desired Tenure</label>
                            <select
                              value={financingTenure}
                              onChange={(e) => setFinancingTenure(Number(e.target.value))}
                              className="w-full p-2 bg-white border border-stone-300 rounded text-xs"
                            >
                              <option value={6}>6 Months</option>
                              <option value={12}>12 Months</option>
                              <option value={18}>18 Months</option>
                              <option value={24}>24 Months</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleApplyFinancing}
                          disabled={financingSubmitting}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs cursor-pointer disabled:opacity-50"
                        >
                          {financingSubmitting ? 'Routing to Financial Partner...' : 'Submit Financing Inquiry to Partner →'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Sandbox Simulation Panel (Requirements 5 & 34) */}
            <div className="p-4 bg-stone-100 border border-stone-300 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sandbox Testing Controls</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">ID: {paymentConfig.activeProvider.toUpperCase()}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Choose the simulated outcome to verify transaction handling, error states, and automatic Masteriyo course enrollment synchronization:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sim"
                    value="success"
                    checked={simulationOutcome === 'success'}
                    onChange={() => setSimulationOutcome('success')}
                  />
                  <span>Simulate Success</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sim"
                    value="failed"
                    checked={simulationOutcome === 'failed'}
                    onChange={() => setSimulationOutcome('failed')}
                  />
                  <span>Simulate Payment Failure</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sim"
                    value="cancelled"
                    checked={simulationOutcome === 'cancelled'}
                    onChange={() => setSimulationOutcome('cancelled')}
                  />
                  <span>Simulate Gateway Cancel</span>
                </label>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={simulateEnrollmentFailure}
                    onChange={(e) => setSimulateEnrollmentFailure(e.target.checked)}
                  />
                  <span>Test Requirement 22: Payment PAID, but LMS Enrollment Fails (Requires manual retry)</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary, Currency, Legal Terms & Action */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 text-xs">
              <h2 className="font-serif text-lg font-bold text-slate-950 border-b border-stone-100 pb-2">
                Order Summary
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Fellowship Programme
                  </span>
                  <p className="font-serif text-base font-bold text-slate-900 leading-snug">
                    {fellowshipTitle}
                  </p>
                  <span className="text-[11px] text-slate-500">24-Week International Supervised Research</span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-slate-600">Standard Programme Fee:</span>
                  <span className="font-mono font-bold text-slate-950 text-base">₹1,50,000</span>
                </div>

                {/* Currency Selector (Requirement 12) */}
                <div className="pt-2 border-t border-stone-100 space-y-1.5">
                  <label className="text-[11px] text-slate-600 font-medium block">
                    Display Currency (International Applicants):
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['INR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setSelectedCurrency(curr)}
                        className={`p-1.5 rounded text-[11px] border font-mono transition-colors cursor-pointer ${
                          selectedCurrency === curr
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                            : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                    Converted Total: <strong>{CURRENCY_CONVERSIONS[selectedCurrency].display}</strong> (Base: ₹1,50,000 INR)
                  </div>
                </div>

                {selectedCategory === 'emi' && selectedEmiPlan && (
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded space-y-1 text-[11px]">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>EMI Schedule ({selectedEmiPlan.months} Mo):</span>
                      <span className="font-mono">₹{selectedEmiPlan.monthlyInstallment.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Total Payable with Bank Interest: ₹{selectedEmiPlan.totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Billing Info Preview */}
              <div className="pt-3 border-t border-stone-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Fellow Candidate
                </span>
                <p className="font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-500 text-[11px]">{user?.email}</p>
                <p className="text-slate-500 text-[11px]">Country: {user?.country}</p>
              </div>

              {/* Terms Checkbox (Requirement 26) */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 leading-tight">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I have reviewed the programme terms, refund policy and fellowship disclaimer.
                  </span>
                </label>
              </div>

              {/* Proceed Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartPayment}
                  disabled={isProcessing || !termsAgreed}
                  className="w-full py-3 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isProcessing ? 'Verifying with Provider...' : 'Proceed Securely to Payment'}
                  </span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                256-bit TLS encrypted session. Protected by payment provider signature checks.
              </div>
            </div>

            {/* Mandatory Disclaimers Box (Requirement 28) */}
            <aside className="border border-amber-200 bg-amber-50/70 rounded-xl p-5 text-[11px] text-amber-950 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Payment & Financing Disclaimers</span>
              </div>
              <p>
                • <strong>Payment Processing:</strong> Payment processing, card authorization, EMI availability and financing approval are subject to the terms, eligibility requirements and policies of the respective payment or financing provider.
              </p>
              <p>
                • <strong>Financing:</strong> UNSP University does not guarantee approval of education financing or loans. Financing decisions are made independently by the relevant financial provider.
              </p>
              <p>
                • <strong>Academic Scope:</strong> {FELLOWSHIP_DISCLAIMER_TEXT}
              </p>
            </aside>

          </div>

        </div>

      </div>
    </div>
  );
};
