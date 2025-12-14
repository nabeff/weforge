import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import type { TypedLocale } from 'payload'

type LocalizedString = string | Record<string, string> | null | undefined

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: LocalizedString
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: LocalizedString
  locale?: TypedLocale // ✅ added
}

function getLocalized(value: LocalizedString, locale: TypedLocale, fallback: TypedLocale = 'en') {
  if (!value) return null
  if (typeof value === 'string') return value
  return value[locale] ?? value[fallback] ?? null
}

function prefixLocalePath(href: string, locale?: TypedLocale) {
  if (!href || !locale) return href

  // external links / schemes
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:'))
    return href

  // only handle internal absolute paths
  if (!href.startsWith('/')) return href

  // already prefixed
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href

  // root
  if (href === '/') return `/${locale}`

  return `/${locale}${href}`
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    locale = 'en', // ✅ default fallback
  } = props

  // Resolve label with fallback
  const resolvedLabel = getLocalized(label, locale, 'en')

  // Resolve href
  let href: string | null = null

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value) {
    const doc = reference.value as Page | Post

    // slug might be string OR localized object if your slug field is localized
    const slugValue: any = (doc as any).slug
    const slug =
      typeof slugValue === 'string' ? slugValue : (slugValue?.[locale] ?? slugValue?.en ?? null)

    if (slug) {
      href = `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${slug}`
    }
  } else {
    href = getLocalized(url, locale, 'en')
  }

  if (!href) return null

  // ✅ ensure internal links include locale prefix
  href = prefixLocalePath(href, locale)

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {resolvedLabel}
        {children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {resolvedLabel}
        {children}
      </Link>
    </Button>
  )
}
