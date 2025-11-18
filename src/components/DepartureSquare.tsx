import React from 'react'
import { FormattedTime } from '../utils/timeFormat'

interface DepartureSquareProps {
  time: FormattedTime
  isRealtime: boolean
  isLastDeparture: boolean
}

export const DepartureSquare: React.FC<DepartureSquareProps> = ({
  time,
  isRealtime,
  isLastDeparture
}) => {
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        min-w-[5rem] h-20 rounded-lg shadow-md
        ${isRealtime ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-800'}
      `}
    >
      <div className={`text-2xl font-bold ${time.isMinutes ? 'mb-1' : ''}`}>
        {time.display}
      </div>
      {time.subDisplay && (
        <div className="text-xs opacity-80">
          {time.subDisplay}
        </div>
      )}
      {isLastDeparture && (
        <div className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[0.6rem] px-1 rounded">
          LAST
        </div>
      )}
    </div>
  )
}
