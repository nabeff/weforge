'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import type { Header } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { HeaderNav } from './Nav'
import { LocaleSwitcher } from './LocaleSwitcher'
import { CMSLink } from '@/components/Link'

type LocalizedString = string | Record<string, string> | null | undefined

const getLocalized = (
  value: LocalizedString,
  locale: TypedLocale,
  fallback: TypedLocale = 'en',
) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] ?? value[fallback] ?? ''
}

export const HEADER_HEIGHT_PX = 96

interface HeaderClientProps {
  data: Header
  locale: TypedLocale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const brandTitle = useMemo(
    () => getLocalized((data as any)?.brandTitle, locale) || 'Forge.',
    [data, locale],
  )

  const ctaEnabled = Boolean((data as any)?.headerCTA?.enabled)
  const ctaLink = (data as any)?.headerCTA?.link

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1100] pointer-events-auto"
        style={{ height: HEADER_HEIGHT_PX }}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {/* ✅ KEY: isolate stacking context so z-index is deterministic */}
        <div className="relative h-full isolate">
          <div className="container h-full">
            <div className="h-full flex justify-between items-center">
              {/* ✅ Logo: force top-most */}
              <div className="relative z-[1400]">
                <h2 className="font-bold text-3xl leading-none">{brandTitle}</h2>
              </div>

              {/* ✅ Nav */}
              <div className="relative z-[1300]">
                <HeaderNav data={data} locale={locale} />
              </div>

              {/* ✅ Locale + CTA */}
              <div className="relative z-[1300] flex items-center gap-8">
                <LocaleSwitcher />
                {ctaEnabled && ctaLink ? (
                  <CMSLink {...ctaLink} locale={locale} className="whitespace-nowrap" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: HEADER_HEIGHT_PX }} aria-hidden />
    </>
  )
}
