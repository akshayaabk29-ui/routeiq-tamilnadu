export type CrowdLevel = 'low' | 'moderate' | 'high' | 'critical';
export type AppLanguage = 'en' | 'ta' | 'hi' | 'kn' | 'ml' | 'te';
export type ThemeMode = 'light' | 'dark';

export interface TransportStop {
  id: string;
  name: string;
  nameTamil?: string;
  zone: string;
  state?: string;
  lat?: number;
  lng?: number;
  x: number; // coordinate for stylized city map (0-1000)
  y: number; // coordinate for stylized city map (0-600)
  currentCrowd: number; // 0-100
  predictedCrowd30m: number; // 0-100
  capacity: number;
  routes: string[]; // route ids
  trend: 'up' | 'down' | 'stable';
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface ContributingFactor {
  factor: string;
  impactPercentage: number; // e.g. +18
  description: string;
}

export interface StopPrediction {
  stopId: string;
  stopName: string;
  stopNameTamil?: string;
  crowdPercentage: number;
  estimatedPassengers: number;
  arrivalTime: string;
  crowdStatus: CrowdLevel;
}

export interface BusDisruption {
  id: string;
  routeId?: string;
  routeNumber: string;
  busRegNumber?: string;
  type: 'breakdown' | 'accident' | 'diversion' | 'maintenance';
  severity: 'critical' | 'moderate' | 'severe' | 'high';
  location?: string;
  locationName?: string;
  title?: string;
  description: string;
  alternativeRoute?: string;
  recommendedAlternativeRoute?: string;
  reportedTime?: string;
  startTime?: string;
  estimatedResolutionTime?: string;
  affectedStops?: string[];
  isResolved: boolean;
  replacementBusDispatched?: boolean;
}

export interface RoutePrediction {
  id: string;
  routeNumber: string;
  name: string;
  from: string;
  to: string;
  predictedCrowd: number; // 0-100
  crowdLevel: CrowdLevel;
  travelTimeMin: number;
  waitingTimeMin: number;
  reliabilityPercent: number;
  smartTravelScore: number; // 0-100
  isRecommended: boolean;
  busCapacity: number;
  currentPassengers: number;
  carbonEmissionKg: number;
  baseFare: number; // in INR ₹
  busType: 'Ordinary (Standard)' | 'Deluxe Express' | 'AC Low Floor Volvo';
  userRating: number; // e.g. 4.6
  ratingCount: number; // e.g. 1240
  // FC (Fitness Certificate) & Vehicle Quality
  fcExpiryDate: string; // e.g. "15-Nov-2027"
  fcStatus: 'Certified Valid' | 'Inspected & Passed' | 'Renewal Scheduled';
  busQualityGrade: 'Grade A+ (Premium)' | 'Grade A (Excellent)' | 'Grade B+ (Good)' | 'Grade B (Fair)';
  interiorAqi: number; // Air quality index inside bus e.g. 38 (Clean)
  cleanlinessRating: number; // e.g. 4.8 / 5
  safetyCertification: string; // e.g. "AIS-140 GPS & RTO Certified"
  vehicleRegistrationNumber: string; // e.g. "TN 38 N 2490"
  disruption?: BusDisruption;
  explanation: {
    baseDemand: number;
    factors: ContributingFactor[];
    summary: string;
  };
  stops: StopPrediction[];
  comparisonVsFastest?: {
    crowdDeltaPercent: number; // e.g. -59
    travelTimeDeltaMin: number; // e.g. +6
    waitingTimeDeltaMin: number;
  };
}

export interface UserFeedback {
  id: string;
  routeNumber: string;
  overallRating: number;
  crowdAccuracyRating: number;
  punctualityRating: number;
  comfortRating: number;
  tags: string[];
  comment: string;
  timestamp: string;
}

export interface DigitalTicket {
  ticketId: string;
  routeNumber: string;
  routeName: string;
  fromStop: string;
  toStop: string;
  passengerCount: number;
  passType: 'General' | 'Student Concession (50% Off)' | 'Senior Citizen (Free/Discount)';
  fareAmount: number;
  paymentMethod: 'UPI (GPay / PhonePe)' | 'Debit/Credit Card' | 'NCMC / Smart Card' | 'Offline Bluetooth Pass' | 'Cash to Conductor';
  isOfflineToken: boolean;
  bookingTime: string;
  validUntil: string;
  qrPayload: string;
  // Missed Bus Refund Policy & Protection
  missedBusProtection: boolean;
  refundPolicySummary: string;
  refundClaimed?: boolean;
  refundClaimedAmount?: number;
  refundClaimedTime?: string;
  rescheduledToNextBus?: boolean;
  rescheduledRouteNumber?: string;
}

export interface JourneyPlanInputs {
  from: string;
  to: string;
  departureTime: string; // e.g. "17:00"
  date: string;
  weather: 'Clear' | 'Cloudy' | 'Rain';
  traffic: 'Normal' | 'Heavy';
  event: 'None' | 'College Event' | 'Festival' | 'Stadium Event';
  preference: 'Least Crowded' | 'Fastest' | 'Balanced';
  corridorRegion?: 'Coimbatore Urban' | 'Tamil Nadu State Express' | 'Interstate (Bengaluru/Kerala/AP)';
}

export interface CrowdAlert {
  id: string;
  routeNumber: string;
  routeName: string;
  currentCrowd: number;
  expectedCrowd30m: number;
  status: 'Surge Expected' | 'Surge Alert' | 'Moderate Influx' | 'Nominal Relief';
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  reasons: string[];
  recommendation: string;
  lastUpdated: string;
}

export interface WhatIfPredictionPoint {
  timeStr: string;
  hourFloat: number;
  crowdPercent: number;
  waitingTimeMin: number;
  travelTimeMin: number;
  level: CrowdLevel;
}

export interface RedistributionSimulation {
  fromRouteId: string;
  toRouteId: string;
  passengersShifted: number;
  before: {
    fromRouteCrowd: number;
    toRouteCrowd: number;
    otherRoutesCrowd: number;
    maxNetworkCrowd: number;
    crowdImbalanceScore: number;
  };
  after: {
    fromRouteCrowd: number;
    toRouteCrowd: number;
    otherRoutesCrowd: number;
    maxNetworkCrowd: number;
    crowdImbalanceScore: number;
  };
  congestionReductionPoints: number;
  narrativeInsight: string;
}

export interface HistoricalTripRecord {
  id: string;
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
  notes?: string;
  createdAt: string;
}

export type SimpleCrowdLevel = 'Low' | 'Medium' | 'High';

export interface HistoricalPredictionResult {
  routeNumber: string;
  routeName: string;
  from: string;
  to: string;
  day: string;
  tripTime: string;
  vehicleCapacity: number;
  expectedPassengerCount: number;
  occupancyPercentage: number;
  crowdLevel: SimpleCrowdLevel;
  confidenceScore: number;
  historicalSampleCount: number;
  sampleHistoricalAverage: number;
  contributingFactors: {
    factor: string;
    impact: string;
  }[];
}

export interface ManagedRoute {
  id: string;
  routeNumber: string;
  name: string;
  from: string;
  to: string;
  totalDistanceKm: number;
  frequencyMin: number;
  defaultCapacity: number;
  activeBusesCount: number;
  corridorType: string;
}

export interface ScheduledTrip {
  id: string;
  routeNumber: string;
  routeName: string;
  departureTime: string;
  day: string;
  vehicleNumber: string;
  driverName: string;
  status: 'Scheduled' | 'On Time' | 'In Transit' | 'Completed';
}

export type AppMode = 'landing' | 'passenger' | 'authority' | 'admin';
export type PassengerTab = 'plan' | 'compare' | 'districts' | 'whatif' | 'details' | 'alerts' | 'disruptions';
export type AuthorityTab = 'overview' | 'map' | 'dashboard' | 'analytics' | 'alerts' | 'optimizer' | 'context' | 'incident-manager';
export type AdminTab = 'overview' | 'historical-entry' | 'route-mgmt' | 'trip-mgmt' | 'predictions' | 'analytics';

