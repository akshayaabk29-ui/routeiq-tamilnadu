import React, { useState } from 'react';
import { TransportStop, AppLanguage, ThemeMode } from '../../types';
import { getCrowdHex } from '../../services/predictionEngine';
import {
  TAMIL_NADU_32_DISTRICTS,
  INTERSTATE_REGIONS,
  DistrictInfo,
} from '../../data/tamilNaduRegionalData';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound } from '../../services/soundEffects';
import {
  MapPin,
  TrendingUp,
  Layers,
  Info,
  Maximize2,
  Bus,
  Search,
  Building2,
  Compass,
} from 'lucide-react';

interface CityCrowdMapProps {
  stops: TransportStop[];
  onSelectStop?: (stop: TransportStop) => void;
  language?: AppLanguage;
  theme?: ThemeMode;
}

export const CityCrowdMap: React.FC<CityCrowdMapProps> = ({
  stops,
  onSelectStop,
  language = 'en',
  theme = 'light',
}) => {
  const [mapView, setMapView] = useState<'tn32' | 'cbe-urban'>('tn32');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(TAMIL_NADU_32_DISTRICTS[2]);
  const [selectedStopId, setSelectedStopId] = useState<string>('stop-central-bus-stand');
  const [activeRouteFilter, setActiveRouteFilter] = useState<string>('all');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const selectedStop = stops.find((s) => s.id === selectedStopId) || stops[0];

  // Map dimensions and projection for Tamil Nadu
  const mapWidth = 720;
  const mapHeight = 450;
  const pad = { left: 40, right: 40, top: 30, bottom: 30 };
  const usableW = mapWidth - pad.left - pad.right;
  const usableH = mapHeight - pad.top - pad.bottom;

  const projectCoords = (lat: number, lng: number) => {
    const minLng = 76.0;
    const maxLng = 80.5;
    const minLat = 8.0;
    const maxLat = 13.5;
    const x = pad.left + ((lng - minLng) / (maxLng - minLng)) * usableW;
    const y = pad.top + ((maxLat - lat) / (maxLat - minLat)) * usableH;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const districtNodes = TAMIL_NADU_32_DISTRICTS.map((d) => {
    const { x, y } = projectCoords(d.lat, d.lng);
    // Assign realistic crowd status
    const crowd = d.district === 'Chennai' ? 94 : d.district === 'Coimbatore' ? 88 : d.district === 'Madurai' ? 82 : d.district === 'Salem' ? 76 : 55;
    return { ...d, x, y, crowd };
  });

  const trunkConnections = [
    { from: 'Chennai', to: 'Kancheepuram' },
    { from: 'Kancheepuram', to: 'Vellore' },
    { from: 'Vellore', to: 'Krishnagiri' },
    { from: 'Chennai', to: 'Villupuram' },
    { from: 'Villupuram', to: 'Tiruchirappalli' },
    { from: 'Tiruchirappalli', to: 'Madurai' },
    { from: 'Madurai', to: 'Virudhunagar' },
    { from: 'Virudhunagar', to: 'Tirunelveli' },
    { from: 'Tirunelveli', to: 'Kanniyakumari' },
    { from: 'Coimbatore', to: 'Tiruppur' },
    { from: 'Tiruppur', to: 'Erode' },
    { from: 'Erode', to: 'Salem' },
    { from: 'Salem', to: 'Dharmapuri' },
    { from: 'Dharmapuri', to: 'Krishnagiri' },
    { from: 'Coimbatore', to: 'The Nilgiris' },
    { from: 'Tiruppur', to: 'Dindigul' },
    { from: 'Dindigul', to: 'Madurai' },
    { from: 'Tiruchirappalli', to: 'Thanjavur' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.cityMap}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time telemetry and spatial density distribution across 32 Tamil Nadu districts.
          </p>
        </div>

        {/* View toggle */}
        <div
          className={`flex items-center rounded-xl p-1 border text-xs ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => {
              playClickSound();
              setMapView('tn32');
            }}
            className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
              mapView === 'tn32'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All 32 Tamil Nadu Districts
          </button>
          <button
            onClick={() => {
              playClickSound();
              setMapView('cbe-urban');
            }}
            className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
              mapView === 'cbe-urban'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Coimbatore Metropolitan Core
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative bg-slate-950 p-4">
          <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-auto max-h-[460px]">
            {/* Title inside Canvas */}
            <text x={25} y={30} fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              TAMIL NADU 32 DISTRICT TRANSIT OPERATIONS RADAR
            </text>

            {/* Interdistrict Trunk Connections */}
            {trunkConnections.map((conn, idx) => {
              const fromD = districtNodes.find((d) => d.district === conn.from);
              const toD = districtNodes.find((d) => d.district === conn.to);
              if (!fromD || !toD) return null;

              const isHighlighted =
                selectedDistrict.district === conn.from || selectedDistrict.district === conn.to;

              return (
                <line
                  key={`trunk-${idx}`}
                  x1={fromD.x}
                  y1={fromD.y}
                  x2={toD.x}
                  y2={toD.y}
                  stroke={isHighlighted ? '#10b981' : '#334155'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                />
              );
            })}

            {/* 32 District Hubs */}
            {districtNodes.map((d) => {
              const isSelected = selectedDistrict.district === d.district;
              const crowdHex = d.crowd > 85 ? '#ef4444' : d.crowd > 70 ? '#f59e0b' : '#10b981';

              return (
                <g
                  key={d.district}
                  onClick={() => {
                    playClickSound();
                    setSelectedDistrict(d);
                  }}
                  className="cursor-pointer group"
                >
                  {isSelected && (
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={14}
                      fill={crowdHex}
                      fillOpacity={0.25}
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={isSelected ? 6 : 4}
                    fill={crowdHex}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all group-hover:scale-125"
                  />
                  <text
                    x={d.x}
                    y={d.y + 14}
                    textAnchor="middle"
                    fill={isSelected ? '#34d399' : '#cbd5e1'}
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {d.district} ({d.crowd}%)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* District selector drop on map */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-2 rounded-xl text-xs flex items-center gap-2 z-10 shadow-lg">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDistrict.district}
              onChange={(e) => {
                const d = TAMIL_NADU_32_DISTRICTS.find((item) => item.district === e.target.value);
                if (d) {
                  playClickSound();
                  setSelectedDistrict(d);
                }
              }}
              className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
            >
              {TAMIL_NADU_32_DISTRICTS.map((d) => (
                <option key={d.district} value={d.district} className="bg-slate-900 text-white">
                  District {d.no}: {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected District Telemetry Details */}
        <div
          className={`p-6 border-t space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  District #{selectedDistrict.no}: {selectedDistrict.district}
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedDistrict.majorTowns.length} Municipal Towns Monitored
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Regional Hub: <strong className="text-slate-700 dark:text-slate-300">{selectedDistrict.headquarters}</strong> · Active Telemetry Coverage: 100%
              </p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Corridor Density: {selectedDistrict.district === 'Chennai' ? '94% (Critical)' : selectedDistrict.district === 'Coimbatore' ? '88% (High)' : '62% (Moderate)'}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Major Towns & Transit Stations in {selectedDistrict.district}:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedDistrict.majorTowns.map((town) => (
                <span
                  key={town}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs"
                >
                  {town}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
