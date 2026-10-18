/**
 * WMO Weather interpretation codes (WW)
 */
function decodeWmoCode(code) {
  if (code === 0) return { condition: "Clear Sky", emoji: "☀️", isRain: false };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy", emoji: "⛅", isRain: false };
  if (code === 3) return { condition: "Overcast", emoji: "☁️", isRain: false };
  if (code === 45 || code === 48) return { condition: "Foggy", emoji: "🌫️", isRain: false };
  if (code >= 51 && code <= 55) return { condition: "Drizzle", emoji: "🌦️", isRain: true };
  if (code >= 61 && code <= 63) return { condition: "Moderate Rain", emoji: "🌧️", isRain: true };
  if (code >= 65) return { condition: "Heavy Rain", emoji: "⛈️", isRain: true };
  if (code >= 80 && code <= 82) return { condition: "Rain Showers", emoji: "🌧️", isRain: true };
  if (code >= 95 && code <= 99) return { condition: "Thunderstorm with Heavy Rain", emoji: "⛈️", isRain: true };
  return { condition: "Scattered Clouds", emoji: "🌤️", isRain: false };
}

/**
 * Fetches real-time weather and forecast from Open-Meteo
 */
export async function fetchOpenMeteoData(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max");
  url.searchParams.set("models", "ecmwf_ifs025");
  url.searchParams.set("timezone", "Asia/Kolkata");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const cur = data.current || {};
    const daily = data.daily || {};
    const curWeather = decodeWmoCode(cur.weather_code);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekForecast = (daily.time || []).map((dateStr, i) => {
      const d = new Date(dateStr);
      const dayName = dayNames[d.getDay()];
      const weather = decodeWmoCode(daily.weather_code?.[i] ?? 0);
      return {
        date: dateStr,
        day: dayName,
        weatherEmoji: weather.emoji,
        temperature: `${Math.round(daily.temperature_2m_max?.[i] ?? 28)}°`,
        minTemp: `${Math.round(daily.temperature_2m_min?.[i] ?? 20)}°`,
        condition: weather.condition,
        precipitationMm: daily.precipitation_sum?.[i] ?? 0,
        rainProbability: daily.precipitation_probability_max?.[i] ?? 0
      };
    });

    return {
      success: true,
      current: {
        temperature: Math.round(cur.temperature_2m ?? 28),
        feelsLike: Math.round(cur.apparent_temperature ?? 28),
        humidity: Math.round(cur.relative_humidity_2m ?? 65),
        windSpeed: Math.round(cur.wind_speed_10m ?? 12),
        precipitationRateMm: cur.precipitation ?? 0,
        weatherCode: cur.weather_code ?? 0,
        condition: curWeather.condition,
        emoji: curWeather.emoji,
        isRain: curWeather.isRain
      },
      forecast: weekForecast
    };
  } catch (error) {
    clearTimeout(timeout);
    console.warn(`[Open-Meteo Service] Coordinate (${lat}, ${lon}) fetch failed:`, error.message);
    return {
      success: false,
      error: error.message,
      current: {
        temperature: 28,
        feelsLike: 29,
        humidity: 68,
        windSpeed: 10,
        precipitationRateMm: 0,
        condition: "Partly Cloudy",
        emoji: "⛅",
        isRain: false
      },
      forecast: []
    };
  }
}
