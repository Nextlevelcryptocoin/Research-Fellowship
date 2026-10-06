import React, { useState } from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface FAQPageProps {
  navigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1, 2]);

  const faqs = [
    {
      q: 'Who can apply for the UNSP International Research Fellowship?',
      a: 'The fellowship is open to eligible postgraduates, doctoral researchers, university faculty, legal practitioners, software engineers, policy specialists, and multidisciplinary scholars worldwide who hold at least a recognized Bachelor’s or Master’s degree and demonstrate strong academic curiosity.'
    },
    {
      q: 'What is the fellowship?',
      a: 'UNSP International Research Fellowship is a privately administered, 24-week structured research fellowship programme. Fellows conduct in-depth scholarly inquiry in one of 13 emerging disciplines, working under structured academic milestones to author an 8,000–12,000 word supervised research monograph.'
    },
    {
      q: 'What is the programme fee?',
      a: 'The programme fee is ₹1,50,000 per fellowship track. This covers the full 24-week academic curriculum, milestone consultations, peer review evaluation, and digital certificate verification.'
    },
    {
      q: 'Is this fellowship a university degree or Ph.D.?',
      a: 'No. The fellowship is not a university degree, Ph.D., master’s degree, or statutory academic diploma. It is a privately administered international research fellowship resulting in an official Fellowship Completion Certificate.'
    },
    {
      q: 'Is this programme government-accredited or UN-affiliated?',
      a: 'No. UNSP International Research Fellowship does not claim government accreditation, UGC recognition, or formal affiliation with the United Nations or any national ministry of education. It is an independent, privately administered scholarly initiative.'
    },
    {
      q: 'How does the research project work?',
      a: 'Fellows identify an original research gap within their chosen track, submit a 10-point research proposal, synthesize contemporary peer-reviewed literature, design a rigorous methodology, and produce an 8,000–12,000 word monograph meeting academic publication standards.'
    },
    {
      q: 'How does mentorship work?',
      a: 'Fellows are guided through four structured review milestones by experienced academic researchers and subject matter specialists. Consultations include proposal critique, methodological auditing, and draft review.'
    },
    {
      q: 'How is the certificate verified?',
      a: 'Each issued certificate contains a permanent unique Certificate ID and URL verifiable at https://fellowship.unspuniversity.com/verify/[ID]. Anyone can check the verification ledger to confirm fellow name, programme track, issue date, and validity status (VALID or REVOKED).'
    },
    {
      q: 'Can international applicants apply from outside India?',
      a: 'Yes. The fellowship operates digitally and welcomes eligible researchers from all nations across Europe, Asia, the Americas, Africa, and Oceania. All research materials, seminars, and submissions are in academic English.'
    },
    {
      q: 'How does payment work?',
      a: 'No payment is required during initial application. Once an applicant’s proposal and qualifications have been reviewed and accepted by the academic committee, an official invoice for ₹1,50,000 is issued. Payment channels include UPI, Indian debit/credit cards, Net banking, and international credit cards.'
    },
    {
      q: 'What happens after submitting an application?',
      a: 'The Academic Review Committee evaluates your submission within 7 to 10 working days. If accepted, you will receive an offer letter and instructions to finalize enrollment, after which your supervisory orientation begins.'
    },
    {
      q: 'How long does the programme take to complete?',
      a: 'The standard fellowship duration is 24 weeks (approximately 6 calendar months), structured across four progressive phases of 4 to 6 weeks each.'
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
            Admissions & Governance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Transparent answers regarding fellowship eligibility, institutional status, fee structure, and academic expectations.
          </p>
        </div>

        {/* FAQs Accordion */}
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

        {/* Mandatory Transparency Box */}
        <aside className="border border-amber-200 bg-amber-50/80 rounded-xl p-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-800" />
            <span>Fellowship Academic Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            {FELLOWSHIP_DISCLAIMER_TEXT}
          </p>
        </aside>

        {/* Still Have Questions */}
        <div className="text-center pt-2 space-y-2">
          <p className="text-xs text-slate-600">
            Need further clarification regarding your academic background or research area?
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Contact Academic Secretariat →
          </button>
        </div>

      </div>
    </div>
  );
};
