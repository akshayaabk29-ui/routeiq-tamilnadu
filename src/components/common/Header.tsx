import React, { useState } from 'react';
import { AppMode, PassengerTab, AuthorityTab, AdminTab, AppLanguage, ThemeMode } from '../../types';
import { TRANSLATIONS, LANGUAGE_NAMES } from '../../services/translations';
import { playClickSound, toggleSound } from '../../services/soundEffects';
import {
  Bus,
  Building2,
  Database,
  Compass,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Mic,
  Languages,
  ChevronDown,
  Wrench,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
  MapPin,
} from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onSetMode: (mode: AppMode) => void;
  passengerTab: PassengerTab;
  onSetPassengerTab: (tab: PassengerTab) => void;
  authorityTab: AuthorityTab;
  onSetAuthorityTab: (tab: AuthorityTab) => void;
  adminTab?: AdminTab;
  onSetAdminTab?: (tab: AdminTab) => void;
  isDemoActive: boolean;
  onToggleDemo: () => void;
  language: AppLanguage;
  onSetLanguage: (lang: AppLanguage) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenVoiceAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSetMode,
  passengerTab,
  onSetPassengerTab,
  authorityTab,
  onSetAuthorityTab,
  adminTab = 'historical-entry',
  onSetAdminTab,
  isDemoActive,
  onToggleDemo,
  language,
  onSetLanguage,
  theme,
  onToggleTheme,
  isAudioMuted,
  onToggleAudio,
  onOpenVoiceAssistant,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleModeChange = (newMode: AppMode) => {
    playClickSound(600);
    onSetMode(newMode);
  };

  const handlePassengerTab = (tab: PassengerTab) => {
    playClickSound(700);
    onSetPassengerTab(tab);
  };

  const handleAuthorityTab = (tab: AuthorityTab) => {
    playClickSound(700);
    onSetAuthorityTab(tab);
  };

  const handleAdminTab = (tab: AdminTab) => {
    playClickSound(700);
    if (onSetAdminTab) onSetAdminTab(tab);
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur border-b transition-colors relative ${
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-800 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}
    >
      {/* Dynamic Mode Accent Stripe */}
      <div
        className={`h-1 w-full transition-all duration-300 ${
          mode === 'authority'
            ? 'bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600'
            : mode === 'landing'
            ? 'bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-500'
            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Mode Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleModeChange('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="RouteIQ Public Transport Crowd Intelligence"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center p-0.5 transition-all group-hover:scale-105 group-hover:shadow-md">
              <img
                src="/routeiq-logo.png"
                alt="RouteIQ Logo"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-baseline font-black tracking-tight leading-none text-xl sm:text-2xl">
                <span className="text-blue-700 dark:text-blue-400">Route</span>
                <span className="text-emerald-500 dark:text-emerald-400">IQ</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                Transit AI
              </span>
            </div>
          </button>

          {mode !== 'landing' && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                mode === 'passenger'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : mode === 'admin'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                  : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  mode === 'passenger'
                    ? 'bg-emerald-500 animate-pulse'
                    : mode === 'admin'
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-blue-500 animate-ping'
                }`}
              />
              {mode === 'passenger'
                ? t.passengerMode
                : mode === 'admin'
                ? t.adminDashboard
                : t.authorityDashboard}
            </span>
          )}
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {mode === 'landing' && (
            <>
              <button
                onClick={() => handleModeChange('passenger')}
                className="px-3 py-1.5 text-xs sm:text-sm font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Bus className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.passengerMode}</span>
              </button>
              <button
                onClick={() => handleModeChange('authority')}
                className="px-3 py-1.5 text-xs sm:text-sm font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.authorityDashboard}</span>
              </button>
              <button
                onClick={() => handleModeChange('admin')}
                className="px-3 py-1.5 text-xs sm:text-sm font-bold hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.adminDashboard}</span>
              </button>
            </>
          )}

          {mode === 'passenger' && (
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => handlePassengerTab('plan')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  passengerTab === 'plan'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {t.planJourney}
              </button>
              <button
                onClick={() => handlePassengerTab('compare')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  passengerTab === 'compare'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {t.routeComparison}
              </button>
              <button
                onClick={() => handlePassengerTab('districts')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  passengerTab === 'districts'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>{t.districtMaps || '32 District Maps'}</span>
              </button>
              <button
                onClick={() => handlePassengerTab('whatif')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  passengerTab === 'whatif'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {t.whatIfPlanner}
              </button>
              <button
                onClick={() => handlePassengerTab('details')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  passengerTab === 'details'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {t.routeDetails}
              </button>
              <button
                onClick={() => handlePassengerTab('disruptions')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  passengerTab === 'disruptions'
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
              >
                <Wrench className="w-3 h-3" />
                <span>{t.disruptions}</span>
              </button>
              <button
                onClick={() => handlePassengerTab('alerts')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  passengerTab === 'alerts'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {t.crowdAlerts}
              </button>
            </div>
          )}

          {/* Authority Dashboard: ONLY Overview & City Crowd Map as requested */}
          {mode === 'authority' && (
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => handleAuthorityTab('overview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  authorityTab === 'overview' || authorityTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>A. {t.overview}</span>
              </button>
              <button
                onClick={() => handleAuthorityTab('map')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  authorityTab === 'map'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>B. {t.cityMap}</span>
              </button>
            </div>
          )}

          {/* Admin Dashboard: Full Controls (Overview, Historical Data Entry, Route Mgmt, Trip Mgmt, Predictions, Analytics) */}
          {mode === 'admin' && (
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => handleAdminTab('overview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  adminTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t.overview}
              </button>
              <button
                onClick={() => handleAdminTab('historical-entry')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  adminTab === 'historical-entry'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>{t.historicalTripDataEntry}</span>
              </button>
              <button
                onClick={() => handleAdminTab('route-mgmt')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  adminTab === 'route-mgmt'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t.routeManagement}
              </button>
              <button
                onClick={() => handleAdminTab('trip-mgmt')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  adminTab === 'trip-mgmt'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t.tripManagement}
              </button>
              <button
                onClick={() => handleAdminTab('predictions')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  adminTab === 'predictions'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{t.predictionResults}</span>
              </button>
              <button
                onClick={() => handleAdminTab('analytics')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  adminTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t.detailedAnalytics}
              </button>
            </div>
          )}
        </nav>

        {/* Right Tools: Voice Assistant, Language Switcher, Dark/Light, Audio Sound, Demo Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Voice Assistant Trigger */}
          <button
            onClick={() => {
              playClickSound(800);
              onOpenVoiceAssistant();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs group ${
              mode === 'authority'
                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                : mode === 'landing'
                ? 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
            title="Open RouteIQ AI Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>

          {/* Multilanguage Selector */}
          <div className="relative">
            <button
              onClick={() => {
                playClickSound();
                setLangMenuOpen(!langMenuOpen);
              }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Select Language"
            >
              <Languages
                className={`w-3.5 h-3.5 ${
                  mode === 'authority'
                    ? 'text-blue-500'
                    : mode === 'landing'
                    ? 'text-teal-500'
                    : 'text-emerald-600'
                }`}
              />
              <span className="hidden md:inline font-mono uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div
                className={`absolute right-0 mt-1.5 w-44 rounded-xl border shadow-xl py-1 z-50 animate-in fade-in ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {LANGUAGE_NAMES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      playClickSound();
                      onSetLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      language === item.code
                        ? mode === 'authority'
                          ? 'bg-blue-500/20 text-blue-500 font-bold'
                          : 'bg-emerald-500/20 text-emerald-500 font-bold'
                        : theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.native}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.label})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              playClickSound();
              onToggleTheme();
            }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sound / Music Synthesizer Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
            }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isAudioMuted
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                : mode === 'authority'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
            }`}
            title={isAudioMuted ? t.soundMuted : t.soundOn}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Passenger vs Authority vs Admin Role Switcher */}
          {mode !== 'landing' && (
            <div
              className={`hidden sm:flex items-center rounded-lg p-0.5 border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => handleModeChange('passenger')}
                title="Switch to Passenger Mode"
                className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  mode === 'passenger'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleModeChange('authority')}
                title="Switch to Authority Dashboard"
                className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  mode === 'authority'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleModeChange('admin')}
                title="Switch to Admin Dashboard"
                className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  mode === 'admin'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile subnavigation */}
      {mode !== 'landing' && (
        <div
          className={`md:hidden border-t px-4 py-1.5 overflow-x-auto ${
            theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 whitespace-nowrap min-w-max text-xs">
            {mode === 'passenger' ? (
              <>
                <button
                  onClick={() => handlePassengerTab('plan')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'plan' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.planJourney}
                </button>
                <button
                  onClick={() => handlePassengerTab('compare')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'compare' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.routeComparison}
                </button>
                <button
                  onClick={() => handlePassengerTab('districts')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'districts' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.districtMaps || '32 District Maps'}
                </button>
                <button
                  onClick={() => handlePassengerTab('whatif')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'whatif' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.whatIfPlanner}
                </button>
                <button
                  onClick={() => handlePassengerTab('details')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'details' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.routeDetails}
                </button>
                <button
                  onClick={() => handlePassengerTab('disruptions')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'disruptions' ? 'bg-rose-600 text-white font-bold' : 'text-rose-500'}`}
                >
                  {t.disruptions}
                </button>
                <button
                  onClick={() => handlePassengerTab('alerts')}
                  className={`px-2.5 py-1 rounded ${passengerTab === 'alerts' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.crowdAlerts}
                </button>
              </>
            ) : mode === 'admin' ? (
              <>
                <button
                  onClick={() => handleAdminTab('overview')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.overview}
                </button>
                <button
                  onClick={() => handleAdminTab('historical-entry')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'historical-entry' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.historicalTripDataEntry}
                </button>
                <button
                  onClick={() => handleAdminTab('route-mgmt')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'route-mgmt' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.routeManagement}
                </button>
                <button
                  onClick={() => handleAdminTab('trip-mgmt')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'trip-mgmt' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.tripManagement}
                </button>
                <button
                  onClick={() => handleAdminTab('predictions')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'predictions' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.predictionResults}
                </button>
                <button
                  onClick={() => handleAdminTab('analytics')}
                  className={`px-2.5 py-1 rounded ${adminTab === 'analytics' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  {t.detailedAnalytics}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthorityTab('overview')}
                  className={`px-2.5 py-1 rounded ${authorityTab === 'overview' || authorityTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  A. {t.overview}
                </button>
                <button
                  onClick={() => handleAuthorityTab('map')}
                  className={`px-2.5 py-1 rounded ${authorityTab === 'map' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500'}`}
                >
                  B. {t.cityMap}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
