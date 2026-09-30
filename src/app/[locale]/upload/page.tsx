'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeModVersion, validateModVersion } from '@/lib/mod-version';
import { collectCatalogCsv } from '@/lib/catalog-csv';
import { getClientAdminAuthToken } from '@/lib/client-auth';
import { 
  Upload, Link2, FileText, Tag, ArrowLeft, Loader2, 
  Gamepad2, Coffee, Layers, Video,
  Trash2, Edit3, Settings, Database, Save, Search, Download, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { id: 'bedrock', label: 'Minecraft Bedrock', icon: Gamepad2 },
  { id: 'java', label: 'Minecraft Java', icon: Coffee },
];

const FORMAT_OPTIONS = {
  bedrock: [
    { id: 'holoprint', label: 'Holoprint' }, { id: 'mcstructure', label: '.mcstructure' },
    { id: 'mcaddon', label: '.mcaddon' }, { id: 'mcworld', label: '.mcworld' },
  ],
  java: [
    { id: 'litematic', label: '.litematic' }, { id: 'schematic', label: '.schematic / .schem' },
    { id: 'world', label: 'World' }, { id: 'mcfunction', label: '.mcfunction' },
  ],
} as const;
const ALL_FORMATS = [...FORMAT_OPTIONS.bedrock, ...FORMAT_OPTIONS.java];

const INITIAL_FORM = {
  id: '',
  title: '',
  category: '', 
  subcategory: '',
  description: '',
  version: '1.0.0',
  file_size: '',
  price: 'Free',
  terabox_url: '',
  youtube_trailer_url: '',
  image_url_1: '',
  image_url_2: '',
  image_url_3: '',
  image_url_4: '',
  image_url_5: '',
  source_url: '',
  source_fingerprint: '',
  source_creator: '',
  source_tags: [] as string[],
  source_published_at: '',
  source_pack_type: '',
};

type AdminModSummary = {
  id: string;
  title: string;
  category: string;
  guide_mcstructure_url: string | null;
  guide_schem_url: string | null;
  subcategory: string | null;
  version: string | null;
  file_size: string | null;
  downloads: number | null;
  rating: number | null;
  created_at: string;
  source_provider: string | null;
  source_sync_status: 'ok' | 'error' | 'checking' | null;
  source_sync_error: string | null;
  source_sync_failed_at: string | null;
  source_creator: string | null;
  source_tags: string[] | null;
  source_published_at: string | null;
  categories?: string[];
  subcategories?: string[];
};

function groupAdminMods(items: AdminModSummary[]): AdminModSummary[] {
  const categoryOrder = new Map<string, number>(CATEGORIES.map((category, index) => [category.id, index]));
  const formatOrder = new Map<string, number>(ALL_FORMATS.map((format, index) => [format.id, index]));
  const groups = new Map<string, AdminModSummary>();
  for (const item of items) {
    const key = item.guide_mcstructure_url?.trim() || item.guide_schem_url?.trim() || `single:${item.id}`;
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { ...item, categories: [item.category], subcategories: item.subcategory ? [item.subcategory] : [] });
      continue;
    }
    existing.categories = Array.from(new Set([...(existing.categories || []), item.category]))
      .sort((a, b) => (categoryOrder.get(a) ?? 99) - (categoryOrder.get(b) ?? 99));
    existing.subcategories = Array.from(new Set([...(existing.subcategories || []), ...(item.subcategory ? [item.subcategory] : [])]))
      .sort((a, b) => (formatOrder.get(a.trim().toLowerCase()) ?? 99) - (formatOrder.get(b.trim().toLowerCase()) ?? 99));
    existing.downloads = (existing.downloads || 0) + (item.downloads || 0);
    if (existing.source_sync_status !== 'error' && item.source_sync_status === 'error') existing.source_sync_status = 'error';
  }
  return Array.from(groups.values());
}

function formatLabel(formatId: string) {
  return ALL_FORMATS.find((format) => format.id === formatId.trim().toLowerCase())?.label || formatId;
}

class AdminRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function authenticatedAdminRequest(endpoint: string, path = '', init: RequestInit = {}) {
  let sessionTimer: ReturnType<typeof setTimeout> | undefined;
  const token = await Promise.race([
    getClientAdminAuthToken(),
    new Promise<never>((_, reject) => {
      sessionTimer = setTimeout(() => reject(new Error('A sessão demorou para responder. Tente novamente.')), 15_000);
    }),
  ]).finally(() => clearTimeout(sessionTimer));
  init.signal?.throwIfAborted();

  if (!token) {
    throw new AdminRequestError('Authentication required.', 401);
  }

  const response = await fetch(`${endpoint}${path}`, {
    ...init,
    signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000),
    cache: 'no-store',
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new AdminRequestError(result.error || 'Admin request failed.', response.status);
  }

  return result.data;
}

async function adminRequest(path = '', init: RequestInit = {}) {
  return authenticatedAdminRequest('/api/admin/mods', path, init);
}

async function minecraftImportRequest(init: RequestInit = {}) {
  return authenticatedAdminRequest('/api/admin/minecraft', '', init);
}

export default function AdminUploadPage() {
  const router = useRouter();
  const params = useParams(); // <-- Pega o locale atual
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "en";
  
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('manage');
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [minecraftUrl, setMinecraftUrl] = useState('');
  const [importingMinecraft, setImportingMinecraft] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const submitting = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const exportRequest = useRef<AbortController | null>(null);

  useEffect(() => () => exportRequest.current?.abort(), []);

  const exportCatalog = async () => {
    if (exportRequest.current) return;
    const controller = new AbortController();
    exportRequest.current = controller;
    setExporting(true);
    setExportCount(0);
    setMessage(null);
    try {
      const { parts, count } = await collectCatalogCsv(
        (cursor) => adminRequest(`?export=1${cursor ? `&after=${encodeURIComponent(cursor)}` : ''}`, { signal: controller.signal }),
        setExportCount,
        controller.signal,
      );
      const url = URL.createObjectURL(new Blob(parts, { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `guizzprints-catalogo-completo-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage({ type: 'success', text: `CSV completo preparado: ${count} itens. Confira os downloads do navegador.` });
    } catch (error) {
      if (!controller.signal.aborted) setMessage({ type: 'error', text: `Não foi possível concluir a exportação. Nenhum arquivo parcial foi salvo. ${error instanceof Error ? error.message : ''}` });
    } finally {
      exportRequest.current = null;
      if (!controller.signal.aborted) setExporting(false);
    }
  };

  // Estados do Catálogo e Pesquisa
  const [mods, setMods] = useState<AdminModSummary[]>([]);
  const [loadingMods, setLoadingMods] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [catalogQuery, setCatalogQuery] = useState({ category: 'all', sort: 'newest', pageSize: 20, page: 1, q: '' });
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [attentionCount, setAttentionCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const catalogRequest = useRef<AbortController | null>(null);

  const fetchMods = useCallback(async () => {
    catalogRequest.current?.abort();
    const controller = new AbortController();
    catalogRequest.current = controller;
    setLoadingMods(true);
    setCatalogError(null);

    try {
      const query = new URLSearchParams({ ...catalogQuery, attention: attentionOnly ? '1' : '0', page: String(catalogQuery.page), pageSize: String(catalogQuery.pageSize) });
      const data = await adminRequest(`?${query}`, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!data.items.length && catalogQuery.page > 1) {
        setCatalogQuery((previous) => ({ ...previous, page: previous.page - 1 }));
        return;
      }
      setMods(groupAdminMods(data.items));
      setHasMore(data.hasMore);
      setAttentionCount(Number(data.attentionCount) || 0);
      setCheckingAccess(false);
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof AdminRequestError && error.status === 401) {
        router.replace(`/${locale}/login`);
      } else if (error instanceof AdminRequestError && error.status === 403) {
        router.replace(`/${locale}`);
      } else {
        setCatalogError(error instanceof Error ? error.message : 'Erro ao carregar catálogo.');
        setCheckingAccess(false);
      }
    } finally {
      if (!controller.signal.aborted) setLoadingMods(false);
    }
  }, [attentionOnly, catalogQuery, locale, router]);

  useEffect(() => {
    if (activeTab !== 'manage') return;
    const timer = window.setTimeout(fetchMods, 0);
    return () => {
      window.clearTimeout(timer);
      catalogRequest.current?.abort();
    };
  }, [fetchMods, activeTab]);

  const handleEditInit = useCallback((modId: string) => {
    router.push(`/${locale}/admin/publisher?edit=${encodeURIComponent(modId)}`);
  }, [locale, router]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!checkingAccess && editId && !isEditing) void handleEditInit(editId);
  }, [checkingAccess, isEditing, searchParams, handleEditInit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const importMinecraftMarketplace = async () => {
    if (importingMinecraft) return;
    const sourceUrl = minecraftUrl.trim();
    if (!sourceUrl) {
      setMessage({ type: 'error', text: 'Cole primeiro o link oficial do Minecraft Marketplace.' });
      return;
    }

    setImportingMinecraft(true);
    setMessage(null);
    try {
      const metadata = await minecraftImportRequest({
        method: 'POST',
        body: JSON.stringify({ url: sourceUrl }),
      });
      const images = Array.isArray(metadata.imageUrls) ? metadata.imageUrls : [];
      setFormData((previous) => ({
        ...previous,
        title: metadata.title || previous.title,
        description: metadata.description || previous.description,
        youtube_trailer_url: metadata.youtubeTrailerUrl || previous.youtube_trailer_url,
        image_url_1: images[0] || previous.image_url_1,
        image_url_2: images[1] || previous.image_url_2,
        image_url_3: images[2] || previous.image_url_3,
        image_url_4: images[3] || previous.image_url_4,
        image_url_5: images[4] || previous.image_url_5,
        category: previous.category || metadata.categorySuggestion || previous.category,
        // A deliberate manual selection always wins over an import suggestion.
        subcategory: previous.subcategory || metadata.subcategorySuggestion || previous.subcategory,
        source_url: metadata.sourceUrl || sourceUrl,
        source_fingerprint: metadata.fingerprint || previous.source_fingerprint,
        source_creator: metadata.creator || previous.source_creator,
        source_tags: Array.isArray(metadata.tags) ? metadata.tags : previous.source_tags,
        source_published_at: metadata.publishedAt || previous.source_published_at,
        source_pack_type: metadata.packType || previous.source_pack_type,
      }));
      setMinecraftUrl(metadata.sourceUrl || sourceUrl);
      setMessage({
        type: 'success',
        text: `Dados importados: ${images.length} imagem(ns)${metadata.youtubeTrailerUrl ? ' e trailer' : ''}${metadata.creator ? ` e criador ${metadata.creator}` : ''}. Confira e informe apenas o link Terabox antes de publicar.`,
      });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível importar o Marketplace.' });
    } finally {
      setImportingMinecraft(false);
    }
  };

  const setCategory = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: '' }));
  };

  const handleDelete = async (mod: AdminModSummary) => {
    if (loading) return;
    const isPublishedPair = Boolean(mod.guide_mcstructure_url || mod.guide_schem_url);
    const confirmation = isPublishedPair
      ? `Tem certeza que deseja EXCLUIR "${mod.title}"? As edições Bedrock e Java serão removidas juntas do catálogo.`
      : `Tem certeza que deseja EXCLUIR "${mod.title}"?`;
    if (!window.confirm(confirmation)) return;
    
    setLoadingMods(true);
    setLoading(true);

    try {
      if (isPublishedPair) {
        await authenticatedAdminRequest('/api/admin/publisher/publication', `?id=${encodeURIComponent(mod.id)}`, { method: 'DELETE' });
      } else {
        await adminRequest(`?id=${encodeURIComponent(mod.id)}`, { method: 'DELETE' });
      }
      setMessage({ type: 'success', text: isPublishedPair ? 'As edições Bedrock e Java foram excluídas juntas.' : 'Mod excluído com sucesso.' });
      await fetchMods();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro ao excluir.' });
      setLoadingMods(false);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData(INITIAL_FORM);
    setMinecraftUrl('');
    setIsEditing(false);
    setActiveTab('manage');
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setMessage(null);

    // New items must go through the 3D publisher, which generates the Guide
    // 3D assets, the Guide four-view cover and the Studio board together. This screen keeps
    // the metadata editor for existing catalog entries only.
    if (!isEditing) {
      setMessage({ type: 'error', text: 'Use o Publicador 3D para criar uma nova publicação.' });
      setLoading(false);
      submitting.current = false;
      return;
    }

    if (!formData.title || !formData.category || !formData.terabox_url) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios (*)' });
      setLoading(false);
      submitting.current = false;
      return;
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory || null,
      description: formData.description,
      version: formData.version,
      file_size: formData.file_size,
      price: formData.price,
      terabox_url: formData.terabox_url,
      youtube_trailer_url: formData.youtube_trailer_url || null,
      image_url_1: formData.image_url_1 || null,
      image_url_2: formData.image_url_2 || null,
      image_url_3: formData.image_url_3 || null,
      image_url_4: formData.image_url_4 || null,
      image_url_5: formData.image_url_5 || null,
      source_url: formData.source_url || null,
      source_fingerprint: formData.source_fingerprint || null,
      source_creator: formData.source_creator || null,
      source_tags: formData.source_tags.length ? formData.source_tags : null,
      source_published_at: formData.source_published_at || null,
    };

    try {
      payload.version = validateModVersion(payload.version);
      if (isEditing && formData.id) {
        await adminRequest('', {
          method: 'PUT',
          body: JSON.stringify({ id: formData.id, ...payload }),
        });
        setMessage({ type: 'success', text: 'Mod atualizado com sucesso!' });
        setFormData(INITIAL_FORM);
        setMinecraftUrl('');
        setIsEditing(false);
        setActiveTab('manage');
      } else {
        await adminRequest('', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMessage({ type: 'success', text: 'Mod publicado com sucesso! Você já pode publicar o próximo.' });
        setFormData({ ...INITIAL_FORM, category: payload.category, subcategory: payload.subcategory || '' });
        setMinecraftUrl('');
        setIsEditing(false);
      }
      setFormKey((key) => key + 1);
    } catch (error) {
      const action = isEditing ? 'atualizar' : 'enviar';
      setMessage({ type: 'error', text: `Erro ao ${action}: ${error instanceof Error ? error.message : 'falha desconhecida'}` });
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1D2433] pb-4 gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="p-2 bg-[#111318] border border-[#1D2433] rounded-xl text-zinc-400 hover:text-white transition">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <Settings className="text-blue-500" size={24} /> Admin Dashboard
              </h1>
              <p className="text-sm text-zinc-400">Gerenciamento do catálogo. Novas publicações usam somente o Publicador 3D.</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link href={`/${locale}/admin/publisher`} className="flex items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-500/20">
              <Upload size={16} /> Publicador 3D
            </Link>
          <div className="flex bg-[#111318] border border-[#1D2433] rounded-xl p-1 w-full sm:w-auto">
            <button disabled={loading}
              onClick={() => { setActiveTab('manage'); setIsEditing(false); setFormData(INITIAL_FORM); setMinecraftUrl(''); setMessage(null); }}
              className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Database size={16} /> Catálogo
            </button>
          </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border font-bold text-sm text-center ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* ABA: GERENCIAR (LISTA + FILTRO) */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="min-w-0">
                <h2 className="font-bold text-sm">Baixar catálogo completo</h2>
                <p className="mt-1 text-xs text-zinc-400">Todos os itens, de todas as categorias, independentemente dos filtros. CSV com título, categoria, subcategoria, versão e data de publicação.</p>
              </div>
              <button type="button" onClick={() => void exportCatalog()} disabled={exporting} className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold hover:bg-blue-500 disabled:opacity-60 disabled:cursor-wait" aria-live="polite">
                {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {exporting ? `Preparando… ${exportCount} itens` : 'Exportar todos (CSV)'}
              </button>
            </div>
            
            <div className="rounded-2xl border border-[#1D2433] bg-[#111318] p-4 space-y-4">
              <form onSubmit={(event) => { event.preventDefault(); setCatalogQuery((previous) => ({ ...previous, page: 1, q: searchTerm.trim() })); }} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input type="search" aria-label="Pesquisar título no catálogo" maxLength={100} disabled={loading} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Pesquisar título em todo o catálogo..." className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 outline-none text-white" />
                </div>
                <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-500 disabled:opacity-50">Buscar</button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="space-y-1 text-xs text-zinc-400">Categoria ou subcategoria
                  <select aria-label="Categoria do catálogo" disabled={loading} value={catalogQuery.category} onChange={(event) => setCatalogQuery((previous) => ({ ...previous, category: event.target.value, page: 1 }))} className="block w-full bg-[#07090D] border border-[#1D2433] rounded-xl p-3 text-sm text-white">
                    <option value="all">Todas as categorias</option>
                    {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-zinc-400">Ordenar por
                  <select aria-label="Ordenar catálogo" disabled={loading} value={catalogQuery.sort} onChange={(event) => setCatalogQuery((previous) => ({ ...previous, sort: event.target.value, page: 1 }))} className="block w-full bg-[#07090D] border border-[#1D2433] rounded-xl p-3 text-sm text-white">
                    <option value="newest">Mais recentes</option><option value="oldest">Mais antigos</option><option value="title">Título (A–Z)</option><option value="downloads">Mais baixados</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-zinc-400">Itens por página
                  <select aria-label="Itens por página" disabled={loading} value={catalogQuery.pageSize} onChange={(event) => setCatalogQuery((previous) => ({ ...previous, pageSize: Number(event.target.value), page: 1 }))} className="block w-full bg-[#07090D] border border-[#1D2433] rounded-xl p-3 text-sm text-white">
                    <option value={10}>10 itens</option><option value={20}>20 itens</option><option value={50}>50 itens</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                <p>Exibindo até {catalogQuery.pageSize} itens por página.{catalogQuery.q && <> Busca: “{catalogQuery.q}”.</>}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" disabled={loading} onClick={() => { setAttentionOnly((value) => !value); setCatalogQuery((previous) => ({ ...previous, page: 1 })); }} className={`inline-flex items-center gap-1.5 font-bold transition ${attentionOnly ? 'text-amber-300' : 'text-zinc-400 hover:text-amber-300'}`} aria-pressed={attentionOnly}>
                    <AlertTriangle size={14} /> {attentionOnly ? 'Mostrar catálogo completo' : 'Ver atenção manual'}
                  </button>
                  <button type="button" disabled={loading} onClick={() => { setSearchTerm(''); setAttentionOnly(false); setCatalogQuery({ category: 'all', sort: 'newest', pageSize: 20, page: 1, q: '' }); }} className="text-blue-400 hover:text-blue-300">Limpar filtros</button>
                </div>
              </div>
            </div>

            {attentionCount > 0 && (
              <div role="alert" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={18} />
                  <div>
                    <p className="text-sm font-bold">{attentionCount} item(ns) precisam de atenção manual</p>
                    <p className="mt-1 text-xs text-amber-100/70">A origem do Marketplace não respondeu. O conteúdo atual continua publicado até você revisar o link.</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setAttentionOnly(true); setCatalogQuery((previous) => ({ ...previous, page: 1 })); }} className="shrink-0 rounded-xl border border-amber-400/40 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-amber-400/10">Ver itens</button>
              </div>
            )}

            <div className="bg-[#111318] border border-[#1D2433] rounded-2xl overflow-hidden shadow-xl">
              {catalogError ? (
                <div role="alert" className="p-6 text-center space-y-3">
                  <p className="text-sm text-red-400">{catalogError}</p>
                  <button onClick={() => void fetchMods()} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold">Tentar novamente</button>
                </div>
              ) : loadingMods ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
              ) : mods.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 font-bold uppercase tracking-wider text-sm">
                  Nenhum mod encontrado correspondente à pesquisa.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0A0D14] text-xs uppercase text-zinc-500 border-b border-[#1D2433]">
                        <th className="p-4 font-black">Título do Mod</th>
                        <th className="p-4 font-black text-center hidden md:table-cell">Categoria</th>
                        <th className="p-4 font-black hidden md:table-cell">Versão</th>
                        <th className="p-4 font-black hidden md:table-cell">Tamanho</th>
                        <th className="p-4 font-black text-center hidden lg:table-cell">Métricas</th>
                        <th className="p-4 font-black text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mods.map(mod => (
                        <tr key={mod.id} className="border-b border-[#1D2433]/50 hover:bg-[#07090D] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-sm text-zinc-200 break-words [overflow-wrap:anywhere]">{mod.title}</p>
                            {mod.source_sync_status === 'error' && <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300"><AlertTriangle size={12} /> Atenção manual</span>}
                            <div className="md:hidden mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
                              <span>{(mod.categories || [mod.category]).map((category) => CATEGORIES.find((entry) => entry.id === category)?.label || category).join(' + ')}</span>
                              {!!mod.subcategories?.length && <span className="text-blue-300 break-words [overflow-wrap:anywhere]">Formatos: {mod.subcategories.map(formatLabel).join(' + ')}</span>}
                              <span className="break-all">Versão: {mod.version ? `# v${normalizeModVersion(mod.version)}` : 'Não informada'}</span>
                              <span>Tamanho: {mod.file_size || 'Não informado'}</span>
                            </div>
                            <p className="text-xs text-zinc-600 hidden sm:block">{new Date(mod.created_at).toLocaleDateString()}</p>
                            {mod.source_creator && <p className="mt-1 text-[10px] text-emerald-300/80">Marketplace: {mod.source_creator}</p>}
                          </td>
                          <td className="p-4 text-center hidden md:table-cell">
                            <div className="flex flex-wrap justify-center gap-1">
                              {(mod.categories || [mod.category]).map((category) => (
                                <span key={category} className="text-[10px] uppercase tracking-wider font-black px-2 py-1 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">{category}</span>
                              ))}
                            </div>
                            {!!mod.subcategories?.length && <p className="mt-2 text-xs text-blue-300 break-words [overflow-wrap:anywhere]">Formatos: {mod.subcategories.map(formatLabel).join(' + ')}</p>}
                          </td>
                          <td className="p-4 hidden md:table-cell text-xs text-blue-300 break-all">{mod.version ? `# v${normalizeModVersion(mod.version)}` : 'Não informada'}</td>
                          <td className="p-4 hidden md:table-cell text-xs text-zinc-300">{mod.file_size || 'Não informado'}</td>
                          <td className="p-4 text-center hidden lg:table-cell text-xs text-zinc-400">
                            {mod.downloads} DLs • {mod.rating || 0}★
                            {mod.source_sync_status === 'error' && <p className="mt-2 text-[10px] font-bold text-amber-300">Origem indisponível</p>}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button disabled={loading} onClick={() => handleEditInit(mod.id)} className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-2 text-blue-300 transition-colors hover:bg-blue-500/20 disabled:opacity-40" title="Editar publicação" aria-label={`Editar publicação ${mod.title}`}>
                                <Edit3 size={16} />
                                <span className="hidden xl:inline text-xs font-bold">Editar</span>
                              </button>
                              <button disabled={loading} onClick={() => handleDelete(mod)} className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-40" title="Excluir publicação" aria-label={`Excluir publicação ${mod.title}`}>
                                <Trash2 size={16} />
                                <span className="hidden xl:inline text-xs font-bold">Excluir</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm" aria-live="polite">
              <p className="text-zinc-400">Página {catalogQuery.page}{!loadingMods && !catalogError && <> · {mods.length} itens exibidos</>}</p>
              <div className="flex gap-2">
                <button disabled={loading || loadingMods || !!catalogError || catalogQuery.page === 1} onClick={() => setCatalogQuery((previous) => ({ ...previous, page: previous.page - 1 }))} className="rounded-xl border border-[#1D2433] px-4 py-2 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed">Anterior</button>
                <button disabled={loading || loadingMods || !!catalogError || !hasMore} onClick={() => setCatalogQuery((previous) => ({ ...previous, page: previous.page + 1 }))} className="rounded-xl border border-[#1D2433] px-4 py-2 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed">Próxima</button>
              </div>
            </div>
          </div>
        )}

        {/* ABA: FORMULÁRIO */}
        {activeTab === 'upload' && (
          <form key={formKey} onSubmit={handleSubmit} aria-busy={loading} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111318] border border-[#1D2433] rounded-2xl p-6 shadow-xl animate-in fade-in duration-300">
            <fieldset disabled={loading} className="contents">

            <div className="md:col-span-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-3">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wide text-emerald-300">Importar do Minecraft Marketplace</h2>
                  <p className="mt-1 text-xs text-zinc-400">Cole o link oficial de um item. O título, descrição, imagens e trailer são preenchidos automaticamente; o link Terabox continua sendo informado por você.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={minecraftUrl}
                    onChange={(event) => setMinecraftUrl(event.target.value)}
                    placeholder="https://www.minecraft.net/en-us/marketplace/pdp/..."
                    aria-label="Link do Minecraft Marketplace"
                    className="min-w-0 flex-1 bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-emerald-400 outline-none transition text-white"
                  />
                  <button type="button" onClick={() => void importMinecraftMarketplace()} disabled={importingMinecraft || !minecraftUrl.trim()} className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-wait">
                    {importingMinecraft ? <><Loader2 size={16} className="inline animate-spin mr-2" /> Buscando…</> : <><Link2 size={16} className="inline mr-2" /> Buscar dados</>}
                  </button>
                </div>
                {formData.source_url && (
                  <div className="space-y-2 text-xs text-emerald-300/80" role="status">
                    <p>Sincronização diária ativada para este item após a publicação.</p>
                    {(formData.source_creator || formData.source_pack_type || formData.source_tags.length || formData.source_published_at) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-emerald-500/15 bg-black/10 px-3 py-2 text-emerald-100/80">
                        {formData.source_creator && <span><strong className="text-emerald-200">Criador:</strong> {formData.source_creator}</span>}
                        {formData.source_pack_type && <span><strong className="text-emerald-200">Tipo:</strong> {formData.source_pack_type}</span>}
                        {formData.source_published_at && <span><strong className="text-emerald-200">Publicado:</strong> {new Date(formData.source_published_at).toLocaleDateString()}</span>}
                        {formData.source_tags.length > 0 && <span className="basis-full"><strong className="text-emerald-200">Tags:</strong> {formData.source_tags.join(', ')}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2">
                <Layers size={14}/> Categoria *
              </label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-4 px-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)] scale-[1.02]' 
                          : 'bg-[#07090D] border-[#1D2433] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <cat.icon size={18} className={isSelected ? 'text-blue-500' : 'text-zinc-500'} />
                      <span className="text-sm font-bold uppercase tracking-wider">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><FileText size={14}/> Título do Mod *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Actions & Stuff 1.11" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Tag size={14}/> Formato do arquivo *</label>
              <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white">
                <option value="">Selecione o formato</option>
                {(FORMAT_OPTIONS[formData.category as keyof typeof FORMAT_OPTIONS] || []).map((format) => (
                  <option key={format.id} value={format.id}>{format.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Link2 size={14}/> Link direto do arquivo *</label>
              <input type="url" name="terabox_url" value={formData.terabox_url} onChange={handleChange} placeholder="https://arquivos.exemplo.com/construcao.mcstructure" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2">Tamanho do Arquivo</label>
              <input type="text" name="file_size" value={formData.file_size} onChange={handleChange} placeholder="Ex: 63.14 MB" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
            </div>

            <div className="space-y-2">
              <label htmlFor="mod-version" className="text-xs font-black uppercase text-zinc-400">Versão *</label>
              <div className="flex items-center rounded-xl border border-[#1D2433] bg-[#07090D] focus-within:border-blue-500">
                <span className="pl-4 text-sm font-bold text-blue-400 whitespace-nowrap" aria-hidden="true"># v</span>
                <input id="mod-version" type="text" name="version" required maxLength={50} pattern="[A-Za-z0-9][A-Za-z0-9.\x2b\x2d]*" value={formData.version} onChange={handleChange} placeholder="1.0.8" aria-describedby="version-help" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none text-white" />
              </div>
              <p id="version-help" className="text-xs text-zinc-500">Prefixo fixo # v. Ex.: 1.0.8 ou 1.0.8-beta.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2"><Video size={14}/> URL Trailer YouTube</label>
              <input type="url" name="youtube_trailer_url" value={formData.youtube_trailer_url} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition text-white" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-zinc-400 flex items-center gap-2">Descrição Completa</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Descreva os recursos do mod..." className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition resize-none text-white" />
            </div>

            <div className="md:col-span-2 border-t border-[#1D2433] pt-4 mt-2">
              <h3 className="text-xs font-black uppercase text-blue-500 tracking-wider mb-4">Galeria de Imagens (URLs Externas)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="url" name="image_url_1" value={formData.image_url_1} onChange={handleChange} placeholder="URL da Imagem Principal (Thumb)" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                <input type="url" name="image_url_2" value={formData.image_url_2} onChange={handleChange} placeholder="URL da Imagem 2" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                <input type="url" name="image_url_3" value={formData.image_url_3} onChange={handleChange} placeholder="URL da Imagem 3" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                <input type="url" name="image_url_4" value={formData.image_url_4} onChange={handleChange} placeholder="URL da Imagem 4" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
                <input type="url" name="image_url_5" value={formData.image_url_5} onChange={handleChange} placeholder="URL da Imagem 5 (opcional)" className="w-full bg-[#07090D] border border-[#1D2433] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition text-white" />
              </div>
            </div>

            <div className="md:col-span-2 pt-4 flex gap-4">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition border border-zinc-700 cursor-pointer">
                  Cancelar Edição
                </button>
              )}
              <button type="submit" disabled={loading} className={`flex-[2] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 border border-emerald-500' : 'bg-blue-600 hover:bg-blue-700 border border-blue-500 disabled:bg-blue-800'}`}>
                {loading ? <><Loader2 className="animate-spin" size={18} /> Processando...</> : isEditing ? <><Save size={18} /> Salvar Alterações</> : <><Upload size={18} /> Publicar Mod</>}
              </button>
            </div>

            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
}
