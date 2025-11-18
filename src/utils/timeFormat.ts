import { format, differenceInMinutes } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export interface FormattedTime {
  display: string
  subDisplay?: string
  isMinutes: boolean
}

export const formatDepartureTime = (
  departureTime: Date,
  timezone: string,
  now: Date = new Date()
): FormattedTime => {
  const zonedDeparture = toZonedTime(departureTime, timezone)
  const zonedNow = toZonedTime(now, timezone)

  const minutesUntil = differenceInMinutes(zonedDeparture, zonedNow)

  if (minutesUntil <= 59) {
    // Show minutes with HH:MM below
    return {
      display: `${minutesUntil}'`,
      subDisplay: format(zonedDeparture, 'HH:mm'),
      isMinutes: true
    }
  } else {
    // Show HH:MM only
    return {
      display: format(zonedDeparture, 'HH:mm'),
      isMinutes: false
    }
  }
}

export const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const color = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
