import React, { useState } from 'react';
import { CrowdAlert, AppLanguage, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound } from '../../services/soundEffects';
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface SurgeAlertsProps {
  alerts: CrowdAlert[];
  onSelectAlternative: () => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const SurgeAlerts: React.FC<SurgeAlertsProps> = ({
  alerts,
  onSelectAlternative,
  language = 'en',
  theme = 'light',
}) => {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Moderate'>('All');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'All') return true;
    return a.severity === filter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.crowdAlerts}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Predictive warnings for rapidly escalating passenger bottlenecks across the network.
          </p>
        </div>

        {/* Filters */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['All', 'Critical', 'High', 'Moderate'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => {
                playClickSound();
                setFilter(sev);
              }}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all ${
                filter === sev
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div
            className={`rounded-2xl border p-12 text-center text-slate-500 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">No active alerts in this category</p>
            <p className="text-xs mt-1">All monitored transit corridors operating within nominal thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const isHigh = alert.severity === 'High';
            const delta = alert.expectedCrowd30m - alert.currentCrowd;

            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                  theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                } ${
                  isCritical
                    ? 'border-rose-400/80 ring-2 ring-rose-500/10'
                    : isHigh
                    ? 'border-orange-400/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {alert.routeNumber}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : isHigh
                            ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {alert.routeName}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-500">
                    Updated {alert.lastUpdated}
                  </span>
                </div>

                {/* Progress Comparison */}
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl border mb-4 ${
                    theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-xs text-slate-500 block">Current Occupancy</span>
                    <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
                      {alert.currentCrowd}%
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Expected in 30 Mins</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xl font-bold font-mono ${
                          isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'
                        }`}
                      >
                        {alert.expectedCrowd30m}%
                      </span>
                      <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{delta}%
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs text-slate-500 block">Surge Severity</span>
                    <span className="text-sm font-bold font-mono uppercase text-slate-800 dark:text-slate-200">
                      {alert.severity} Risk
                    </span>
                  </div>
                </div>

                {/* Surge Reasons */}
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Contributing Surge Reasons:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.reasons.map((r, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendation & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-500">System Recommendation: </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {alert.recommendation}
                    </strong>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectAlternative();
                    }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <span>View Alternative Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
