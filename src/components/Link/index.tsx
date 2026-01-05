'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type { Page, Post } from '@/payload-types'
import type { TypedLocale } from 'payload'

import arrowTiltRight from '@/../public/icons/arrow-right-up.svg'

type LocalizedString = string | Record<string, string> | null | undefined

export type CMSLinkAppearance =
  | 'inline'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'link'
  | 'cmsLink'

export type CMSLinkType = {
  locale?: TypedLocale

  type?: 'custom' | 'reference' | 'email' | 'phone' | null
  newTab?: boolean | null
  label?: LocalizedString

  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null

  url?: LocalizedString
  email?: string | null
  phone?: string | null

  appearance?: CMSLinkAppearance | null
  size?: ButtonProps['size'] | null
  className?: string
  children?: React.ReactNode

  /**
   * ✅ ONLY ONE ICON:
   * if true -> show the tilted arrow svg
   */
  showIcon?: boolean | null
  iconPosition?: 'left' | 'right' | null
}

/* -------------------------------- Utilities -------------------------------- */

function getLocalized(value: LocalizedString, locale: TypedLocale, fallback: TypedLocale = 'en') {
  if (!value) return null
  if (typeof value === 'string') return value
  return (value as any)?.[locale] ?? (value as any)?.[fallback] ?? null
}

function prefixLocalePath(href: string, locale?: TypedLocale) {
  if (!href || !locale) return href
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:'))
    return href
  if (!href.startsWith('/')) return href
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href
  if (href === '/') return `/${locale}`
  return `/${locale}${href}`
}

function cleanMailto(email: string) {
  const clean = email.trim()
  if (!clean) return null
  return clean.startsWith('mailto:') ? clean : `mailto:${clean}`
}

function cleanTel(phone: string) {
  const clean = phone.trim()
  if (!clean) return null
  const tel = clean.replace(/[^\d+]/g, '')
  if (!tel) return null
  return tel.startsWith('tel:') ? tel : `tel:${tel}`
}

function resolveHref(props: CMSLinkType): string | null {
  const { type, reference, url, locale = 'en', email: emailRaw, phone: phoneRaw } = props

  if (type === 'email') return emailRaw ? cleanMailto(emailRaw) : null
  if (type === 'phone') return phoneRaw ? cleanTel(phoneRaw) : null

  if (type === 'reference' && reference?.value && typeof reference.value === 'object') {
    const doc = reference.value as Page | Post
    const slugValue: any = (doc as any).slug
    const slug =
      typeof slugValue === 'string' ? slugValue : (slugValue?.[locale] ?? slugValue?.en ?? null)

    if (!slug) return null
    const base = reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    return `${base}/${slug}`
  }

  return getLocalized(url, locale, 'en')
}

function normalizeAppearance(a: CMSLinkAppearance | null | undefined) {
  const appearance = (a ?? 'inline') as Exclude<CMSLinkAppearance, null | undefined>
  if (appearance === 'cmsLink') return 'link' as const
  return appearance as Exclude<CMSLinkAppearance, null | undefined>
}

function ArrowIcon() {
  return (
    <Image
      src={arrowTiltRight}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4"
      aria-hidden="true"
    />
  )
}

/* -------------------------------- Component -------------------------------- */

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    locale = 'en',
    appearance: appearanceRaw = 'inline',
    size: sizeFromProps,
    className,
    newTab,
    label,
    children,
    showIcon,
    iconPosition = 'right',
  } = props

  const appearance = normalizeAppearance(appearanceRaw)

  const hrefRaw = resolveHref({ ...props, locale })
  if (!hrefRaw) return null

  const href = prefixLocalePath(hrefRaw, locale)
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const resolvedLabel = getLocalized(label, locale, 'en')
  const text = resolvedLabel ?? ''

  const leftIcon = showIcon && iconPosition === 'left' ? <ArrowIcon /> : null
  const rightIcon = showIcon && iconPosition === 'right' ? <ArrowIcon /> : null

  const LabelSwap = (
    <span className="link-hover-swap">
      <span className="link-hover-swap__inner whitespace-nowrap" data-text={text}>
        {text}
      </span>
    </span>
  )

  const content = (
    <span className="relative z-[1] inline-flex items-center gap-1">
      {leftIcon}
      {LabelSwap}
      {children}
      {rightIcon}
    </span>
  )

  if (appearance === 'inline') {
    return (
      <Link href={href} {...newTabProps} className={cn(className)}>
        {content}
      </Link>
    )
  }

  const size = appearance === 'link' ? 'clear' : sizeFromProps

  return (
    <Button
      asChild
      size={size as ButtonProps['size']}
      variant={appearance as ButtonProps['variant']}
      className={cn(className)}
    >
      <Link href={href} {...newTabProps} className={cn('relative', className)}>
        {content}
      </Link>
    </Button>
  )
}
