import React from 'react'
import type { TypedLocale } from 'payload'

import type { Header as HeaderType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

export async function Header({ locale }: { locale: TypedLocale }) {
  const headerData = (await getCachedGlobal('header', 1, locale)()) as HeaderType
  return <HeaderClient data={headerData} locale={locale} />
}
