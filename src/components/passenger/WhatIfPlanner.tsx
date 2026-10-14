import React, { useState } from 'react';
import { WhatIfPredictionPoint, AppLanguage, ThemeMode } from '../../types';
import { getCrowdHex } from '../../services/predictionEngine';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound, playSuccessSound } from '../../services/soundEffects';
import {
  Sparkles,
  TrendingDown,
  Check,
} from 'lucide-react';

interface WhatIfPlannerProps {
  whatIfPoints: WhatIfPredictionPoint[];
  currentDepartureTime: string;
  onApplyTime: (timeStr: string) => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const WhatIfPlanner: React.FC<WhatIfPlannerProps> = ({
  whatIfPoints,
  currentDepartureTime,
  onApplyTime,
  language = 'en',
  theme = 'light',
}) => {
  // Default to 6:30 PM (index 5) or matching point
  const [selectedIndex, setSelectedIndex] = useState<number>(5);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const selectedPoint = whatIfPoints[selectedIndex] || whatIfPoints[0];
  const baseline5PM = whatIfPoints.find((p) => p.timeStr === '5:00 PM') || whatIfPoints[2] || whatIfPoints[0];

  // Crowd reduction compared to 5:00 PM peak
  const crowdReduction = baseline5PM.crowdPercent - selectedPoint.crowdPercent;
  const reductionPercentage = Math.round((crowdReduction / baseline5PM.crowdPercent) * 100);

  const hex = getCrowdHex(selectedPoint.level);

  const handleApply = () => {
    playSuccessSound();
    // Convert e.g. "6:30 PM" to "18:30"
    const [tm, mer] = selectedPoint.timeStr.split(' ');
    const [h, m] = tm.split(':');
    let hourNum = parseInt(h, 10);
    if (mer === 'PM' && hourNum < 12) hourNum += 12;
    if (mer === 'AM' && hourNum === 12) hourNum = 0;
    const time24 = `${hourNum.toString().padStart(2, '0')}:${m}`;

    onApplyTime(time24);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Predictive Shift Simulator</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          🔮 {t.whatIfPlanner}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore how delaying departure away from institutional closing peak drops your expected commute congestion.
        </p>
      </div>

      {/* Main Interactive Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Departure Time Slider Control */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Alternate Departure Time (4:00 PM – 9:00 PM)
            </label>
            <span className="text-base font-extrabold font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
              {selectedPoint.timeStr}
            </span>
          </div>

          {/* Range Slider */}
          <div className="relative py-4">
            <input
              type="range"
              min={0}
              max={whatIfPoints.length - 1}
              step={1}
              value={selectedIndex}
              onChange={(e) => {
                playClickSound();
                setSelectedIndex(parseInt(e.target.value, 10));
              }}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
            />

            {/* Time labels below slider */}
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
              {whatIfPoints.map((p, idx) => (
                <button
                  key={p.timeStr}
                  onClick={() => {
                    playClickSound();
                    setSelectedIndex(idx);
                  }}
                  className={`transition-colors hidden sm:block ${
                    idx === selectedIndex
                      ? 'font-bold text-purple-700 dark:text-purple-400'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.timeStr}
                </button>
              ))}
              <span className="sm:hidden text-slate-500">4:00 PM</span>
              <span className="sm:hidden text-slate-500">9:00 PM</span>
            </div>
          </div>
        </div>

        {/* Current Selection Summary Card */}
        <div
          className={`grid sm:grid-cols-4 gap-4 p-5 rounded-2xl border mb-6 ${
            theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className="text-xs text-slate-500 block mb-1">{t.departureTime}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {selectedPoint.timeStr}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-1">{t.predictedCrowd}</span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-2xl font-extrabold font-mono"
                style={{ color: hex }}
              >
                {selectedPoint.crowdPercent}%
              </span>
              <span className="text-xs font-semibold capitalize" style={{ color: hex }}>
                {selectedPoint.level === 'low' && '🟢 Low'}
                {selectedPoint.level === 'moderate' && '🟡 Moderate'}
                {selectedPoint.level === 'high' && '🟠 High'}
                {selectedPoint.level === 'critical' && '🔴 Critical'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-1">{t.waitingTime}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {selectedPoint.waitingTimeMin}
              </span>
              <span className="text-xs text-slate-500">min</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-1">{t.travelTime}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {selectedPoint.travelTimeMin}
              </span>
              <span className="text-xs text-slate-500">min</span>
            </div>
          </div>
        </div>

        {/* Highlight Insight Box */}
        <div
          className={`p-4 rounded-xl border text-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            theme === 'dark'
              ? 'bg-purple-950/40 border-purple-800 text-purple-200'
              : 'bg-purple-50 border-purple-200 text-purple-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold">
                {crowdReduction > 0 ? (
                  <>
                    Leaving at {selectedPoint.timeStr} could reduce expected crowding by approximately{' '}
                    <span className="underline decoration-purple-400 font-extrabold font-mono text-emerald-400">
                      {reductionPercentage}%
                    </span>{' '}
                    compared to peak 5:00 PM rush.
                  </>
                ) : (
                  <>You are currently viewing the peak departure window (5:00 PM).</>
                )}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                Calculated dynamically from peak college closing departures and transit frequency tables.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-purple-900/60 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span>
                {crowdReduction > 0 ? `-${crowdReduction}% crowd drop` : 'Peak Load'}
              </span>
            </div>
          </div>
        </div>

        {/* Use This Time Action Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            Current journey setting: <span className="font-mono font-bold text-slate-900 dark:text-white">{currentDepartureTime}</span>
          </div>

          <button
            onClick={handleApply}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
              appliedNotification
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {appliedNotification ? (
              <>
                <Check className="w-4 h-4" />
                <span>Time Applied to Journey!</span>
              </>
            ) : (
              <>
                <span>Use This Time ({selectedPoint.timeStr})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
