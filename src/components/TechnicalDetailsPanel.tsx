import React, { useMemo } from 'react'
import { formatInTimeZone } from 'date-fns-tz'
import { GtfsSqlJs } from 'gtfs-sqljs'

interface TechnicalDetailsPanelProps {
  timezone: string
  agencyName: string
  lastRenderTime: Date
  gtfs: GtfsSqlJs | null
  stopIds: string[]
}

export const TechnicalDetailsPanel: React.FC<TechnicalDetailsPanelProps> = ({
  timezone,
  agencyName,
  lastRenderTime,
  gtfs,
  stopIds
}) => {
  // Fetch stop names for each stop ID
  const stopNamesMap = useMemo(() => {
    if (!gtfs) return new Map<string, string>()

    const map = new Map<string, string>()
    for (const stopId of stopIds) {
      try {
        const stops = gtfs.getStops({ stopId })
        if (stops.length > 0) {
          map.set(stopId, stops[0].stop_name)
        }
      } catch (e) {
        console.error(`Failed to get stop name for ${stopId}:`, e)
      }
    }
    return map
  }, [gtfs, stopIds])
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Details</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Timezone:</span>
          <span className="font-mono text-gray-900">{timezone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Agency:</span>
          <span className="font-semibold text-gray-900">{agencyName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Rendering:</span>
          <span className="font-mono text-gray-900">{formatInTimeZone(lastRenderTime, timezone, 'HH:mm:ss')}</span>
        </div>

        {/* Stops section */}
        {stopIds.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <div className="text-gray-600 mb-2 font-semibold">Monitored Stops:</div>
            <div className="space-y-1">
              {stopIds.map((stopId) => (
                <div key={stopId} className="flex justify-between items-start">
                  <span className="font-mono text-gray-700 text-xs">{stopId}</span>
                  <span className="text-gray-900 text-right ml-3 flex-1">
                    {stopNamesMap.get(stopId) || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
