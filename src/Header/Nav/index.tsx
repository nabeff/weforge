'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'

import type { Header as HeaderType, Media, Page, Post } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { HEADER_HEIGHT_PX } from '../Component.client'

type LocalizedString = string | Record<string, string> | null | undefined

const getLocalized = (
  value: LocalizedString,
  locale: TypedLocale,
  fallback: TypedLocale = 'en',
) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return (value as any)?.[locale] ?? (value as any)?.[fallback] ?? ''
}

const prefixLocalePath = (href: string, locale?: TypedLocale) => {
  if (!href || !locale) return href
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:'))
    return href
  if (!href.startsWith('/')) return href
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href
  if (href === '/') return `/${locale}`
  return `/${locale}${href}`
}

const resolveHref = (link: any, locale: TypedLocale) => {
  let href: string | null = null

  if (
    link?.type === 'reference' &&
    typeof link?.reference?.value === 'object' &&
    link.reference.value
  ) {
    const doc = link.reference.value as Page | Post
    const slugValue: any = (doc as any).slug
    const slug =
      typeof slugValue === 'string' ? slugValue : (slugValue?.[locale] ?? slugValue?.en ?? null)

    if (slug) {
      href = `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${slug}`
    }
  } else {
    href = getLocalized(link?.url, locale, 'en') || null
  }

  if (!href) return null
  return prefixLocalePath(href, locale)
}

const getMediaUrl = (m?: Media | string | null) => {
  if (!m) return null
  if (typeof m === 'string') return m
  return (m as any)?.url ?? null
}

interface HeaderNavProps {
  data: HeaderType
  locale: TypedLocale
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, locale }) => {
  const navItems = data?.navItems || []

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0)

  // ✅ used to re-trigger reveal (without remounting rows)
  const [openTick, setOpenTick] = useState(0)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openDropdown = useCallback((i: number) => {
    clearCloseTimer()
    setOpenIndex(i)
    setActiveItemIndex(0)
    setOpenTick((t) => t + 1)
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => {
      setOpenIndex(null)
      setActiveItemIndex(0)
    }, 140)
  }, [])

  useEffect(() => {
    return () => clearCloseTimer()
  }, [])

  const isOpen = openIndex !== null
  const activeDropdown = openIndex !== null ? (navItems?.[openIndex] as any)?.dropdown : null

  // ✅ This is the key fix: use a separate "reveal" state so transitions ALWAYS fire
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setReveal(false)
      return
    }

    // reset then enable next frame so the browser animates translateY
    setReveal(false)
    const id = requestAnimationFrame(() => setReveal(true))
    return () => cancelAnimationFrame(id)
  }, [isOpen, openTick])

  // Panel Title is now a LINK in config:
  const panelTitleLink = useMemo(() => {
    const l = (activeDropdown as any)?.panelTitle
    return l ? resolveHref(l, locale) : null
  }, [activeDropdown, locale])

  const panelTitleLabel = useMemo(() => {
    const l = (activeDropdown as any)?.panelTitle
    return getLocalized(l?.label, locale)
  }, [activeDropdown, locale])

  const panelText = useMemo(
    () => getLocalized(activeDropdown?.panelText, locale),
    [activeDropdown, locale],
  )

  const fallbackPanelImageUrl = useMemo(() => {
    return getMediaUrl(activeDropdown?.panelImage as Media | string | undefined)
  }, [activeDropdown])

  const previewImageUrl = useMemo(() => {
    const items = (activeDropdown?.items || []) as any[]
    const dd = items?.[activeItemIndex]
    const perItem = dd?.itemImage as Media | string | undefined
    return getMediaUrl(perItem) || fallbackPanelImageUrl
  }, [activeDropdown, activeItemIndex, fallbackPanelImageUrl])

  // ✅ HEIGHT of the curtain (mask)
  const OPEN_PANEL_HEIGHT = HEADER_HEIGHT_PX + 540

  // ✅ Make curtain a bit slower
  const EASE = 'cubic-bezier(0.2,0,0.1,1)'
  const CURTAIN_DUR = 820

  const DUR = 520
  const RIGHT_DELAY = 95

  // ✅ List stagger (one by one)
  const LIST_START = 90
  const ROW_STAGGER = 65
  const DESC_EXTRA = 70

  // ✅ Left column stagger (one by one, like the list)
  const PANEL_TITLE_DELAY = LIST_START
  const PANEL_TEXT_DELAY = LIST_START + 80

  return (
    <>
      {/* ✅ NAV always above dropdown */}
      <nav className="relative z-[1200] flex items-center gap-7">
        {navItems.map((item: any, i) => {
          const link = item?.link
          if (!link) return null

          const dropdown = item?.dropdown
          const enabled = Boolean(dropdown?.enabled && dropdown?.items?.length)

          const label = getLocalized(link?.label, locale)
          const thisOpen = openIndex === i

          // --- Simple link (no dropdown) ---
          if (!enabled) {
            const href = resolveHref(link, locale)
            if (!href) return null

            const newTab = link?.newTab
            const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

            return (
              <Link
                key={i}
                href={href}
                {...newTabProps}
                className="link-hover-swap text-white hover:text-white/80 transition-colors"
              >
                <span className="link-hover-swap__inner text-sm" data-text={label}>
                  {label}
                </span>
              </Link>
            )
          }

          // --- Dropdown trigger ---
          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => openDropdown(i)}
              onMouseLeave={scheduleClose}
            >
              <div className="inline-flex items-center gap-1">
                {(() => {
                  const href = resolveHref(link, locale)
                  if (!href) return null

                  const newTab = link?.newTab
                  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

                  return (
                    <Link
                      href={href}
                      {...newTabProps}
                      className="link-hover-swap text-white hover:text-white/80 transition-colors"
                    >
                      <span className="link-hover-swap__inner text-sm" data-text={label}>
                        {label}
                      </span>
                    </Link>
                  )
                })()}

                <div className="h-5 w-5 flex items-center justify-center bg-[#15171a]/95 rounded-full">
                  <ChevronDown
                    className={[
                      'h-3 w-3 opacity-70 transition-transform duration-200',
                      thisOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* ✅ CURTAIN DROPDOWN (MASK REVEAL) */}
      <div
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        className={[
          'fixed left-0 right-0 top-0',
          'z-[900]',
          'overflow-hidden',
          'bg-black/95 backdrop-blur-xl',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        style={{
          maxHeight: isOpen ? OPEN_PANEL_HEIGHT : 0,
          transitionProperty: 'max-height',
          transitionDuration: `${CURTAIN_DUR}ms`,
          transitionTimingFunction: EASE,
        }}
      >
        {/* Keep content below header */}
        <div style={{ paddingTop: HEADER_HEIGHT_PX }}>
          <div className="container py-10">
            {/* Content slides up */}
            <div
              className="grid grid-cols-12 gap-8 will-change-transform"
              style={{
                transform: reveal ? 'translateY(0px)' : 'translateY(18px)',
                transitionProperty: 'transform',
                transitionDuration: `${DUR}ms`,
                transitionTimingFunction: EASE,
              }}
            >
              {/* LEFT */}
              <div className="col-span-3">
                {panelTitleLink ? (
                  <Link
                    key="panel-title"
                    href={panelTitleLink}
                    className="text-lg text-white will-change-transform inline-block"
                    style={{
                      transform: reveal ? 'translateY(0px)' : 'translateY(14px)',
                      transitionProperty: 'transform',
                      transitionDuration: `${DUR}ms`,
                      transitionTimingFunction: EASE,
                      transitionDelay: reveal ? `${PANEL_TITLE_DELAY}ms` : '0ms',
                    }}
                  >
                    {panelTitleLabel}
                  </Link>
                ) : null}

                <p
                  key="panel-text"
                  className="text-sm font-light text-white/60 leading-relaxed max-w-[18rem] will-change-transform mt-3"
                  style={{
                    transform: reveal ? 'translateY(0px)' : 'translateY(14px)',
                    transitionProperty: 'transform',
                    transitionDuration: `${DUR}ms`,
                    transitionTimingFunction: EASE,
                    transitionDelay: reveal ? `${PANEL_TEXT_DELAY}ms` : '0ms',
                  }}
                >
                  {panelText}
                </p>
              </div>

              {/* MIDDLE */}
              <div className="col-span-5">
                <div className="flex flex-col">
                  {(activeDropdown?.items || []).map((dd: any, idx: number) => {
                    const ddLink = dd?.link
                    if (!ddLink) return null

                    const title = getLocalized(ddLink?.label, locale)
                    const desc = getLocalized(dd?.description, locale)
                    const href = resolveHref(ddLink, locale)
                    if (!href) return null

                    const newTab = ddLink?.newTab
                    const newTabProps = newTab
                      ? { rel: 'noopener noreferrer', target: '_blank' }
                      : {}

                    const active = idx === activeItemIndex

                    // ✅ stagger per row
                    const rowDelay = LIST_START + idx * ROW_STAGGER
                    const descDelay = rowDelay + DESC_EXTRA

                    return (
                      <Link
                        key={href} // ✅ stable key (no openTick)
                        href={href}
                        {...newTabProps}
                        onMouseEnter={() => setActiveItemIndex(idx)}
                        className={[
                          'group/item flex items-start justify-between gap-6 rounded-2xl px-6 py-5',
                          'transition-colors',
                          active ? 'bg-white/5' : 'hover:bg-white/5',
                          'will-change-transform',
                        ].join(' ')}
                        style={{
                          transform: reveal ? 'translateY(0px)' : 'translateY(18px)',
                          transitionProperty: 'transform',
                          transitionDuration: `${DUR}ms`,
                          transitionTimingFunction: EASE,
                          transitionDelay: reveal ? `${rowDelay}ms` : '0ms',
                        }}
                      >
                        <span className="flex flex-col">
                          <span className="link-hover-swap text-white text-base leading-snug">
                            <span className="link-hover-swap__inner" data-text={title}>
                              {title}
                            </span>
                          </span>

                          {desc ? (
                            <span
                              className="text-sm font-light text-white/55 mt-1 will-change-transform"
                              style={{
                                transform: reveal ? 'translateY(0px)' : 'translateY(10px)',
                                transitionProperty: 'transform',
                                transitionDuration: `${DUR}ms`,
                                transitionTimingFunction: EASE,
                                transitionDelay: reveal ? `${descDelay}ms` : '0ms',
                              }}
                            >
                              {desc}
                            </span>
                          ) : null}
                        </span>

                        <span
                          className={[
                            'mt-1 transition-all duration-200',
                            active
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0',
                          ].join(' ')}
                        >
                          <ArrowRight className="h-4 w-4 text-white" />
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="col-span-4 will-change-transform"
                style={{
                  transform: reveal ? 'translateY(0px)' : 'translateY(16px)',
                  transitionProperty: 'transform',
                  transitionDuration: `${DUR}ms`,
                  transitionTimingFunction: EASE,
                  transitionDelay: reveal ? `${RIGHT_DELAY}ms` : '0ms',
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/40">
                  {previewImageUrl ? (
                    <Image
                      key={previewImageUrl}
                      src={previewImageUrl}
                      alt={panelTitleLabel || 'Preview'}
                      fill
                      className="object-cover nav-preview-img"
                      sizes="(max-width: 1024px) 50vw, 28rem"
                      priority={false}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image swap motion = translateY only */}
        <style jsx global>{`
          .nav-preview-img {
            animation: navImgIn 520ms cubic-bezier(0.2, 0, 0.1, 1);
          }
          @keyframes navImgIn {
            from {
              transform: translateY(14px);
            }
            to {
              transform: translateY(0px);
            }
          }
        `}</style>
      </div>
    </>
  )
}
