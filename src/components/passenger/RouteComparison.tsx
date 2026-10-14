import React, { useState } from 'react';
import { RoutePrediction, AppLanguage, ThemeMode } from '../../types';
import { getCrowdHex } from '../../services/predictionEngine';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound, playChimeSound } from '../../services/soundEffects';
import {
  Star,
  Clock,
  Hourglass,
  ShieldCheck,
  HelpCircle,
  TrendingDown,
  ChevronRight,
  Ticket,
  FileCheck,
  Award,
  Wind,
  ShieldAlert,
} from 'lucide-react';

interface RouteComparisonProps {
  routes: RoutePrediction[];
  onSelectRouteForDetails: (route: RoutePrediction) => void;
  onOpenWhyModal: (route: RoutePrediction) => void;
  onOpenPaymentModal: (route: RoutePrediction) => void;
  onOpenFeedbackModal: (route: RoutePrediction) => void;
  selectedRouteId: string | null;
  onChooseRoute: (route: RoutePrediction) => void;
  language: AppLanguage;
  theme: ThemeMode;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  onSelectRouteForDetails,
  onOpenWhyModal,
  onOpenPaymentModal,
  onOpenFeedbackModal,
  selectedRouteId,
  onChooseRoute,
  language,
  theme,
}) => {
  const [chosenRouteId, setChosenRouteId] = useState<string | null>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const recommendedRoute = routes.find((r) => r.isRecommended) || routes[2] || routes[0];

  const handleChoose = (route: RoutePrediction) => {
    playChimeSound();
    setChosenRouteId(route.id);
    onChooseRoute(route);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.routeComparison}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {t.subTagline}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-2xs">
          <span>{routes.length} Active Corridors Evaluated</span>
        </div>
      </div>

      {/* Prominent Smart Recommendation Card (Section 6) */}
      {recommendedRoute && (
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                  <span>{t.recommendedForYou}</span>
                </div>

                {/* FC Expiry & Vehicle Quality Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-medium">
                  <FileCheck className="w-3 h-3 text-emerald-400" />
                  <span>FC: {recommendedRoute.fcExpiryDate || '12-Jan-2029'}</span>
                  <span className="text-emerald-400 font-bold">({recommendedRoute.fcStatus || 'Passed'})</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium">
                  <Award className="w-3 h-3" />
                  <span>{recommendedRoute.busQualityGrade || 'Grade A+ Premium'}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl font-extrabold tracking-tight text-white">
                  {recommendedRoute.routeNumber}
                </h3>
                <span className="text-sm text-slate-300">
                  {recommendedRoute.name} ({recommendedRoute.busType}) · {recommendedRoute.vehicleRegistrationNumber || 'TN 38 N 4588'}
                </span>
              </div>

              <p className="text-emerald-100/90 text-sm leading-relaxed mb-5 font-medium">
                “{recommendedRoute.routeNumber} provides significantly lower predicted crowding with only a small increase in travel time.”
              </p>

              {/* Comparative Metrics & Ticket Price */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t.predictedCrowd}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {recommendedRoute.predictedCrowd}%
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold uppercase">
                      🟢 Low
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t.travelTime}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-white">
                      {recommendedRoute.travelTimeMin}
                    </span>
                    <span className="text-xs text-slate-300">min</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t.ticketPrice}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-emerald-300">
                      ₹{recommendedRoute.baseFare || 18}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">(50% Off)</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t.smartScore}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-amber-300">
                      {recommendedRoute.smartTravelScore}
                    </span>
                    <span className="text-xs text-slate-300">/100</span>
                  </div>
                </div>
              </div>

              {/* Missed Bus Refund Policy Callout */}
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300 font-medium bg-emerald-950/50 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.refundGuaranteeBadge}: {t.missedBusRefundDesc}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  playClickSound();
                  onOpenPaymentModal(recommendedRoute);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-md"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>{t.chooseRoute} (₹{recommendedRoute.baseFare || 18})</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onSelectRouteForDetails(recommendedRoute);
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-colors"
              >
                <span>{t.viewRoute}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenWhyModal(recommendedRoute);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.whyThisPrediction}</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    onOpenFeedbackModal(recommendedRoute);
                  }}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{recommendedRoute.userRating || 4.8}★ {t.rateTrip}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Comparison Grid (3+ Routes) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.routeComparison}
          </h3>
          <span className="text-xs text-slate-500">
            Ranked by Multi-Objective Smart Score
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {routes.map((route) => {
            const hex = getCrowdHex(route.crowdLevel);

            return (
              <div
                key={route.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between p-6 shadow-sm hover:shadow-md ${
                  theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                } ${
                  route.isRecommended
                    ? 'border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold">
                          {route.routeNumber}
                        </span>
                        {route.isRecommended && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            <Star className="w-3 h-3 fill-emerald-600" />
                            <span>Recommended</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {route.name} · {route.busType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {route.vehicleRegistrationNumber || 'TN 38 N 2490'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        onOpenWhyModal(route);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500 transition-colors text-xs font-semibold flex items-center gap-1"
                      title={t.whyThisPrediction}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why?</span>
                    </button>
                  </div>

                  {/* FC Date & Bus Quality Strip */}
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 mb-4">
                    <div className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-500">FC Exp:</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">{route.fcExpiryDate || '24-Nov-2027'}</strong>
                    </div>

                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <strong className="text-amber-600 dark:text-amber-400">{route.busQualityGrade || 'Grade A'}</strong>
                    </div>
                  </div>

                  {/* Crowd Level Display */}
                  <div
                    className={`p-4 rounded-xl border mb-5 ${
                      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        {t.predictedCrowd}
                      </span>
                      <span
                        className="text-2xl font-extrabold font-mono"
                        style={{ color: hex }}
                      >
                        {route.predictedCrowd}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${route.predictedCrowd}%`,
                          backgroundColor: hex,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold capitalize" style={{ color: hex }}>
                        {route.crowdLevel === 'critical' && '🔴 Critical Density'}
                        {route.crowdLevel === 'high' && '🟠 High Crowd'}
                        {route.crowdLevel === 'moderate' && '🟡 Moderate Occupancy'}
                        {route.crowdLevel === 'low' && '🟢 Low Crowd (Seats Avail.)'}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {route.currentPassengers}/{route.busCapacity} pax
                      </span>
                    </div>
                  </div>

                  {/* Metrics & Ticket Price List */}
                  <div className="space-y-2.5 text-xs mb-5">
                    {/* Ticket Price Row */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Ticket className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.ticketPrice}</span>
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{route.baseFare || 15}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          (Student: ₹{Math.round((route.baseFare || 15) * 0.5)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.travelTime}</span>
                      </span>
                      <span className="font-mono font-bold">
                        {route.travelTimeMin} min
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Hourglass className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.waitingTime}</span>
                      </span>
                      <span className="font-mono font-bold">
                        {route.waitingTimeMin} min
                      </span>
                    </div>

                    {/* Cabin AQI */}
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Wind className="w-3.5 h-3.5 text-sky-500" />
                        <span>Cabin Air (AQI)</span>
                      </span>
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                        AQI {route.interiorAqi || 35} (Clean)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {t.smartScore}
                      </span>
                      <span className="font-mono font-extrabold text-sm bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {route.smartTravelScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Missed Bus Refund Guarantee Tag on each card */}
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md mb-4 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.refundGuaranteeBadge} (100% Refund / Free Transfer)</span>
                  </div>
                </div>

                {/* Card Actions: Book Ticket + Details + Rating */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenPaymentModal(route);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      route.isRecommended
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>{t.chooseRoute} (₹{route.baseFare || 15})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectRouteForDetails(route);
                      }}
                      className="py-2 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{t.viewRoute}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        onOpenFeedbackModal(route);
                      }}
                      className="py-2 px-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{route.userRating || 4.5}★</span>
                    </button>
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
