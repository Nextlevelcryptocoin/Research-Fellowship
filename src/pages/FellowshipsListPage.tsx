import React, { useState } from 'react';
import { FELLOWSHIPS } from '../data/fellowships';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Search, ArrowRight, BookOpen, Clock, Filter } from 'lucide-react';

interface FellowshipsListPageProps {
  navigate: (route: string) => void;
}

export const FellowshipsListPage: React.FC<FellowshipsListPageProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filteredFellowships = FELLOWSHIPS.filter((fel) => {
    const matchesSearch =
      fel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fel.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fel.researchAreas.some((area) => area.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag === 'tech') {
      return (
        fel.slug.includes('artificial-intelligence') ||
        fel.slug.includes('quantum') ||
        fel.slug.includes('blockchain') ||
        fel.slug.includes('cybersecurity')
      );
    }
    if (selectedTag === 'policy') {
      return (
        fel.slug.includes('human-rights') ||
        fel.slug.includes('peace') ||
        fel.slug.includes('gender') ||
        fel.slug.includes('space')
      );
    }
    if (selectedTag === 'environment') {
      return (
        fel.slug.includes('sustainable') ||
        fel.slug.includes('climate') ||
        fel.slug.includes('public-health')
      );
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-16">
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-[#e6e2d8] pb-8 space-y-3">
          <span className="eyebrow text-xs uppercase tracking-widest text-[#8c6a1e] font-semibold block">
            Academic Catalog · 2026 Cohorts
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121927]">
            13 International Research Fellowships
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Select a specialized fellowship track to review syllabus modules, faculty oversight, admission prerequisites, and research monograph guidelines. Each track is a structured 24-week international academic engagement.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-600 font-mono">
            <span>Programme Fee: <strong className="text-[#121927] font-semibold">₹1,50,000</strong></span>
            <span>·</span>
            <span>Duration: <strong>24 Weeks (6 Months)</strong></span>
            <span>·</span>
            <span>Privately Administered</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Interactive filter tabs (functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-[#f3f0e8] border border-[#e6e2d8] rounded-lg">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-white text-[#121927] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-[#121927]'
              }`}
            >
              All 13 Tracks
            </button>
            <button
              onClick={() => setSelectedTag('tech')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTag === 'tech'
                  ? 'bg-white text-[#121927] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-[#121927]'
              }`}
            >
              Technology & AI
            </button>
            <button
              onClick={() => setSelectedTag('policy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTag === 'policy'
                  ? 'bg-white text-[#121927] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-[#121927]'
              }`}
            >
              Law & Policy
            </button>
            <button
              onClick={() => setSelectedTag('environment')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTag === 'environment'
                  ? 'bg-white text-[#121927] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-[#121927]'
              }`}
            >
              Climate & Health
            </button>
          </div>

          {/* Search Input */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search research topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

        </div>

        {/* Fellowships Grid */}
        {filteredFellowships.length === 0 ? (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-xl space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-900">
              No Fellowship Matches Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No programmes match your filter keywords. Try searching for broader terms like "AI", "Policy", or "Climate".
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFellowships.map((fel, index) => (
              <article
                key={fel.id}
                onClick={() => navigate(`/fellowships/${fel.slug}`)}
                className="bg-white border border-[#e6e2d8] rounded-xl p-6 hover:border-[#b38a2c]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-[#8c6a1e]">Track {String(index + 1).padStart(2, '0')}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      24 Weeks
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#121927] group-hover:text-[#8c6a1e] transition-colors">
                    {fel.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {fel.overview}
                  </p>

                  <div className="pt-2 space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      Core Specialisation
                    </p>
                    <p className="text-xs text-slate-700 italic line-clamp-2">
                      {fel.specialisedResearchModule}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-slate-500">
                    <span>{fel.researchAreas[0]}</span>
                    <span>·</span>
                    <span>{fel.researchAreas[1]}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#f3f0e8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Programme Fee
                    </span>
                    <span className="font-mono font-semibold text-[#121927] text-sm">
                      {fel.fee}
                    </span>
                  </div>
                  <span className="font-semibold text-[#8c6a1e] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Full Syllabus →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
