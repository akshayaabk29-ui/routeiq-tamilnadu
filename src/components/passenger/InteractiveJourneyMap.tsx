import React, { useState } from 'react';
import { ThemeMode } from '../../types';
import {
  TAMIL_NADU_32_DISTRICTS,
  INTERSTATE_REGIONS,
  TAMIL_NADU_REGIONAL_STOPS,
  DistrictInfo,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsLocationUrl,
} from '../../data/tamilNaduRegionalData';
import { playClickSound } from '../../services/soundEffects';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Building2,
  Bus,
  Search,
} from 'lucide-react';

interface InteractiveJourneyMapProps {
  originName: string;
  destinationName: string;
  onSelectOrigin: (name: string) => void;
  onSelectDestination: (name: string) => void;
  theme: ThemeMode;
}

export const InteractiveJourneyMap: React.FC<InteractiveJourneyMapProps> = ({
  originName,
  destinationName,
  onSelectOrigin,
  onSelectDestination,
  theme,
}) => {
  const [mapMode, setMapMode] = useState<'tn32' | 'cbe-urban' | 'interstate'>('tn32');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(TAMIL_NADU_32_DISTRICTS[2]); // Coimbatore default
  const [districtSearch, setDistrictSearch] = useState<string>('');

  // Geographic bounds for SVG Projection of Tamil Nadu & Neighboring States
  // Lng: 76.0 (West Kerala/Nilgiris) to 80.5 (East Chennai/Bay of Bengal)
  // Lat: 8.0 (South Kanniyakumari) to 13.5 (North Thiruvallur/Tirupati)
  const mapWidth = 720;
  const mapHeight = 480;
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

  // Pre-calculate coordinates for all 32 districts
  const districtNodes = TAMIL_NADU_32_DISTRICTS.map((d) => {
    const { x, y } = projectCoords(d.lat, d.lng);
    return { ...d, x, y };
  });

  // Interstate border hubs
  const interstateNodes = [
    { name: 'Bengaluru (KA)', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    { name: 'Mysuru (KA)', lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
    { name: 'Palakkad (KL)', lat: 10.7867, lng: 76.6548, state: 'Kerala' },
    { name: 'Kochi (KL)', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
    { name: 'Tirupati (AP)', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
    { name: 'Puducherry (PY)', lat: 11.9416, lng: 79.8083, state: 'Puducherry' },
  ].map((h) => {
    const { x, y } = projectCoords(h.lat, h.lng);
    return { ...h, x, y };
  });

  // Key Interdistrict Transport Arterials
  const trunkConnections = [
    // Chennai -> Kancheepuram -> Vellore -> Krishnagiri -> Bengaluru
    { from: 'Chennai', to: 'Kancheepuram' },
    { from: 'Kancheepuram', to: 'Vellore' },
    { from: 'Vellore', to: 'Krishnagiri' },
    { from: 'Chennai', to: 'Villupuram' },
    { from: 'Villupuram', to: 'Tiruchirappalli' },
    { from: 'Tiruchirappalli', to: 'Madurai' },
    { from: 'Madurai', to: 'Virudhunagar' },
    { from: 'Virudhunagar', to: 'Tirunelveli' },
    { from: 'Tirunelveli', to: 'Kanniyakumari' },
    // Coimbatore -> Erode -> Salem -> Dharmapuri -> Krishnagiri
    { from: 'Coimbatore', to: 'Tiruppur' },
    { from: 'Tiruppur', to: 'Erode' },
    { from: 'Erode', to: 'Salem' },
    { from: 'Salem', to: 'Dharmapuri' },
    { from: 'Dharmapuri', to: 'Krishnagiri' },
    // Coimbatore -> Nilgiris
    { from: 'Coimbatore', to: 'The Nilgiris' },
    // Coimbatore -> Dindigul -> Madurai
    { from: 'Tiruppur', to: 'Dindigul' },
    { from: 'Dindigul', to: 'Madurai' },
    // Trichy -> Thanjavur -> Nagapattinam
    { from: 'Tiruchirappalli', to: 'Thanjavur' },
    { from: 'Thanjavur', to: 'Thiruvarur' },
    { from: 'Thiruvarur', to: 'Nagapattinam' },
  ];

  const handleDistrictClick = (d: DistrictInfo) => {
    playClickSound();
    setSelectedDistrict(d);
  };

  const googleMapsUrl = getGoogleMapsDirectionsUrl(
    originName || 'KPR Institute',
    destinationName || 'Central Bus Stand'
  );

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Map Control Header */}
      <div
        className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Live Geospatial Transit Map
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                All 32 Tamil Nadu Districts
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive geographic grid covering all 32 districts, towns, and interstate links
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div
            className={`flex items-center rounded-lg p-0.5 border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMapMode('tn32');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                mapMode === 'tn32'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 32 TN Districts
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMapMode('cbe-urban');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                mapMode === 'cbe-urban'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Coimbatore Urban Grid
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMapMode('interstate');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                mapMode === 'interstate'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Interstate (KA, KL, AP, TS, PY)
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative bg-slate-950 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[460px] select-none"
        >
          <defs>
            <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Map Title inside Canvas */}
          <text x={30} y={35} fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">
            TAMIL NADU STATE TRANSIT GEOSPATIAL INTELLIGENCE GRID
          </text>
          <text x={30} y={50} fill="#64748b" fontSize="9" fontFamily="monospace">
            32 OFFICIAL DISTRICTS · REGIONAL ARTERIAL CORRIDORS · INTERSTATE GATEWAYS
          </text>

          {/* Interdistrict Trunk Corridor Lines */}
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
                className="transition-all"
              />
            );
          })}

          {/* Interstate connection lines to Bengaluru, Palakkad, Kochi, Tirupati */}
          {mapMode === 'interstate' && (
            <>
              {/* Krishnagiri -> Bengaluru */}
              <line x1={districtNodes[10].x} y1={districtNodes[10].y} x2={interstateNodes[0].x} y2={interstateNodes[0].y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              {/* Coimbatore -> Palakkad */}
              <line x1={districtNodes[2].x} y1={districtNodes[2].y} x2={interstateNodes[2].x} y2={interstateNodes[2].y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              {/* Thiruvallur / Chennai -> Tirupati */}
              <line x1={districtNodes[22].x} y1={districtNodes[22].y} x2={interstateNodes[4].x} y2={interstateNodes[4].y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              {/* Cuddalore / Villupuram -> Puducherry */}
              <line x1={districtNodes[3].x} y1={districtNodes[3].y} x2={interstateNodes[5].x} y2={interstateNodes[5].y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />

              {/* Interstate Hub Markers */}
              {interstateNodes.map((h, i) => (
                <g key={`hub-${i}`}>
                  <circle cx={h.x} cy={h.y} r={6} fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={h.x} y={h.y - 10} textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {h.name}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* 32 Districts Nodes & Interactive Hit Areas */}
          {districtNodes.map((d) => {
            const isSelected = selectedDistrict.district === d.district;
            const isOriginDistrict = originName.toLowerCase().includes(d.district.toLowerCase()) || d.majorTowns.some(t => originName.toLowerCase().includes(t.toLowerCase()));
            const isDestDistrict = destinationName.toLowerCase().includes(d.district.toLowerCase()) || d.majorTowns.some(t => destinationName.toLowerCase().includes(t.toLowerCase()));

            const nodeColor = isOriginDistrict
              ? '#10b981' // Green Origin
              : isDestDistrict
              ? '#3b82f6' // Blue Destination
              : isSelected
              ? '#10b981'
              : '#94a3b8';

            return (
              <g
                key={d.district}
                onClick={() => handleDistrictClick(d)}
                className="cursor-pointer transition-transform group"
              >
                {/* Glow ring on selected or origin/dest */}
                {(isSelected || isOriginDistrict || isDestDistrict) && (
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={14}
                    fill={nodeColor}
                    fillOpacity={0.25}
                    className="animate-pulse"
                  />
                )}

                {/* Central pin circle */}
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={isSelected ? 6 : 4}
                  fill={nodeColor}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all group-hover:scale-125"
                />

                {/* District Label */}
                <text
                  x={d.x}
                  y={d.y + 14}
                  textAnchor="middle"
                  fill={isSelected ? '#34d399' : '#cbd5e1'}
                  fontSize={isSelected ? '10' : '8.5'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="sans-serif"
                >
                  {d.district}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick District Finder Overlay */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 p-2 rounded-xl text-xs flex items-center gap-2 z-10 shadow-lg">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDistrict.district}
            onChange={(e) => {
              const d = TAMIL_NADU_32_DISTRICTS.find((item) => item.district === e.target.value);
              if (d) handleDistrictClick(d);
            }}
            className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
          >
            {TAMIL_NADU_32_DISTRICTS.map((d) => (
              <option key={d.district} value={d.district} className="bg-slate-900 text-white">
                {d.no}. {d.district} ({d.majorTowns.length} towns)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected District Town Directory & Quick Action Strip */}
      <div
        className={`p-5 border-t space-y-3 ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>District #{selectedDistrict.no}: {selectedDistrict.district}</span>
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedDistrict.majorTowns.length} Major Towns
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Headquarters: <strong className="text-slate-700 dark:text-slate-300">{selectedDistrict.headquarters}</strong> · GPS Coordinates: {selectedDistrict.lat}°N, {selectedDistrict.lng}°E
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onSelectOrigin(selectedDistrict.headquarters);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              Set as Origin ({selectedDistrict.headquarters})
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onSelectDestination(selectedDistrict.headquarters);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity shadow-2xs"
            >
              Set as Destination
            </button>
          </div>
        </div>

        {/* Town Chips for Selected District */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Major Towns & Sub-Towns in {selectedDistrict.district}:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedDistrict.majorTowns.map((town) => (
              <div
                key={town}
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <span className="font-semibold">{town}</span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onSelectOrigin(town);
                    }}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    title="Set Origin"
                  >
                    From
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onSelectDestination(town);
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    title="Set Destination"
                  >
                    To
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
