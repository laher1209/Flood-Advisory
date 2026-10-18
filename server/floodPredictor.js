/**
 * Hybrid Flood Risk and Alert Predictor Engine
 * Blends IMD Ground Truth + Open-Meteo Forecast
 */
export function calculateFloodAdvisory(imdData, openMeteoData, userLocationName = "Your Area") {
  const imdRain24h = imdData.past24hRainfallMm || 0;
  const imdColor = (imdData.warningColors?.[0] || "green").toLowerCase();
  const imdWarningText = imdData.warnings?.[0] || "No Warning";

  const next24hForecastRain = openMeteoData.forecast?.[0]?.precipitationMm || 0;
  const rainProb = openMeteoData.forecast?.[0]?.rainProbability || 0;
  const currentRainRate = openMeteoData.current?.precipitationRateMm || 0;

  // Weighted Risk Score Calculation (0 to 100)
  let riskScore = 0;

  // 1. Past 24h physical rainfall (Soil saturation index)
  if (imdRain24h > 150) riskScore += 45;      // Extremely heavy rainfall
  else if (imdRain24h > 70) riskScore += 35; // Heavy rainfall
  else if (imdRain24h > 35) riskScore += 20; // Moderate rainfall
  else if (imdRain24h > 10) riskScore += 10;

  // 2. Forecasted incoming rain (Accumulation pressure)
  if (next24hForecastRain > 50 || rainProb > 80) riskScore += 30;
  else if (next24hForecastRain > 25 || rainProb > 60) riskScore += 20;
  else if (next24hForecastRain > 10 || rainProb > 40) riskScore += 10;

  // 3. IMD Official Warning Level Override / Weight
  if (imdColor === "red") riskScore = Math.max(riskScore + 35, 80);
  else if (imdColor === "orange") riskScore = Math.max(riskScore + 25, 55);
  else if (imdColor === "yellow") riskScore = Math.max(riskScore + 15, 30);

  // Normalize score
  riskScore = Math.min(Math.round(riskScore), 100);

  // Determine Severity and Water Level Status
  let severity = "low";
  let statusText = "Safe & Normal";
  let waterLevelTrend = "Stable";
  let badgeColor = "emerald";

  if (riskScore >= 75) {
    severity = "danger";
    statusText = "Severe Flood Risk";
    waterLevelTrend = "Dangerously Rising";
    badgeColor = "red";
  } else if (riskScore >= 50) {
    severity = "warning";
    statusText = "Moderate Inundation Watch";
    waterLevelTrend = "Rising";
    badgeColor = "amber";
  } else if (riskScore >= 25) {
    severity = "primary";
    statusText = "Wet Weather / Minor Runoff";
    waterLevelTrend = "Slight Rise";
    badgeColor = "blue";
  }

  // Active Alerts Generator
  const alerts = [];

  if (imdColor === "red" || imdColor === "orange" || riskScore >= 50) {
    alerts.push({
      id: "live-imd-alert",
      title: `IMD ${imdColor.toUpperCase()} Alert: ${imdWarningText}`,
      location: `${imdData.stationName || userLocationName}`,
      timeAgo: "Live Ground Feed",
      severity: riskScore >= 75 ? "danger" : "warning",
      details: `Recorded ${imdRain24h} mm rainfall in past 24 hours. High water logging risk in low-lying sectors.`
    });
  }

  if (next24hForecastRain > 20 || rainProb > 70) {
    alerts.push({
      id: "live-rainfall-forecast",
      title: `High Precipitation Warning (${next24hForecastRain} mm expected)`,
      location: userLocationName,
      timeAgo: "Predictive Model",
      severity: "primary",
      details: `${rainProb}% probability of intense rain spells today.`
    });
  }

  // If no high alerts, provide baseline safety advisory
  if (alerts.length === 0) {
    alerts.push({
      id: "normal-status",
      title: "Normal Hydrological Activity",
      location: userLocationName,
      timeAgo: "Just now",
      severity: "moderate",
      details: "Water discharge and drainage channels operating within safe parameters."
    });
  }

  // Actionable instruction
  let actionAdvice = "No immediate flood threat in your sector. Keep emergency numbers saved.";
  if (riskScore >= 75) {
    actionAdvice = "High flood warning! Avoid riverbanks, underground subways, and seek higher ground or designated shelters if needed.";
  } else if (riskScore >= 50) {
    actionAdvice = "Localized waterlogging possible in drainage basins. Plan alternative travel routes.";
  }

  return {
    riskScore,
    severity,
    statusText,
    waterLevelTrend,
    badgeColor,
    actionAdvice,
    alerts,
    metrics: {
      past24hRainfallMm: imdRain24h,
      forecast24hRainMm: next24hForecastRain,
      rainProbability: rainProb,
      currentRainRateMm: currentRainRate,
      imdWarningColor: imdColor,
      imdWarningText
    }
  };
}
