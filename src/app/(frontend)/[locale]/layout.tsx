import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { TypedLocale } from 'payload'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import localization from '@/i18n/localization'
import { routing } from '@/i18n/routing'

import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

const grotesk = localFont({
  src: [
    {
      path: '../../../../public/fonts/OldschoolGrotesk-NormalThin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/OldschoolGrotesk-NormalLight.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/OldschoolGrotesk-NormalRegular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/OldschoolGrotesk-NormalMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/OldschoolGrotesk-NormalBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}) {
  const { locale } = await params
  const currentLocale = localization.locales.find((loc) => loc.code === locale)

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const { isEnabled } = await draftMode()
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html className={cn(inter.variable, grotesk.variable)} lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>

      <body className="overflow-x-hidden">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
