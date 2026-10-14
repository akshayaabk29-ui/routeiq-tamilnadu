import React, { useState, useEffect } from 'react';
import {
  AppMode,
  PassengerTab,
  AuthorityTab,
  JourneyPlanInputs,
  RoutePrediction,
  TransportStop,
  CrowdAlert,
  WhatIfPredictionPoint,
  AppLanguage,
  ThemeMode,
  BusDisruption,
  UserFeedback,
} from './types';
import { INITIAL_STOPS, INITIAL_ALERTS } from './data/mockTransportData';
import { LIVE_BUS_DISRUPTIONS, TAMIL_NADU_REGIONAL_STOPS } from './data/tamilNaduRegionalData';
import {
  predictRoutes,
  getWhatIfPredictions,
} from './services/predictionEngine';
import { toggleSound, isSoundMuted, playClickSound, playChimeSound } from './services/soundEffects';
import { TRANSLATIONS } from './services/translations';

// Components
import { Header } from './components/common/Header';
import { DemoTourBar, DEMO_STEPS } from './components/common/DemoTourBar';
import { BackgroundParticles } from './components/common/BackgroundParticles';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { FloatingVoiceButton } from './components/common/FloatingVoiceButton';

import { PassengerLanding } from './components/passenger/PassengerLanding';
import { PlanJourney } from './components/passenger/PlanJourney';
import { RouteComparison } from './components/passenger/RouteComparison';
import { DistrictMapsExplorer } from './components/passenger/DistrictMapsExplorer';
import { WhyPredictionModal } from './components/passenger/WhyPredictionModal';
import { RouteDetails } from './components/passenger/RouteDetails';
import { WhatIfPlanner } from './components/passenger/WhatIfPlanner';
import { SurgeAlerts } from './components/passenger/SurgeAlerts';
import { PaymentModal } from './components/passenger/PaymentModal';
import { FeedbackRatingModal } from './components/passenger/FeedbackRatingModal';
import { DisruptionAlertsBanner } from './components/passenger/DisruptionAlertsBanner';

import { AuthorityDashboard } from './components/authority/AuthorityDashboard';
import { CityCrowdMap } from './components/authority/CityCrowdMap';
import { NetworkOptimizer } from './components/authority/NetworkOptimizer';
import { ContextSimulator } from './components/authority/ContextSimulator';
import { StopDetailsModal } from './components/authority/StopDetailsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SeparateAuthorityDashboard } from './components/authority/SeparateAuthorityDashboard';
import { AdminTab } from './types';

export default function App() {
  // Navigation & User Persona State
  const [mode, setMode] = useState<AppMode>('landing');
  const [passengerTab, setPassengerTab] = useState<PassengerTab>('plan');
  const [authorityTab, setAuthorityTab] = useState<AuthorityTab>('overview');
  const [adminTab, setAdminTab] = useState<AdminTab>('historical-entry');

  // App Settings: Multi-language, Dark/Light Theme, Audio Synthesizer
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [audioMuted, setAudioMuted] = useState<boolean>(isSoundMuted());

  // Demo Tour State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);

  // Modals & Interactive Overlays
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [paymentRoute, setPaymentRoute] = useState<RoutePrediction | null>(null);
  const [feedbackRoute, setFeedbackRoute] = useState<RoutePrediction | null>(null);
  const [whyRoute, setWhyRoute] = useState<RoutePrediction | null>(null);
  const [selectedStopDetail, setSelectedStopDetail] = useState<TransportStop | null>(null);

  // Live Bus Disruption & Feedback Data
  const [disruptions, setDisruptions] = useState<BusDisruption[]>(LIVE_BUS_DISRUPTIONS);
  const [userFeedbacks, setUserFeedbacks] = useState<UserFeedback[]>([]);

  // Journey Form Inputs (Default calibrated to main hackathon scenario)
  const [journeyInputs, setJourneyInputs] = useState<JourneyPlanInputs>({
    from: 'KPR Institute',
    to: 'Central Bus Stand',
    departureTime: '17:00',
    date: new Date().toISOString().split('T')[0],
    weather: 'Rain',
    traffic: 'Heavy',
    event: 'College Event',
    preference: 'Least Crowded',
  });

  // Dynamic Data State
  const [stops] = useState<TransportStop[]>(TAMIL_NADU_REGIONAL_STOPS);
  const [alerts] = useState<CrowdAlert[]>(INITIAL_ALERTS);
  const [routes, setRoutes] = useState<RoutePrediction[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RoutePrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [whatIfPoints, setWhatIfPoints] = useState<WhatIfPredictionPoint[]>([]);

  // Dark mode effect on document HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial load of default predictions so comparison views are immediately functional
  useEffect(() => {
    async function initPredictions() {
      const preds = await predictRoutes(journeyInputs, false);
      setRoutes(preds);
      setSelectedRoute(preds[2] || preds[0]); // Route 18 as recommended default
      setWhatIfPoints(getWhatIfPredictions(91));
    }
    initPredictions();
  }, []);

  // Execution handler for prediction form
  const handleExecutePrediction = async () => {
    setIsPredicting(true);
    try {
      const preds = await predictRoutes(journeyInputs, true);
      setRoutes(preds);
      const rec = preds.find((r) => r.isRecommended) || preds[0];
      setSelectedRoute(rec);
      setWhatIfPoints(getWhatIfPredictions(preds[0]?.predictedCrowd || 91));
      setPassengerTab('compare');
    } finally {
      setIsPredicting(false);
    }
  };

  // Demo step synchronization
  const executeDemoStep = async (stepIndex: number) => {
    setDemoStepIndex(stepIndex);
    const step = DEMO_STEPS[stepIndex];
    if (!step) return;

    if (step.targetMode === 'passenger') {
      setMode('passenger');
      setPassengerTab(step.targetTab as PassengerTab);
    } else if (step.targetMode === 'admin') {
      setMode('admin');
      setAdminTab(step.targetTab as AdminTab);
    } else {
      setMode('authority');
      setAuthorityTab(step.targetTab as AuthorityTab);
    }

    if (stepIndex === 0) {
      setJourneyInputs({
        from: 'KPR Institute',
        to: 'Central Bus Stand',
        departureTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        weather: 'Rain',
        traffic: 'Heavy',
        event: 'College Event',
        preference: 'Least Crowded',
      });
      setWhyRoute(null);
    } else if (stepIndex === 1) {
      setIsPredicting(true);
      setTimeout(async () => {
        const preds = await predictRoutes(journeyInputs, false);
        setRoutes(preds);
        setSelectedRoute(preds[2]);
        setIsPredicting(false);
        setPassengerTab('compare');
      }, 600);
    } else if (stepIndex === 2 || stepIndex === 3) {
      setPassengerTab('compare');
      setWhyRoute(null);
    } else if (stepIndex === 4) {
      setPassengerTab('compare');
      const r12 = routes.find((r) => r.id === 'route-12') || routes[0];
      setWhyRoute(r12);
    } else if (stepIndex === 5) {
      setWhyRoute(null);
      const r18 = routes.find((r) => r.id === 'route-18') || routes[2] || routes[0];
      setSelectedRoute(r18);
      setPassengerTab('details');
    } else if (stepIndex === 6) {
      setWhyRoute(null);
      setPassengerTab('whatif');
    } else if (stepIndex === 7) {
      setMode('authority');
      setAuthorityTab('overview');
    } else if (stepIndex === 8) {
      setMode('authority');
      setAuthorityTab('map');
    } else if (stepIndex === 9) {
      setMode('admin');
      setAdminTab('historical-entry');
    }
  };

  const handleStartDemo = () => {
    setIsDemoActive(true);
    executeDemoStep(0);
  };

  const handleNextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      executeDemoStep(demoStepIndex + 1);
    } else {
      setIsDemoActive(false);
    }
  };

  const handlePrevDemoStep = () => {
    if (demoStepIndex > 0) {
      executeDemoStep(demoStepIndex - 1);
    }
  };

  const handleApplyWhatIfTime = (timeStr: string) => {
    setJourneyInputs((prev) => ({ ...prev, departureTime: timeStr }));
    predictRoutes({ ...journeyInputs, departureTime: timeStr }, false).then((preds) => {
      setRoutes(preds);
      setPassengerTab('compare');
    });
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleAudio = () => {
    const muted = toggleSound();
    setAudioMuted(muted);
  };

  const handleAddDisruption = (newDisrupt: BusDisruption) => {
    setDisruptions((prev) => [newDisrupt, ...prev]);
  };

  const handleResolveDisruption = (id: string) => {
    setDisruptions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isResolved: true } : d))
    );
  };

  const handleFeedbackSubmit = (feedback: UserFeedback) => {
    setUserFeedbacks((prev) => [feedback, ...prev]);
    // Dynamically update route rating
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.routeNumber === feedback.routeNumber) {
          const newCount = (r.ratingCount || 100) + 1;
          const newAvg = Number((((r.userRating || 4.5) * (newCount - 1) + feedback.overallRating) / newCount).toFixed(1));
          return { ...r, userRating: newAvg, ratingCount: newCount };
        }
        return r;
      })
    );
  };

  const modeBgClasses =
    mode === 'admin'
      ? theme === 'dark'
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white'
      : mode === 'authority'
      ? theme === 'dark'
        ? 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white'
      : mode === 'landing'
      ? theme === 'dark'
        ? 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white'
      : theme === 'dark'
      ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white'
      : 'bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white';

  return (
    <div
      data-mode={mode}
      className={`min-h-screen flex flex-col transition-colors relative ${modeBgClasses}`}
    >
      {/* Subtle Mode Aura Ambient Bloom */}
      <div
        className={`pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 blur-3xl opacity-35 dark:opacity-25 transition-all duration-700 z-0 ${
          mode === 'admin'
            ? 'bg-gradient-to-b from-indigo-600/50 via-blue-600/30 to-transparent'
            : mode === 'authority'
            ? 'bg-gradient-to-b from-blue-600/50 via-indigo-600/30 to-transparent'
            : mode === 'landing'
            ? 'bg-gradient-to-b from-teal-500/40 via-indigo-600/20 to-transparent'
            : 'bg-gradient-to-b from-emerald-500/50 via-teal-500/30 to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Animated Canvas Background (Feature #9) */}
      <BackgroundParticles theme={theme} mode={mode} />

      {/* Top Bar Header with Language, Theme, Audio, Voice Assistant */}
      <Header
        mode={mode}
        onSetMode={(m) => {
          setMode(m);
          if (m === 'passenger') setPassengerTab('plan');
          if (m === 'authority') setAuthorityTab('overview');
          if (m === 'admin') setAdminTab('historical-entry');
        }}
        passengerTab={passengerTab}
        onSetPassengerTab={setPassengerTab}
        authorityTab={authorityTab}
        onSetAuthorityTab={setAuthorityTab}
        adminTab={adminTab}
        onSetAdminTab={setAdminTab}
        isDemoActive={isDemoActive}
        onToggleDemo={() => {
          if (isDemoActive) {
            setIsDemoActive(false);
          } else {
            handleStartDemo();
          }
        }}
        language={language}
        onSetLanguage={setLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isAudioMuted={audioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Guided Hackathon Demo Bar (when active) */}
      {isDemoActive && (
        <DemoTourBar
          currentStepIndex={demoStepIndex}
          onNextStep={handleNextDemoStep}
          onPrevStep={handlePrevDemoStep}
          onJumpToStep={executeDemoStep}
          onCloseDemo={() => setIsDemoActive(false)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 px-4 sm:px-6 py-8 relative z-10">
        {/* Landing Page */}
        {mode === 'landing' && (
          <PassengerLanding
            onEnterMode={(m) => {
              setMode(m);
              if (m === 'passenger') setPassengerTab('plan');
              if (m === 'authority') setAuthorityTab('overview');
              if (m === 'admin') setAdminTab('historical-entry');
            }}
            onStartDemo={handleStartDemo}
            language={language}
            theme={theme}
          />
        )}

        {/* Passenger Mode Content */}
        {mode === 'passenger' && (
          <div className="space-y-8">
            {/* Live Bus Unavailability / Breakdown Alert Ticker (Feature #6) */}
            <DisruptionAlertsBanner
              disruptions={disruptions}
              onSelectAlternativeRoute={(altRoute) => {
                const matched = routes.find((r) => r.routeNumber.toLowerCase().includes(altRoute.toLowerCase()));
                if (matched) setSelectedRoute(matched);
                setPassengerTab('compare');
              }}
              language={language}
              theme={theme}
            />

            {passengerTab === 'plan' && (
              <PlanJourney
                inputs={journeyInputs}
                onChangeInputs={setJourneyInputs}
                onSubmit={handleExecutePrediction}
                isLoading={isPredicting}
                onLoadScenario={() => {
                  setJourneyInputs({
                    from: 'KPR Institute',
                    to: 'Central Bus Stand',
                    departureTime: '17:00',
                    date: new Date().toISOString().split('T')[0],
                    weather: 'Rain',
                    traffic: 'Heavy',
                    event: 'College Event',
                    preference: 'Least Crowded',
                  });
                }}
                language={language}
                theme={theme}
              />
            )}

            {passengerTab === 'compare' && (
              <RouteComparison
                routes={routes}
                onSelectRouteForDetails={(route) => {
                  setSelectedRoute(route);
                  setPassengerTab('details');
                }}
                onOpenWhyModal={(route) => setWhyRoute(route)}
                onOpenPaymentModal={(route) => setPaymentRoute(route)}
                onOpenFeedbackModal={(route) => setFeedbackRoute(route)}
                selectedRouteId={selectedRoute?.id || null}
                onChooseRoute={(route) => setSelectedRoute(route)}
                language={language}
                theme={theme}
              />
            )}

            {passengerTab === 'districts' && (
              <DistrictMapsExplorer
                onSelectRoutePoints={(from, to) => {
                  setJourneyInputs((prev) => ({ ...prev, from, to }));
                  predictRoutes({ ...journeyInputs, from, to }, false).then((preds) => {
                    setRoutes(preds);
                    const rec = preds.find((r) => r.isRecommended) || preds[0];
                    setSelectedRoute(rec);
                    setPassengerTab('compare');
                  });
                }}
                language={language}
                theme={theme}
              />
            )}

            {passengerTab === 'details' && selectedRoute && (
              <RouteDetails
                route={selectedRoute}
                allRoutes={routes}
                onSelectRoute={setSelectedRoute}
                onBack={() => setPassengerTab('compare')}
                onOpenWhyModal={(route) => setWhyRoute(route)}
                language={language}
                theme={theme}
              />
            )}

            {passengerTab === 'whatif' && (
              <WhatIfPlanner
                whatIfPoints={whatIfPoints}
                currentDepartureTime={journeyInputs.departureTime}
                onApplyTime={handleApplyWhatIfTime}
                language={language}
                theme={theme}
              />
            )}

            {passengerTab === 'disruptions' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <DisruptionAlertsBanner
                  disruptions={disruptions}
                  onSelectAlternativeRoute={(altRoute) => {
                    const matched = routes.find((r) => r.routeNumber.toLowerCase().includes(altRoute.toLowerCase()));
                    if (matched) setSelectedRoute(matched);
                    setPassengerTab('compare');
                  }}
                  language={language}
                  theme={theme}
                />
              </div>
            )}

            {passengerTab === 'alerts' && (
              <SurgeAlerts
                alerts={alerts}
                onSelectAlternative={() => setPassengerTab('compare')}
                language={language}
                theme={theme}
              />
            )}
          </div>
        )}

        {/* Authority Dashboard: Dedicated & Simple (Overview + City Crowd Map ONLY) */}
        {mode === 'authority' && (
          <div className="space-y-8">
            <SeparateAuthorityDashboard
              initialTab={authorityTab === 'map' ? 'map' : 'overview'}
              theme={theme}
              language={language}
            />
          </div>
        )}

        {/* Admin Dashboard: Historical Trip Data Entry, Management, Predictions & Detailed Analytics */}
        {mode === 'admin' && (
          <div className="space-y-8">
            <AdminDashboard
              initialTab={adminTab}
              theme={theme}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Online & Offline Ticket Payment Modal (Feature #3 & #8) */}
      <PaymentModal
        route={paymentRoute}
        onClose={() => setPaymentRoute(null)}
        theme={theme}
        language={language}
      />

      {/* Feedback & Star Rating Modal (Feature #4) */}
      <FeedbackRatingModal
        route={feedbackRoute}
        onClose={() => setFeedbackRoute(null)}
        onSubmitFeedback={handleFeedbackSubmit}
        theme={theme}
        language={language}
      />

      {/* Voice Assistant Interactive Conversation Modal (Feature #12 & #13) */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        lang={language}
        theme={theme}
        mode={mode}
        onNavigateToTab={(tab) => {
          setIsVoiceAssistantOpen(false);
          setMode('passenger');
          setPassengerTab(tab as PassengerTab);
        }}
      />

      {/* Why Prediction Modal (Explainable AI) */}
      <WhyPredictionModal
        route={whyRoute}
        onClose={() => setWhyRoute(null)}
        language={language}
      />

      {/* Stop Details Modal for Authority Choke Points */}
      <StopDetailsModal
        stop={selectedStopDetail}
        onClose={() => setSelectedStopDetail(null)}
      />

      {/* Floating Instant AI Voice Assistant Button (Feature #12 & #13) */}
      <FloatingVoiceButton
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        language={language}
        theme={theme}
        mode={mode}
      />
    </div>
  );
}
