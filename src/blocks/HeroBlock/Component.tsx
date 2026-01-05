import React from 'react'
import type { HeroBlock as HeroBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export const HeroBlock: React.FC<HeroBlockProps> = ({ title, title2, background }) => {
  const bg = background as MediaType

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* ✅ Video stays locked in the background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Media
          resource={bg}
          fill
          imgClassName="object-cover"
          videoClassName="object-cover absolute inset-0 h-full w-full"
          priority
        />
      </div>

      {/* Optional gradients (they scroll with the page, like the title) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-36 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-96 bg-gradient-to-t from-black via-black/90 to-transparent" />

      {/* ✅ Text scrolls normally (this whole section scrolls away) */}
      <div className="relative z-10 h-screen">
        <div className="absolute inset-x-0 bottom-0">
          <div className="container pb-10 md:pb-14">
            <div className="mx-auto text-center">
              <h2 className="font-sans text-white text-3xl md:text-8xl uppercase">{title}</h2>
              <h2 className="font-sans text-white text-3xl md:text-8xl uppercase ">{title2}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
