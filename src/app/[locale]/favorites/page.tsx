'use client';
import { CategoryBadges } from '@/components/CategoryBadges';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Heart, Download, Star, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';

export const dynamic = 'force-dynamic'; // Desativa o cache da Vercel para essa rota

type Props = {
  params: Promise<{ locale: string }>;
};

type FavoriteMod = {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  image_url_1: string | null;
  rating: number | null;
  downloads: number | null;
};

export default function FavoritesPage({ params }: Props) {
  const { locale } = use(params);
  const t = useTranslations('Favorites');
  const [mods, setMods] = useState<FavoriteMod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError(t('loginRequired'));
        setLoading(false);
        return;
      }

      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('mod_id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) {
        setError(favoritesError.message);
      } else if (favorites && favorites.length > 0) {
        const favoriteIds = favorites.map((favorite) => favorite.mod_id);
        const { data: favoriteMods, error: modsError } = await supabase
          .from('public_mods')
          .select('id, title, category, subcategory, image_url_1, rating, downloads')
          .in('id', favoriteIds);

        if (modsError) {
          setError(modsError.message);
        } else {
          const modsById = new Map((favoriteMods || []).map((mod) => [mod.id, mod]));
          setMods(favoriteIds.flatMap((id) => {
            const mod = modsById.get(id);
            return mod ? [mod] : [];
          }));
        }
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [t]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen">
      
      <div className="border-b border-[#1D2433] pb-6">
        <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={28} />
          {t('title')}
        </h1>
        <p className="text-zinc-400 mt-2 text-sm font-medium">
          {t('count', { count: mods.length })}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-red-500" size={32} /></div>
      ) : error ? (
        <div className="text-center text-zinc-500 py-20 font-bold border border-dashed border-[#1D2433] rounded-2xl uppercase tracking-wider text-sm">
          {error}
        </div>
      ) : mods.length === 0 ? (
        <div className="text-center text-zinc-500 py-20 font-bold border border-dashed border-[#1D2433] rounded-2xl uppercase tracking-wider text-sm">
          {t('empty')}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {mods.map((mod) => (
            <Link 
              href={`/${locale}/mod/${mod.id}`} 
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              key={mod.id} 
              className="site-motion-card group flex flex-col bg-[#111318] border border-[#1D2433] rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-500 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <div className="aspect-video relative bg-[#07090D] overflow-hidden border-b border-[#1D2433] shrink-0">
                <OptimizedImage
                  src={mod.image_url_1 || "https://picsum.photos/seed/1/800/450"} 
                  optimizeWidth={480}
                  optimizeHeight={270}
                  optimizeQuality={70}
                  alt={mod.title} 
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
                  className="site-motion-image object-cover opacity-90 group-hover:opacity-100"
                />
                <FavoriteButton modId={mod.id} className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2" />
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-white/10 flex items-center gap-1 text-[8px] sm:text-[10px] font-black text-white">
                  <Star size={8} className="text-yellow-500 fill-current sm:w-[10px] sm:h-[10px]" /> {mod.rating || 'N/A'}
                </div>
              </div>
              
              <div className="p-2 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
                <h3 className="text-[11px] sm:text-sm font-bold text-zinc-100 line-clamp-2 group-hover:text-white transition-colors leading-tight">{mod.title}</h3>
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-medium border-t border-[#1D2433] pt-2 sm:pt-3 mt-auto">
                  <span className="flex items-center gap-1 sm:gap-1.5"><Download size={12} className="sm:w-3.5 sm:h-3.5" /> {mod.downloads || 0}</span>
                  <CategoryBadges category={mod.category} subcategory={mod.subcategory} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
