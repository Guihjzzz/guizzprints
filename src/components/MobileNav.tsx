'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Heart, Settings, Crown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const MOBILE_ITEMS = [
  { id: "home", icon: Home, href: "/" },
  { id: "search", icon: Search, href: "/search" },
  { id: "vip", icon: Crown, href: "/vip" },
  { id: "favorites", icon: Heart, href: "/favorites" },
  { id: "settings", icon: Settings, href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isVisible, setIsVisible] = useState(true);
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
  
  return (
    <nav 
      className={`fixed bottom-0 left-0 w-full bg-[#111318]/90 border-t border-[#1D2433] backdrop-blur-2xl flex justify-around items-center pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        
        // Verifica se a aba atual está ativa (destaca a cor em azul)
        const isActive = item.href === '/' 
          ? pathname === '/' || pathname === `/${currentLocale}`
          : pathname === `/${currentLocale}${item.href}` || pathname.startsWith(`/${currentLocale}${item.href}/`);
        
        // Constrói o link injetando o idioma dinamicamente
        const finalHref = item.href === '/' ? `/${currentLocale}` : `/${currentLocale}${item.href}`;
        
        return (
          <Link key={item.id} href={finalHref} aria-current={isActive ? 'page' : undefined} className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 transition-colors">
            <Icon size={24} className={isActive ? "text-[#2563EB]" : "text-[#94A3B8]"} />
            <span className={`text-[10px] font-medium ${isActive ? "text-[#2563EB]" : "text-[#94A3B8]"}`}>
              {item.id === 'vip' ? 'VIP' : t(item.id)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
