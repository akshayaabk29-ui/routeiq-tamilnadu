import React, { useState, useEffect } from 'react';
import {
  ThemeMode,
  AppLanguage,
  SimpleCrowdLevel,
} from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import {
  getAuthorityOverviewMetrics,
  predictDemandFromHistoricalData,
  subscribeToTripDataChanges,
  AuthorityMetrics,
  INITIAL_MANAGED_ROUTES,
  INITIAL_SCHEDULED_TRIPS,
} from '../../services/tripDataService';
import { playClickSound } from '../../services/soundEffects';
import {
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Bus,
  Layers,
  Filter,
  Users,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Search,
  Maximize2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface SeparateAuthorityDashboardProps {
  initialTab?: 'overview' | 'map';
  language?: AppLanguage;
  theme?: ThemeMode;
}

interface MapRouteDisplay {
  id: string;
  routeNumber: string;
  routeName: string;
  from: string;
  to: string;
  path: { x1: number; y1: number; x2: number; y2: number };
  time: string;
  day: string;
  capacity: number;
  predictedPassengers: number;
  crowdLevel: SimpleCrowdLevel;
  occupancyPercent: number;
}

export const SeparateAuthorityDashboard: React.FC<SeparateAuthorityDashboardProps> = ({
  initialTab = 'overview',
  language = 'en',
  theme = 'light',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'overview' | 'map'>(initialTab);
  const [metrics, setMetrics] = useState<AuthorityMetrics>(getAuthorityOverviewMetrics());

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // City Crowd Map Filter states
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Monday');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('8:00 AM');
  const [selectedCrowdFilter, setSelectedCrowdFilter] = useState<string>('ALL');

  // Selected Route Details for Inspector
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<MapRouteDisplay | null>(null);

  // Subscribe to trip data changes in database
  useEffect(() => {
    const refresh = () => setMetrics(getAuthorityOverviewMetrics());
    refresh();
    const unsubscribe = subscribeToTripDataChanges(refresh);
    return () => unsubscribe();
  }, []);

  // Compute map routes based on current filters & predictions
  const baseMapRoutes: { id: string; routeNumber: string; from: string; to: string; path: { x1: number; y1: number; x2: number; y2: number } }[] = [
    { id: 'mr-21a', routeNumber: '21A', from: 'Periyar', to: 'Mattuthavani', path: { x1: 180, y1: 280, x2: 480, y2: 140 } },
    { id: 'mr-42b', routeNumber: '42B', from: 'Ukkadam', to: 'Railway Station', path: { x1: 220, y1: 340, x2: 360, y2: 240 } },
    { id: 'mr-70a', routeNumber: '70A', from: 'Gandhipuram', to: 'KPR Institute', path: { x1: 350, y1: 200, x2: 620, y2: 80 } },
    { id: 'mr-10c', routeNumber: '10C', from: 'Central Bus Stand', to: 'Thudiyalur', path: { x1: 340, y1: 220, x2: 340, y2: 60 } },
    { id: 'mr-12d', routeNumber: '12D', from: 'Singanallur', to: 'Saravanampatti', path: { x1: 460, y1: 300, x2: 490, y2: 110 } },
    { id: 'mr-33a', routeNumber: '33A', from: 'Periyar', to: 'Tiruppur Hub', path: { x1: 180, y1: 280, x2: 650, y2: 230 } },
    { id: 'mr-11b', routeNumber: '11B', from: 'Ukkadam', to: 'Hope College', path: { x1: 220, y1: 340, x2: 440, y2: 210 } },
    { id: 'mr-5c', routeNumber: '5C', from: 'Central Bus Stand', to: 'Pollachi Road', path: { x1: 340, y1: 220, x2: 200, y2: 390 } },
  ];

  const mapRoutesWithPredictions: MapRouteDisplay[] = baseMapRoutes.map((bmr) => {
    const pred = predictDemandFromHistoricalData({
      routeNumber: bmr.routeNumber,
      day: selectedDayFilter,
      tripTime: selectedTimeFilter,
    });
    return {
      id: bmr.id,
      routeNumber: bmr.routeNumber,
      routeName: pred.routeName,
      from: bmr.from,
      to: bmr.to,
      path: bmr.path,
      time: selectedTimeFilter,
      day: selectedDayFilter,
      capacity: pred.vehicleCapacity,
      predictedPassengers: pred.expectedPassengerCount,
      crowdLevel: pred.crowdLevel,
      occupancyPercent: pred.occupancyPercentage,
    };
  });

  // Filter map routes
  const filteredMapRoutes = mapRoutesWithPredictions.filter((mr) => {
    const matchesRoute = selectedRouteFilter === 'ALL' || mr.routeNumber === selectedRouteFilter;
    const matchesCrowd = selectedCrowdFilter === 'ALL' || mr.crowdLevel === selectedCrowdFilter;
    return matchesRoute && matchesCrowd;
  });

  // Default select first route if none selected
  useEffect(() => {
    if (!selectedRouteDetails && mapRoutesWithPredictions.length > 0) {
      setSelectedRouteDetails(mapRoutesWithPredictions[0]);
    }
  }, [mapRoutesWithPredictions]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Transport Authority Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Authority Transit Operations Dashboard
            </h1>
            <p className="text-sm text-blue-200/80 max-w-2xl">
              Real-time executive overview and interactive city crowd map powered by the unified RouteIQ prediction engine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-blue-900/60 border border-blue-700/50 text-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-bold text-white block">Connected to Unified Database</span>
                <span className="text-[11px] text-blue-300">Live Prediction Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar (ONLY Overview & City Crowd Map as specified in Section 4 & 6) */}
      <div
        className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('overview');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>A. {t.overview}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('map');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>B. {t.cityMap}</span>
        </button>
      </div>

      {/* SECTION A: AUTHORITY OVERVIEW (Section 4A requirements) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards Grid (Exact 8 required cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Total Routes */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t.totalRoutes}</span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{metrics.totalRoutes}</div>
              <p className="text-xs text-slate-500">Active municipal corridors</p>
            </div>

            {/* 2. Total Trips */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t.totalTrips}</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{metrics.totalTrips}</div>
              <p className="text-xs text-slate-500">Daily scheduled departures</p>
            </div>

            {/* 3. Total Buses */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t.totalBuses}</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{metrics.totalBuses}</div>
              <p className="text-xs text-slate-500">Active fleet in circulation</p>
            </div>

            {/* 4. Current / Predicted Passenger Count */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t.expectedPassengers}</span>
              <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{metrics.totalCurrentPassengers}</div>
              <p className="text-xs text-slate-500">Network load at peak window</p>
            </div>

            {/* 5. Low Crowd Routes */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block flex items-center gap-1.5">
                <span>🟢</span>
                <span>{t.lowCrowd}</span>
              </span>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{metrics.lowCrowdRoutesCount}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">&lt; 60% capacity occupancy</p>
            </div>

            {/* 6. Medium Crowd Routes */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block flex items-center gap-1.5">
                <span>🟡</span>
                <span>{t.mediumCrowd}</span>
              </span>
              <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{metrics.mediumCrowdRoutesCount}</div>
              <p className="text-xs text-amber-600 dark:text-amber-400">60% – 85% capacity occupancy</p>
            </div>

            {/* 7. High Crowd Routes */}
            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block flex items-center gap-1.5">
                <span>🔴</span>
                <span>{t.highCrowd}</span>
              </span>
              <div className="text-3xl font-black text-rose-700 dark:text-rose-300">{metrics.highCrowdRoutesCount}</div>
              <p className="text-xs text-rose-600 dark:text-rose-400">&gt; 85% capacity threshold</p>
            </div>

            {/* 8. Predicted High-Crowd Trips */}
            <div className="p-5 rounded-2xl bg-red-100/70 dark:bg-red-950/70 border border-red-300 dark:border-red-800 shadow-sm space-y-1">
              <span className="text-xs font-bold text-red-900 dark:text-red-200 uppercase tracking-wider block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>{t.highCrowdTrips}</span>
              </span>
              <div className="text-3xl font-black text-red-800 dark:text-red-200">{metrics.predictedHighCrowdTripsCount}</div>
              <p className="text-xs text-red-700 dark:text-red-300">Urgent relief monitoring</p>
            </div>
          </div>

          {/* Highlights Section (Also show: Most crowded route, Most crowded time, Number of high-crowd trips) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Most crowded route */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.mostCrowdedRoute}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs">
                  🔴 {t.highCrowd}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                Route {metrics.mostCrowdedRoute.routeNumber}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {metrics.mostCrowdedRoute.routeName}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">{t.expectedPassengers}: {metrics.mostCrowdedRoute.predictedPassengers} / {metrics.mostCrowdedRoute.capacity}</span>
                <span className="font-bold text-rose-600 font-mono">{metrics.mostCrowdedRoute.occupancyPercent}%</span>
              </div>
            </div>

            {/* Most crowded time */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.mostCrowdedTime}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                5:30 PM – 6:30 PM
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Evening Peak Dispersal across Avinashi & Trichy Trunk Lines
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Peak Window Surge</span>
                <span className="font-bold text-amber-600">+34%</span>
              </div>
            </div>

            {/* Number of high-crowd trips */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.highCrowdTrips}</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {metrics.predictedHighCrowdTripsCount} Trips Flagged
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Requires scheduled standby bus deployment or passenger redistribution
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveTab('map')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Inspect on City Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* High-Crowd Trips Immediate Action Table */}
          <div
            className={`rounded-2xl border p-6 shadow-sm ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Predicted High-Crowd Trips Needing Authority Action</span>
                </h3>
                <p className="text-xs text-slate-500">Trips where predicted passenger demand exceeds 85% vehicle capacity</p>
              </div>
              <button
                onClick={() => setActiveTab('map')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open City Crowd Map &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Trip ID</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Scheduled Time</th>
                    <th className="py-2.5 px-3">Vehicle Capacity</th>
                    <th className="py-2.5 px-3">Predicted Passengers</th>
                    <th className="py-2.5 px-3">Crowd Level</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {metrics.highCrowdTrips.map((trip) => {
                    const occ = Math.round((trip.predictedPassengers / trip.capacity) * 100);
                    return (
                      <tr key={trip.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{trip.id}</td>
                        <td className="py-2.5 px-3 font-black text-blue-600 dark:text-blue-400">
                          {trip.routeNumber} · {trip.routeName}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold">{trip.time}</td>
                        <td className="py-2.5 px-3 font-mono">{trip.capacity}</td>
                        <td className="py-2.5 px-3 font-mono font-black text-rose-600">{trip.predictedPassengers}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200 font-bold text-xs">
                            🔴 High ({occ}%)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedRouteFilter(trip.routeNumber);
                              setActiveTab('map');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
                          >
                            Inspect on Map
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
      )}

      {/* SECTION B: CITY CROWD MAP (Section 4B requirements) */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          {/* Interactive Filters Bar (Route, Day, Time, Crowd Level) */}
          <div
            className={`p-5 rounded-2xl border shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                City Crowd Map Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Route Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Route</label>
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedRouteFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Routes ({baseMapRoutes.length})</option>
                  {baseMapRoutes.map((r) => (
                    <option key={r.routeNumber} value={r.routeNumber}>
                      Route {r.routeNumber} ({r.from} &rarr; {r.to})
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Day</label>
                <select
                  value={selectedDayFilter}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedDayFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Time</label>
                <select
                  value={selectedTimeFilter}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedTimeFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="8:00 AM">8:00 AM (Morning Peak)</option>
                  <option value="9:00 AM">9:00 AM (Morning Office)</option>
                  <option value="11:00 AM">11:00 AM (Midday Off-Peak)</option>
                  <option value="2:00 PM">2:00 PM (Afternoon)</option>
                  <option value="5:30 PM">5:30 PM (Evening Peak Surge)</option>
                  <option value="6:30 PM">6:30 PM (Evening Transit)</option>
                  <option value="8:30 PM">8:30 PM (Night Service)</option>
                </select>
              </div>

              {/* Crowd Level Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Crowd Level</label>
                <select
                  value={selectedCrowdFilter}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedCrowdFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Crowd Levels</option>
                  <option value="Low">🟢 Low Crowd Only</option>
                  <option value="Medium">🟡 Medium Crowd Only</option>
                  <option value="High">🔴 High Crowd Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Map Visualizer + Route Inspector Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Canvas (2 Columns on large screens) */}
            <div
              className={`lg:col-span-2 rounded-2xl border overflow-hidden shadow-sm ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="relative bg-slate-950 p-4">
                {/* SVG Route Canvas */}
                <svg viewBox="0 0 720 460" className="w-full h-auto max-h-[480px]">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="720" height="460" fill="url(#grid)" />

                  <text x="20" y="30" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    CITY TRANSIT CORRIDOR CROWD RADAR ({selectedDayFilter.toUpperCase()} · {selectedTimeFilter})
                  </text>

                  {/* Transport Routes */}
                  {filteredMapRoutes.map((route) => {
                    const isSelected = selectedRouteDetails?.routeNumber === route.routeNumber;
                    const strokeColor =
                      route.crowdLevel === 'High' ? '#ef4444' : route.crowdLevel === 'Medium' ? '#f59e0b' : '#10b981';

                    return (
                      <g
                        key={route.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedRouteDetails(route);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Glow halo for selected route */}
                        {isSelected && (
                          <line
                            x1={route.path.x1}
                            y1={route.path.y1}
                            x2={route.path.x2}
                            y2={route.path.y2}
                            stroke={strokeColor}
                            strokeWidth="12"
                            strokeOpacity="0.3"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Main Corridor Line */}
                        <line
                          x1={route.path.x1}
                          y1={route.path.y1}
                          x2={route.path.x2}
                          y2={route.path.y2}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 6 : 4}
                          strokeLinecap="round"
                          className="transition-all duration-300 group-hover:stroke-width-[7]"
                        />

                        {/* Midpoint Route Badge */}
                        <g transform={`translate(${(route.path.x1 + route.path.x2) / 2}, ${(route.path.y1 + route.path.y2) / 2})`}>
                          <rect
                            x="-22"
                            y="-11"
                            width="44"
                            height="22"
                            rx="6"
                            fill="#0f172a"
                            stroke={strokeColor}
                            strokeWidth="2"
                          />
                          <text
                            x="0"
                            y="4"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {route.routeNumber}
                          </text>
                        </g>

                        {/* Origin & Destination Nodes */}
                        <circle cx={route.path.x1} cy={route.path.y1} r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                        <circle cx={route.path.x2} cy={route.path.y2} r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />

                        <text x={route.path.x1} y={route.path.y1 - 8} textAnchor="middle" fill="#94a3b8" fontSize="9">
                          {route.from}
                        </text>
                        <text x={route.path.x2} y={route.path.y2 + 15} textAnchor="middle" fill="#94a3b8" fontSize="9">
                          {route.to}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-4 text-white shadow-lg">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>🟢 Low (&lt;60%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>🟡 Medium (60-85%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span>🔴 High (&gt;85%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Inspector Drawer (Section 4B requirements: Route number, Route name, Time, Vehicle capacity, Predicted passenger count, Crowd level) */}
            <div className="space-y-4">
              {selectedRouteDetails ? (
                <div
                  className={`p-6 rounded-2xl border shadow-sm space-y-5 transition-colors ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Selected Route Telemetry
                      </span>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono text-sm">
                          {selectedRouteDetails.routeNumber}
                        </span>
                        <span>{selectedRouteDetails.routeName}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedRouteDetails.from} &rarr; {selectedRouteDetails.to}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                        selectedRouteDetails.crowdLevel === 'High'
                          ? 'bg-rose-500 text-white'
                          : selectedRouteDetails.crowdLevel === 'Medium'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {selectedRouteDetails.crowdLevel === 'High' ? `🔴 ${t.highCrowd}` : selectedRouteDetails.crowdLevel === 'Medium' ? `🟡 ${t.mediumCrowd}` : `🟢 ${t.lowCrowd}`}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Time */}
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.departureTime}:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {selectedRouteDetails.time} ({selectedRouteDetails.day})
                      </span>
                    </div>

                    {/* Vehicle Capacity */}
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.vehicleCapacity}:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {selectedRouteDetails.capacity}
                      </span>
                    </div>

                    {/* Predicted Passenger Count */}
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">{t.expectedPassengers}:</span>
                      <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                        {selectedRouteDetails.predictedPassengers}
                      </span>
                    </div>

                    {/* Occupancy Ratio */}
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Capacity Ratio:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {selectedRouteDetails.occupancyPercent}% Occupancy
                      </span>
                    </div>
                  </div>

                  {/* Load Meter Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Occupancy Gauge</span>
                      <span
                        className={
                          selectedRouteDetails.crowdLevel === 'High'
                            ? 'text-rose-600 font-bold'
                            : selectedRouteDetails.crowdLevel === 'Medium'
                            ? 'text-amber-600 font-bold'
                            : 'text-emerald-600 font-bold'
                        }
                      >
                        {selectedRouteDetails.occupancyPercent}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div
                        className={`h-full transition-all duration-500 ${
                          selectedRouteDetails.crowdLevel === 'High'
                            ? 'bg-rose-500'
                            : selectedRouteDetails.crowdLevel === 'Medium'
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, selectedRouteDetails.occupancyPercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
                    💡 <strong>Authority Insight:</strong> Computed directly from previous trip logs stored in the admin database.
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 text-xs">
                  Click on any route line on the map to inspect its real-time predicted crowd level and vehicle capacity.
                </div>
              )}

              {/* Quick Route Switcher List */}
              <div
                className={`p-4 rounded-2xl border shadow-sm space-y-2 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">City Corridors ({mapRoutesWithPredictions.length})</h5>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {mapRoutesWithPredictions.map((mr) => {
                    const isSelected = selectedRouteDetails?.routeNumber === mr.routeNumber;
                    return (
                      <button
                        key={mr.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedRouteDetails(mr);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {mr.routeNumber}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                            {mr.from} - {mr.to}
                          </span>
                        </div>
                        <span className="font-bold shrink-0">
                          {mr.crowdLevel === 'High' ? '🔴 High' : mr.crowdLevel === 'Medium' ? '🟡 Med' : '🟢 Low'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
