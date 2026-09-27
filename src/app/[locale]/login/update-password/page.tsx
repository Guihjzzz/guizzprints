'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { defaultLocale, isAppLocale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getVipReturnPath } from '@/lib/auth-return';
import { authErrorKey } from '@/lib/auth-actions';

export default function UpdatePasswordPage() {
  const params = useParams();
  const locale = isAppLocale(params.locale) ? params.locale : defaultLocale;
  const t = useTranslations('Auth');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visibleField, setVisibleField] = useState<'new-password' | 'confirm-password' | null>(null);
  const [loading, setLoading] = useState(false);
  const [validity, setValidity] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);
  const busy = useRef(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let live = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!live) return;
      setValidity(!error && data.user ? 'valid' : 'invalid');
      if (error || !data.user) setMessage({ success: false, text: t('sessionExpired') });
    }).catch(() => {
      if (live) { setValidity('invalid'); setMessage({ success: false, text: t('sessionExpired') }); }
    });
    return () => { live = false; if (redirectTimer.current) clearTimeout(redirectTimer.current); };
  }, [t]);
  const returnPath = () => getVipReturnPath(new URLSearchParams(window.location.search).get('next'));
  const loginPath = () => `/${locale}/login${returnPath() ? `?next=${encodeURIComponent(returnPath()!)}` : ''}`;
  const update = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy.current || validity !== 'valid') return;
    if (password.length < 8) { setMessage({ success: false, text: t('passwordTooShort') }); return; }
    if (password !== confirmation) { setMessage({ success: false, text: t('passwordMismatch') }); return; }
    busy.current = true; setLoading(true); setMessage(null);
    try {
      // Revalidate on submit, not just on initial page load.
      const { data, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !data.user) {
        setValidity('invalid'); setMessage({ success: false, text: t('sessionExpired') }); return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setMessage({ success: false, text: t(authErrorKey(error)) }); return; }
      setMessage({ success: true, text: t('passwordUpdated') });
      setPassword(''); setConfirmation('');
      redirectTimer.current = setTimeout(() => window.location.assign(returnPath() ?? `/${locale}`), 1500);
    } catch { setMessage({ success: false, text: t('authUnavailable') }); }
    finally {
      if (!redirectTimer.current) { busy.current = false; setLoading(false); }
    }
  };
  const disabled = validity !== 'valid' || loading;
  return <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#111318] border border-[#1D2433] rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-8 border-b border-[#1D2433] pb-6">
        <button type="button" aria-label={t('back')} disabled={loading} onClick={() => window.location.assign(loginPath())}
          className="p-2 bg-[#07090D] border border-[#1D2433] rounded-xl text-zinc-400 hover:text-white transition"><ArrowLeft size={18}/></button>
        <div><h1 className="text-xl font-black text-white">{t('newPasswordTitle')}</h1>
          <p className="text-xs text-zinc-400 mt-1">{t('newPasswordSubtitle')}</p></div>
      </div>
      {validity === 'checking' && <p role="status" className="text-sm text-zinc-400 mb-6 flex items-center gap-2"><Loader2 size={16} className="animate-spin"/>{t('checkingSession')}</p>}
      {message && <div role={message.success ? 'status' : 'alert'} className={`p-4 rounded-xl border text-sm text-center mb-6 ${
        message.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>{message.text}</div>}
      {validity === 'invalid' ? <a className="block rounded-xl bg-blue-600 p-4 text-center text-white font-bold"
        href={`/${locale}/login?mode=reset${returnPath() ? `&next=${encodeURIComponent(returnPath()!)}` : ''}`}>{t('requestNewLink')}</a> : <form onSubmit={update} className="space-y-4" aria-busy={loading || validity === 'checking'}>
        {[{ id: 'new-password', label: t('newPassword'), value: password, change: setPassword },
          { id: 'confirm-password', label: t('confirmPassword'), value: confirmation, change: setConfirmation }].map(field => <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2"><Lock size={14}/>{field.label}</label>
          <div className="relative">
            <input id={field.id} name={field.id} type={visibleField === field.id ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={field.value}
              onChange={e => field.change(e.target.value)} placeholder="••••••••" disabled={disabled}
              className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 pr-24 text-sm focus:border-blue-500 outline-none transition text-white disabled:opacity-50"/>
            <button type="button" aria-controls={field.id} aria-pressed={visibleField === field.id} disabled={disabled}
              onClick={() => setVisibleField(value => value === field.id ? null : field.id as 'new-password' | 'confirm-password')}
              className="absolute inset-y-0 right-2 my-1 rounded-lg px-2 text-xs font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50">
              {visibleField === field.id ? t('hidePassword') : t('showPassword')}
            </button>
          </div>
        </div>)}
        <p className="text-xs text-zinc-500">{t('passwordHint')}</p>
        <button type="submit" disabled={disabled} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed">
          {disabled ? <><Loader2 className="animate-spin" size={18}/>{t('working')}</> : <><Save size={18}/>{t('updateAndSignIn')}</>}
        </button>
      </form>}
    </div>
  </div>;
}
