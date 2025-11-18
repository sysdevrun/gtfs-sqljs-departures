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
