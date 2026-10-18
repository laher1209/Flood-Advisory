import { findNearestStation } from './imdStations.js';

const IMD_API_URL = "https://city.imd.gov.in/citywx/responsive/api/fetchCity_static.php";

/**
 * Fetches IMD weather and alerts for a given station ID
 */
export async function fetchIMDData(stationId) {
  const formData = new FormData();
  formData.append("ID", String(stationId));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(IMD_API_URL, {
      method: "POST",
      headers: {
        "Referer": "https://city.imd.gov.in/citywx/responsive/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`IMD server returned status ${res.status}`);
    }

    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error("Invalid IMD response structure");
    }

    const current = json[0];
    const rainfallVal = parseFloat(current.rainfall) || 0;

    return {
      success: true,
      stationId: current.station_id || stationId,
      stationName: current.station || "IMD Station",
      observationDate: current.dat,
      updatedAt: current.updat,
      past24hRainfallMm: rainfallVal,
      todayMaxTemp: parseFloat(current.max) || null,
      todayMinTemp: parseFloat(current.min) || null,
      humidity0830: parseInt(current.rh0830, 10) || null,
      humidity1730: parseInt(current.rh1730, 10) || null,
      forecastToday: current.forecast0 || "Clear",
      forecast7Days: current.ffc || [],
      forecastMaxTemps: current.fmax || [],
      forecastMinTemps: current.fmin || [],
      warnings: current.wText || ["No Warning"],
      warningColors: current.wColor || ["green"]
    };
  } catch (error) {
    clearTimeout(timeout);
    console.warn(`[IMD Service] Station ${stationId} fetch failed:`, error.message);
    return {
      success: false,
      stationId,
      error: error.message,
      past24hRainfallMm: 0,
      warnings: ["No Warning"],
      warningColors: ["green"]
    };
  }
}

/**
 * Given latitude and longitude, finds nearest IMD station and returns weather + warnings
 */
export async function getIMDWeatherForLocation(lat, lon) {
  const station = findNearestStation(lat, lon);
  const data = await fetchIMDData(station.id);
  return {
    nearestStation: station,
    ...data
  };
}
