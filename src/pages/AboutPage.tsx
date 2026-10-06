import React from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { ShieldCheck, BookOpen, Globe2, Compass, Award } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 space-y-3">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
            Institutional Profile
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">
            About UNSP University
          </h1>
          <p className="font-serif text-lg text-amber-900/90 italic">
            Research. Innovation. Impact. Global Knowledge.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
            Advancing Knowledge. Conducting Research. Creating Global Impact through independent, interdisciplinary fellowship programmes designed for eligible researchers worldwide.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="border border-stone-200 rounded-xl p-6 bg-white space-y-3">
            <Globe2 className="w-6 h-6 text-slate-800" />
            <h2 className="font-serif text-xl font-bold text-slate-950">
              International Research Orientation
            </h2>
            <p className="text-slate-600 leading-relaxed">
              UNSP International Research Fellowship was founded to provide scholars, postgraduate students, and specialized practitioners with structured pathways to pursue high-standard academic monographs on critical contemporary challenges.
            </p>
          </div>

          <div className="border border-stone-200 rounded-xl p-6 bg-white space-y-3">
            <Compass className="w-6 h-6 text-slate-800" />
            <h2 className="font-serif text-xl font-bold text-slate-950">
              Interdisciplinary Inquiry
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Complex global issues—from algorithmic bias in foundation models to climate resilience and international humanitarian jurisprudence—require cross-disciplinary synthesis spanning law, science, governance, and computational technologies.
            </p>
          </div>
        </div>

        {/* Fellowship Purpose */}
        <section className="bg-white border border-stone-200 rounded-xl p-8 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-slate-950">
            The Fellowship Purpose
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              The primary purpose of the UNSP International Research Fellowship is to cultivate rigorous academic methodology, supervised writing discipline, and publication-ready research output.
            </p>
            <p>
              Fellows receive individualized faculty guidance, participate in milestone consultations, and complete a formal research monograph (8,000 to 12,000 words) meeting international peer-review standards.
            </p>
            <p>
              The fellowship operates with total transparency regarding institutional status and academic classification.
            </p>
          </div>
        </section>

        {/* Institutional Transparency & Recognition Statement */}
        <section className="border border-amber-200 bg-amber-50/70 rounded-xl p-8 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-900 text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
            <span>Institutional Governance & Recognition Statement</span>
          </div>

          <p className="text-amber-950 leading-relaxed font-medium">
            {FELLOWSHIP_DISCLAIMER_TEXT}
          </p>

          <p className="text-amber-900/90 leading-relaxed">
            UNSP University does not claim statutory government accreditation, university degree-granting authority under statutory commissions, or foreign diplomatic affiliation. Our fellowships are privately administered academic research initiatives focused entirely on the scholarly quality, originality, and peer-worthiness of the fellow's research monograph.
          </p>

          <div className="pt-2 text-amber-950 font-mono text-[11px]">
            Official Fellowship Portal: https://fellowship.unspuniversity.com/
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/fellowships')}
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            Explore the 13 Fellowship Curricula →
          </button>
        </div>

      </div>
    </div>
  );
};
