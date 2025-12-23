import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import type { Page, Post } from '@/payload-types'
import type { TypedLocale } from 'payload'
import { ArrowRight, ExternalLink, Phone, Mail, type LucideIcon } from 'lucide-react'

type LocalizedString = string | Record<string, string> | null | undefined

type LinkIcon = 'arrowRight' | 'external' | 'phone' | 'mail'
const ICONS: Record<LinkIcon, LucideIcon> = {
  arrowRight: ArrowRight,
  external: ExternalLink,
  phone: Phone,
  mail: Mail,
}

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

  // ✅ now supports email/phone
  type?: 'custom' | 'reference' | 'email' | 'phone' | null

  url?: LocalizedString

  // ✅ email/phone values (admin-friendly)
  email?: string | null
  phone?: string | null

  // ✅ icon controls
  showIcon?: boolean | null
  icon?: LinkIcon | null
  iconPosition?: 'left' | 'right' | null

  locale?: TypedLocale
}

function getLocalized(value: LocalizedString, locale: TypedLocale, fallback: TypedLocale = 'en') {
  if (!value) return null
  if (typeof value === 'string') return value
  return value[locale] ?? value[fallback] ?? null
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
    locale = 'en',

    email,
    phone,

    showIcon,
    icon,
    iconPosition = 'right',
  } = props

  const resolvedLabel = getLocalized(label, locale, 'en')

  let href: string | null = null

  // ✅ NEW: email / phone
  if (type === 'email') {
    const clean = (email ?? '').trim()
    if (!clean) return null
    href = clean.startsWith('mailto:') ? clean : `mailto:${clean}`
  } else if (type === 'phone') {
    const clean = (phone ?? '').trim()
    if (!clean) return null
    // allow +, spaces, dashes in admin, but tel: should be cleaned
    const tel = clean.replace(/[^\d+]/g, '')
    href = tel.startsWith('tel:') ? tel : `tel:${tel}`
  } else if (type === 'reference' && typeof reference?.value === 'object' && reference.value) {
    const doc = reference.value as Page | Post
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
  href = prefixLocalePath(href, locale)

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const size = appearance === 'link' ? 'clear' : sizeFromProps

  const IconComp = showIcon && icon ? ICONS[icon] : null

  const content = (
    <>
      {/* keep everything above the wipe layer */}
      <span className="relative z-[1] inline-flex items-center gap-[1.4rem]">
        {IconComp && iconPosition === 'left' ? <IconComp className="h-4 w-4" /> : null}
        {resolvedLabel}
        {children}
        {IconComp && iconPosition === 'right' ? <IconComp className="h-4 w-4" /> : null}
      </span>
    </>
  )

  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {content}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn('relative', className)} href={href} {...newTabProps}>
        {content}
      </Link>
    </Button>
  )
}
