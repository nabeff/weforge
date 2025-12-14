'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import type { TypedLocale } from 'payload'
import { buildLocalizedPath } from '@/utilities/localePath'

export function useLocaleSwitch() {
  const locale = useLocale() as TypedLocale
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  function switchTo(nextLocale: TypedLocale) {
    if (nextLocale === locale) return

    startTransition(() => {
      router.replace(
        buildLocalizedPath({
          pathname,
          currentLocale: locale,
          nextLocale,
        }),
      )
    })
  }

  return { locale, switchTo }
}
