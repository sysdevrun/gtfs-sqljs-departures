import React, { useState, useEffect } from 'react'
import { DepartureRow } from './DepartureRow'
import { AlertsPanel } from './AlertsPanel'
import { SplashScreen } from './SplashScreen'
import { useGtfs } from '../hooks/useGtfs'
import { useDepartures } from '../hooks/useDepartures'
import { useAlerts } from '../hooks/useAlerts'
import { AppConfig } from '../types'

interface DepartureBoardProps {
  config: AppConfig
}

export const DepartureBoard: React.FC<DepartureBoardProps> = ({ config }) => {
  const [now, setNow] = useState(new Date())
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { gtfs, loading: gtfsLoading, error: gtfsError, progress } = useGtfs(
    config.gtfsUrl,
    config.gtfsRtUrls
  )

  const { groups, timezone, loading: departuresLoading } = useDepartures(
    gtfs,
    config.stopIds,
    refreshTrigger
  )

  const routeIds = groups.map(g => g.routeId)
  const { alerts } = useAlerts(gtfs, routeIds, config.stopIds, refreshTrigger)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Auto-refresh departures
  useEffect(() => {
    if (!gtfs) return

    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, config.refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [gtfs, config.refreshInterval])

  if (gtfsLoading) {
    return <SplashScreen message={`Loading GTFS data... ${Math.round(progress)}%`} />
  }

  if (gtfsError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{gtfsError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            Departure Board
          </h1>
          <div className="text-sm text-gray-600">
            Refreshing every {config.refreshInterval} seconds
            {departuresLoading && ' • Updating...'}
          </div>
        </header>

        <div className={`flex flex-col ${config.showAlerts ? 'lg:flex-row' : ''} gap-6`}>
          <div className={config.showAlerts ? 'lg:w-2/3' : 'w-full'}>
            <div className="space-y-3">
              {groups.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  No departures found for the selected stops
                </div>
              ) : (
                groups.map((group) => (
                  <DepartureRow
                    key={`${group.routeId}-${group.directionId}`}
                    group={group}
                    timezone={timezone}
                    now={now}
                  />
                ))
              )}
            </div>
          </div>

          {config.showAlerts && (
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-4">
                <AlertsPanel alerts={alerts} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
