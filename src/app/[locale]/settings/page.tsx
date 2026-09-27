'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings, User, Mail, Lock, LogOut, Loader2, Save, Globe, AtSign, Crown, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isAppLocale } from '@/i18n/routing';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Props = { params: Promise<{ locale: string }> };

export default function SettingsPage({ params }: Props) {
  const { locale } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Settings');
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [vipStatus, setVipStatus] = useState<{ expiresAt: string } | null>(null);
  
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(locale);
  const [languageMessage, setLanguageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [message, setMessage] = useState<{ type: 'success'|'error', text: string, context: 'profile'|'password'|'account' } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/${locale}/login`);
      } else {
        setUser(session.user);
        setUsername(session.user.user_metadata?.username || '');
        try {
          const response = await fetch('/api/vip/status', {
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: 'no-store',
          });
          const data = await response.json() as { vip?: boolean; expiresAt?: string };
          if (data.vip && typeof data.expiresAt === 'string') setVipStatus({ expiresAt: data.expiresAt });
        } catch { /* A missing status fails closed to the regular account view. */ }
        setLoading(false);
      }
    };
    fetchUser();
  }, [locale, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setSavingProfile(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { username: username.trim() }
    });

    if (error) setMessage({ type: 'error', text: t('profileError'), context: 'profile' });
    else setMessage({ type: 'success', text: t('profileSaved'), context: 'profile' });
    
    setSavingProfile(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: t('passwordTooShort'), context: 'password' });
      return;
    }
    setSavingPassword(true);
    setMessage(null);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) setMessage({ type: 'error', text: t('passwordError'), context: 'password' });
    else {
      setMessage({ type: 'success', text: t('passwordSaved'), context: 'password' });
      setNewPassword('');
    }
    setSavingPassword(false);
  };

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      setSigningOut(false);
      setMessage({ type: 'error', text: t('signOutError'), context: 'account' });
      return;
    }
    setUser(null);
    setVipStatus(null);
    router.replace(`/${locale}/login`);
  };

  // Lógica de troca de idioma
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (!isAppLocale(newLocale) || newLocale === locale) return;

    setSelectedLanguage(newLocale);
    setSavingLanguage(true);
    setLanguageMessage(null);

    const { error } = await supabase.auth.updateUser({ data: { locale: newLocale } });

    if (error) {
      setSelectedLanguage(locale);
      setLanguageMessage({ type: 'error', text: t('languageError') });
      setSavingLanguage(false);
      return;
    }

    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    setLanguageMessage({ type: 'success', text: t('languageSaved') });
    router.replace(newPath);
    router.refresh();
  };

  const formatVipExpiry = (value: string) => {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    const language = locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(language, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen">
      
      <div className="border-b border-[#1D2433] pb-6">
        <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
          <Settings className="text-blue-500" size={28} />
          {t('title')}
        </h1>
        <p className="text-zinc-400 mt-2 text-sm font-medium">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111318] border border-[#1D2433] rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#1D2433] pb-4">
              <User size={20} className="text-blue-500"/> {t('profile')}
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Mail size={14}/> {t('email')}</label>
              <input type="email" value={user?.email || ''} disabled className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-[#1D2433]">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><AtSign size={14}/> {t('username')}</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('usernamePlaceholder')} className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
              </div>

              {message?.context === 'profile' && (
                <div className={`p-3 rounded-xl border text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={savingProfile || !username} className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center border border-zinc-600">
                {savingProfile ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} {t('saveProfile')}
              </button>
            </form>

            <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4 border-t border-[#1D2433]">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Lock size={14}/> {t('password')}</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t('passwordPlaceholder')} className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
              </div>

              {message?.context === 'password' && (
                <div className={`p-3 rounded-xl border text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={savingPassword || !newPassword} className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 border border-blue-500 disabled:border-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center">
                {savingPassword ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} {t('updatePassword')}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111318] border border-[#1D2433] rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#1D2433] pb-4">
              <Globe size={20} className="text-blue-500"/> {t('preferences')}
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2">{t('displayLanguage')}</label>
              <select 
                value={selectedLanguage}
                onChange={handleLanguageChange} 
                disabled={savingLanguage}
                className="w-full bg-[#07090D] border border-[#1D2433] hover:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer transition"
              >
                <option value="en">{t('english')}</option>
                <option value="es">{t('spanish')}</option>
                <option value="pt">{t('portuguese')}</option>
              </select>
              {languageMessage && <p className={`text-xs font-medium ${languageMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{languageMessage.text}</p>}
            </div>
          </div>

          <div className={`rounded-2xl p-6 shadow-xl ${vipStatus ? 'border border-emerald-400/40 bg-gradient-to-br from-emerald-950/50 to-[#111318]' : 'border border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-[#111318]'}`} role={vipStatus ? 'status' : undefined}>
            <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${vipStatus ? 'text-emerald-300' : 'text-blue-300'}`}>
              <Crown size={20} /> {t('vipTitle')}
            </h2>
            {vipStatus ? <>
              <p className="text-sm font-semibold text-emerald-100">{t('vipActive')}</p>
              {formatVipExpiry(vipStatus.expiresAt) && <p className="text-xs text-emerald-200/75 mt-1">{t('vipValidUntil')} {formatVipExpiry(vipStatus.expiresAt)}</p>}
              <Link href={`/${locale}/vip`} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-400/15 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-400/25">
                {t('vipManage')} <ArrowRight size={15} />
              </Link>
            </> : <>
              <p className="text-xs leading-relaxed text-zinc-400">{t('vipDescription')}</p>
              <Link href={`/${locale}/vip?plan=monthly`} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-xs font-bold text-blue-100 transition hover:bg-blue-500/30">
                {t('vipExplore')} <ArrowRight size={15} />
              </Link>
            </>}
          </div>

          <div className="bg-[#111318] border border-red-500/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-red-500 mb-4">{t('session')}</h2>
            {message?.context === 'account' && (
              <div role="alert" className="mb-3 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400">
                {message.text}
              </div>
            )}
            <button onClick={handleLogout} disabled={signingOut} aria-busy={signingOut} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-wait text-red-500 border border-red-500/30 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer">
              {signingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />} {t('signOut')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
