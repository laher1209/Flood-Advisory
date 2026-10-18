import http from 'node:http';
import { getIMDWeatherForLocation } from './imdService.js';
import { fetchOpenMeteoData } from './openMeteoService.js';
import { calculateFloodAdvisory } from './floodPredictor.js';
import { IMD_STATIONS } from './imdStations.js';
import { fetchOSMShelters } from './osmService.js';

const PORT = process.env.PORT || 5001;

// Simple in-memory cache: key -> { data, timestamp }
const cache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCacheKey(lat, lon) {
  // Round to ~1km grid
  return `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // 1. Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  // 2. IMD Stations List
  if (pathname === '/api/stations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ stations: IMD_STATIONS }));
    return;
  }

  // Detect Location via IP network fallback
  if (pathname === '/api/detect-location') {
    try {
      const ipRes = await fetch('https://ipwho.is/');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.success) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              lat: ipData.latitude,
              lon: ipData.longitude,
              city: ipData.city || 'Detected Area',
              region: ipData.region,
              country: ipData.country
            })
          );
          return;
        }
      }
    } catch (e) {
      console.warn('Backend IP lookup error:', e.message);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, lat: 28.58, lon: 77.20, city: 'Central Zone' }));
    return;
  }

  // Live OpenStreetMap (OSM) Real Shelters Endpoint
  if (pathname === '/api/shelters') {
    const lat = parseFloat(reqUrl.searchParams.get('lat')) || 28.6139;
    const lon = parseFloat(reqUrl.searchParams.get('lon')) || 77.2090;
    const city = reqUrl.searchParams.get('city') || '';

    const shelterCacheKey = `osm_shelters_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = cache.get(shelterCacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'HIT' });
      res.end(JSON.stringify(cached.data));
      return;
    }

    try {
      const realShelters = await fetchOSMShelters(lat, lon, city);
      const payload = {
        success: true,
        source: 'OpenStreetMap (OSM)',
        count: realShelters.length,
        shelters: realShelters
      };

      if (realShelters.length > 0) {
        cache.set(shelterCacheKey, { data: payload, timestamp: now });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      console.error('[OSM API Error]:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message, shelters: [] }));
    }
    return;
  }

  // 3. Primary Hybrid Weather & Flood Advisory Endpoint
  if (pathname === '/api/weather-advisory') {
    const lat = parseFloat(reqUrl.searchParams.get('lat')) || 28.58;
    const lon = parseFloat(reqUrl.searchParams.get('lon')) || 77.20;
    const locationName = reqUrl.searchParams.get('city') || 'Detected Location';

    const cacheKey = getCacheKey(lat, lon);
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'HIT' });
      res.end(JSON.stringify(cached.data));
      return;
    }

    try {
      // Parallel execution of IMD and Open-Meteo
      const [imdData, openMeteoData] = await Promise.all([
        getIMDWeatherForLocation(lat, lon),
        fetchOpenMeteoData(lat, lon)
      ]);

      const floodAnalysis = calculateFloodAdvisory(imdData, openMeteoData, locationName);

      const payload = {
        success: true,
        generatedAt: new Date().toISOString(),
        location: {
          latitude: lat,
          longitude: lon,
          name: locationName,
          nearestImdStation: {
            id: imdData.nearestStation?.id,
            name: imdData.nearestStation?.name,
            state: imdData.nearestStation?.state,
            distanceKm: imdData.nearestStation?.distanceKm
          }
        },
        current: {
          ...openMeteoData.current,
          imdObservationDate: imdData.observationDate,
          todayMaxTemp: imdData.todayMaxTemp ?? openMeteoData.current.temperature,
          todayMinTemp: imdData.todayMinTemp
        },
        forecast: openMeteoData.forecast,
        floodAdvisory: floodAnalysis
      };

      cache.set(cacheKey, { data: payload, timestamp: now });

      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      console.error('Error generating advisory:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`[FloodSafe Backend] Live on http://localhost:${PORT}`);
  console.log(`[FloodSafe Backend] Endpoints:`);
  console.log(`  - GET /api/weather-advisory?lat=28.58&lon=77.20&city=Delhi`);
  console.log(`  - GET /api/stations`);
  console.log(`  - GET /api/health`);
});
