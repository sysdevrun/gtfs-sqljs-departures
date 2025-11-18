import { useState, useEffect } from 'react'
import { GtfsSqlJs } from 'gtfs-sqljs'
import { RouteDirectionGroup } from '../types'
import { format } from 'date-fns'

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
        if (agencies.length > 0 && agencies[0].agency_timezone) {
          setTimezone(agencies[0].agency_timezone)
        }

        const now = new Date()
        const currentDate = format(now, 'yyyyMMdd')
        const currentTime = format(now, 'HH:mm:ss')

        const routeDirectionMap = new Map<string, RouteDirectionGroup>()

        // For each stop, get all stop times for today
        for (const stopId of stopIds) {
          const stopTimes = gtfs.getStopTimes({
            stopId,
            date: currentDate,
            includeRealtime: true
          })

          for (const stopTime of stopTimes) {
            // Skip if departure has already passed
            if (stopTime.departure_time < currentTime) {
              continue
            }

            const trip = gtfs.getTrips({ tripId: stopTime.trip_id })[0]
            if (!trip) continue

            const route = gtfs.getRoutes({ routeId: trip.route_id })[0]
            if (!route) continue

            const key = `${route.route_id}-${trip.direction_id}`

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

            // Parse departure time
            const [hours, minutes, seconds] = stopTime.departure_time.split(':').map(Number)
            const departureDate = new Date(now)
            departureDate.setHours(hours >= 24 ? hours - 24 : hours, minutes, seconds || 0, 0)

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
              stopId,
              departureTime: departureDate,
              isRealtime: !!(stopTime as any).delay || !!(stopTime as any).time,
              delay: (stopTime as any).delay,
              isLastDeparture: false, // Will be set later
              tripId: stopTime.trip_id
            })
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
