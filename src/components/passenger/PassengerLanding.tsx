import React from 'react';
import { AppMode, AppLanguage, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import {
  Bus,
  Building2,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';

interface PassengerLandingProps {
  onEnterMode: (mode: AppMode) => void;
  onStartDemo: () => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const PassengerLanding: React.FC<PassengerLandingProps> = ({
  onEnterMode,
  onStartDemo,
  language = 'en',
  theme = 'light',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-14 w-full text-center">
        {/* RouteIQ Official Brand Logo Emblem */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 opacity-25 blur-xl group-hover:opacity-40 transition-opacity" />
            <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl">
              <img
                src="/routeiq-logo.png"
                alt="RouteIQ Public Transport Intelligence Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* AI Mobility Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>AI-Powered Dynamic Public Transport & Crowd Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          <span className="text-blue-700 dark:text-blue-400">Route</span>
          <span className="text-emerald-500 dark:text-emerald-400">IQ</span>
        </h1>

        <p className="mt-3 text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
          {t.tagline}
        </p>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.subTagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onEnterMode('passenger')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
          >
            <Bus className="w-4 h-4" />
            <span>{t.enterPassenger}</span>
          </button>
          <button
            onClick={() => onEnterMode('authority')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>{t.authorityDashboard}</span>
          </button>
          <button
            onClick={() => onEnterMode('admin')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            <Database className="w-4 h-4" />
            <span>{t.adminDashboard}</span>
          </button>
        </div>

        {/* Six-pillar journey badge */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-4">
            The Complete Intelligent Mobility Journey
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">01. PREDICT</span>
              <span className="text-[11px] text-slate-500">Contextual Telemetry</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">02. EXPLAIN</span>
              <span className="text-[11px] text-slate-500">Feature Attribution</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">03. COMPARE</span>
              <span className="text-[11px] text-slate-500">Smart Travel Score</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">04. RECOMMEND</span>
              <span className="text-[11px] text-slate-500">Relief Bypass Routing</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">05. SIMULATE</span>
              <span className="text-[11px] text-slate-500">What-If Travel Shift</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">06. OPTIMIZE</span>
              <span className="text-[11px] text-slate-500">Network Redistribution</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Role Cards */}
      <section id="mode-cards" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Passenger Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-5">
                <Bus className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Role 1
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500">Daily Commuter</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                👤 {t.passengerMode}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                “Find a less-crowded journey.” Check expected crowding along your route, compare transit alternatives with Smart Travel Scores, test departure times in the What-If Planner, and book tickets with 100% Missed Bus refund protection.
              </p>

              <div className="space-y-2 mb-6 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Forecast crowding for weather & events</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified FC (Fitness Certificate) expiry</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Missed Bus refund guarantee</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterMode('passenger')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <span>{t.enterPassenger}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Transport Authority Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-5">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Role 2
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500">Executive Overview & Map</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                🏙️ {t.authorityDashboard}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                “Monitor city-wide transport crowding.” Dedicated command dashboard showing 8 executive summary cards, most crowded corridors, and an interactive City Crowd Map with 🟢 Low, 🟡 Medium, and 🔴 High route telemetry.
              </p>

              <div className="space-y-2 mb-6 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Executive summary cards & high-crowd trips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Interactive City Crowd Map with route click inspector</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Filters by Route, Day, Time, and Crowd Level</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterMode('authority')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors shadow-sm"
            >
              <span>{t.authorityDashboard}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Dashboard Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-5">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  Role 3
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500">Data Entry & Management</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                🛠️ {t.adminDashboard}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                “Manual historical trip data entry & AI calibration.” Enter previously available trip and ticket records without conductor recount burden, manage routes and scheduled trips, test ML predictions, and view fleet analytics.
              </p>

              <div className="space-y-2 mb-6 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Historical Trip Data Entry (Save, Edit, Delete, Clear)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Prediction Engine: Expected Count vs Vehicle Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Route, Trip & In-Depth Transit Analytics</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterMode('admin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors shadow-sm"
            >
              <span>{t.adminDashboard}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* RouteIQ Platform Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">RouteIQ Transit Intelligence:</strong> Dynamic crowd forecasting, 100% verified FC bus fleet safety, missed bus protections, and predictive load balancing across Tamil Nadu transit networks.
          </p>
        </div>
      </footer>
    </div>
  );
};
