import React from 'react'
import { formatInTimeZone } from 'date-fns-tz'

interface TechnicalDetailsPanelProps {
  timezone: string
  agencyName: string
  lastRenderTime: Date
}

export const TechnicalDetailsPanel: React.FC<TechnicalDetailsPanelProps> = ({
  timezone,
  agencyName,
  lastRenderTime
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Details</h3>
      <div className="space-y-2 text-sm">
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
      </div>
    </div>
  )
}
