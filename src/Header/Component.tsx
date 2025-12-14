import React from 'react'
import type { TypedLocale } from 'payload'

import type { Header as HeaderType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderClient } from './Component.client'

export async function Header({ locale }: { locale: TypedLocale }) {
  const headerData: HeaderType = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} locale={locale} />
}
