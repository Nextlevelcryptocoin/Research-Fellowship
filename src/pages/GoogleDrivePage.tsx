/**
 * UNSP University International Research Fellowship
 * Dedicated Google Drive Repository Page (/drive)
 */

import React from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GoogleDriveExplorer } from '../components/GoogleDriveExplorer';
import { HardDrive, ArrowLeft, ShieldCheck, Sparkles, BookOpen, FileCheck } from 'lucide-react';

interface GoogleDrivePageProps {
  navigate: (route: string) => void;
}

export const GoogleDrivePage: React.FC<GoogleDrivePageProps> = ({ navigate }) => {
  return (
    <div className="space-y-10 pb-20">
      <DisclaimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/research')}
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Research Centre Workspace</span>
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-[#e6e2d8] pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8c6a1e]">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Workspace 1P Integration</span>
            <span>·</span>
            <span>Cloud Storage Repository</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">
            Google Drive Research Repository
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Synchronize, organize, and store your fellowship monograph chapters, empirical datasets, and literature review files with Google Drive.
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-[#e6e2d8] p-4 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#121927] font-semibold font-serif text-sm">
              <BookOpen className="w-4 h-4 text-[#b38a2c]" />
              <span>Monograph Versioning</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Export and version markdown and document drafts of your 8,000–12,000 word fellowship monograph.
            </p>
          </div>

          <div className="bg-white border border-[#e6e2d8] p-4 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#121927] font-semibold font-serif text-sm">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Institutional Folder</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Automatic creation and synchronization with the dedicated "UNSP Research Fellowship" Drive directory.
            </p>
          </div>

          <div className="bg-white border border-[#e6e2d8] p-4 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#121927] font-semibold font-serif text-sm">
              <ShieldCheck className="w-4 h-4 text-[#8c6a1e]" />
              <span>User-Authorized Privacy</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Tokens are stored strictly in-memory per session. Your Google account credentials remain secure.
            </p>
          </div>
        </div>

        {/* Main Drive Explorer */}
        <GoogleDriveExplorer defaultTitle="UNSP International Research Repository" />

      </div>
    </div>
  );
};
