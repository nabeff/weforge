import type { Field, GroupField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'default' | 'outline' | 'primary' | 'secondary' | 'cmsLink'
export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: { label: 'Default', value: 'default' },
  outline: { label: 'Outline', value: 'outline' },
  primary: { label: 'Primary Button', value: 'primary' },
  secondary: { label: 'Secondary Button', value: 'secondary' },
  cmsLink: { label: 'Link', value: 'cmsLink' },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: { layout: 'horizontal', width: '50%' },
            defaultValue: 'reference',
            options: [
              { label: 'Internal link', value: 'reference' },
              { label: 'Custom URL', value: 'custom' },

              // ✅ NEW
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: { alignSelf: 'flex-end' },
              width: '50%',
              condition: (_, siblingData) =>
                siblingData?.type === 'custom' || siblingData?.type === 'reference',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: { condition: (_, siblingData) => siblingData?.type === 'reference' },
      label: 'Document to link to',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      localized: true,
      admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
      label: 'Custom URL',
      required: true,
    },

    // ✅ NEW: Email
    {
      name: 'email',
      type: 'text',
      label: 'Email address',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'email',
        placeholder: 'name@example.com',
      },
      required: true,
      validate: (val: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if ((siblingData as any)?.type !== 'email') return true
        const v = String(val ?? '').trim()
        if (!v) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email'
        return true
      },
    },

    // ✅ NEW: Phone
    {
      name: 'phone',
      type: 'text',
      label: 'Phone number',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'phone',
        placeholder: '+212 6 12 34 56 78',
      },
      required: true,
      validate: (val: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if ((siblingData as any)?.type !== 'phone') return true
        const v = String(val ?? '').trim()
        if (!v) return 'Phone number is required'
        if (!/^\+?[\d\s\-()]{6,}$/.test(v)) return 'Enter a valid phone number'
        return true
      },
    },
  ]

  // Label row (keep your pattern)
  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: { ...linkType.admin, width: '50%' },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: { width: '50%' },
          label: 'Label',
          localized: true,
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  // ✅ Icon controls (admin boolean + select)
  linkResult.fields.push({
    type: 'row',
    fields: [
      {
        name: 'showIcon',
        type: 'checkbox',
        label: 'Show icon',
        defaultValue: false,
        admin: { width: '33%' },
      },
      {
        name: 'icon',
        type: 'select',
        label: 'Icon',
        defaultValue: 'arrowRight',
        options: [
          { label: 'Arrow Right', value: 'arrowRight' },
          { label: 'External Link', value: 'external' },
          { label: 'Mail', value: 'mail' },
          { label: 'Phone', value: 'phone' },
        ],
        admin: {
          width: '33%',
          condition: (_, siblingData) => Boolean(siblingData?.showIcon),
        },
      },
      {
        name: 'iconPosition',
        type: 'select',
        label: 'Icon position',
        defaultValue: 'right',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        admin: {
          width: '33%',
          condition: (_, siblingData) => Boolean(siblingData?.showIcon),
        },
      },
    ],
  })

  // Appearances (keep your system)
  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.outline,
      appearanceOptions.primary,
      appearanceOptions.secondary,
      appearanceOptions.cmsLink,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: { description: 'Choose how the link should be rendered.' },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
