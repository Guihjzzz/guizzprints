'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AdminSidebarItemProps {
  locale: string;
  label: string;
}

export function AdminSidebarItem({ locale, label }: AdminSidebarItemProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async (session: Session | null) => {
      if (!session) {
        if (active) setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        });

        if (active) setIsAdmin(response.ok);
      } catch {
        if (active) setIsAdmin(false);
      }
    };

    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await verifySession(session);
    };

    void checkCurrentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && active) setIsAdmin(false);
      void verifySession(session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link href={`/${locale}/upload`} className="relative group w-full flex justify-center cursor-pointer">
      <div className="relative p-3.5 rounded-xl text-[#94A3B8] transition-all duration-300 group-hover:scale-110 flex items-center justify-center border hover:text-[#F8FAFC] bg-transparent hover:bg-amber-500/10 border-transparent hover:border-amber-500/30">
        <Shield size={22} className="relative z-10 transition-transform duration-300 text-amber-500/70 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_#F59E0B]" />
      </div>
      <div className="absolute left-[95px] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#111318] border border-[#1D2433] text-xs font-medium text-[#F8FAFC] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50 border-l-2 border-l-amber-500">
        {label}
      </div>
    </Link>
  );
}
