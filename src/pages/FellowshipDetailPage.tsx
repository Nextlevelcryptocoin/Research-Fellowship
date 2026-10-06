import React, { useState } from 'react';
import { getFellowshipBySlug } from '../data/fellowships';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Award,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';

interface FellowshipDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
}

export const FellowshipDetailPage: React.FC<FellowshipDetailPageProps> = ({ slug, navigate }) => {
  const fellowship = getFellowshipBySlug(slug);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!fellowship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">
          Fellowship Track Not Found
        </h2>
        <p className="text-sm text-slate-600">
          The requested fellowship programme slug "{slug}" does not exist in the 2026 academic catalog.
        </p>
        <button
          onClick={() => navigate('/fellowships')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to All 13 Fellowships
        </button>
      </div>
    );
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/fellowships')}
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All 13 Fellowships</span>
          </button>
        </div>

        {/* Hero Header */}
        <header className="border-b border-[#e6e2d8] pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>UNSP International Research Fellowship</span>
            <span>/</span>
            <span>2026 Academic Cohort</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#121927] tracking-tight leading-[1.15]">
            {fellowship.title}
          </h1>

          <p className="font-serif text-lg text-[#8c6a1e] italic font-medium">
            {fellowship.tagline}
          </p>

          <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
            {fellowship.overview}
          </p>

          {/* Key Facts Ribbon */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#f3f0e8] border border-[#e6e2d8] rounded-xl p-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                Duration
              </span>
              <span className="font-medium text-[#121927]">
                {fellowship.duration}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                Programme Fee
              </span>
              <span className="font-mono font-bold text-[#121927] text-sm">
                {fellowship.fee}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                Format
              </span>
              <span className="font-medium text-[#121927]">
                Supervised Research Monograph
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                Validation
              </span>
              <span className="font-medium text-[#121927]">
                Digital Verifiable Certificate
              </span>
            </div>
          </div>

          {/* Quick Apply Call to Action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(`/apply?fellowship=${fellowship.slug}`)}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#121927] hover:bg-[#1e293b] rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Apply for this Fellowship</span>
              <ArrowRight className="w-4 h-4 text-[#d8b04c]" />
            </button>

            <button
              onClick={() => navigate('/research')}
              className="px-5 py-3 text-xs font-semibold text-[#121927] bg-white border border-[#e6e2d8] hover:border-[#121927] rounded-lg transition-colors cursor-pointer"
            >
              Explore Research Centre Workspace
            </button>
          </div>
        </header>

        {/* Section 1: Research Areas & Learning Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>Priority Research Areas</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              {fellowship.researchAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono shrink-0">0{i + 1}.</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-700" />
              <span>Learning & Scholarly Outcomes</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              {fellowship.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section 2: Programme Structure & Phases */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Curricular Progression
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-950">
              Programme Structure (24-Week Schedule)
            </h2>
            <p className="text-xs text-slate-600">
              The research fellowship is organized across four distinct chronological phases ensuring academic depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {fellowship.programmeStructure.map((st, i) => (
              <div key={i} className="border border-stone-200 rounded-lg p-4 space-y-2 bg-stone-50/50">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  {st.duration}
                </span>
                <h3 className="font-serif text-sm font-bold text-slate-900">
                  {st.phase}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Core Modules & Specialised Research Module */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Module Architecture
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-950">
              Core Modules & Specialised Research
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                Foundational Core Modules:
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {fellowship.coreModules.map((mod, i) => (
                  <li key={i} className="p-3 bg-stone-50 border border-stone-100 rounded-lg">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Module {i + 1}:
                    </span>
                    {mod}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-900">
                  Specialised Advanced Seminar Module:
                </h3>
                <p className="font-serif text-base font-semibold text-slate-900 leading-snug">
                  {fellowship.specialisedResearchModule}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Dedicated in-depth investigation led by advisory milestone feedback and individualized research critique.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl p-5 space-y-2 bg-stone-50/30">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                  Methodology & Epistemology:
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {fellowship.researchMethodology.map((m, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Research Project, Mentorship, Evaluation & Certificate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Research Project Deliverables */}
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Research Project Deliverables</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {fellowship.researchProject.description}
            </p>
            <div className="space-y-2 pt-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Required Milestones (Target: {fellowship.researchProject.wordCountTarget}):
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {fellowship.researchProject.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-mono">·</span>
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Mentorship & Evaluation */}
          <section className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-700" />
              <span>Mentorship & Evaluation Criteria</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {fellowship.mentorship}
            </p>
            <div className="space-y-2 pt-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Scholarly Assessment Weights:
              </p>
              <ul className="space-y-1 text-xs text-slate-700">
                {fellowship.evaluation.criteria.map((cr, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">›</span>
                    <span>{cr}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 pt-2 font-mono">
                {fellowship.evaluation.passingGrade}
              </p>
            </div>
          </section>
        </div>

        {/* Section 5: Admission Prerequisites & Eligibility */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-950">
            Eligibility & Application Requirements
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {fellowship.eligibility.map((el, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6: Programme Fee Notice */}
        <section className="bg-stone-50 border border-stone-300 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 block">
                Standard Fellowship Fee
              </span>
              <p className="font-serif text-3xl font-bold text-slate-950 font-mono">
                {fellowship.fee}
              </p>
              <p className="text-xs text-slate-600">
                Programme Fee: ₹1,50,000 (Covers 24 weeks of academic mentorship, research evaluation & certificate verification)
              </p>
            </div>

            <button
              onClick={() => navigate(`/apply?fellowship=${fellowship.slug}`)}
              className="px-6 py-3 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Start Application →
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Future payment channels will support UPI, Indian debit/credit cards, Net banking, and international cards through approved payment gateways. No payment is collected until your application and research proposal have undergone preliminary review and formal selection.
          </p>
        </section>

        {/* Section 7: FAQs */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-700" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {fellowship.faq.map((item, i) => (
              <div key={i} className="border border-stone-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-4 text-xs font-semibold text-slate-900 bg-stone-50/50 hover:bg-stone-100/50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  <span className="font-mono text-slate-400">
                    {openFaqIndex === i ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === i && (
                  <div className="p-4 text-xs text-slate-600 bg-white leading-relaxed border-t border-stone-100">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Disclaimer */}
        <aside className="border border-amber-200 bg-amber-50/80 rounded-xl p-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-800" />
            <span>Fellowship Academic & Recognition Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            {fellowship.disclaimer}
          </p>
        </aside>

      </div>
    </div>
  );
};
