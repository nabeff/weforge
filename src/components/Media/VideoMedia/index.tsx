'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'
import type { Props as MediaProps } from '../types'

export const VideoMedia: React.FC<MediaProps> = ({ onClick, resource, videoClassName }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // optional: ensure autoplay kicks in on some browsers
    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // ignore
      }
    }

    tryPlay()
  }, [resource])

  if (resource && typeof resource === 'object') {
    const url = (resource as any)?.url as string | undefined
    const mimeType = (resource as any)?.mimeType as string | undefined
    const cacheTagRaw = (resource as any)?.updatedAt as string | undefined
    const cacheTag = cacheTagRaw ? encodeURIComponent(cacheTagRaw) : '1'

    if (!url) return null

    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          onClick={onClick}
          ref={videoRef}
          className={cn(
            'w-full h-full object-cover',
            'absolute top-0 left-0',
            'min-w-full min-h-full',
            videoClassName,
          )}
        >
          <source src={`${url}?v=${cacheTag}`} type={mimeType || undefined} />
        </video>
      </div>
    )
  }

  return null
}
