import React from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  Search,
  UserPlus,
  FileText,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Explore Fellowship',
      icon: Search,
      tag: 'Selection',
      summary: 'Review 13 specialized international research tracks and identify your research alignment.',
      details: [
        'Examine detailed syllabus, core modules, and specialized seminar tracks.',
        'Review research methodology approaches and expected monograph deliverables.',
        'Verify your academic eligibility and discipline background prerequisites.'
      ]
    },
    {
      num: '02',
      title: 'Register',
      icon: UserPlus,
      tag: 'Profile Creation',
      summary: 'Create your international researcher account on the UNSP portal.',
      details: [
        'Complete researcher profile with academic degrees and institutional affiliations.',
        'Declare your disciplinary background and prior publication or research history.',
        'Access protected applicant workspace and application draft tools.'
      ]
    },
    {
      num: '03',
      title: 'Submit Application',
      icon: FileText,
      tag: 'Academic Submission',
      summary: 'Provide your research proposal, statement of purpose, and academic credentials.',
      details: [
        'Formulate proposed research area, working title, and expected outcomes.',
        'Draft 500–800 word statement of purpose outlining research significance.',
        'Attach curriculum vitae and relevant academic writing sample.'
      ]
    },
    {
      num: '04',
      title: 'Application Review',
      icon: ClipboardCheck,
      tag: 'Committee Review',
      summary: 'Independent academic review committee conducts peer assessment.',
      details: [
        'Evaluation of scholarly merit, methodological feasibility, and topic originality.',
        'Assessment of candidate qualifications and alignment with fellowship capacity.',
        'Decision issued within 7–10 academic days: Approved, Revision, or Additional Info.'
      ]
    },
    {
      num: '05',
      title: 'Approval & Payment',
      icon: CreditCard,
      tag: 'Enrollment Formalization',
      summary: 'Upon formal selection, settle the transparent programme fee.',
      details: [
        'Standard Programme Fee: ₹1,50,000 for the entire 24-week engagement.',
        'No payment is requested prior to formal academic application acceptance.',
        'Official invoice and student enrollment credentials generated.'
      ]
    },
    {
      num: '06',
      title: 'Fellowship & Research',
      icon: BookOpen,
      tag: '24-Week Research',
      summary: 'Undertake supervised investigation, literature review, and milestone consultations.',
      details: [
        'Phase 1: Foundations & Formal Proposal Defense (Weeks 1–4).',
        'Phase 2: Literature Synthesis & Methodological Modeling (Weeks 5–12).',
        'Phase 3: Empirical Investigation & Draft Monograph (Weeks 13–18).',
        'Continuous advisory review and milestone feedback with faculty mentor.'
      ]
    },
    {
      num: '07',
      title: 'Evaluation & Certificate',
      icon: Award,
      tag: 'Monograph Defense',
      summary: 'Monograph peer review and issuance of digitally verifiable credentials.',
      details: [
        'Defense and submission of 8,000–12,000 word research monograph.',
        'Evaluation against 4 criteria: Rigor, Originality, Structure, and Advisory Progress.',
        'Award of UNSP Fellowship Certificate verifiable at fellowship.unspuniversity.com/verify.'
      ]
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#e6e2d8] pb-8 space-y-3 text-center max-w-3xl mx-auto">
          <span className="eyebrow text-xs uppercase tracking-widest text-[#8c6a1e] font-semibold block">
            Fellowship Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121927]">
            How the Fellowship Works
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            A structured, 7-step academic journey designed for scholars, postgraduates, and multidisciplinary researchers worldwide.
          </p>
        </div>

        {/* 7-Step Process Cards */}
        <div className="space-y-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-white border border-[#e6e2d8] rounded-xl p-6 sm:p-8 hover:border-[#b38a2c]/60 transition-colors shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                {/* Number & Icon */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-bold text-[#121927]">
                      {st.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#f3f0e8] flex items-center justify-center text-[#121927]">
                      <Icon className="w-5 h-5 text-[#8c6a1e]" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c6a1e] bg-[#b38a2c]/10 px-2.5 py-1 rounded">
                    {st.tag}
                  </span>
                </div>

                {/* Main Content */}
                <div className="md:col-span-9 space-y-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#121927]">
                    {st.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {st.summary}
                  </p>

                  <ul className="pt-2 space-y-1.5 text-xs text-slate-600">
                    {st.details.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#b38a2c] font-mono">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="bg-[#f3f0e8] border border-[#e6e2d8] rounded-xl p-8 sm:p-10 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#121927]">
            Ready to Begin Your Research Monograph?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Applications are accepted on a rolling admissions basis. Explore our 13 specialized tracks or proceed directly to registration.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => navigate('/apply')}
              className="px-6 py-3 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Start Your Application →
            </button>
            <button
              onClick={() => navigate('/fellowships')}
              className="px-5 py-3 text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Explore 13 Fellowships
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
