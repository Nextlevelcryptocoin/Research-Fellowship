import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFellowship } from '../context/FellowshipContext';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { FINANCING_PROVIDERS, FINANCING_DISCLAIMER_TEXT } from '../data/financingPartners';
import {
  requestPaymentApi,
  type AuthoritativePaymentStatus
} from '../services/stripeCheckout';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle,
  GraduationCap,
  AlertTriangle,
  ArrowLeft,
  Lock
} from 'lucide-react';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { userApplication, submitFinancingApplication } = useFellowship();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFinancingPartnerId, setSelectedFinancingPartnerId] = useState(
    FINANCING_PROVIDERS[0].id
  );
  const [financingTenure, setFinancingTenure] = useState(12);
  const [financingSubmitting, setFinancingSubmitting] = useState(false);
  const [financingDispatched, setFinancingDispatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentApiStatus, setPaymentApiStatus] = useState<AuthoritativePaymentStatus | null>(null);
  const returnedFromStripe = new URLSearchParams(window.location.search).get('payment') === 'return';

  const applicationId = userApplication?.id;
  const applicationStatus = paymentApiStatus?.applicationStatus;
  const isEligible = applicationStatus === 'Submitted' || applicationStatus === 'Approved';
  const isPaid = paymentApiStatus?.paymentStatus === 'paid';
  const amountMinor = paymentApiStatus?.feeAmountMinor;
  const currency = paymentApiStatus?.feeCurrency || 'INR';
  const fellowshipTitle = paymentApiStatus?.fellowshipName || userApplication?.fellowshipTitle;

  useEffect(() => {
    if (!applicationId) return;

    let active = true;
    let pollTimer: number | undefined;
    let attempts = 0;
    setPaymentApiStatus(null);
    setErrorMessage(null);

    const refreshStatus = async () => {
      try {
        const result = await requestPaymentApi<AuthoritativePaymentStatus>(
          `/api/payment/status?applicationId=${encodeURIComponent(applicationId)}`
        );
        if (!active) return;
        setPaymentApiStatus(result);
        setErrorMessage(null);

        if (
          returnedFromStripe &&
          result.paymentStatus === 'pending' &&
          attempts < 20
        ) {
          attempts += 1;
          pollTimer = window.setTimeout(refreshStatus, 3000);
        }
      } catch (error) {
        if (!active) return;
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to read payment status.'
        );
      }
    };

    void refreshStatus();
    return () => {
      active = false;
      if (pollTimer !== undefined) window.clearTimeout(pollTimer);
    };
  }, [applicationId, returnedFromStripe]);

  if (!paymentApiStatus && applicationId && !errorMessage) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <CreditCard className="w-12 h-12 text-slate-500 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Checking Payment Eligibility
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Payment eligibility is being verified against your application record.
        </p>
      </div>
    );
  }

  if (!isEligible && !isPaid) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-700 mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Payment Not Yet Available
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Only applications with the server-side status Submitted or Approved are eligible for fellowship fee payment.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Current Application Status: {applicationStatus || 'Draft'}
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
    if (!applicationId) {
      setErrorMessage('Submit an application before starting payment.');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await requestPaymentApi<{ url?: string; error?: string }>(
        '/api/stripe/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify({ applicationId })
        }
      );
      if (!result.url) {
        throw new Error('The secure payment service did not return a Checkout URL.');
      }

      const checkoutUrl = new URL(result.url);
      if (
        checkoutUrl.protocol !== 'https:' ||
        (checkoutUrl.hostname !== 'checkout.stripe.com' &&
          !checkoutUrl.hostname.endsWith('.stripe.com'))
      ) {
        throw new Error('The secure payment service returned an invalid Checkout URL.');
      }
      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Payment initiation failed.'
      );
      setIsProcessing(false);
    }
  };

  const handleApplyFinancing = async () => {
    if (!applicationId || amountMinor === undefined) {
      setErrorMessage('A server-verified application and fee are required for a financing inquiry.');
      return;
    }

    setFinancingSubmitting(true);
    const partner =
      FINANCING_PROVIDERS.find((provider) => provider.id === selectedFinancingPartnerId) ||
      FINANCING_PROVIDERS[0];
    try {
      await submitFinancingApplication({
        providerId: partner.id,
        providerName: partner.providerName,
        amount: amountMinor / 100,
        tenureMonths: financingTenure,
        notes: `Financing inquiry for application ${applicationId}.`
      });
      setFinancingDispatched(true);
    } catch {
      setErrorMessage('Financing inquiry could not be submitted.');
    } finally {
      setFinancingSubmitting(false);
    }
  };

  const formatFee = (minor: number | undefined, code: string) => {
    if (minor === undefined) return 'Loading server-configured fee…';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0
    }).format(minor / 100);
  };

  if (isPaid || (returnedFromStripe && paymentApiStatus?.paymentStatus === 'pending')) {
    const isPending = !isPaid;
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        {isPaid ? (
          <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto" />
        ) : (
          <CreditCard className="w-12 h-12 text-amber-700 mx-auto" />
        )}
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          {isPaid ? 'Payment Received' : 'Payment Processing'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {isPaid
            ? 'Payment received successfully. Your application is now awaiting formal review.'
            : 'Stripe has returned you to the application. We are checking the verified server payment status; this page does not confirm payment.'}
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Payment Status: {paymentApiStatus?.paymentStatus || 'Checking'}
        </p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800"
        >
          Return to Fellow Dashboard
        </button>
        {isPending && (
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-stone-100 rounded-lg hover:bg-stone-200 ml-2"
          >
            Check Payment Status
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Dashboard</span>
        </button>

        <div className="border-b border-stone-200 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
              {applicationStatus === 'Submitted'
                ? 'Application Submitted'
                : 'Fellowship Fee Payment'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              STRIPE HOSTED CHECKOUT
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">
            {applicationStatus === 'Submitted'
              ? 'Application Submitted'
              : 'Complete Your Fellowship Fee Payment'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            {applicationStatus === 'Submitted'
              ? 'Your application has been successfully submitted. You can now pay the fellowship fee.'
              : 'Your application is eligible for the fellowship fee payment. You may proceed to secure checkout while your application is in an eligible status. Eligible application statuses: Submitted or Approved.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#121927] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8c6a1e]" />
                <span>Secure payment with Stripe</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Card details are entered only on Stripe-hosted Checkout. They are never collected or stored by this application.
              </p>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-700">
                <span className="font-semibold block text-slate-900">Fellowship Programme</span>
                <span>{fellowshipTitle || 'Loading application…'}</span>
                <span className="font-mono font-bold block mt-2 text-slate-950">
                  {formatFee(amountMinor, currency)}
                </span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>The server validates your signed-in identity, application eligibility, and fee before creating a Checkout Session.</span>
              </div>
            </div>

            {paymentApiStatus && (
              <div className="bg-white border border-[#e6e2d8] rounded-xl p-6 space-y-4 shadow-xs">
                <h2 className="font-serif text-lg font-bold text-[#121927] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#8c6a1e]" />
                  <span>Education financing inquiry</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {FINANCING_DISCLAIMER_TEXT}
                </p>
                {financingDispatched ? (
                  <p className="text-xs text-emerald-800">
                    Your financing inquiry was recorded for administrative follow-up. This is not a payment or loan approval.
                  </p>
                ) : (
                  <>
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Financing partner
                      <select
                        value={selectedFinancingPartnerId}
                        onChange={(event) => setSelectedFinancingPartnerId(event.target.value)}
                        className="mt-1 w-full p-2 border border-stone-300 rounded bg-white"
                      >
                        {FINANCING_PROVIDERS.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.providerName}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Requested tenure
                      <select
                        value={financingTenure}
                        onChange={(event) => setFinancingTenure(Number(event.target.value))}
                        className="mt-1 w-full p-2 border border-stone-300 rounded bg-white"
                      >
                        {[6, 12, 18, 24].map((months) => (
                          <option key={months} value={months}>{months} months</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={handleApplyFinancing}
                      disabled={financingSubmitting}
                      className="w-full py-2.5 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-lg disabled:opacity-50"
                    >
                      {financingSubmitting ? 'Submitting inquiry…' : 'Submit financing inquiry'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
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
                    {fellowshipTitle || 'Loading application…'}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-slate-600">Server-configured fee:</span>
                  <span className="font-mono font-bold text-slate-950 text-base">
                    {formatFee(amountMinor, currency)}
                  </span>
                </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
                    <span className="text-slate-600">Application status:</span>
                    <span className="font-medium text-slate-900">{applicationStatus || 'Checking'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">Payment status:</span>
                    <span className="font-medium text-slate-900">
                      {paymentApiStatus?.paymentStatus || (errorMessage ? 'Unavailable' : 'Checking')}
                    </span>
                  </div>
                </div>

              <div className="pt-3 border-t border-stone-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Applicant
                </span>
                <p className="font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-500 text-[11px]">{user?.email}</p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 leading-tight">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(event) => setTermsAgreed(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>I have reviewed the programme terms, refund policy and fellowship disclaimer.</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                disabled={
                  isProcessing ||
                  !termsAgreed ||
                  amountMinor === undefined ||
                  !applicationId ||
                  !isEligible ||
                  isPaid
                }
                className="w-full py-3 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{isProcessing ? 'Connecting to Stripe…' : 'Pay Fellowship Fee'}</span>
              </button>
              {paymentApiStatus?.paymentStatus === 'pending' && (
                <p className="text-[11px] text-amber-800">
                  A Checkout Session is pending. Continuing will resume that session; a second payment will not be created.
                </p>
              )}
            </div>

            <aside className="border border-amber-200 bg-amber-50/70 rounded-xl p-5 text-[11px] text-amber-950 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Payment & Fellowship Disclaimer</span>
              </div>
              <p>{FELLOWSHIP_DISCLAIMER_TEXT}</p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
