import './globals.css';
import './site-motion.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Home, Search, Box, Heart, Settings, Coffee, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { MobileNav } from '@/components/MobileNav';
import { TopHeader } from '@/components/TopHeader';
import { AdminSidebarItem } from '@/components/AdminSidebarItem';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteMotion } from '@/components/SiteMotion';
import { JsonLd } from '@/components/JsonLd';
import { siteStructuredData } from '@/lib/seo';
import { siteLocales, toSiteLocale } from '@/lib/site-pages';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = toSiteLocale(locale);
  const title = 'Guizzprints — Construções Minecraft';
  const description = 'Construções Minecraft para Bedrock e Java com prévias, Guia 3D e download direto.';
  const languages = Object.fromEntries(siteLocales.map((item) => [item, `/${item}`]));

  return {
    metadataBase: new URL('https://guizzprints.xyz'),
    title: { default: title, template: '%s | Guizzprints' },
    description,
    applicationName: 'Guizzprints',
    alternates: { canonical: `/${safeLocale}`, languages: { ...languages, 'x-default': '/pt' } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    verification: { google: '8w5uX2MyeL_ZEPijl_nCVioi0ltATg2-t03VNMTVYH0' },
    openGraph: { title, description, siteName: 'Guizzprints', type: 'website', url: `/${safeLocale}`, images: [{ url: '/guizz-cover.jpg', alt: 'Guizzprints' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/guizz-cover.jpg'] },
    manifest: '/manifest.webmanifest',
    icons: { icon: [{ url: '/icon.jpg', type: 'image/jpeg' }], shortcut: '/icon.jpg', apple: '/icons/guizz-180.png' },
  };
}

const SIDEBAR_ITEMS = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "search", icon: Search, label: "Search", href: "/search" },
  { id: "bedrock", icon: Gamepad2, label: "Bedrock", href: "/category/bedrock" },
  { id: "java", icon: Coffee, label: "Java", href: "/category/java" },
  { id: "holoprint", icon: Box, label: "Holoprint", href: "/search?category=holoprint" },
  { id: "favorites", icon: Heart, label: "Favorites", href: "/favorites" },
  { id: "settings", icon: Settings, label: "Settings", href: "/settings" },
];

export default async function RootLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations('Navigation');

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-[#07090D] text-[#F8FAFC] antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={siteStructuredData()} />
          <SiteMotion />
          <aside className="fixed top-0 left-0 h-screen w-[76px] bg-[#111318]/70 border-r border-[#1D2433] backdrop-blur-2xl flex-col items-center py-5 justify-between z-50 hidden md:flex">
            <div className="flex min-h-0 flex-1 flex-col items-center w-full gap-4">
              <Link href={`/${locale}`} className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-[#07090D] border border-[#1D2433] rounded-xl overflow-hidden motion-safe:group-hover:scale-105 transition-transform duration-300">
                  <Image src="/guizz-cover.jpg" alt="Guizzprints" width={48} height={48} className="w-12 h-12 object-cover" />
                </div>
              </Link>
              <nav className="flex min-h-0 flex-col items-center gap-1 w-full px-2 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">
                {SIDEBAR_ITEMS.filter((item) => item.id !== 'favorites' && item.id !== 'settings').map((item) => <SidebarItem key={item.id} item={item} label={item.label} locale={locale} />)}
              </nav>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 w-full px-2 pt-2">
              {SIDEBAR_ITEMS.filter((item) => item.id === 'favorites' || item.id === 'settings').map((item) => <SidebarItem key={item.id} item={item} label={t(item.id)} locale={locale} />)}
              <AdminSidebarItem locale={locale} label={t('admin')} />
            </div>
          </aside>

          <TopHeader />

          <main data-site-content className="md:pl-[76px] min-h-screen pt-16 pb-20 md:pb-0">
            {children}
          </main>

          <div className="md:pl-[76px] pb-20 md:pb-0">
            <SiteFooter locale={locale} />
          </div>

          <MobileNav />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function SidebarItem({ item, label, locale }: { item: typeof SIDEBAR_ITEMS[0], label: string, locale: string }) {
  const Icon = item.icon;
  const href = item.href === '/' ? `/${locale}` : `/${locale}${item.href}`;
  return (
    <Link href={href} title={label} aria-label={label} className="relative group w-full flex justify-center cursor-pointer">
      <div className="relative p-3 rounded-xl text-[#94A3B8] transition-[transform,color,background-color,border-color] duration-300 motion-safe:group-hover:scale-110 flex items-center justify-center border hover:text-[#F8FAFC] bg-transparent hover:bg-[#2563EB]/10 border-transparent hover:border-[#2563EB]/30">
        <Icon size={22} className="relative z-10 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_#2563EB]" />
      </div>
    </Link>
  );
}
