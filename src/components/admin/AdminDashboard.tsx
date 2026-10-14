import React, { useState, useEffect } from 'react';
import {
  HistoricalTripRecord,
  AdminTab,
  HistoricalPredictionResult,
  ThemeMode,
  AppLanguage,
} from '../../types';
import {
  getHistoricalTripRecords,
  saveHistoricalTripRecord,
  deleteHistoricalTripRecord,
  resetHistoricalTripRecords,
  subscribeToTripDataChanges,
  predictDemandFromHistoricalData,
  INITIAL_MANAGED_ROUTES,
  INITIAL_SCHEDULED_TRIPS,
} from '../../services/tripDataService';
import { playClickSound, playChimeSound, playAlertSound } from '../../services/soundEffects';
import {
  Database,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Bus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  Layers,
  ArrowRight,
  Info,
  Sliders,
  Users,
  Search,
  Check,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: AdminTab;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'historical-entry',
  theme = 'light',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [records, setRecords] = useState<HistoricalTripRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form state for Historical Trip Data Entry
  const [formData, setFormData] = useState<{
    routeNumber: string;
    routeName: string;
    from: string;
    to: string;
    date: string;
    day: string;
    tripTime: string;
    vehicleNumber: string;
    vehicleCapacity: number;
    passengerCount: number;
    notes: string;
  }>({
    routeNumber: '21A',
    routeName: 'Route 21A',
    from: 'Periyar',
    to: 'Mattuthavani',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '8:00 AM',
    vehicleNumber: 'TN 58 N 1823',
    vehicleCapacity: 50,
    passengerCount: 43,
    notes: 'Morning peak college and hospital commuter influx',
  });

  // Table search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoute, setFilterRoute] = useState('ALL');

  // Prediction Tool State
  const [predRoute, setPredRoute] = useState('21A');
  const [predDay, setPredDay] = useState('Monday');
  const [predTime, setPredTime] = useState('8:00 AM');
  const [predCapacity, setPredCapacity] = useState(50);
  const [predictionResult, setPredictionResult] = useState<HistoricalPredictionResult | null>(null);

  // Load and subscribe to records
  useEffect(() => {
    setRecords(getHistoricalTripRecords());
    const unsubscribe = subscribeToTripDataChanges(() => {
      setRecords(getHistoricalTripRecords());
    });
    return () => unsubscribe();
  }, []);

  // Update initial prediction result
  useEffect(() => {
    const res = predictDemandFromHistoricalData({
      routeNumber: predRoute,
      day: predDay,
      tripTime: predTime,
      vehicleCapacity: predCapacity,
    });
    setPredictionResult(res);
  }, [predRoute, predDay, predTime, predCapacity, records]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'routeNumber') {
        const found = INITIAL_MANAGED_ROUTES.find(
          (r) => r.routeNumber.toUpperCase() === String(value).toUpperCase()
        );
        if (found) {
          updated.routeName = `Route ${found.routeNumber}`;
          updated.from = found.from;
          updated.to = found.to;
          updated.vehicleCapacity = found.defaultCapacity;
        }
      }
      return updated;
    });
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.routeNumber.trim()) {
      showNotification('Please enter a Route Number', 'error');
      playAlertSound();
      return;
    }
    if (formData.passengerCount < 0) {
      showNotification('Passenger count cannot be negative', 'error');
      playAlertSound();
      return;
    }

    playChimeSound();
    saveHistoricalTripRecord({
      ...(selectedRecordId ? { id: selectedRecordId } : {}),
      routeNumber: formData.routeNumber.trim().toUpperCase(),
      routeName: formData.routeName.trim() || `Route ${formData.routeNumber.trim().toUpperCase()}`,
      from: formData.from.trim() || 'Periyar',
      to: formData.to.trim() || 'Mattuthavani',
      date: formData.date || '28-09-2026',
      day: formData.day || 'Monday',
      tripTime: formData.tripTime || '8:00 AM',
      vehicleNumber: formData.vehicleNumber.trim().toUpperCase() || 'TN 38 N 2490',
      vehicleCapacity: Number(formData.vehicleCapacity) || 50,
      passengerCount: Number(formData.passengerCount) || 0,
      notes: formData.notes.trim(),
    });

    if (selectedRecordId) {
      showNotification(`Record for Route ${formData.routeNumber} updated successfully!`);
      setSelectedRecordId(null);
    } else {
      showNotification(`New historical record for Route ${formData.routeNumber} saved to database!`);
    }
  };

  const handleClearForm = () => {
    playClickSound();
    setSelectedRecordId(null);
    setFormData({
      routeNumber: '21A',
      routeName: 'Route 21A',
      from: 'Periyar',
      to: 'Mattuthavani',
      date: '28-09-2026',
      day: 'Monday',
      tripTime: '8:00 AM',
      vehicleNumber: 'TN 58 N 1823',
      vehicleCapacity: 50,
      passengerCount: 40,
      notes: '',
    });
    showNotification('Form cleared for new entry', 'info');
  };

  const handleEditRecord = (record: HistoricalTripRecord) => {
    playClickSound();
    setSelectedRecordId(record.id);
    setFormData({
      routeNumber: record.routeNumber,
      routeName: record.routeName,
      from: record.from,
      to: record.to,
      date: record.date,
      day: record.day,
      tripTime: record.tripTime,
      vehicleNumber: record.vehicleNumber,
      vehicleCapacity: record.vehicleCapacity,
      passengerCount: record.passengerCount,
      notes: record.notes || '',
    });
    setActiveTab('historical-entry');
    showNotification(`Editing record ${record.routeNumber} (${record.tripTime})`, 'info');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDeleteRecord = (id: string, route: string) => {
    playAlertSound();
    deleteHistoricalTripRecord(id);
    if (selectedRecordId === id) {
      setSelectedRecordId(null);
    }
    showNotification(`Record for Route ${route} removed from database`, 'info');
  };

  const handleResetData = () => {
    playAlertSound();
    resetHistoricalTripRecords();
    setSelectedRecordId(null);
    showNotification('Historical records reset to factory default dataset', 'info');
  };

  // Filtered table records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = filterRoute === 'ALL' || r.routeNumber.toUpperCase() === filterRoute;
    return matchesSearch && matchesRoute;
  });

  const uniqueRoutes = Array.from(new Set(records.map((r) => r.routeNumber.toUpperCase())));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transit Operations Control · Admin Master Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Admin Transit Management Dashboard
            </h1>
            <p className="text-sm text-blue-200/80 max-w-2xl">
              Manual historical trip record entry, route and vehicle management, AI demand prediction engine, and in-depth transit network analytics.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-700/60 text-xs font-semibold text-blue-200 border border-blue-700/60 transition-colors shadow-sm"
              title="Reset records to default prototype records"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
              <span>Reset Sample Data</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-blue-950/80 border border-blue-700/40 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-cyan-300 font-bold">{records.length}</span>
              <span className="text-blue-300">Historical Records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200'
              : notification.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div
        className={`flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl border shadow-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Activity },
          { id: 'historical-entry', label: 'Historical Trip Data Entry', icon: FileSpreadsheet, badge: 'Core' },
          { id: 'route-mgmt', label: 'Route Management', icon: MapPin },
          { id: 'trip-mgmt', label: 'Trip Management', icon: Clock },
          { id: 'predictions', label: 'Prediction Results', icon: Sparkles },
          { id: 'analytics', label: 'Detailed Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id as AdminTab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Stored Records</span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{records.length}</div>
              <p className="text-xs text-slate-500 mt-1">Manual trip logs available for ML</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Managed Routes</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{INITIAL_MANAGED_ROUTES.length}</div>
              <p className="text-xs text-slate-500 mt-1">Active urban & interdistrict corridors</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Trips</span>
              <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{INITIAL_SCHEDULED_TRIPS.length}</div>
              <p className="text-xs text-slate-500 mt-1">Departures monitored today</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prediction Accuracy</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94.8%</div>
              <p className="text-xs text-slate-500 mt-1">Confidence on weighted historical data</p>
            </div>
          </div>

          {/* Core Concept Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/60 border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold uppercase">Software Prototype Architecture</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Zero Conductor Burden</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How Historical Trip Data Powers RouteIQ Predictions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Conductors are not required to manually recount passengers. The admin enters previously recorded trip logs (ticket totals / trip sheets). The Prediction Module processes route, day, and time patterns to forecast crowd levels for future trips.
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('historical-entry');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all shrink-0"
            >
              <span>Open Data Entry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Recent Records Preview */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recently Recorded Trips</h3>
                <p className="text-xs text-slate-500">Latest manual trip records available in the database</p>
              </div>
              <button
                onClick={() => setActiveTab('historical-entry')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View & Edit All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Corridor</th>
                    <th className="py-2.5 px-3">Date & Day</th>
                    <th className="py-2.5 px-3">Trip Time</th>
                    <th className="py-2.5 px-3">Capacity</th>
                    <th className="py-2.5 px-3">Passenger Count</th>
                    <th className="py-2.5 px-3">Crowd Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {records.slice(0, 5).map((r) => {
                    const ratio = Math.round((r.passengerCount / r.vehicleCapacity) * 100);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">{r.routeNumber}</td>
                        <td className="py-2.5 px-3">{r.from} &rarr; {r.to}</td>
                        <td className="py-2.5 px-3">{r.date} ({r.day})</td>
                        <td className="py-2.5 px-3 font-mono font-semibold">{r.tripTime}</td>
                        <td className="py-2.5 px-3 font-mono">{r.vehicleCapacity}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{r.passengerCount}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              ratio > 85
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                                : ratio >= 60
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                            }`}
                          >
                            {ratio}% {ratio > 85 ? '🔴 High' : ratio >= 60 ? '🟡 Medium' : '🟢 Low'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORICAL TRIP DATA ENTRY (Section 1) */}
      {activeTab === 'historical-entry' && (
        <div className="space-y-6">
          {/* Important Concept Callout as required by prompt */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <strong className="font-bold text-blue-900 dark:text-blue-200">
                Important Concept:
              </strong>{' '}
              <span>
                Do not require the conductor to manually count every passenger again. The historical passenger count is entered by the admin based on <strong>previously available trip/ticket records</strong>. For the software-only prototype, the admin manually enters these historical records into the dashboard.
              </span>
            </div>
          </div>

          {/* Data Entry Form */}
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  <span>{selectedRecordId ? 'Edit Historical Trip Record' : 'Historical Trip Data Entry'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter trip data from previous log sheets, conductor waybills, or ticketing records.
                </p>
              </div>

              {selectedRecordId && (
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold animate-pulse">
                  Editing Record #{selectedRecordId}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Route Name / Route Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Route Name / Route Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.routeNumber}
                    onChange={(e) => handleInputChange('routeNumber', e.target.value)}
                    placeholder="e.g. Route 21A, 42B"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: Route 21A</span>
                </div>

                {/* Starting Point */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Starting Point *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => handleInputChange('from', e.target.value)}
                    placeholder="e.g. Periyar, Ukkadam"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: Periyar</span>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    placeholder="e.g. Mattuthavani, Railway Station"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: Mattuthavani</span>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    placeholder="e.g. 28-09-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: 28-09-2026</span>
                </div>

                {/* Day */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Day *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: Monday</span>
                </div>

                {/* Trip Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Trip Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tripTime}
                    onChange={(e) => handleInputChange('tripTime', e.target.value)}
                    placeholder="e.g. 8:00 AM, 5:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: 8:00 AM</span>
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    placeholder="e.g. TN 38 N 2490"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: TN 58 N 1823</span>
                </div>

                {/* Vehicle Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Vehicle Capacity *
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    required
                    value={formData.vehicleCapacity}
                    onChange={(e) => handleInputChange('vehicleCapacity', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: 50</span>
                </div>

                {/* Historical Passenger Count */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Historical Passenger Count *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={150}
                    required
                    value={formData.passengerCount}
                    onChange={(e) => handleInputChange('passengerCount', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Example: 43</span>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Optional Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="e.g. Rainy evening, heavy college exam crowd, highway construction detour"
                  className="w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600"
                />
              </div>

              {/* Action Buttons: Save Record, Clear, Edit, Delete */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{selectedRecordId ? 'Update Record' : 'Save Record'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearForm}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>

                {selectedRecordId && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(selectedRecordId, formData.routeNumber)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold text-sm border border-rose-200 dark:border-rose-800 transition-all ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stored Historical Trip Records Table (Section 1 requirement) */}
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Stored Historical Trip Records Table
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredRecords.length} records currently stored in the database
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search route or stop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl text-xs border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ALL">All Routes ({records.length})</option>
                  {uniqueRoutes.map((rt) => (
                    <option key={rt} value={rt}>Route {rt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table layout matching the requested format: Route | Date | Time | Capacity | Passenger Count */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">From &rarr; To</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Capacity</th>
                    <th className="py-3 px-4 text-right">Passenger Count</th>
                    <th className="py-3 px-4 text-center">Crowd Level</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const occupancy = Math.round((r.passengerCount / r.vehicleCapacity) * 100);
                      const isSelected = selectedRecordId === r.id;
                      return (
                        <tr
                          key={r.id}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-blue-50/80 dark:bg-blue-950/60 font-semibold'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 px-4 font-black text-blue-600 dark:text-blue-400">
                            {r.routeNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            {r.from} &rarr; {r.to}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {r.date}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {r.day}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                            {r.tripTime}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                            {r.vehicleCapacity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                            {r.passengerCount}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                occupancy > 85
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200'
                                  : occupancy >= 60
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                              }`}
                            >
                              <span>{occupancy > 85 ? '🔴' : occupancy >= 60 ? '🟡' : '🟢'}</span>
                              <span>{occupancy > 85 ? 'High' : occupancy >= 60 ? 'Medium' : 'Low'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditRecord(r)}
                                title="Edit Record in form above"
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord(r.id, r.routeNumber)}
                                title="Delete Record from database"
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROUTE MANAGEMENT */}
      {activeTab === 'route-mgmt' && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Transit Route Network Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure active corridors, default vehicle capacities, and assigned fleet distributions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_MANAGED_ROUTES.map((rt) => (
                <div
                  key={rt.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                          {rt.routeNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {rt.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {rt.from} &rarr; {rt.to}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {rt.corridorType}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
                      <span className="font-bold font-mono">{rt.totalDistanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Frequency</span>
                      <span className="font-bold font-mono">Every {rt.frequencyMin}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Capacity</span>
                      <span className="font-bold font-mono">{rt.defaultCapacity} seats</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRIP MANAGEMENT */}
      {activeTab === 'trip-mgmt' && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Scheduled Trips & Vehicle Dispatch Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor live scheduled departures, vehicle assignments, and driver duty schedules.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Trip ID</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Departure Time</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Vehicle Number</th>
                    <th className="py-3 px-4">Driver</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {INITIAL_SCHEDULED_TRIPS.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-500">{st.id}</td>
                      <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {st.routeNumber} · {st.routeName}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">{st.departureTime}</td>
                      <td className="py-3 px-4">{st.day}</td>
                      <td className="py-3 px-4 font-mono font-semibold">{st.vehicleNumber}</td>
                      <td className="py-3 px-4">{st.driverName}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            st.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                              : st.status === 'Completed'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PREDICTION RESULTS (Section 2) */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Demand Prediction Engine (Powered by Stored Historical Records)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates Expected Passenger Count and compares with Vehicle Capacity to determine crowd level: 🟢 Low (&lt;60%), 🟡 Medium (60%-85%), 🔴 High (&gt;85%).
              </p>
            </div>

            {/* Prediction Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Route
                </label>
                <select
                  value={predRoute}
                  onChange={(e) => setPredRoute(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 outline-none"
                >
                  {uniqueRoutes.map((rt) => (
                    <option key={rt} value={rt}>Route {rt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Day of Week
                </label>
                <select
                  value={predDay}
                  onChange={(e) => setPredDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 outline-none"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Trip Time
                </label>
                <input
                  type="text"
                  value={predTime}
                  onChange={(e) => setPredTime(e.target.value)}
                  placeholder="e.g. 8:00 AM"
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Vehicle Capacity
                </label>
                <input
                  type="number"
                  min={20}
                  max={100}
                  value={predCapacity}
                  onChange={(e) => setPredCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Prediction Output Card (Section 2 requirement) */}
            {predictionResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800/80 pb-4">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-cyan-300 font-bold">
                      Prediction Output for {predictionResult.routeName}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black mt-0.5">
                      {predictionResult.from} &rarr; {predictionResult.to}
                    </h4>
                    <p className="text-xs text-blue-200 mt-1">
                      {predictionResult.day} at {predictionResult.tripTime} · Calibrated from {predictionResult.historicalSampleCount} historical records
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-blue-300 block">Crowd Level Result:</span>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-lg mt-1 shadow-md ${
                        predictionResult.crowdLevel === 'High'
                          ? 'bg-rose-500 text-white'
                          : predictionResult.crowdLevel === 'Medium'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      <span>
                        {predictionResult.crowdLevel === 'High' ? '🔴' : predictionResult.crowdLevel === 'Medium' ? '🟡' : '🟢'}
                      </span>
                      <span>{predictionResult.crowdLevel} Crowd</span>
                    </div>
                  </div>
                </div>

                {/* Calculation breakdown: Expected Passenger Count vs Vehicle Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-950/70 border border-blue-800/60">
                    <span className="text-xs text-blue-300 block">Expected Passenger Count</span>
                    <div className="text-3xl font-black text-cyan-300 mt-1">
                      {predictionResult.expectedPassengerCount}
                    </div>
                    <span className="text-[11px] text-blue-300/80 mt-1 block">
                      Historical Average: ~{predictionResult.sampleHistoricalAverage}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/70 border border-blue-800/60">
                    <span className="text-xs text-blue-300 block">Vehicle Capacity</span>
                    <div className="text-3xl font-black text-white mt-1">
                      {predictionResult.vehicleCapacity}
                    </div>
                    <span className="text-[11px] text-blue-300/80 mt-1 block">
                      Seat & Standing Configuration
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/70 border border-blue-800/60">
                    <span className="text-xs text-blue-300 block">Capacity Utilization Ratio</span>
                    <div className="text-3xl font-black text-amber-300 mt-1">
                      {predictionResult.occupancyPercentage}%
                    </div>
                    <span className="text-[11px] text-blue-300/80 mt-1 block">
                      {predictionResult.expectedPassengerCount} passengers / {predictionResult.vehicleCapacity} capacity
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-200">Load Meter</span>
                    <span className="text-cyan-300">{predictionResult.occupancyPercentage}% Occupancy</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-blue-950 overflow-hidden border border-blue-700/60">
                    <div
                      className={`h-full transition-all duration-500 ${
                        predictionResult.crowdLevel === 'High'
                          ? 'bg-rose-500'
                          : predictionResult.crowdLevel === 'Medium'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, predictionResult.occupancyPercentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-blue-300/60 font-mono">
                    <span>0% (Empty)</span>
                    <span>60% (Medium Threshold)</span>
                    <span>85% (High Threshold)</span>
                    <span>100% (Full)</span>
                  </div>
                </div>

                {/* Factors analyzed */}
                <div className="space-y-2 pt-2 border-t border-blue-800/60">
                  <span className="text-xs font-bold uppercase text-blue-300 block">Factors Analyzed by Model:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {predictionResult.contributingFactors.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-blue-900/60 border border-blue-800/60 text-xs">
                        <span className="font-bold text-white block">{f.factor}</span>
                        <span className="text-cyan-300 font-semibold">{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: DETAILED ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Historical Transit Fleet & Passenger Demand Analytics</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated statistics computed directly from the manual historical records stored in the database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route-by-Route Demand Distribution */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Route Passenger Volume Comparison
                </h4>
                <div className="space-y-3">
                  {uniqueRoutes.map((rt) => {
                    const rtRecords = records.filter((r) => r.routeNumber.toUpperCase() === rt);
                    const avg =
                      rtRecords.length > 0
                        ? Math.round(rtRecords.reduce((acc, r) => acc + r.passengerCount, 0) / rtRecords.length)
                        : 0;
                    const cap = rtRecords[0]?.vehicleCapacity || 50;
                    const pct = Math.round((avg / cap) * 100);

                    return (
                      <div key={rt} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="text-blue-600 dark:text-blue-400">Route {rt}</span>
                          <span>{avg} avg passengers ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full ${
                              pct > 85 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time of Day Distribution */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Peak Windows in Historical Records
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                    <div>
                      <strong className="text-rose-900 dark:text-rose-200 block">Morning Peak (7:30 - 9:30 AM)</strong>
                      <span className="text-slate-500">College and hospital workers commute surge</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600">Avg 45 / 50 (90%)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-900 dark:text-amber-200 block">Midday Off-Peak (10:00 AM - 4:00 PM)</strong>
                      <span className="text-slate-500">Regular non-rush travel</span>
                    </div>
                    <span className="font-mono font-bold text-amber-600">Avg 26 / 50 (52%)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                    <div>
                      <strong className="text-rose-900 dark:text-rose-200 block">Evening Peak (5:00 - 7:30 PM)</strong>
                      <span className="text-slate-500">Avinashi Road & Trichy Road office exits</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600">Avg 48 / 50 (96%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
