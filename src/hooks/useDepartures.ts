import { useState, useEffect } from 'react'
import { GtfsSqlJs, StopTime } from 'gtfs-sqljs'
import { RouteDirectionGroup, StopTimeWithRealtimeExtensions } from '../types'
import { formatInTimeZone } from 'date-fns-tz'

/**
 * StopTime with GTFS-RT extensions
 * Combines base StopTime type with realtime fields
 */
type StopTimeWithRealtime = StopTime & StopTimeWithRealtimeExtensions

interface UseDeparturesResult {
  groups: RouteDirectionGroup[]
  timezone: string
  loading: boolean
}

export const useDepartures = (
  gtfs: GtfsSqlJs | null,
  stopIds: string[],
  refreshTrigger: number
): UseDeparturesResult => {
  const [groups, setGroups] = useState<RouteDirectionGroup[]>([])
  const [timezone, setTimezone] = useState('America/New_York')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!gtfs || stopIds.length === 0) {
      setGroups([])
      return
    }

    const fetchDepartures = async () => {
      try {
        setLoading(true)

        // Get timezone from first agency
        const agencies = gtfs.getAgencies()
        let agencyTimezone = 'America/New_York'
        if (agencies.length > 0 && agencies[0].agency_timezone) {
          agencyTimezone = agencies[0].agency_timezone
          setTimezone(agencyTimezone)
        }

        const now = new Date()
        // Use agency timezone for both date and time to ensure correct filtering
        const currentDate = formatInTimeZone(now, agencyTimezone, 'yyyyMMdd')
        const currentTime = formatInTimeZone(now, agencyTimezone, 'HH:mm:ss')

        const routeDirectionMap = new Map<string, RouteDirectionGroup>()

        // First pass: Get ALL stop times for today to identify all route-direction combinations
        for (const stopId of stopIds) {
          const allStopTimes = gtfs.getStopTimes({
            stopId,
            date: currentDate,
            includeRealtime: true
          })

          for (const baseStopTime of allStopTimes) {
            // Cast to StopTime with GTFS-RT extensions
            const stopTime = baseStopTime as StopTimeWithRealtime

            const trip = gtfs.getTrips({ tripId: stopTime.trip_id })[0]
            if (!trip) continue

            const route = gtfs.getRoutes({ routeId: trip.route_id })[0]
            if (!route) continue

            const key = `${route.route_id}-${trip.direction_id}`

            // Initialize route-direction group if not exists
            if (!routeDirectionMap.has(key)) {
              routeDirectionMap.set(key, {
                routeId: route.route_id,
                routeShortName: route.route_short_name || route.route_long_name || route.route_id,
                routeLongName: route.route_long_name || '',
                routeColor: route.route_color || 'CCCCCC',
                routeTextColor: route.route_text_color || '',
                routeSortOrder: typeof route.route_sort_order === 'number' ? route.route_sort_order : 999999,
                directionId: trip.direction_id ?? 0,
                headsigns: [],
                departures: []
              })
            }

            const group = routeDirectionMap.get(key)!

            // Add unique headsign
            if (trip.trip_headsign && !group.headsigns.includes(trip.trip_headsign)) {
              group.headsigns.push(trip.trip_headsign)
            }

            // Only add to departures if it hasn't passed yet
            if (stopTime.departure_time >= currentTime) {
              let departureDate: Date

              // Check for GTFS-RT realtime timestamp (absolute time)
              const realtimeTimestamp = stopTime.departure?.time || stopTime.time

              if (realtimeTimestamp) {
                // Use realtime timestamp directly (Unix timestamp in seconds)
                departureDate = new Date(realtimeTimestamp * 1000)
              } else {
                // Parse scheduled departure time
                const [hours, minutes, seconds] = stopTime.departure_time.split(':').map(Number)

                // GTFS allows hours >= 24 for times spanning midnight (e.g., 25:00 = 1 AM next day)
                const daysToAdd = Math.floor(hours / 24)
                const actualHours = hours % 24

                // Format current time in agency timezone with timezone offset (e.g., "2024-01-15T19:34:00+01:00")
                const agencyNowWithOffset = formatInTimeZone(now, agencyTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX")

                // Extract date part (2024-01-15T) and timezone offset (+01:00)
                let agencyDate = agencyNowWithOffset.substring(0, 11)
                const agencyOffset = agencyNowWithOffset.substring(19)

                // If hours >= 24, we need to add days to the date
                if (daysToAdd > 0) {
                  const baseDateStr = agencyNowWithOffset.substring(0, 10) // "2024-01-15"
                  const baseDate = new Date(baseDateStr + 'T00:00:00' + agencyOffset)
                  baseDate.setDate(baseDate.getDate() + daysToAdd)
                  // Format back to ISO date with T
                  agencyDate = formatInTimeZone(baseDate, agencyTimezone, "yyyy-MM-dd'T'")
                }

                // Build time string (16:46:00)
                const timeStr = `${actualHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${(seconds || 0).toString().padStart(2, '0')}`

                // Combine to create ISO string in agency timezone (e.g., "2024-01-15T16:46:00+01:00")
                const departureISOString = `${agencyDate}${timeStr}${agencyOffset}`

                // Parse scheduled time as Date
                departureDate = new Date(departureISOString)

                // Check for GTFS-RT delay (relative adjustment in seconds)
                const delay = stopTime.departure?.delay || stopTime.delay
                if (delay) {
                  // Add delay to scheduled time
                  departureDate = new Date(departureDate.getTime() + delay * 1000)
                }
              }

              // Add departure
              group.departures.push({
                routeId: route.route_id,
                routeShortName: route.route_short_name || route.route_long_name || route.route_id,
                routeLongName: route.route_long_name || '',
                routeColor: route.route_color || 'CCCCCC',
                routeTextColor: route.route_text_color || '',
                routeSortOrder: typeof route.route_sort_order === 'number' ? route.route_sort_order : 999999,
                directionId: trip.direction_id ?? 0,
                tripHeadsign: trip.trip_headsign || '',
                tripShortName: trip.trip_short_name || '',
                stopId,
                departureTime: departureDate,
                // Check for realtime data in multiple possible locations
                isRealtime: !!(
                  stopTime.delay ||
                  stopTime.time ||
                  stopTime.departure?.time ||
                  stopTime.departure?.delay ||
                  stopTime.arrival?.time ||
                  stopTime.arrival?.delay
                ),
                delay: stopTime.delay || stopTime.departure?.delay,
                isLastDeparture: false, // Will be set later
                tripId: stopTime.trip_id
              })
            }
          }
        }

        // Sort departures and mark last ones
        const sortedGroups: RouteDirectionGroup[] = []

        routeDirectionMap.forEach((group) => {
          // Sort departures by time
          group.departures.sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime())

          // Mark the last departure
          if (group.departures.length > 0) {
            group.departures[group.departures.length - 1].isLastDeparture = true
          }

          sortedGroups.push(group)
        })

        // Sort groups by route sort order, then by route short name
        sortedGroups.sort((a, b) => {
          if (a.routeSortOrder !== b.routeSortOrder) {
            return a.routeSortOrder - b.routeSortOrder
          }
          return a.routeShortName.localeCompare(b.routeShortName)
        })

        setGroups(sortedGroups)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch departures:', err)
        setLoading(false)
      }
    }

    fetchDepartures()
  }, [gtfs, JSON.stringify(stopIds), refreshTrigger])

  return { groups, timezone, loading }
}
