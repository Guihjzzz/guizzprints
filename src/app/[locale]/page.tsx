'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Download, Zap, Map as MapIcon, Layers, PlusCircle, User, ChevronRight, ChevronLeft, Star, Box, Puzzle, type LucideIcon } from "lucide-react";
import { useTranslations } from 'next-intl';
import { InstallAppButton } from '@/components/InstallAppButton';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { CategoryBadges } from '@/components/CategoryBadges';
import { categoryFilter } from '@/lib/mod-categories';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';

type SocialIcon = React.ComponentType<{ size?: number; className?: string }>;

interface ModSummary {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  image_url_1?: string | null;
  rating?: number | null;
  downloads?: number | null;
  created_at?: string;
}

// Home cards only render this bounded summary. Avoid transferring descriptions,
// private metadata or unused image columns for the 50-item discovery window and
// the seven category rails.
const HOME_MOD_FIELDS = 'id, title, category, subcategory, image_url_1, rating, downloads, created_at';

const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
);
const DiscordIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.0777.0777 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path></svg>
);
const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
);

export default function Home() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations('Home');
  const promotion = useTranslations('Promotion');

  const [loading, setLoading] = useState(true);
  const [topMods, setTopMods] = useState<ModSummary[]>([]);
  const [mostDownloaded, setMostDownloaded] = useState<ModSummary[]>([]);
  
  const [latestAddons, setLatestAddons] = useState<ModSummary[]>([]);
  const [latestTextures, setLatestTextures] = useState<ModSummary[]>([]);
  const [latestMaps, setLatestMaps] = useState<ModSummary[]>([]);
  const [latestSkins, setLatestSkins] = useState<ModSummary[]>([]);
  const [latestShaders, setLatestShaders] = useState<ModSummary[]>([]);
  const [latestHoloprint, setLatestHoloprint] = useState<ModSummary[]>([]);
  const [latestMashUp, setLatestMashUp] = useState<ModSummary[]>([]);
  // Keep the server/first render deterministic. The home is a client component,
  // so discovering the viewport in an effect avoids a hydration mismatch while
  // still allowing mobile to request/render a smaller initial rail.
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);

  const getCategoryColor = (category: string) => {
    const cat = category?.toLowerCase();
    if (cat === "addons" || cat === "add-ons") return "text-red-300 bg-red-600/20 border-red-500/30";
    if (cat === "textures") return "text-green-300 bg-green-600/20 border-green-500/30";
    if (cat === "maps") return "text-orange-300 bg-orange-600/20 border-orange-500/30";
    if (cat === "skins") return "text-purple-300 bg-purple-600/20 border-purple-500/30";
    if (cat === "holoprint") return "text-cyan-300 bg-cyan-600/20 border-cyan-500/30";
    return "text-blue-300 bg-blue-600/20 border-blue-500/30";
  };

  useEffect(() => {
    const subscribeToViewport = () => {
      try {
        const media = window.matchMedia('(max-width: 767px)');
        const handleChange = () => setIsMobileViewport(media.matches);
        setIsMobileViewport(media.matches);

        if (typeof media.addEventListener === 'function') {
          media.addEventListener('change', handleChange);
          return () => media.removeEventListener('change', handleChange);
        }

        media.addListener(handleChange);
        return () => media.removeListener(handleChange);
      } catch {
        // A conservative desktop fallback preserves the complete discovery
        // rails if an embedded/browser environment cannot expose matchMedia.
        setIsMobileViewport(false);
      }
    };

    return subscribeToViewport();
  }, []);

  useEffect(() => {
    if (isMobileViewport === null) return;
    let cancelled = false;

    const fetchHomeData = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const railLimit = isMobileViewport ? 6 : 8;

      const categoryNames = ['addons', 'textures', 'maps', 'skins', 'shaders', 'holoprint', 'mash-up'] as const;
      const [latestResult, trendingResult, ...categoryResults] = await Promise.all([
        supabase.from('public_mods').select(HOME_MOD_FIELDS).order('created_at', { ascending: false }).limit(50),
        supabase
          .from('public_mods')
          .select(HOME_MOD_FIELDS)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('downloads', { ascending: false })
          .limit(3),
        ...categoryNames.map(category =>
          supabase
            .from('public_mods')
            .select(HOME_MOD_FIELDS)
            .or(categoryFilter(category))
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .limit(railLimit)
        ),
      ]);

      if (cancelled) return;

      const latest = latestResult.data;
      let trending = trendingResult.data;

      if (!trending || trending.length < 3) {
        const { data: fallbackTrending } = await supabase
          .from('public_mods')
          .select(HOME_MOD_FIELDS)
          .order('downloads', { ascending: false })
          .limit(3);
        trending = fallbackTrending;
      }

      if (cancelled) return;

      const all = latest || [];

      // Keep the discovery rails independent from the global 50-item home
      // window. A busy category should not hide its latest skins just because
      // newer items from other categories filled that window first.
      const categoryItems = Object.fromEntries(categoryNames.map((category, index) => [category, categoryResults[index].data || []]));

      setTopMods(trending || []);
      setMostDownloaded([...all].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, railLimit));
      setLatestAddons(categoryItems.addons);
      setLatestTextures(categoryItems.textures);
      setLatestMaps(categoryItems.maps);
      setLatestSkins(categoryItems.skins);
      setLatestShaders(categoryItems.shaders);
      setLatestHoloprint(categoryItems.holoprint);
      setLatestMashUp(categoryItems['mash-up']);
      
      setLoading(false);
    };

    void fetchHomeData();
    return () => {
      cancelled = true;
    };
  }, [isMobileViewport]);

  return (
    <div className="max-w-[1800px] mx-auto p-3 sm:p-6 lg:p-8 min-h-screen flex gap-6 lg:gap-8 items-start">
      
      <AdPlaceholder as="aside" format="sidebar" className="hidden xl:block shrink-0">
        Ad Slot Vertical (Esquerda)
      </AdPlaceholder>

      <main className="flex-1 min-w-0 space-y-8 pb-20">
        
        <AdPlaceholder format="mobile" className="xl:hidden w-full min-w-0">
          Ad Slot Mobile
        </AdPlaceholder>

        {!loading && topMods.length > 0 && <HeroCarousel mods={topMods} locale={locale} />}
        {loading && <div className="w-full aspect-[16/9] md:aspect-[3/1] bg-[#111318] rounded-2xl animate-pulse" />}

        <section>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">{t('marketplace')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3">
            <CategoryBtn name={t('addons')} icon={PlusCircle} color="text-red-400" border="border-red-500/30" bg="from-red-500/10" href={`/${locale}/category/addons`} />
            <CategoryBtn name={t('maps')} icon={MapIcon} color="text-orange-400" border="border-orange-500/30" bg="from-orange-500/10" href={`/${locale}/category/maps`} />
            <CategoryBtn name={t('textures')} icon={Layers} color="text-green-400" border="border-green-500/30" bg="from-green-500/10" href={`/${locale}/category/textures`} />
            <CategoryBtn name={t('skins')} icon={User} color="text-purple-400" border="border-purple-500/30" bg="from-purple-500/10" href={`/${locale}/category/skins`} />
            <CategoryBtn name={t('holoprint')} icon={Box} color="text-cyan-400" border="border-cyan-500/30" bg="from-cyan-500/10" href={`/${locale}/category/holoprint`} />
            <CategoryBtn name={t('mash-up')} icon={Puzzle} color="text-pink-400" border="border-pink-500/30" bg="from-pink-500/10" href={`/${locale}/category/mash-up`} />
          </div>
        </section>

        <ModList title={t('mostDownloaded')} icon={Download} iconColor="text-blue-500" indicatorColor="bg-blue-600" mods={mostDownloaded} loading={loading} reserveWhileLoading locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/search`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestAddons')} icon={Zap} iconColor="text-red-500" indicatorColor="bg-red-600" mods={latestAddons} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/addons`} viewAllLabel={t('viewAll')} />
        
        <AdPlaceholder format="mobile" className="xl:hidden w-full min-w-0">
          Ad Slot Mobile In-Feed
        </AdPlaceholder>

        <ModList title={t('latestTextures')} icon={Layers} iconColor="text-green-500" indicatorColor="bg-green-600" mods={latestTextures} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/textures`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestMaps')} icon={MapIcon} iconColor="text-orange-500" indicatorColor="bg-orange-600" mods={latestMaps} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/maps`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestSkins')} icon={User} iconColor="text-purple-500" indicatorColor="bg-purple-600" mods={latestSkins} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/skins`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestShaders')} icon={Zap} iconColor="text-yellow-500" indicatorColor="bg-yellow-600" mods={latestShaders} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/shaders`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestHoloprint')} icon={Box} iconColor="text-cyan-500" indicatorColor="bg-cyan-600" mods={latestHoloprint} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/holoprint`} viewAllLabel={t('viewAll')} />
        <ModList title={t('latestMashUp')} icon={Puzzle} iconColor="text-pink-500" indicatorColor="bg-pink-600" mods={latestMashUp} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/mash-up`} viewAllLabel={t('viewAll')} />

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB]/20 to-black border border-[#2563EB]/30 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-black/50 rounded-xl p-1 border border-white/10 flex-shrink-0 relative">
              <OptimizedImage src="/logo.jpg" optimizeWidth={64} alt="GuizzMods" fill className="rounded-lg object-cover" sizes="48px" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black italic uppercase text-white">{promotion('appTitle')}</h3>
              <p className="text-xs text-zinc-400 font-medium">{promotion('appDescription')}</p>
            </div>
          </div>
          <InstallAppButton className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#2563EB]/30 hover:bg-[#2563EB]/10 hover:border-[#2563EB]/60 px-6 py-3 rounded-xl text-sm font-bold uppercase transition-all text-white cursor-pointer" />
        </section>

        <section className="mt-12 bg-gradient-to-r from-[#2563EB]/10 to-black p-6 border-t border-[#2563EB]/30 text-center rounded-2xl">
          <h3 className="text-lg md:text-xl font-black text-white uppercase italic mb-2">{promotion('followTitle')}</h3>
          <p className="text-zinc-400 mb-6 text-xs md:text-sm">{promotion('followDescription')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <SocialBtn icon={TikTokIcon} label="TikTok" hoverColor="hover:text-pink-500" href="https://www.tiktok.com/@guihjzzz" />
            <SocialBtn icon={DiscordIcon} label="Discord" hoverColor="hover:text-indigo-400" href="https://discord.gg/fxVzEzXhNe" />
            <SocialBtn icon={YoutubeIcon} label="YouTube" hoverColor="hover:text-red-500" href="https://www.youtube.com/@Guihjzz" />
          </div>
        </section>

      </main>

      <AdPlaceholder as="aside" format="sidebar" className="hidden xl:block shrink-0">
        Ad Slot Vertical (Direita)
      </AdPlaceholder>
      
    </div>
  );
}

function HeroCarousel({ mods, locale }: { mods: ModSummary[]; locale: string }) {
  const t = useTranslations('Home');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mods.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % mods.length;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, mods.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[3/1] rounded-2xl overflow-hidden border border-[#1D2433] shadow-2xl group">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {mods.map((mod, index) => (
          <Link href={`/${locale}/mod/${mod.id}`} key={`hero-${mod.id}`} className="w-full h-full flex-shrink-0 snap-center relative block">
            <OptimizedImage
              src={mod.image_url_1 || "https://picsum.photos/seed/hero2/1200/600"}
              optimizeWidth={1280}
              optimizeHeight={720}
              optimizeQuality={78}
              fill
              className="object-cover brightness-[0.65]"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              alt={mod.title}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/40 to-transparent" />
            
            <div className="absolute bottom-6 left-4 md:bottom-8 md:left-8 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:block w-16 h-16 rounded-xl border border-white/10 shadow-lg relative overflow-hidden shrink-0">
                  <OptimizedImage src={mod.image_url_1 || "/logo.jpg"} optimizeWidth={128} optimizeHeight={128} alt={mod.title} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <span className="bg-[#2563EB] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">{t('featuredWeek')}</span>
                  <h1 className="text-xl md:text-4xl font-black text-white mt-1 drop-shadow-md line-clamp-1">{mod.title}</h1>
                  <div className="hidden md:flex items-center gap-2 mt-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 pointer-events-none">
                      <Download size={16} /> {t('viewDetails')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {mods.map((_, i) => (
          <button 
            key={`dot-${i}`} 
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' });
              }
            }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${i === activeIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white'}`} 
            aria-label={t('goToSlide', { number: i + 1 })}
          />
        ))}
      </div>
    </section>
  );
}

interface CategoryBtnProps {
  name: string;
  icon: LucideIcon;
  color: string;
  border: string;
  bg: string;
  href: string;
}

function CategoryBtn({ name, icon: Icon, color, border, bg, href }: CategoryBtnProps) {
  return (
    <Link href={href} className={`site-motion-card w-full flex items-center justify-center gap-2 bg-gradient-to-b ${bg} to-[#111318] border ${border} p-3 rounded-xl cursor-pointer`}>
      <Icon className={color} size={18} />
      <span className="font-black text-xs md:text-sm uppercase tracking-wide text-white">{name}</span>
    </Link>
  );
}

interface ModListProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  indicatorColor: string;
  mods: ModSummary[];
  loading?: boolean;
  reserveWhileLoading?: boolean;
  locale: string;
  getCategoryColor: (category: string) => string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

function ModList({ title, icon: Icon, iconColor, indicatorColor, mods, loading = false, reserveWhileLoading = false, locale, getCategoryColor, viewAllHref, viewAllLabel }: ModListProps) {
  const t = useTranslations('Home');
  const scrollRef = useRef<HTMLDivElement>(null);

  // The catalog requests resolve together. Rendering eight skeleton rails here
  // and then removing empty categories caused the document to shrink by several
  // hundred pixels. Keep one stable first rail for the first viewport; the
  // populated category rails enter below the existing marketplace block.
  if (loading) {
    if (!reserveWhileLoading) return null;

    return (
      <section aria-hidden="true" className="space-y-3 min-h-[204px] md:min-h-[254px]">
        <div className="h-7 md:h-8 w-2/5 rounded-lg bg-[#111318]/70 motion-safe:animate-pulse" />
        <div className="flex h-40 md:h-[210px] gap-2 overflow-hidden md:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`rail-skeleton-${index}`} className="h-36 min-w-[160px] rounded-xl border border-zinc-800/70 bg-[#111318]/60 motion-safe:animate-pulse md:h-[190px] md:min-w-[220px]" />
          ))}
        </div>
      </section>
    );
  }

  if (mods.length === 0) return null;

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <section className="space-y-3 min-h-[204px] md:min-h-[254px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2 text-white">
          <span className={`w-1 md:w-1.5 h-5 md:h-6 ${indicatorColor} rounded-full`}></span>
          <Icon className={iconColor} size={20} />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {viewAllHref && viewAllLabel && (
            <Link href={viewAllHref} className="flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-wide text-blue-300 hover:text-white transition-colors">
              {viewAllLabel}
              <ChevronRight size={14} />
            </Link>
          )}
          <div className="hidden md:flex gap-2">
            <button onClick={scrollLeft} aria-label={t('scrollLeft')} className="p-1.5 bg-black/50 border border-zinc-700 rounded-full hover:bg-zinc-800 transition cursor-pointer"><ChevronLeft size={16} className="text-white"/></button>
            <button onClick={scrollRight} aria-label={t('scrollRight')} className="p-1.5 bg-black/50 border border-zinc-700 rounded-full hover:bg-zinc-800 transition cursor-pointer"><ChevronRight size={16} className="text-white"/></button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
        {mods.map((mod) => (
          <Link href={`/${locale}/mod/${mod.id}`} key={mod.id} className="site-motion-card min-w-[160px] w-[160px] md:min-w-[220px] md:w-[220px] flex-shrink-0 snap-start bg-black border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 group cursor-pointer flex flex-col">
            
            <div className="relative w-full h-[89px] md:h-[124px] bg-zinc-900 overflow-hidden flex-shrink-0">
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
                <CategoryBadges category={mod.category} subcategory={mod.subcategory} primaryClassName={getCategoryColor(mod.category)} />
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-zinc-400 font-bold mr-1">
                  <Download size={10} className="text-blue-500 md:w-3.5 md:h-3.5" /> {mod.downloads || 0}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SocialBtn({ icon: Icon, label, hoverColor, href }: { icon: SocialIcon; label: string; hoverColor: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 text-sm font-bold border border-zinc-700 bg-black/50 hover:bg-zinc-800 ${hoverColor} py-2 px-5 rounded-full transition-all text-white cursor-pointer`}>
      <Icon size={18} />
      <span>{label}</span>
    </a>
  );
}
