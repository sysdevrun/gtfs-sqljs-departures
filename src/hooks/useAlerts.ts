import { useState, useEffect } from 'react'
import { GtfsSqlJs } from 'gtfs-sqljs'

interface Alert {
  id: string
  headerText: string
  descriptionText: string
  effect: string
}

interface UseAlertsResult {
  alerts: Alert[]
}

export const useAlerts = (
  gtfs: GtfsSqlJs | null,
  routeIds: string[],
  stopIds: string[],
  refreshTrigger: number
): UseAlertsResult => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (!gtfs) {
      setAlerts([])
      return
    }

    try {
      const allAlerts = gtfs.getAlerts()
      const relevantAlerts: Alert[] = []

      for (const alert of allAlerts) {
        // Check if alert is relevant to our routes or stops
        const isRelevant = alert.informed_entity?.some((entity: any) => {
          if (entity.route_id && routeIds.includes(entity.route_id)) {
            return true
          }
          if (entity.stop_id && stopIds.includes(entity.stop_id)) {
            return true
          }
          return false
        })

        if (isRelevant || !alert.informed_entity || alert.informed_entity.length === 0) {
          const headerText = alert.header_text
          const descriptionText = alert.description_text

          relevantAlerts.push({
            id: alert.id || Math.random().toString(),
            headerText: typeof headerText === 'string' ? headerText : headerText?.translation?.[0]?.text || 'Alert',
            descriptionText: typeof descriptionText === 'string' ? descriptionText : descriptionText?.translation?.[0]?.text || '',
            effect: String(alert.effect || '')
          })
        }
      }

      setAlerts(relevantAlerts)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
      setAlerts([])
    }
  }, [gtfs, JSON.stringify(routeIds), JSON.stringify(stopIds), refreshTrigger])

  return { alerts }
}
