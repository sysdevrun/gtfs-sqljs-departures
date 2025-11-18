import React, { useState, useEffect } from 'react'
import { GtfsSqlJs } from 'gtfs-sqljs'
import { proxyUrl } from '../utils/proxy'

interface Stop {
  stop_id: string
  stop_name: string
  stop_code?: string
  stop_desc?: string
}

interface StopSelectorProps {
  gtfsUrl: string
  onSelectStops: (stopIds: string[]) => void
  onClose: () => void
}

export const StopSelector: React.FC<StopSelectorProps> = ({ gtfsUrl, onSelectStops, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stops, setStops] = useState<Stop[]>([])
  const [filteredStops, setFilteredStops] = useState<Stop[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStops, setSelectedStops] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadGtfs = async () => {
      if (!gtfsUrl) return

      try {
        setLoading(true)
        setError(null)

        const proxiedUrl = proxyUrl(gtfsUrl)
        const gtfsInstance = await GtfsSqlJs.fromZip(proxiedUrl, {
          skipFiles: ['shapes.txt', 'frequencies.txt', 'pathways.txt', 'levels.txt', 'translations.txt']
        })

        const allStops = gtfsInstance.getStops()
        setStops(allStops as Stop[])
        setFilteredStops(allStops as Stop[])
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load GTFS data')
        setLoading(false)
      }
    }

    loadGtfs()
  }, [gtfsUrl])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStops(stops)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = stops.filter(
      (stop) =>
        stop.stop_name?.toLowerCase().includes(query) ||
        stop.stop_id?.toLowerCase().includes(query) ||
        stop.stop_code?.toLowerCase().includes(query)
    )
    setFilteredStops(filtered.slice(0, 100)) // Limit to 100 results
  }, [searchQuery, stops])

  const toggleStop = (stopId: string) => {
    const newSelected = new Set(selectedStops)
    if (newSelected.has(stopId)) {
      newSelected.delete(stopId)
    } else {
      newSelected.add(stopId)
    }
    setSelectedStops(newSelected)
  }

  const handleConfirm = () => {
    onSelectStops(Array.from(selectedStops))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Select Stops</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-gray-600">Loading GTFS data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stops by name, ID, or code..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                {filteredStops.length} stop{filteredStops.length !== 1 ? 's' : ''} found
                {selectedStops.size > 0 && ` • ${selectedStops.size} selected`}
              </p>
            </>
          )}
        </div>

        {!loading && !error && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {filteredStops.map((stop) => (
                  <div
                    key={stop.stop_id}
                    onClick={() => toggleStop(stop.stop_id)}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-colors
                      ${
                        selectedStops.has(stop.stop_id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {stop.stop_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {stop.stop_id}
                          {stop.stop_code && ` • Code: ${stop.stop_code}`}
                        </div>
                        {stop.stop_desc && (
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {stop.stop_desc}
                          </div>
                        )}
                      </div>
                      {selectedStops.has(stop.stop_id) && (
                        <div className="ml-2 text-primary-500 flex-shrink-0">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedStops.size === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedStops.size > 0
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add {selectedStops.size} Stop{selectedStops.size !== 1 ? 's' : ''}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
