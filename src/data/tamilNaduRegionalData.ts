import { TransportStop, BusDisruption } from '../types';

export interface DistrictInfo {
  no: number;
  district: string;
  majorTowns: string[];
  headquarters: string;
  lat: number;
  lng: number;
}

export interface StateRegionInfo {
  state: string;
  majorTowns: string[];
  isUnionTerritory?: boolean;
}

// Complete 32 Tamil Nadu Districts and their Towns/Sub-Towns
export const TAMIL_NADU_32_DISTRICTS: DistrictInfo[] = [
  {
    no: 1,
    district: 'Ariyalur',
    headquarters: 'Ariyalur',
    lat: 11.1401,
    lng: 79.0786,
    majorTowns: ['Ariyalur', 'Jayankondam', 'Andimadam', 'Udayarpalayam', 'Sendurai'],
  },
  {
    no: 2,
    district: 'Chennai',
    headquarters: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    majorTowns: ['Chennai', 'Tondiarpet', 'Perambur', 'Anna Nagar', 'T. Nagar', 'Adyar', 'Mylapore', 'Guindy'],
  },
  {
    no: 3,
    district: 'Coimbatore',
    headquarters: 'Coimbatore',
    lat: 11.0168,
    lng: 76.9558,
    majorTowns: [
      'KPR Institute',
      'Gandhipuram',
      'Central Bus Stand',
      'Railway Station',
      'Singanallur',
      'Ukkadam',
      'Peelamedu',
      'Hope College',
      'Coimbatore',
      'Pollachi',
      'Mettupalayam',
      'Sulur',
      'Annur',
      'Valparai',
      'Kinathukadavu',
      'Karamadai',
      'Madukkarai',
    ],
  },
  {
    no: 4,
    district: 'Cuddalore',
    headquarters: 'Cuddalore',
    lat: 11.748,
    lng: 79.7714,
    majorTowns: ['Cuddalore', 'Chidambaram', 'Panruti', 'Neyveli', 'Virudhachalam', 'Tittakudi', 'Bhuvanagiri', 'Kattumannarkoil'],
  },
  {
    no: 5,
    district: 'Dharmapuri',
    headquarters: 'Dharmapuri',
    lat: 12.1211,
    lng: 78.1582,
    majorTowns: ['Dharmapuri', 'Palacode', 'Pennagaram', 'Harur', 'Pappireddipatti', 'Karimangalam'],
  },
  {
    no: 6,
    district: 'Dindigul',
    headquarters: 'Dindigul',
    lat: 10.3673,
    lng: 77.9803,
    majorTowns: ['Dindigul', 'Palani', 'Oddanchatram', 'Kodaikanal', 'Vedasandur', 'Nilakottai', 'Natham', 'Batlagundu'],
  },
  {
    no: 7,
    district: 'Erode',
    headquarters: 'Erode',
    lat: 11.341,
    lng: 77.7172,
    majorTowns: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Sathyamangalam', 'Perundurai', 'Kodumudi', 'Chennimalai', 'Anthiyur'],
  },
  {
    no: 8,
    district: 'Kancheepuram',
    headquarters: 'Kancheepuram',
    lat: 12.8342,
    lng: 79.7036,
    majorTowns: ['Kancheepuram', 'Sriperumbudur', 'Uthiramerur', 'Kundrathur', 'Walajabad', 'Sunguvarchatram'],
  },
  {
    no: 9,
    district: 'Kanniyakumari',
    headquarters: 'Nagercoil',
    lat: 8.0883,
    lng: 77.5385,
    majorTowns: ['Nagercoil', 'Kanyakumari', 'Marthandam', 'Kuzhithurai', 'Colachel', 'Thuckalay', 'Eraniel'],
  },
  {
    no: 10,
    district: 'Karur',
    headquarters: 'Karur',
    lat: 10.9601,
    lng: 78.0766,
    majorTowns: ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Pugalur', 'Velayuthampalayam'],
  },
  {
    no: 11,
    district: 'Krishnagiri',
    headquarters: 'Krishnagiri',
    lat: 12.5186,
    lng: 78.2137,
    majorTowns: ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Uthangarai', 'Bargur', 'Pochampalli'],
  },
  {
    no: 12,
    district: 'Madurai',
    headquarters: 'Madurai',
    lat: 9.9252,
    lng: 78.1198,
    majorTowns: ['Madurai', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti', 'Peraiyur', 'Alanganallur', 'Othakadai'],
  },
  {
    no: 13,
    district: 'Nagapattinam',
    headquarters: 'Nagapattinam',
    lat: 10.7672,
    lng: 79.8449,
    majorTowns: ['Nagapattinam', 'Vedaranyam', 'Kilvelur', 'Thirukkuvalai', 'Sirkazhi', 'Mayiladuthurai'],
  },
  {
    no: 14,
    district: 'Namakkal',
    headquarters: 'Namakkal',
    lat: 11.2189,
    lng: 78.1674,
    majorTowns: ['Namakkal', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur', 'Komarapalayam', 'Sendamangalam'],
  },
  {
    no: 15,
    district: 'Perambalur',
    headquarters: 'Perambalur',
    lat: 11.2342,
    lng: 78.8821,
    majorTowns: ['Perambalur', 'Kunnam', 'Veppanthattai', 'Alathur', 'Arumbavur'],
  },
  {
    no: 16,
    district: 'Pudukkottai',
    headquarters: 'Pudukkottai',
    lat: 10.3797,
    lng: 78.8208,
    majorTowns: ['Pudukkottai', 'Aranthangi', 'Alangudi', 'Keeranur', 'Illuppur', 'Ponnamaravathi', 'Thirumayam'],
  },
  {
    no: 17,
    district: 'Ramanathapuram',
    headquarters: 'Ramanathapuram',
    lat: 9.3639,
    lng: 78.8395,
    majorTowns: ['Ramanathapuram', 'Rameswaram', 'Paramakudi', 'Kamuthi', 'Mudukulathur', 'Keelakarai', 'Mandapam', 'Sayalkudi'],
  },
  {
    no: 18,
    district: 'Salem',
    headquarters: 'Salem',
    lat: 11.6643,
    lng: 78.146,
    majorTowns: ['Salem', 'Mettur', 'Attur', 'Sankari', 'Edappadi', 'Omalur', 'Vazhapadi', 'Gangavalli'],
  },
  {
    no: 19,
    district: 'Sivaganga',
    headquarters: 'Sivaganga',
    lat: 9.8433,
    lng: 78.4809,
    majorTowns: ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Ilayangudi', 'Tiruppathur', 'Singampunari', 'Kalaiyarkoil', 'Thiruppuvanam'],
  },
  {
    no: 20,
    district: 'Thanjavur',
    headquarters: 'Thanjavur',
    lat: 10.787,
    lng: 79.1378,
    majorTowns: ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Papanasam', 'Peravurani', 'Orathanadu', 'Thiruvaiyaru', 'Budalur'],
  },
  {
    no: 21,
    district: 'The Nilgiris',
    headquarters: 'Ooty',
    lat: 11.4102,
    lng: 76.695,
    majorTowns: ['Ooty', 'Coonoor', 'Kotagiri', 'Gudalur', 'Lovedale', 'Wellington', 'Aravankadu'],
  },
  {
    no: 22,
    district: 'Theni',
    headquarters: 'Theni',
    lat: 10.0104,
    lng: 77.4768,
    majorTowns: ['Theni', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Uthamapalayam', 'Andipatti', 'Chinnamanur'],
  },
  {
    no: 23,
    district: 'Thiruvallur',
    headquarters: 'Tiruvallur',
    lat: 13.1432,
    lng: 79.9079,
    majorTowns: ['Tiruvallur', 'Avadi', 'Ponneri', 'Gummidipoondi', 'Tiruttani', 'Ambattur', 'Poonamallee', 'Uthukottai'],
  },
  {
    no: 24,
    district: 'Thiruvarur',
    headquarters: 'Thiruvarur',
    lat: 10.7719,
    lng: 79.6368,
    majorTowns: ['Thiruvarur', 'Mannargudi', 'Needamangalam', 'Nannilam', 'Thiruthuraipoondi', 'Muthupet', 'Kodavasal'],
  },
  {
    no: 25,
    district: 'Thoothukudi',
    headquarters: 'Thoothukudi',
    lat: 8.7642,
    lng: 78.1348,
    majorTowns: ['Thoothukudi', 'Kovilpatti', 'Tiruchendur', 'Srivaikuntam', 'Ettayapuram', 'Vilathikulam', 'Kayalpattinam'],
  },
  {
    no: 26,
    district: 'Tiruchirappalli',
    headquarters: 'Tiruchirappalli',
    lat: 10.7905,
    lng: 78.7047,
    majorTowns: ['Tiruchirappalli', 'Srirangam', 'Manapparai', 'Thuraiyur', 'Musiri', 'Lalgudi', 'Thottiyam', 'Manachanallur'],
  },
  {
    no: 27,
    district: 'Tirunelveli',
    headquarters: 'Tirunelveli',
    lat: 8.7139,
    lng: 77.7567,
    majorTowns: ['Tirunelveli', 'Palayamkottai', 'Ambasamudram', 'Nanguneri', 'Valliyur', 'Radhapuram', 'Cheranmahadevi', 'Manur'],
  },
  {
    no: 28,
    district: 'Tiruppur',
    headquarters: 'Tiruppur',
    lat: 11.1085,
    lng: 77.3411,
    majorTowns: ['Tiruppur', 'Udumalaipettai', 'Dharapuram', 'Kangeyam', 'Palladam', 'Avinashi', 'Vellakoil', 'Kundadam'],
  },
  {
    no: 29,
    district: 'Tiruvannamalai',
    headquarters: 'Tiruvannamalai',
    lat: 12.2253,
    lng: 79.0747,
    majorTowns: ['Tiruvannamalai', 'Arani', 'Polur', 'Chengam', 'Vandavasi', 'Cheyyar', 'Kalasapakkam'],
  },
  {
    no: 30,
    district: 'Vellore',
    headquarters: 'Vellore',
    lat: 12.9165,
    lng: 79.1325,
    majorTowns: ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Anaicut', 'K.V. Kuppam'],
  },
  {
    no: 31,
    district: 'Villupuram',
    headquarters: 'Villupuram',
    lat: 11.9398,
    lng: 79.4975,
    majorTowns: ['Villupuram', 'Tindivanam', 'Gingee', 'Kallakurichi', 'Ulundurpet', 'Sankarapuram', 'Tirukoilur', 'Marakkanam'],
  },
  {
    no: 32,
    district: 'Virudhunagar',
    headquarters: 'Virudhunagar',
    lat: 9.5872,
    lng: 77.9579,
    majorTowns: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Srivilliputhur', 'Sattur', 'Kariapatti', 'Vembakottai'],
  },
];

// Neighboring States and Union Territory
export const INTERSTATE_REGIONS: StateRegionInfo[] = [
  {
    state: 'Karnataka',
    majorTowns: ['Bengaluru', 'Mysuru', 'Mandya', 'Hassan', 'Chamarajanagar', 'Kollegal', 'Mangaluru'],
  },
  {
    state: 'Kerala',
    majorTowns: ['Palakkad', 'Kochi', 'Thrissur', 'Idukki', 'Alappuzha', 'Kollam', 'Thiruvananthapuram', 'Wayanad'],
  },
  {
    state: 'Andhra Pradesh',
    majorTowns: ['Tirupati', 'Chittoor', 'Nellore', 'Kadapa', 'Kurnool'],
  },
  {
    state: 'Telangana',
    majorTowns: ['Hyderabad', 'Warangal', 'Nalgonda', 'Mahbubnagar'],
  },
  {
    state: 'Puducherry (UT)',
    isUnionTerritory: true,
    majorTowns: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
];

export interface LocationEntry {
  town: string;
  district: string;
  state: string;
  category: string;
}

// Flat search index of all locations across TN 32 districts and neighboring states
export function getAllLocations(): LocationEntry[] {
  const list: LocationEntry[] = [];

  // Add Tamil Nadu Districts and Towns
  TAMIL_NADU_32_DISTRICTS.forEach((d) => {
    d.majorTowns.forEach((town) => {
      list.push({
        town,
        district: d.district,
        state: 'Tamil Nadu',
        category: `Tamil Nadu · ${d.district}`,
      });
    });
  });

  // Add Interstate towns
  INTERSTATE_REGIONS.forEach((st) => {
    st.majorTowns.forEach((town) => {
      list.push({
        town,
        district: st.state,
        state: st.state,
        category: `${st.state} Interstate`,
      });
    });
  });

  return list;
}

// Quick Town Autocomplete / Search
export function searchLocations(query: string, maxResults = 25): LocationEntry[] {
  if (!query || query.trim().length === 0) {
    return getAllLocations().slice(0, maxResults);
  }

  const q = query.toLowerCase().trim();
  const all = getAllLocations();

  return all
    .filter(
      (item) =>
        item.town.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
    )
    .slice(0, maxResults);
}

// Estimate distance, travel time, and fare between any two locations in the network
export function estimateDistanceAndFare(fromTown: string, toTown: string): {
  distanceKm: number;
  travelTimeMin: number;
  fareINR: number;
  isInterstate: boolean;
} {
  if (fromTown === toTown) {
    return { distanceKm: 5, travelTimeMin: 15, fareINR: 10, isInterstate: false };
  }

  const all = getAllLocations();
  const fromObj = all.find((l) => l.town.toLowerCase() === fromTown.toLowerCase());
  const toObj = all.find((l) => l.town.toLowerCase() === toTown.toLowerCase());

  const sameDistrict = fromObj && toObj && fromObj.district === toObj.district;
  const isInterstate = fromObj && toObj && fromObj.state !== toObj.state;

  if (sameDistrict) {
    // Local / Intradistrict journey
    return {
      distanceKm: 18,
      travelTimeMin: 32,
      fareINR: 18,
      isInterstate: false,
    };
  }

  if (isInterstate) {
    // Long distance interstate journey
    return {
      distanceKm: 340,
      travelTimeMin: 390,
      fareINR: 420,
      isInterstate: true,
    };
  }

  // Interdistrict within Tamil Nadu
  return {
    distanceKm: 165,
    travelTimeMin: 210,
    fareINR: 195,
    isInterstate: false,
  };
}

export interface RegionalCorridor {
  id: string;
  name: string;
  state: string;
  origin: string;
  destination: string;
  distanceKm: number;
  averageTravelHours: string;
  fareINR: number;
  crowdLevel: 'low' | 'moderate' | 'high' | 'critical';
  serviceType: 'SETC Ultra Deluxe' | 'KSRTC Airavat' | 'TNSTC Express' | 'BMTC Vayu Vajra';
}

export const TAMIL_NADU_REGIONAL_CORRIDORS: RegionalCorridor[] = [
  {
    id: 'corridor-cbe-chn',
    name: 'Coimbatore ➔ Chennai Central Trunk',
    state: 'Tamil Nadu',
    origin: 'Gandhipuram Central, Coimbatore',
    destination: 'CMBT Koyambedu, Chennai',
    distanceKm: 504,
    averageTravelHours: '8h 30m',
    fareINR: 520,
    crowdLevel: 'high',
    serviceType: 'SETC Ultra Deluxe',
  },
  {
    id: 'corridor-cbe-blr',
    name: 'Coimbatore ➔ Bengaluru Interstate Express',
    state: 'Tamil Nadu / Karnataka',
    origin: 'Gandhipuram, Coimbatore',
    destination: 'Majestic / Electronic City, Bengaluru',
    distanceKm: 365,
    averageTravelHours: '6h 45m',
    fareINR: 480,
    crowdLevel: 'critical',
    serviceType: 'KSRTC Airavat',
  },
  {
    id: 'corridor-cbe-plk',
    name: 'Coimbatore ➔ Palakkad Border Shuttle',
    state: 'Tamil Nadu / Kerala',
    origin: 'Ukkadam Bus Stand, Coimbatore',
    destination: 'KSRTC Stand, Palakkad',
    distanceKm: 54,
    averageTravelHours: '1h 20m',
    fareINR: 65,
    crowdLevel: 'moderate',
    serviceType: 'TNSTC Express',
  },
  {
    id: 'corridor-cbe-mdu',
    name: 'Coimbatore ➔ Madurai Temple Link',
    state: 'Tamil Nadu',
    origin: 'Singanallur Bus Stand, Coimbatore',
    destination: 'Mattuthavani Integrated, Madurai',
    distanceKm: 215,
    averageTravelHours: '4h 30m',
    fareINR: 235,
    crowdLevel: 'moderate',
    serviceType: 'TNSTC Express',
  },
  {
    id: 'corridor-cbe-tpt',
    name: 'Coimbatore ➔ Tirupati Pilgrimage Express',
    state: 'Tamil Nadu / Andhra Pradesh',
    origin: 'Central Bus Stand, Coimbatore',
    destination: 'Central Bus Stand, Tirupati',
    distanceKm: 480,
    averageTravelHours: '8h 45m',
    fareINR: 590,
    crowdLevel: 'high',
    serviceType: 'SETC Ultra Deluxe',
  },
  {
    id: 'corridor-cbe-koc',
    name: 'Coimbatore ➔ Kochi Marine Corridor',
    state: 'Tamil Nadu / Kerala',
    origin: 'Ukkadam Bus Stand, Coimbatore',
    destination: 'Vyttila Mobility Hub, Kochi',
    distanceKm: 190,
    averageTravelHours: '4h 15m',
    fareINR: 260,
    crowdLevel: 'low',
    serviceType: 'KSRTC Airavat',
  },
];

export const TAMIL_NADU_REGIONAL_STOPS: TransportStop[] = [
  {
    id: 'stop-kpr',
    name: 'KPR Institute of Engineering',
    nameTamil: 'கே.பி.ஆர் கல்வி நிறுவனம்',
    zone: 'East Educational Hub (Arasur / Avinashi Rd)',
    state: 'Tamil Nadu',
    lat: 11.0772,
    lng: 77.1428,
    x: 140,
    y: 180,
    currentCrowd: 32,
    predictedCrowd30m: 48,
    capacity: 250,
    routes: ['route-12', 'route-18', 'route-15'],
    trend: 'up',
    risk: 'Low',
  },
  {
    id: 'stop-hope-college',
    name: 'Hope College Junction',
    nameTamil: 'ஹோப் காலேஜ் சந்திப்பு',
    zone: 'Avinashi Road Arterial',
    state: 'Tamil Nadu',
    lat: 11.0258,
    lng: 77.0125,
    x: 320,
    y: 220,
    currentCrowd: 78,
    predictedCrowd30m: 91,
    capacity: 400,
    routes: ['route-12', 'route-7', 'route-15'],
    trend: 'up',
    risk: 'Critical',
  },
  {
    id: 'stop-peelamedu',
    name: 'Peelamedu Tech Zone',
    nameTamil: 'பீளமேடு தொழில்நுட்ப மண்டலம்',
    zone: 'Commercial & College Belt',
    state: 'Tamil Nadu',
    lat: 11.0315,
    lng: 77.0012,
    x: 440,
    y: 240,
    currentCrowd: 84,
    predictedCrowd30m: 94,
    capacity: 350,
    routes: ['route-12', 'route-15', 'route-18'],
    trend: 'up',
    risk: 'Critical',
  },
  {
    id: 'stop-gandhipuram',
    name: 'Gandhipuram Central Bus Stand',
    nameTamil: 'காந்திபுரம் மத்திய பேருந்து நிலையம்',
    zone: 'North Central Hub',
    state: 'Tamil Nadu',
    lat: 11.0183,
    lng: 76.9678,
    x: 580,
    y: 260,
    currentCrowd: 91,
    predictedCrowd30m: 96,
    capacity: 1200,
    routes: ['route-12', 'route-15', 'route-18', 'route-24', 'corridor-cbe-chn', 'corridor-cbe-blr'],
    trend: 'up',
    risk: 'Critical',
  },
  {
    id: 'stop-central-bus-stand',
    name: 'Central Bus Stand (Town Hall / Gandhipuram)',
    nameTamil: 'மத்திய பேருந்து நிலையம்',
    zone: 'Central Metropolitan Junction',
    state: 'Tamil Nadu',
    lat: 10.9984,
    lng: 76.9665,
    x: 680,
    y: 310,
    currentCrowd: 92,
    predictedCrowd30m: 97,
    capacity: 1500,
    routes: ['route-12', 'route-15', 'route-18', 'route-7'],
    trend: 'up',
    risk: 'Critical',
  },
  {
    id: 'stop-railway-station',
    name: 'Coimbatore Railway Station Junction',
    nameTamil: 'கோவை ரயில் நிலையம்',
    zone: 'Intermodal Rail-Bus Hub',
    state: 'Tamil Nadu',
    lat: 10.9972,
    lng: 76.9628,
    x: 720,
    y: 350,
    currentCrowd: 86,
    predictedCrowd30m: 92,
    capacity: 900,
    routes: ['route-12', 'route-18'],
    trend: 'up',
    risk: 'High',
  },
  {
    id: 'stop-singanallur',
    name: 'Singanallur Integrated Stand',
    nameTamil: 'சிங்காநல்லூர் பேருந்து நிலையம்',
    zone: 'South-East Trichy Road Corridor',
    state: 'Tamil Nadu',
    lat: 10.9961,
    lng: 77.0253,
    x: 520,
    y: 430,
    currentCrowd: 74,
    predictedCrowd30m: 82,
    capacity: 650,
    routes: ['route-18', 'corridor-cbe-mdu'],
    trend: 'up',
    risk: 'High',
  },
  {
    id: 'stop-ukkadam',
    name: 'Ukkadam Bus Terminal',
    nameTamil: 'உக்கடம் பேருந்து முனையம்',
    zone: 'South-West Kerala Interstate Gateway',
    state: 'Tamil Nadu',
    lat: 10.9882,
    lng: 76.9587,
    x: 620,
    y: 490,
    currentCrowd: 68,
    predictedCrowd30m: 76,
    capacity: 700,
    routes: ['route-18', 'corridor-cbe-plk', 'corridor-cbe-koc'],
    trend: 'stable',
    risk: 'Moderate',
  },
];

export const LIVE_BUS_DISRUPTIONS: BusDisruption[] = [
  {
    id: 'disrupt-01',
    routeNumber: 'Route 12',
    busRegNumber: 'TN 38 N 2490',
    type: 'breakdown',
    severity: 'critical',
    title: 'Engine Radiator Overheating near Hope College',
    description: 'Vehicle halted at Hope College junction service road. Technical repair team on site.',
    locationName: 'Hope College Junction, Avinashi Rd',
    startTime: '16:40',
    estimatedResolutionTime: '17:45',
    affectedStops: ['Hope College Junction', 'Peelamedu Tech Zone', 'Central Bus Stand'],
    recommendedAlternativeRoute: 'Route 18',
    isResolved: false,
    replacementBusDispatched: true,
  },
  {
    id: 'disrupt-02',
    routeNumber: 'Route 7',
    busRegNumber: 'TN 38 N 1842',
    type: 'accident',
    severity: 'severe',
    title: 'Minor Bumper Collision at Avinashi Road Flyover Entry',
    description: 'Traffic congestion trailing 1.8km. Traffic police currently clearing corridor lane.',
    locationName: 'Avinashi Road Flyover Ramp',
    startTime: '16:55',
    estimatedResolutionTime: '17:35',
    affectedStops: ['Lakshmi Mills', 'Gandhipuram Central'],
    recommendedAlternativeRoute: 'Route 15',
    isResolved: false,
    replacementBusDispatched: false,
  },
  {
    id: 'disrupt-03',
    routeNumber: 'Route 24',
    busRegNumber: 'TN 38 N 3991',
    type: 'maintenance',
    severity: 'moderate',
    title: 'Preventive Tyre Inspection & Brake Fluid Check',
    description: 'Scheduled depot check delayed departure from Singanallur.',
    locationName: 'Singanallur Depot Bay 4',
    startTime: '16:30',
    estimatedResolutionTime: '17:15',
    affectedStops: ['Singanallur', 'Ramanathapuram', 'Town Hall'],
    recommendedAlternativeRoute: 'Route 18',
    isResolved: false,
    replacementBusDispatched: true,
  },
];

// Google Maps Deep Links generator
export function getGoogleMapsDirectionsUrl(origin: string, destination: string): string {
  const encOrigin = encodeURIComponent(`${origin}, Tamil Nadu, India`);
  const encDest = encodeURIComponent(`${destination}, India`);
  return `https://www.google.com/maps/dir/?api=1&origin=${encOrigin}&destination=${encDest}&travelmode=transit`;
}

export function getGoogleMapsLocationUrl(placeName: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, India`)}`;
}
