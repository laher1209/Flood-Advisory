/**
 * Mapbox GL Integration Service
 * Provides high-precision geocoding, real-world road routing, and matrix distances.
 */

import { PreciseAddressResult, ShelterData } from '../types';

export const MAPBOX_ACCESS_TOKEN: string =
  (import.meta as any).env?.VITE_MAPBOX_TOKEN ||
  (import.meta as any).env?.VITE_MAPBOX_API ||
  (import.meta as any).env?.Mapbox_Api ||
  '';

export interface MapboxRouteResult {
  coordinates: [number, number][]; // [longitude, latitude] array for GeoJSON
  distanceMeters: number;
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  steps: {
    instruction: string;
    distanceMeters: number;
    durationSeconds: number;
    modifier?: string;
    type?: string;
  }[];
  summary: string;
}

/**
 * High-precision address search via Mapbox Geocoding API
 */
export async function searchMapboxAddress(
  query: string,
  proximityLat?: number,
  proximityLon?: number
): Promise<PreciseAddressResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query.trim()
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=7`;

    if (proximityLat !== undefined && proximityLon !== undefined) {
      url += `&proximity=${proximityLon},${proximityLat}`;
    }

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.features) return [];

    return data.features.map((feat: any) => {
      const [lon, lat] = feat.center;
      const context = feat.context || [];
      const city = context.find((c: any) => c.id.startsWith('place'))?.text;
      const state = context.find((c: any) => c.id.startsWith('region'))?.text;

      return {
        displayName: feat.place_name,
        shortName: feat.text || feat.place_name.split(',')[0],
        lat,
        lon,
        type: feat.place_type?.[0] || 'place',
        city,
        state
      };
    });
  } catch (err) {
    console.warn('[MapboxService] Geocoding search failed:', err);
    return [];
  }
}

/**
 * Reverse geocode coordinates to exact address using Mapbox
 */
export async function reverseGeocodeMapbox(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address,neighborhood,poi,locality&limit=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
    }
  } catch (err) {
    console.warn('[MapboxService] Reverse geocode failed:', err);
  }
  return `Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
}

/**
 * Computes real street evacuation routing between user and shelter via Mapbox Directions API
 */
export async function getMapboxRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  profile: 'walking' | 'driving' = 'walking'
): Promise<MapboxRouteResult | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLon},${startLat};${endLon},${endLat}?geometries=geojson&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn('[Mapbox Directions] HTTP Error:', res.status);
      return null;
    }

    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;

    const primaryRoute = data.routes[0];
    const distMeters = Math.round(primaryRoute.distance);
    const distKm = parseFloat((distMeters / 1000).toFixed(2));
    const durationMin = Math.max(1, Math.round(primaryRoute.duration / 60));

    const steps = (primaryRoute.legs?.[0]?.steps || []).map((s: any) => ({
      instruction: s.maneuver?.instruction || s.name || 'Continue forward',
      distanceMeters: Math.round(s.distance),
      durationSeconds: Math.round(s.duration),
      modifier: s.maneuver?.modifier,
      type: s.maneuver?.type
    }));

    return {
      coordinates: primaryRoute.geometry.coordinates, // Array of [lon, lat]
      distanceMeters: distMeters,
      distanceKm: distKm,
      durationMinutes: durationMin,
      durationText: durationMin >= 60 ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m` : `${durationMin} mins`,
      steps,
      summary: primaryRoute.legs?.[0]?.summary || `${distKm} km via safest street corridor`
    };
  } catch (err) {
    console.warn('[Mapbox Directions] Route computation failed:', err);
    return null;
  }
}

/**
 * Refines shelter distances with real walking road network distances using Mapbox Matrix API
 */
export async function refineSheltersWithMapboxMatrix(
  userLat: number,
  userLon: number,
  shelters: ShelterData[]
): Promise<ShelterData[]> {
  if (!shelters || shelters.length === 0) return shelters;

  // Filter valid shelters with coordinates
  const validShelters = shelters.filter(
    (s) => typeof s.latitude === 'number' && typeof s.longitude === 'number'
  );
  if (validShelters.length === 0) return shelters;

  // Query up to top 15 shelters to stay well within Matrix limits
  const targetShelters = validShelters.slice(0, 15);
  const coordString = `${userLon},${userLat};${targetShelters
    .map((s) => `${s.longitude},${s.latitude}`)
    .join(';')}`;

  try {
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${coordString}?sources=0&annotations=distance,duration&access_token=${MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);

    if (!res.ok) return shelters;

    const data = await res.json();
    if (!data.distances || !data.distances[0]) return shelters;

    const rowDistances: (number | null)[] = data.distances[0];
    const rowDurations: (number | null)[] = data.durations[0];

    // Create a map of shelter updates
    const updatedMap = new Map<string, { distKm: number; distLabel: string; mins: number }>();

    targetShelters.forEach((shelter, idx) => {
      const distM = rowDistances[idx + 1];
      const durSec = rowDurations[idx + 1];

      if (typeof distM === 'number' && distM > 0) {
        const distKm = parseFloat((distM / 1000).toFixed(1));
        const minsWalk = Math.max(3, Math.round((durSec || distM / 1.3) / 60));
        const distLabel =
          distKm < 1
            ? `${Math.round(distM)} m • ${shelter.direction || 'En route'} (~${minsWalk} min walk)`
            : `${distKm} km • ${shelter.direction || 'En route'} (~${minsWalk} min walk)`;

        updatedMap.set(shelter.id, { distKm, distLabel, mins: minsWalk });
      }
    });

    // Merge and re-sort shelters strictly by true walking distance
    const merged = shelters.map((s) => {
      const update = updatedMap.get(s.id);
      if (update) {
        return {
          ...s,
          distanceKm: update.distKm,
          distance: update.distLabel
        };
      }
      return s;
    });

    merged.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    return merged;
  } catch (err) {
    console.warn('[Mapbox Matrix] Fallback to standard Haversine/OSM:', err);
    return shelters;
  }
}
