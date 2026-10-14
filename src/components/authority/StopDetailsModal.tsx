import React from 'react';
import { TransportStop } from '../../types';
import { getCrowdHex } from '../../services/predictionEngine';
import { X, MapPin, TrendingUp, Users, Bus, AlertCircle } from 'lucide-react';

interface StopDetailsModalProps {
  stop: TransportStop | null;
  onClose: () => void;
}

export const StopDetailsModal: React.FC<StopDetailsModalProps> = ({ stop, onClose }) => {
  if (!stop) return null;

  const hex = getCrowdHex(stop.risk === 'Critical' ? 'critical' : stop.risk === 'High' ? 'high' : 'moderate');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Stop Telemetry Analysis
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {stop.name} ({stop.zone})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main KPI Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Current Crowd</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {stop.currentCrowd}%
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider block mt-1"
                style={{ color: hex }}
              >
                {stop.risk} Risk
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Expected in 30m</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold font-mono text-rose-600">
                  {stop.predictedCrowd30m}%
                </span>
                <TrendingUp className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-xs text-slate-500 block mt-1">
                Trend: Accelerating
              </span>
            </div>
          </div>

          {/* Connected routes */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Transit Lines Serving This Node
            </span>
            <div className="flex flex-wrap gap-2">
              {stop.routes.map((r) => (
                <div
                  key={r}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-2xs text-xs font-bold text-slate-800 flex items-center gap-1.5"
                >
                  <Bus className="w-3.5 h-3.5 text-slate-500" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational recommendations */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Dispatcher Intelligence Action
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Platform occupancy approaching maximum safe threshold ({stop.capacity} commuters). Recommend dispatching 2 additional standby feeder units on Route 18 to relieve corridor transfer pressure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
