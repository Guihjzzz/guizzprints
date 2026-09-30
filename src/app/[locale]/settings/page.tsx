'use client';

import React, { useState, useEffect, use } from 'react';
import { signOut, updatePassword, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseUser } from '@/lib/firebase-client';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { Settings, User, Mail, Lock, LogOut, Loader2, Save, Globe, AtSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isAppLocale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };
type Account = {
  email: string | null;
  displayName: string | null;
  provider: 'firebase' | 'supabase';
  firebaseUser?: FirebaseUser;
};

export default function SettingsPage({ params }: Props) {
  const { locale } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Settings');
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Account | null>(null);
  
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
    let active = true;
    const fetchUser = async () => {
      const currentFirebaseUser = getFirebaseAuth()?.currentUser;
      if (currentFirebaseUser) {
        if (!active) return;
        setUser({ email: currentFirebaseUser.email, displayName: currentFirebaseUser.displayName, provider: 'firebase', firebaseUser: currentFirebaseUser });
        setUsername(currentFirebaseUser.displayName || '');
        setLoading(false);
        return;
      }

      // Sessions created before the Firebase migration are immediately
      // available in Supabase. Keep them usable instead of leaving the
      // settings page waiting for Firebase's background restoration.
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (!active) return;
        const displayName = typeof session.user.user_metadata?.username === 'string' ? session.user.user_metadata.username : null;
        setUser({ email: session.user.email ?? null, displayName, provider: 'supabase' });
        setUsername(displayName || '');
        setLoading(false);
        return;
      }

      const restoredFirebaseUser = await getFirebaseUser();
      if (!active) return;
      if (!restoredFirebaseUser) {
        router.replace(`/${locale}/login`);
        return;
      }
      setUser({ email: restoredFirebaseUser.email, displayName: restoredFirebaseUser.displayName, provider: 'firebase', firebaseUser: restoredFirebaseUser });
      setUsername(restoredFirebaseUser.displayName || '');
      setLoading(false);
    };
    void fetchUser();
    return () => { active = false; };
  }, [locale, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setSavingProfile(true);
    setMessage(null);

    try {
      if (user?.provider === 'firebase') {
        const auth = getFirebaseAuth();
        if (!auth?.currentUser) throw new Error('missing-user');
        await updateProfile(auth.currentUser, { displayName: username.trim() });
        setUser({ email: auth.currentUser.email, displayName: auth.currentUser.displayName, provider: 'firebase', firebaseUser: auth.currentUser });
      } else {
        const { error } = await supabase.auth.updateUser({ data: { username: username.trim() } });
        if (error) throw error;
        setUser((current) => current ? { ...current, displayName: username.trim() } : current);
      }
      setMessage({ type: 'success', text: t('profileSaved'), context: 'profile' });
    } catch {
      setMessage({ type: 'error', text: t('profileError'), context: 'profile' });
    }
    
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
    
    try {
      if (user?.provider === 'firebase') {
        const auth = getFirebaseAuth();
        if (!auth?.currentUser) throw new Error('missing-user');
        await updatePassword(auth.currentUser, newPassword);
      } else {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      }
      setMessage({ type: 'success', text: t('passwordSaved'), context: 'password' });
      setNewPassword('');
    } catch {
      setMessage({ type: 'error', text: t('passwordError'), context: 'password' });
    }
    setSavingPassword(false);
  };

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setMessage(null);
    try {
      if (user?.provider === 'firebase') {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error('missing-auth');
        await signOut(auth);
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
    } catch {
      setSigningOut(false);
      setMessage({ type: 'error', text: t('signOutError'), context: 'account' });
      return;
    }
    setUser(null);
    router.replace(`/${locale}/login`);
  };

  // Lógica de troca de idioma
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (!isAppLocale(newLocale) || newLocale === locale) return;

    setSelectedLanguage(newLocale);
    setSavingLanguage(true);
    setLanguageMessage(null);

    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    setLanguageMessage({ type: 'success', text: t('languageSaved') });
    router.replace(newPath);
    router.refresh();
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
