import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

// see https://next-intl-docs.vercel.app/docs/routing/middleware
export const config = {
  matcher: ['/', '/(en|fr)/:path*'], // Adjust to your supported locales
}
