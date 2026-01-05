// components/GlobalBackground.tsx
import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export function GlobalBackground({ bg }: { bg: MediaType }) {
  return (
    <>
      {/* Video fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-20">
        <Media
          resource={bg}
          fill
          imgClassName="object-cover"
          videoClassName="object-cover absolute inset-0 h-full w-full"
          priority
        />
      </div>

      {/* ✅ Global dark scrim so blocks don’t need bg-black */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" />

      {/* Optional global gradients */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-80 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
    </>
  )
}
