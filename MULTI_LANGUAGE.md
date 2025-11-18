# Multi-Language Interface Solutions

This document outlines different approaches for implementing multi-language support in the GTFS Departure Board application.

## Solution 1: react-i18next (Recommended)

The most popular and feature-rich solution for React applications.

### Installation

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Setup

```typescript
// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'departure_board': 'Departure Board',
          'loading': 'Loading GTFS data...',
          'no_departures': 'No more departures today',
          'last_departure': 'LAST',
          'browse_stops': 'Browse Stops',
          'select_stops': 'Select Stops',
          'stop_ids': 'Stop IDs',
          'refresh_interval': 'Refresh Interval',
          'show_alerts': 'Show Alerts'
        }
      },
      fr: {
        translation: {
          'departure_board': 'Tableau des Départs',
          'loading': 'Chargement des données GTFS...',
          'no_departures': 'Plus de départs aujourd\'hui',
          'last_departure': 'DERNIER',
          'browse_stops': 'Parcourir les Arrêts',
          'select_stops': 'Sélectionner les Arrêts',
          'stop_ids': 'IDs des Arrêts',
          'refresh_interval': 'Intervalle de Rafraîchissement',
          'show_alerts': 'Afficher les Alertes'
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next'

export const DepartureBoard: React.FC = () => {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('departure_board')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>
        Français
      </button>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  )
}
```

### Pros
- Automatic browser language detection
- Lazy loading of translations
- Pluralization and interpolation
- Large community and ecosystem
- TypeScript support

### Cons
- Adds ~50KB to bundle size
- Requires learning i18next API

## Solution 2: react-intl (FormatJS)

A comprehensive internationalization library with formatting utilities.

### Installation

```bash
npm install react-intl
```

### Setup

```typescript
import { IntlProvider } from 'react-intl'

const messages = {
  en: {
    'departure_board': 'Departure Board',
    'minutes': '{count, plural, one {# minute} other {# minutes}}'
  },
  fr: {
    'departure_board': 'Tableau des Départs',
    'minutes': '{count, plural, one {# minute} other {# minutes}}'
  }
}

function App() {
  const [locale, setLocale] = useState('en')

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <DepartureBoard />
    </IntlProvider>
  )
}
```

### Usage

```typescript
import { useIntl, FormattedMessage } from 'react-intl'

export const DepartureBoard: React.FC = () => {
  const intl = useIntl()

  return (
    <div>
      <h1><FormattedMessage id="departure_board" /></h1>
      <p>{intl.formatMessage({ id: 'minutes' }, { count: 5 })}</p>
    </div>
  )
}
```

### Pros
- Excellent date, time, and number formatting
- Strong TypeScript support
- Message extraction tools
- Good for complex formatting needs

### Cons
- Heavier than i18next
- More verbose API

## Solution 3: URL Parameter Approach (Lightweight)

Simple approach using URL parameters, no additional dependencies.

### Implementation

```typescript
// src/utils/i18n.ts
type Locale = 'en' | 'fr'

const translations = {
  en: {
    departure_board: 'Departure Board',
    loading: 'Loading GTFS data...',
    no_departures: 'No more departures today'
  },
  fr: {
    departure_board: 'Tableau des Départs',
    loading: 'Chargement des données GTFS...',
    no_departures: 'Plus de départs aujourd\'hui'
  }
}

export function getLocale(): Locale {
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')
  return (lang === 'fr' ? 'fr' : 'en') as Locale
}

export function t(key: keyof typeof translations.en): string {
  const locale = getLocale()
  return translations[locale][key] || translations.en[key]
}
```

### Usage in Components

```typescript
import { t, getLocale } from '../utils/i18n'

export const DepartureBoard: React.FC = () => {
  const locale = getLocale()

  return (
    <div>
      <h1>{t('departure_board')}</h1>
      <a href="?lang=en">English</a>
      <a href="?lang=fr">Français</a>
    </div>
  )
}
```

### Pros
- Zero dependencies
- Very lightweight
- Simple to implement
- URL-based (shareable links preserve language)

### Cons
- No browser language detection
- No pluralization/formatting
- Manual implementation required

## Solution 4: Context API + Custom Hook

Medium complexity solution using React Context.

### Implementation

```typescript
// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react'

type Locale = 'en' | 'fr'

const translations = {
  en: { /* ... */ },
  fr: { /* ... */ }
}

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en')

  const t = (key: string) => {
    return translations[locale][key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
```

### Usage

```typescript
// In App.tsx
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <DepartureBoard />
    </LanguageProvider>
  )
}

// In components
import { useLanguage } from '../contexts/LanguageContext'

export const DepartureBoard: React.FC = () => {
  const { t, setLocale } = useLanguage()

  return (
    <div>
      <h1>{t('departure_board')}</h1>
      <button onClick={() => setLocale('fr')}>Français</button>
    </div>
  )
}
```

### Pros
- No external dependencies
- React-native approach
- Type-safe with proper TypeScript setup
- Centralized state management

### Cons
- More boilerplate than libraries
- Manual implementation of features

## Recommendation

**For this project, I recommend Solution 1 (react-i18next)** because:

1. **Zero configuration needed** - Automatic browser language detection
2. **Perfect for transit apps** - Good support for time/date formatting
3. **Community** - Well-maintained, widely used
4. **Future-proof** - Easy to add more languages later
5. **GTFS context** - Many GTFS feeds serve multilingual areas

## Implementation Strategy

1. Start with English and French
2. Add language selector to URL Builder
3. Store preference in localStorage
4. Add more languages based on GTFS feed coverage
5. Use translation keys that match GTFS terminology

## File Structure

```
src/
├── locales/
│   ├── en.json
│   ├── fr.json
│   ├── es.json
│   └── de.json
├── i18n.ts
└── components/
    └── LanguageSelector.tsx
```

## Next Steps

1. Choose a solution based on your requirements
2. Extract all hardcoded strings
3. Create translation files
4. Add language selector UI
5. Test with different locales
