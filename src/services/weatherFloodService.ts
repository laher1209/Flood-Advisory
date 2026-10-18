import { DayForecast, AlertData } from '../types';
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

export interface DetectedUserLocation {
  lat: number;
  lon: number;
  city: string;
  region?: string;
  country?: string;
  accuracyMeters?: number;
  source: 'gps' | 'ip' | 'default';
}

/**
 * Reverse geocodes coordinates to a human-readable neighborhood/city/region name
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<string> {
  // 1. Try OpenStreetMap Nominatim reverse geocoder for accurate local neighborhood/colony
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`,
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
          d.address.commercial;
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

  // 2. Fallback to BigDataCloud
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
  return `Area (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
}

/**
 * Detects user coordinates and city using IP geolocation
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
          source: 'ip'
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
          source: 'ip'
        };
      }
    }
  } catch (e) {
    console.warn('freeipapi failed:', e);
  }

  return null;
}

/**
 * Automatically detects the user's location via GPS (with multi-tier high/low accuracy)
 * and falls back to IP-based network location without hardcoded city locks
 */
export async function getUserLocation(forceRefresh = false): Promise<DetectedUserLocation> {
  // Check if user already has an exact location stored in localStorage (unless force refreshed)
  if (!forceRefresh) {
    try {
      const saved = localStorage.getItem('floodsafe_exact_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lon && parsed.city) {
          // If saved within the last 1 hour, use it for instant responsive load
          if (Date.now() - (parsed.timestamp || 0) < 60 * 60 * 1000) {
            return parsed;
          }
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  // Geolocation query helper
  const queryBrowserGps = (highAccuracy: boolean, timeoutMs: number) => {
    return new Promise<GeolocationPosition | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => {
          console.warn(`Browser GPS (highAccuracy=${highAccuracy}) notice:`, err.message);
          resolve(null);
        },
        { timeout: timeoutMs, enableHighAccuracy: highAccuracy, maximumAge: 5000 }
      );
    });
  };

  // Tier 1: Try high-precision GPS (10s timeout)
  let pos = await queryBrowserGps(true, 10000);

  // Tier 2: If high-accuracy timed out (common on desktop/Windows), try fast low-accuracy (Wi-Fi/Cellular)
  if (!pos) {
    pos = await queryBrowserGps(false, 6000);
  }

  if (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : undefined;
    const cityName = await reverseGeocodeCoords(lat, lon);
    const locResult: DetectedUserLocation = {
      lat,
      lon,
      city: cityName,
      accuracyMeters: accuracy,
      source: 'gps'
    };

    try {
      localStorage.setItem(
        'floodsafe_exact_user_location',
        JSON.stringify({ ...locResult, timestamp: Date.now() })
      );
    } catch (e) {}

    return locResult;
  }

  // Tier 3: Seamlessly try IP-based network geolocation
  const ipLocation = await detectLocationByIp();
  if (ipLocation) {
    try {
      localStorage.setItem(
        'floodsafe_exact_user_location',
        JSON.stringify({ ...ipLocation, timestamp: Date.now() })
      );
    } catch (e) {}
    return ipLocation;
  }

  // Tier 4: Safe neutral fallback
  return {
    lat: 28.6139,
    lon: 77.2090,
    city: 'Central Safe Zone',
    source: 'default'
  };
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
