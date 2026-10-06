import React, { useRef } from 'react';
import { FellowshipCertificate } from '../types';
import { ShieldCheck, Award, Printer, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface CertificateViewProps {
  certificate: FellowshipCertificate;
  showPrintAction?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  showPrintAction = true
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isValid = certificate.status === 'VALID';
  const isRevoked = certificate.status === 'REVOKED';

  return (
    <div className="space-y-4">
      {showPrintAction && (
        <div className="flex justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / Save Official Certificate (PDF)</span>
          </button>
        </div>
      )}

      {/* Certificate Frame */}
      <div
        ref={certRef}
        className={`relative bg-[#FAF8F5] text-slate-900 border-8 border-double border-stone-400 p-8 sm:p-14 rounded-sm shadow-xl print:shadow-none print:border-stone-800 max-w-4xl mx-auto overflow-hidden ${
          isRevoked ? 'opacity-90 grayscale-[30%]' : ''
        }`}
      >
        {/* Subtle Ornamental Inner Border */}
        <div className="absolute inset-2 sm:inset-3 border border-stone-300 pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-dashed border-stone-200 pointer-events-none" />

        {/* Revoked watermark if applicable */}
        {isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="border-8 border-red-700 text-red-700 font-serif text-6xl font-bold uppercase tracking-widest px-8 py-4 -rotate-24 opacity-30 select-none">
              REVOKED
            </div>
          </div>
        )}

        {/* Certificate Content */}
        <div className="relative z-10 text-center space-y-6">
          
          {/* Header & Crest */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-amber-300 mb-1 shadow-sm">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 uppercase">
              UNSP University
            </h1>
            <p className="text-xs sm:text-sm tracking-widest uppercase font-medium text-slate-600">
              International Research Fellowship
            </p>
            <p className="text-[11px] font-serif italic text-stone-500">
              Research · Innovation · Impact · Global Knowledge
            </p>
          </div>

          <div className="w-32 h-[1px] bg-stone-300 mx-auto" />

          {/* Award Text */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-stone-500">
              This is to certify that
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-950 italic">
              {certificate.fellowName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
              has satisfactorily completed all research milestones, methodological deliverables, and the supervised research monograph required under the
            </p>
            <p className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              {certificate.fellowshipProgramme}
            </p>
            <p className="text-xs text-stone-600">
              {certificate.programmeType}
            </p>
          </div>

          {/* Research Project Monograph */}
          <div className="my-6 py-4 px-6 bg-stone-100/70 border border-stone-200/80 rounded max-w-2xl mx-auto text-left">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 mb-1">
              Supervised Research Monograph
            </p>
            <p className="font-serif text-sm sm:text-base text-slate-900 italic font-medium leading-snug">
              “{certificate.researchTitle}”
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2 text-xs border-t border-stone-200">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                Certificate ID
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {certificate.certificateId}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                Issue Date
              </span>
              <span className="text-slate-800 font-medium">
                {certificate.issueDate}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                Verification Status
              </span>
              <span
                className={`font-semibold inline-flex items-center gap-1 ${
                  isValid ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {isValid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {certificate.status}
              </span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 grid grid-cols-2 gap-8 max-w-lg mx-auto items-end text-center">
            <div className="border-t border-stone-400 pt-2 space-y-0.5">
              <div className="font-serif italic text-base font-semibold text-slate-800">
                Dr. Alistair Vance
              </div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500">
                Director of Academic Research
              </p>
              <p className="text-[9px] text-stone-400">UNSP University</p>
            </div>

            <div className="border-t border-stone-400 pt-2 space-y-0.5">
              <div className="font-serif italic text-base font-semibold text-slate-800">
                Prof. S. R. Thorne
              </div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500">
                Dean of Fellowship Board
              </p>
              <p className="text-[9px] text-stone-400">UNSP University</p>
            </div>
          </div>

          {/* Verification URL & Transparency Note */}
          <div className="pt-6 border-t border-stone-200/60 text-[10px] text-stone-500 space-y-1">
            <p className="font-mono text-stone-600">
              Verify online: {certificate.verificationUrl}
            </p>
            <p className="max-w-2xl mx-auto leading-relaxed text-[9px] text-stone-400">
              UNSP International Research Fellowship is a privately administered research fellowship programme. It is not, by itself, a university degree, government qualification or government-accredited academic award.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
