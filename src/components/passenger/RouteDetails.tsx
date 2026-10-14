import React, { useState } from 'react';
import { RoutePrediction, AppLanguage, ThemeMode } from '../../types';
import { getCrowdHex } from '../../services/predictionEngine';
import { TRANSLATIONS } from '../../services/translations';
import {
  ArrowLeft,
  Clock,
  Users,
  Bus,
  ShieldCheck,
  HelpCircle,
  FileCheck,
  Award,
  Wind,
} from 'lucide-react';

interface RouteDetailsProps {
  route: RoutePrediction;
  allRoutes: RoutePrediction[];
  onSelectRoute: (route: RoutePrediction) => void;
  onBack: () => void;
  onOpenWhyModal: (route: RoutePrediction) => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const RouteDetails: React.FC<RouteDetailsProps> = ({
  route,
  allRoutes,
  onSelectRoute,
  onBack,
  onOpenWhyModal,
  language = 'en',
  theme = 'light',
}) => {
  const [hoveredStopIndex, setHoveredStopIndex] = useState<number | null>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // SVG Chart Dimensions
  const chartHeight = 180;
  const chartWidth = 600;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  const points = route.stops.map((stop, idx) => {
    const x = padding.left + (idx / (route.stops.length - 1)) * usableWidth;
    const y = padding.top + (1 - stop.crowdPercentage / 100) * usableHeight;
    return { x, y, stop, idx };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Route Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border transition-colors shadow-2xs ${
              theme === 'dark'
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Back to Route Comparison"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {route.routeNumber}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {t.stopsTimeline}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {route.name} · {route.vehicleRegistrationNumber || 'TN 38 N 4588'}
            </p>
          </div>
        </div>

        {/* Switch Route Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Switch Route:</span>
          <div
            className={`flex items-center gap-1 border rounded-lg p-1 shadow-2xs ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {allRoutes.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRoute(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  r.id === route.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {r.routeNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FC Date, Quality, & Missed Bus Refund Status Bar */}
      <div
        className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-3 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.fcDateLabel}</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {route.fcExpiryDate || '12-Jan-2029'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              ● {route.fcStatus || 'Certified Valid'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.vehicleQuality}</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {route.busQualityGrade || 'Grade A+ Premium'}
            </span>
            <span className="text-[10px] text-slate-500 block">Cleanliness {route.cleanlinessRating || 4.8}★</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.aqiLabel}</span>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
              AQI {route.interiorAqi || 32}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
              Fresh Air Filtered
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Missed Bus Policy</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              100% Refund Guarantee
            </span>
            <span className="text-[10px] text-slate-500 block">Free Rebooking in 60m</span>
          </div>
        </div>
      </div>

      {/* SVG Chart: Crowd Along Route */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Crowd Density Along Route Profile
            </h3>
            <p className="text-xs text-slate-500">
              Corridor progression showing passenger influx and critical thresholds.
            </p>
          </div>
          <button
            onClick={() => onOpenWhyModal(route)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.whyThisPrediction}</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[500px]"
          >
            <defs>
              <linearGradient id="routeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines & Y-axis labels */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = padding.top + (1 - val / 100) * usableHeight;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
                    strokeDasharray={val === 50 || val === 80 ? '2 2' : 'none'}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fontFamily="monospace"
                    fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#routeAreaGrad)" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map(({ x, y, stop, idx }) => {
              const isHovered = hoveredStopIndex === idx;
              const hex = getCrowdHex(stop.crowdStatus);

              return (
                <g
                  key={stop.stopId}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredStopIndex(idx)}
                  onMouseLeave={() => setHoveredStopIndex(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={hex}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {/* Stop Name on X Axis */}
                  <text
                    x={x}
                    y={chartHeight - padding.bottom + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    fill={isHovered ? '#10b981' : theme === 'dark' ? '#cbd5e1' : '#64748b'}
                  >
                    {stop.stopName.split('/')[0]}
                  </text>
                  {/* Percent label on point */}
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={hex}
                  >
                    {stop.crowdPercentage}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Vertical Route Timeline */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          {t.stopsTimeline} & Live Boarding Status
        </h3>

        <div className="relative pl-6 space-y-5 before:absolute before:left-[35px] before:top-3 before:bottom-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {route.stops.map((stop, idx) => {
            const hex = getCrowdHex(stop.crowdStatus);

            return (
              <div
                key={stop.stopId}
                onMouseEnter={() => setHoveredStopIndex(idx)}
                onMouseLeave={() => setHoveredStopIndex(null)}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                  hoveredStopIndex === idx
                    ? theme === 'dark'
                      ? 'bg-slate-800 border-slate-600 shadow-2xs'
                      : 'bg-slate-50 border-slate-300 shadow-2xs'
                    : theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Node marker & Stop Identity */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-xs shrink-0 z-10 -ml-7"
                    style={{ backgroundColor: hex }}
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {stop.stopName}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Stop #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {stop.arrivalTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Users className="w-3 h-3 text-slate-400" />
                        ~{stop.estimatedPassengers} aboard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Crowd Metrics */}
                <div className="flex items-center gap-4 sm:justify-end">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold font-mono"
                        style={{ color: hex }}
                      >
                        {stop.crowdPercentage}%
                      </span>
                      <span className="text-xs font-semibold capitalize" style={{ color: hex }}>
                        {stop.crowdStatus === 'low' && '🟢 Low'}
                        {stop.crowdStatus === 'moderate' && '🟡 Moderate'}
                        {stop.crowdStatus === 'high' && '🟠 High'}
                        {stop.crowdStatus === 'critical' && '🔴 Critical'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {stop.crowdPercentage < 45
                        ? 'Seats available'
                        : stop.crowdPercentage < 80
                        ? 'Standing space'
                        : 'Heavy boarding pressure'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
