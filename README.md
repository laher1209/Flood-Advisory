# FloodSafe Cross-Platform React + TSX Application

This project converts the original monolithic HTML templates into a modular, production-ready **React 18 + TypeScript (TSX) + CSS** architecture while preserving 100% of the UI design, SVG vector paths, and interactive functions.

---

## 📁 Project Architecture & Components Breakdown

### 🖥️ 1. Web Dashboard Components (`src/components/web/`)

| Original HTML Section | React Component (`.tsx`) | Description & Preserved Functionality |
| :--- | :--- | :--- |
| `<!-- LeftSidebar -->` | [`LeftSidebar.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/LeftSidebar.tsx) | Brand logo, active state navigation links with SVGs, and "You are Safe" status card. |
| `<!-- TopHeader -->` | [`TopHeader.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/TopHeader.tsx) | Live search input, date/time info, weather widget mini (28°C), notification dropdown popover with badge counter, and user profile avatar. |
| `<!-- WelcomeAndGreeting -->` | [`GreetingSection.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/GreetingSection.tsx) | Personalized greeting ("Good Morning, Adeel 👋") and subheader. |
| `<!-- StatCardsRow -->` | [`StatCardsRow.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/StatCardsRow.tsx) | Active Alerts (3), Affected Areas (5), Rising Water (2), Safe Zones (12) metric cards with action links. |
| `<!-- Map View Widget -->` | [`MapView.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/MapView.tsx) | Map View / Satellite toggle, River Ganga canvas path, flood hazard radar heatmap, road route SVG, location markers with pulse, zoom controls (+/-), and Risk Level legend. |
| `<!-- Recent Alerts -->` | [`RecentAlerts.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/RecentAlerts.tsx) | Real-time flood warning cards with severity-based icons and timestamps. |
| `<!-- 7-Day Forecast -->` | [`ForecastSection.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/ForecastSection.tsx) | 7-day mini forecast weather cards (Mon-Sun) with temperature badges and weather emojis. |
| `<!-- Shelter Finder -->` | [`NearestShelters.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/NearestShelters.tsx) | Evacuation shelter directory (Govt High School, Community Hall) with distance, capacity, open status, and Route button. |
| `<!-- Evacuation Route Planner -->`| [`RoutePlanner.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/RoutePlanner.tsx) | Origin/Destination waypoint tracking, high-ground route recommendation (6 min), and interactive safe navigation trigger. |
| `<!-- Emergency Helpline -->` | [`EmergencyContacts.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/EmergencyContacts.tsx) | 24/7 Hotlines with one-click direct dialing (`tel:112`, `tel:108`, `tel:1077`). |
| **Complete Assembly** | [`WebDashboard.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/web/WebDashboard.tsx) | Complete responsive desktop dashboard container. |

---

### 📱 2. Android Mobile App Components (`src/components/mobile/`)

| Original HTML Section | React Component (`.tsx`) | Description & Preserved Functionality |
| :--- | :--- | :--- |
| `<!-- MobileStatusBar -->` | [`MobileStatusBar.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileStatusBar.tsx) | Native status bar: 9:41 time, cellular signal, Wi-Fi, battery indicator. |
| `<!-- TopAppBar -->` | [`MobileTopBar.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileTopBar.tsx) | Gradient brand logo, "FloodSafe", notification bell with red badge. |
| `<!-- UserGreetingSection -->` | [`MobileGreeting.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileGreeting.tsx) | Greeting header + interactive Location selector pill ("Ludhiana, Punjab"). |
| `<!-- QuickActionsGrid -->` | [`MobileQuickMetrics.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileQuickMetrics.tsx) | 2x2 status grid (Alerts: 3 Active, Shelters: 2 Nearby, Forecast: Rain Likely, Safe Zones: 12). |
| `<!-- RecentAlertsSection -->` | [`MobileAlerts.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileAlerts.tsx) | Mobile alert cards with high water level and flash flood warnings. |
| `<!-- EvacuationMapPreview -->`| [`MobileMapPreview.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileMapPreview.tsx) | Stylized city & hazard SVG map, waypoint pins, safe route path, and "Explore Map" button. |
| `<!-- BottomNavigation -->` | [`MobileBottomNav.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileBottomNav.tsx) | Bottom navigation bar with Home, Map, Shelters, Alerts, and More tabs. |
| **Complete Assembly** | [`MobileApp.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/components/mobile/MobileApp.tsx) | Complete smartphone frame mockup shell with mobile styling and active tabs. |

---

### 🎨 3. Styling & CSS Architecture (`src/styles/`)

- [`src/styles/map.css`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/styles/map.css): Contains the `.map-canvas-bg` grid pattern, the `.river-path` gradient animation, and the `.heatmap-severe` radial gradient danger zone.
- [`src/styles/dashboard.css`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/styles/dashboard.css): Contains custom scrollbars and backdrop blur helpers.
- [`src/styles/mobile.css`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/styles/mobile.css): Contains mobile viewport scrollbar suppression and phone shell styles.
- [`src/index.css`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/index.css): Plus Jakarta Sans font import and base reset.

---

### 🚀 4. How to Use & Import

You can import individual components or whole dashboards using the barrel export:

```tsx
import { 
  WebDashboard, 
  MobileApp, 
  MapView, 
  RecentAlerts 
} from './components';

export function MyPage() {
  return <WebDashboard />;
}
```

Or switch between views with [`App.tsx`](file:///c:/Users/HP/OneDrive/Documents/stitch_cross_platform_tsx_app/src/App.tsx) which includes a top controller offering:
1. **Web Dashboard** (Desktop view)
2. **Android Mobile** (Phone mockup shell)
3. **Dual View** (Both side-by-side)
