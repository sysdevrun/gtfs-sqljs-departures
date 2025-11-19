import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface TransportResource {
  datagouv_id: string
  format: string
  id: number
  is_available: boolean
  original_url?: string
  url?: string
  title: string
  type: string
  features?: string[]
}

interface TransportDataset {
  id: string
  title: string
  slug: string
  type: string
  resources: TransportResource[]
  publisher: {
    name: string
  }
  covered_area?: Array<{
    nom: string
  }>
}

interface TransportDatasetSearchProps {
  onSelectDataset: (gtfsUrl: string, gtfsRtUrls: string[]) => void
  onClose: () => void
}

export const TransportDatasetSearch: React.FC<TransportDatasetSearchProps> = ({ onSelectDataset, onClose }) => {
  const { t } = useTranslation()
  const [datasets, setDatasets] = useState<TransportDataset[]>([])
  const [filteredDatasets, setFilteredDatasets] = useState<TransportDataset[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDataset, setSelectedDataset] = useState<TransportDataset | null>(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://transport.data.gouv.fr/api/datasets')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Filter only public-transit datasets with available GTFS resources
        const publicTransitDatasets = data.filter((dataset: TransportDataset) =>
          dataset.type === 'public-transit' &&
          dataset.resources &&
          dataset.resources.some((r: TransportResource) =>
            r.format === 'GTFS' && r.is_available
          )
        )

        setDatasets(publicTransitDatasets)
        setFilteredDatasets(publicTransitDatasets)
      } catch (err) {
        console.error('Error fetching datasets:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDatasets(datasets)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = datasets.filter(dataset =>
        dataset.title.toLowerCase().includes(query) ||
        dataset.publisher?.name.toLowerCase().includes(query) ||
        dataset.covered_area?.some(area => area.nom.toLowerCase().includes(query))
      )
      setFilteredDatasets(filtered)
    }
  }, [searchQuery, datasets])

  const handleSelectDataset = (dataset: TransportDataset) => {
    setSelectedDataset(dataset)
  }

  const handleConfirmSelection = () => {
    if (!selectedDataset) return

    // Extract GTFS URL - prefer original_url, fallback to url
    const gtfsResource = selectedDataset.resources.find(r => r.format === 'GTFS' && r.is_available)
    const gtfsUrl = gtfsResource?.original_url || gtfsResource?.url || ''

    // Extract GTFS-RT URLs
    const gtfsRtResources = selectedDataset.resources.filter(r =>
      r.format === 'gtfs-rt' && r.is_available
    )
    const gtfsRtUrls = gtfsRtResources.map(r => r.original_url || r.url || '').filter(Boolean)

    onSelectDataset(gtfsUrl, gtfsRtUrls)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('datasetSearch.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            {t('stopSelector.close')}
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('datasetSearch.searchPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
          <p className="text-sm text-gray-600 mt-2">
            {loading ? t('datasetSearch.loading') : t('datasetSearch.datasetsFound', { count: filteredDatasets.length })}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8 text-gray-500">
              {t('datasetSearch.loading')}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 font-semibold mb-2">{t('datasetSearch.error')}</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredDatasets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t('datasetSearch.noResults')}
            </div>
          )}

          {!loading && !error && filteredDatasets.length > 0 && (
            <div className="space-y-3">
              {filteredDatasets.map((dataset) => {
                const isSelected = selectedDataset?.id === dataset.id
                const gtfsResource = dataset.resources.find(r => r.format === 'GTFS')
                const gtfsRtResources = dataset.resources.filter(r => r.format === 'gtfs-rt')
                const coveredAreas = dataset.covered_area?.slice(0, 3).map(a => a.nom).join(', ') || ''

                return (
                  <div
                    key={dataset.id}
                    onClick={() => handleSelectDataset(dataset)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {dataset.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {dataset.publisher?.name}
                        </p>
                        {coveredAreas && (
                          <p className="text-xs text-gray-500 mb-2">
                            {t('datasetSearch.coverage')}: {coveredAreas}
                            {dataset.covered_area && dataset.covered_area.length > 3 && '...'}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {gtfsResource && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              GTFS
                            </span>
                          )}
                          {gtfsRtResources.length > 0 && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {gtfsRtResources.length} GTFS-RT {gtfsRtResources.length > 1 ? 'feeds' : 'feed'}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-4">
                          <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Show resource details when selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-1">
                        {gtfsResource && (
                          <div className="font-mono text-gray-600 break-all">
                            <span className="font-semibold">GTFS:</span> {gtfsResource.original_url || gtfsResource.url}
                          </div>
                        )}
                        {gtfsRtResources.map((resource, idx) => (
                          <div key={resource.id} className="font-mono text-gray-600 break-all">
                            <span className="font-semibold">GTFS-RT {idx + 1}:</span> {resource.original_url || resource.url}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('stopSelector.cancel')}
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedDataset}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedDataset
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('datasetSearch.selectDataset')}
          </button>
        </div>
      </div>
    </div>
  )
}
