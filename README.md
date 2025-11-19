# GTFS Departure Board

A modern, real-time transit departure board built with Vite, React, TypeScript, and TailwindCSS v3. Display upcoming departures for any GTFS-compatible transit system with live updates and multi-language support.

## 🚀 Live Demo

**[View Live Demo on GitHub Pages](https://sysdevrun.github.io/gtfs-sqljs-departures/)**

## ✨ Features

- **🌍 Multi-language Support**: English, French, Spanish, and German (EN, FR, ES, DE)
- **⏱️ Real-time Updates**: GTFS-RT integration for live departure times
- **🎨 Customizable Themes**: Configure primary and secondary colors via URL parameters
- **🔧 Interactive URL Builder**: Easy-to-use form for building configuration URLs with live preview
- **🚏 Browse Stops**: Interactive modal to search and select stops from your GTFS feed
- **📱 Fully Responsive**: Mobile-first design with adaptive layouts
- **🔄 Auto-refresh**: Configurable refresh intervals
- **⏰ Timezone-Aware**: All times displayed in the agency's timezone
- **🎯 Adaptive Height**: Uses CSS Container Queries for optimal screen usage
- **📊 Service Alerts**: Optional panel showing relevant transit alerts
- **🛠️ Technical Details**: Optional panel for debugging (timezone, agency, render time)
- **💾 localStorage Persistence**: Your configuration is automatically saved

## 🖼️ Screenshots

### Desktop View
Departure board with route icons, real-time updates, and color-coded departure times.

### URL Builder
Interactive configuration form with live preview and one-click URL generation.

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sysdevrun/gtfs-sqljs-departures.git
cd gtfs-sqljs-departures

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage

### Quick Start

1. Navigate to the [URL Builder](https://sysdevrun.github.io/gtfs-sqljs-departures/?builder)
2. Enter your GTFS feed URL
3. Select your stops (or use "Browse stops" to search)
4. Customize colors, language, and other settings
5. Click "Copy URL" or "Go to Departure Board"

### URL Configuration

The application is configured entirely through URL parameters:

#### Required Parameters

- `gtfsUrl` - URL to GTFS static feed (ZIP file)
- `stops` - Comma-separated stop IDs (e.g., `1001,1002,1003`)

#### Optional Parameters

- `gtfsRtUrls` - Comma-separated GTFS-RT feed URLs for realtime updates
- `showAlerts` - Set to `true` to display the alerts panel
- `refresh` - Refresh interval in seconds (default: 20)
- `lang` - Language code: `en`, `fr`, `es`, or `de`
- `tech` - Set to `true` to show technical details panel and trip short names
- `primaryColor` - Primary theme color as hex without # (default: `3b82f6`)
- `secondaryColor` - Secondary theme color as hex without # (default: `f97316`)
- `builder` - Show the URL builder interface

#### Example URL

```
https://sysdevrun.github.io/gtfs-sqljs-departures/?gtfsUrl=https://pysae.com/api/v2/groups/car-jaune/gtfs/pub&gtfsRtUrls=https://pysae.com/api/v2/groups/car-jaune/gtfs-rt&stops=1001,1002,1003&showAlerts=true&refresh=20&lang=fr&tech=true&primaryColor=3b82f6&secondaryColor=f97316
```

## 🎨 Color Customization

Customize the appearance using URL parameters:

- **Primary Color**: Used for interactive elements, clock, and theme accents
- **Secondary Color**: Used for "LAST" departure indicators and accents

Example with custom colors (dark blue primary, orange secondary):
```
?primaryColor=1e40af&secondaryColor=ea580c
```

## 🌐 Supported Languages

Change the language using the `lang` URL parameter:

- `en` - English
- `fr` - Français (French)
- `es` - Español (Spanish)
- `de` - Deutsch (German)

If not specified, the application will use your browser's default language.

## 🏗️ Architecture

### Key Technologies

- **React 18.3+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS v3** - Utility-first CSS framework
- **react-i18next** - Internationalization
- **[gtfs-sqljs](https://github.com/sysdevrun/gtfs-sqljs)** - GTFS data parsing and querying (same author)
- **sql.js** - SQLite in the browser
- **date-fns** & **date-fns-tz** - Date/time manipulation with timezone support

### Data Flow

1. **URL Parsing**: Extracts configuration from URL parameters
2. **GTFS Loading**: Loads static GTFS data (skips unnecessary files for performance)
3. **GTFS-RT Integration**: Fetches real-time updates every 30 seconds
4. **Departure Processing**: Filters, groups, and sorts departures by route and direction
5. **Display Updates**: Refreshes UI based on configured interval

### Modern CSS Features

- **CSS Container Queries**: Adaptive height layout that automatically fits routes to available screen space
- **CSS Custom Properties**: Dynamic theming with configurable colors
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## ⚠️ Important: Timezone Handling

All time operations use the **agency timezone** from the GTFS feed, not the browser timezone. This ensures accurate departure times regardless of where users are located.

See [CLAUDE.md](CLAUDE.md) for detailed documentation on timezone handling.

## 🚀 Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Access your deployment at `https://[username].github.io/gtfs-sqljs-departures/`

The deployment workflow is defined in `.github/workflows/deploy.yml`.

### Custom Deployment

The project can be deployed to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**sysdevrun**

- GitHub: [@sysdevrun](https://github.com/sysdevrun)
- Creator of [gtfs-sqljs](https://github.com/sysdevrun/gtfs-sqljs)

## 🙏 Acknowledgments

- Built with [gtfs-sqljs](https://github.com/sysdevrun/gtfs-sqljs) for efficient GTFS data processing
- Uses [sql.js](https://github.com/sql-js/sql.js) for in-browser SQLite
- Inspired by real-world transit departure boards

## 📚 Related Projects

- [gtfs-sqljs](https://github.com/sysdevrun/gtfs-sqljs) - GTFS data parsing library (same author)

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/sysdevrun/gtfs-sqljs-departures/issues) page to report bugs or request features.

---

**Made with ❤️ for public transit enthusiasts**
