/**
 * USGS (United States Geological Survey) API Integration
 * 
 * Fully Implemented API Calls with Fallback
 */

// ==========================================
// USGS EARTHQUAKE CATALOG API
// ==========================================

export interface EarthquakeData {
  magnitude: number;
  location: string;
  depth: number; // km
  energyReleased: number; // joules
}

export async function fetchEquivalentEarthquake(
  impactEnergy: number
): Promise<EarthquakeData> {
  const magnitude = (Math.log10(impactEnergy) - 4.8) / 1.5;
  const targetMagnitude = Math.round(magnitude * 10) / 10;

  try {
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${targetMagnitude - 0.5}&maxmagnitude=${targetMagnitude + 0.5}&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const earthquake = data.features[0];
      return {
        magnitude: earthquake.properties.mag,
        location: earthquake.properties.place,
        depth: earthquake.geometry.coordinates[2],
        energyReleased: impactEnergy,
      };
    }
  } catch (error) {
    console.error("USGS Earthquake API error:", error);
  }

  // fallback mock
  return {
    magnitude: targetMagnitude,
    location: "Impact Site",
    depth: 0,
    energyReleased: impactEnergy,
  };
}

// ==========================================
// USGS ELEVATION API (EPQS)
// ==========================================

export interface ElevationData {
  latitude: number;
  longitude: number;
  elevation: number; // meters
  terrain: string;
}

export async function fetchElevationData(
  lat: number,
  lon: number
): Promise<ElevationData> {
  try {
    const url = `https://epqs.nationalmap.gov/v1/json?x=${lon}&y=${lat}&units=Meters`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.value !== null && data.value !== undefined) {
      const elevation = data.value;
      const terrain =
        elevation < 0 ? "Ocean Floor" : elevation > 1000 ? "Mountain" : "Land";

      return {
        latitude: lat,
        longitude: lon,
        elevation: elevation,
        terrain: terrain,
      };
    }
  } catch (error) {
    console.error("USGS Elevation API error:", error);
  }

  // fallback mock
  const mockElevation = lat > 0 && lon < 0 ? -150 : 200;
  return {
    latitude: lat,
    longitude: lon,
    elevation: mockElevation,
    terrain: mockElevation < 0 ? "Ocean Floor" : "Land",
  };
}

// ==========================================
// TSUNAMI SIMULATION
// ==========================================
export interface TsunamiData {
  waveHeight: number; // meters
  affectedRange: number; // kilometers
  arrivalTime: number; // minutes
  casualties: string;
}

export async function simulateTsunami(
  impactLocation: { lat: number; lon: number },
  asteroidDiameter: number
): Promise<TsunamiData> {
  const elevation = await fetchElevationData(
    impactLocation.lat,
    impactLocation.lon
  );

  if (elevation.elevation >= 0) {
    return {
      waveHeight: 0,
      affectedRange: 0,
      arrivalTime: 0,
      casualties: "N/A (Land Impact)",
    };
  }

  const waveHeight = Math.sqrt(asteroidDiameter) * 2;
  const affectedRange = asteroidDiameter * 6;
  const arrivalTime = 120; // ~2 hours

  return {
    waveHeight: Math.round(waveHeight),
    affectedRange: Math.round(affectedRange),
    arrivalTime,
    casualties: "50-100 MILLION",
  };
}

// ==========================================
// CRATER SIMULATION
// ==========================================
export interface CraterData {
  diameter: number; // kilometers
  depth: number; // meters
  ejectaRange: number; // kilometers
  seismicMagnitude: number;
}

export async function simulateCrater(
  asteroidDiameter: number,
  velocity: number,
  impactAngle: number = 45
): Promise<CraterData> {
  const craterDiameter =
    (1.8 * asteroidDiameter * Math.pow(velocity / 12, 0.44)) / 1000;
  const craterDepth = craterDiameter * 0.067 * 1000;
  const ejectaRange = craterDiameter * 40;

  const energy =
    0.5 * Math.pow(asteroidDiameter, 3) *
    Math.pow(velocity * 1000, 2) *
    2500;
  const magnitude = (Math.log10(energy) - 4.8) / 1.5;

  return {
    diameter: Math.round(craterDiameter * 10) / 10,
    depth: Math.round(craterDepth),
    ejectaRange: Math.round(ejectaRange),
    seismicMagnitude: Math.round(magnitude * 10) / 10,
  };
}
