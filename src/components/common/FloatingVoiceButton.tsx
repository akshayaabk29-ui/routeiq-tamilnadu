import React from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { AppLanguage, ThemeMode, AppMode } from '../../types';
import { playClickSound } from '../../services/soundEffects';

interface FloatingVoiceButtonProps {
  onOpenVoiceAssistant: () => void;
  language: AppLanguage;
  theme: ThemeMode;
  mode?: AppMode;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({
  onOpenVoiceAssistant,
  language,
  theme,
  mode = 'passenger',
}) => {
  const labelMap: Record<AppLanguage, string> = {
    ta: 'AI குரல் உதவியாளர்',
    hi: 'AI वॉयस असिस्टेंट',
    kn: 'AI ಧ್ವನಿ ಸಹಾಯಕ',
    ml: 'AI വോയ്‌സ് അസിസ്റ്റന്റ്',
    te: 'AI వాయిస్ అసిస్టెంట్',
    en: mode === 'authority' ? 'Operations Voice AI' : 'AI Voice Assistant',
  };

  const gradientClass =
    mode === 'authority'
      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 ring-blue-400/40 shadow-blue-500/20'
      : mode === 'landing'
      ? 'bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 hover:from-indigo-500 hover:via-teal-500 hover:to-emerald-500 ring-teal-400/40 shadow-teal-500/20'
      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 ring-emerald-400/40 shadow-emerald-500/20';

  const pulseClass =
    mode === 'authority'
      ? 'bg-blue-500/30'
      : mode === 'landing'
      ? 'bg-teal-500/30'
      : 'bg-emerald-500/30';

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        type="button"
        onClick={() => {
          playClickSound(840);
          onOpenVoiceAssistant();
        }}
        className={`group relative flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full text-white font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 transition-all focus:outline-none ring-2 ${gradientClass}`}
        title="Open RouteIQ AI Voice Assistant"
      >
        {/* Animated radar pulse ring */}
        <span className={`absolute -inset-1 rounded-full ${pulseClass} animate-ping pointer-events-none`} />

        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
          <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
        </div>

        <span className="relative tracking-wide font-extrabold">
          {labelMap[language] || (mode === 'authority' ? 'Operations Voice AI' : 'AI Voice Assistant')}
        </span>

        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
      </button>
    </div>
  );
};

