import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const TwoColumnTextCTA: Block = {
  slug: 'twoColumnTextCTA',
  interfaceName: 'TwoColumnTextCTA',
  labels: {
    singular: 'Two Column Text + CTA',
    plural: 'Two Column Text + CTA',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'leftTitle',
          type: 'text',
          localized: true,
          required: true,
          label: 'Left Title',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rightText',
          type: 'richText',
          localized: true,
          required: true,
          label: 'Right Text',
        },
      ],
    },
    {
      name: 'cta',
      type: 'array',
      required: true,
      label: 'Bottom Links',
      fields: [
        linkGroup({
          overrides: {
            required: true,
          },
        }),
      ],
    },
  ],
}

export default TwoColumnTextCTA
