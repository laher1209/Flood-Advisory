export type SeverityLevel = 'low' | 'moderate' | 'high' | 'severe' | 'danger' | 'warning' | 'primary';

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  path?: string;
  isActive?: boolean;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  actionText: string;
  actionHref?: string;
  type: 'danger' | 'warning' | 'primary' | 'success';
}

export interface AlertData {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  severity: SeverityLevel;
}

export interface ShelterData {
  id: string;
  name: string;
  distance: string;
  capacity: number;
  isOpen: boolean;
  statusText: string;
}

export interface DayForecast {
  day: string;
  weatherEmoji: string;
  temperature: string;
  condition?: string;
}

export interface EmergencyService {
  id: string;
  title: string;
  description: string;
  phone: string;
  emoji: string;
  themeColor: 'red' | 'emerald' | 'blue';
}

export interface MapMarkerData {
  id: string;
  title: string;
  top: string;
  left?: string;
  right?: string;
  bottom?: string;
  type: 'warning' | 'safe' | 'severe' | 'standard';
  hasPulse?: boolean;
}
