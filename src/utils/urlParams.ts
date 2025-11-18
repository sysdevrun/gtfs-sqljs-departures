import { AppConfig } from '../types'

export const parseUrlParams = (): AppConfig => {
  const params = new URLSearchParams(window.location.search)

  // Parse stop IDs (format: ?stops=123,456,789)
  const stopsParam = params.get('stops')
  const stopIds = stopsParam ? stopsParam.split(',').map(s => s.trim()).filter(Boolean) : []

  // Parse GTFS URL
  const gtfsUrl = params.get('gtfsUrl') || undefined

  // Parse GTFS-RT URLs (format: ?gtfsRtUrls=url1,url2,url3)
  const gtfsRtParam = params.get('gtfsRtUrls')
  const gtfsRtUrls = gtfsRtParam ? gtfsRtParam.split(',').map(s => s.trim()).filter(Boolean) : []

  // Parse show alerts flag
  const showAlerts = params.get('showAlerts') === 'true'

  // Parse refresh interval (default 20 seconds)
  const refreshParam = params.get('refresh')
  const refreshInterval = refreshParam ? parseInt(refreshParam, 10) : 20

  return {
    gtfsUrl,
    gtfsRtUrls,
    stopIds,
    showAlerts,
    refreshInterval: isNaN(refreshInterval) ? 20 : refreshInterval
  }
}

export const buildExampleUrl = (): string => {
  const base = window.location.origin + window.location.pathname
  const params = new URLSearchParams({
    gtfsUrl: 'https://pysae.com/api/v2/groups/car-jaune/gtfs/pub',
    gtfsRtUrls: 'https://pysae.com/api/v2/groups/car-jaune/gtfs-rt',
    stops: '1001,1002,1003',
    showAlerts: 'true',
    refresh: '20'
  })
  return `${base}?${params.toString()}`
}
