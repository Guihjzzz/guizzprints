'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getClientAuthUser, listenToClientAuth } from '@/lib/client-auth';
import { User, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function TopHeader() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('Header');
  const [user, setUser] = useState<{ email: string | null; displayName: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => { void getClientAuthUser().then((nextUser) => { if (active) setUser(nextUser); }); };
    refresh();
    const unsubscribe = listenToClientAuth(refresh);
    return () => { active = false; unsubscribe(); };
  }, []);

  return (
      <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#1D2433] bg-[#07090D]/90 px-3 backdrop-blur-xl md:w-[calc(100%-76px)] md:px-7 lg:px-9">
      
      {/* Esquerda: Logo Mobile (Oculto no PC) */}
      <div className="flex items-center md:hidden">
        <Link href={`/${locale}`} aria-label="Guizzprints" className="flex size-10 items-center justify-center rounded-xl border border-[#253047] bg-[#111318] shadow-[0_6px_18px_rgba(0,0,0,.22)]">
          <Image src="/guizz-cover.jpg" alt="" width={32} height={32} className="size-8 rounded-lg object-cover" />
        </Link>
      </div>

      <div className="min-w-0 flex-1 px-3 sm:px-4">
        <Link href={`/${locale}`} className="inline-flex max-w-full items-baseline gap-2 truncate font-black tracking-tight text-white">
          <span className="truncate text-base sm:text-lg">Guizzprints</span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 sm:inline">Bedrock + Java</span>
        </Link>
      </div>

      {/* Direita: Auth / Perfil */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {user ? (
          <Link href={`/${locale}/settings`} className="group flex items-center gap-2 rounded-xl border border-transparent p-2 transition-all hover:border-[#1D2433] hover:bg-[#111318] cursor-pointer">
            <span className="hidden max-w-28 truncate text-sm font-bold text-zinc-300 group-hover:text-white sm:block">
              {user.displayName || user.email?.split('@')[0] || t('user')}
            </span>
            <div className="flex size-8 items-center justify-center rounded-full border border-[#1D2433] bg-[#111318] transition-colors group-hover:border-blue-500">
              <User size={14} className="text-blue-500" />
            </div>
          </Link>
        ) : (
          <Link href={`/${locale}/login`} className="flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,.9)] transition-colors hover:bg-blue-500 cursor-pointer sm:px-4">
            <LogIn size={16} /> <span>{t('signIn')}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
