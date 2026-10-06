import React, { useState } from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  HelpCircle,
  CreditCard,
  RefreshCw,
  Calendar,
  GraduationCap,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface PaymentSupportPageProps {
  navigate: (route: string) => void;
}

export const PaymentSupportPage: React.FC<PaymentSupportPageProps> = ({ navigate }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const faqs = [
    {
      q: 'What happens if my payment fails?',
      a: 'If a transaction fails, your card or account is not debited, and the application remains in "Approved / Payment Pending" status. You will receive an error notice from the payment provider (e.g. insufficient limit, 3D Secure timeout, or bank block). You can safely re-attempt payment with another card, UPI, or Net Banking without creating duplicate orders.',
      category: 'failed'
    },
    {
      q: 'Can I pay by international credit card?',
      a: 'Yes. The checkout system supports international Visa, Mastercard, and American Express cards. Payments can be viewed in USD, EUR, or GBP, with base settlement calibrated to ₹1,50,000 INR.',
      category: 'cards'
    },
    {
      q: 'Are EMI options available?',
      a: 'Yes. 3, 6, 9, and 12-month EMI plans are available through participating credit and debit cards. Monthly installments, bank interest rates, and processing fees are calculated by the payment gateway and displayed transparently prior to authorization.',
      category: 'emi'
    },
    {
      q: 'Can I apply for education financing or loans?',
      a: 'Yes. Eligible candidates can explore third-party education financing through independent partners (such as GrayQuest, Propelld, or Prodigy Finance). Applications are underwritten independently by the financial partner.',
      category: 'financing'
    },
    {
      q: 'Who approves education financing?',
      a: 'Financing decisions are made exclusively by the participating financial provider or NBFC, based on their independent credit appraisal, KYC documentation, and income criteria. UNSP University does not review credit files, approve loans, or guarantee financing.',
      category: 'financing'
    },
    {
      q: 'How long does course enrollment take after payment?',
      a: 'Course enrollment is automated. Upon verified webhook signature from the payment provider, the system confirms your order, registers your profile in the Masteriyo LMS, and enables fellowship workspace access within minutes.',
      category: 'enrollment'
    },
    {
      q: 'How do I request a refund?',
      a: 'If you need to withdraw prior to the commencement of Phase 1 supervisory consultations (within 7 days of fee settlement), you may submit a formal request at /refund-request under the published UNSP Fee & Refund Policy.',
      category: 'refund'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Admissions & Billing Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Payment, EMI & Financing Help Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Guidance for fee settlement, payment provider troubleshooting, card authorizations, installment plans, and refund requests.
          </p>
        </div>

        {/* Quick Help Topics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1">
            <CreditCard className="w-4 h-4 text-slate-700" />
            <p className="font-semibold text-slate-900">Supported Methods</p>
            <p className="text-[11px] text-slate-500">UPI, Cards, Net Banking, EMI, Financing</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1">
            <Calendar className="w-4 h-4 text-slate-700" />
            <p className="font-semibold text-slate-900">EMI Plans</p>
            <p className="text-[11px] text-slate-500">3 to 12 months on eligible bank cards</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1">
            <GraduationCap className="w-4 h-4 text-slate-700" />
            <p className="font-semibold text-slate-900">Education Loans</p>
            <p className="text-[11px] text-slate-500">Independent partner underwriting</p>
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-1">
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <p className="font-semibold text-slate-900">Refund Requests</p>
            <p className="text-[11px] text-slate-500">80% refund prior to Phase 1 orientation</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left p-5 text-xs sm:text-sm font-semibold text-slate-900 bg-stone-50/40 hover:bg-stone-100/60 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 text-xs sm:text-sm text-slate-700 bg-white leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Box */}
        <div className="p-6 bg-stone-100 border border-stone-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 text-sm">Need Help with an In-Flight Payment?</p>
            <p className="text-slate-600">
              Our financial support desk assists with failed authorizations, receipt generation, and banking inquiries.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Contact Billing Support →
          </button>
        </div>

      </div>
    </div>
  );
};
