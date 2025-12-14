'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LocaleSwitcher } from './LocaleSwitcher'

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

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between items-center">
        <Link href={`/${locale}`}>
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>

        <LocaleSwitcher />

        <HeaderNav data={data} locale={locale} />
      </div>
    </header>
  )
}
