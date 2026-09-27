import type { Metadata } from 'next';
import { getSitePage, siteLocales, toSiteLocale, type SitePage } from '@/lib/site-pages';

export function sitePageMetadata(locale: string, page: SitePage): Metadata {
  const safeLocale = toSiteLocale(locale);
  const content = getSitePage(safeLocale, page);
  const path = `/${safeLocale}/${page}`;

  return {
    title: `${content.title} | GuizzMods`,
    description: content.description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(siteLocales.map((item) => [item, `/${item}/${page}`])),
    },
  };
}
