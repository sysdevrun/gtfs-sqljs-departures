import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormattedTime } from '../utils/timeFormat'

interface DepartureSquareProps {
  time: FormattedTime
  isRealtime: boolean
  isLastDeparture: boolean
  tripShortName?: string
  showTechnicalDetails: boolean
}

export const DepartureSquare: React.FC<DepartureSquareProps> = ({
  time,
  isRealtime,
  isLastDeparture,
  tripShortName,
  showTechnicalDetails
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        min-w-[5rem] ${showTechnicalDetails && tripShortName ? 'h-24' : 'h-20'} rounded-lg shadow-md
        ${isRealtime ? 'bg-green-700 text-white' : 'bg-gray-600 text-white'}
      `}
    >
      <div className={`text-2xl font-bold ${time.isMinutes ? 'mb-1' : ''}`}>
        {time.display}
      </div>
      {time.subDisplay && (
        <div className="text-xs opacity-90">
          {time.subDisplay}
        </div>
      )}
      {showTechnicalDetails && tripShortName && (
        <div className="text-[0.6rem] opacity-80 mt-1">
          {tripShortName}
        </div>
      )}
      {isLastDeparture && (
        <div className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[0.6rem] px-1 rounded">
          {t('departureBoard.lastDeparture')}
        </div>
      )}
    </div>
  )
}
