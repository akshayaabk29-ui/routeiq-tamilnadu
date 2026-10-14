import {
  HistoricalTripRecord,
  HistoricalPredictionResult,
  SimpleCrowdLevel,
  ManagedRoute,
  ScheduledTrip,
} from '../types';

const STORAGE_KEY = 'routeiq_historical_trip_records_v1';

export const INITIAL_HISTORICAL_RECORDS: HistoricalTripRecord[] = [
  {
    id: 'hist-21a-1',
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
    createdAt: '2026-09-28T08:00:00Z',
  },
  {
    id: 'hist-21a-2',
    routeNumber: '21A',
    routeName: 'Route 21A',
    from: 'Periyar',
    to: 'Mattuthavani',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '9:00 AM',
    vehicleNumber: 'TN 58 N 1823',
    vehicleCapacity: 50,
    passengerCount: 31,
    notes: 'Post-morning office clearance',
    createdAt: '2026-09-28T09:00:00Z',
  },
  {
    id: 'hist-42b-1',
    routeNumber: '42B',
    routeName: 'Route 42B',
    from: 'Ukkadam',
    to: 'Railway Station',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '8:30 AM',
    vehicleNumber: 'TN 38 N 2490',
    vehicleCapacity: 50,
    passengerCount: 47,
    notes: 'Intercity train connection peak rush',
    createdAt: '2026-09-28T08:30:00Z',
  },
  {
    id: 'hist-70a-1',
    routeNumber: '70A',
    routeName: 'Route 70A',
    from: 'Gandhipuram',
    to: 'KPR Institute',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '5:30 PM',
    vehicleNumber: 'TN 38 N 3120',
    vehicleCapacity: 55,
    passengerCount: 52,
    notes: 'Evening college dispersal & Avinashi Road corridor rush',
    createdAt: '2026-09-28T17:30:00Z',
  },
  {
    id: 'hist-10c-1',
    routeNumber: '10C',
    routeName: 'Route 10C',
    from: 'Central Bus Stand',
    to: 'Thudiyalur',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '7:45 AM',
    vehicleNumber: 'TN 38 N 1045',
    vehicleCapacity: 50,
    passengerCount: 28,
    notes: 'Early morning suburban commuters',
    createdAt: '2026-09-28T07:45:00Z',
  },
  {
    id: 'hist-12d-1',
    routeNumber: '12D',
    routeName: 'Route 12D',
    from: 'Singanallur',
    to: 'Saravanampatti',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '6:00 PM',
    vehicleNumber: 'TN 38 N 4412',
    vehicleCapacity: 45,
    passengerCount: 44,
    notes: 'IT corridor shift clearance; severe standing crowd',
    createdAt: '2026-09-28T18:00:00Z',
  },
  {
    id: 'hist-33a-1',
    routeNumber: '33A',
    routeName: 'Route 33A',
    from: 'Periyar',
    to: 'Tiruppur Hub',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '11:00 AM',
    vehicleNumber: 'TN 39 N 9921',
    vehicleCapacity: 50,
    passengerCount: 22,
    notes: 'Mid-morning off-peak interstate service',
    createdAt: '2026-09-28T11:00:00Z',
  },
  {
    id: 'hist-11b-1',
    routeNumber: '11B',
    routeName: 'Route 11B',
    from: 'Ukkadam',
    to: 'Hope College',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '8:15 AM',
    vehicleNumber: 'TN 38 N 2210',
    vehicleCapacity: 50,
    passengerCount: 46,
    notes: 'Trichy Road junction congestion; high occupancy',
    createdAt: '2026-09-28T08:15:00Z',
  },
  {
    id: 'hist-5c-1',
    routeNumber: '5C',
    routeName: 'Route 5C',
    from: 'Central Bus Stand',
    to: 'Pollachi Road',
    date: '28-09-2026',
    day: 'Monday',
    tripTime: '2:00 PM',
    vehicleNumber: 'TN 38 N 8820',
    vehicleCapacity: 50,
    passengerCount: 25,
    notes: 'Afternoon balanced flow',
    createdAt: '2026-09-28T14:00:00Z',
  },
  {
    id: 'hist-21a-sun',
    routeNumber: '21A',
    routeName: 'Route 21A',
    from: 'Periyar',
    to: 'Mattuthavani',
    date: '27-09-2026',
    day: 'Sunday',
    tripTime: '8:00 AM',
    vehicleNumber: 'TN 58 N 1823',
    vehicleCapacity: 50,
    passengerCount: 24,
    notes: 'Sunday morning holiday leisure travel',
    createdAt: '2026-09-27T08:00:00Z',
  },
  {
    id: 'hist-42b-fri',
    routeNumber: '42B',
    routeName: 'Route 42B',
    from: 'Ukkadam',
    to: 'Railway Station',
    date: '25-09-2026',
    day: 'Friday',
    tripTime: '5:30 PM',
    vehicleNumber: 'TN 38 N 2490',
    vehicleCapacity: 50,
    passengerCount: 48,
    notes: 'Weekend outstation departures at Railway Station',
    createdAt: '2026-09-25T17:30:00Z',
  },
  {
    id: 'hist-70a-fri',
    routeNumber: '70A',
    routeName: 'Route 70A',
    from: 'Gandhipuram',
    to: 'KPR Institute',
    date: '25-09-2026',
    day: 'Friday',
    tripTime: '5:00 PM',
    vehicleNumber: 'TN 38 N 3120',
    vehicleCapacity: 55,
    passengerCount: 51,
    notes: 'Friday campus exit rush',
    createdAt: '2026-09-25T17:00:00Z',
  },
];

export const INITIAL_MANAGED_ROUTES: ManagedRoute[] = [
  {
    id: 'mr-21a',
    routeNumber: '21A',
    name: 'Periyar - Mattuthavani Express',
    from: 'Periyar',
    to: 'Mattuthavani',
    totalDistanceKm: 16.4,
    frequencyMin: 12,
    defaultCapacity: 50,
    activeBusesCount: 8,
    corridorType: 'Urban Trunk Line',
  },
  {
    id: 'mr-42b',
    routeNumber: '42B',
    name: 'Ukkadam - Railway Station Shuttle',
    from: 'Ukkadam',
    to: 'Railway Station',
    totalDistanceKm: 9.8,
    frequencyMin: 10,
    defaultCapacity: 50,
    activeBusesCount: 6,
    corridorType: 'Railway Feeder Line',
  },
  {
    id: 'mr-70a',
    routeNumber: '70A',
    name: 'Gandhipuram - KPR Institute Corridors',
    from: 'Gandhipuram',
    to: 'KPR Institute',
    totalDistanceKm: 21.2,
    frequencyMin: 15,
    defaultCapacity: 55,
    activeBusesCount: 9,
    corridorType: 'Education & Tech Corridor',
  },
  {
    id: 'mr-10c',
    routeNumber: '10C',
    name: 'Central Bus Stand - Thudiyalur',
    from: 'Central Bus Stand',
    to: 'Thudiyalur',
    totalDistanceKm: 14.0,
    frequencyMin: 15,
    defaultCapacity: 50,
    activeBusesCount: 5,
    corridorType: 'Suburban North Link',
  },
  {
    id: 'mr-12d',
    routeNumber: '12D',
    name: 'Singanallur - Saravanampatti IT Express',
    from: 'Singanallur',
    to: 'Saravanampatti',
    totalDistanceKm: 18.5,
    frequencyMin: 12,
    defaultCapacity: 45,
    activeBusesCount: 7,
    corridorType: 'IT Corridor Direct',
  },
  {
    id: 'mr-33a',
    routeNumber: '33A',
    name: 'Periyar - Tiruppur Regional Hub',
    from: 'Periyar',
    to: 'Tiruppur Hub',
    totalDistanceKm: 46.0,
    frequencyMin: 30,
    defaultCapacity: 50,
    activeBusesCount: 4,
    corridorType: 'Inter-district Regional',
  },
  {
    id: 'mr-11b',
    routeNumber: '11B',
    name: 'Ukkadam - Hope College Connector',
    from: 'Ukkadam',
    to: 'Hope College',
    totalDistanceKm: 12.3,
    frequencyMin: 12,
    defaultCapacity: 50,
    activeBusesCount: 5,
    corridorType: 'East Arterial Trunk',
  },
  {
    id: 'mr-5c',
    routeNumber: '5C',
    name: 'Central Bus Stand - Pollachi Link',
    from: 'Central Bus Stand',
    to: 'Pollachi Road',
    totalDistanceKm: 28.0,
    frequencyMin: 20,
    defaultCapacity: 50,
    activeBusesCount: 4,
    corridorType: 'South Radial Highway',
  },
];

export const INITIAL_SCHEDULED_TRIPS: ScheduledTrip[] = [
  {
    id: 'trip-101',
    routeNumber: '21A',
    routeName: 'Route 21A',
    departureTime: '8:00 AM',
    day: 'Monday',
    vehicleNumber: 'TN 58 N 1823',
    driverName: 'K. Murugan',
    status: 'In Transit',
  },
  {
    id: 'trip-102',
    routeNumber: '21A',
    routeName: 'Route 21A',
    departureTime: '9:00 AM',
    day: 'Monday',
    vehicleNumber: 'TN 58 N 1823',
    driverName: 'K. Murugan',
    status: 'Scheduled',
  },
  {
    id: 'trip-103',
    routeNumber: '42B',
    routeName: 'Route 42B',
    departureTime: '8:30 AM',
    day: 'Monday',
    vehicleNumber: 'TN 38 N 2490',
    driverName: 'M. Selvaraj',
    status: 'In Transit',
  },
  {
    id: 'trip-104',
    routeNumber: '70A',
    routeName: 'Route 70A',
    departureTime: '5:30 PM',
    day: 'Monday',
    vehicleNumber: 'TN 38 N 3120',
    driverName: 'P. Anandhan',
    status: 'Scheduled',
  },
  {
    id: 'trip-105',
    routeNumber: '10C',
    routeName: 'Route 10C',
    departureTime: '7:45 AM',
    day: 'Monday',
    vehicleNumber: 'TN 38 N 1045',
    driverName: 'R. Senthil',
    status: 'Completed',
  },
  {
    id: 'trip-106',
    routeNumber: '12D',
    routeName: 'Route 12D',
    departureTime: '6:00 PM',
    day: 'Monday',
    vehicleNumber: 'TN 38 N 4412',
    driverName: 'S. Ganesan',
    status: 'Scheduled',
  },
  {
    id: 'trip-107',
    routeNumber: '33A',
    routeName: 'Route 33A',
    departureTime: '11:00 AM',
    day: 'Monday',
    vehicleNumber: 'TN 39 N 9921',
    driverName: 'V. Prakash',
    status: 'Scheduled',
  },
  {
    id: 'trip-108',
    routeNumber: '11B',
    routeName: 'Route 11B',
    departureTime: '8:15 AM',
    day: 'Monday',
    vehicleNumber: 'TN 38 N 2210',
    driverName: 'T. Karthik',
    status: 'In Transit',
  },
];

// Helper to convert time string e.g. "8:00 AM", "5:30 PM" to decimal hours (0 - 24)
export function parseTimeToHours(timeStr: string): number {
  if (!timeStr) return 8.0;
  const clean = timeStr.trim().toLowerCase();
  const isPM = clean.includes('pm');
  const isAM = clean.includes('am');

  const parts = clean.replace(/(am|pm)/g, '').trim().split(':');
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours + minutes / 60;
}

// Storage listeners
type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error('Listener callback failed:', err);
    }
  });
}

export function subscribeToTripDataChanges(callback: ChangeListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Read records
export function getHistoricalTripRecords(): HistoricalTripRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORICAL_RECORDS));
      return INITIAL_HISTORICAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_HISTORICAL_RECORDS;
  } catch (err) {
    console.warn('Failed to parse historical trip records from storage:', err);
    return INITIAL_HISTORICAL_RECORDS;
  }
}

// Save / Add / Update
export function saveHistoricalTripRecord(
  record: Omit<HistoricalTripRecord, 'id' | 'createdAt'> & { id?: string }
): HistoricalTripRecord {
  const current = getHistoricalTripRecords();
  const now = new Date().toISOString();

  if (record.id) {
    // Update
    const updatedList = current.map((item) =>
      item.id === record.id
        ? {
            ...item,
            ...record,
            id: record.id as string,
          }
        : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    notifyListeners();
    return updatedList.find((i) => i.id === record.id)!;
  } else {
    // Insert new
    const newRecord: HistoricalTripRecord = {
      ...record,
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
    };
    const updatedList = [newRecord, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    notifyListeners();
    return newRecord;
  }
}

// Delete
export function deleteHistoricalTripRecord(id: string): void {
  const current = getHistoricalTripRecords();
  const updatedList = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  notifyListeners();
}

// Reset
export function resetHistoricalTripRecords(): HistoricalTripRecord[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORICAL_RECORDS));
  notifyListeners();
  return INITIAL_HISTORICAL_RECORDS;
}

// PREDICTION MODULE:
// Analyses factors: Route, Day, Time, Previous passenger count, Vehicle capacity
// Generates: Expected Passenger Count
// Crowd Level = Predicted Passenger Count compared with Vehicle Capacity
// 🟢 Low (< 60%)
// 🟡 Medium (60% - 85%)
// 🔴 High (> 85%)
export function predictDemandFromHistoricalData(params: {
  routeNumber: string;
  day: string;
  tripTime: string;
  vehicleCapacity?: number;
}): HistoricalPredictionResult {
  const records = getHistoricalTripRecords();
  const cleanRoute = (params.routeNumber || '21A').trim().toUpperCase().replace(/ROUTE\s*/i, '');
  const cleanDay = (params.day || 'Monday').trim();
  const targetHour = parseTimeToHours(params.tripTime || '8:00 AM');

  // Filter records matching route
  const routeRecords = records.filter(
    (r) => r.routeNumber.trim().toUpperCase().replace(/ROUTE\s*/i, '') === cleanRoute
  );

  const pool = routeRecords.length > 0 ? routeRecords : records;

  // Find associated route name / stops
  const matchedManaged = INITIAL_MANAGED_ROUTES.find(
    (mr) => mr.routeNumber.toUpperCase() === cleanRoute
  );
  const routeName =
    matchedManaged?.name ||
    routeRecords[0]?.routeName ||
    `Route ${cleanRoute}`;
  const startPoint = matchedManaged?.from || routeRecords[0]?.from || 'Periyar';
  const endPoint = matchedManaged?.to || routeRecords[0]?.to || 'Mattuthavani';

  const defaultCapacity =
    params.vehicleCapacity ||
    matchedManaged?.defaultCapacity ||
    routeRecords[0]?.vehicleCapacity ||
    50;

  // Weight calculations for each historical record
  let weightedSum = 0;
  let totalWeight = 0;
  let sampleCounts: number[] = [];

  const isTargetWeekend = cleanDay.toLowerCase() === 'saturday' || cleanDay.toLowerCase() === 'sunday';

  pool.forEach((r) => {
    let weight = 1.0;
    const rHour = parseTimeToHours(r.tripTime);
    const hourDelta = Math.abs(rHour - targetHour);

    // Time proximity weight (closer trip times get exponentially higher weight)
    if (hourDelta <= 0.75) {
      weight += 3.5;
    } else if (hourDelta <= 1.5) {
      weight += 2.0;
    } else if (hourDelta <= 3.0) {
      weight += 1.0;
    } else {
      weight += 0.2;
    }

    // Day match weight
    const isRecordWeekend = r.day.toLowerCase() === 'saturday' || r.day.toLowerCase() === 'sunday';
    if (r.day.toLowerCase() === cleanDay.toLowerCase()) {
      weight += 2.5; // exact day match
    } else if (isTargetWeekend === isRecordWeekend) {
      weight += 1.2; // both weekend or both weekday
    } else {
      weight *= 0.7; // weekday vs weekend divergence
    }

    // Route exactness bonus
    if (r.routeNumber.toUpperCase().replace(/ROUTE\s*/i, '') === cleanRoute) {
      weight *= 2.0;
    }

    weightedSum += r.passengerCount * weight;
    totalWeight += weight;
    sampleCounts.push(r.passengerCount);
  });

  const baseCalculated = totalWeight > 0 ? weightedSum / totalWeight : 35;
  const sampleAverage =
    sampleCounts.length > 0
      ? Math.round(sampleCounts.reduce((a, b) => a + b, 0) / sampleCounts.length)
      : Math.round(baseCalculated);

  // Expected passenger count bounded reasonably
  const expectedPassengerCount = Math.max(10, Math.min(defaultCapacity + 5, Math.round(baseCalculated)));

  // Compare with Vehicle Capacity
  const occupancyPercentage = Math.round((expectedPassengerCount / defaultCapacity) * 100);

  let crowdLevel: SimpleCrowdLevel;
  if (occupancyPercentage > 85) {
    crowdLevel = 'High'; // 🔴 High
  } else if (occupancyPercentage >= 60) {
    crowdLevel = 'Medium'; // 🟡 Medium
  } else {
    crowdLevel = 'Low'; // 🟢 Low
  }

  // Calculate confidence score based on number of relevant historical samples
  const confidenceScore = Math.min(98, Math.max(75, 78 + routeRecords.length * 3));

  // Determine factors
  const isPeakHour = (targetHour >= 7.5 && targetHour <= 10.0) || (targetHour >= 16.5 && targetHour <= 19.5);
  const contributingFactors = [
    {
      factor: isPeakHour ? 'Peak Commuter Window' : 'Off-Peak Midday Window',
      impact: isPeakHour ? '+28% historical surge' : '-18% nominal flow',
    },
    {
      factor: `${cleanDay} Demand Pattern`,
      impact: isTargetWeekend ? '-20% weekend drop' : '+15% standard working-day load',
    },
    {
      factor: `Corridor Capacity Ratio (${expectedPassengerCount}/${defaultCapacity})`,
      impact: `${occupancyPercentage}% capacity utilization`,
    },
  ];

  return {
    routeNumber: cleanRoute,
    routeName,
    from: startPoint,
    to: endPoint,
    day: cleanDay,
    tripTime: params.tripTime,
    vehicleCapacity: defaultCapacity,
    expectedPassengerCount,
    occupancyPercentage,
    crowdLevel,
    confidenceScore,
    historicalSampleCount: routeRecords.length > 0 ? routeRecords.length : pool.length,
    sampleHistoricalAverage: sampleAverage,
    contributingFactors,
  };
}

// Authority Overview Metrics Aggregator
export interface AuthorityMetrics {
  totalRoutes: number;
  totalTrips: number;
  totalBuses: number;
  totalCurrentPassengers: number;
  lowCrowdRoutesCount: number;
  mediumCrowdRoutesCount: number;
  highCrowdRoutesCount: number;
  predictedHighCrowdTripsCount: number;
  mostCrowdedRoute: {
    routeNumber: string;
    routeName: string;
    occupancyPercent: number;
    predictedPassengers: number;
    capacity: number;
  };
  mostCrowdedTime: string;
  highCrowdTrips: {
    id: string;
    routeNumber: string;
    routeName: string;
    time: string;
    capacity: number;
    predictedPassengers: number;
    crowdLevel: SimpleCrowdLevel;
  }[];
}

export function getAuthorityOverviewMetrics(): AuthorityMetrics {
  const records = getHistoricalTripRecords();
  const routes = INITIAL_MANAGED_ROUTES;
  const trips = INITIAL_SCHEDULED_TRIPS;

  // Run predictions across active routes at peak time
  const routePredictions = routes.map((r) => {
    const pred = predictDemandFromHistoricalData({
      routeNumber: r.routeNumber,
      day: 'Monday',
      tripTime: '8:30 AM',
      vehicleCapacity: r.defaultCapacity,
    });
    return pred;
  });

  const lowCount = routePredictions.filter((p) => p.crowdLevel === 'Low').length;
  const medCount = routePredictions.filter((p) => p.crowdLevel === 'Medium').length;
  const highCount = routePredictions.filter((p) => p.crowdLevel === 'High').length;

  // Predict crowd for all scheduled trips
  const tripPredictions = trips.map((t) => {
    const pred = predictDemandFromHistoricalData({
      routeNumber: t.routeNumber,
      day: t.day,
      tripTime: t.departureTime,
    });
    return {
      id: t.id,
      routeNumber: t.routeNumber,
      routeName: t.routeName,
      time: t.departureTime,
      capacity: pred.vehicleCapacity,
      predictedPassengers: pred.expectedPassengerCount,
      crowdLevel: pred.crowdLevel,
    };
  });

  const highCrowdTrips = tripPredictions.filter((tp) => tp.crowdLevel === 'High');

  // Most crowded route
  const sortedByOccupancy = [...routePredictions].sort(
    (a, b) => b.occupancyPercentage - a.occupancyPercentage
  );
  const mostCrowded = sortedByOccupancy[0] || {
    routeNumber: '70A',
    routeName: 'Route 70A',
    occupancyPercentage: 95,
    expectedPassengerCount: 52,
    vehicleCapacity: 55,
  };

  const totalBuses = routes.reduce((sum, r) => sum + r.activeBusesCount, 0);
  const totalPassengers = routePredictions.reduce((sum, r) => sum + r.expectedPassengerCount, 0);

  return {
    totalRoutes: routes.length,
    totalTrips: trips.length,
    totalBuses,
    totalCurrentPassengers: totalPassengers,
    lowCrowdRoutesCount: lowCount,
    mediumCrowdRoutesCount: medCount,
    highCrowdRoutesCount: highCount,
    predictedHighCrowdTripsCount: highCrowdTrips.length,
    mostCrowdedRoute: {
      routeNumber: mostCrowded.routeNumber,
      routeName: mostCrowded.routeName,
      occupancyPercent: mostCrowded.occupancyPercentage,
      predictedPassengers: mostCrowded.expectedPassengerCount,
      capacity: mostCrowded.vehicleCapacity,
    },
    mostCrowdedTime: '5:30 PM - 6:30 PM (Evening Peak Surge)',
    highCrowdTrips,
  };
}
