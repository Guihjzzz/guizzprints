'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ, Download, Filter, Gamepad2, Loader2, PackageCheck, Search, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { FavoriteButton } from '@/components/FavoriteButton';
import { CategoryBadges } from '@/components/CategoryBadges';
import { ContentImage } from '@/components/ContentImage';
import { InstantLink } from '@/components/InstantLink';
import { CONTENT_CATEGORIES, CONTENT_SIZES, CONTENT_THEMES } from '@/lib/mod-categories';

const ITEMS_PER_PAGE = 12;
const EDITIONS = [
  { id: 'all', label: 'Todas as edições', detail: 'Bedrock e Java' },
  { id: 'bedrock', label: 'Minecraft Bedrock', detail: 'Add-ons, mundos e estruturas' },
  { id: 'java', label: 'Minecraft Java', detail: 'Schematics, mundos e funções' },
] as const;
const FILE_FORMATS = [
  { id: 'all', label: 'Qualquer formato' },
  { id: 'schematic', label: 'Esquema (.schem)' },
  { id: 'world', label: 'Mundo salvo (World)' },
] as const;
const SORT_OPTIONS = [
  { id: 'recent', label: 'Data de publicação' },
  { id: 'downloads', label: 'Mais baixados' },
  { id: 'random', label: 'Descobrir ao acaso' },
] as const;

type Edition = typeof EDITIONS[number]['id'];
type Sort = typeof SORT_OPTIONS[number]['id'];
type Direction = 'desc' | 'asc';
type FileFormat = typeof FILE_FORMATS[number]['id'];
type SearchFilters = { edition: Edition; themes: string[]; size: string; categories: string[]; format: FileFormat; sort: Sort; direction: Direction };

interface ModSummary {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  image_url_1: string | null;
  showcase_cover_url?: string | null;
  rating: number | null;
  downloads: number | null;
  content_themes?: string[] | null;
  content_size?: string | null;
  content_categories?: string[] | null;
}

function validList(value: string | null, allowed: readonly string[]) {
  if (!value) return [];
  return [...new Set(value.split(',').map((entry) => entry.trim()).filter((entry) => allowed.includes(entry)))];
}

function readFilters(params: URLSearchParams): SearchFilters {
  const legacyCategory = params.get('category');
  const requestedEdition = params.get('edition') || (legacyCategory === 'bedrock' || legacyCategory === 'java' ? legacyCategory : 'all');
  const edition = EDITIONS.some((entry) => entry.id === requestedEdition) ? requestedEdition as Edition : 'all';
  const size = params.get('size') || '';
  const format = params.get('format') || 'all';
  const sort = params.get('sort') || 'recent';
  const direction = params.get('direction') || 'desc';
  return {
    edition,
    themes: validList(params.get('themes'), CONTENT_THEMES),
    size: CONTENT_SIZES.includes(size as typeof CONTENT_SIZES[number]) ? size : '',
    categories: validList(params.get('categories'), CONTENT_CATEGORIES),
    format: FILE_FORMATS.some((entry) => entry.id === format) ? format as FileFormat : 'all',
    sort: SORT_OPTIONS.some((entry) => entry.id === sort) ? sort as Sort : 'recent',
    direction: direction === 'asc' ? 'asc' : 'desc',
  };
}

function stableRandom(id: string, seed: number) {
  let result = seed | 0;
  for (let index = 0; index < id.length; index += 1) result = Math.imul(result ^ id.charCodeAt(index), 0x45d9f3b);
  return (result ^ (result >>> 16)) >>> 0;
}

function toggle<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || 'pt';
  const t = useTranslations('Search');
  const categoryT = useTranslations('Category');
  const activeFilters = useMemo(() => readFilters(searchParams), [searchParams]);
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(activeFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mods, setMods] = useState<ModSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [randomSeed, setRandomSeed] = useState(() => Date.now());
  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRef = useRef(0);
  const requestVersionRef = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setQuery((current) => current === initialQuery ? current : initialQuery);
    setFilters((current) => JSON.stringify(current) === JSON.stringify(activeFilters) ? current : activeFilters);
  }, [activeFilters, initialQuery]);

  const makeSearchUrl = useCallback((nextQuery: string, nextFilters: SearchFilters) => {
    const next = new URLSearchParams();
    if (nextQuery.trim()) next.set('q', nextQuery.trim());
    if (nextFilters.edition !== 'all') next.set('edition', nextFilters.edition);
    if (nextFilters.themes.length) next.set('themes', nextFilters.themes.join(','));
    if (nextFilters.size) next.set('size', nextFilters.size);
    if (nextFilters.categories.length) next.set('categories', nextFilters.categories.join(','));
    if (nextFilters.format !== 'all') next.set('format', nextFilters.format);
    if (nextFilters.sort !== 'recent') next.set('sort', nextFilters.sort);
    if (nextFilters.direction !== 'desc') next.set('direction', nextFilters.direction);
    const suffix = next.toString();
    return `/${locale}/search${suffix ? `?${suffix}` : ''}`;
  }, [locale]);

  const updateFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      router.replace(makeSearchUrl(query, next), { scroll: false });
      return next;
    });
  }, [makeSearchUrl, query, router]);

  const fetchFilteredMods = useCallback(async (searchQ: string, nextFilters: SearchFilters, pageIndex: number, isInitial = false, requestVersion = requestVersionRef.current) => {
    const from = pageIndex * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    try {
      let req = supabase.from('public_mods').select('id, title, category, subcategory, image_url_1, showcase_cover_url, rating, downloads, content_themes, content_size, content_categories');
      if (searchQ.trim()) req = req.ilike('title', `%${searchQ.trim()}%`);
      if (nextFilters.edition !== 'all') req = req.eq('category', nextFilters.edition);
      if (nextFilters.themes.length) req = req.overlaps('content_themes', nextFilters.themes);
      if (nextFilters.size) req = req.eq('content_size', nextFilters.size);
      if (nextFilters.categories.length) req = req.overlaps('content_categories', nextFilters.categories);
      if (nextFilters.format !== 'all') req = req.contains('available_formats', [nextFilters.format]);
      const orderColumn = nextFilters.sort === 'downloads' ? 'downloads' : 'created_at';
      const { data, error } = await req.abortSignal(controller.signal).order(orderColumn, { ascending: nextFilters.direction === 'asc' }).order('id', { ascending: nextFilters.direction === 'asc' }).range(from, to);
      if (error) throw error;
      if (requestVersion !== requestVersionRef.current) return;
      const nextData = (data || []) as ModSummary[];
      if (nextFilters.sort === 'random') nextData.sort((left, right) => stableRandom(left.id, randomSeed) - stableRandom(right.id, randomSeed));
      if (isInitial) setMods(nextData);
      else setMods((previous) => [...previous, ...nextData]);
      setLoadError(false);
      setHasMore(nextData.length === ITEMS_PER_PAGE);
    } catch {
      if (controller.signal.aborted || requestVersion !== requestVersionRef.current) return;
      setLoadError(true);
    } finally {
      if (requestVersion === requestVersionRef.current) { setLoading(false); setLoadingMore(false); }
    }
  }, [randomSeed]);

  useEffect(() => () => activeRequest.current?.abort(), []);
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const requestVersion = ++requestVersionRef.current;
    debounceTimer.current = setTimeout(() => {
      pageRef.current = 0;
      setHasMore(true); setLoadError(false); setLoading(true);
      void fetchFilteredMods(query, filters, 0, true, requestVersion);
    }, 250);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [fetchFilteredMods, filterKey, filters, query]);
  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || loadingMore) return;
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage; setLoadingMore(true);
      void fetchFilteredMods(query, filters, nextPage, false, requestVersionRef.current);
    }, { threshold: 0.25 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchFilteredMods, filterKey, filters, hasMore, loading, loadingMore, query]);

  const filterCount = filters.themes.length + filters.categories.length + Number(Boolean(filters.size)) + Number(filters.format !== 'all') + Number(filters.edition !== 'all');
  const hasActiveFilters = Boolean(query || filterCount || filters.sort !== 'recent' || filters.direction !== 'desc');
  const resetFilters = () => {
    const next: SearchFilters = { edition: 'all', themes: [], size: '', categories: [], format: 'all', sort: 'recent', direction: 'desc' };
    setQuery(''); setFilters(next); router.replace(makeSearchUrl('', next), { scroll: false });
  };
  const retrySearch = () => {
    const requestVersion = ++requestVersionRef.current;
    pageRef.current = 0; setHasMore(true); setLoadError(false); setLoading(true);
    void fetchFilteredMods(query, filters, 0, true, requestVersion);
  };
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); router.replace(makeSearchUrl(query, filters), { scroll: false }); retrySearch(); };

  return <div className="mx-auto min-h-screen max-w-[1600px] lg:max-w-[1480px] px-3 py-5 sm:px-6 sm:py-8 lg:px-9 lg:py-7">
    <header className="rounded-3xl border border-[#1D2433] bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.18),transparent_36%),#111318] p-5 shadow-2xl sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.22em] text-blue-300"><Sparkles size={15} /> Catálogo Guizzprints</p><h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Encontre a construção certa</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Escolha sua edição, o estilo e o tamanho. Cada resultado mostra somente arquivos compatíveis com a versão escolhida.</p></div><div className="rounded-2xl border border-blue-400/25 bg-blue-500/[.08] px-4 py-3 text-right"><p className="text-[10px] font-black uppercase tracking-[.16em] text-blue-300">Busca inteligente</p><p className="mt-1 text-sm font-bold text-white">Bedrock + Java</p></div></div>
      <form onSubmit={submitSearch} className="mt-6 flex flex-col gap-2 sm:flex-row" aria-busy={loading}><label className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('placeholder')} className="w-full rounded-2xl border border-[#2b3548] bg-[#07090D] py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition focus:border-blue-400" /></label><button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"><Search size={17} /> {t('submit')}</button><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#2b3548] bg-[#0B0F17] px-5 text-sm font-bold text-zinc-200 lg:hidden"><Filter size={17} /> Filtros {filterCount > 0 && <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] text-white">{filterCount}</span>}</button></form>
    </header>
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className={`${filtersOpen ? 'block' : 'hidden'} rounded-3xl border border-[#1D2433] bg-[#111318] p-4 shadow-xl lg:sticky lg:top-5 lg:block`}>
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#1D2433] pb-4"><div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-blue-400" /><h2 className="font-black text-white">Filtros</h2></div>{hasActiveFilters && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 transition hover:text-white"><X size={14} /> Limpar</button>}</div>
        <section className="border-b border-[#1D2433] pb-5"><p className="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-zinc-500">Edição do Minecraft</p><div className="space-y-2">{EDITIONS.map((edition) => { const selected = filters.edition === edition.id; return <button type="button" key={edition.id} onClick={() => updateFilters({ edition: edition.id })} className={`w-full rounded-2xl border p-3 text-left transition ${selected ? 'border-blue-400 bg-blue-500/15 shadow-lg shadow-blue-950/20' : 'border-[#273247] bg-[#0B0F17] hover:border-blue-400/60'}`}><span className="flex items-center gap-2"><Gamepad2 size={16} className={selected ? 'text-blue-300' : 'text-zinc-500'} /><span className="text-xs font-black text-white">{edition.label}</span></span><span className="mt-1 block pl-6 text-[11px] text-zinc-500">{edition.detail}</span></button>; })}</div></section>
        <section className="border-b border-[#1D2433] py-5"><p className="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-zinc-500">Tema</p><div className="flex flex-wrap gap-2">{CONTENT_THEMES.map((theme) => { const selected = filters.themes.includes(theme); return <button key={theme} type="button" aria-pressed={selected} onClick={() => updateFilters({ themes: toggle(filters.themes, theme) })} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${selected ? 'border-blue-400 bg-blue-500 text-white' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-400 hover:border-blue-400/60 hover:text-white'}`}>{theme}</button>; })}</div></section>
        <section className="border-b border-[#1D2433] py-5"><p className="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-zinc-500">Tamanho</p><div className="grid grid-cols-2 gap-2">{CONTENT_SIZES.map((size) => <button key={size} type="button" onClick={() => updateFilters({ size: filters.size === size ? '' : size })} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${filters.size === size ? 'border-blue-400 bg-blue-500 text-white' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-400 hover:border-blue-400/60 hover:text-white'}`}>{size}</button>)}</div></section>
        <section className="border-b border-[#1D2433] py-5"><p className="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-zinc-500">Formato disponível</p><select value={filters.format} onChange={(event) => updateFilters({ format: event.target.value as FileFormat })} className="w-full rounded-xl border border-[#2b3548] bg-[#0B0F17] px-3 py-2.5 text-xs font-bold text-zinc-200 outline-none focus:border-blue-400">{FILE_FORMATS.map((format) => <option key={format.id} value={format.id}>{format.label}</option>)}</select></section>
        <section className="pt-5"><p className="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-zinc-500">Categorias</p><div className="flex flex-wrap gap-2">{CONTENT_CATEGORIES.map((category) => { const selected = filters.categories.includes(category); return <button key={category} type="button" aria-pressed={selected} onClick={() => updateFilters({ categories: toggle(filters.categories, category) })} className={`rounded-xl border px-2.5 py-2 text-left text-[11px] font-bold transition ${selected ? 'border-blue-400 bg-blue-500 text-white' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-400 hover:border-blue-400/60 hover:text-white'}`}>{category}</button>; })}</div></section>
      </aside>
      <main className="min-w-0"><div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#1D2433] bg-[#111318] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"><p className="text-sm font-bold text-zinc-300"><span className="text-white">Explorar construções</span><span className="ml-2 text-xs text-zinc-500">{filterCount ? `${filterCount} filtro${filterCount > 1 ? 's' : ''} ativo${filterCount > 1 ? 's' : ''}` : 'Todos os estilos e tamanhos'}</span></p><div className="grid grid-cols-2 gap-2 sm:flex"><label className="relative flex items-center gap-2 rounded-xl border border-[#2b3548] bg-[#0B0F17] px-3 py-2 text-xs font-bold text-zinc-300"><ArrowDownUp size={14} className="text-blue-400" /><span className="sr-only">Ordenar por</span><select value={filters.sort} onChange={(event) => { const sort = event.target.value as Sort; if (sort === 'random') setRandomSeed(Date.now()); updateFilters({ sort }); }} className="appearance-none bg-transparent pr-1 outline-none">{SORT_OPTIONS.map((sort) => <option key={sort.id} value={sort.id}>{sort.label}</option>)}</select></label><button type="button" disabled={filters.sort === 'random'} onClick={() => updateFilters({ direction: filters.direction === 'desc' ? 'asc' : 'desc' })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2b3548] bg-[#0B0F17] px-3 py-2 text-xs font-bold text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40">{filters.direction === 'desc' ? <ArrowDownAZ size={14} className="text-blue-400" /> : <ArrowUpAZ size={14} className="text-blue-400" />}{filters.direction === 'desc' ? 'Decrescente' : 'Crescente'}</button></div></div>
        {loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div> : loadError && mods.length === 0 ? <EmptyState error title={categoryT('loadError')} action={retrySearch} actionLabel={categoryT('retry')} /> : mods.length === 0 ? <EmptyState title="Nenhuma construção encontrada" description="Ajuste os filtros ou explore outra edição do Minecraft." action={resetFilters} actionLabel="Limpar filtros" /> : <>{loadError && <div role="alert" className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-200"><span>{categoryT('loadError')}</span><button type="button" onClick={retrySearch} className="rounded-lg border border-amber-300/40 px-3 py-1.5 font-bold transition hover:bg-amber-300/10">{categoryT('retry')}</button></div>}<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:gap-5">{mods.map((mod) => <ModCard key={mod.id} mod={mod} locale={locale} />)}</div><div ref={observerTarget} className="flex w-full items-center justify-center py-8">{loadingMore && <Loader2 className="animate-spin text-blue-500" size={24} />}{!hasMore && <span className="rounded-full border border-[#1D2433] bg-[#111318] px-4 py-2 text-xs font-bold text-zinc-500">Você chegou ao fim dos resultados.</span>}</div></>}
      </main>
    </div>
  </div>;
}

function EmptyState({ title, description, action, actionLabel, error }: { title: string; description?: string; action: () => void; actionLabel: string; error?: boolean }) {
  return <div role={error ? 'alert' : undefined} className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-[#2b3548] bg-[#111318] px-6 text-center"><PackageCheck size={30} className={error ? 'text-amber-400' : 'text-blue-400'} /><h2 className="mt-4 text-lg font-black text-white">{title}</h2>{description && <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>}<button type="button" onClick={action} className="mt-5 rounded-xl border border-blue-400/40 bg-blue-500/15 px-4 py-2 text-xs font-black text-blue-100 transition hover:bg-blue-500/30">{actionLabel}</button></div>;
}

function ModCard({ mod, locale }: { mod: ModSummary; locale: string }) {
  return <InstantLink href={`/${locale}/mod/${mod.id}`} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#1D2433] bg-[#111318] shadow-lg transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_0_22px_rgba(59,130,246,.16)]"><div className="relative aspect-square overflow-hidden border-b border-[#1D2433] bg-[#090b10]"><ContentImage src={mod.showcase_cover_url || mod.image_url_1} optimizeWidth={640} optimizeQuality={78} alt={mod.title} loading="lazy" className="object-contain p-1.5 opacity-95 transition group-hover:scale-[1.02] group-hover:opacity-100" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><FavoriteButton modId={mod.id} className="absolute left-2 top-2" /><div className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/75 px-2 py-1 text-[10px] font-black text-white"><Star size={11} className="fill-current text-yellow-400" /> {mod.rating || 'N/A'}</div>{mod.content_size && <span className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/75 px-2 py-1 text-[10px] font-bold text-zinc-100">{mod.content_size}</span>}</div><div className="flex flex-1 flex-col gap-2 p-3"><h3 className="line-clamp-1 text-sm font-black text-white" title={mod.title}>{mod.title}</h3><div className="line-clamp-1 flex flex-wrap gap-1">{mod.content_categories?.slice(0, 2).map((category) => <span key={category} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-200">{category}</span>)}</div><div className="mt-auto flex items-center justify-between gap-2"><CategoryBadges category={mod.category} contentThemes={mod.content_themes} /><span className="flex items-center gap-1 text-xs font-bold text-zinc-400"><Download size={13} className="text-blue-400" /> {mod.downloads || 0}</span></div></div></InstantLink>;
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}><SearchContent /></Suspense>;
}
