'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Heart, Settings, Gamepad2, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { getClientAdminAuthToken, listenToClientAuth } from '@/lib/client-auth';

const MOBILE_ITEMS = [
  { id: "home", icon: Home, href: "/" },
  { id: "search", icon: Search, href: "/search" },
  { id: "bedrock", icon: Gamepad2, href: "/category/bedrock" },
  { id: "favorites", icon: Heart, href: "/favorites" },
  { id: "settings", icon: Settings, href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastScrollY = useRef(0);

  // Extracts the active locale from a path such as /es/favorites.
  const currentLocale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextVisible = !(currentScrollY > lastScrollY.current && currentScrollY > 50);
      lastScrollY.current = currentScrollY;
      setIsVisible((previous) => previous === nextVisible ? previous : nextVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;
    const verifyAdmin = async () => {
      const token = await getClientAdminAuthToken();
      if (active) setIsAdmin(Boolean(token));
    };
    void verifyAdmin();
    const unsubscribe = listenToClientAuth(() => { void verifyAdmin(); });
    return () => { active = false; unsubscribe(); };
  }, []);

  const items = isAdmin
    ? [...MOBILE_ITEMS.slice(0, 4), { id: 'admin', icon: Shield, href: '/admin/publisher' }, MOBILE_ITEMS[4]]
    : MOBILE_ITEMS;
  
  return (
    <nav 
      className={`fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#1D2433] bg-[#0b0f17]/95 px-1 pt-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(0,0,0,.22)] backdrop-blur-2xl md:hidden transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        
        // Verifica se a aba atual está ativa (destaca a cor em azul)
        const isActive = item.href === '/' 
          ? pathname === '/' || pathname === `/${currentLocale}`
          : pathname === `/${currentLocale}${item.href}` || pathname.startsWith(`/${currentLocale}${item.href}/`);
        
        // Constrói o link injetando o idioma dinamicamente
        const finalHref = item.href === '/' ? `/${currentLocale}` : `/${currentLocale}${item.href}`;
        
        return (
          <Link key={item.id} href={finalHref} aria-current={isActive ? 'page' : undefined} className={`relative flex min-h-12 min-w-[52px] flex-col items-center justify-center gap-1 rounded-2xl transition-colors ${item.id === 'admin' ? 'text-amber-400' : isActive ? 'text-[#60A5FA]' : 'text-[#94A3B8]'}`}>
            {isActive && <span aria-hidden="true" className="absolute inset-x-1 top-0 h-0.5 rounded-full bg-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,.9)]" />}
            <span className={`flex size-7 items-center justify-center rounded-xl transition-colors ${item.id === 'admin' ? 'bg-amber-500/10 text-amber-400' : isActive ? 'bg-blue-500/15 text-[#60A5FA]' : ''}`}><Icon size={21} /></span>
            <span className={`text-[10px] font-medium ${item.id === 'admin' ? 'text-amber-400' : isActive ? "text-[#60A5FA]" : "text-[#94A3B8]"}`}>
              {item.id === 'bedrock' ? 'Bedrock' : t(item.id)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
