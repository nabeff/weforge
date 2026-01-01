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

    {
      name: 'headerCTA',
      type: 'group',
      fields: [{ name: 'enabled', type: 'checkbox', defaultValue: false }, link({})],
    },

    {
      name: 'navItems',
      type: 'array',
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/Header/RowLabel#RowLabel' },
      },
      fields: [
        link({ appearances: false }),

        {
          name: 'dropdown',
          type: 'group',
          localized: true,
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },

            // ✅ Only show + require these fields when dropdown.enabled = true
            link({
              appearances: false,
              overrides: {
                name: 'panelTitle', // <-- panel title is a LINK now
                label: 'Panel Title',
                admin: {
                  description: 'Big left title link inside the dropdown curtain.',
                  condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
                },
                required: true,
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
              admin: {
                condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
              },
            },

            {
              name: 'items',
              type: 'array',
              admin: {
                initCollapsed: true,
                condition: (_: any, siblingData: any) => Boolean(siblingData?.enabled),
              },
              fields: [
                link({ appearances: false }),

                {
                  name: 'description',
                  type: 'text',
                  localized: true,
                },

                // ✅ matches Nav.tsx: dd.itemImage
                {
                  name: 'itemImage',
                  type: 'upload',
                  relationTo: 'media',
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
