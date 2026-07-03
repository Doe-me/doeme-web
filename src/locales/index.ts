import { createI18n } from 'vue-i18n'
import ptBR from './pt-BR.json'
import enUS from './en-US.json'
import esES from './es-ES.json'

export const SUPPORTED_LOCALES = ['pt-BR', 'en-US', 'es-ES'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
  'es-ES': 'Español',
}

const STORAGE_KEY = 'doeme_locale'
const DEFAULT_LOCALE: SupportedLocale = 'pt-BR'

const isSupportedLocale = (value: string | null): value is SupportedLocale =>
  !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)

export const getStoredLocale = (): SupportedLocale => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isSupportedLocale(stored) ? stored : DEFAULT_LOCALE
}

export const setStoredLocale = (locale: SupportedLocale): void => {
  localStorage.setItem(STORAGE_KEY, locale)
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es-ES': esES,
  },
})

export default i18n
