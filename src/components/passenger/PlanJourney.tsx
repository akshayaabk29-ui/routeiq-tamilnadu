import React, { useState } from 'react';
import { JourneyPlanInputs, AppLanguage, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../services/translations';
import { playClickSound, playChimeSound } from '../../services/soundEffects';
import { startVoiceRecognition, isSpeechRecognitionSupported } from '../../services/speechService';
import { InteractiveJourneyMap } from './InteractiveJourneyMap';
import {
  TAMIL_NADU_32_DISTRICTS,
  INTERSTATE_REGIONS,
  getAllLocations,
  searchLocations,
  LocationEntry,
} from '../../data/tamilNaduRegionalData';
import {
  MapPin,
  Clock,
  Calendar,
  CloudRain,
  AlertTriangle,
  Sparkles,
  ArrowRightLeft,
  Search,
  Mic,
  Map,
  Compass,
  X,
  Layers,
  ChevronRight,
  Check,
  Building2,
} from 'lucide-react';

interface PlanJourneyProps {
  inputs: JourneyPlanInputs;
  onChangeInputs: (newInputs: JourneyPlanInputs) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onLoadScenario: () => void;
  language: AppLanguage;
  theme: ThemeMode;
}

export const PlanJourney: React.FC<PlanJourneyProps> = ({
  inputs,
  onChangeInputs,
  onSubmit,
  isLoading,
  onLoadScenario,
  language,
  theme,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmbeddedMap, setShowEmbeddedMap] = useState<boolean>(true);
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState<{ stop: () => void } | null>(null);

  // 32 Districts & Towns Browser Modal State
  const [isDistrictBrowserOpen, setIsDistrictBrowserOpen] = useState<boolean>(false);
  const [browserTab, setBrowserTab] = useState<'tn32' | 'interstate'>('tn32');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Coimbatore');
  const [browserSearchQuery, setBrowserSearchQuery] = useState<string>('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSwap = () => {
    playClickSound();
    onChangeInputs({
      ...inputs,
      from: inputs.to,
      to: inputs.from,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.from || !inputs.to) {
      setErrorMessage('Please select both origin and destination.');
      return;
    }
    if (inputs.from === inputs.to) {
      setErrorMessage('Origin and destination cannot be the same location.');
      return;
    }
    setErrorMessage(null);
    playChimeSound();
    onSubmit();
  };

  // Voice to text integration matching any of the 32 districts' towns
  const handleStartVoice = (target: 'from' | 'to' | 'both') => {
    playClickSound();
    if (isVoiceListening) {
      if (voiceRecognitionActive) voiceRecognitionActive.stop();
      setIsVoiceListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage(
        language === 'ta'
          ? 'இந்த உலாவியில் நேரடி மைக்ரோஃபோன் அணுகல் இல்லை. கீழே உள்ள நகரங்களை தேர்ந்தெடுக்கவும்.'
          : 'Microphone voice recognition is restricted in this window. Please select from the 32 districts below.'
      );
      return;
    }

    setIsVoiceListening(true);
    const allLocs = getAllLocations();

    const rec = startVoiceRecognition(language, {
      onTranscript: (transcript, isFinal) => {
        if (isFinal) {
          setIsVoiceListening(false);
          setVoiceRecognitionActive(null);
          playClickSound(800);

          const text = transcript.toLowerCase();
          // Detect "to" separator: e.g. "KPR to Gandhipuram" or "Chennai to Madurai"
          if (target === 'both' && (text.includes(' to ') || text.includes('2') || text.includes('செல்'))) {
            const parts = text.split(/ to | 2 | செல் /);
            if (parts.length >= 2) {
              const matchedFrom = allLocs.find((l) =>
                parts[0].toLowerCase().includes(l.town.toLowerCase().split(' ')[0])
              );
              const matchedTo = allLocs.find((l) =>
                parts[1].toLowerCase().includes(l.town.toLowerCase().split(' ')[0])
              );
              onChangeInputs({
                ...inputs,
                from: matchedFrom?.town || 'KPR Institute',
                to: matchedTo?.town || 'Central Bus Stand',
              });
              return;
            }
          }

          // Single match
          const matched = allLocs.find((l) =>
            text.includes(l.town.toLowerCase().split(' ')[0])
          );
          if (matched) {
            if (target === 'from') onChangeInputs({ ...inputs, from: matched.town });
            else if (target === 'to') onChangeInputs({ ...inputs, to: matched.town });
            else onChangeInputs({ ...inputs, from: matched.town });
          }
        }
      },
      onError: () => {
        setIsVoiceListening(false);
        setVoiceRecognitionActive(null);
      },
      onEnd: () => {
        setIsVoiceListening(false);
        setVoiceRecognitionActive(null);
      },
    });

    setVoiceRecognitionActive(rec);
  };

  const selectedDistrictObj =
    TAMIL_NADU_32_DISTRICTS.find((d) => d.district === selectedDistrictName) ||
    TAMIL_NADU_32_DISTRICTS[2]; // Default to Coimbatore

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.planJourney}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Predict transit crowding across all 32 Tamil Nadu districts & neighboring state networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 32 Districts Directory Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsDistrictBrowserOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>32 Districts & Towns Directory</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowEmbeddedMap(!showEmbeddedMap);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              showEmbeddedMap
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xs'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showEmbeddedMap ? 'Hide Map' : 'Show Live Transit Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onLoadScenario();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Demo (KPR ➔ Central)</span>
          </button>
        </div>
      </div>

      {/* Voice Recognition Active Bar */}
      {isVoiceListening && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">
              Voice-to-Text active: Speak any town across 32 TN districts or nearby states (e.g. &ldquo;KPR to Central&rdquo;, &ldquo;Chennai to Madurai&rdquo;)...
            </span>
          </div>
          <button
            onClick={() => {
              if (voiceRecognitionActive) voiceRecognitionActive.stop();
              setIsVoiceListening(false);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Embedded Live Geospatial Map (Feature #5 & #11) */}
      {showEmbeddedMap && (
        <div className="transition-all">
          <InteractiveJourneyMap
            originName={inputs.from}
            destinationName={inputs.to}
            onSelectOrigin={(name) => onChangeInputs({ ...inputs, from: name })}
            onSelectDestination={(name) => onChangeInputs({ ...inputs, to: name })}
            theme={theme}
          />
        </div>
      )}

      {/* Regional Corridor Quick Selector */}
      <div
        className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-500" />
          <span>Quick Regional Routes:</span>
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'KPR Institute', to: 'Central Bus Stand' });
            }}
            className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-semibold text-xs shadow-2xs"
          >
            KPR ➔ Central (Demo)
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'Chennai', to: 'Madurai' });
            }}
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Chennai ➔ Madurai
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'Coimbatore', to: 'Bengaluru' });
            }}
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Coimbatore ➔ Bengaluru
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'Salem', to: 'Ooty' });
            }}
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Salem ➔ Ooty (Nilgiris)
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'Tirunelveli', to: 'Kanyakumari' });
            }}
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Tirunelveli ➔ Kanyakumari
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onChangeInputs({ ...inputs, from: 'Vellore', to: 'Tirupati' });
            }}
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
          >
            Vellore ➔ Tirupati
          </button>
        </div>
      </div>

      {/* Main Journey Planning Card */}
      <form
        onSubmit={handleFormSubmit}
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Origin and Destination Row with Autocomplete & District Groups */}
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-3 items-center mb-6">
          {/* Origin */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.from}
              </label>
              <button
                type="button"
                onClick={() => handleStartVoice('from')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                title="Voice input origin"
              >
                <Mic className="w-3 h-3" />
                <span>Speak</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={inputs.from}
                onChange={(e) => {
                  playClickSound();
                  onChangeInputs({ ...inputs, from: e.target.value });
                }}
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600'
                }`}
                required
              >
                <option value="">Select origin stop / town...</option>

                {/* 32 Tamil Nadu Districts */}
                {TAMIL_NADU_32_DISTRICTS.map((d) => (
                  <optgroup key={d.district} label={`District ${d.no}: ${d.district}`}>
                    {d.majorTowns.map((town) => (
                      <option key={`${d.district}-${town}`} value={town}>
                        {town} ({d.district})
                      </option>
                    ))}
                  </optgroup>
                ))}

                {/* Neighboring States */}
                {INTERSTATE_REGIONS.map((st) => (
                  <optgroup key={st.state} label={`Interstate · ${st.state}`}>
                    {st.majorTowns.map((town) => (
                      <option key={`${st.state}-${town}`} value={town}>
                        {town} ({st.state})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-5 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.to}
              </label>
              <button
                type="button"
                onClick={() => handleStartVoice('to')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                title="Voice input destination"
              >
                <Mic className="w-3 h-3" />
                <span>Speak</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={inputs.to}
                onChange={(e) => {
                  playClickSound();
                  onChangeInputs({ ...inputs, to: e.target.value });
                }}
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium outline-none transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600'
                }`}
                required
              >
                <option value="">Select destination stop / town...</option>

                {/* 32 Tamil Nadu Districts */}
                {TAMIL_NADU_32_DISTRICTS.map((d) => (
                  <optgroup key={d.district} label={`District ${d.no}: ${d.district}`}>
                    {d.majorTowns.map((town) => (
                      <option key={`${d.district}-${town}`} value={town}>
                        {town} ({d.district})
                      </option>
                    ))}
                  </optgroup>
                ))}

                {/* Neighboring States */}
                {INTERSTATE_REGIONS.map((st) => (
                  <optgroup key={st.state} label={`Interstate · ${st.state}`}>
                    {st.majorTowns.map((town) => (
                      <option key={`${st.state}-${town}`} value={town}>
                        {town} ({st.state})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Departure Time & Date & Context Variables */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 text-xs">
          {/* Departure Time */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.departureTime}
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                value={inputs.departureTime}
                onChange={(e) => onChangeInputs({ ...inputs, departureTime: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 rounded-xl font-medium outline-none border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.travelDate}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={inputs.date}
                onChange={(e) => onChangeInputs({ ...inputs, date: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 rounded-xl font-medium outline-none border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          {/* Weather */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.weather}
            </label>
            <select
              value={inputs.weather}
              onChange={(e) => onChangeInputs({ ...inputs, weather: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-xl font-medium outline-none border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="Clear">☀️ Clear</option>
              <option value="Cloudy">⛅ Cloudy</option>
              <option value="Rain">🌧️ Rain (+8% Surge)</option>
            </select>
          </div>

          {/* Traffic */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.traffic}
            </label>
            <select
              value={inputs.traffic}
              onChange={(e) => onChangeInputs({ ...inputs, traffic: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-xl font-medium outline-none border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="Normal">🟢 Normal Flow</option>
              <option value="Heavy">🔴 Heavy (+7% Delay)</option>
            </select>
          </div>

          {/* Regional Event */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.event}
            </label>
            <select
              value={inputs.event}
              onChange={(e) => onChangeInputs({ ...inputs, event: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-xl font-medium outline-none border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="None">None</option>
              <option value="College Event">🎓 College Closing Wave</option>
              <option value="Festival">🎉 Temple / Local Festival</option>
              <option value="Stadium Event">🏟️ Stadium Match</option>
            </select>
          </div>
        </div>

        {/* Travel Preference Radios */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {t.preference}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'Least Crowded', label: t.leastCrowded, desc: 'Prioritizes available seating' },
                { id: 'Fastest', label: t.fastest, desc: 'Prioritizes shortest travel time' },
                { id: 'Balanced', label: t.balanced, desc: 'Multi-objective Pareto score' },
              ] as const
            ).map((pref) => (
              <label
                key={pref.id}
                onClick={() => playClickSound()}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  inputs.preference === pref.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{pref.label}</span>
                  <input
                    type="radio"
                    name="preference"
                    value={pref.id}
                    checked={inputs.preference === pref.id}
                    onChange={() => onChangeInputs({ ...inputs, preference: pref.id })}
                    className="accent-emerald-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500">{pref.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing historical and contextual transport data...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>{t.predictBtn}</span>
            </>
          )}
        </button>
      </form>

      {/* Interactive 32 Districts & Towns Explorer Modal */}
      {isDistrictBrowserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col transition-colors ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tamil Nadu 32 Districts & Neighboring States Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Browse all official 32 districts, major towns, and interstate bus hubs
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDistrictBrowserOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs & Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setBrowserTab('tn32');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-1 sm:flex-none ${
                    browserTab === 'tn32'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  32 Tamil Nadu Districts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setBrowserTab('interstate');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-1 sm:flex-none ${
                    browserTab === 'interstate'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Neighboring States (KA, KL, AP, TS, PY)
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter town or district..."
                  value={browserSearchQuery}
                  onChange={(e) => setBrowserSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Modal Body: Split view of Districts & Towns */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[280px,1fr]">
              {/* Left Column: District List */}
              <div className="border-r border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[55vh] p-2 space-y-1">
                {browserTab === 'tn32' ? (
                  TAMIL_NADU_32_DISTRICTS.filter(
                    (d) =>
                      d.district.toLowerCase().includes(browserSearchQuery.toLowerCase()) ||
                      d.majorTowns.some((t) => t.toLowerCase().includes(browserSearchQuery.toLowerCase()))
                  ).map((d) => (
                    <button
                      key={d.district}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedDistrictName(d.district);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedDistrictName === d.district
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono text-slate-400 mr-1.5">{d.no}.</span>
                        {d.district}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.majorTowns.length} towns
                      </span>
                    </button>
                  ))
                ) : (
                  INTERSTATE_REGIONS.map((st) => (
                    <button
                      key={st.state}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedDistrictName(st.state);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedDistrictName === st.state
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{st.state}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {st.majorTowns.length} hubs
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Right Column: Towns and Selection Buttons */}
              <div className="overflow-y-auto max-h-[55vh] p-5 space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>{selectedDistrictName}</span>
                    <span className="text-xs font-normal text-slate-400">
                      {browserTab === 'tn32' ? 'Tamil Nadu District' : 'Interstate Region'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Click any town below to instantly populate your journey origin or destination:
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(browserTab === 'tn32'
                    ? selectedDistrictObj.majorTowns
                    : INTERSTATE_REGIONS.find((st) => st.state === selectedDistrictName)?.majorTowns || []
                  ).map((town) => {
                    const isFrom = inputs.from === town;
                    const isTo = inputs.to === town;

                    return (
                      <div
                        key={town}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isFrom || isTo
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs text-slate-900 dark:text-white">{town}</strong>
                          {isFrom && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Selected: Origin
                            </span>
                          )}
                          {isTo && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              Selected: Destination
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              onChangeInputs({ ...inputs, from: town });
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                          >
                            Set Origin
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              onChangeInputs({ ...inputs, to: town });
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-[11px] hover:opacity-90 transition-opacity"
                          >
                            Set Destination
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Selected Route:{' '}
                <strong className="text-slate-900 dark:text-white font-mono">{inputs.from}</strong> ➔{' '}
                <strong className="text-slate-900 dark:text-white font-mono">{inputs.to}</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsDistrictBrowserOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
