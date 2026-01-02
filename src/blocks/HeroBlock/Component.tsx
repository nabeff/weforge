import React from 'react'
import type { HeroBlock as HeroBlockProps, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export const HeroBlock: React.FC<HeroBlockProps> = ({ title, background }) => {
  const bg = background as MediaType

  return (
    <section className="relative w-full h-screen min-h-[520px] overflow-hidden">
      <Media
        resource={bg}
        fill
        imgClassName="object-cover"
        videoClassName="object-cover absolute inset-0 h-full w-full"
        priority
      />

      {/* Top subtle shadow (small height) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-36 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />

      {/* Bottom stronger gradient (small-ish height) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-72 bg-gradient-to-t from-black via-black/45 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container pb-10 md:pb-14">
          <div className="mx-auto text-center">
            <h1 className="text-white text-3xl md:text-7xl  tracking-tight ">{title}</h1>
          </div>
        </div>
      </div>
    </section>
  )
}
