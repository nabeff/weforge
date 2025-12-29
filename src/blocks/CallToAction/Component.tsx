import React from 'react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div>
      {(links || []).map(({ link }, i) => {
        return <CMSLink key={i} size="lg" {...link} />
      })}
    </div>
  )
}
