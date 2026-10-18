// List of key IMD stations across states in India
export const IMD_STATIONS = [
  { id: "42182", name: "New Delhi - Safdarjung", state: "Delhi", lat: 28.58, lon: 77.20 },
  { id: "42181", name: "New Delhi - Palam", state: "Delhi", lat: 28.56, lon: 77.10 },
  { id: "42099", name: "Ludhiana", state: "Punjab", lat: 30.90, lon: 75.85 },
  { id: "42071", name: "Amritsar", state: "Punjab", lat: 31.63, lon: 74.87 },
  { id: "42111", name: "Dehradun", state: "Uttarakhand", lat: 30.31, lon: 78.03 },
  { id: "42027", name: "Srinagar", state: "Jammu and Kashmir", lat: 34.08, lon: 74.79 },
  { id: "42147", name: "Chandigarh", state: "Chandigarh", lat: 30.73, lon: 76.77 },
  { id: "42348", name: "Jaipur", state: "Rajasthan", lat: 26.91, lon: 75.78 },
  { id: "42410", name: "Guwahati", state: "Assam", lat: 26.14, lon: 91.73 },
  { id: "42492", name: "Patna", state: "Bihar", lat: 25.59, lon: 85.13 },
  { id: "42807", name: "Kolkata - Alipore", state: "West Bengal", lat: 22.53, lon: 88.33 },
  { id: "43003", name: "Mumbai - Santacruz", state: "Maharashtra", lat: 19.07, lon: 72.87 },
  { id: "43063", name: "Pune", state: "Maharashtra", lat: 18.52, lon: 73.85 },
  { id: "42647", name: "Ahmedabad", state: "Gujarat", lat: 23.02, lon: 72.57 },
  { id: "42867", name: "Nagpur", state: "Maharashtra", lat: 21.14, lon: 79.08 },
  { id: "43128", name: "Hyderabad", state: "Telangana", lat: 17.38, lon: 78.48 },
  { id: "43279", name: "Chennai - Meenambakkam", state: "Tamil Nadu", lat: 12.99, lon: 80.18 },
  { id: "43295", name: "Bengaluru", state: "Karnataka", lat: 12.97, lon: 77.59 },
  { id: "43371", name: "Thiruvananthapuram", state: "Kerala", lat: 8.52, lon: 76.93 },
  { id: "43314", name: "Kochi", state: "Kerala", lat: 9.93, lon: 76.26 },
  { id: "42971", name: "Bhubaneswar", state: "Odisha", lat: 20.29, lon: 85.82 },
  { id: "42154", name: "Mohali", state: "Punjab", lat: 30.71, lon: 76.81 },
  { id: "42239", name: "Lucknow", state: "Uttar Pradesh", lat: 26.84, lon: 80.91 }
];

/**
 * Calculates Haversine distance in kilometers between two lat/lon points
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest IMD station to given coordinates
 */
export function findNearestStation(lat, lon) {
  let nearest = IMD_STATIONS[0];
  let minDistance = Infinity;

  for (const station of IMD_STATIONS) {
    const dist = haversineDistance(lat, lon, station.lat, station.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...station, distanceKm: Math.round(dist * 10) / 10 };
    }
  }

  return nearest;
}
