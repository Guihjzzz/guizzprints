import { SiteInfoPage } from '@/components/SiteInfoPage';
import { getSitePage, toSiteLocale } from '@/lib/site-pages';
import { sitePageMetadata } from '@/lib/site-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return sitePageMetadata(locale, 'privacy');
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale = toSiteLocale(locale);
  return <SiteInfoPage locale={safeLocale} content={getSitePage(safeLocale, 'privacy')} />;
}
