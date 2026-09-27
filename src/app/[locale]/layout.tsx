import './globals.css';
import './site-motion.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Home, Search, Box, PlusCircle, Layers, Sun, Map, Heart, Settings, UserRound, Puzzle, Crown } from 'lucide-react';
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
import { AdblockAccessGate } from '@/components/AdblockAccessGate';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.guizz.xyz'),
  title: 'GuizzMods',
  description: 'Discover and download Minecraft mods, add-ons, textures, shaders, maps, and skins.',
  applicationName: 'GuizzMods',
  verification: {
    google: '8w5uX2MyeL_ZEPijl_nCVioi0ltATg2-t03VNMTVYH0',
  },
  openGraph: {
    title: 'GuizzMods — Minecraft mods and add-ons',
    description: 'Discover and download Minecraft mods, add-ons, textures, shaders, maps, and skins.',
    siteName: 'GuizzMods',
    type: 'website',
    images: [{ url: '/logo.jpg', alt: 'GuizzMods' }],
  },
  twitter: {
    card: 'summary',
    title: 'GuizzMods — Minecraft mods and add-ons',
    description: 'Discover and download Minecraft mods, add-ons, textures, shaders, maps, and skins.',
    images: ['/logo.jpg'],
  },
  manifest: '/manifest.webmanifest',
  // Pin every browser surface to the same stable logo. Without an explicit
  // regular favicon, some browsers fall back to a deployment/provider icon.
  icons: {
    icon: [{ url: '/icon.jpg', type: 'image/jpeg' }],
    shortcut: '/icon.jpg',
    apple: '/icons/guizz-180.png',
  },
};

const SIDEBAR_ITEMS = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "search", icon: Search, label: "Search", href: "/search" },
  { id: "vip", icon: Crown, label: "VIP", href: "/vip" },
  { id: "holoprint", icon: Box, label: "Holoprint", href: "/category/holoprint" },
  { id: "addons", icon: PlusCircle, label: "Add-ons", href: "/category/addons" },
  { id: "textures", icon: Layers, label: "Textures", href: "/category/textures" },
  { id: "shaders", icon: Sun, label: "Shaders", href: "/category/shaders" },
  { id: "maps", icon: Map, label: "Maps", href: "/category/maps" },
  { id: "skins", icon: UserRound, label: "Skins", href: "/category/skins" },
  { id: "mash-up", icon: Puzzle, label: "Mash-up", href: "/category/mash-up" },
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
          <SiteMotion />
          <aside className="fixed top-0 left-0 h-screen w-[90px] bg-[#111318]/70 border-r border-[#1D2433] backdrop-blur-2xl flex-col items-center py-6 justify-between z-50 hidden md:flex">
            <div className="flex min-h-0 flex-1 flex-col items-center w-full gap-4">
              <Link href={`/${locale}`} className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-[#07090D] border border-[#1D2433] rounded-xl overflow-hidden motion-safe:group-hover:scale-105 transition-transform duration-300">
                  <Image src="/logo.jpg" alt="GuizzMods" width={48} height={48} className="w-12 h-12 object-cover" />
                </div>
              </Link>
              <nav className="flex min-h-0 flex-col items-center gap-1 w-full px-2 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">
                {SIDEBAR_ITEMS.filter((item) => item.id !== 'favorites' && item.id !== 'settings').map((item) => <SidebarItem key={item.id} item={item} label={item.id === 'vip' ? 'VIP' : t(item.id)} locale={locale} />)}
              </nav>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 w-full px-2 pt-2">
              {SIDEBAR_ITEMS.filter((item) => item.id === 'favorites' || item.id === 'settings').map((item) => <SidebarItem key={item.id} item={item} label={t(item.id)} locale={locale} />)}
              <AdminSidebarItem locale={locale} label={t('admin')} />
            </div>
          </aside>

          <TopHeader />

          <AdblockAccessGate locale={locale}>
            <main data-site-content className="md:pl-[90px] min-h-screen pt-16 pb-20 md:pb-0">
              {children}
            </main>
          </AdblockAccessGate>

          <div className="md:pl-[90px] pb-20 md:pb-0">
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
  const isVip = item.id === 'vip';

  return (
    <Link href={href} title={label} aria-label={label} data-vip={isVip ? 'true' : undefined} className={`relative group w-full flex justify-center cursor-pointer ${isVip ? 'vip-nav-link' : ''}`}>
      <div className="relative p-3 rounded-xl text-[#94A3B8] transition-[transform,color,background-color,border-color] duration-300 motion-safe:group-hover:scale-110 flex items-center justify-center border hover:text-[#F8FAFC] bg-transparent hover:bg-[#2563EB]/10 border-transparent hover:border-[#2563EB]/30">
        {isVip && <span aria-hidden="true" className="vip-nav-halo" />}
        <Icon size={22} className="relative z-10 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_#2563EB]" />
      </div>
      {isVip && <span className="vip-nav-label">VIP</span>}
    </Link>
  );
}
