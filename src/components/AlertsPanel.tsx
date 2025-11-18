import React from 'react'

interface Alert {
  id: string
  headerText: string
  descriptionText: string
  effect: string
}

interface AlertsPanelProps {
  alerts: Alert[]
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-auto">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border-l-4 border-secondary-500 bg-secondary-50 p-4 rounded"
          >
            <h3 className="font-semibold text-gray-800 mb-1">
              {alert.headerText}
            </h3>
            <p className="text-sm text-gray-700">
              {alert.descriptionText}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
