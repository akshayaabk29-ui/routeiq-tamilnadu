import React from 'react';
import { RoutePrediction, AppLanguage } from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import { getCrowdHex } from '../../services/predictionEngine';
import { X, HelpCircle, AlertCircle, BarChart2 } from 'lucide-react';

interface WhyPredictionModalProps {
  route: RoutePrediction | null;
  onClose: () => void;
  language?: AppLanguage;
}

export const WhyPredictionModal: React.FC<WhyPredictionModalProps> = ({
  route,
  onClose,
  language = 'en',
}) => {
  if (!route) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const hex = getCrowdHex(route.crowdLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                {t.whyThisPrediction || 'Explainable Crowd Prediction'}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Why is {route.routeNumber} predicted to be {route.predictedCrowd}% crowded?
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            {route.explanation.summary}
          </p>

          {/* Factor Breakdown Bars */}
          <div className="space-y-3.5 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
              <span>{t.crowdFactorBreakdown || 'Contributing Telemetry Factors'}</span>
              <span>Impact</span>
            </div>

            {route.explanation.factors.map((item, idx) => {
              const isPositive = item.impactPercentage >= 0;
              const barWidth = Math.min(100, Math.abs(item.impactPercentage) * 4);

              return (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">
                      {item.factor}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isPositive ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isPositive ? `+${item.impactPercentage}%` : `${item.impactPercentage}%`}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${
                        isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Aggregate Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Corridor Base + Context Impact</span>
              <span className="text-sm font-semibold">Predicted Fleet Occupancy</span>
            </div>
            <div className="text-right">
              <span
                className="text-3xl font-extrabold font-mono"
                style={{ color: hex }}
              >
                {route.predictedCrowd}%
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                {route.crowdLevel}
              </span>
            </div>
          </div>

          {/* Prediction note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Factors shown are based on RouteIQ&apos;s AI crowd prediction engine calibrated from regional Tamil Nadu public transport matrices.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
