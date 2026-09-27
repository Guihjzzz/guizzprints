'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Download, Star, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { CategoryBadges } from '@/components/CategoryBadges';
import { FavoriteButton } from '@/components/FavoriteButton';
import { categoryFilter } from '@/lib/mod-categories';
import { OptimizedImage } from '@/components/OptimizedImage';

const CATEGORIES = ['all', 'addons', 'maps', 'textures', 'skins', 'shaders', 'holoprint', 'mash-up'];
const ITEMS_PER_PAGE = 12;

interface ModSummary {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  image_url_1: string | null;
  rating: number | null;
  downloads: number | null;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = useTranslations('Search');
  const categoryT = useTranslations('Category');

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  
  const [mods, setMods] = useState<ModSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pageRef = useRef(0);
  const requestVersionRef = useRef(0);

  const fetchFilteredMods = useCallback(async (searchQ: string, catQ: string, pageIndex: number, isInitial = false, requestVersion = requestVersionRef.current) => {
    const from = pageIndex * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      let req = supabase.from('public_mods').select('id, title, category, subcategory, image_url_1, rating, downloads');

      if (searchQ.trim()) {
        req = req.ilike('title', `%${searchQ.trim()}%`);
      }

      if (catQ && catQ !== 'all') {
        req = req.or(categoryFilter(catQ));
      }

      const { data, error } = await req.order('created_at', { ascending: false }).order('id', { ascending: false }).range(from, to);
      if (error) throw error;

      // A slower response from a previous query must never replace the
      // results for the user's latest search/filter state.
      if (requestVersion !== requestVersionRef.current) return;
      
      if (isInitial) {
        setMods(data || []);
      } else {
        setMods((prev) => [...prev, ...(data || [])]);
      }
      setLoadError(false);
      
      if (!data || data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch {
      if (requestVersion !== requestVersionRef.current) return;
      setLoadError(true);
    } finally {
      if (requestVersion === requestVersionRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const requestVersion = ++requestVersionRef.current;

    debounceTimer.current = setTimeout(() => {
      pageRef.current = 0;
      setHasMore(true);
      setLoadError(false);
      setLoading(true);
      void fetchFilteredMods(query, category, 0, true, requestVersion);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [category, fetchFilteredMods, query]);

  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setLoadingMore(true);
          void fetchFilteredMods(query, category, nextPage, false, requestVersionRef.current);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [category, fetchFilteredMods, hasMore, loading, loadingMore, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paramsUpdate = new URLSearchParams();
    if (query) paramsUpdate.set('q', query);
    if (category && category !== 'all') paramsUpdate.set('category', category);
    router.push(`/${locale}/search?${paramsUpdate.toString()}`);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    const paramsUpdate = new URLSearchParams();
    if (query) paramsUpdate.set('q', query);
    if (cat && cat !== 'all') paramsUpdate.set('category', cat);
    router.push(`/${locale}/search?${paramsUpdate.toString()}`);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    router.push(`/${locale}/search`);
  };

  const retrySearch = () => {
    const requestVersion = ++requestVersionRef.current;
    pageRef.current = 0;
    setHasMore(true);
    setLoadError(false);
    setLoading(true);
    void fetchFilteredMods(query, category, 0, true, requestVersion);
  };

  const renderGridWithAds = () => {
    if (mods.length === 0) return null;

    const elements = [];
    for (let i = 0; i < mods.length; i++) {
      const mod = mods[i];

      elements.push(
        <Link 
          href={`/${locale}/mod/${mod.id}`} 
          key={mod.id} 
          className="site-motion-card group flex flex-col bg-[#111318] border border-[#1D2433] rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-500 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex-shrink-0"
        >
          <div className="relative w-full h-[89px] md:h-[124px] bg-zinc-900 overflow-hidden flex-shrink-0 border-b border-[#1D2433]">
            <OptimizedImage
              src={mod.image_url_1 || "https://picsum.photos/seed/1/400/225"} 
              optimizeWidth={480}
              optimizeHeight={270}
              optimizeQuality={70}
              alt={mod.title} 
              fill
              loading="lazy"
              className="site-motion-image object-cover opacity-90 group-hover:opacity-100"
              sizes="(max-width: 768px) 160px, 220px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <FavoriteButton modId={mod.id} className="absolute left-1.5 top-1.5 md:left-2 md:top-2" />
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 text-[10px] md:text-xs font-black text-white z-10">
              <Star size={10} className="text-yellow-500 fill-current md:w-3.5 md:h-3.5" /> {mod.rating || 'N/A'}
            </div>
          </div>
          
          <div className="w-full flex-1 px-2 py-2 md:p-3 bg-[#0a0a0a] border-t border-zinc-800 flex flex-col gap-1 md:gap-1.5">
            <h3 className="text-[11px] md:text-sm font-bold text-white line-clamp-1 leading-tight" title={mod.title}>{mod.title}</h3>
            
            <div className="flex items-center justify-between gap-1 mt-auto">
              <CategoryBadges category={mod.category} subcategory={mod.subcategory} />
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-zinc-400 font-bold mr-1">
                <Download size={10} className="text-blue-500 md:w-3.5 md:h-3.5" /> {mod.downloads || 0}
              </div>
            </div>
          </div>
        </Link>
      );

      if ((i + 1) % 8 === 0 && i !== mods.length - 1) {
        elements.push(
          <AdPlaceholder key={`ad-${i}`} format="mobile" className="col-span-2 sm:col-span-3 md:col-span-4 xl:hidden w-full min-w-0 my-2">
            Ad Slot - In-Feed Mobile
          </AdPlaceholder>
        );
      }
    }
    return elements;
  };

  return (
    <div className="max-w-[1800px] mx-auto p-3 sm:p-6 lg:p-8 min-h-screen flex gap-6 lg:gap-8 items-start">
      
      <AdPlaceholder as="aside" format="sidebar" className="hidden xl:block shrink-0">
        <div className="w-full flex-1 bg-[#111318] border border-dashed border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-500 text-xs font-mono uppercase shadow-inner">
          Ad Slot - Left Sidebar
        </div>
      </AdPlaceholder>

      <main className="flex-1 min-w-0 space-y-6">
        
        <div className="border-b border-[#1D2433] pb-6 space-y-4">
          <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
            <Search className="text-blue-500" size={28} />
            {t('title')}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full bg-[#111318] border border-[#1D2433] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-blue-500 outline-none transition text-white font-medium"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-6 rounded-xl text-sm font-bold uppercase transition-colors cursor-pointer">
              {t('submit')}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-zinc-500 text-xs font-bold uppercase flex items-center gap-1.5 mr-2">
              <SlidersHorizontal size={14} /> {t('filters')}
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-[#111318] text-zinc-400 border-[#1D2433] hover:text-white hover:border-zinc-700'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}

            {(query || category !== 'all') && (
              <button onClick={clearFilters} className="text-zinc-500 hover:text-red-400 text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer transition-colors uppercase">
                <X size={14} /> {t('clear')}
              </button>
            )}
          </div>
        </div>

        <AdPlaceholder format="mobile" className="xl:hidden w-full min-w-0 mb-4">
          Ad Slot - Top Mobile
        </AdPlaceholder>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
        ) : loadError && mods.length === 0 ? (
          <div role="alert" className="text-center text-zinc-400 py-16 font-bold border border-dashed border-amber-500/40 rounded-2xl uppercase tracking-wider text-sm">
            <p>{categoryT('loadError')}</p>
            <button type="button" onClick={retrySearch} className="mt-4 rounded-lg border border-blue-500/50 bg-blue-600/20 px-4 py-2 text-xs text-blue-200 transition hover:bg-blue-600/40">
              {categoryT('retry')}
            </button>
          </div>
        ) : mods.length === 0 ? (
          <div className="text-center text-zinc-500 py-20 font-bold border border-dashed border-[#1D2433] rounded-2xl uppercase tracking-wider text-sm">
            {t('empty')}
          </div>
        ) : (
          <>
            {loadError && <div role="alert" className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-200">
              <span>{categoryT('loadError')}</span>
              <button type="button" onClick={retrySearch} className="rounded-lg border border-amber-300/40 px-3 py-1.5 font-bold transition hover:bg-amber-300/10">
                {categoryT('retry')}
              </button>
            </div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
              {renderGridWithAds()}
            </div>
            
            <div ref={observerTarget} className="w-full py-6 flex justify-center items-center">
              {loadingMore && <Loader2 className="animate-spin text-blue-500" size={24} />}
              {!hasMore && mods.length > 0 && (
                <span className="text-xs font-black uppercase text-zinc-600 tracking-widest bg-[#111318] px-4 py-2 rounded-full border border-[#1D2433]/50">
                  {t('end')}
                </span>
              )}
            </div>
          </>
        )}
      </main>

      <AdPlaceholder as="aside" format="sidebar" className="hidden xl:block shrink-0">
        <div className="w-full flex-1 bg-[#111318] border border-dashed border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-500 text-xs font-mono uppercase shadow-inner">
          Ad Slot - Right Sidebar
        </div>
      </AdPlaceholder>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
