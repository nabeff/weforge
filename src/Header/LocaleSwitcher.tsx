'use client'

import type { TypedLocale } from 'payload'
import { useLocaleSwitch } from '@/hooks/useLocaleSwitch'

export function LocaleSwitcher() {
  const { locale, switchTo } = useLocaleSwitch()

  const isFR = locale === 'fr'
  const isEN = locale === 'en'

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => switchTo('fr' as TypedLocale)}
        className={[
          'text-sm uppercase tracking-wide transition-opacity',
          isFR ? 'opacity-100 font-semibold' : 'opacity-60 hover:opacity-100',
        ].join(' ')}
        aria-current={isFR ? 'true' : undefined}
      >
        FR
      </button>

      <span className="opacity-40">|</span>

      <button
        type="button"
        onClick={() => switchTo('en' as TypedLocale)}
        className={[
          'text-sm uppercase tracking-wide transition-opacity',
          isEN ? 'opacity-100 font-semibold' : 'opacity-60 hover:opacity-100',
        ].join(' ')}
        aria-current={isEN ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  )
}
