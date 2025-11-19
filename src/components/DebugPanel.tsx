import React from 'react'
import { RouteDirectionGroup } from '../types'

interface DebugPanelProps {
  groups: RouteDirectionGroup[]
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ groups }) => {
  return (
    <div className="mt-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
      <div className="mb-4 text-lg font-bold text-green-300">Debug Panel - Raw GTFS Data</div>

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

          {group.departures.map((departure, depIndex) => (
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
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
