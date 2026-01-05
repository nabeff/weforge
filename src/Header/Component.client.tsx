'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { HeaderNav } from './Nav'
import { LocaleSwitcher } from './LocaleSwitcher'
import { CMSLink } from '@/components/Link'

export const HEADER_HEIGHT_PX = 96

interface HeaderClientProps {
  data: Header
  locale: TypedLocale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data: { brandTitle, headerCTA, navItems },
  locale,
}) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1100] pointer-events-auto"
      style={{ height: HEADER_HEIGHT_PX }}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="relative h-full isolate">
        <div className="container h-full flex items-center">
          <div className=" flex justify-between items-end h-auto w-full">
            <div className="relative z-[1400]">
              <h2 className="font-bold text-4xl leading-none">{brandTitle}</h2>
            </div>

            <div className="relative z-[1300]">
              <HeaderNav navItems={navItems} locale={locale} />
            </div>

            <div className="relative z-[1300] flex items-center gap-8">
              <LocaleSwitcher />

              <CMSLink {...headerCTA.link} locale={locale} className="text-base" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
