import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, X, Mic } from 'lucide-react';

export interface DemoStep {
  stepNumber: number;
  title: string;
  judgePitch: string;
  actionLabel: string;
  targetMode: 'passenger' | 'authority' | 'admin';
  targetTab: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Contextual Journey Setup',
    judgePitch: 'We start by inputting real-world conditions: KPR Institute to Central Bus Stand at 5:00 PM, with Rain, Heavy Traffic, and a College Closing event.',
    actionLabel: 'Load Scenario & Plan',
    targetMode: 'passenger',
    targetTab: 'plan',
  },
  {
    stepNumber: 2,
    title: 'Dynamic AI Prediction Execution',
    judgePitch: 'RouteIQ combines historical telemetry with contextual weather, traffic, and campus dispersion curves to forecast route occupancy.',
    actionLabel: 'Trigger Route Prediction',
    targetMode: 'passenger',
    targetTab: 'plan',
  },
  {
    stepNumber: 3,
    title: 'Multi-Route Corridor Comparison',
    judgePitch: 'Observe the divergence: Route 12 hits 91% Critical, Route 15 sits at 58% Moderate, while Route 18 stays at an optimal 32% Low.',
    actionLabel: 'View Route Comparison',
    targetMode: 'passenger',
    targetTab: 'compare',
  },
  {
    stepNumber: 4,
    title: 'Smart Travel Score & Recommendation',
    judgePitch: 'Rather than simply picking the emptiest bus, RouteIQ weights crowd, travel time, waiting time, and reliability into a balanced score of 84/100.',
    actionLabel: 'Inspect Route 18 Card',
    targetMode: 'passenger',
    targetTab: 'compare',
  },
  {
    stepNumber: 5,
    title: 'Explainable AI: Why This Prediction?',
    judgePitch: 'Here is our transparent feature attribution: Peak hour (+18%), College closing (+15%), Corridor baseline (+12%), and Rain (+8%).',
    actionLabel: 'Open "Why?" Factor Modal',
    targetMode: 'passenger',
    targetTab: 'compare',
  },
  {
    stepNumber: 6,
    title: 'Stop-by-Stop Micro Crowding',
    judgePitch: 'We drill down into the Route 18 timeline: 32% at KPR College, 38% at Market, rising to 86% only at the terminus. Passengers see arrival times & load.',
    actionLabel: 'Open Route Details Timeline',
    targetMode: 'passenger',
    targetTab: 'details',
  },
  {
    stepNumber: 7,
    title: 'What-If Travel Planner',
    judgePitch: 'What if the passenger can delay their departure? By sliding from 5:00 PM to 6:30 PM, expected crowding plummets from 91% down to 47%.',
    actionLabel: 'Open What-If Time Slider',
    targetMode: 'passenger',
    targetTab: 'whatif',
  },
  {
    stepNumber: 8,
    title: 'Authority Dashboard Overview',
    judgePitch: 'Now we switch to the Authority Dashboard: 8 executive cards, high-crowd trips, and most crowded corridor metrics without conductor counting burden.',
    actionLabel: 'Open Authority Overview',
    targetMode: 'authority',
    targetTab: 'overview',
  },
  {
    stepNumber: 9,
    title: 'City Crowd Map Radar',
    judgePitch: 'Authority can inspect any city transit corridor with 🟢 Low, 🟡 Medium, and 🔴 High crowd indicators and filter by Route, Day, Time, and Crowd Level.',
    actionLabel: 'Open City Crowd Map',
    targetMode: 'authority',
    targetTab: 'map',
  },
  {
    stepNumber: 10,
    title: 'Admin Historical Trip Data Entry',
    judgePitch: 'In the Admin Dashboard, operators manually enter historical trip records from previous logs (Route, Date, Time, Capacity, Passenger Count) which directly calibrate the ML prediction model!',
    actionLabel: 'Open Historical Trip Data Entry',
    targetMode: 'admin',
    targetTab: 'historical-entry',
  },
];

interface DemoTourBarProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
  onCloseDemo: () => void;
}

export const DemoTourBar: React.FC<DemoTourBarProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onCloseDemo,
}) => {
  const step = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === DEMO_STEPS.length - 1;

  return (
    <div className="bg-slate-900 border-b border-amber-500/40 text-white shadow-xl relative z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Step Counter & Title */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2.5 py-1 rounded font-bold text-xs shrink-0 tracking-wide uppercase">
              <span>Step {step.stepNumber}/10</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                <span className="text-xs text-amber-400 font-mono hidden sm:inline">
                  [{step.targetMode.toUpperCase()} MODE]
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-amber-400 shrink-0 hidden sm:inline" />
                <span>
                  <strong className="text-amber-300 font-medium">Presenter Script:</strong> {step.judgePitch}
                </span>
              </p>
            </div>
          </div>

          {/* Controls & Quick Navigation */}
          <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevStep}
                disabled={isFirst}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Demo Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onNextStep}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-xs"
              >
                <span>{isLast ? 'Complete Demo' : 'Next Step'}</span>
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={onCloseDemo}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Exit Guided Demo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/80 overflow-x-auto">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => onJumpToStep(idx)}
              className={`h-1.5 rounded-full transition-all shrink-0 ${
                idx === currentStepIndex
                  ? 'w-8 bg-amber-400'
                  : idx < currentStepIndex
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Step ${s.stepNumber}: ${s.title}`}
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-2 font-mono whitespace-nowrap">
            Interactive Walkthrough
          </span>
        </div>
      </div>
    </div>
  );
};
