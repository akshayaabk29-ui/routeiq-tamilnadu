import React, { useState } from 'react';
import { AppLanguage, ThemeMode } from '../../types';
import {
  TAMIL_NADU_32_DISTRICTS,
  INTERSTATE_REGIONS,
  DistrictInfo,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsLocationUrl,
} from '../../data/tamilNaduRegionalData';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound, playChimeSound } from '../../services/soundEffects';
import {
  MapPin,
  Compass,
  ExternalLink,
  Search,
  Building2,
  Bus,
  Layers,
  ShieldCheck,
  Award,
  Wind,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Navigation,
} from 'lucide-react';

interface DistrictMapsExplorerProps {
  onSelectRoutePoints: (from: string, to: string) => void;
  language: AppLanguage;
  theme: ThemeMode;
}

// Tamil names for districts to make Tamil experience fully native
const TAMIL_DISTRICT_NAMES: Record<string, string> = {
  Ariyalur: 'அரியலூர்',
  Chennai: 'சென்னை',
  Coimbatore: 'கோயம்புத்தூர்',
  Cuddalore: 'கடலூர்',
  Dharmapuri: 'தருமபுரி',
  Dindigul: 'திண்டுக்கல்',
  Erode: 'ஈரோடு',
  Kancheepuram: 'காஞ்சிபுரம்',
  Kanniyakumari: 'கன்னியாகுமரி',
  Karur: 'கரூர்',
  Krishnagiri: 'கிருஷ்ணகிரி',
  Madurai: 'மதுரை',
  Nagapattinam: 'நாகப்பட்டினம்',
  Namakkal: 'நாமக்கல்',
  Perambalur: 'பெரம்பலூர்',
  Pudukkottai: 'புதுக்கோட்டை',
  Ramanathapuram: 'இராமநாதபுரம்',
  Salem: 'சேலம்',
  Sivaganga: 'சிவகங்கை',
  Thanjavur: 'தஞ்சாவூர்',
  'The Nilgiris': 'நீலகிரி',
  Theni: 'தேனி',
  Thiruvallur: 'திருவள்ளூர்',
  Thiruvarur: 'திருவாரூர்',
  Thoothukudi: 'தூத்துக்குடி',
  Tiruchirappalli: 'திருச்சிராப்பள்ளி',
  Tirunelveli: 'திருநெல்வேலி',
  Tiruppur: 'திருப்பூர்',
  Tiruvannamalai: 'திருவண்ணாமலை',
  Vellore: 'வேலூர்',
  Villupuram: 'விழுப்புரம்',
  Virudhunagar: 'விருதுநகர்',
};

export const DistrictMapsExplorer: React.FC<DistrictMapsExplorerProps> = ({
  onSelectRoutePoints,
  language,
  theme,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(
    TAMIL_NADU_32_DISTRICTS[2] // Coimbatore default
  );
  const [activeZone, setActiveZone] = useState<'all' | 'west' | 'south' | 'north' | 'central' | 'interstate'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSatelliteView, setShowSatelliteView] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Geographic SVG bounds
  const mapWidth = 720;
  const mapHeight = 520;
  const pad = { left: 45, right: 45, top: 40, bottom: 40 };
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
    return { ...d, x, y };
  });

  // Interstate border connection nodes
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

  // Arterial highway routes
  const highwayConnections = [
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
    { from: 'Thanjavur', to: 'Thiruvarur' },
    { from: 'Thiruvarur', to: 'Nagapattinam' },
  ];

  // Filter districts based on search
  const filteredDistricts = TAMIL_NADU_32_DISTRICTS.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const tamilName = TAMIL_DISTRICT_NAMES[d.district] || '';
    return (
      d.district.toLowerCase().includes(q) ||
      tamilName.toLowerCase().includes(q) ||
      d.headquarters.toLowerCase().includes(q) ||
      d.majorTowns.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleSelectDistrict = (d: DistrictInfo) => {
    playClickSound();
    setSelectedDistrict(d);
  };

  const getDistrictTamilName = (distName: string) => {
    return TAMIL_DISTRICT_NAMES[distName] || distName;
  };

  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selectedDistrict.headquarters + ', ' + selectedDistrict.district + ', Tamil Nadu'
  )}&t=${showSatelliteView ? 'k' : 'm'}&z=10&output=embed`;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Header */}
      <div
        className={`p-6 rounded-2xl border transition-colors shadow-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {language === 'ta'
                  ? 'தமிழ்நாட்டின் 32 மாவட்டங்கள் & வரைபடம்'
                  : '32 Tamil Nadu Districts & Geospatial Transit Maps'}
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                100% FC Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              {language === 'ta'
                ? 'அனைத்து 32 தமிழக மாவட்டங்கள், முக்கிய நகரங்கள், நேரலை பேருந்து வழித்தடங்கள் மற்றும் கூகிள் வரைபட ஒருங்கிணைப்பு.'
                : 'Interactive geospatial grid covering all 32 Tamil Nadu districts, 250+ major towns/sub-towns, and interstate gateways to Karnataka, Kerala, AP, and Puducherry.'}
            </p>
          </div>

          {/* Quick Search across districts & towns */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'மாவட்டம் அல்லது நகரத்தை தேடுக...'
                  : 'Search any district or town (e.g., Chennai, Pollachi, Ooty)...'
              }
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map Canvas + District Town Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive SVG Geospatial Map & Live Google Maps Embed (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl border overflow-hidden shadow-xs transition-colors ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Map Header Toolbar */}
          <div
            className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {language === 'ta' ? 'நேரலை வரைபடம்' : 'Live Transit Grid'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                {language === 'ta'
                  ? `தேர்ந்தெடுக்கப்பட்டது: ${getDistrictTamilName(selectedDistrict.district)}`
                  : `Selected: ${selectedDistrict.district} (#${selectedDistrict.no})`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSatelliteView(!showSatelliteView)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                  showSatelliteView
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {showSatelliteView ? 'Map View' : 'Satellite View'}
              </button>

              <a
                href={getGoogleMapsLocationUrl(
                  `${selectedDistrict.headquarters}, ${selectedDistrict.district}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                <span>{t.openInGoogleMaps || 'Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* SVG Map Canvas with Grid Lines */}
          <div className="relative bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <svg
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-auto max-h-[500px] select-none"
            >
              {/* Title inside Canvas */}
              <text x={25} y={30} fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                TAMIL NADU 32 DISTRICTS TRANSIT NETWORK · GPS ARTERIAL
              </text>
              <text x={25} y={44} fill="#64748b" fontSize="8.5" fontFamily="monospace">
                CLICK ANY DISTRICT PIN TO EXPLORE TOWNS, FC FLEET & BUS ROUTES
              </text>

              {/* Highway Trunk Connection Lines */}
              {highwayConnections.map((conn, idx) => {
                const fromD = districtNodes.find((d) => d.district === conn.from);
                const toD = districtNodes.find((d) => d.district === conn.to);
                if (!fromD || !toD) return null;
                const isSelected =
                  selectedDistrict.district === conn.from || selectedDistrict.district === conn.to;

                return (
                  <line
                    key={`trunk-${idx}`}
                    x1={fromD.x}
                    y1={fromD.y}
                    x2={toD.x}
                    y2={toD.y}
                    stroke={isSelected ? '#10b981' : '#334155'}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                    className="transition-all"
                  />
                );
              })}

              {/* Interstate Links */}
              {interstateNodes.map((h, i) => (
                <g key={`hub-${i}`}>
                  <circle cx={h.x} cy={h.y} r={5} fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={h.x}
                    y={h.y - 8}
                    textAnchor="middle"
                    fill="#fcd34d"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {h.name}
                  </text>
                </g>
              ))}

              {/* 32 District Nodes */}
              {districtNodes.map((d) => {
                const isSelected = selectedDistrict.district === d.district;
                const nodeColor = isSelected ? '#10b981' : '#94a3b8';

                return (
                  <g
                    key={d.district}
                    onClick={() => handleSelectDistrict(d)}
                    className="cursor-pointer group"
                  >
                    {isSelected && (
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={16}
                        fill="#10b981"
                        fillOpacity={0.25}
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={isSelected ? 6.5 : 4}
                      fill={nodeColor}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all group-hover:scale-125"
                    />
                    <text
                      x={d.x}
                      y={d.y + 14}
                      textAnchor="middle"
                      fill={isSelected ? '#34d399' : '#cbd5e1'}
                      fontSize={isSelected ? '10.5' : '8.5'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {language === 'ta' ? getDistrictTamilName(d.district) : d.district}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Embedded Google Maps Live District View */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {language === 'ta'
                    ? `${getDistrictTamilName(selectedDistrict.district)} மாவட்ட நேரலை செயற்கைக்கோள் வரைபடம்`
                    : `Live Interactive Map of ${selectedDistrict.district} (${selectedDistrict.headquarters})`}
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedDistrict.lat}° N, {selectedDistrict.lng}° E
              </span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-52 bg-slate-200 dark:bg-slate-800 relative">
              <iframe
                title={`Map of ${selectedDistrict.district}`}
                src={googleMapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Selected District Card, Town Directory, FC Fleet Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Selected District Profile Card */}
          <div
            className={`p-5 rounded-2xl border transition-colors shadow-xs ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    District #{selectedDistrict.no}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Tamil Nadu State</span>
                </div>
                <h3 className="text-xl font-black mt-1 text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{selectedDistrict.district}</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ({getDistrictTamilName(selectedDistrict.district)})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Headquarters: <strong className="text-slate-700 dark:text-slate-300">{selectedDistrict.headquarters}</strong> · Arterial Gateways
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center shrink-0">
                <span className="text-lg font-black block leading-none">{selectedDistrict.majorTowns.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider block mt-0.5">Towns</span>
              </div>
            </div>

            {/* FC Quality & Fleet Compliance Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>FC Compliance</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white block">100% Certified</span>
                <span className="text-[10px] text-slate-400">RTO Tested AIS-140</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Avg Cabin AQI</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white block">38 (Clean Air)</span>
                <span className="text-[10px] text-slate-400">HEPA Filter Equiv.</span>
              </div>
            </div>
          </div>

          {/* Major Towns & Sub-Towns Directory */}
          <div
            className={`p-5 rounded-2xl border transition-colors shadow-xs ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {language === 'ta'
                    ? `${getDistrictTamilName(selectedDistrict.district)} முக்கிய நகரங்கள்`
                    : `Major Towns in ${selectedDistrict.district}`}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedDistrict.majorTowns.length} Localities
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              {language === 'ta'
                ? 'பயணத்தை திட்டமிட ஏதேனும் ஒரு நகரத்தின் "புறப்பாடு" அல்லது "சேருமிடம்" பொத்தானை அழுத்தவும்:'
                : 'Click "From" or "To" on any town below to plan routes with live crowd predictions:'}
            </p>

            {/* Towns List with 1-Click Action Buttons */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {selectedDistrict.majorTowns.map((town, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{town}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onSelectRoutePoints(town, selectedDistrict.headquarters);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100 transition-colors"
                      title="Set as Journey Origin"
                    >
                      {t.setOrigin || 'From'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onSelectRoutePoints(selectedDistrict.headquarters, town);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/30 hover:bg-blue-100 transition-colors"
                      title="Set as Journey Destination"
                    >
                      {t.setDestination || 'To'}
                    </button>
                    <a
                      href={getGoogleMapsLocationUrl(`${town}, ${selectedDistrict.district}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interstate Transport Gateways Widget */}
          <div
            className={`p-5 rounded-2xl border transition-colors shadow-xs ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-500" />
                <span>Interstate Transit Corridors (KA, KL, AP, TS, PY)</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                5 States/UT
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {INTERSTATE_REGIONS.map((region) => (
                <div
                  key={region.state}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{region.state}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {region.majorTowns.length} Hubs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {region.majorTowns.map((town) => (
                      <button
                        key={town}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          onSelectRoutePoints('Central Bus Stand', town);
                        }}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
                      >
                        {town}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complete 32 District Browser Grid */}
      <div
        className={`p-5 rounded-2xl border transition-colors shadow-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {language === 'ta'
                ? 'அனைத்து 32 தமிழக மாவட்டங்கள் பட்டியல்'
                : 'Complete Tamil Nadu 32 Districts Directory'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ta'
                ? 'வரைபடத்திலும் தகவல்களிலும் காண எந்த மாவட்டத்தையும் கிளிக் செய்யவும்'
                : 'Click any district card to load its map, major towns, and transit details'}
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
            {filteredDistricts.length} / 32 Districts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredDistricts.map((d) => {
            const isSelected = selectedDistrict.district === d.district;
            return (
              <button
                key={d.district}
                type="button"
                onClick={() => handleSelectDistrict(d)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400 scale-[1.02]'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500 text-slate-200'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-500 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isSelected ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    #{d.no}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {d.majorTowns.length} towns
                  </span>
                </div>
                <span className="text-xs font-bold block truncate">{d.district}</span>
                <span
                  className={`text-[10px] block truncate ${
                    isSelected ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {getDistrictTamilName(d.district)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
