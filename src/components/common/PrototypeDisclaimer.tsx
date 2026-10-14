import React from 'react';
import { Info, Bus, Building2, Compass } from 'lucide-react';
import { AppLanguage, AppMode } from '../../types';

interface PrototypeDisclaimerProps {
  language?: AppLanguage;
  mode?: AppMode;
}

export const PrototypeDisclaimer: React.FC<PrototypeDisclaimerProps> = ({ language = 'en', mode = 'passenger' }) => {
  const iconColor =
    mode === 'authority'
      ? 'text-blue-400'
      : mode === 'landing'
      ? 'text-teal-400'
      : 'text-emerald-400';

  const badgeColor =
    mode === 'authority'
      ? 'bg-blue-950/80 text-blue-300 border-blue-800'
      : mode === 'landing'
      ? 'bg-teal-950/80 text-teal-300 border-teal-800'
      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800';

  return (
    <aside
      aria-label="Prototype notice"
      className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2">
        <Info className={`w-3.5 h-3.5 ${iconColor} shrink-0`} />
        <span className="font-semibold text-white">
          {language === 'ta'
            ? 'ரூட்ஐக்யூ (RouteIQ) முன்மாதிரி · 32 தமிழக மாவட்டங்கள்'
            : 'RouteIQ Prototype · All 32 Tamil Nadu Districts'}
        </span>
        <span className="hidden sm:inline text-slate-400">
          {language === 'ta'
            ? '— பயணிகள் நெரிசல் கணிப்பு, எஃப்சி சான்றிதழ் விவரங்கள் மற்றும் மிஸ்ஸ்ட் பஸ் 100% ரீஃபண்ட் மாதிரி செயல்விளக்கம்.'
            : '— Predictions, FC compliance, and 100% missed bus refund demonstration models.'}
        </span>
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        <span className={`hidden md:inline font-mono px-2 py-0.5 rounded text-[11px] border ${badgeColor}`}>
          {mode === 'authority'
            ? 'Network Operations Command (v3.0)'
            : mode === 'landing'
            ? 'Dual-Persona Gateway (v3.0)'
            : 'Tamil Nadu Passenger Mobility (v3.0)'}
        </span>
      </div>
    </aside>
  );
};

