import { useState, useEffect } from 'react'
import { GtfsSqlJs } from 'gtfs-sqljs'
import { proxyUrl } from '../utils/proxy'

interface UseGtfsResult {
  gtfs: GtfsSqlJs | null
  loading: boolean
  error: string | null
  progress: number
}

export const useGtfs = (gtfsUrl?: string, gtfsRtUrls: string[] = []): UseGtfsResult => {
  const [gtfs, setGtfs] = useState<GtfsSqlJs | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!gtfsUrl) {
      setGtfs(null)
      setLoading(false)
      setError(null)
      return
    }

    let mounted = true
    let refreshInterval: NodeJS.Timeout | null = null

    const loadGtfs = async () => {
      try {
        setLoading(true)
        setError(null)
        setProgress(0)

        const proxiedUrl = proxyUrl(gtfsUrl)

        const gtfsInstance = await GtfsSqlJs.fromZip(proxiedUrl, {
          onProgress: (info) => {
            if (mounted) {
              const progress = info.totalFiles > 0
                ? Math.round((info.filesCompleted / info.totalFiles) * 100)
                : 0
              setProgress(progress)
            }
          },
          realtimeFeedUrls: gtfsRtUrls.length > 0 ? gtfsRtUrls.map(proxyUrl) : undefined
        })

        if (!mounted) return

        // Load GTFS-RT data if provided
        if (gtfsRtUrls.length > 0) {
          try {
            await gtfsInstance.fetchRealtimeData()
          } catch (rtError) {
            console.warn('Failed to load GTFS-RT data:', rtError)
          }
        }

        if (mounted) {
          setGtfs(gtfsInstance)
          setLoading(false)
          setProgress(100)
        }

        // Set up periodic GTFS-RT refresh (every 30 seconds)
        if (gtfsRtUrls.length > 0) {
          refreshInterval = setInterval(async () => {
            try {
              await gtfsInstance.fetchRealtimeData()
            } catch (rtError) {
              console.warn('Failed to refresh GTFS-RT data:', rtError)
            }
          }, 30000)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load GTFS data')
          setLoading(false)
        }
      }
    }

    loadGtfs()

    return () => {
      mounted = false
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [gtfsUrl, JSON.stringify(gtfsRtUrls)])

  return { gtfs, loading, error, progress }
}
