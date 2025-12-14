import type { TypedLocale } from 'payload'

export function buildLocalizedPath(params: {
  pathname: string
  currentLocale: TypedLocale
  nextLocale: TypedLocale
}) {
  const { pathname, currentLocale, nextLocale } = params
  const withoutLocale = pathname.replace(new RegExp(`^/${currentLocale}(?=/|$)`), '')
  const normalized = withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`
  return `/${nextLocale}${normalized === '/' ? '' : normalized}`
}
