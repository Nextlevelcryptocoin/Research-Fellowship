import React from 'react';
import { FELLOWSHIPS, FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';
import { Shield, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#121927] text-[#faf8f5] pt-16 pb-12 border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                UNSP University
              </span>
              <p className="text-sm font-medium text-slate-400">
                UNSP International Research Fellowship
              </p>
            </div>

            <p className="text-xs italic text-amber-300/90 font-serif">
              Research. Innovation. Impact. Global Knowledge.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Advance Knowledge. Conduct Research. Create Global Impact. Dedicated to providing independent scholars, doctoral candidates, and multidisciplinary practitioners with rigorous academic methodology, milestone mentorship, and international research validation.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Official Portal:</span>
                <span className="text-slate-200">https://fellowship.unspuniversity.com/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Student LMS:</span>
                <span className="text-slate-200">https://student.unspuniversity.com/</span>
              </div>
            </div>
          </div>

          {/* Col 3: Fellowship Programmes 1-7 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Fellowships (I)
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              {FELLOWSHIPS.slice(0, 7).map((fel) => (
                <li key={fel.id}>
                  <button
                    onClick={() => navigate(`/fellowships/${fel.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {fel.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Fellowship Programmes 8-13 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Fellowships (II)
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              {FELLOWSHIPS.slice(7, 13).map((fel) => (
                <li key={fel.id}>
                  <button
                    onClick={() => navigate(`/fellowships/${fel.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {fel.title}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => navigate('/fellowships')}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  View All 13 Programmes →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Verification */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Academic & Legal
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/verify')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify Certificate</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/research')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Research Centre</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/academic-integrity')} className="hover:text-white transition-colors">
                  Academic Integrity
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/research-ethics')} className="hover:text-white transition-colors">
                  Research Ethics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ai-use-policy')} className="hover:text-white transition-colors">
                  AI Use in Research Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-policy')} className="hover:text-white transition-colors">
                  Fee & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/payment-support')} className="hover:text-white transition-colors">
                  Payment, EMI & Financing FAQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-request')} className="hover:text-white transition-colors">
                  Request Fee Refund
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship-disclaimer')} className="hover:text-white transition-colors">
                  Fellowship Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency Box */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Institutional Governance & Recognition Statement</span>
          </div>
          <p className="leading-relaxed">
            {FELLOWSHIP_DISCLAIMER_TEXT}
          </p>
          <p className="text-[11px] text-slate-500">
            Programme Fee: ₹1,50,000 per fellowship track. Applications are evaluated on scholarly merit, proposal coherence, and academic background.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} UNSP University. All rights reserved. International Research Fellowship Division.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/terms')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-300 transition-colors">
              Academic Secretariat
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
