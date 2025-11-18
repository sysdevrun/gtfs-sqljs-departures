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
        adaptive-departure-square ${showTechnicalDetails && tripShortName ? 'with-tech' : ''}
        relative flex flex-col items-center justify-center
        min-w-[5rem] rounded-lg shadow-md
        ${isRealtime ? 'bg-green-700 text-white' : 'bg-gray-600 text-white'}
      `}
    >
      <div className={`font-bold ${time.isMinutes ? 'text-xl mb-1' : 'text-2xl'}`}>
        {time.display}
      </div>
      {time.subDisplay && (
        <div className="text-sm opacity-90">
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
