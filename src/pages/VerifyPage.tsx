import React, { useState, useEffect } from 'react';
import { lookupCertificate, INITIAL_CERTIFICATES } from '../data/certificates';
import { FellowshipCertificate } from '../types';
import { CertificateView } from '../components/CertificateView';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle,
  FileText,
  Calendar,
  Award
} from 'lucide-react';

interface VerifyPageProps {
  initialCertId?: string;
  navigate: (route: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ initialCertId, navigate }) => {
  const [certInput, setCertInput] = useState(initialCertId || '');
  const [searchedId, setSearchedId] = useState(initialCertId || '');
  const [result, setResult] = useState<FellowshipCertificate | null | 'NOT_FOUND'>(() => {
    if (initialCertId) {
      const match = lookupCertificate(initialCertId);
      return match || 'NOT_FOUND';
    }
    return null;
  });

  useEffect(() => {
    if (initialCertId) {
      setCertInput(initialCertId);
      setSearchedId(initialCertId);
      const match = lookupCertificate(initialCertId);
      setResult(match || 'NOT_FOUND');
    }
  }, [initialCertId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    const clean = certInput.trim();
    setSearchedId(clean);
    const match = lookupCertificate(clean);
    setResult(match || 'NOT_FOUND');
  };

  return (
    <div className="space-y-12 pb-20">
      <DisclaimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#e6e2d8] pb-6 space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8c6a1e] bg-[#b38a2c]/10 px-3 py-1 rounded-full border border-[#b38a2c]/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8c6a1e]" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121927]">
            Certificate Verification System
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Verify official completion records for UNSP University International Research Fellowships. Enter the unique Certificate ID printed on the credential.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. UNSP-IRF-2026-8841"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-stone-300 rounded-lg text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent uppercase shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            Verify Credential
          </button>
        </form>

        {/* Search Results Display */}
        {result === 'NOT_FOUND' && (
          <div className="border border-red-200 bg-red-50/70 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto">
            <XCircle className="w-10 h-10 text-red-700 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-red-950">
              Certificate Record Not Found
            </h2>
            <p className="text-xs text-red-900/90 leading-relaxed">
              No record matches Certificate ID <code className="font-mono font-bold">{searchedId}</code>. Please confirm the identifier from the physical or digital document.
            </p>
            <div className="pt-2 text-[11px] text-red-800 font-mono">
              Status: NOT FOUND · Registry Entry Does Not Exist
            </div>
          </div>
        )}

        {result && result !== 'NOT_FOUND' && (
          <div className="space-y-8">
            
            {/* Record Verification Summary Box */}
            <div className={`border rounded-xl p-6 sm:p-8 space-y-4 ${
              result.status === 'VALID'
                ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                : 'border-red-200 bg-red-50/40 text-red-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-stone-200/80">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75 block">
                    Verification Outcome
                  </span>
                  <h2 className="font-serif text-2xl font-bold">
                    Official Record Verified
                  </h2>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75 block">
                    Credential Status
                  </span>
                  <span className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded border ${
                    result.status === 'VALID'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-red-100 text-red-900 border-red-300'
                  }`}>
                    {result.status === 'VALID' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {result.status}
                  </span>
                </div>
              </div>

              {/* Exact fields required by prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Certificate ID</span>
                  <p className="font-mono font-semibold text-slate-900 text-sm">{result.certificateId}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Fellow Name</span>
                  <p className="font-semibold text-slate-900 text-sm font-serif italic">{result.fellowName}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Fellowship Programme</span>
                  <p className="font-medium text-slate-900">{result.fellowshipProgramme}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Issue Date</span>
                  <p className="font-medium text-slate-900">{result.issueDate}</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Research Title</span>
                  <p className="font-serif italic text-slate-900 text-sm">“{result.researchTitle}”</p>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] uppercase tracking-wider opacity-60 block">Classification</span>
                  <p className="text-slate-700 italic">
                    {result.programmeType}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Certificate Visual Render */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-900 text-center">
                Digital Credential Facsimile
              </h3>
              <CertificateView certificate={result} showPrintAction={true} />
            </div>

          </div>
        )}

        {/* Sample Verified Records */}
        <div className="border border-stone-200 rounded-xl p-6 bg-stone-50/50 space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900">
            Sample Verification IDs for Testing
          </h3>
          <p className="text-xs text-slate-600">
            Click any demo identifier below to inspect live validation rendering:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {INITIAL_CERTIFICATES.map((cert) => (
              <button
                key={cert.certificateId}
                onClick={() => {
                  setCertInput(cert.certificateId);
                  setSearchedId(cert.certificateId);
                  setResult(cert);
                }}
                className="text-left p-2.5 bg-white border border-stone-200 rounded-lg hover:border-slate-400 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-mono font-semibold text-slate-900 block">{cert.certificateId}</span>
                  <span className="text-[11px] text-slate-500">{cert.fellowName} · {cert.fellowshipProgramme.split('&')[0]}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  cert.status === 'VALID' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}>
                  {cert.status}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
