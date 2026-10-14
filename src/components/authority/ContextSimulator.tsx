import React, { useState } from 'react';
import { simulateContextImpact, getCrowdHex } from '../../services/predictionEngine';
import {
  CloudRain,
  Sun,
  Truck,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export const ContextSimulator: React.FC = () => {
  const [weather, setWeather] = useState<'Clear' | 'Rain'>('Rain');
  const [traffic, setTraffic] = useState<'Normal' | 'Heavy'>('Heavy');
  const [day, setDay] = useState<'Weekday' | 'Weekend'>('Weekday');
  const [event, setEvent] = useState<'None' | 'College Event' | 'Festival'>('College Event');
  const [peakHour, setPeakHour] = useState<boolean>(true);

  // Result state
  const [simulationResult, setSimulationResult] = useState(() =>
    simulateContextImpact(weather, traffic, day, event, peakHour)
  );

  const handleUpdate = () => {
    const res = simulateContextImpact(weather, traffic, day, event, peakHour);
    setSimulationResult(res);
  };

  const hex = getCrowdHex(simulationResult.level);

  // Progression milestones for comparison visualization (Section 16)
  const progressionMilestones = [
    { label: 'Normal Baseline', crowd: 64, desc: 'Clear dry weather, standard traffic, off-peak' },
    { label: '+ Rain Effect', crowd: 74, desc: 'Two-wheeler modal shift to public transit' },
    { label: '+ Rain & Peak Hour', crowd: 82, desc: 'Combined evening work & institutional commute' },
    { label: '+ Rain + Peak + Event', crowd: 91, desc: 'Critical saturation across central corridors' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Macro Simulation Engine</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          🌦️ Environmental & Context Simulator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Dynamically evaluate how weather shifts, road congestion, and institutional schedules stress city-wide transit capacity.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,360px] gap-8">
        {/* Controls Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Environmental Stress Parameters
          </h3>

          <div className="space-y-6">
            {/* Weather Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Weather Condition
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWeather('Clear')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    weather === 'Clear'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Clear Skies</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeather('Rain')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    weather === 'Rain'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                  <span>Rain (+10% modal shift)</span>
                </button>
              </div>
            </div>

            {/* Traffic Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Road Traffic State
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTraffic('Normal')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    traffic === 'Normal'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Normal Free-flow
                </button>
                <button
                  type="button"
                  onClick={() => setTraffic('Heavy')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    traffic === 'Heavy'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Heavy (+8% congestion)
                </button>
              </div>
            </div>

            {/* Day Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Day of Week
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDay('Weekday')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    day === 'Weekday'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Weekday Commute
                </button>
                <button
                  type="button"
                  onClick={() => setDay('Weekend')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    day === 'Weekend'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Weekend Leisure
                </button>
              </div>
            </div>

            {/* Regional Event */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Regional Event
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['None', 'College Event', 'Festival'] as const).map((evt) => (
                  <button
                    key={evt}
                    type="button"
                    onClick={() => setEvent(evt)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      event === evt
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {evt === 'None' && 'None'}
                    {evt === 'College Event' && '🎓 College Close'}
                    {evt === 'Festival' && '🏮 Festival Rush'}
                  </button>
                ))}
              </div>
            </div>

            {/* Peak Hour Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Peak Commute Band</span>
                <span className="text-[11px] text-slate-500">Active during 8-10 AM or 5-7 PM rush</span>
              </div>
              <button
                type="button"
                onClick={() => setPeakHour(!peakHour)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  peakHour
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {peakHour ? 'PEAK: ON' : 'PEAK: OFF'}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handleUpdate}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>UPDATE PREDICTION</span>
            </button>
          </div>
        </div>

        {/* Dynamic Prediction Outcome */}
        <div className="space-y-6">
          {/* Result Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Simulated Corridor Peak Crowd
            </span>
            <div className="flex items-baseline justify-between mb-4">
              <span
                className="text-5xl font-black font-mono tracking-tight"
                style={{ color: hex }}
              >
                {simulationResult.finalCrowd}%
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                style={{
                  backgroundColor: `${hex}25`,
                  color: hex,
                }}
              >
                {simulationResult.level}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${simulationResult.finalCrowd}%`,
                  backgroundColor: hex,
                }}
              />
            </div>

            {/* Stepwise Telemetry Attribution */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Contextual Modifiers Applied:
              </span>
              {simulationResult.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-slate-300">
                  <span>{item.name}</span>
                  <span
                    className={`font-mono font-bold ${
                      item.delta > 0 ? 'text-rose-400' : item.delta < 0 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {item.delta > 0 ? `+${item.delta}%` : item.delta < 0 ? `${item.delta}%` : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Progression Matrix (Section 16) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Standardized Scenario Progression
            </h4>
            <div className="space-y-2.5 text-xs">
              {progressionMilestones.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{p.label}</span>
                    <span className="text-[11px] text-slate-500">{p.desc}</span>
                  </div>
                  <span className="text-base font-extrabold font-mono text-slate-900 ml-2">
                    {p.crowd}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
