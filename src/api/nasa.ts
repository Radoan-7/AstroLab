/**
 * NASA NEO (Near Earth Object) API Integration
 * Documentation: https://api.nasa.gov/
 * 
 * This file contains working NASA API calls with the provided API key.
 */

const NASA_API_KEY = 'ecG1ia9eClYkh0VZEBxWkY8u8AuSUOYCXshDhsdx';
const NASA_NEO_FEED_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

export interface AsteroidData {
  name: string;
  diameter: number; // meters
  velocity: number; // km/s
  missDistance: number; // kilometers
  impactProbability: number; // percentage (estimated)
  eta: number; // days until close approach
  closeApproachDate: string;
}

/**
 * Fetch real asteroid data from NASA NEO API
 * Returns data for the closest approaching asteroid in the given date range
 */
export async function fetchAsteroidData(): Promise<AsteroidData> {
  try {
    // Get current date and 7 days ahead
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const startDate = today.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];

    const url = `${NASA_NEO_FEED_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();
    const nearEarthObjects = data.near_earth_objects;

    // Find the closest asteroid across all dates
    let closestAsteroid: any = null;
    let closestDistance = Infinity;

    Object.keys(nearEarthObjects).forEach(date => {
      nearEarthObjects[date].forEach((asteroid: any) => {
        const approachData = asteroid.close_approach_data[0];
        const distance = parseFloat(approachData.miss_distance.kilometers);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestAsteroid = {
            ...asteroid,
            approachData
          };
        }
      });
    });

    if (!closestAsteroid) {
      throw new Error('No asteroid data found');
    }

    // Extract relevant data
    const diameter = closestAsteroid.estimated_diameter.meters.estimated_diameter_max;
    const velocity = parseFloat(closestAsteroid.approachData.relative_velocity.kilometers_per_second);
    const missDistance = parseFloat(closestAsteroid.approachData.miss_distance.kilometers);
    const closeApproachDate = closestAsteroid.approachData.close_approach_date;

    // Calculate days until approach
    const approachDate = new Date(closeApproachDate);
    const daysUntil = Math.ceil((approachDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Estimate impact probability (for game purposes)
    // Real NASA doesn't provide this directly - we calculate based on miss distance
    const earthRadius = 6371; // km
    const impactProbability = missDistance < earthRadius * 100 
      ? Math.max(0, 100 - (missDistance / (earthRadius * 100)) * 100)
      : 0;

    return {
      name: closestAsteroid.name.replace(/[()]/g, ''),
      diameter: Math.round(diameter),
      velocity: Math.round(velocity * 10) / 10,
      missDistance: Math.round(missDistance),
      impactProbability: Math.round(impactProbability),
      eta: daysUntil,
      closeApproachDate
    };

  } catch (error) {
    console.error('Error fetching NASA data:', error);
    
    // Fallback to dramatic mock data for gameplay
    return {
      name: 'IMPACTOR-2025',
      diameter: 780,
      velocity: 25.3,
      missDistance: 0,
      impactProbability: 87,
      eta: 183,
      closeApproachDate: new Date(Date.now() + 183 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }
}

/**
 * Calculate impact energy from asteroid parameters
 * E = 0.5 * m * v^2
 */
export function calculateImpactEnergy(diameter: number, velocity: number): number {
  // Assume asteroid density of 2500 kg/m³
  const radius = diameter / 2;
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * 2500; // kg
  const velocityMs = velocity * 1000; // convert to m/s
  
  const energy = 0.5 * mass * Math.pow(velocityMs, 2); // joules
  return energy;
}
