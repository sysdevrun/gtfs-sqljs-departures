import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DepartureBoard } from './DepartureBoard'
import { StopSelector } from './StopSelector'
import { TransportDatasetSearch } from './TransportDatasetSearch'
import { LanguageSelector } from './LanguageSelector'
import { AppConfig } from '../types'

interface Preset {
  name: string
  config: Partial<AppConfig>
}

const presets: Preset[] = [
  {
    name: 'Car Jaune',
    config: {
      gtfsUrl: 'https://pysae.com/api/v2/groups/car-jaune/gtfs/pub',
      gtfsRtUrls: ['https://pysae.com/api/v2/groups/car-jaune/gtfs-rt'],
      stopIds: ['1001', '1002'],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'Irigo',
    config: {
      gtfsUrl: 'https://chouette.enroute.mobi/api/v1/datas/Irigo/gtfs.zip',
      gtfsRtUrls: [
        'https://ara-api.enroute.mobi/irigo/gtfs/trip-updates',
        'https://ara-api.enroute.mobi/irigo/gtfs/vehicle-positions',
        'https://notify.ratpdev.com/api/networks/RD%20ANGERS/alerts/gtfsrt'
      ],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: "Kar'Ouest",
    config: {
      gtfsUrl: 'https://www.data.gouv.fr/api/1/datasets/r/c9c2f609-d0cd-4233-ad1b-cf86b9bf2dc8',
      gtfsRtUrls: ['https://pysae.com/api/v2/groups/semto-2/gtfs-rt'],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'Alternéo',
    config: {
      gtfsUrl: 'https://transport.data.gouv.fr/resources/80676/download',
      gtfsRtUrls: [
        'https://proxy.transport.data.gouv.fr/resource/alterneo-civis-gtfs-rt-trip-update',
        'https://proxy.transport.data.gouv.fr/resource/alterneo-civis-gtfs-rt-service-alert',
        'https://proxy.transport.data.gouv.fr/resource/alterneo-civis-gtfs-rt-vehicle-position'
      ],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'CaRsud',
    config: {
      gtfsUrl: 'https://www.data.gouv.fr/api/1/datasets/r/8f3642e3-9fc3-45ed-af46-8c532966ace3',
      gtfsRtUrls: ['https://zenbus.net/gtfs/rt/poll.proto?src=true&dataset=carsud-reunion'],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'Citalis',
    config: {
      gtfsUrl: 'https://pysae.com/api/v2/groups/citalis/gtfs/pub',
      gtfsRtUrls: ['https://pysae.com/api/v2/groups/citalis/gtfs-rt'],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'STAS',
    config: {
      gtfsUrl: 'https://api-preprod.saint-etienne-metropole.fr/gtfs-tools/api/gtfs',
      gtfsRtUrls: ['https://api-preprod.saint-etienne-metropole.fr/gtfs-tools/api/TripUpdate?format=pb'],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'Astuce',
    config: {
      gtfsUrl: 'https://api.mrn.cityway.fr/dataflow/offre-tc/download?provider=ASTUCE&dataFormat=gtfs&dataProfil=ASTUCE',
      gtfsRtUrls: [
        'https://api.mrn.cityway.fr/dataflow/vehicle-tc-tr/download?provider=TCAR&dataFormat=gtfs-rt',
        'https://api.mrn.cityway.fr/dataflow/info-transport/download?provider=ASTUCE&dataFormat=gtfs-rt',
        'https://api.mrn.cityway.fr/dataflow/vehicule-tc-tr/download?provider=TNI&dataFormat=gtfs-rt',
        'https://api.mrn.cityway.fr/dataflow/horaire-tc-tr/download?provider=TNI&dataFormat=gtfs-rt',
        'https://api.mrn.cityway.fr/dataflow/horaire-tc-tr/download?provider=TAE&dataFormat=gtfs-rt',
        'https://api.mrn.cityway.fr/dataflow/horaire-tc-tr/download?provider=TCAR&dataFormat=gtfs-rt'
      ],
      showAlerts: true,
      refreshInterval: 20
    }
  },
  {
    name: 'MAP',
    config: {
      gtfsUrl: 'https://www.data.gouv.fr/api/1/datasets/r/3bd31fbe-93f4-432d-ade7-ee8d69897880',
      gtfsRtUrls: ['https://proxy.transport.data.gouv.fr/resource/mat-saint-malo-gtfs-rt-trip-update'],
      showAlerts: true,
      refreshInterval: 20
    }
  }
]

const STORAGE_KEY = 'gtfs-departure-board-config'

export const URLBuilder: React.FC = () => {
  const { t, i18n } = useTranslation()

  // Load from localStorage on mount
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    return null
  }

  const stored = loadFromStorage()

  const [gtfsUrl, setGtfsUrl] = useState(stored?.gtfsUrl || '')
  const [gtfsRtUrls, setGtfsRtUrls] = useState(stored?.gtfsRtUrls || '')
  const [stopIds, setStopIds] = useState(stored?.stopIds || '')
  const [showAlerts, setShowAlerts] = useState(stored?.showAlerts ?? false)
  const [refreshInterval, setRefreshInterval] = useState(stored?.refreshInterval || '20')
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(stored?.showTechnicalDetails ?? false)
  const [showDebug, setShowDebug] = useState(stored?.showDebug ?? false)
  const [primaryColor, setPrimaryColor] = useState(stored?.primaryColor || '3b82f6')
  const [secondaryColor, setSecondaryColor] = useState(stored?.secondaryColor || 'f97316')
  const [logoUrl, setLogoUrl] = useState(stored?.logoUrl || '')
  const [customAlertMessage, setCustomAlertMessage] = useState(stored?.customAlertMessage || '')
  const [showPreview, setShowPreview] = useState(false)
  const [showStopSelector, setShowStopSelector] = useState(false)
  const [showDatasetSearch, setShowDatasetSearch] = useState(false)

  // Save to localStorage whenever values change
  React.useEffect(() => {
    const config = {
      gtfsUrl,
      gtfsRtUrls,
      stopIds,
      showAlerts,
      refreshInterval,
      showTechnicalDetails,
      showDebug,
      primaryColor,
      secondaryColor,
      logoUrl,
      customAlertMessage
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [gtfsUrl, gtfsRtUrls, stopIds, showAlerts, refreshInterval, showTechnicalDetails, showDebug, primaryColor, secondaryColor, logoUrl, customAlertMessage])

  const buildUrl = (): string => {
    const params = new URLSearchParams()
    if (gtfsUrl) params.set('gtfsUrl', gtfsUrl)
    if (gtfsRtUrls) params.set('gtfsRtUrls', gtfsRtUrls)
    if (stopIds) params.set('stops', stopIds)
    if (showAlerts) params.set('showAlerts', 'true')
    if (refreshInterval) params.set('refresh', refreshInterval)
    if (showTechnicalDetails) params.set('tech', 'true')
    if (showDebug) params.set('debug', 'true')
    if (primaryColor !== '3b82f6') params.set('primaryColor', primaryColor)
    if (secondaryColor !== 'f97316') params.set('secondaryColor', secondaryColor)
    if (logoUrl) params.set('logoUrl', logoUrl)
    if (customAlertMessage) params.set('customAlertMessage', customAlertMessage)
    params.set('lang', i18n.language)

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  const getConfig = (): AppConfig => ({
    gtfsUrl: gtfsUrl || undefined,
    gtfsRtUrls: gtfsRtUrls ? gtfsRtUrls.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    stopIds: stopIds ? stopIds.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    showAlerts,
    refreshInterval: parseInt(refreshInterval) || 20,
    showTechnicalDetails,
    showDebug,
    primaryColor,
    secondaryColor,
    logoUrl: logoUrl || undefined,
    customAlertMessage: customAlertMessage || undefined
  })

  const applyPreset = (preset: Preset) => {
    if (preset.config.gtfsUrl) setGtfsUrl(preset.config.gtfsUrl)
    if (preset.config.gtfsRtUrls) setGtfsRtUrls(preset.config.gtfsRtUrls.join(', '))
    if (preset.config.stopIds) setStopIds(preset.config.stopIds.join(', '))
    if (preset.config.showAlerts !== undefined) setShowAlerts(preset.config.showAlerts)
    if (preset.config.refreshInterval) setRefreshInterval(preset.config.refreshInterval.toString())
    // Don't override color/tech settings when applying preset
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleCopyUrl = () => {
    const url = buildUrl()
    navigator.clipboard.writeText(url)
  }

  const handleSelectStops = (selectedStopIds: string[]) => {
    // Append to existing stops
    const existingStops = stopIds ? stopIds.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    const newStops = [...new Set([...existingStops, ...selectedStopIds])]
    setStopIds(newStops.join(', '))
  }

  const handleOpenStopSelector = () => {
    if (!gtfsUrl) {
      alert(t('stopSelector.noGtfsUrl'))
      return
    }
    setShowStopSelector(true)
  }

  const handleSelectDataset = (selectedGtfsUrl: string, selectedGtfsRtUrls: string[]) => {
    setGtfsUrl(selectedGtfsUrl)
    setGtfsRtUrls(selectedGtfsRtUrls.join(', '))
    // Clear stop IDs when switching datasets
    setStopIds('')
  }

  const isValid = gtfsUrl && stopIds

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-primary-700">
              {t('urlBuilder.title')}
            </h1>
            <LanguageSelector />
          </div>

          {/* Presets */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('urlBuilder.quickStart')}</h2>
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

          {/* Dataset Search Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowDatasetSearch(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-md hover:shadow-lg font-semibold text-lg"
            >
              🇫🇷 {t('urlBuilder.searchFrenchDatasets')}
            </button>
          </div>

          <div className="mb-6 text-center text-gray-500 text-sm">
            {t('urlBuilder.orManualEntry')}
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('urlBuilder.gtfsUrl')} <span className="text-red-500">{t('urlBuilder.required')}</span>
              </label>
              <input
                type="text"
                value={gtfsUrl}
                onChange={(e) => setGtfsUrl(e.target.value)}
                placeholder={t('urlBuilder.gtfsUrlPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{t('urlBuilder.gtfsUrlHelp')}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('urlBuilder.gtfsRtUrls')}
              </label>
              <input
                type="text"
                value={gtfsRtUrls}
                onChange={(e) => setGtfsRtUrls(e.target.value)}
                placeholder={t('urlBuilder.gtfsRtUrlsPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{t('urlBuilder.gtfsRtUrlsHelp')}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('urlBuilder.stopIds')} <span className="text-red-500">{t('urlBuilder.required')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stopIds}
                  onChange={(e) => setStopIds(e.target.value)}
                  placeholder={t('urlBuilder.stopIdsPlaceholder')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleOpenStopSelector}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap"
                >
                  {t('urlBuilder.browseStops')}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('urlBuilder.stopIdsHelp')}</p>
            </div>

            {/* Refresh Interval */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('urlBuilder.refreshInterval')}
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

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showAlerts"
                  checked={showAlerts}
                  onChange={(e) => setShowAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="showAlerts" className="ml-2 text-sm font-semibold text-gray-700">
                  {t('urlBuilder.showAlerts')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTechnicalDetails"
                  checked={showTechnicalDetails}
                  onChange={(e) => setShowTechnicalDetails(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="showTechnicalDetails" className="ml-2 text-sm font-semibold text-gray-700">
                  Show Technical Details
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showDebug"
                  checked={showDebug}
                  onChange={(e) => setShowDebug(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="showDebug" className="ml-2 text-sm font-semibold text-gray-700">
                  Show Debug Panel (Raw GTFS Data)
                </label>
              </div>
            </div>

            {/* Color Theme */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Color Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={`#${primaryColor}`}
                      onChange={(e) => setPrimaryColor(e.target.value.substring(1))}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value.replace(/[^0-9a-fA-F]/g, '').substring(0, 6))}
                      placeholder="3b82f6"
                      maxLength={6}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Default: 3b82f6 (blue)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={`#${secondaryColor}`}
                      onChange={(e) => setSecondaryColor(e.target.value.substring(1))}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value.replace(/[^0-9a-fA-F]/g, '').substring(0, 6))}
                      placeholder="f97316"
                      maxLength={6}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Default: f97316 (orange)</p>
                </div>
              </div>
            </div>

            {/* Branding & Alerts */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('urlBuilder.brandingAlerts')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('urlBuilder.logoUrl')}
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder={t('urlBuilder.logoUrlPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('urlBuilder.logoUrlHelp')}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('urlBuilder.customAlertMessage')}
                  </label>
                  <textarea
                    value={customAlertMessage}
                    onChange={(e) => setCustomAlertMessage(e.target.value)}
                    placeholder={t('urlBuilder.customAlertPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('urlBuilder.customAlertHelp')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated URL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('urlBuilder.generatedUrl')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={buildUrl()}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('urlBuilder.copy')}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!isValid}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isValid
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('urlBuilder.previewBelow')}
            </button>
            <a
              href={isValid ? buildUrl() : undefined}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors inline-block text-center ${
                isValid
                  ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
              }`}
            >
              {t('urlBuilder.goToDepartureBoard')}
            </a>
          </div>
        </div>

        {/* Preview */}
        {showPreview && isValid && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{t('urlBuilder.livePreview')}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                {t('urlBuilder.hidePreview')}
              </button>
            </div>
            <div className="border-t pt-4">
              <DepartureBoard config={getConfig()} />
            </div>
          </div>
        )}

        {/* Stop Selector Modal */}
        {showStopSelector && (
          <StopSelector
            gtfsUrl={gtfsUrl}
            onSelectStops={handleSelectStops}
            onClose={() => setShowStopSelector(false)}
          />
        )}

        {/* Dataset Search Modal */}
        {showDatasetSearch && (
          <TransportDatasetSearch
            onSelectDataset={handleSelectDataset}
            onClose={() => setShowDatasetSearch(false)}
          />
        )}
      </div>
    </div>
  )
}
