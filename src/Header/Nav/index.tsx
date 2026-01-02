// src/Header/Nav.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'
import type { TypedLocale } from 'payload'

import { HEADER_HEIGHT_PX } from '../Component.client'
import { Media } from '@/components/Media'

interface HeaderNavProps {
  navItems: any[]
  locale: TypedLocale
}

const toHref = (l: any) => l?.url || l?.href || '/'

export const HeaderNav: React.FC<HeaderNavProps> = ({ navItems = [], locale }) => {
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
  const activeDropdown = isOpen ? navItems?.[openIndex!]?.dropdown : null

  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setReveal(false)
      return
    }

    setReveal(false)
    const id = requestAnimationFrame(() => setReveal(true))
    return () => cancelAnimationFrame(id)
  }, [isOpen, openTick])

  const panelTitle = activeDropdown?.panelTitle
  const panelText = activeDropdown?.panelText || ''
  const panelImage = (activeDropdown?.panelImage as MediaType | undefined) || undefined

  const previewMedia = useMemo(() => {
    if (!activeDropdown) return null
    const items = (activeDropdown.items || []) as any[]
    const dd = items?.[activeItemIndex]
    const perItem = (dd?.itemImage as MediaType | undefined) || undefined
    return perItem || panelImage || null
  }, [activeDropdown, activeItemIndex, panelImage])

  // ✅ Image swap timings (scale-down 1.2 -> 1)
  const IMG_DUR = 620
  const IMG_EASE = 'cubic-bezier(0.22,1,0.36,1)'

  const [displayMedia, setDisplayMedia] = useState<MediaType | null>(null)
  const [incomingMedia, setIncomingMedia] = useState<MediaType | null>(null)

  const swapTokenRef = useRef(0)
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSwapTimer = () => {
    if (swapTimerRef.current) {
      clearTimeout(swapTimerRef.current)
      swapTimerRef.current = null
    }
  }

  useEffect(() => {
    if (!previewMedia) return

    // first mount
    if (!displayMedia) {
      setDisplayMedia(previewMedia)
      return
    }

    // same media
    const prevId = (displayMedia as any)?.id
    const nextId = (previewMedia as any)?.id
    if (prevId && nextId && prevId === nextId) return

    clearSwapTimer()
    const token = ++swapTokenRef.current

    setIncomingMedia(previewMedia)

    swapTimerRef.current = setTimeout(() => {
      if (swapTokenRef.current !== token) return
      setDisplayMedia(previewMedia)
      setIncomingMedia(null)
    }, IMG_DUR)

    return () => clearSwapTimer()
  }, [previewMedia, displayMedia])

  // ✅ HEIGHT of the curtain (mask)
  const OPEN_PANEL_HEIGHT = HEADER_HEIGHT_PX + 540

  // ✅ Curtain: slower, pure slide (max-height), no opacity tricks
  const EASE = 'cubic-bezier(0.2,0,0.1,1)'
  const CURTAIN_DUR = 1200 // slower

  // content timing (same vibe as before)
  const DUR = 520
  const RIGHT_DELAY = 95

  const LIST_START = 90
  const ROW_STAGGER = 65
  const DESC_EXTRA = 70

  const PANEL_TITLE_DELAY = LIST_START
  const PANEL_TEXT_DELAY = LIST_START + 80

  return (
    <>
      {/* ✅ NAV always above dropdown */}
      <nav className="relative z-[1200] flex items-center gap-7">
        {navItems.map((item: any, i: number) => {
          const link = item?.link
          if (!link) return null

          const dropdown = item?.dropdown
          const enabled = Boolean(dropdown?.enabled && dropdown?.items?.length)

          const label = link?.label || ''
          const thisOpen = openIndex === i

          if (!enabled) {
            return (
              <Link
                key={i}
                href={toHref(link)}
                className="link-hover-swap text-white hover:text-white/80 transition-colors"
              >
                {/* ✅ keep wrapper structure so text doesn't show twice */}
                <span className="link-hover-swap__inner text-sm" data-text={label}>
                  {label}
                </span>
              </Link>
            )
          }

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => openDropdown(i)}
              onMouseLeave={scheduleClose}
            >
              <div className="inline-flex items-center gap-1">
                <Link
                  href={toHref(link)}
                  className="link-hover-swap text-white hover:text-white/80 transition-colors"
                >
                  <span className="link-hover-swap__inner text-sm" data-text={label}>
                    {label}
                  </span>
                </Link>

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

      {/* ✅ CURTAIN DROPDOWN (MASK REVEAL) — BACK TO ORIGINAL MECHANIC */}
      <div
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        className={[
          'fixed left-0 right-0 top-0',
          'z-[900]',
          'overflow-hidden',
          'bg-black/80 backdrop-blur-xl',
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
          <div className="container py-10 border-t-[0.5px] border-white/20">
            {/* Content does its own reveal (NOT moving with the curtain) */}
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
                {panelTitle ? (
                  <Link
                    href={toHref(panelTitle)}
                    className="link-hover-swap text-white hover:text-white/80 transition-colors will-change-transform inline-block"
                    style={{
                      transform: reveal ? 'translateY(0px)' : 'translateY(14px)',
                      transitionProperty: 'transform',
                      transitionDuration: `${DUR}ms`,
                      transitionTimingFunction: EASE,
                      transitionDelay: reveal ? `${PANEL_TITLE_DELAY}ms` : '0ms',
                    }}
                  >
                    <span className="link-hover-swap__inner" data-text={panelTitle.label}>
                      {panelTitle.label}
                    </span>
                  </Link>
                ) : null}

                <p
                  className="text-sm font-light text-white/60 leading-relaxed max-w-[18rem] will-change-transform mt-2"
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

                    const title = ddLink.label || ''
                    const desc = dd?.description || ''
                    const rowDelay = LIST_START + idx * ROW_STAGGER
                    const descDelay = rowDelay + DESC_EXTRA

                    const active = idx === activeItemIndex

                    return (
                      <Link
                        key={`${title}-${idx}`}
                        href={toHref(ddLink)}
                        onMouseEnter={() => setActiveItemIndex(idx)}
                        className={[
                          'group group/item flex items-start justify-between gap-6 rounded-2xl px-4 py-3',
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
                          <span className="link-hover-swap text-white text-sm leading-snug">
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
                  {displayMedia ? (
                    <div
                      className={[
                        'absolute inset-0 z-[1]',
                        'nav-preview-current',
                        incomingMedia ? 'nav-preview-current--dim' : '',
                      ].join(' ')}
                    >
                      <Media
                        resource={displayMedia}
                        fill
                        imgClassName="object-cover"
                        priority={false}
                      />
                    </div>
                  ) : null}

                  {incomingMedia ? (
                    <div className="absolute inset-0 z-[2] nav-preview-incoming">
                      <Media
                        resource={incomingMedia}
                        fill
                        imgClassName="object-cover"
                        priority={false}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .nav-preview-current {
            transition: opacity 360ms ${IMG_EASE};
          }
          .nav-preview-current--dim {
            opacity: 0.72;
          }
          .nav-preview-incoming {
            transform-origin: center center;
            will-change: transform, opacity;
            animation: navImgScaleDownIn ${IMG_DUR}ms ${IMG_EASE} both;
          }
          @keyframes navImgScaleDownIn {
            from {
              transform: scale(1.2);
              opacity: 0.001;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .nav-preview-incoming {
              animation: none !important;
            }
            .nav-preview-current {
              transition: none !important;
            }
          }
        `}</style>
      </div>
    </>
  )
}
