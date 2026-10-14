import React, { useState } from 'react';
import { TransportStop, AppLanguage, ThemeMode } from '../../types';
import {
  HOURLY_NETWORK_DATA,
  ROUTE_NETWORK_OVERVIEW,
} from '../../data/mockTransportData';
import { getCrowdHex } from '../../services/predictionEngine';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound } from '../../services/soundEffects';
import {
  Filter,
  ArrowUpRight,
  ExternalLink,
  FileCheck,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface AuthorityDashboardProps {
  stops: TransportStop[];
  onOpenStopDetails: (stop: TransportStop) => void;
  onNavigateToOptimizer: () => void;
  onNavigateToMap: () => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  stops,
  onOpenStopDetails,
  onNavigateToOptimizer,
  onNavigateToMap,
  language = 'en',
  theme = 'light',
}) => {
  const [dayFilter, setDayFilter] = useState<'weekday' | 'weekend'>('weekday');
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'rain'>('rain');
  const [viewMode, setViewMode] = useState<'predicted' | 'historical' | 'both'>('both');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Filtered hourly data based on selected filters
  const hourlyData = HOURLY_NETWORK_DATA.map((item) => {
    let multiplier = 1.0;
    if (dayFilter === 'weekend') multiplier *= 0.78;
    if (weatherCondition === 'rain') multiplier *= 1.12;

    const baseH = Math.round(item.historical * (dayFilter === 'weekend' ? 0.8 : 1.0));
    const baseP = Math.round(item.predicted * multiplier);

    return {
      ...item,
      adjustedHistorical: Math.min(100, baseH),
      adjustedPredicted: Math.min(100, baseP),
    };
  });

  // Critical stops for table (Section 14)
  const criticalStops = [
    stops.find((s) => s.id === 'stop-central-bus-stand') || stops[11],
    stops.find((s) => s.id === 'stop-hope-college') || stops[6],
    stops.find((s) => s.id === 'stop-railway-station') || stops[8],
    stops.find((s) => s.id === 'stop-gandhipuram') || stops[12],
    stops.find((s) => s.id === 'stop-singanallur') || stops[10],
  ].filter(Boolean) as TransportStop[];

  // Chart dimensions
  const chartHeight = 220;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  const pointsHist = hourlyData.map((d, idx) => {
    const x = padding.left + (idx / (hourlyData.length - 1)) * usableWidth;
    const y = padding.top + (1 - d.adjustedHistorical / 100) * usableHeight;
    return { x, y, d };
  });

  const pointsPred = hourlyData.map((d, idx) => {
    const x = padding.left + (idx / (hourlyData.length - 1)) * usableWidth;
    const y = padding.top + (1 - d.adjustedPredicted / 100) * usableHeight;
    return { x, y, d };
  });

  const pathHist = pointsHist.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const pathPred = pointsPred.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.authorityCenter}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t.authoritySubtitle}
          </p>
        </div>

        {/* Global Authority Quick Jump */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              onNavigateToOptimizer();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <span>{t.optimizer}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              playClickSound();
              onNavigateToMap();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors shadow-2xs ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.cityMap}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs text-slate-500 block mb-1">{t.activeRoutesCount}</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">42</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">100% Telemetry Online</span>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs text-slate-500 block mb-1">{t.monitoredStopsCount}</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">128</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Sensors active</span>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark'
              ? 'bg-rose-950/30 border-rose-900/60'
              : 'bg-rose-50/40 border-rose-200'
          }`}
        >
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold block mb-1">{t.criticalRoutesCount}</span>
          <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">5</span>
          <span className="text-[11px] text-rose-500 block mt-0.5">Crowd &gt; 85%</span>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark'
              ? 'bg-orange-950/30 border-orange-900/60'
              : 'bg-orange-50/40 border-orange-200'
          }`}
        >
          <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold block mb-1">Crowded Stops</span>
          <span className="text-2xl font-extrabold font-mono text-orange-600 dark:text-orange-400">8</span>
          <span className="text-[11px] text-orange-500 block mt-0.5">Platform dwell surge</span>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark'
              ? 'bg-amber-950/30 border-amber-900/60'
              : 'bg-amber-50/40 border-amber-200'
          }`}
        >
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block mb-1">{t.peakSurgeRisk}</span>
          <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">3</span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-0.5">Next 30 min window</span>
        </div>

        <div
          className={`p-4 rounded-2xl border shadow-2xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-xs text-slate-500 block mb-1">Avg Network Crowd</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">58%</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Moderate load</span>
        </div>
      </div>

      {/* Fleet FC Compliance & Safety Inspection Summary */}
      <div
        className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Fleet Fitness Certificate (FC)</span>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
              97.6% Compliant (125/128)
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">RTO TN-38 Certified Valid</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Vehicle Quality & Sanitization</span>
            <span className="text-base font-extrabold font-mono text-amber-600 dark:text-amber-400">
              Grade A (4.6★ Network Avg)
            </span>
            <span className="text-[11px] text-slate-500 block">Daily depot cleaning log verified</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Safety & Speed Governor</span>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
              AIS-140 SOS Active
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">All panic buttons functional</span>
          </div>
        </div>
      </div>

      {/* Analytics Filter Bar */}
      <div
        className={`rounded-2xl border p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Interactive Telemetry Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Day Filter */}
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                playClickSound();
                setDayFilter('weekday');
              }}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                dayFilter === 'weekday'
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weekday
            </button>
            <button
              onClick={() => {
                playClickSound();
                setDayFilter('weekend');
              }}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                dayFilter === 'weekend'
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weekend
            </button>
          </div>

          {/* Weather Filter */}
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                playClickSound();
                setWeatherCondition('rain');
              }}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                weatherCondition === 'rain'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🌧️ Rain (+12%)
            </button>
            <button
              onClick={() => {
                playClickSound();
                setWeatherCondition('clear');
              }}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                weatherCondition === 'clear'
                  ? 'bg-amber-500 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ☀️ Clear
            </button>
          </div>

          {/* View Mode */}
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                playClickSound();
                setViewMode('both');
              }}
              className={`px-2.5 py-1 font-semibold rounded transition-colors ${
                viewMode === 'both'
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => {
                playClickSound();
                setViewMode('predicted');
              }}
              className={`px-2.5 py-1 font-semibold rounded transition-colors ${
                viewMode === 'predicted'
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500'
              }`}
            >
              Predicted
            </button>
            <button
              onClick={() => {
                playClickSound();
                setViewMode('historical');
              }}
              className={`px-2.5 py-1 font-semibold rounded transition-colors ${
                viewMode === 'historical'
                  ? theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500'
              }`}
            >
              Historical
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hourly Corridor Crowding: Historical vs. Predicted
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting evening peak surge (5:00 PM – 7:00 PM) driven by education and IT hubs.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {(viewMode === 'both' || viewMode === 'historical') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-slate-500">Historical Base</span>
              </div>
            )}
            {(viewMode === 'both' || viewMode === 'predicted') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  AI Predicted ({weatherCondition})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[550px]">
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = padding.top + (1 - v / 100) * usableHeight;
              return (
                <g key={v}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={theme === 'dark' ? '#334155' : '#f1f5f9'}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fontFamily="monospace"
                    fill={theme === 'dark' ? '#94a3b8' : '#94a3b8'}
                  >
                    {v}%
                  </text>
                </g>
              );
            })}

            {/* Shaded Peak Zone (5 PM - 7 PM) */}
            <rect
              x={padding.left + (5 / (hourlyData.length - 1)) * usableWidth}
              y={padding.top}
              width={(2 / (hourlyData.length - 1)) * usableWidth}
              height={usableHeight}
              fill={theme === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)'}
              stroke="rgba(239, 68, 68, 0.2)"
              strokeDasharray="2 2"
            />
            <text
              x={padding.left + (6 / (hourlyData.length - 1)) * usableWidth}
              y={padding.top + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#ef4444"
              fontWeight="bold"
            >
              PEAK SURGE CORRIDOR
            </text>

            {/* Historical Line */}
            {(viewMode === 'both' || viewMode === 'historical') && (
              <path
                d={pathHist}
                fill="none"
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}

            {/* Predicted Line */}
            {(viewMode === 'both' || viewMode === 'predicted') && (
              <path
                d={pathPred}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points & Labels */}
            {pointsPred.map((p, idx) => (
              <g key={idx}>
                {/* Time Label on X axis */}
                <text
                  x={p.x}
                  y={chartHeight - padding.bottom + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill={idx >= 5 && idx <= 7 ? '#ef4444' : theme === 'dark' ? '#94a3b8' : '#64748b'}
                  fontWeight={idx >= 5 && idx <= 7 ? 'bold' : 'normal'}
                >
                  {p.d.hour}
                </text>

                {/* Predicted circle point */}
                {(viewMode === 'both' || viewMode === 'predicted') && (
                  <>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.d.adjustedPredicted > 85 ? 5 : 3.5}
                      fill={p.d.adjustedPredicted > 85 ? '#ef4444' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={p.x}
                      y={p.y - 7}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={p.d.adjustedPredicted > 85 ? '#ef4444' : '#10b981'}
                    >
                      {p.d.adjustedPredicted}%
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Critical Locations Table (Section 14) */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Critical Transit Nodes & Congestion Choke Points
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated rank of stops requiring dispatch intervention or platform crowd management.
            </p>
          </div>

          <span className="text-xs font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-1 rounded-md font-bold">
            5 Junctions at Elevated Risk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider text-slate-500 ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <th className="py-3 px-6">Stop / Hub Name</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4 text-right">Crowd %</th>
                <th className="py-3 px-4 text-center">30m Trend</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {criticalStops.map((stop) => {
                const hex = getCrowdHex(
                  stop.risk === 'Critical' ? 'critical' : stop.risk === 'High' ? 'high' : 'moderate'
                );

                return (
                  <tr
                    key={stop.id}
                    className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                      {stop.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {stop.zone}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm" style={{ color: hex }}>
                      {stop.currentCrowd}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-rose-600 text-sm">
                        ↑
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${hex}15`,
                          color: hex,
                        }}
                      >
                        {stop.risk}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => {
                          playClickSound();
                          onOpenStopDetails(stop);
                        }}
                        className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs inline-flex items-center gap-1 ${
                          theme === 'dark'
                            ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                            : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
