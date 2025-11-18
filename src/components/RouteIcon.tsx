import React from 'react'
import { getContrastColor } from '../utils/timeFormat'

interface RouteIconProps {
  routeShortName: string
  routeColor: string
  routeTextColor?: string
  className?: string
}

export const RouteIcon: React.FC<RouteIconProps> = ({
  routeShortName,
  routeColor,
  routeTextColor,
  className = ''
}) => {
  // Ensure color has # prefix
  const bgColor = routeColor.startsWith('#') ? routeColor : `#${routeColor}`
  const textColor = routeTextColor
    ? (routeTextColor.startsWith('#') ? routeTextColor : `#${routeTextColor}`)
    : getContrastColor(bgColor)

  return (
    <div
      className={`inline-flex items-center justify-center font-bold rounded px-2 py-1 min-w-[3rem] ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor
      }}
    >
      {routeShortName}
    </div>
  )
}
