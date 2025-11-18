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
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Alerts</h2>
        <p className="text-gray-500 text-sm">No active alerts</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border-l-4 border-secondary-500 bg-secondary-50 p-4 rounded"
          >
            <h3 className="font-semibold text-gray-800 mb-1">
              {alert.headerText}
            </h3>
            {alert.effect && (
              <div className="text-xs text-secondary-700 mb-2">
                Effect: {alert.effect}
              </div>
            )}
            <p className="text-sm text-gray-700">
              {alert.descriptionText}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
