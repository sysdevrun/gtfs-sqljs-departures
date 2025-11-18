import React from 'react'
import { buildExampleUrl } from '../utils/urlParams'

export const HelpMessage: React.FC = () => {
  const exampleUrl = buildExampleUrl()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-3xl bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-6">
          GTFS Departure Board
        </h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            How to Use
          </h2>
          <p className="text-gray-600 mb-4">
            Configure the departure board using URL parameters:
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-primary-600 mb-2">Required Parameters:</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <code className="bg-gray-200 px-2 py-1 rounded">gtfsUrl</code> - URL to GTFS static feed (ZIP file)
              </li>
              <li>
                <code className="bg-gray-200 px-2 py-1 rounded">stops</code> - Comma-separated stop IDs (e.g., <code>1001,1002,1003</code>)
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary-600 mb-2">Optional Parameters:</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <code className="bg-gray-200 px-2 py-1 rounded">gtfsRtUrls</code> - Comma-separated GTFS-RT feed URLs for realtime updates
              </li>
              <li>
                <code className="bg-gray-200 px-2 py-1 rounded">showAlerts</code> - Set to <code>true</code> to show alerts panel
              </li>
              <li>
                <code className="bg-gray-200 px-2 py-1 rounded">refresh</code> - Refresh interval in seconds (default: 20)
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Example URL:</h3>
          <div className="bg-primary-50 p-3 rounded border border-primary-200 break-all text-sm">
            <a
              href={exampleUrl}
              className="text-primary-600 hover:text-primary-800 underline"
            >
              {exampleUrl}
            </a>
          </div>
        </div>

        <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> All remote GTFS URLs will be proxied automatically for CORS compatibility.
          </p>
        </div>
      </div>
    </div>
  )
}
