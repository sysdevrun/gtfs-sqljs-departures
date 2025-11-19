import React, { useState, useEffect } from 'react'
import { GtfsSqlJs } from 'gtfs-sqljs'
import { RouteDirectionGroup } from '../types'

interface DebugPanelProps {
  groups: RouteDirectionGroup[]
  gtfs: GtfsSqlJs | null
  gtfsRtUrls: string[]
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ groups, gtfs, gtfsRtUrls }) => {
  const [tripUpdates, setTripUpdates] = useState<any[]>([])
  const [stopTimeUpdates, setStopTimeUpdates] = useState<any[]>([])
  const [realtimeStats, setRealtimeStats] = useState({
    feedUrls: [] as string[],
    stalenessThreshold: 0,
    totalTripUpdates: 0,
    totalStopTimeUpdates: 0
  })

  useEffect(() => {
    if (!gtfs) return

    try {
      // Get GTFS-RT configuration
      const feedUrls = gtfs.getRealtimeFeedUrls()
      const stalenessThreshold = gtfs.getStalenessThreshold()

      // Get all trip updates (with debugging method)
      const allTripUpdates = gtfs.debugExportAllTripUpdates()

      // Get all stop time updates (with debugging method)
      const allStopTimeUpdates = gtfs.debugExportAllStopTimeUpdates()

      setRealtimeStats({
        feedUrls,
        stalenessThreshold,
        totalTripUpdates: allTripUpdates.length,
        totalStopTimeUpdates: allStopTimeUpdates.length
      })

      setTripUpdates(allTripUpdates)
      setStopTimeUpdates(allStopTimeUpdates)
    } catch (error) {
      console.error('Error fetching GTFS-RT debug data:', error)
    }
  }, [gtfs])

  // Helper to find GTFS-RT data for a specific trip/stop
  const findStopTimeUpdate = (tripId: string, stopId: string) => {
    return stopTimeUpdates.find(stu =>
      stu.trip_id === tripId && stu.stop_id === stopId
    )
  }

  const findTripUpdate = (tripId: string) => {
    return tripUpdates.find(tu => tu.trip_id === tripId)
  }

  return (
    <div className="mt-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
      <div className="mb-4 text-lg font-bold text-green-300">Debug Panel - GTFS & GTFS-RT Data</div>

      {/* GTFS-RT Configuration */}
      <div className="mb-6 p-3 bg-gray-800 rounded border border-yellow-600">
        <div className="text-yellow-400 font-bold mb-2">GTFS-RT Configuration</div>
        <div className="ml-2 space-y-1">
          <div>Feed URLs Configured: <span className="text-white">{gtfsRtUrls.length}</span></div>
          {gtfsRtUrls.map((url, idx) => (
            <div key={idx} className="ml-4 text-cyan-400">• {url}</div>
          ))}
          <div>Feed URLs Active: <span className="text-white">{realtimeStats.feedUrls.length}</span></div>
          <div>Staleness Threshold: <span className="text-white">{realtimeStats.stalenessThreshold}s</span></div>
          <div>Total Trip Updates: <span className={realtimeStats.totalTripUpdates > 0 ? 'text-green-400' : 'text-red-400'}>
            {realtimeStats.totalTripUpdates}
          </span></div>
          <div>Total Stop Time Updates: <span className={realtimeStats.totalStopTimeUpdates > 0 ? 'text-green-400' : 'text-red-400'}>
            {realtimeStats.totalStopTimeUpdates}
          </span></div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={`debug-${group.routeId}-${group.directionId}`} className="mb-6 pb-4 border-b border-gray-700 last:border-b-0">
          <div className="mb-2 text-sm text-yellow-400">
            Route: {group.routeShortName} ({group.routeId}) | Direction: {group.directionId}
          </div>

          <div className="mb-2 text-gray-400">
            Headsigns: {group.headsigns.join(', ') || 'None'}
          </div>

          <div className="mb-2 text-gray-400">
            Route Sort Order: {group.routeSortOrder}
          </div>

          <div className="mb-2 text-gray-400">
            Colors: BG=#{group.routeColor} | Text=#{group.routeTextColor || 'auto'}
          </div>

          <div className="mb-2 text-white font-semibold">
            Departures ({group.departures.length}):
          </div>

          {group.departures.map((departure, depIndex) => {
            const stopTimeUpdate = findStopTimeUpdate(departure.tripId, departure.stopId)
            const tripUpdate = findTripUpdate(departure.tripId)

            return (
              <div key={`departure-${departure.tripId}-${depIndex}`} className="ml-4 mb-3 p-2 bg-gray-800 rounded">
                <div className="text-cyan-400">Departure #{depIndex + 1}</div>
                <div className="ml-2 space-y-1 mt-1">
                  <div>Trip ID: <span className="text-white">{departure.tripId}</span></div>
                  <div>Trip Short Name: <span className="text-white">{departure.tripShortName || 'N/A'}</span></div>
                  <div>Stop ID: <span className="text-white">{departure.stopId}</span></div>
                  <div>Headsign: <span className="text-white">{departure.tripHeadsign || 'N/A'}</span></div>
                  <div>Departure Time: <span className="text-white">{departure.departureTime.toISOString()}</span></div>
                  <div>Local Display: <span className="text-white">{departure.departureTime.toLocaleString()}</span></div>
                  <div>
                    Realtime: <span className={departure.isRealtime ? 'text-green-400' : 'text-red-400'}>
                      {departure.isRealtime ? 'YES' : 'NO'}
                    </span>
                  </div>
                  {departure.delay !== undefined && (
                    <div>Delay: <span className="text-white">{departure.delay} seconds</span></div>
                  )}
                  <div>
                    Last Departure: <span className={departure.isLastDeparture ? 'text-orange-400' : 'text-gray-500'}>
                      {departure.isLastDeparture ? 'YES' : 'NO'}
                    </span>
                  </div>

                  {/* Show GTFS-RT data if available */}
                  {(tripUpdate || stopTimeUpdate) && (
                    <div className="mt-2 p-2 bg-blue-900 bg-opacity-30 rounded border border-blue-500">
                      <div className="text-blue-300 font-bold">GTFS-RT Data Found:</div>

                      {tripUpdate && (
                        <div className="ml-2 mt-1">
                          <div className="text-blue-400">Trip Update:</div>
                          <div className="ml-2 text-xs">
                            <pre className="text-gray-300">{JSON.stringify(tripUpdate, null, 2)}</pre>
                          </div>
                        </div>
                      )}

                      {stopTimeUpdate && (
                        <div className="ml-2 mt-1">
                          <div className="text-blue-400">Stop Time Update:</div>
                          <div className="ml-2 text-xs">
                            <pre className="text-gray-300">{JSON.stringify(stopTimeUpdate, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!tripUpdate && !stopTimeUpdate && realtimeStats.totalStopTimeUpdates > 0 && (
                    <div className="mt-2 p-2 bg-red-900 bg-opacity-30 rounded border border-red-500">
                      <div className="text-red-300">⚠ No GTFS-RT match found for this trip/stop combination</div>
                      <div className="text-red-400 text-xs mt-1">
                        Trip ID: {departure.tripId} | Stop ID: {departure.stopId}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Show sample of all GTFS-RT data if present */}
      {realtimeStats.totalStopTimeUpdates > 0 && (
        <div className="mt-6 space-y-4">
          {/* ID Comparison Section */}
          <div className="p-3 bg-orange-900 bg-opacity-30 rounded border border-orange-500">
            <div className="text-orange-300 font-bold mb-2">ID Format Analysis</div>
            <div className="ml-2 space-y-2">
              <div className="text-white font-semibold">Static GTFS Trip IDs (from displayed departures):</div>
              <div className="ml-4 text-cyan-400">
                {groups.flatMap(g => g.departures.map(d => d.tripId)).slice(0, 10).join(', ')}
                {groups.flatMap(g => g.departures).length > 10 && '...'}
              </div>

              <div className="text-white font-semibold mt-3">GTFS-RT Trip IDs (first 10):</div>
              <div className="ml-4 text-green-400">
                {[...new Set(stopTimeUpdates.map(stu => stu.trip_id))].slice(0, 10).join(', ')}
              </div>

              <div className="text-white font-semibold mt-3">Static GTFS Stop IDs (from displayed departures):</div>
              <div className="ml-4 text-cyan-400">
                {[...new Set(groups.flatMap(g => g.departures.map(d => d.stopId)))].slice(0, 10).join(', ')}
              </div>

              <div className="text-white font-semibold mt-3">GTFS-RT Stop IDs (first 10):</div>
              <div className="ml-4 text-green-400">
                {[...new Set(stopTimeUpdates.map(stu => stu.stop_id).filter(Boolean))].slice(0, 10).join(', ')}
              </div>

              <div className="mt-4 p-2 bg-yellow-900 bg-opacity-40 rounded">
                <div className="text-yellow-300 font-bold">💡 ID Mismatch Detection:</div>
                <div className="ml-2 text-sm mt-1">
                  {(() => {
                    const staticTripIds = groups.flatMap(g => g.departures.map(d => d.tripId))
                    const rtTripIds = [...new Set(stopTimeUpdates.map(stu => stu.trip_id))]

                    // Check for common patterns
                    const staticHasPrefix = staticTripIds.some(id => id.includes('-'))
                    const rtHasPrefix = rtTripIds.some(id => id.includes('-'))

                    if (staticHasPrefix && !rtHasPrefix) {
                      return <div className="text-yellow-200">⚠️ Static GTFS has prefixed IDs (e.g., "5-151060524") but GTFS-RT may not. Try removing prefix before dash.</div>
                    } else if (!staticHasPrefix && rtHasPrefix) {
                      return <div className="text-yellow-200">⚠️ GTFS-RT has prefixed IDs but static GTFS may not. IDs may need prefix added.</div>
                    } else if (staticTripIds.length > 0 && rtTripIds.length > 0 && !staticTripIds.some(sid => rtTripIds.includes(sid))) {
                      return <div className="text-yellow-200">⚠️ No matching trip IDs found between static GTFS and GTFS-RT. The feeds may use completely different ID formats.</div>
                    } else {
                      return <div className="text-green-200">✓ ID formats appear similar between static and realtime feeds.</div>
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Raw GTFS-RT Data Sample */}
          <div className="p-3 bg-purple-900 bg-opacity-30 rounded border border-purple-500">
            <div className="text-purple-300 font-bold mb-2">
              All GTFS-RT Stop Time Updates (First 5)
            </div>
            <pre className="text-xs text-gray-300 overflow-x-auto">
              {JSON.stringify(stopTimeUpdates.slice(0, 5), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
