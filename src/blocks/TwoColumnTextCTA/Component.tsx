import React from 'react'
import type { TwoColumnTextCTA as TwoColumnTextCTAProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const TwoColumnTextCTA: React.FC<TwoColumnTextCTAProps> = ({
  leftTitle,
  rightText,
  cta,
}) => {
  return (
    <section className="bg-black w-full py-16 md:p-40">
      <div className="container">
        <div className="flex md:gap-14">
          <div className="w-[40%]">
            <p className="text-white text-base md:text-lg tracking-tight">{leftTitle}</p>
          </div>

          <div className="w-[60%] flex flex-col items-start gap-6">
            <RichText
              data={rightText}
              enableGutter={false}
              className="max-w-none text-4xl text-white"
            />

            {Array.isArray((cta as any)?.links) &&
              (cta as any).links.map((item: any, index: number) => (
                <CMSLink key={item?.id ?? index} {...item} />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
