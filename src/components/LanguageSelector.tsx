import React from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation()

  const languages = [
    { code: 'en', label: t('language.en') },
    { code: 'fr', label: t('language.fr') },
    { code: 'es', label: t('language.es') },
    { code: 'de', label: t('language.de') }
  ]

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {t('language.selector')}:
      </label>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
