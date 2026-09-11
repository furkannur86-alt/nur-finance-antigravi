/**
 * NUR EARTH 3D — Planetary Defense & Satellite Fleet Systems
 * Apophis 2029 Trajectory, Starlink Constellation, GPS III, Tiangong & SBIRS Early Warning
 */

export interface PlanetaryThreat {
  id: string;
  designation: string;
  name: string;
  estimatedDiameterM: number;
  velocityKms: number;
  closeApproachDate: string;
  missDistanceKm: number; // e.g. 31,600 km for Apophis (inside GEO orbit)
  impactProbability: string;
  torinoScale: number;
  palermoScale: number;
  details: string;
  trajectoryPoints: [number, number, number][]; // [x, y, z] in Three.js space units
}

export interface SatelliteTrack {
  id: string;
  name: string;
  type: "STATION" | "STARLINK" | "GPS" | "EARLY_WARNING_SBIRS";
  altitudeKm: number;
  speedKmh: number;
  inclinationDeg: number;
  periodMin: number;
  color: number;
  phaseOffset: number; // for initial position in orbit
}

/**
 * 99942 Apophis — High-Precision 2029 Close Approach Orbit
 * On April 13, 2029, asteroid Apophis will pass within ~31,600 km of Earth's surface.
 */
export const APOPHIS_2029_DEFENSE_PROFILE: PlanetaryThreat = {
  id: "threat-apophis-2029",
  designation: "99942 Apophis (2004 MN4)",
  name: "ASTEROID 99942 APOPHIS",
  estimatedDiameterM: 370,
  velocityKms: 30.73,
  closeApproachDate: "2029-04-13T21:46:00Z",
  missDistanceKm: 31600, // Passes closer than geostationary satellites (35,786 km)
  impactProbability: "< 1 in 100,000 (Gravitational Keyhole Monitored)",
  torinoScale: 0,
  palermoScale: -2.84,
  details: "370-meter Aten-class asteroid. On April 13, 2029, it will sweep inside the ring of geostationary communication satellites, visible to the naked eye across Europe, Africa, and Asia. Gravitational torque from Earth will permanently alter its spin and orbit.",
  trajectoryPoints: [
    [-3.8, 1.8, -2.5],
    [-2.6, 1.4, -1.6],
    [-1.6, 0.9, -0.8],
    [-0.4, 0.4, 0.3],
    [0.6, -0.1, 1.15], // Closest Approach point (radius ~1.15)
    [1.7, -0.7, 1.9],
    [2.8, -1.3, 2.7],
    [4.0, -1.9, 3.6],
  ],
};

/**
 * Key Orbital Constellations & Space Stations
 */
export const ORBITAL_SATELLITE_FLEET: SatelliteTrack[] = [
  {
    id: "sat-tiangong",
    name: "Tiangong Space Station (CSS)",
    type: "STATION",
    altitudeKm: 389,
    speedKmh: 27600,
    inclinationDeg: 41.5,
    periodMin: 92.2,
    color: 0xf59e0b,
    phaseOffset: 1.8,
  },
  {
    id: "sat-sbirs-geo-1",
    name: "SBIRS GEO-5 (Defense Early Warning)",
    type: "EARLY_WARNING_SBIRS",
    altitudeKm: 35786,
    speedKmh: 11050,
    inclinationDeg: 0.1,
    periodMin: 1436,
    color: 0xef4444,
    phaseOffset: 0.5,
  },
  {
    id: "sat-gps-iii-1",
    name: "GPS Block III Space Vehicle 04",
    type: "GPS",
    altitudeKm: 20180,
    speedKmh: 13900,
    inclinationDeg: 55.0,
    periodMin: 718,
    color: 0x10b981,
    phaseOffset: 2.4,
  },
  {
    id: "sat-gps-iii-2",
    name: "GPS Block III Space Vehicle 06",
    type: "GPS",
    altitudeKm: 20180,
    speedKmh: 13900,
    inclinationDeg: 55.0,
    periodMin: 718,
    color: 0x10b981,
    phaseOffset: 4.8,
  },
];

/**
 * Generates positions for a Starlink 12-Satellite LEO Train in orbit
 */
export function generateStarlinkTrainPositions(centerPhase: number, radius = 1.08): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const inclinationRad = (53.2 * Math.PI) / 180;
  const count = 12;
  const spacing = 0.04; // small angular spacing between train satellites

  for (let i = 0; i < count; i++) {
    const phase = centerPhase - i * spacing;
    const x = Math.cos(phase) * radius;
    const y = Math.sin(phase) * Math.sin(inclinationRad) * radius;
    const z = Math.sin(phase) * Math.cos(inclinationRad) * radius;
    positions.push([x, y, z]);
  }
  return positions;
}
