'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Download, ChevronRight, ChevronLeft, Star, Gamepad2, Coffee, Box, Eye, FileArchive, type LucideIcon } from "lucide-react";
import { useTranslations } from 'next-intl';
import { InstallAppButton } from '@/components/InstallAppButton';
import { CategoryBadges } from '@/components/CategoryBadges';
import { categoryFilter } from '@/lib/mod-categories';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';
import { DEMO_BUILD_SUMMARY } from '@/lib/demo-build';

type SocialIcon = React.ComponentType<{ size?: number; className?: string }>;

interface ModSummary {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  image_url_1?: string | null;
  image_url_2?: string | null;
  showcase_cover_url?: string | null;
  guide_mcstructure_url?: string | null;
  rating?: number | null;
  downloads?: number | null;
  created_at?: string;
}

// Home cards only render this bounded summary. Avoid transferring descriptions,
// private metadata or unused image columns for the 50-item discovery window and
// the seven category rails.
const HOME_MOD_FIELDS = 'id, title, category, subcategory, image_url_1, image_url_2, showcase_cover_url, guide_mcstructure_url, rating, downloads, created_at';

// A single 3D publication creates one entry for Bedrock and another for Java.
// The home-wide discovery areas should feature the construction once, while
// the edition-specific rails below continue to show the relevant version.
function withoutPublicationDuplicates(items: ModSummary[]) {
  const publicationSources = new Set<string>();
  return items.filter((item) => {
    const source = item.guide_mcstructure_url?.trim();
    if (!source) return true;
    if (publicationSources.has(source)) return false;
    publicationSources.add(source);
    return true;
  });
}

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
  
  const [latestBedrock, setLatestBedrock] = useState<ModSummary[]>([]);
  const [latestJava, setLatestJava] = useState<ModSummary[]>([]);
  // Keep the server/first render deterministic. The home is a client component,
  // so discovering the viewport in an effect avoids a hydration mismatch while
  // still allowing mobile to request/render a smaller initial rail.
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);

  const getCategoryColor = (category: string) => {
    const cat = category?.toLowerCase();
    if (cat === "bedrock") return "text-emerald-300 bg-emerald-600/20 border-emerald-500/30";
    if (cat === "java") return "text-orange-300 bg-orange-600/20 border-orange-500/30";
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

      const categoryNames = ['bedrock', 'java'] as const;
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
      const demo = DEMO_BUILD_SUMMARY as ModSummary;
      const topItems = withoutPublicationDuplicates(trending && trending.length > 0 ? trending : [demo]);
      const downloadedItems = all.length > 0
        ? withoutPublicationDuplicates([...all].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))).slice(0, railLimit)
        : [demo];
      const bedrockItems = categoryItems.bedrock.length > 0 ? categoryItems.bedrock : [demo];

      setTopMods(topItems);
      setMostDownloaded(downloadedItems);
      setLatestBedrock(bedrockItems);
      setLatestJava(categoryItems.java);
      
      setLoading(false);
    };

    void fetchHomeData().catch(() => {
      if (cancelled) return;
      const demo = DEMO_BUILD_SUMMARY as ModSummary;
      setTopMods([demo]);
      setMostDownloaded([demo]);
      setLatestBedrock([demo]);
      setLatestJava([]);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isMobileViewport]);

  return (
    <div className="max-w-[1800px] mx-auto p-3 sm:p-6 lg:p-8 min-h-screen flex gap-6 lg:gap-8 items-start">
      
      <main className="flex-1 min-w-0 space-y-8 pb-20">
        
        {!loading && topMods.length > 0 && <HeroCarousel mods={topMods} locale={locale} />}
        {loading && <div className="min-h-[380px] w-full rounded-2xl border border-[#1D2433] bg-[#111318] animate-pulse md:aspect-[2/1] md:min-h-0" />}

        <section>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">{t('marketplace')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CategoryBtn name="Minecraft Bedrock" icon={Gamepad2} color="text-emerald-400" border="border-emerald-500/30" bg="from-emerald-500/10" href={`/${locale}/category/bedrock`} />
            <CategoryBtn name="Minecraft Java" icon={Coffee} color="text-orange-400" border="border-orange-500/30" bg="from-orange-500/10" href={`/${locale}/category/java`} />
          </div>
        </section>

        <ModList title={t('mostDownloaded')} icon={Download} iconColor="text-blue-500" indicatorColor="bg-blue-600" mods={mostDownloaded} loading={loading} reserveWhileLoading locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/search`} viewAllLabel={t('viewAll')} />
        <ModList title="Construções Bedrock" icon={Gamepad2} iconColor="text-emerald-500" indicatorColor="bg-emerald-600" mods={latestBedrock} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/bedrock`} viewAllLabel={t('viewAll')} />
        <ModList title="Construções Java" icon={Coffee} iconColor="text-orange-500" indicatorColor="bg-orange-600" mods={latestJava} loading={loading} locale={locale} getCategoryColor={getCategoryColor} viewAllHref={`/${locale}/category/java`} viewAllLabel={t('viewAll')} />

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB]/20 to-black border border-[#2563EB]/30 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-black/50 rounded-xl p-1 border border-white/10 flex-shrink-0 relative">
              <OptimizedImage src="/guizz-cover.jpg" optimizeWidth={64} alt="Guizzprints" fill className="rounded-lg object-cover" sizes="48px" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black italic uppercase text-white">{promotion('appTitle')}</h3>
              <p className="text-xs text-zinc-400 font-medium">{promotion('appDescription')}</p>
            </div>
          </div>
          <InstallAppButton className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#2563EB]/30 hover:bg-[#2563EB]/10 hover:border-[#2563EB]/60 px-6 py-3 rounded-xl text-sm font-bold uppercase transition-all text-white cursor-pointer" />
        </section>

        <section aria-labelledby="quick-start-title" className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 shadow-xl sm:p-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-400">Guizzprints</p>
            <h2 id="quick-start-title" className="mt-2 text-xl font-black text-white sm:text-2xl">{t('quickStart.title')}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{t('quickStart.description')}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <QuickStartStep icon={Box} title={t('quickStart.chooseTitle')} description={t('quickStart.chooseDescription')} color="text-emerald-300" />
            <QuickStartStep icon={Eye} title={t('quickStart.guideTitle')} description={t('quickStart.guideDescription')} color="text-blue-300" />
            <QuickStartStep icon={FileArchive} title={t('quickStart.downloadTitle')} description={t('quickStart.downloadDescription')} color="text-orange-300" />
          </div>
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

    </div>
  );
}

function QuickStartStep({ icon: Icon, title, description, color }: { icon: LucideIcon; title: string; description: string; color: string }) {
  return (
    <div className="rounded-xl border border-[#263247] bg-[#090b10] p-4">
      <Icon size={22} className={color} aria-hidden="true" />
      <h3 className="mt-3 text-sm font-black text-white">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-zinc-400">{description}</p>
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
    <section className="relative w-full overflow-hidden rounded-2xl border border-[#1D2433] bg-[#090b10] shadow-2xl">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {mods.map((mod, index) => (
          <Link
            href={`/${locale}/mod/${mod.id}`}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            key={`hero-${mod.id}`}
            className="group/slide relative grid w-full flex-shrink-0 snap-center overflow-hidden bg-[#080a0f] md:aspect-[2.08/1]"
          >
            <div className="grid aspect-[2/1] grid-cols-2 gap-1 bg-[#101722] p-1 sm:p-1.5 md:absolute md:inset-0 md:aspect-auto md:gap-2 md:p-2">
              <div className="relative overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,.14),transparent_68%),#090b10]">
                <OptimizedImage
                  src={mod.image_url_1 || mod.showcase_cover_url || "https://picsum.photos/seed/hero-1/900/900"}
                  optimizeWidth={960}
                  optimizeQuality={80}
                  fill
                  className="object-contain p-1.5 sm:p-2 drop-shadow-[0_20px_28px_rgba(0,0,0,.36)] transition-transform duration-500 group-hover/slide:scale-[1.015]"
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  alt={`${mod.title} — ${t('featuredView', { number: 1 })}`}
                  sizes="(max-width: 767px) 50vw, (max-width: 1200px) 50vw, 900px"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,.14),transparent_68%),#090b10]">
                <OptimizedImage
                  src={mod.image_url_2 || mod.showcase_cover_url || mod.image_url_1 || "https://picsum.photos/seed/hero-2/900/900"}
                  optimizeWidth={960}
                  optimizeQuality={80}
                  fill
                  className="object-contain p-1.5 sm:p-2 drop-shadow-[0_20px_28px_rgba(0,0,0,.36)] transition-transform duration-500 group-hover/slide:scale-[1.015]"
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  alt={`${mod.title} — ${t('featuredView', { number: 2 })}`}
                  sizes="(max-width: 767px) 50vw, (max-width: 1200px) 50vw, 900px"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[52%] bg-gradient-to-t from-[#05070b]/90 via-[#05070b]/42 to-transparent md:block" aria-hidden="true" />
            <div className="relative z-10 px-5 pb-10 pt-4 sm:px-7 md:absolute md:bottom-8 md:left-8 md:w-[min(34%,360px)] md:p-0 lg:bottom-10 lg:left-10">
              <span className="w-fit rounded-md bg-[#2563EB] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-blue-950/40">
                {t('featuredWeek')}
              </span>
              <h1 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,.72)] sm:text-3xl md:text-[30px]">{mod.title}</h1>
              <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-blue-400/40 bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_28px_-16px_rgba(37,99,235,.95)] transition-colors group-hover/slide:bg-blue-500">
                <Eye size={16} aria-hidden="true" /> {t('viewDetails')}
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
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
        <div className="flex h-[220px] md:h-[288px] gap-2 overflow-hidden md:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`rail-skeleton-${index}`} className="h-[200px] min-w-[160px] rounded-xl border border-zinc-800/70 bg-[#111318]/60 motion-safe:animate-pulse md:h-[270px] md:min-w-[220px]" />
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
          <Link href={`/${locale}/mod/${mod.id}`} prefetch={false} target="_blank" rel="noopener noreferrer" key={mod.id} className="site-motion-card min-w-[160px] w-[160px] md:min-w-[220px] md:w-[220px] flex-shrink-0 snap-start bg-black border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 group cursor-pointer flex flex-col">
            
            <div className="relative aspect-square w-full bg-[#090b10] overflow-hidden flex-shrink-0">
              <OptimizedImage
                src={mod.showcase_cover_url || mod.image_url_1 || "https://picsum.photos/seed/1/400/225"}
                optimizeWidth={640}
                optimizeQuality={78}
                alt={mod.title} 
                fill
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
