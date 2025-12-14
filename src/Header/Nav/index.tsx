'use client'

import React from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { CMSLink } from '@/components/Link'

interface HeaderNavProps {
  data: HeaderType
  locale: TypedLocale
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, locale }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        if (!link) return null

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            locale={locale} // ✅ PASS LOCALE
          />
        )
      })}

      <Link href={`/${locale}/search`}>
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
