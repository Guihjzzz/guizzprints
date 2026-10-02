'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Download, Share2, Star, Clock, Shield, HardDrive, ChevronRight, Tag, Gamepad2, Coffee, Search, TrendingUp, type LucideIcon } from "lucide-react";
import DownloadFlow, { type DownloadFormat } from './DownloadFlow';
import { supabase } from "@/lib/supabase";
import { useTranslations } from 'next-intl';
import { InstallAppButton } from '@/components/InstallAppButton';
import { CategoryBadges } from '@/components/CategoryBadges';
import { FavoriteButton } from '@/components/FavoriteButton';
import { categoryLabel, contentCategoryLabel } from '@/lib/mod-categories';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Guide3DPreview } from '@/components/Guide3DPreview';
import { optimizedImageUrl } from '@/lib/media-image';
import { InstantLink } from '@/components/InstantLink';

type SocialIcon = React.ComponentType<{ size?: number; className?: string }>;

const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
  </svg>
);

const DiscordIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
  </svg>
);

function SocialBtn({ icon: Icon, label, hoverColor, href }: { icon: SocialIcon; label: string; hoverColor: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 text-sm font-bold border border-zinc-700 bg-black/50 hover:bg-zinc-800 ${hoverColor} py-2 px-5 rounded-full transition-all text-white cursor-pointer`}>
      <Icon size={18} />
      <span>{label}</span>
    </a>
  );
}

function SpecItem({ icon: Icon, label, value, valueClassName = 'text-zinc-100' }: { icon: LucideIcon; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex min-h-20 flex-col justify-between gap-2 rounded-xl border border-[#263247] bg-[#090d15] px-4 py-3">
      <dt className="flex items-center gap-2 text-xs font-medium text-zinc-500"><Icon size={15} aria-hidden="true" /> {label}</dt>
      <dd className={`break-words text-sm font-black ${valueClassName}`}>{value}</dd>
    </div>
  );
}

interface ModData {
  version?: string | null;
  id: string;
  title?: string;
  category?: string;
  subcategory?: string | null;
  content_themes?: readonly string[] | null;
  content_categories?: readonly string[] | null;
  description?: string;
  youtube_trailer_url?: string;
  file_size?: string;
  price?: string;
  created_at?: string;
  image_url_1?: string | null;
  image_url_2?: string | null;
  image_url_3?: string | null;
  image_url_4?: string | null;
  image_url_5?: string | null;
  image_url_6?: string | null;
  image_url_7?: string | null;
  image_url_8?: string | null;
  showcase_cover_url?: string | null;
  guide_mcstructure_url?: string | null;
  downloads?: number;
  rating?: number;
  guide_schem_url?: string;
  studio_board_url?: string | null;
  direct_download_url?: string;
  download_formats?: readonly DownloadFormat[];
  available_formats?: readonly string[] | null;
  is_demo?: boolean;
}

interface ModViewerProps {
  mod: ModData;
  locale: string;
}

interface ModSuggestion {
  id: string;
  title: string;
  image_url_1: string | null;
  showcase_cover_url?: string | null;
  category: string;
  subcategory: string | null;
  content_themes?: string[] | null;
  content_categories?: string[] | null;
  downloads: number | null;
  rating: number | null;
}

/**
 * The gallery thumbnails are already cached at 192px. Reuse that exact
 * variant as a temporary full-frame preview when a visitor selects an image,
 * then fade the detailed source over it. A selection therefore responds
 * immediately even on a slower connection.
 */
function ProgressiveGalleryImage({ source, alt }: { source: string; alt: string }) {
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const fullImageReady = loadedSource === source;

  return (
    <>
      <OptimizedImage
        src={source}
        optimizeWidth={192}
        optimizeQuality={72}
        alt=""
        aria-hidden="true"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 48px), 760px"
        className={`object-contain p-1.5 sm:p-2 ${fullImageReady ? 'opacity-0' : 'opacity-100'}`}
      />
      <OptimizedImage
        src={source}
        optimizeWidth={1440}
        optimizeQuality={84}
        alt={alt}
        fill
        priority
        sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 48px), 760px"
        onLoad={() => setLoadedSource(source)}
        className={`object-contain p-1.5 transition-opacity duration-150 sm:p-2 ${fullImageReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}

const extractYtThumb = (url?: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

export default function ModViewer({ mod, locale }: ModViewerProps) {
  const router = useRouter();
  const t = useTranslations('Mod');
  const promotion = useTranslations('Promotion');

  const [activeMedia, setActiveMedia] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'install'>('overview');
  const galleryStripRef = useRef<HTMLDivElement>(null);
  const galleryDragRef = useRef({ pointerId: -1, startX: 0, startY: 0, startScrollLeft: 0, didDrag: false });
  const preloadedGalleryImagesRef = useRef(new Set<string>());

  // Estado para Avaliação e Mods Sugeridos
  const [hoverRating, setHoverRating] = useState(0);
  const [suggestedMods, setSuggestedMods] = useState<ModSuggestion[]>([]);
  const [popularMods, setPopularMods] = useState<ModSuggestion[]>([]);

  // Estados em Tempo Real
  const [userId, setUserId] = useState<string | null>(null);
  const [liveDownloads] = useState(mod.downloads || 0);
  const [liveRating, setLiveRating] = useState(mod.rating || 0);
  const [userRating, setUserRating] = useState(0);

  function startGalleryDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const strip = galleryStripRef.current;
    if (!strip) return;

    galleryDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: strip.scrollLeft,
      didDrag: false,
    };
  }

  function moveGalleryDrag(event: React.PointerEvent<HTMLDivElement>) {
    const strip = galleryStripRef.current;
    const drag = galleryDragRef.current;
    if (!strip || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.didDrag && Math.abs(deltaX) <= 4) return;
    if (!drag.didDrag && Math.abs(deltaY) > Math.abs(deltaX)) return;

    drag.didDrag = true;
    // Capturing only after horizontal movement preserves a regular button
    // click. Capturing on pointer-down retargets the release to the strip in
    // some browsers, which prevents the thumbnail button from receiving it.
    if (!strip.hasPointerCapture(event.pointerId)) strip.setPointerCapture(event.pointerId);
    strip.scrollLeft = drag.startScrollLeft - deltaX;
    event.preventDefault();
  }

  function stopGalleryDrag(event: React.PointerEvent<HTMLDivElement>) {
    const strip = galleryStripRef.current;
    const drag = galleryDragRef.current;
    if (!strip || drag.pointerId !== event.pointerId) return;

    if (strip.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
    galleryDragRef.current.pointerId = -1;
  }

  function selectGalleryMedia(index: number) {
    preloadGalleryImage(mediaList[index]?.url);
    setActiveMedia(index);
  }

  // Related cards are below the primary image. Start this secondary request
  // after the first visual paint so it cannot compete with the gallery.
  useEffect(() => {
    if (mod.is_demo) return;
    let cancelled = false;
    const fetchSuggested = async () => {
      const { data } = await supabase
        .from('public_mods')
        .select('id, title, category, subcategory, image_url_1, showcase_cover_url, downloads, rating, content_themes, content_categories')
        .neq('id', mod.id)
        .order('downloads', { ascending: false })
        .limit(24);

      if (cancelled) return;

      if (data && data.length > 0) {
        const currentCategory = mod.category?.toLowerCase();
        const related = data.filter((item) => item.category?.toLowerCase() === currentCategory);
        const other = data.filter((item) => item.category?.toLowerCase() !== currentCategory);
        const suggestions = [...related, ...other].slice(0, 4);
        const suggestionIds = new Set(suggestions.map((item) => item.id));

        setSuggestedMods(suggestions);
        setPopularMods(data.filter((item) => !suggestionIds.has(item.id)).slice(0, 8));
      } else {
        setSuggestedMods([]);
        setPopularMods([]);
      }
    };
    const timer = window.setTimeout(() => {
      void fetchSuggested();
    }, 650);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mod.id, mod.category, mod.is_demo]);

  // Imported Marketplace items refresh on first open, with a server-side
  // cooldown so repeated visitors cannot hammer the official catalog API.
  // A successful refresh re-renders this detail page with the new media.
  useEffect(() => {
    if (mod.is_demo) return;
    const controller = new AbortController();
    const refreshSource = async () => {
      try {
        const response = await fetch(`/api/mods/${encodeURIComponent(mod.id)}/refresh`, {
          method: 'POST',
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) return;
        const result = await response.json() as { refreshed?: boolean };
        if (result.refreshed && !controller.signal.aborted) router.refresh();
      } catch {
        // A best-effort refresh must never block the public item page.
      }
    };
    const timer = window.setTimeout(() => {
      void refreshSource();
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [mod.id, mod.is_demo, router]);

  // Checa Sessão, Favorito e Avaliação Atual
  useEffect(() => {
    if (mod.is_demo) return;
    const checkAuthData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setUserId(session.user.id);

      const { data: ratData } = await supabase
        .from('ratings')
        .select('score')
        .eq('mod_id', mod.id)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (ratData) setUserRating(ratData.score);
    };
    checkAuthData();
  }, [mod.id, mod.is_demo]);

  // Handler de Compartilhamento (Nativo Celular / Copiar Link PC)
  const handleShare = async () => {
    const shareData = {
      title: mod.title || 'Guizzprints',
      text: t('shareText', { title: mod.title || 'Guizzprints' }),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert(t('linkCopied'));
      }
    } catch {
      // Share cancellation is expected and should not expose browser errors.
    }
  };

  // Handler de Avaliação
  const handleRate = async (val: number) => {
    if (mod.is_demo) return;
    if (!userId) {
      alert(t('loginToRate'));
      return;
    }

    setUserRating(val);

    await supabase.from('ratings').upsert({
      mod_id: mod.id,
      user_id: userId,
      score: val
    }, { onConflict: 'user_id, mod_id' });

    const { data } = await supabase.from('public_mods').select('rating').eq('id', mod.id).single();
    if (data) setLiveRating(data.rating);
  };

  const modData = {
    id: mod.id,
    title: mod.title || t('untitled'),
    category: mod.category || t('general'),
    imageUrl: mod.showcase_cover_url || mod.image_url_1 || "https://picsum.photos/seed/1/800/450",
    description: mod.description || t('noDescription'),
    size: mod.file_size || "N/A",
    updatedAt: mod.created_at ? new Intl.DateTimeFormat(locale).format(new Date(mod.created_at)) : "N/A",
  };


  // The public gallery always starts with the four-view Guide 3D cover.
  // The generated board appears only in its dedicated lower section.
  const mediaList = useMemo(() => {
    const guideViewUrls = [
      mod.image_url_1,
      mod.image_url_2,
      mod.image_url_3,
      mod.image_url_4,
      mod.image_url_5,
      mod.image_url_6,
      mod.image_url_7,
      mod.image_url_8,
    ].filter((url): url is string => Boolean(url));

    return [
      mod.showcase_cover_url ? { type: 'image', url: mod.showcase_cover_url } : null,
      ...guideViewUrls.map((url) => ({ type: 'image', url })),
    ].filter((item): item is { type: string; url: string; thumb?: string } => item !== null);
  }, [
    mod.showcase_cover_url,
    mod.image_url_1,
    mod.image_url_2,
    mod.image_url_3,
    mod.image_url_4,
    mod.image_url_5,
    mod.image_url_6,
    mod.image_url_7,
    mod.image_url_8,
  ]);

  // The selected item renders at 1440px. Warm only adjacent full-size images
  // while the visitor is reading the current view, so a gallery click resolves
  // from the browser cache without downloading every large source at once.
  const preloadGalleryImage = useCallback((url?: string) => {
    if (!url || typeof window === 'undefined') return;

    const source = optimizedImageUrl(url, 1440, undefined, 84);
    if (preloadedGalleryImagesRef.current.has(source)) return;
    preloadedGalleryImagesRef.current.add(source);

    const image = new window.Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.src = source;
  }, []);

  useEffect(() => {
    const nearbyUrls = [
      mediaList[activeMedia + 1]?.url,
      mediaList[activeMedia - 1]?.url,
      mediaList[activeMedia + 2]?.url,
    ];
    const timer = window.setTimeout(() => {
      nearbyUrls.forEach(preloadGalleryImage);
    }, 280);

    return () => window.clearTimeout(timer);
  }, [activeMedia, mediaList, preloadGalleryImage]);

  // After the detail page settles, quietly warm the remaining gallery in a
  // staggered sequence. Skip this on data-saving or slow connections: the
  // instant thumbnail preview above still keeps interactions responsive.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return;

    const timers = mediaList
      .map((media, index) => ({ media, index }))
      .filter(({ index }) => index !== activeMedia)
      .map(({ media, index }) => window.setTimeout(() => preloadGalleryImage(media.url), 900 + index * 180));

    return () => timers.forEach(window.clearTimeout);
  }, [activeMedia, mediaList, preloadGalleryImage]);

  const categorySlug = modData.category.toLowerCase().replace(/[^a-z0-9-]+/g, '');

  const discoveryCategories: Array<{
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
    background: string;
  }> = [
    { id: 'bedrock', icon: Gamepad2, title: 'Minecraft Bedrock', description: 'Holoprint, .mcstructure, .mcaddon e .mcworld.', color: 'text-emerald-300', background: 'from-emerald-500/20' },
    { id: 'java', icon: Coffee, title: 'Minecraft Java', description: '.litematic, .schematic, world e .mcfunction.', color: 'text-orange-300', background: 'from-orange-500/20' },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[2200px] lg:max-w-[1540px] items-start gap-6 p-3 sm:gap-6 sm:p-6 lg:gap-7 lg:px-8 lg:py-7 xl:px-9">

      {/* --- CONTEÚDO CENTRAL PRINCIPAL --- */}
        <main className="mx-auto min-w-0 w-full max-w-[1280px] lg:max-w-[1180px] flex-1 basis-0 space-y-6">

        <nav className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          <Link href={`/${locale}`} className="hover:text-blue-500 transition cursor-pointer">{t('home')}</Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/category/${categorySlug}`} className="hover:text-blue-500 transition cursor-pointer">{modData.category}</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-300 truncate max-w-[200px]">{modData.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="min-w-0">
            <div className="relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden rounded-2xl border border-[#1D2433] bg-[#090d15] shadow-2xl lg:max-w-[620px] xl:max-w-[650px]">
              <ProgressiveGalleryImage
                source={mediaList[activeMedia]?.url || modData.imageUrl}
                alt={modData.title}
              />
            </div>

            {mediaList.length > 1 && (
              <div
                ref={galleryStripRef}
                onPointerDown={startGalleryDrag}
                onPointerMove={moveGalleryDrag}
                onPointerUp={stopGalleryDrag}
                onPointerCancel={stopGalleryDrag}
                onDragStart={(event) => event.preventDefault()}
                className="mt-3 flex touch-pan-y select-none gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
                role="tablist"
                aria-label={`Galeria de ${modData.title}. Arraste para ver mais imagens.`}
              >
                {mediaList.map((media, idx) => (
                  <button
                    key={media.url}
                    type="button"
                    role="tab"
                    onClick={() => selectGalleryMedia(idx)}
                    onPointerEnter={() => preloadGalleryImage(media.url)}
                    onPointerDown={() => preloadGalleryImage(media.url)}
                    onFocus={() => preloadGalleryImage(media.url)}
                    aria-label={`Mostrar imagem ${idx + 1} de ${mediaList.length} de ${modData.title}`}
                    aria-selected={activeMedia === idx}
                    className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-[72px] ${activeMedia === idx ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_2px_rgba(37,99,235,.12)]' : 'border-[#1D2433] bg-[#090d15] opacity-65 hover:border-zinc-500 hover:opacity-100'}`}
                  >
                    <OptimizedImage src={media.url || media.thumb || modData.imageUrl} optimizeWidth={192} optimizeQuality={72} fill loading={idx < 3 ? 'eager' : 'lazy'} fetchPriority={idx === activeMedia ? 'high' : 'low'} sizes="72px" className="object-contain p-1" alt={`${modData.title} preview ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 shadow-xl sm:p-5">
              <div className="mb-3"><CategoryBadges category={modData.category} contentCategories={mod.content_categories} contentThemes={mod.content_themes} /></div>
              <h1 className="break-words text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.1rem]">{modData.title}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-[#252c3a] py-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-zinc-200">
                  <OptimizedImage src="/guizz-cover.jpg" optimizeWidth={48} optimizeHeight={48} alt="Guizzprints" width={24} height={24} className="h-6 w-6 rounded-full border border-zinc-700 object-cover" />
                  Guizzprints
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
                <span className="flex items-center gap-1.5 text-zinc-300"><Star size={16} className="fill-yellow-500 text-yellow-500" aria-hidden="true" /> {Number(liveRating).toFixed(1)}</span>
                <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
                <span className="flex items-center gap-1.5 text-zinc-300"><Download size={16} className="text-blue-400" aria-hidden="true" /> {liveDownloads}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <FavoriteButton modId={mod.id} wide disabled={Boolean(mod.is_demo)} title={mod.is_demo ? 'Disponível quando este item for publicado no catálogo' : undefined} />
                <button onClick={handleShare} className="group flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2A3448] bg-[#090d15] px-3 py-2.5 text-xs font-black text-zinc-200 transition hover:border-blue-400/50 hover:bg-blue-500/10">
                  <Share2 size={16} className="transition-colors group-hover:text-blue-300" aria-hidden="true" /> {t('share')}
                </button>
              </div>
            </section>

            <DownloadFlow
              modId={mod.id}
              directUrl={mod.direct_download_url}
              fileName={`${modData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guizzprints'}.mcstructure`}
              formats={mod.download_formats}
              availableFormatIds={mod.available_formats || []}
            />
          </aside>
        </div>

            <div className="site-motion-panel bg-[#111318] border border-[#1D2433] rounded-2xl p-6 sm:p-8 lg:p-5 shadow-xl">
              <div className="flex gap-6 border-b border-[#1D2433] pb-4 text-sm font-bold mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 transition whitespace-nowrap cursor-pointer ${activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t('overview')}
                </button>
                <button
                  onClick={() => setActiveTab('install')}
                  className={`pb-2 transition whitespace-nowrap cursor-pointer ${activeTab === 'install' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t('installation')}
                </button>
              </div>

              <div className="prose prose-invert prose-blue max-w-none text-zinc-300 text-sm sm:text-base lg:text-[0.95rem] leading-relaxed">
                {activeTab === 'overview' ? (
                  <p className="whitespace-pre-line">{modData.description}</p>
                ) : (
                  <div className="space-y-4 bg-[#07090D] p-6 rounded-xl border border-[#1D2433]">
                    <h3 className="text-white font-bold text-lg m-0">{t('stepByStep')}</h3>
                    <ol className="list-decimal list-inside space-y-2 text-zinc-300 font-medium marker:text-blue-500">
                      <li>{t('installStep1')}</li>
                      <li>{t('installStep2')}</li>
                      <li>{t('installStep3')}</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>

        {mod.guide_mcstructure_url && (
          <section className="site-motion-panel overflow-hidden rounded-2xl border border-[#1D2433] bg-[#111318] shadow-xl">
            <div className="border-b border-[#1D2433] px-5 py-5 sm:px-7">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-400">Guia 3D Guizz</p>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Explore a construção em 3D</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">Abra quando quiser girar, aplicar zoom e avançar pelas camadas da construção publicada.</p>
            </div>
            <div className="relative">
              <Guide3DPreview
                modelUrl={mod.guide_mcstructure_url}
                schemUrl={mod.guide_schem_url}
                title={modData.title}
              />
            </div>
          </section>
        )}

        {mod.studio_board_url && (
          <section className="site-motion-panel overflow-hidden rounded-2xl border border-[#1D2433] bg-[#111318] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D2433] px-5 py-5 sm:px-7">
              <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-400">Guizz Studio</p>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Prancha completa da construção</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">Todas as vistas e a lista de blocos em uma única prancha gerada pelo Guizz Studio.</p>
              </div>
              <a href={mod.studio_board_url} download="guizz-studio-prancha.png" className="inline-flex items-center gap-2 rounded-xl border border-blue-500/35 bg-blue-500/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-blue-200 transition hover:bg-blue-500/20">
                <Download size={16} /> Baixar prancha
              </a>
            </div>
            <div className="bg-white p-2 sm:p-4 lg:px-8">
              <OptimizedImage
                src={mod.studio_board_url}
                optimizeWidth={1800}
                optimizeQuality={88}
                width={3000}
                height={5000}
                alt={`Prancha completa do Guizz Studio para ${modData.title}`}
                loading="lazy"
                sizes="(max-width: 640px) calc(100vw - 28px), (max-width: 1280px) calc(100vw - 48px), 1200px"
                 className="mx-auto h-auto w-full max-w-[1000px] rounded-lg object-contain"
              />
            </div>
          </section>
        )}

        <section className="site-motion-panel rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-xl sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase text-white">
            <Shield size={17} className="text-blue-400" aria-hidden="true" /> {t('technicalSpecs')}
          </h3>

          <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
            <SpecItem icon={Tag} label={t('category')} value={categoryLabel(modData.category)} valueClassName="text-blue-300" />
            {mod.subcategory?.trim() && <SpecItem icon={Tag} label={t('subcategory')} value={contentCategoryLabel(mod.subcategory, locale)} valueClassName="text-violet-300" />}
            <SpecItem icon={Tag} label={t('version')} value={mod.version ? `# v${mod.version.replace(/^(?:#\s*v\s*|v(?=\d))/i, '')}` : 'N/A'} valueClassName="break-all text-blue-300" />
            <SpecItem icon={HardDrive} label={t('size')} value={modData.size} />
            <SpecItem icon={Tag} label={t('price')} value={t('free')} valueClassName="text-emerald-300" />
            <SpecItem icon={Clock} label={t('updated')} value={modData.updatedAt} />
            <div className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-[#263247] bg-[#090d15] px-4 py-3 sm:col-span-2 xl:col-span-2">
              <dt className="flex items-center gap-2 text-zinc-400"><Star size={16} className="text-yellow-500" aria-hidden="true" /> {t('rate')}</dt>
              <dd className="flex items-center gap-1" role="radiogroup" aria-label={t('rate')}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={star === (userRating || 0)}
                    aria-label={`${t('rate')}: ${star}/5`}
                    disabled={mod.is_demo}
                    className={`${mod.is_demo ? 'cursor-default' : 'cursor-pointer'} rounded p-0.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:opacity-80 ${star <= (hoverRating || userRating || (mod.is_demo ? liveRating : 0)) ? 'scale-110 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-zinc-700 hover:text-yellow-500/50'}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                  >
                    <Star size={18} className={star <= (hoverRating || userRating || (mod.is_demo ? liveRating : 0)) ? 'fill-current' : ''} aria-hidden="true" />
                  </button>
                ))}
              </dd>
            </div>
            <SpecItem icon={Shield} label={t('anticheat')} value={t('safe')} valueClassName="text-emerald-300" />
          </dl>
        </section>

        {/* --- MODS SUGERIDOS --- */}
        {suggestedMods.length > 0 && (
          <section className="pt-8 sm:pt-12 border-t border-[#1D2433] space-y-6 mt-8">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              {t('suggested')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {suggestedMods.map(sug => (
                <RecommendationCard key={sug.id} mod={sug} locale={locale} />
              ))}
            </div>
          </section>
        )}

        <section className="pt-8 sm:pt-12 border-t border-[#1D2433] space-y-6 mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-500 rounded-full" />
                {t('exploreTitle')}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{t('exploreDescription')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {discoveryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/category/${category.id}`}
                  className={`site-motion-card group relative min-h-40 overflow-hidden rounded-2xl border border-[#1D2433] bg-gradient-to-br ${category.background} via-[#111318] to-[#080A0F] p-5 hover:border-blue-500/50 hover:shadow-[0_16px_40px_-22px_rgba(37,99,235,0.8)]`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <Icon size={24} className={category.color} />
                    </span>
                    <ChevronRight size={20} className="text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-black uppercase text-white">{category.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{category.description}</p>
                  <span className={`mt-4 inline-block text-[10px] font-black uppercase tracking-widest ${category.color}`}>{t('browseCategory')}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {popularMods.length > 0 && (
          <section className="space-y-5 pt-4">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <TrendingUp size={23} className="text-emerald-400" />
              {t('popular')}
            </h2>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {popularMods.map((popular) => (
                <div key={popular.id} className="min-w-[76%] snap-start sm:min-w-0">
                  <RecommendationCard mod={popular} locale={locale} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-blue-500/25 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_42%),#111318] p-5 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl font-black text-white sm:text-2xl">{t('keepExploring')}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{t('keepExploringDescription')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-500">
                <Gamepad2 size={17} /> {t('browseCatalog')}
              </Link>
              <Link href={`/${locale}/search`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2A3448] bg-black/30 px-5 py-3 text-sm font-black text-zinc-200 transition hover:border-blue-500/60 hover:text-white">
                <Search size={17} /> {t('searchMods')}
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER APP & REDES */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB]/20 to-black border border-[#2563EB]/30 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)] mt-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-black/50 rounded-xl p-1 border border-white/10 flex-shrink-0">
              <OptimizedImage src="/guizz-cover.jpg" optimizeWidth={96} optimizeHeight={96} alt="Guizzprints" width={48} height={48} className="w-full h-full rounded-lg object-cover" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black italic uppercase text-white">{promotion('appTitle')}</h3>
              <p className="text-xs text-zinc-400 font-medium">{promotion('appDescription')}</p>
            </div>
          </div>
          <InstallAppButton className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#2563EB]/30 hover:bg-[#2563EB]/10 hover:border-[#2563EB]/60 px-6 py-3 rounded-xl text-sm font-bold uppercase transition-all text-white cursor-pointer" />
        </section>

        <section className="mt-6 bg-gradient-to-r from-[#2563EB]/10 to-black p-6 border-t border-[#2563EB]/30 text-center rounded-2xl">
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

function RecommendationCard({ mod, locale }: { mod: ModSuggestion; locale: string }) {
  return (
    <InstantLink href={`/${locale}/mod/${mod.id}`} className="site-motion-card group block h-full overflow-hidden rounded-xl border border-[#1D2433] bg-[#111318] shadow-lg hover:border-blue-500/70">
      <div className="relative aspect-video overflow-hidden bg-[#07090D]">
        <OptimizedImage src={mod.showcase_cover_url || mod.image_url_1 || '/guizz-cover.jpg'} optimizeWidth={480} optimizeHeight={270} optimizeQuality={70} alt={mod.title} fill loading="lazy" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="site-motion-image object-contain opacity-95 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <FavoriteButton modId={mod.id} className="absolute left-2 top-2" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-2"><CategoryBadges category={mod.category} contentCategories={mod.content_categories} contentThemes={mod.content_themes} /></div>
        <h3 className="truncate text-xs font-bold text-zinc-200 transition-colors group-hover:text-white sm:text-sm" title={mod.title}>{mod.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-zinc-500 sm:text-xs">
          <span className="flex items-center gap-1"><Download size={12} className="text-blue-400" /> {mod.downloads || 0}</span>
          <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-500 text-yellow-500" /> {mod.rating || 'N/A'}</span>
        </div>
      </div>
    </InstantLink>
  );
}
