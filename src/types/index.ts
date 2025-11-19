/**
 * GTFS-RT StopTimeEvent - represents realtime data for arrival/departure
 * Based on GTFS Realtime specification
 */
export interface StopTimeEvent {
  delay?: number // Delay in seconds (can be positive or negative)
  time?: number // Unix timestamp (seconds since epoch)
  uncertainty?: number // Uncertainty of prediction in seconds
}

/**
 * StopTime with GTFS-RT extensions
 * Extends the base StopTime type from gtfs-sqljs with realtime fields
 */
export interface StopTimeWithRealtimeExtensions {
  // Flat structure (legacy GTFS-RT format)
  delay?: number
  time?: number

  // Nested structure (GTFS-RT standard format)
  departure?: StopTimeEvent
  arrival?: StopTimeEvent
}

export interface PresetConfig {
  name: string
  gtfsUrl: string
  gtfsRtUrls: string[]
}

export interface AppConfig {
  gtfsUrl?: string
  gtfsRtUrls: string[]
  stopIds: string[]
  showAlerts: boolean
  refreshInterval: number // in seconds
  showTechnicalDetails: boolean
  showDebug: boolean // Show debug panel with raw GTFS data
  showQrCode: boolean // Show QR code to open on mobile
  primaryColor: string // hex color without #
  secondaryColor: string // hex color without #
  logoUrl?: string // URL to logo image displayed next to clock
  customAlertMessage?: string // Custom alert message displayed before GTFS-RT alerts
}

export interface DepartureInfo {
  routeId: string
  routeShortName: string
  routeLongName: string
  routeColor: string
  routeTextColor: string
  routeSortOrder: number
  directionId: number
  tripHeadsign: string
  tripShortName: string
  stopId: string
  departureTime: Date
  isRealtime: boolean
  delay?: number // in seconds
  isLastDeparture: boolean
  tripId: string
}

export interface RouteDirectionGroup {
  routeId: string
  routeShortName: string
  routeLongName: string
  routeColor: string
  routeTextColor: string
  routeSortOrder: number
  directionId: number
  headsigns: string[]
  departures: DepartureInfo[]
}
