'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Crown, User, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import Image from 'next/image';

export function TopHeader() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('Header');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const vipPath = `/${locale}/vip`;
  const vipActive = pathname === vipPath || pathname.startsWith(`${vipPath}/`);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-90px)] h-16 bg-[#07090D]/80 backdrop-blur-md border-b border-[#1D2433] z-40 flex items-center justify-between px-4 sm:px-6">
      
      {/* Esquerda: Logo Mobile (Oculto no PC) */}
      <div className="md:hidden flex items-center">
        <Link href={`/${locale}`}>
          <Image src="/logo.jpg" alt="GuizzMods" width={32} height={32} className="w-8 h-8 rounded-lg" />
        </Link>
      </div>

      {/* Centro: Espaço vazio ou Botão centralizado */}
      <div className="flex-1 flex justify-center">
        <Link
          href={vipPath}
          aria-current={vipActive ? 'page' : undefined}
          className={`vip-header-link ${vipActive ? 'vip-header-link-active' : ''}`}
        >
          <Crown size={16} aria-hidden="true" />
          <span>{t('vip')}</span>
        </Link>
      </div>

      {/* Direita: Auth / Perfil */}
      <div className="flex items-center gap-4">
        {user ? (
          <Link href={`/${locale}/settings`} className="flex items-center gap-2 hover:bg-[#111318] p-2 rounded-xl border border-transparent hover:border-[#1D2433] transition-all cursor-pointer group">
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white">
              {user.user_metadata?.username || t('user')}
            </span>
            <div className="w-8 h-8 bg-[#111318] border border-[#1D2433] rounded-full flex items-center justify-center group-hover:border-blue-500 transition-colors">
              <User size={14} className="text-blue-500" />
            </div>
          </Link>
        ) : (
          <Link href={`/${locale}/login`} className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors cursor-pointer">
            <LogIn size={16} /> {t('signIn')}
          </Link>
        )}
      </div>
    </header>
  );
}
