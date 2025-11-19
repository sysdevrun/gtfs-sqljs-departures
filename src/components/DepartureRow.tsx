import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteIcon } from './RouteIcon'
import { DepartureSquare } from './DepartureSquare'
import { RouteDirectionGroup } from '../types'
import { formatDepartureTime } from '../utils/timeFormat'

interface DepartureRowProps {
  group: RouteDirectionGroup
  timezone: string
  now: Date
  showTechnicalDetails: boolean
}

export const DepartureRow: React.FC<DepartureRowProps> = ({ group, timezone, now, showTechnicalDetails }) => {
  const { t } = useTranslation()
  const headsign = group.headsigns[0] || 'Unknown Destination'
  const upcomingDepartures = group.departures.slice(0, 2)

  return (
    <div className="adaptive-row flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
      {/* Mobile layout: Route icon only */}
      <div className="flex-shrink-0 md:hidden">
        <RouteIcon
          routeShortName={group.routeShortName}
          routeColor={group.routeColor}
          routeTextColor={group.routeTextColor}
          className="adaptive-route-icon"
        />
      </div>

      {/* Desktop layout: Route icon only */}
      <div className="hidden md:block md:flex-shrink-0">
        <RouteIcon
          routeShortName={group.routeShortName}
          routeColor={group.routeColor}
          routeTextColor={group.routeTextColor}
          className="adaptive-route-icon"
        />
      </div>

      {/* Headsign */}
      <div className="flex-grow min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {headsign}
        </div>
      </div>

      {/* Departure times */}
      <div className="flex gap-2">
        {upcomingDepartures.length === 0 ? (
          <div className={`adaptive-departure-square ${showTechnicalDetails ? 'with-tech' : ''} flex items-center justify-center min-w-[10rem] rounded-lg bg-gray-100 text-gray-500 text-sm px-4`}>
            {t('departureBoard.noMoreDepartures')}
          </div>
        ) : (
          <>
            {upcomingDepartures.map((departure, index) => (
              <DepartureSquare
                key={`${departure.tripId}-${index}`}
                time={formatDepartureTime(departure.departureTime, timezone, now)}
                isRealtime={departure.isRealtime}
                isLastDeparture={departure.isLastDeparture}
                tripShortName={departure.tripShortName}
                showTechnicalDetails={showTechnicalDetails}
              />
            ))}
            {upcomingDepartures.length === 1 && (
              <div className={`adaptive-departure-square ${showTechnicalDetails ? 'with-tech' : ''} min-w-[5rem] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs`}>
                -
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
