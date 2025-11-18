import React from 'react'

interface SplashScreenProps {
  message?: string
}

const funMessages = [
  "Calculating optimal departure angles... 🚌",
  "Synchronizing with the transit gods... ⏰",
  "Decoding GTFS hieroglyphics... 📜",
  "Warming up the departure engines... 🚀",
  "Loading routes from the cloud... ☁️",
  "Teaching buses to tell time... 🕐",
  "Organizing chaos into schedules... 📊"
]

export const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  const [funMessage] = React.useState(() =>
    funMessages[Math.floor(Math.random() * funMessages.length)]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          GTFS Departure Board
        </h1>
        <p className="text-white text-xl mb-2">
          {message || funMessage}
        </p>
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
