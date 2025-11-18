import React, { useState } from 'react'
import { DepartureBoard } from './DepartureBoard'
import { AppConfig } from '../types'

interface Preset {
  name: string
  config: Partial<AppConfig>
}

const presets: Preset[] = [
  {
    name: 'Car Jaune Example',
    config: {
      gtfsUrl: 'https://pysae.com/api/v2/groups/car-jaune/gtfs/pub',
      gtfsRtUrls: ['https://pysae.com/api/v2/groups/car-jaune/gtfs-rt'],
      stopIds: ['1001', '1002'],
      showAlerts: true,
      refreshInterval: 20
    }
  }
]

export const URLBuilder: React.FC = () => {
  const [gtfsUrl, setGtfsUrl] = useState('')
  const [gtfsRtUrls, setGtfsRtUrls] = useState('')
  const [stopIds, setStopIds] = useState('')
  const [showAlerts, setShowAlerts] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState('20')
  const [showPreview, setShowPreview] = useState(false)

  const buildUrl = (): string => {
    const params = new URLSearchParams()
    if (gtfsUrl) params.set('gtfsUrl', gtfsUrl)
    if (gtfsRtUrls) params.set('gtfsRtUrls', gtfsRtUrls)
    if (stopIds) params.set('stops', stopIds)
    if (showAlerts) params.set('showAlerts', 'true')
    if (refreshInterval) params.set('refresh', refreshInterval)

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  const getConfig = (): AppConfig => ({
    gtfsUrl: gtfsUrl || undefined,
    gtfsRtUrls: gtfsRtUrls ? gtfsRtUrls.split(',').map(s => s.trim()).filter(Boolean) : [],
    stopIds: stopIds ? stopIds.split(',').map(s => s.trim()).filter(Boolean) : [],
    showAlerts,
    refreshInterval: parseInt(refreshInterval) || 20
  })

  const applyPreset = (preset: Preset) => {
    if (preset.config.gtfsUrl) setGtfsUrl(preset.config.gtfsUrl)
    if (preset.config.gtfsRtUrls) setGtfsRtUrls(preset.config.gtfsRtUrls.join(', '))
    if (preset.config.stopIds) setStopIds(preset.config.stopIds.join(', '))
    if (preset.config.showAlerts !== undefined) setShowAlerts(preset.config.showAlerts)
    if (preset.config.refreshInterval) setRefreshInterval(preset.config.refreshInterval.toString())
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleCopyUrl = () => {
    const url = buildUrl()
    navigator.clipboard.writeText(url)
  }

  const handleGoToUrl = () => {
    window.location.href = buildUrl()
  }

  const isValid = gtfsUrl && stopIds

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-primary-700 mb-6">
            GTFS Departure Board - URL Builder
          </h1>

          {/* Presets */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Start Presets</h2>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GTFS URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={gtfsUrl}
                onChange={(e) => setGtfsUrl(e.target.value)}
                placeholder="https://example.com/gtfs.zip"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">URL to GTFS static feed (ZIP file)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GTFS-RT URLs (Optional)
              </label>
              <input
                type="text"
                value={gtfsRtUrls}
                onChange={(e) => setGtfsRtUrls(e.target.value)}
                placeholder="https://example.com/gtfs-rt, https://example.com/gtfs-rt-2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated GTFS Realtime feed URLs</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stop IDs <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={stopIds}
                onChange={(e) => setStopIds(e.target.value)}
                placeholder="1001, 1002, 1003"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated stop IDs from your GTFS feed</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  min="5"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="showAlerts"
                  checked={showAlerts}
                  onChange={(e) => setShowAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="showAlerts" className="ml-2 text-sm font-semibold text-gray-700">
                  Show Alerts
                </label>
              </div>
            </div>
          </div>

          {/* Generated URL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generated URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={buildUrl()}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={!isValid}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isValid
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Preview Below
            </button>
            <button
              onClick={handleGoToUrl}
              disabled={!isValid}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isValid
                  ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Go to Departure Board
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && isValid && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Hide Preview
              </button>
            </div>
            <div className="border-t pt-4">
              <DepartureBoard config={getConfig()} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
