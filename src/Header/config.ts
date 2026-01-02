// src/payload/globals/Header.ts
import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'brandTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Forge.',
      required: true,
    },

    // ✅ CTA ALWAYS ON (no enabled checkbox)
    {
      name: 'headerCTA',
      type: 'group',
      fields: [
        link({
          overrides: {
            required: true,
          },
        }),
      ],
    },

    {
      name: 'navItems',
      type: 'array',
      localized: true,
      maxRows: 6,
      required: true,
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/Header/RowLabel#RowLabel' },
      },
      fields: [
        link({
          appearances: false,
          overrides: {
            required: true,
          },
        }),

        {
          name: 'dropdown',
          type: 'group',
          localized: true,
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },

            link({
              appearances: false,
              overrides: {
                name: 'panelTitle',
                label: 'Panel Title',
                required: true,
                admin: {
                  description: 'Big left title link inside the dropdown curtain.',
                  condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
                },
              },
            }),

            {
              name: 'panelText',
              type: 'textarea',
              localized: true,
              required: true,
              admin: {
                condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
              },
            },

            {
              name: 'panelImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
              },
            },

            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                initCollapsed: true,
                condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
              },
              fields: [
                link({
                  appearances: false,
                  overrides: {
                    required: true,
                  },
                }),

                {
                  name: 'description',
                  type: 'text',
                  localized: true,
                },

                {
                  name: 'itemImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}
