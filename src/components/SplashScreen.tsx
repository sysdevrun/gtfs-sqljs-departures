import React from 'react'
import { useTranslation } from 'react-i18next'

interface SplashScreenProps {
  message?: string
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  const { t } = useTranslation()

  const [funMessageKey] = React.useState(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7']
    return keys[Math.floor(Math.random() * keys.length)]
  })

  const funMessage = t(`splash.messages.${funMessageKey}`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          {t('splash.title')}
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
