import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Keep machine-readable root assets outside next-intl's locale fallback. A
  // request for /llms.txt must be served by Next's static asset handler as
  // plain text, never rewritten to /en/llms.txt or the [locale] page.
  if (request.nextUrl.pathname === '/llms.txt') {
    return NextResponse.next();
  }

  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const looksLikeLocale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(firstSegment || '');

  if (firstSegment && looksLikeLocale && !locales.includes(firstSegment as (typeof locales)[number])) {
    const redirectUrl = request.nextUrl.clone();
    const remainingPath = segments.slice(1).join('/');
    redirectUrl.pathname = `/${defaultLocale}${remainingPath ? `/${remainingPath}` : ''}`;
    return NextResponse.redirect(redirectUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|auth|_next|.*\\..*).*)']
};
