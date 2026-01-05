'use client'

import type { TypedLocale } from 'payload'
import { useLocaleSwitch } from '@/hooks/useLocaleSwitch'

export function LocaleSwitcher() {
  const { locale, switchTo } = useLocaleSwitch()

  const isFR = locale === 'fr'
  const isEN = locale === 'en'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => switchTo('fr' as TypedLocale)}
        aria-current={isFR ? 'true' : undefined}
        className={[
          'link-hover-swap',
          'text-base  tracking-wide',
          // ✅ hover should NOT turn white, only active is white
          isFR ? 'text-white opacity-100 ' : 'text-white/60 hover:text-white/60',
        ].join(' ')}
      >
        <span className="link-hover-swap__inner" data-text="Fr">
          Fr
        </span>
      </button>

      {/* ✅ removed the vertical line */}

      <button
        type="button"
        onClick={() => switchTo('en' as TypedLocale)}
        aria-current={isEN ? 'true' : undefined}
        className={[
          'link-hover-swap',
          'text-base  tracking-wide',
          // ✅ hover should NOT turn white, only active is white
          isEN ? 'text-white opacity-100 ' : 'text-white/60 hover:text-white/60',
        ].join(' ')}
      >
        <span className="link-hover-swap__inner" data-text="En">
          En
        </span>
      </button>
    </div>
  )
}
