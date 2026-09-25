import {
  NavItem,
  MetricCardData,
  AlertData,
  ShelterData,
  DayForecast,
  EmergencyService,
  MapMarkerData
} from '../types';

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard', isActive: true },
  { id: 'map', label: 'Map View', iconName: 'map' },
  { id: 'alerts', label: 'Alerts', iconName: 'alert' },
  { id: 'shelters', label: 'Shelters Nearby', iconName: 'shelter' },
  { id: 'route', label: 'Best Route', iconName: 'route' },
  { id: 'forecast', label: 'Forecast', iconName: 'forecast' },
  { id: 'risk-zones', label: 'Risk Zones', iconName: 'risk' },
  { id: 'emergency', label: 'Emergency Info', iconName: 'info' },
  { id: 'settings', label: 'Settings', iconName: 'settings' }
];

export const METRIC_CARDS: MetricCardData[] = [
  {
    id: 'active-alerts',
    title: 'Active Alerts',
    value: 3,
    actionText: 'View all',
    actionHref: '#',
    type: 'danger'
  },
  {
    id: 'affected-areas',
    title: 'Affected Areas',
    value: 5,
    actionText: 'View on Map',
    actionHref: '#',
    type: 'warning'
  },
  {
    id: 'rising-water',
    title: 'Rising Water Levels',
    value: 2,
    actionText: 'Check Details',
    actionHref: '#',
    type: 'primary'
  },
  {
    id: 'safe-zones',
    title: 'Safe Zones',
    value: 12,
    actionText: 'View Locations',
    actionHref: '#',
    type: 'success'
  }
];

export const MAP_MARKERS: MapMarkerData[] = [
  {
    id: 'riverside',
    title: 'Riverside',
    top: '5rem',
    left: '7rem',
    type: 'warning'
  },
  {
    id: 'green-park',
    title: 'Green Park',
    top: '4rem',
    right: '9rem',
    type: 'safe'
  },
  {
    id: 'hazard-hotspot',
    title: 'High Hazard Zone',
    top: '11rem',
    left: '18rem',
    type: 'severe',
    hasPulse: true
  },
  {
    id: 'sunset-colony',
    title: 'Sunset Colony',
    bottom: '7rem',
    left: '10rem',
    type: 'standard'
  },
  {
    id: 'kailash-nagar',
    title: 'Kailash Nagar',
    bottom: '3rem',
    right: '12rem',
    type: 'standard'
  }
];

export const RECENT_ALERTS: AlertData[] = [
  {
    id: 'alert-1',
    title: 'High Water Level Alert',
    location: 'Riverside Area',
    timeAgo: '2 hours ago',
    severity: 'danger' as const
  },
  {
    id: 'alert-2',
    title: 'Flash Flood Warning',
    location: 'Green Park',
    timeAgo: '4 hours ago',
    severity: 'warning' as const
  },
  {
    id: 'alert-3',
    title: 'Heavy Rainfall Forecast',
    location: 'Kailash Nagar',
    timeAgo: '6 hours ago',
    severity: 'primary' as const
  },
  {
    id: 'alert-4',
    title: 'River Level Rising',
    location: 'Main River (Sector 3)',
    timeAgo: '8 hours ago',
    severity: 'moderate' as const
  }
];

export const WEEK_FORECAST: DayForecast[] = [
  { day: 'Mon', weatherEmoji: '🌧️', temperature: '28°', condition: 'Rain' },
  { day: 'Tue', weatherEmoji: '⛈️', temperature: '27°', condition: 'Thunderstorm' },
  { day: 'Wed', weatherEmoji: '🌦️', temperature: '26°', condition: 'Showers' },
  { day: 'Thu', weatherEmoji: '🌧️', temperature: '25°', condition: 'Heavy Rain' },
  { day: 'Fri', weatherEmoji: '⛅', temperature: '24°', condition: 'Partly Cloudy' },
  { day: 'Sat', weatherEmoji: '🌤️', temperature: '26°', condition: 'Mostly Sunny' },
  { day: 'Sun', weatherEmoji: '☀️', temperature: '27°', condition: 'Clear Sky' }
];

export const SHELTERS_LIST: ShelterData[] = [
  {
    id: 'shelter-1',
    name: 'Government High School',
    distance: '1.2 km away',
    capacity: 200,
    isOpen: true,
    statusText: 'Open & Safe'
  },
  {
    id: 'shelter-2',
    name: 'Community Hall Center',
    distance: '2.8 km away',
    capacity: 150,
    isOpen: true,
    statusText: 'Open & Safe'
  }
];

export const EMERGENCY_SERVICES: EmergencyService[] = [
  {
    id: 'disaster',
    title: 'Disaster Helpline',
    description: 'Toll-free emergency dial',
    phone: '112',
    emoji: '🚨',
    themeColor: 'red'
  },
  {
    id: 'medical',
    title: 'Medical Evacuation',
    description: 'Ambulance & paramedic unit',
    phone: '108',
    emoji: '🚑',
    themeColor: 'emerald'
  },
  {
    id: 'boat',
    title: 'Flood Boat Rescue',
    description: 'Water rescue operations team',
    phone: '1077',
    emoji: '🚤',
    themeColor: 'blue'
  }
];
