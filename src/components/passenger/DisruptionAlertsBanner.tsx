import React, { useState } from 'react';
import { BusDisruption, ThemeMode, AppLanguage } from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound, playAlertSound } from '../../services/soundEffects';
import {
  AlertTriangle,
  Wrench,
  ShieldAlert,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  PlusCircle,
  X,
} from 'lucide-react';

interface DisruptionAlertsProps {
  disruptions: BusDisruption[];
  onSelectAlternativeRoute: (routeNumber: string) => void;
  onAddDisruption?: (disruption: BusDisruption) => void;
  onResolveDisruption?: (id: string) => void;
  isAuthorityMode?: boolean;
  language?: AppLanguage;
  theme: ThemeMode;
}

export const DisruptionAlertsBanner: React.FC<DisruptionAlertsProps> = ({
  disruptions,
  onSelectAlternativeRoute,
  onAddDisruption,
  onResolveDisruption,
  isAuthorityMode = false,
  language = 'en',
  theme,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRouteNumber, setNewRouteNumber] = useState('Route 10A');
  const [newType, setNewType] = useState<'breakdown' | 'accident' | 'diversion' | 'maintenance'>('breakdown');
  const [newLocation, setNewLocation] = useState('Peelamedu Signal');
  const [newDesc, setNewDesc] = useState('Flat tire replacement underway');
  const [newAlt, setNewAlt] = useState('Route 12');

  const activeDisruptions = disruptions.filter((d) => !d.isResolved);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddDisruption) return;

    playAlertSound();
    onAddDisruption({
      id: `disrupt-${Date.now()}`,
      routeId: newRouteNumber.toLowerCase().replace(' ', '-'),
      routeNumber: newRouteNumber,
      type: newType,
      severity: newType === 'breakdown' || newType === 'accident' ? 'critical' : 'moderate',
      location: newLocation,
      description: newDesc,
      alternativeRoute: newAlt,
      reportedTime: 'Just now',
      isResolved: false,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.disruptions}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                {activeDisruptions.length} {t.activeDisruptions}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time vehicle breakdowns, road accidents, and diverted corridors with automated relief routes.
            </p>
          </div>
        </div>

        {isAuthorityMode && onAddDisruption && (
          <button
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Bus Breakdown / Accident</span>
          </button>
        )}
      </div>

      {/* Disruption Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeDisruptions.map((disrupt) => {
          const isBreakdown = disrupt.type === 'breakdown';
          const isAccident = disrupt.type === 'accident';

          return (
            <div
              key={disrupt.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-slate-900 border-rose-900/50 hover:border-rose-700'
                  : 'bg-white border-rose-200 hover:border-rose-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {disrupt.routeNumber}
                    </span>
                    <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      {isBreakdown && <Wrench className="w-3.5 h-3.5 text-rose-500" />}
                      {isAccident && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{disrupt.type}</span>
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {disrupt.reportedTime}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{disrupt.location}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {disrupt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 block">
                    Recommended Alternative:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {disrupt.alternativeRoute || disrupt.recommendedAlternativeRoute || 'Route 18'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectAlternativeRoute(disrupt.alternativeRoute || disrupt.recommendedAlternativeRoute || 'Route 18');
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Switch to alternative less-crowded route"
                  >
                    <span>Switch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {isAuthorityMode && onResolveDisruption && (
                    <button
                      onClick={() => {
                        playClickSound();
                        onResolveDisruption(disrupt.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600"
                      title="Mark as Cleared / Resolved"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authority Add Incident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-sm">Broadcast New Route Incident / Breakdown</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Affected Route</label>
                <input
                  type="text"
                  value={newRouteNumber}
                  onChange={(e) => setNewRouteNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Disruption Nature</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
                >
                  <option value="breakdown">Engine Breakdown / Mechanical Failure</option>
                  <option value="accident">Road Accident / Traffic Obstruction</option>
                  <option value="diversion">Route Diversion / Road Work</option>
                  <option value="maintenance">Depot Maintenance / Trip Cancelation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Exact Location / Signal</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description & Expected Clearance</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Recommended Alternative Corridor</label>
                <input
                  type="text"
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
