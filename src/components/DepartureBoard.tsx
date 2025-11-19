import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatInTimeZone } from 'date-fns-tz'
import { DepartureRow } from './DepartureRow'
import { AlertsPanel } from './AlertsPanel'
import { TechnicalDetailsPanel } from './TechnicalDetailsPanel'
import { DebugPanel } from './DebugPanel'
import { QRCodePanel } from './QRCodePanel'
import { SplashScreen } from './SplashScreen'
import { useGtfs } from '../hooks/useGtfs'
import { useDepartures } from '../hooks/useDepartures'
import { useAlerts } from '../hooks/useAlerts'
import { AppConfig } from '../types'

interface DepartureBoardProps {
  config: AppConfig
}

export const DepartureBoard: React.FC<DepartureBoardProps> = ({ config }) => {
  const { t } = useTranslation()
  const [now, setNow] = useState(new Date())
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [lastRenderTime, setLastRenderTime] = useState(new Date())
  const [agencyName, setAgencyName] = useState('')

  // Set CSS custom properties for dynamic theming
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return `${r} ${g} ${b}`
    }

    document.documentElement.style.setProperty('--primary-color', `#${config.primaryColor}`)
    document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(config.primaryColor))
    document.documentElement.style.setProperty('--secondary-color', `#${config.secondaryColor}`)
    document.documentElement.style.setProperty('--secondary-color-rgb', hexToRgb(config.secondaryColor))
  }, [config.primaryColor, config.secondaryColor])

  const { gtfs, loading: gtfsLoading, error: gtfsError, progress } = useGtfs(
    config.gtfsUrl,
    config.gtfsRtUrls
  )

  const { groups, timezone } = useDepartures(
    gtfs,
    config.stopIds,
    refreshTrigger
  )

  const routeIds = groups.map(g => g.routeId)
  const { alerts } = useAlerts(gtfs, routeIds, config.stopIds, refreshTrigger)

  // Get agency name for technical details
  useEffect(() => {
    if (gtfs) {
      const agencies = gtfs.getAgencies()
      if (agencies.length > 0) {
        setAgencyName(agencies[0].agency_name || 'Unknown Agency')
      }
    }
  }, [gtfs])

  // Update last render time when groups change
  useEffect(() => {
    if (groups.length > 0) {
      setLastRenderTime(new Date())
    }
  }, [groups])

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
    return <SplashScreen message={t('departureBoard.loading', { progress: Math.round(progress) })} />
  }

  if (gtfsError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('departureBoard.error')}</h2>
          <p className="text-gray-700">{gtfsError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Sticky clock at top */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-300 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {config.logoUrl ? (
            <div className="flex items-center">
              <img
                src={config.logoUrl}
                alt="Logo"
                className="h-12 object-contain"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="text-2xl font-bold text-primary-700">
            {formatInTimeZone(now, timezone, 'HH:mm')}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className={`flex flex-col ${config.showAlerts ? 'lg:flex-row' : ''} gap-6`}>
          <div className={config.showAlerts ? 'lg:w-2/3' : 'w-full'}>
            {/* Flexbox container for adaptive height */}
            {groups.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                {t('departureBoard.noDepartures')}
              </div>
            ) : (
              <div className="departure-board-container">
                {groups.map((group) => (
                  <DepartureRow
                    key={`${group.routeId}-${group.directionId}`}
                    group={group}
                    timezone={timezone}
                    now={now}
                    showTechnicalDetails={config.showTechnicalDetails}
                  />
                ))}
              </div>
            )}
          </div>

          {config.showAlerts && (
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-4 space-y-4">
                <AlertsPanel alerts={alerts} customAlertMessage={config.customAlertMessage} />
                {config.showTechnicalDetails && (
                  <TechnicalDetailsPanel
                    timezone={timezone}
                    agencyName={agencyName}
                    lastRenderTime={lastRenderTime}
                    gtfs={gtfs}
                    stopIds={config.stopIds}
                  />
                )}
                {config.showQrCode && (
                  <QRCodePanel currentUrl={window.location.href} />
                )}
              </div>
            </div>
          )}

          {/* Show panels even when alerts are hidden */}
          {!config.showAlerts && (config.showTechnicalDetails || config.showQrCode) && (
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-4 space-y-4">
                {config.showTechnicalDetails && (
                  <TechnicalDetailsPanel
                    timezone={timezone}
                    agencyName={agencyName}
                    lastRenderTime={lastRenderTime}
                    gtfs={gtfs}
                    stopIds={config.stopIds}
                  />
                )}
                {config.showQrCode && (
                  <QRCodePanel currentUrl={window.location.href} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Debug panel - full width at bottom */}
        {config.showDebug && (
          <div className="mt-6">
            <DebugPanel groups={groups} gtfs={gtfs} gtfsRtUrls={config.gtfsRtUrls} />
          </div>
        )}
      </div>
    </div>
  )
}
