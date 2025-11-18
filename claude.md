# GTFS Departure Board

A real-time transit departure board built with Vite, React, TypeScript, and TailwindCSS v3. It displays upcoming departures for specified GTFS stops with real-time updates.

## Features

- **URL Builder**: Interactive form to build configuration URLs with live preview
- **Real-time Departures**: Shows upcoming departures for multiple stops with GTFS-RT integration
- **Route Display**: Route icons with GTFS-defined colors and text
- **Smart Time Display**: Shows minutes for departures < 60 minutes, HH:MM format otherwise
- **Alerts Panel**: Optional panel showing relevant service alerts
- **Auto-refresh**: Configurable refresh interval for real-time updates
- **Mobile Responsive**: Fully responsive design with Tailwind CSS
- **GitHub Pages Deployment**: Automated deployment via GitHub Actions

## Project Structure

```
gtfs-sqljs-departures/
├── src/
│   ├── components/
│   │   ├── AlertsPanel.tsx       # Service alerts display
│   │   ├── DepartureBoard.tsx    # Main departure board container
│   │   ├── DepartureRow.tsx      # Individual route departure row
│   │   ├── DepartureSquare.tsx   # Departure time display
│   │   ├── HelpMessage.tsx       # URL parameter help screen (legacy)
│   │   ├── RouteIcon.tsx         # Route badge with GTFS colors
│   │   ├── SplashScreen.tsx      # Loading screen
│   │   └── URLBuilder.tsx        # Interactive URL builder with preview
│   ├── hooks/
│   │   ├── useAlerts.ts          # Alerts data fetching
│   │   ├── useDepartures.ts      # Departure data processing
│   │   └── useGtfs.ts            # GTFS data loading
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── proxy.ts              # URL proxy for CORS
│   │   ├── timeFormat.ts         # Time formatting utilities
│   │   └── urlParams.ts          # URL parameter parsing
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind CSS imports
├── .github/workflows/
│   └── deploy.yml                # GitHub Pages deployment
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
  - Quick start presets (e.g., Car Jaune)
  - Live preview of the departure board
  - Copy generated URL to clipboard
  - Navigate directly to configured departure board

## URL Parameters

The application is configured entirely through URL parameters:

### Required Parameters

- `gtfsUrl` - URL to GTFS static feed (ZIP file)
- `stops` - Comma-separated stop IDs (e.g., `1001,1002,1003`)

### Optional Parameters

- `gtfsRtUrls` - Comma-separated GTFS-RT feed URLs for realtime updates
- `showAlerts` - Set to `true` to display the alerts panel
- `refresh` - Refresh interval in seconds (default: 20)
- `builder` - Show the URL builder interface

### Example URL

```
https://example.com/?gtfsUrl=https://pysae.com/api/v2/groups/car-jaune/gtfs/pub&gtfsRtUrls=https://pysae.com/api/v2/groups/car-jaune/gtfs-rt&stops=1001,1002,1003&showAlerts=true&refresh=20
```

## Key Technologies

### Core Dependencies

- **React 18.3+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS v3** - Utility-first CSS framework
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

## Color Scheme

- **Primary (Blue)**: `#3b82f6` - Used for interactive elements and realtime departures
- **Secondary (Orange)**: `#f97316` - Used for accents and "LAST" departure indicator
- **Route Colors**: Extracted from GTFS `route_color` and `route_text_color` fields

## Browser Compatibility

- Modern browsers with ES2020 support
- WebAssembly support required (for sql.js)
- SharedArrayBuffer support recommended for optimal performance

## Notes

- GTFS-RT data is refetched every 30 seconds (hardcoded)
- Display refresh interval is user-configurable via URL parameter
- All times are displayed in the timezone of the first agency in the GTFS feed
- The project handles GTFS times that span midnight (hours ≥ 24)

## License

MIT
