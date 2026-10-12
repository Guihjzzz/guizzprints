'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, ExternalLink, Flag, Loader2, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getClientAdminAuthToken } from '@/lib/client-auth';

type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';
type ReportItem = {
  id: string;
  mod_id: string | null;
  mod_title: string;
  edition: 'bedrock' | 'java';
  category: string;
  reason: string;
  details: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
};
const PAGE_SIZE = 30;
const STATUS_OPTIONS: ReportStatus[] = ['open', 'reviewing', 'resolved', 'dismissed'];

export default function AdminReportsPage() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'pt';
  const t = useTranslations('Report.admin');
  const [token, setToken] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | ReportStatus>('all');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    let active = true;
    void getClientAdminAuthToken().then((value) => {
      if (!active) return;
      setToken(value);
      setCheckingAccess(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!token) return;
    let active = true;
    const controller = new AbortController();
    void fetch(`/api/admin/reports?page=${page}&status=${filter}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: controller.signal,
    }).then(async (response) => {
      const body = await response.json().catch(() => null) as { items?: ReportItem[]; total?: number } | null;
      if (!response.ok || !body) throw new Error('load');
      if (!active) return;
      setItems(Array.isArray(body.items) ? body.items : []);
      setTotal(typeof body.total === 'number' ? body.total : 0);
    }).catch(() => {
      if (active) setError(t('loadError'));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, [token, page, filter, reloadKey, t]);

  async function updateStatus(id: string, status: ReportStatus) {
    if (!token || busyId) return;
    setBusyId(id);
    setError('');
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }), cache: 'no-store',
      });
      if (!response.ok) throw new Error('update');
      if (filter !== 'all' && filter !== status) {
        setReloadKey((value) => value + 1);
      } else {
        setItems((current) => current.map((item) => item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item));
      }
    } catch {
      setError(t('updateError'));
    } finally {
      setBusyId(null);
    }
  }

  if (checkingAccess) return <div className="flex min-h-screen items-center justify-center bg-[#07090D]"><Loader2 className="animate-spin text-blue-400" size={34} /></div>;

  if (!token) return <main className="min-h-screen bg-[#07090D] px-4 py-12 text-white"><div className="mx-auto max-w-3xl rounded-2xl border border-red-400/20 bg-[#111318] p-6"><p className="font-black text-red-200">{t('accessDenied')}</p><Link href={`/${locale}/admin/publisher`} className="mt-4 inline-flex text-sm font-bold text-blue-300 underline">{t('backToAdmin')}</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#07090D] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-[#1D2433] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/admin/publisher`} aria-label={t('backToAdmin')} className="rounded-xl border border-[#1D2433] bg-[#111318] p-2 text-zinc-400 transition hover:text-white"><ArrowLeft size={18} /></Link>
            <div><p className="text-[10px] font-black uppercase tracking-[.24em] text-amber-300">{t('eyebrow')}</p><h1 className="text-2xl font-black sm:text-3xl">{t('title')}</h1><p className="mt-1 max-w-2xl text-sm leading-5 text-zinc-400">{t('description')}</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/${locale}/admin/publisher`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#283244] bg-[#111318] px-3 py-2 text-xs font-black text-zinc-200 transition hover:border-blue-400/40 hover:text-white"><ArrowLeft size={14} /> {t('publisher')}</Link>
            <button type="button" onClick={() => { setLoading(true); setError(''); setReloadKey((value) => value + 1); }} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-500 disabled:opacity-50"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> {t('refresh')}</button>
          </div>
        </header>

        {error && <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200"><AlertCircle size={16} />{error}</p>}

        <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300"><Flag size={18} /></span><div><h2 className="font-black">{t('listTitle')}</h2><p className="text-xs text-zinc-500">{t('total', { count: total })}</p></div></div>
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-400"><span>{t('filter')}</span><select value={filter} onChange={(event) => { setLoading(true); setError(''); setPage(1); setFilter(event.target.value as 'all' | ReportStatus); }} className="min-h-10 rounded-xl border border-[#283244] bg-[#07090D] px-3 text-sm text-white outline-none focus:border-blue-400">
              <option value="all">{t('statuses.all')}</option>
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{t(`statuses.${status}`)}</option>)}
            </select></label>
          </div>
        </section>

        {loading && items.length === 0 ? <div className="flex min-h-40 items-center justify-center text-zinc-400"><Loader2 className="mr-2 animate-spin text-blue-400" />{t('loading')}</div> : null}

        {!loading && items.length === 0 && !error && <div className="rounded-2xl border border-dashed border-[#283244] bg-[#111318]/70 px-5 py-14 text-center"><Flag size={24} className="mx-auto text-zinc-600" /><p className="mt-3 font-bold text-zinc-300">{t('empty')}</p></div>}

        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 shadow-lg sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase ${item.edition === 'java' ? 'border-orange-400/30 bg-orange-400/10 text-orange-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'}`}>{t(item.edition)}</span>
                    {item.category && <span className="rounded-md border border-[#283244] bg-[#090d15] px-2 py-1 text-[10px] font-bold text-zinc-300">{item.category}</span>}
                    <span className="text-xs text-zinc-500">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.created_at))}</span>
                  </div>
                  <h3 className="mt-3 break-words text-lg font-black text-white">{item.mod_title}</h3>
                  <p className="mt-1 text-sm font-bold text-amber-200">{t(`reasons.${item.reason}`)}</p>
                  {item.details && <p className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-[#252c3a] bg-[#090d15] px-3 py-3 text-sm leading-6 text-zinc-300">{item.details}</p>}
                  {item.mod_id && <Link href={`/${locale}/mod/${item.mod_id}`} target="_blank" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-blue-200">{t('openItem')} <ExternalLink size={13} /></Link>}
                </div>
                <label className="flex shrink-0 flex-col gap-1.5 text-xs font-bold text-zinc-400 lg:w-48">
                  <span>{t('status')}</span>
                  <select value={item.status} disabled={busyId === item.id} onChange={(event) => void updateStatus(item.id, event.target.value as ReportStatus)} className="min-h-10 rounded-xl border border-[#283244] bg-[#07090D] px-3 text-sm text-white outline-none focus:border-blue-400 disabled:opacity-50">
                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{t(`statuses.${status}`)}</option>)}
                  </select>
                  {busyId === item.id && <span className="inline-flex items-center gap-1 text-blue-300"><Loader2 size={12} className="animate-spin" />{t('saving')}</span>}
                </label>
              </div>
            </article>
          ))}
        </div>

        {total > PAGE_SIZE && <nav aria-label={t('pagination')} className="flex items-center justify-between rounded-xl border border-[#1D2433] bg-[#111318] px-4 py-3">
          <button type="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setError(''); setPage((value) => Math.max(1, value - 1)); }} className="rounded-lg border border-[#283244] px-3 py-2 text-xs font-bold text-zinc-200 disabled:opacity-40">{t('previous')}</button>
          <span className="text-xs font-bold text-zinc-400">{t('page', { page, pages })}</span>
          <button type="button" disabled={page >= pages || loading} onClick={() => { setLoading(true); setError(''); setPage((value) => Math.min(pages, value + 1)); }} className="rounded-lg border border-[#283244] px-3 py-2 text-xs font-bold text-zinc-200 disabled:opacity-40">{t('next')}</button>
        </nav>}
      </div>
    </main>
  );
}
