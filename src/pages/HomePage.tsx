import React from 'react';
import { FELLOWSHIPS } from '../data/fellowships';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  Users,
  Award,
  Search,
  Globe,
  Layers,
  Sparkles,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

import heroLibraryImage from '../assets/images/hero_academic_library.jpg';
import humanRightsImage from '../assets/images/human_rights_chamber.jpg';
import researchSeminarImage from '../assets/images/research_seminar.jpg';
import researchCentreImage from '../assets/images/unsp_research_centre_1791285839247.jpg';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const steps = [
    { num: '01', title: 'Explore Fellowship', desc: 'Select from 13 specialized international research tracks matching your academic focus.' },
    { num: '02', title: 'Register', desc: 'Create your international researcher account with academic qualifications and credentials.' },
    { num: '03', title: 'Submit Application', desc: 'Complete the structured application with statement of purpose, CV, and research scope.' },
    { num: '04', title: 'Application Review', desc: 'Independent academic review committee assesses scholarly merit and research feasibility.' },
    { num: '05', title: 'Approval & Payment', desc: 'Upon selection, settle the transparent programme fee of ₹1,50,000 via secure channels.' },
    { num: '06', title: 'Fellowship & Research', desc: '24 weeks of supervised research development, milestone reviews, and advisory dialogue.' },
    { num: '07', title: 'Evaluation & Certificate', desc: 'Final monograph evaluation and issuance of digitally verifiable fellowship certificate.' }
  ];

  return (
    <div className="space-y-16 lg:space-y-20 bg-[#faf8f5] text-[#121927]">
      {/* Institutional Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Hero Section: Authentic Earlier Dark Academic Navy Background with Library Image Overlay */}
      <section className="relative overflow-hidden bg-[#121927] text-white border-b border-[#1e293b]">
        {/* Background Library Image & Academic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroLibraryImage}
            alt="UNSP University Research Library"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121927] via-[#121927]/90 to-[#121927]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl space-y-6">
            
            {/* Badges / Brand Sub-heading */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs uppercase tracking-widest text-[#d8b04c] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d8b04c] animate-pulse" />
                <span>UNSP University · International Division</span>
              </div>
              <span className="text-xs bg-[#b38a2c]/20 text-[#e5c36d] px-2.5 py-0.5 rounded font-mono border border-[#b38a2c]/40 font-semibold">
                Programme Fee: ₹1,50,000
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              UNSP International Research Fellowship
            </h1>

            {/* Taglines */}
            <p className="font-serif text-xl sm:text-2xl text-[#e5c36d] italic font-medium">
              Research. Innovation. Impact. Global Knowledge.
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-balance">
              Advance Knowledge. Conduct Research. Create Global Impact. A prestigious 24-week supervised research fellowship for postgraduates, doctoral candidates, and interdisciplinary professionals investigating critical global challenges.
            </p>

            {/* Programme Structure Key Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#d8b04c]" />
                13 Research Specialisations
              </span>
              <span>·</span>
              <span>24 Weeks Supervised Research</span>
              <span>·</span>
              <span>Peer-Reviewed Monograph</span>
              <span>·</span>
              <span className="text-[#e5c36d] font-mono font-semibold">Fee: ₹1,50,000</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => navigate('/fellowships')}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#b38a2c] hover:bg-[#8c6a1e] text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Explore Fellowships</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/apply')}
                className="px-6 py-3.5 border border-white/30 hover:border-white text-white font-medium text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                Apply Now
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-5 py-3.5 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Student Login →
              </button>
            </div>

            {/* Secondary Action Anchors */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <button
                onClick={() => navigate('/how-it-works')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#d8b04c]" />
                <span>How It Works</span>
              </button>
              <button
                onClick={() => navigate('/research')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d8b04c]" />
                <span>Research Centre</span>
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#d8b04c]" />
                <span>Verify Certificate</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-[#e6e2d8] bg-white py-8 -mt-16 lg:-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">13</p>
            <p className="text-xs text-[#6b7280] uppercase tracking-wider mt-1">Research Specialisations</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">24 Weeks</p>
            <p className="text-xs text-[#6b7280] uppercase tracking-wider mt-1">Supervised Curriculum</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">₹1,50,000</p>
            <p className="text-xs text-[#6b7280] uppercase tracking-wider mt-1">Transparent Programme Fee</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">100%</p>
            <p className="text-xs text-[#6b7280] uppercase tracking-wider mt-1">Digitally Verifiable</p>
          </div>
        </div>
      </section>

      {/* Flagship Spotlight Section: Human Rights & International Law (Using earlier human_rights_chamber.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#e6e2d8] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[440px] bg-[#121927]">
            <img
              src={humanRightsImage}
              alt="International Human Rights Assembly"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="eyebrow text-xs text-[#e5c36d]">Flagship Research Track</span>
              <p className="font-serif text-2xl font-bold mt-1">Human Rights & International Law</p>
              <p className="text-xs text-slate-300 mt-1 font-mono">Fee: ₹1,50,000 · 24 Weeks Structured Research</p>
            </div>
          </div>
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8c6a1e] bg-[#b38a2c]/10 px-2.5 py-1 rounded">
                  Track Highlight
                </span>
                <span className="text-xs text-slate-500">Supervised Monograph & Treaty Analysis</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121927]">
                Advancing Multilateral Legal Scholarship & Humanitarian Frameworks
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Conduct deep comparative legal analyses, statutory interpretations, and human rights treaty impact assessments under academic advisory review. Fellows produce scholarly monographs ready for conference dissemination and journal review.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b38a2c] shrink-0" />
                  <span>Geneva Conventions & IHL Enforcement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b38a2c] shrink-0" />
                  <span>Digital Human Rights & AI Surveillance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b38a2c] shrink-0" />
                  <span>International Criminal Tribunal Precedents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#b38a2c] shrink-0" />
                  <span>Climate Refugees & Extraterritorial Law</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-[#f3f0e8]">
              <button
                onClick={() => navigate('/fellowships/human-rights-and-international-law')}
                className="px-5 py-2.5 bg-[#121927] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                View Track Details
              </button>
              <button
                onClick={() => navigate('/apply?fellowship=human-rights-and-international-law')}
                className="px-5 py-2.5 bg-white border border-[#e6e2d8] hover:border-[#121927] text-[#121927] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply for Track
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13 Fellowship Programmes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6e2d8] pb-6">
          <div className="space-y-1">
            <span className="eyebrow text-xs uppercase tracking-widest text-[#8c6a1e] font-semibold">
              Curricular Tracks
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#121927]">
              13 International Fellowship Programmes
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Each fellowship provides structured modules, dedicated research advisory review, and publication-ready monograph outcomes.
            </p>
          </div>
          <button
            onClick={() => navigate('/fellowships')}
            className="text-xs font-semibold text-[#121927] hover:text-[#8c6a1e] transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>Explore All 13 Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FELLOWSHIPS.map((fel, index) => (
            <article
              key={fel.id}
              onClick={() => navigate(`/fellowships/${fel.slug}`)}
              className="bg-white border border-[#e6e2d8] rounded-xl p-6 hover:border-[#b38a2c]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="font-semibold text-[#8c6a1e]">Track {String(index + 1).padStart(2, '0')}</span>
                  <span>{fel.duration.split(' ')[0]} {fel.duration.split(' ')[1]}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#121927] group-hover:text-[#8c6a1e] transition-colors">
                  {fel.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {fel.overview}
                </p>

                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                    Core Specialisation:
                  </p>
                  <p className="line-clamp-1 italic text-slate-600">
                    {fel.specialisedResearchModule}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#f3f0e8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                    Programme Fee
                  </span>
                  <span className="font-mono font-semibold text-[#121927] text-sm">
                    {fel.fee}
                  </span>
                </div>
                <span className="font-semibold text-[#8c6a1e] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Syllabus →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Visual 7-Step Process: How It Works */}
      <section className="bg-[#f3f0e8]/50 py-16 border-y border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="eyebrow text-xs uppercase tracking-widest text-[#8c6a1e] font-semibold">
              Structured Fellowship Journey
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#121927]">
              How the Fellowship Works
            </h2>
            <p className="text-sm text-slate-600">
              From application to supervised monograph defense and international certificate verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.slice(0, 4).map((s) => (
              <div key={s.num} className="bg-white border border-[#e6e2d8] rounded-xl p-6 space-y-3 shadow-xs">
                <span className="font-mono text-xl font-bold text-[#b38a2c]">
                  {s.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#121927]">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.slice(4).map((s) => (
              <div key={s.num} className="bg-white border border-[#e6e2d8] rounded-xl p-6 space-y-3 shadow-xs">
                <span className="font-mono text-xl font-bold text-[#8c6a1e]">
                  {s.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#121927]">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/how-it-works')}
              className="px-6 py-2.5 text-xs font-semibold text-[#121927] bg-white border border-[#e6e2d8] rounded-lg hover:border-[#121927] transition-colors shadow-xs cursor-pointer"
            >
              Explore Detailed 7-Step Workflow & Milestones →
            </button>
          </div>
        </div>
      </section>

      {/* Research Centre Spotlight: High-Tech Lab & Academic Seminar (Using earlier research_seminar.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121927] text-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-lg">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d8b04c] font-semibold block">
                Scholarly Workspace
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                UNSP Research Centre
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                A dedicated digital environment guiding fellows through the end-to-end scientific workflow: Literature Review, Research Gap Analysis, Methodology Design, Data Analysis, and Academic Monograph Drafting.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
              <div className="border border-white/10 p-2.5 rounded bg-white/5">
                <span className="text-[#e5c36d] block font-semibold mb-0.5">Phase I</span>
                Literature Matrix & Gap
              </div>
              <div className="border border-white/10 p-2.5 rounded bg-white/5">
                <span className="text-[#e5c36d] block font-semibold mb-0.5">Phase II</span>
                Methodology & Ethics
              </div>
              <div className="border border-white/10 p-2.5 rounded bg-white/5">
                <span className="text-[#e5c36d] block font-semibold mb-0.5">Phase III</span>
                Monograph & Defense
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/research')}
                className="px-6 py-3 text-xs font-semibold text-[#121927] bg-[#d8b04c] hover:bg-[#b38a2c] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Access Research Centre →
              </button>
              <button
                onClick={() => navigate('/academic-integrity')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Academic Integrity Guidelines
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-full min-h-[320px]">
            <img
              src={researchSeminarImage}
              alt="UNSP University International Research Fellows Seminar"
              className="w-full h-full object-cover min-h-[320px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Verification Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-[#e6e2d8] bg-white rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-[#121927] font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Digital Certificate Verification System</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#121927]">
              Instant Global Credential Validation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every completed fellowship monograph generates an official certificate registered on the institutional ledger at <code className="bg-[#f3f0e8] px-1 py-0.5 rounded text-[#121927]">https://fellowship.unspuniversity.com/verify/[ID]</code>. Prospective employers and academic institutions can verify completion records in real time.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/verify')}
              className="px-5 py-2.5 text-xs font-semibold text-[#121927] bg-[#faf8f5] border border-[#e6e2d8] hover:border-[#121927] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Verify a Certificate
            </button>
            <button
              onClick={() => navigate('/verify/UNSP-IRF-2026-8841')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#121927] hover:bg-[#1e293b] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              View Sample Record
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
