# GTFS Departure Board

A real-time transit departure board built with Vite, React, TypeScript, and TailwindCSS v3. It displays upcoming departures for specified GTFS stops with real-time updates and multi-language support.

## Features

- **URL Builder**: Interactive form to build configuration URLs with live preview
- **Real-time Departures**: Shows upcoming departures for multiple stops with GTFS-RT integration
- **Route Display**: Route icons with GTFS-defined colors and text
- **Smart Time Display**: Shows minutes for departures < 60 minutes, HH:MM format otherwise
- **Multi-language Support**: English, French, Spanish, and German (EN, FR, ES, DE) using react-i18next
- **Alerts Panel**: Optional panel showing relevant service alerts
- **Technical Details Panel**: Optional panel showing timezone, agency name, and last render time
- **Theme Customization**: Configurable primary and secondary colors via URL parameters
- **Auto-refresh**: Configurable refresh interval for real-time updates
- **localStorage Persistence**: Configuration settings saved in browser
- **Mobile Responsive**: Fully responsive design with Tailwind CSS
- **GitHub Pages Deployment**: Automated deployment via GitHub Actions

## Project Structure

```
gtfs-sqljs-departures/
├── src/
│   ├── components/
│   │   ├── AlertsPanel.tsx            # Service alerts display
│   │   ├── DepartureBoard.tsx         # Main departure board container
│   │   ├── DepartureRow.tsx           # Individual route departure row
│   │   ├── DepartureSquare.tsx        # Departure time display
│   │   ├── HelpMessage.tsx            # URL parameter help screen (legacy)
│   │   ├── RouteIcon.tsx              # Route badge with GTFS colors
│   │   ├── SplashScreen.tsx           # Loading screen
│   │   ├── TechnicalDetailsPanel.tsx  # Technical info panel
│   │   └── URLBuilder.tsx             # Interactive URL builder with preview
│   ├── hooks/
│   │   ├── useAlerts.ts               # Alerts data fetching
│   │   ├── useDepartures.ts           # Departure data processing
│   │   └── useGtfs.ts                 # GTFS data loading
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   ├── utils/
│   │   ├── proxy.ts                   # URL proxy for CORS
│   │   ├── timeFormat.ts              # Time formatting utilities
│   │   └── urlParams.ts               # URL parameter parsing
│   ├── i18n/
│   │   └── i18n.ts                    # i18n configuration
│   ├── locales/
│   │   ├── en.json                    # English translations
│   │   ├── fr.json                    # French translations
│   │   ├── es.json                    # Spanish translations
│   │   └── de.json                    # German translations
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Tailwind CSS imports
├── .github/workflows/
│   └── deploy.yml                     # GitHub Pages deployment
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## URL Builder

The application includes an interactive URL builder that makes it easy to configure your departure board:

- **Access**: Navigate to the site without parameters or add `?builder` to any URL
- **Features**:
  - Form-based configuration with validation
  - Language selector (EN, FR, ES, DE)
  - Quick start presets (e.g., Car Jaune)
  - Technical details toggle with trip short name display
  - Color theme customization with visual pickers
  - Live preview of the departure board
  - Copy generated URL to clipboard
  - Navigate directly to configured departure board
  - Configuration persisted in localStorage

## URL Parameters

The application is configured entirely through URL parameters:

### Required Parameters

- `gtfsUrl` - URL to GTFS static feed (ZIP file)
- `stops` - Comma-separated stop IDs (e.g., `1001,1002,1003`)

### Optional Parameters

- `gtfsRtUrls` - Comma-separated GTFS-RT feed URLs for realtime updates
- `showAlerts` - Set to `true` to display the alerts panel
- `refresh` - Refresh interval in seconds (default: 20)
- `lang` - Language code: `en`, `fr`, `es`, or `de` (default: browser language)
- `tech` - Set to `true` to show technical details panel and trip short names
- `primaryColor` - Primary theme color as hex without # (default: `3b82f6`)
- `secondaryColor` - Secondary theme color as hex without # (default: `f97316`)
- `builder` - Show the URL builder interface

### Example URL

```
https://example.com/?gtfsUrl=https://pysae.com/api/v2/groups/car-jaune/gtfs/pub&gtfsRtUrls=https://pysae.com/api/v2/groups/car-jaune/gtfs-rt&stops=1001,1002,1003&showAlerts=true&refresh=20&lang=fr&tech=true&primaryColor=3b82f6&secondaryColor=f97316
```

## Key Technologies

### Core Dependencies

- **React 18.3+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS v3** - Utility-first CSS framework
- **react-i18next** - Internationalization framework
- **gtfs-sqljs** - GTFS data parsing and querying (installed from GitHub main branch)
- **sql.js** - SQLite in the browser
- **date-fns** - Date/time formatting and manipulation
- **date-fns-tz** - Timezone support

## Development

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Architecture

### Data Flow

1. **URL Parsing** (`urlParams.ts`): Extracts configuration from URL parameters
2. **GTFS Loading** (`useGtfs.ts`): Loads GTFS static data and GTFS-RT feeds via proxy
   - Skips `fare_attributes.txt` and `shapes.txt` for faster loading
3. **Departure Processing** (`useDepartures.ts`):
   - Fetches stop times for current day
   - Joins with trips and routes data
   - Groups by (route, direction)
   - Sorts by route sort order, then route name
   - Marks last departures
4. **Real-time Updates**:
   - GTFS-RT data refreshed every 30 seconds
   - Departure board refreshed based on `refresh` parameter
   - Time display updates every second

### Proxy Server

All remote GTFS URLs are automatically proxied through `https://gtfs-proxy.sys-dev-run.re/proxy/` to handle CORS restrictions.

### Time Display Logic

- Departures ≤ 59 minutes: Shows "X'" with HH:MM below
- Departures > 59 minutes: Shows HH:MM only
- Always uses timezone from first GTFS agency

### Route Sorting

Routes are sorted by:
1. `route_sort_order` (ascending, defaults to 999999 if not present)
2. `route_short_name` (alphabetical)

### Headsign Display

For each (route, direction_id) pair, the unique headsigns from all trips are collected and the first one is displayed next to the route icon.

## CRITICAL: Timezone Handling

**All time operations MUST use the agency timezone, NOT the browser timezone.**

### The Timezone Problem

GTFS feeds contain times in the agency's local timezone. Users viewing the departure board may be in a different timezone. If times are created in the browser timezone, calculations will be incorrect, leading to bugs such as:

- Negative departure times (e.g., "-168' 16:46")
- Departures showing incorrectly as passed when they haven't
- Wrong filtering of today's departures

### Example Bug Scenario

**Incorrect approach:**
```typescript
// ❌ WRONG: Creates time in browser timezone
const departureDate = new Date(now)
departureDate.setHours(16, 46, 0, 0)  // Creates 16:46 in BROWSER timezone
```

**Bug manifestation:**
- User in UTC+4 at 22:34 local time
- Agency in UTC+1
- Departure at 16:46 agency time
- Browser creates 16:46 in UTC+4 = 13:46 in UTC+1 (agency time)
- 13:46 has already passed in agency timezone (current: ~19:34 in UTC+1)
- Result: Shows "-168' 16:46" (negative time)

### Correct Timezone Handling

#### 1. Getting Current Date and Time

```typescript
import { formatInTimeZone } from 'date-fns-tz'

// Get timezone from first agency
const agencies = gtfs.getAgencies()
const agencyTimezone = agencies[0]?.agency_timezone || 'America/New_York'

const now = new Date()

// ✅ CORRECT: Get current date in agency timezone
const currentDate = formatInTimeZone(now, agencyTimezone, 'yyyyMMdd')

// ✅ CORRECT: Get current time in agency timezone
const currentTime = formatInTimeZone(now, agencyTimezone, 'HH:mm:ss')
```

#### 2. Creating Departure Date Objects

**The critical fix:** Create ISO strings with timezone offset, then parse as Date.

```typescript
// ✅ CORRECT: Build ISO string with agency timezone offset
const now = new Date()

// Step 1: Format current time in agency timezone with offset
const agencyNowWithOffset = formatInTimeZone(now, agencyTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX")
// Example result: "2024-01-15T19:34:00+01:00"

// Step 2: Extract date part and timezone offset
const agencyDate = agencyNowWithOffset.substring(0, 11)   // "2024-01-15T"
const agencyOffset = agencyNowWithOffset.substring(19)    // "+01:00"

// Step 3: Parse GTFS departure time
const [hours, minutes, seconds] = stopTime.departure_time.split(':').map(Number)
const actualHours = hours >= 24 ? hours - 24 : hours  // Handle midnight-spanning times

// Step 4: Build time string
const timeStr = `${actualHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds || 0).toString().padStart(2, '0')}`

// Step 5: Combine to create ISO string in agency timezone
const departureISOString = `${agencyDate}${timeStr}${agencyOffset}`
// Example result: "2024-01-15T16:46:00+01:00"

// Step 6: Parse as Date - this correctly interprets the timezone offset
const departureDate = new Date(departureISOString)
```

**Why this works:**
- The ISO string includes the timezone offset (e.g., `+01:00`)
- JavaScript's `Date` constructor correctly interprets this offset
- The resulting Date object is timezone-aware and works correctly regardless of browser timezone
- Time differences and comparisons are accurate

#### 3. Displaying Times

```typescript
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import { differenceInMinutes } from 'date-fns'

// ✅ CORRECT: Display current time in agency timezone
const clockDisplay = formatInTimeZone(now, timezone, 'HH:mm')

// ✅ CORRECT: Calculate minutes until departure
const nowInZone = toZonedTime(now, timezone)
const departureInZone = toZonedTime(departureDate, timezone)
const minutesUntil = differenceInMinutes(departureInZone, nowInZone)
```

#### 4. Filtering Departures

```typescript
// ✅ CORRECT: Filter using times in agency timezone
const currentTime = formatInTimeZone(now, agencyTimezone, 'HH:mm:ss')

// Compare GTFS time strings directly
if (stopTime.departure_time >= currentTime) {
  // This departure hasn't passed yet
}
```

### Timezone Rules Summary

1. **Always get timezone from GTFS:** `gtfs.getAgencies()[0].agency_timezone`
2. **Current date/time:** Use `formatInTimeZone(now, agencyTimezone, format)`
3. **Creating departures:** Build ISO string with timezone offset using the pattern above
4. **Display times:** Use `formatInTimeZone()` for formatting
5. **Calculate differences:** Convert both dates to agency timezone first with `toZonedTime()`
6. **Never use:** `setHours()`, `setMinutes()`, local Date methods without timezone context

### Files Handling Timezones

- **src/hooks/useDepartures.ts**: Main departure processing with timezone-aware Date creation (lines 86-106)
- **src/components/DepartureBoard.tsx**: Clock display in agency timezone (line 101)
- **src/components/DepartureSquare.tsx**: Time difference calculations in agency timezone
- **src/components/TechnicalDetailsPanel.tsx**: Displays current timezone being used

## Deployment

### GitHub Pages

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on pushes to the `main` branch.

To enable GitHub Pages:
1. Go to repository Settings → Pages
2. Select "GitHub Actions" as the source
3. Push to `main` branch to trigger deployment

The workflow:
- Checks out code
- Installs dependencies
- Builds the project
- Deploys to GitHub Pages

### Base Path Configuration

The project uses `base: './'` in `vite.config.ts` for flexible deployment to any path (repository name or custom domain).

## Error Handling

- **Missing Parameters**: Shows help screen if `gtfsUrl` or `stops` are missing
- **GTFS Load Failure**: Displays error message with details
- **GTFS-RT Failures**: Logged to console, doesn't block main functionality
- **No Departures**: Shows "No more departures today" message for routes
- **No Alerts**: AlertsPanel returns null (no display) when no alerts are present

## Color Scheme

- **Primary (Blue)**: `#3b82f6` - Used for interactive elements and realtime departures (customizable via `primaryColor`)
- **Secondary (Orange)**: `#f97316` - Used for accents and "LAST" departure indicator (customizable via `secondaryColor`)
- **Route Colors**: Extracted from GTFS `route_color` and `route_text_color` fields
- **Theme Colors**: Set via CSS custom properties `--primary-color` and `--secondary-color`

## Technical Details Panel

When enabled with `?tech=true`, the application shows:

1. **In departure rows**: Trip short name below each departure time
2. **In technical details panel**:
   - Timezone used for date/time computation
   - Agency name from GTFS feed
   - Last React rendering timestamp (HH:MM:SS format)

This panel is useful for debugging timezone issues and understanding data flow.

## Browser Compatibility

- Modern browsers with ES2020 support
- WebAssembly support required (for sql.js)
- SharedArrayBuffer support recommended for optimal performance

## Notes

- GTFS-RT data is refetched every 30 seconds (hardcoded)
- Display refresh interval is user-configurable via URL parameter
- **All times are displayed in the timezone of the first agency in the GTFS feed**
- The project handles GTFS times that span midnight (hours ≥ 24)
- Configuration settings are persisted in localStorage with key `gtfs-departure-board-config`
- Language selection defaults to browser language if not specified in URL

## License

MIT
