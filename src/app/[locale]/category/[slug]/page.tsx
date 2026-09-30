'use client';

import React, { useState, useEffect, useRef, use, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Download, Star, Loader2, ArrowLeft, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CategoryBadges } from '@/components/CategoryBadges';
import { FavoriteButton } from '@/components/FavoriteButton';
import { categoryFilter } from '@/lib/mod-categories';
import { ContentImage } from '@/components/ContentImage';
import { InstantLink } from '@/components/InstantLink';
import { DEMO_BUILD_SUMMARY } from '@/lib/demo-build';

const ITEMS_PER_PAGE = 20;

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

interface ModSummary {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  content_categories?: readonly string[] | null;
  image_url_1: string | null;
  showcase_cover_url?: string | null;
  rating: number | null;
  downloads: number | null;
}

export default function CategoryPage({ params }: Props) {
  const { slug, locale } = use(params);

  return <CategoryCatalog key={slug} slug={slug} locale={locale} />;
}

function CategoryCatalog({ slug, locale }: { slug: string; locale: string }) {
  const t = useTranslations('Category');

  const [mods, setMods] = useState<ModSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const fetchCategoryMods = useCallback(async (pageIndex: number, isInitial = false) => {
    const from = pageIndex * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      const { data, error } = await supabase
        .from('public_mods')
        .select('id, title, category, subcategory, content_categories, image_url_1, showcase_cover_url, rating, downloads')
        .or(categoryFilter(slug))
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const supportsDemo = pageIndex === 0 && (slug.toLowerCase() === 'bedrock' || slug.toLowerCase() === 'mcstructure');
      const nextItems = data && data.length > 0 ? data : (supportsDemo ? [DEMO_BUILD_SUMMARY as ModSummary] : []);
      if (isInitial) {
        setMods(nextItems);
      } else {
        setMods((prev) => {
          const newItems = nextItems.filter(newItem => !prev.some(prevItem => prevItem.id === newItem.id));
          return [...prev, ...newItems];
        });
      }

      setHasMore(nextItems.length >= ITEMS_PER_PAGE);
      setLoadError(false);
      return true;
    } catch {
      const supportsDemo = pageIndex === 0 && (slug.toLowerCase() === 'bedrock' || slug.toLowerCase() === 'mcstructure');
      if (supportsDemo) {
        setMods([DEMO_BUILD_SUMMARY as ModSummary]);
        setHasMore(false);
        setLoadError(false);
        return true;
      }
      setLoadError(true);
      return false;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug]);

  useEffect(() => {
    pageRef.current = 0;
    loadingMoreRef.current = false;

    const initialFetch = window.setTimeout(() => {
      void fetchCategoryMods(0, true).then((success) => {
        if (success) pageRef.current = 0;
      });
    }, 0);

    return () => window.clearTimeout(initialFetch);
  }, [fetchCategoryMods]);

  useEffect(() => {
    if (loading || !hasMore || loadingMore || loadError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMoreRef.current) {
          const nextPage = pageRef.current + 1;
          loadingMoreRef.current = true;
          setLoadingMore(true);
          void fetchCategoryMods(nextPage, false).then((success) => {
            if (success) pageRef.current = nextPage;
          }).finally(() => {
            loadingMoreRef.current = false;
          });
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchCategoryMods, hasMore, loadError, loading, loadingMore]);

  const handleRetry = () => {
    if (loadingMoreRef.current) return;

    const isInitial = mods.length === 0;
    const pageIndex = isInitial ? 0 : pageRef.current + 1;
    if (isInitial) {
      setLoading(true);
    } else {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }
    setLoadError(false);

    void fetchCategoryMods(pageIndex, isInitial).then((success) => {
      if (success) pageRef.current = pageIndex;
    }).finally(() => {
      loadingMoreRef.current = false;
    });
  };

  return (
    <div className="w-full flex justify-center gap-6 p-4 sm:p-6 lg:px-9 lg:py-7 min-h-screen max-w-[1800px] lg:max-w-[1480px] mx-auto">

      {/* CONTEÚDO PRINCIPAL (CENTRALIZADO) */}
      <main className="flex-1 max-w-[1200px] lg:max-w-[1180px] min-w-0 flex flex-col">

        {/* CABEÇALHO */}
        <div className="border-b border-[#1D2433] pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="p-2 bg-[#111318] border border-[#1D2433] rounded-xl text-zinc-400 hover:text-white transition cursor-pointer">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
                <Layers className="text-blue-500" size={26} />
                {slug}
              </h1>
              <p className="text-zinc-400 text-sm font-medium">{t('browsing', { category: slug })}</p>
            </div>
          </div>
        </div>

        {/* GRID DE RESULTADOS */}
        {loading ? (
          <CatalogGridLoading />
        ) : loadError && mods.length === 0 ? (
          <div className="text-center text-zinc-400 py-20 font-bold border border-dashed border-[#1D2433] rounded-2xl flex flex-col items-center gap-4">
            <p>{t('loadError')}</p>
            <button type="button" onClick={handleRetry} className="px-4 py-2 rounded-xl border border-blue-500/50 bg-blue-600/20 text-blue-200 hover:bg-blue-600/30 transition cursor-pointer">
              {t('retry')}
            </button>
          </div>
        ) : mods.length === 0 ? (
          <div className="text-center text-zinc-500 py-20 font-bold border border-dashed border-[#1D2433] rounded-2xl uppercase tracking-wider text-sm">
            {t('empty')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {mods.map((mod) => {

                return (
                  <React.Fragment key={mod.id}>
                    {/* CARD DO MOD */}
                      <InstantLink
                      href={`/${locale}/mod/${mod.id}`}
                      className="site-motion-card group flex flex-col bg-[#111318] border border-[#1D2433] rounded-xl overflow-hidden hover:border-blue-500 shadow-lg flex-shrink-0"
                    >
                      <div className="relative aspect-square w-full bg-[#090b10] overflow-hidden flex-shrink-0">
                        <ContentImage
                          src={mod.showcase_cover_url || mod.image_url_1}
                          optimizeWidth={640}
                          optimizeQuality={78}
                          alt={mod.title}
                          loading="lazy"
                          className="site-motion-image object-contain p-1.5 opacity-95 group-hover:opacity-100"
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
                          <CategoryBadges category={mod.category} contentCategories={mod.content_categories} />
                          <div className="flex items-center gap-1 text-[10px] md:text-xs text-zinc-400 font-bold mr-1">
                            <Download size={10} className="text-blue-500 md:w-3.5 md:h-3.5" /> {mod.downloads || 0}
                          </div>
                        </div>
                      </div>
                      </InstantLink>
                  </React.Fragment>
                );
              })}
            </div>

            {/* LOADER DA PAGINAÇÃO */}
            <div ref={observerTarget} className="w-full py-10 flex justify-center items-center">
              {loadingMore && <Loader2 className="animate-spin text-blue-500" size={24} />}
              {loadError && mods.length > 0 && (
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="text-sm text-zinc-400">{t('loadError')}</span>
                  <button type="button" onClick={handleRetry} className="px-4 py-2 rounded-xl border border-blue-500/50 bg-blue-600/20 text-blue-200 hover:bg-blue-600/30 transition cursor-pointer">
                    {t('retry')}
                  </button>
                </div>
              )}
              {!hasMore && mods.length > 0 && (
                <span className="text-xs font-black uppercase text-zinc-600 tracking-widest bg-[#111318] px-4 py-2 rounded-full border border-[#1D2433]/50 mt-4">
                  {t('end')}
                </span>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
}

function CatalogGridLoading() {
  return (
    <div aria-busy="true" aria-label="Carregando construções" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-[#1D2433] bg-[#111318]">
          <div className="aspect-square bg-[linear-gradient(115deg,rgba(10,15,24,.96),rgba(37,99,235,.14),rgba(10,15,24,.96))] bg-[length:200%_100%] motion-safe:animate-[guizz-image-shimmer_1.25s_ease-in-out_infinite]" />
          <div className="space-y-2 p-3"><div className="h-3 w-3/4 rounded bg-white/10 motion-safe:animate-pulse" /><div className="h-2.5 w-2/5 rounded bg-white/5 motion-safe:animate-pulse" /></div>
        </div>
      ))}
    </div>
  );
}
