import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { FELLOWSHIP_DISCLAIMER_TEXT } from '../data/fellowships';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  return (
    <aside
      aria-label="Institutional Legal Disclaimer"
      className={`border-y border-amber-200/80 bg-amber-50/70 text-amber-950 ${
        compact ? 'py-2.5 px-4 text-xs' : 'py-4 px-6 text-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-amber-900 leading-relaxed">
            Institutional Fellowship Transparency Notice
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            {FELLOWSHIP_DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </aside>
  );
};
