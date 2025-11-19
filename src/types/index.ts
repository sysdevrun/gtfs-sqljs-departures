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
