'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Download, Heart, Share2, Star, Clock, Shield, HardDrive, ChevronRight, Play, Tag, Gamepad2, Coffee, Search, TrendingUp, type LucideIcon } from "lucide-react";
import DownloadFlow from './DownloadFlow';
import { supabase } from "@/lib/supabase";
import { useTranslations } from 'next-intl';
import { InstallAppButton } from '@/components/InstallAppButton';
import { CategoryBadges } from '@/components/CategoryBadges';
import { FavoriteButton } from '@/components/FavoriteButton';
import { categoryLabel } from '@/lib/mod-categories';
import { OptimizedImage } from '@/components/OptimizedImage';

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

interface ModData {
  version?: string | null;
  id: string;
  title?: string;
  category?: string;
  subcategory?: string | null;
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
  downloads?: number;
  rating?: number;
}

interface ModViewerProps {
  mod: ModData;
  locale: string;
}

interface ModSuggestion {
  id: string;
  title: string;
  image_url_1: string | null;
  category: string;
  subcategory: string | null;
  downloads: number | null;
  rating: number | null;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Estado para Avaliação e Mods Sugeridos
  const [hoverRating, setHoverRating] = useState(0);
  const [suggestedMods, setSuggestedMods] = useState<ModSuggestion[]>([]);
  const [popularMods, setPopularMods] = useState<ModSuggestion[]>([]);

  // Estados em Tempo Real
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [liveDownloads] = useState(mod.downloads || 0);
  const [liveRating, setLiveRating] = useState(mod.rating || 0);
  const [userRating, setUserRating] = useState(0);

  // Busca mods sugeridos
  useEffect(() => {
    const fetchSuggested = async () => {
      const { data } = await supabase
        .from('public_mods')
        .select('id, title, category, subcategory, image_url_1, downloads, rating')
        .neq('id', mod.id)
        .order('downloads', { ascending: false })
        .limit(24);

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
    fetchSuggested();
  }, [mod.id, mod.category]);

  // Imported Marketplace items refresh on first open, with a server-side
  // cooldown so repeated visitors cannot hammer the official catalog API.
  // A successful refresh re-renders this detail page with the new media.
  useEffect(() => {
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
    void refreshSource();
    return () => controller.abort();
  }, [mod.id, router]);

  // Checa Sessão, Favorito e Avaliação Atual
  useEffect(() => {
    const checkAuthData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setUserId(session.user.id);

      const { data: favData } = await supabase
        .from('favorites')
        .select('id')
        .eq('mod_id', mod.id)
        .eq('user_id', session.user.id)
        .single();

      if (favData) setIsFavorited(true);

      const { data: ratData } = await supabase
        .from('ratings')
        .select('score')
        .eq('mod_id', mod.id)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (ratData) setUserRating(ratData.score);
    };
    checkAuthData();
  }, [mod.id]);

  // Handler de Favoritos com Alertas de Erro
  const toggleFavorite = async () => {
    if (!userId) {
      alert(t('loginToFavorite'));
      return;
    }

    if (isFavorited) {
      const { error } = await supabase.from('favorites').delete().eq('mod_id', mod.id).eq('user_id', userId);
      if (error) {
        alert(t('favoriteRemoveError'));
      } else {
        setIsFavorited(false);
      }
    } else {
      const { error } = await supabase.from('favorites').insert([{ mod_id: mod.id, user_id: userId }]);
      if (error) {
        alert(t('favoriteAddError'));
      } else {
        setIsFavorited(true);
      }
    }
  };

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
    imageUrl: mod.image_url_1 || "https://picsum.photos/seed/1/800/450",
    description: mod.description || t('noDescription'),
    size: mod.file_size || "N/A",
    updatedAt: mod.created_at ? new Intl.DateTimeFormat(locale).format(new Date(mod.created_at)) : "N/A",
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`;
  };

  const ytThumbUrl = extractYtThumb(mod.youtube_trailer_url) || modData.imageUrl;

  const rawMediaList = [
    mod.youtube_trailer_url ? { type: 'video', url: getEmbedUrl(mod.youtube_trailer_url), thumb: ytThumbUrl } : null,
    mod.image_url_1 ? { type: 'image', url: mod.image_url_1 } : null,
    mod.image_url_2 ? { type: 'image', url: mod.image_url_2 } : null,
    mod.image_url_3 ? { type: 'image', url: mod.image_url_3 } : null,
    mod.image_url_4 ? { type: 'image', url: mod.image_url_4 } : null,
    mod.image_url_5 ? { type: 'image', url: mod.image_url_5 } : null,
  ];

  const mediaList = rawMediaList.filter((item): item is { type: string; url: string; thumb?: string } => item !== null);

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
    <div className="mx-auto flex min-h-screen w-full max-w-[2200px] items-start gap-6 p-3 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">

      {/* --- CONTEÚDO CENTRAL PRINCIPAL --- */}
      <main className="mx-auto min-w-0 w-full max-w-[1280px] flex-1 basis-0 space-y-6">

        <nav className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          <Link href={`/${locale}`} className="hover:text-blue-500 transition cursor-pointer">{t('home')}</Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/category/${categorySlug}`} className="hover:text-blue-500 transition cursor-pointer">{modData.category}</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-300 truncate max-w-[200px]">{modData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">

          {/* COLUNA ESQUERDA: MÍDIA E DESCRIÇÃO */}
          <div className="lg:col-span-8 min-w-0 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_112px] gap-2 w-full md:h-[400px]">
              <div className="relative w-full aspect-video md:aspect-auto md:h-full bg-black rounded-2xl border border-[#1D2433] overflow-hidden z-10 min-w-0">
                {mediaList[activeMedia]?.type === 'video' ? (
                  !isModalOpen ? (
                    <iframe title={modData.title} src={mediaList[activeMedia].url} className="absolute inset-0 w-full h-full border-0" allowFullScreen />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500 font-medium">{t('videoPaused')}</div>
                  )
                ) : (
                  <OptimizedImage src={mediaList[activeMedia]?.url || modData.imageUrl} optimizeWidth={1440} optimizeHeight={810} optimizeQuality={78} alt={modData.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition-opacity duration-300" />
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 w-full md:h-full overflow-x-auto md:overflow-y-auto [scrollbar-width:none] shrink-0 pb-2 md:pb-0">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(idx)}
                    className={`relative shrink-0 w-28 aspect-video md:w-full md:aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeMedia === idx ? 'border-blue-500 scale-[1.02] shadow-lg z-10' : 'border-transparent md:border-[#1D2433] opacity-60 hover:opacity-100'}`}
                  >
                    {media.type === 'video' ? (
                      <>
                        <OptimizedImage src={media.thumb || modData.imageUrl} optimizeWidth={224} optimizeHeight={126} optimizeQuality={68} fill sizes="112px" className="object-cover opacity-60 mix-blend-luminosity" alt={`${modData.title} video preview`} />
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20">
                          <Play size={24} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] fill-current"/>
                        </div>
                      </>
                    ) : (
                      <OptimizedImage src={media.url || media.thumb || modData.imageUrl} optimizeWidth={224} optimizeHeight={126} optimizeQuality={68} fill sizes="112px" className="object-cover" alt={`${modData.title} preview ${idx + 1}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>


          </div>

          {/* COLUNA DIREITA: DOWNLOAD E SPECS */}
          <div className="lg:col-span-4 min-w-0 space-y-5 flex flex-col items-center text-center">
            <div className="w-full space-y-4">
              <h1 className="w-full text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{modData.title}</h1>

              <div className="mx-auto flex w-fit flex-wrap items-center gap-4 text-sm text-zinc-400 bg-[#111318] p-3 rounded-xl shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-500/30">
                <span className="font-bold text-zinc-200 flex items-center gap-2">
                  <OptimizedImage src="/logo.jpg" optimizeWidth={48} optimizeHeight={48} alt="Guizzprints" width={24} height={24} className="w-6 h-6 rounded-full object-cover border border-zinc-700" />
                  <span className="text-white">Guizzprints</span>
                </span>
                <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-current" /> {Number(liveRating).toFixed(1)}</span>
                <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                <span className="flex items-center gap-1.5"><Download size={16} className="text-blue-500" /> {liveDownloads}</span>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-[#1D2433] bg-[#111318] p-3 shadow-xl">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={toggleFavorite} className="flex items-center justify-center gap-2 rounded-xl border border-[#1D2433] bg-[#07090D] px-3 py-2 text-xs font-bold text-zinc-300 transition-colors group cursor-pointer hover:bg-zinc-800">
                  <Heart size={15} className={`transition-colors ${isFavorited ? 'text-red-500 fill-red-500' : 'group-hover:text-red-500'}`} /> {t('favorite')}
                </button>
                <button onClick={handleShare} className="flex items-center justify-center gap-2 rounded-xl border border-[#1D2433] bg-[#07090D] px-3 py-2 text-xs font-bold text-zinc-300 transition-colors group cursor-pointer hover:bg-zinc-800">
                  <Share2 size={15} className="transition-colors group-hover:text-blue-400" /> {t('share')}
                </button>
              </div>
            </div>

            <DownloadFlow
                modId={mod.id}
                modTitle={modData.title}
                modImage={modData.imageUrl}
                onModalStateChange={setIsModalOpen}
              />



          </div>
        </div>

            <div className="site-motion-panel bg-[#111318] border border-[#1D2433] rounded-2xl p-6 sm:p-8 shadow-xl">
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

              <div className="prose prose-invert prose-blue max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed">
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

<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="site-motion-panel bg-[#111318] border border-[#1D2433] rounded-2xl p-6 shadow-xl">
              <h3 className="font-black text-sm uppercase text-white mb-5 flex items-center gap-2">
                <Shield size={16} className="text-blue-500" /> {t('technicalSpecs')}
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-start gap-3 border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2 shrink-0"><Tag size={16}/> {t('category')}</span>
                  <span className="min-w-0 break-words text-right font-bold text-blue-300">{categoryLabel(modData.category)}</span>
                </div>
                {mod.subcategory?.trim() && (
                  <div className="flex justify-between items-start gap-3 border-b border-[#1D2433] pb-3">
                    <span className="text-zinc-500 flex items-center gap-2 shrink-0"><Tag size={16}/> {t('subcategory')}</span>
                    <span className="min-w-0 break-words text-right font-bold text-violet-300">{categoryLabel(mod.subcategory)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center gap-3 border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2 shrink-0"><Tag size={16}/> {t('version')}</span>
                  <span className="min-w-0 break-all text-right font-bold text-blue-300">{mod.version ? `# v${mod.version.replace(/^(?:#\s*v\s*|v(?=\d))/i, '')}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><HardDrive size={16}/> {t('size')}</span>
                  <span className="font-bold text-zinc-200 bg-[#07090D] px-2 py-1 rounded-md border border-[#1D2433]">{modData.size}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><Tag size={16}/> {t('price')}</span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{t('free')}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><Clock size={16}/> {t('updated')}</span>
                  <span className="font-bold text-zinc-200">{modData.updatedAt}</span>
                </div>

                {/* SISTEMA DE AVALIAÇÃO VISUAL */}
                <div className="flex justify-between items-center border-b border-[#1D2433] pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><Star size={16}/> {t('rate')}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`cursor-pointer transition-all ${star <= (hoverRating || userRating) ? 'text-yellow-500 fill-yellow-500 scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-zinc-700 hover:text-yellow-500/50'}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRate(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-500 flex items-center gap-2"><Shield size={16}/> {t('anticheat')}</span>
                  <span className="font-bold text-emerald-400 text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md uppercase tracking-wider">{t('safe')}</span>
                </div>
              </div>
            </div>
</div>

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
              <OptimizedImage src="/logo.jpg" optimizeWidth={96} optimizeHeight={96} alt="Guizzprints" width={48} height={48} className="w-full h-full rounded-lg object-cover" />
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
    <Link href={`/${locale}/mod/${mod.id}`} target="_blank" rel="noopener noreferrer" className="site-motion-card group block h-full overflow-hidden rounded-xl border border-[#1D2433] bg-[#111318] shadow-lg hover:border-blue-500/70">
      <div className="relative aspect-video overflow-hidden bg-[#07090D]">
        <OptimizedImage src={mod.image_url_1 || '/logo.jpg'} optimizeWidth={480} optimizeHeight={270} optimizeQuality={70} alt={mod.title} fill loading="lazy" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="site-motion-image object-cover opacity-90 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <FavoriteButton modId={mod.id} className="absolute left-2 top-2" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-2"><CategoryBadges category={mod.category} subcategory={mod.subcategory} /></div>
        <h3 className="truncate text-xs font-bold text-zinc-200 transition-colors group-hover:text-white sm:text-sm" title={mod.title}>{mod.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-zinc-500 sm:text-xs">
          <span className="flex items-center gap-1"><Download size={12} className="text-blue-400" /> {mod.downloads || 0}</span>
          <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-500 text-yellow-500" /> {mod.rating || 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
}
