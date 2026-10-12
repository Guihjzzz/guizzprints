'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flag, Shield } from 'lucide-react';
import { getClientAdminAuthToken, listenToClientAuth } from '@/lib/client-auth';

interface AdminSidebarItemProps {
  locale: string;
  label: string;
  reportsLabel: string;
}

export function AdminSidebarItem({ locale, label, reportsLabel }: AdminSidebarItemProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const token = await getClientAdminAuthToken();
      if (active) setIsAdmin(Boolean(token));
    };

    void verifySession();
    const unsubscribe = listenToClientAuth(() => { void verifySession(); });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="flex w-full flex-col items-center gap-1">
      {[
        { href: `/${locale}/admin/publisher`, label, icon: Shield, color: 'amber' },
        { href: `/${locale}/admin/reports`, label: reportsLabel, icon: Flag, color: 'blue' },
      ].map((item) => {
        const Icon = item.icon;
        const amber = item.color === 'amber';
        return <Link key={item.href} href={item.href} aria-label={item.label} className="relative group w-full flex justify-center cursor-pointer">
          <div className={`relative p-3.5 rounded-xl text-[#94A3B8] transition-all duration-300 group-hover:scale-110 flex items-center justify-center border bg-transparent ${amber ? 'hover:text-[#F8FAFC] hover:bg-amber-500/10 border-transparent hover:border-amber-500/30' : 'hover:text-[#F8FAFC] hover:bg-blue-500/10 border-transparent hover:border-blue-500/30'}`}>
            <Icon size={22} className={`relative z-10 transition-transform duration-300 ${amber ? 'text-amber-500/70 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_#F59E0B]' : 'text-blue-400/75 group-hover:text-blue-300 group-hover:drop-shadow-[0_0_8px_#60A5FA]'}`} />
          </div>
          <div className={`absolute left-[95px] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#111318] border border-[#1D2433] text-xs font-medium text-[#F8FAFC] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50 ${amber ? 'border-l-2 border-l-amber-500' : 'border-l-2 border-l-blue-500'}`}>
            {item.label}
          </div>
        </Link>;
      })}
    </div>
  );
}
