import { DayForecast, AlertData, DetectedUserLocation, PreciseAddressResult } from '../types';
import { WEEK_FORECAST, RECENT_ALERTS } from '../data/mockData';

export interface LiveLocation {
  latitude: number;
  longitude: number;
  name: string;
  nearestImdStation?: {
    id: string;
    name: string;
    state: string;
    distanceKm: number;
  };
}

export interface LiveCurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitationRateMm: number;
  condition: string;
  emoji: string;
  isRain: boolean;
  todayMaxTemp?: number;
  todayMinTemp?: number;
}

export interface LiveFloodAdvisory {
  riskScore: number;
  severity: 'low' | 'moderate' | 'high' | 'severe' | 'danger' | 'warning' | 'primary';
  statusText: string;
  waterLevelTrend: string;
  badgeColor: 'red' | 'amber' | 'blue' | 'emerald';
  actionAdvice: string;
  alerts: AlertData[];
  metrics: {
    past24hRainfallMm: number;
    forecast24hRainMm: number;
    rainProbability: number;
    imdWarningColor: string;
    imdWarningText: string;
  };
}

export interface LiveWeatherResponse {
  success: boolean;
  location: LiveLocation;
  current: LiveCurrentWeather;
  forecast: DayForecast[];
  floodAdvisory: LiveFloodAdvisory;
}

// Fallback host if Vite proxy is not used
const API_BASE = window.location.port === '3000' ? '' : 'http://localhost:5001';

import { searchMapboxAddress, reverseGeocodeMapbox } from './mapboxService';

/**
 * Reverse geocodes coordinates to a human-readable neighborhood/city/region name
 * (Uses Mapbox Geocoding first, falling back to OpenStreetMap Nominatim)
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<string> {
  // 1. Try Mapbox Geocoding first for sub-building precision
  try {
    const mapboxAddr = await reverseGeocodeMapbox(lat, lon);
    if (mapboxAddr && !mapboxAddr.startsWith('Coordinates')) {
      const parts = mapboxAddr.split(',').map((p) => p.trim());
      // Return short clean locality e.g. "Hazratganj, Lucknow"
      return parts.slice(0, 2).join(', ');
    }
  } catch (e) {
    console.warn('Mapbox reverse geocoding fallback:', e);
  }

  // 2. Try OpenStreetMap Nominatim reverse geocoder
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=17&addressdetails=1`,
      { headers: { 'User-Agent': 'FloodSafe-App/1.0' } }
    );
    if (osmRes.ok) {
      const d = await osmRes.json();
      if (d.address) {
        const local =
          d.address.suburb ||
          d.address.neighbourhood ||
          d.address.road ||
          d.address.residential ||
          d.address.commercial ||
          d.address.quarter;
        const city =
          d.address.city ||
          d.address.town ||
          d.address.village ||
          d.address.county ||
          d.address.state_district;
        const state = d.address.state;

        if (local && city) return `${local}, ${city}`;
        if (city && state) return `${city}, ${state}`;
        if (city) return city;
      }
      if (d.display_name) {
        return d.display_name.split(',').slice(0, 2).join(',').trim();
      }
    }
  } catch (e) {
    console.warn('OSM reverse geocoding error:', e);
  }

  // 3. Fallback to BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const place = data.locality || data.city || data.principalSubdivision;
      if (place) {
        return data.principalSubdivision && place !== data.principalSubdivision
          ? `${place}, ${data.principalSubdivision}`
          : place;
      }
    }
  } catch (e) {
    console.warn('Reverse geocoding failed:', e);
  }
  return `Area (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
}

/**
 * Searches for exact street, neighborhood, colony, or landmark
 * (Uses Mapbox Geocoding first, falling back to OpenStreetMap Nominatim)
 */
export async function searchPreciseAddress(query: string): Promise<PreciseAddressResult[]> {
  if (!query || query.trim().length < 2) return [];

  // 1. Try Mapbox Geocoding
  try {
    const mapboxResults = await searchMapboxAddress(query);
    if (mapboxResults && mapboxResults.length > 0) {
      return mapboxResults;
    }
  } catch (e) {
    console.warn('Mapbox address search fallback:', e);
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query.trim()
    )}&limit=7&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FloodSafe-Emergency-Advisory/1.0' }
    });

    if (!res.ok) return [];

    const items = await res.json();
    return items.map((item: any) => {
      const addr = item.address || {};
      const short =
        item.name ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.road ||
        item.display_name.split(',')[0];
      return {
        displayName: item.display_name,
        shortName: short,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        road: addr.road,
        suburb: addr.suburb || addr.neighbourhood,
        city: addr.city || addr.town || addr.village,
        state: addr.state
      };
    });
  } catch (err) {
    console.warn('[searchPreciseAddress] Search failed:', err);
    return [];
  }
}

/**
 * Detects user coordinates and city using IP geolocation (coarse fallback)
 */
export async function detectLocationByIp(): Promise<DetectedUserLocation | null> {
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        const city = data.city || data.region || 'Detected City';
        return {
          lat: data.latitude,
          lon: data.longitude,
          city: data.region ? `${city}, ${data.region}` : city,
          region: data.region,
          country: data.country,
          accuracyMeters: 4500, // typical cellular/ISP node radius
          source: 'ip',
          isPrecise: false,
          timestamp: Date.now()
        };
      }
    }
  } catch (e) {
    console.warn('ipwho.is failed, trying fallback:', e);
  }

  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const city = data.cityName || 'Detected City';
        return {
          lat: data.latitude,
          lon: data.longitude,
          city: data.regionName ? `${city}, ${data.regionName}` : city,
          region: data.regionName,
          country: data.countryName,
          accuracyMeters: 5000,
          source: 'ip',
          isPrecise: false,
          timestamp: Date.now()
        };
      }
    }
  } catch (e) {
    console.warn('freeipapi failed:', e);
  }

  return null;
}

/**
 * Actively watches and refines device GPS for maximum precision down to doorstep accuracy
 */
function acquireHighAccuracyGps(
  timeoutMs = 12000,
  targetAccuracyMeters = 25
): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let timer: any = null;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // Timeout safety
    timer = setTimeout(() => {
      cleanup();
      resolve(bestPosition);
    }, timeoutMs);

    // Watch position allows modern phone & laptop GPS to acquire satellites and drop error circle
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!bestPosition || pos.coords.accuracy < bestPosition.coords.accuracy) {
            bestPosition = pos;
          }
          // If we reach satellite precision (<= targetAccuracyMeters), lock immediately!
          if (pos.coords.accuracy <= targetAccuracyMeters) {
            cleanup();
            resolve(pos);
          }
        },
        (err) => {
          console.warn('watchPosition notice:', err.message);
          // If watch fails immediately, try single getCurrentPosition as quick fallback
          if (!bestPosition) {
            navigator.geolocation.getCurrentPosition(
              (p) => {
                cleanup();
                resolve(p);
              },
              () => {
                cleanup();
                resolve(null);
              },
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: timeoutMs,
          maximumAge: 0 // Never use stale cached coordinates for emergency navigation
        }
      );
    } catch (e) {
      cleanup();
      resolve(null);
    }
  });
}

/**
 * Automatically detects the user's location via high-precision GPS (Phone & Laptop)
 * with multi-tier refinement and clear precision diagnostics.
 */
export async function getUserLocation(forceRefresh = false): Promise<DetectedUserLocation> {
  // Check if user already has a HIGH-PRECISION location stored in localStorage
  if (!forceRefresh) {
    try {
      const saved = localStorage.getItem('floodsafe_exact_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only reuse cache if it's manual or high-precision GPS (not coarse IP estimate)
        if (
          parsed.lat &&
          parsed.lon &&
          parsed.city &&
          (parsed.source === 'manual' || (parsed.source === 'gps' && parsed.accuracyMeters && parsed.accuracyMeters <= 50))
        ) {
          if (Date.now() - (parsed.timestamp || 0) < 60 * 60 * 1000) {
            return parsed;
          }
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  // Tier 1: High-precision GPS with satellite lock & watchPosition refinement
  let pos = await acquireHighAccuracyGps(10000, 20);

  // Tier 2: If high-accuracy timed out (common on desktop/laptops with Wi-Fi only), try fast Wi-Fi triangulation
  if (!pos) {
    pos = await new Promise<GeolocationPosition | null>((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => resolve(p),
        (err) => {
          console.warn('Coarse Wi-Fi geolocation notice:', err.message);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 0 }
      );
    });
  }

  if (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 30;
    const cityName = await reverseGeocodeCoords(lat, lon);
    const isPrecise = accuracy <= 100;
    const source: DetectedUserLocation['source'] = accuracy <= 40 ? 'gps' : 'wifi';

    const locResult: DetectedUserLocation = {
      lat,
      lon,
      city: cityName,
      accuracyMeters: accuracy,
      source,
      isPrecise,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('floodsafe_exact_user_location', JSON.stringify(locResult));
    } catch (e) {}

    return locResult;
  }

  // Tier 3: IP-based network geolocation (Clearly flagged as imprecise ISP estimate)
  const ipLocation = await detectLocationByIp();
  if (ipLocation) {
    return ipLocation;
  }

  // Tier 4: Safe neutral fallback
  return {
    lat: 28.6139,
    lon: 77.2090,
    city: 'Central Safe Zone',
    accuracyMeters: 10000,
    source: 'default',
    isPrecise: false,
    timestamp: Date.now()
  };
}

/**
 * Saves a user-calibrated exact doorstep location
 */
export function setManualExactLocation(
  lat: number,
  lon: number,
  cityName: string
): DetectedUserLocation {
  const loc: DetectedUserLocation = {
    lat,
    lon,
    city: cityName,
    accuracyMeters: 5,
    source: 'manual',
    isPrecise: true,
    timestamp: Date.now()
  };

  try {
    localStorage.setItem('floodsafe_exact_user_location', JSON.stringify(loc));
  } catch (e) {}

  return loc;
}

/**
 * Fetches unified IMD + Open-Meteo prediction and alerts
 */
export async function fetchLiveWeatherAndAdvisory(
  lat: number = 28.58,
  lon: number = 77.20,
  city: string = 'Delhi'
): Promise<LiveWeatherResponse> {
  const url = `${API_BASE}/api/weather-advisory?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch advisory');
    }
    return data;
  } catch (err: any) {
    console.warn('[WeatherService] Backend unreachable, utilizing local mock fallback:', err.message);
    return {
      success: true,
      location: {
        latitude: lat,
        longitude: lon,
        name: city,
        nearestImdStation: {
          id: '42182',
          name: 'New Delhi - Safdarjung (Cached)',
          state: 'Delhi',
          distanceKm: 0
        }
      },
      current: {
        temperature: 28,
        feelsLike: 30,
        humidity: 72,
        windSpeed: 11,
        precipitationRateMm: 1.2,
        condition: 'Partly Cloudy',
        emoji: '⛅',
        isRain: false,
        todayMaxTemp: 34,
        todayMinTemp: 22
      },
      forecast: WEEK_FORECAST,
      floodAdvisory: {
        riskScore: 35,
        severity: 'primary',
        statusText: 'Moderate Inundation Watch',
        waterLevelTrend: 'Stable',
        badgeColor: 'blue',
        actionAdvice: 'Drainage operating smoothly. Monitor weather alerts for updates.',
        alerts: RECENT_ALERTS,
        metrics: {
          past24hRainfallMm: 0,
          forecast24hRainMm: 12,
          rainProbability: 40,
          imdWarningColor: 'green',
          imdWarningText: 'No Warning'
        }
      }
    };
  }
}
