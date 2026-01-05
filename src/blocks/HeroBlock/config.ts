import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heros',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // ✅
      label: 'Title',
    },
    {
      name: 'title2',
      type: 'text',
      required: true,
      localized: true, // ✅
      label: 'Title 2',
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Media',
    },
  ],
}

export default HeroBlock
