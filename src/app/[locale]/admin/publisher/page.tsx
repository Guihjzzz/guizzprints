'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, FileText, Gamepad2, ImageIcon, Layers3, Loader2, LockKeyhole, Palette, Ruler, Upload } from 'lucide-react';
import { getClientAdminAuthToken } from '@/lib/client-auth';
import { PUBLISHER_CHUNK_BYTES } from '@/lib/publisher-assets';
import { contentCategoryLabel } from '@/lib/mod-categories';

const FORMAT_GROUPS = {
  Bedrock: [
    ['holoprint', 'Holoprint'], ['mcstructure', '.mcstructure'], ['mcaddon', '.mcaddon'], ['mcworld', '.mcworld'],
  ],
  Java: [
    ['litematic', '.litematic'], ['schem', '.schem'], ['schematic', '.schematic'], ['world', 'World'], ['mcfunction', '.mcfunction'],
  ],
} as const;

const ALL_FORMATS = Object.values(FORMAT_GROUPS).flat();
const DOWNLOAD_FILE_ACCEPT: Record<string, string> = {
  holoprint: '.mcstructure,application/octet-stream',
  mcstructure: '.mcstructure,application/octet-stream',
  mcaddon: '.mcaddon,application/octet-stream',
  mcworld: '.mcworld,application/octet-stream',
  litematic: '.litematic,application/octet-stream',
  schem: '.schem,application/octet-stream',
  schematic: '.schematic,application/octet-stream',
  world: '.zip,.mcworld,application/zip,application/octet-stream',
  mcfunction: '.mcfunction,text/plain,application/octet-stream',
};

const CONTENT_THEMES = ['Ancestral', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Outro'] as const;
const CONTENT_SIZES = ['Pequeno', 'Médio', 'Grande', 'Enorme'] as const;
const CONTENT_CATEGORIES = [
  'Arenas', 'Castelos', 'Masmorras', 'Jogos', 'Casas e lojas', 'Variado',
  'Pedra vermelha', 'Templos', 'Torres', 'Cidades', 'Ilhas Flutuantes',
  'Jardins', 'Ilhas', 'Arte em pixel', 'Estátuas e esculturas', 'Barcos',
  'Máquinas Voadoras', 'Veículos terrestres',
] as const;

type PublisherForm = {
  title: string;
  description: string;
  version: string;
  file_size: string;
  content_themes: string[];
  content_size: string;
  content_categories: string[];
};
type Generation = {
  source?: File;
  schem?: Blob;
  cover?: Blob;
  views: Blob[];
  board?: Blob;
};
type PublishedItems = { bedrockId: string; javaId: string };
type PublishedLink = { id?: unknown; url?: unknown };
type PublishedEdition = {
  id: string;
  title: string;
  description: string;
  version: string;
  file_size: string;
  download_formats?: PublishedLink[] | null;
  content_themes?: unknown;
  content_size?: unknown;
  content_categories?: unknown;
};
type EditingPair = { bedrockId: string; javaId: string };
const initialGeneration: Generation = { views: [] };
type PublisherMessage = {
  type?: string;
  message?: string;
  name?: string;
  buffer?: ArrayBuffer;
  blocks?: number;
  steps?: number;
  index?: number;
  mime?: string;
};

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'construcao-guizz';
}

function selectedMetadata(value: unknown, allowed: readonly string[]) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string' && allowed.includes(entry));
}

function linksFromEdition(value: PublishedLink[] | null | undefined) {
  const output: Record<string, string> = {};
  for (const entry of value || []) {
    if (typeof entry?.id !== 'string' || typeof entry?.url !== 'string') continue;
    output[entry.id] = entry.url;
  }
  return output;
}

async function readApiResult<T>(response: Response, fallback: string): Promise<T> {
  const raw = await response.text();
  let result: { error?: unknown } | T | null = null;
  if (raw) {
    try {
      result = JSON.parse(raw) as { error?: unknown } | T;
    } catch {
      throw new Error(`${fallback} (resposta inválida do servidor: ${response.status}).`);
    }
  }
  if (!response.ok) {
    const error = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string' ? result.error : fallback;
    throw new Error(error);
  }
  if (!result) throw new Error(`${fallback} (o servidor não retornou dados).`);
  return result as T;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number, timeoutMessage: string) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) throw new Error(timeoutMessage);
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

export default function PublisherPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'pt';
  const editId = searchParams.get('edit')?.trim() || '';
  const studioRef = useRef<HTMLIFrameElement>(null);
  const guideRef = useRef<HTMLIFrameElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const downloadUploadRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const deliveredSourceRef = useRef<File | null>(null);
  const studioGenerationSourceRef = useRef<File | null>(null);
  const guideWarmupSourceRef = useRef<File | null>(null);
  const guideGenerationSourceRef = useRef<File | null>(null);
  const studioRestartAttemptsRef = useRef(0);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [publishingConfigured, setPublishingConfigured] = useState<boolean | null>(null);
  const [studioReady, setStudioReady] = useState(false);
  const [guideReady, setGuideReady] = useState(false);
  const [studioLoaded, setStudioLoaded] = useState(false);
  const [guideLoaded, setGuideLoaded] = useState(false);
  const [guideWarmed, setGuideWarmed] = useState(false);
  const [studioGenerated, setStudioGenerated] = useState(false);
  const [generation, setGeneration] = useState<Generation>(initialGeneration);
  const [status, setStatus] = useState('Aguardando um arquivo .mcstructure.');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingDownload, setUploadingDownload] = useState<string | null>(null);
  const [publishedItems, setPublishedItems] = useState<PublishedItems | null>(null);
  const [editingPair, setEditingPair] = useState<EditingPair | null>(null);
  const [form, setForm] = useState<PublisherForm>({
    title: '',
    description: '',
    version: '1.21.0',
    file_size: '',
    content_themes: [],
    content_size: '',
    content_categories: [],
  });
  const [links, setLinks] = useState<Record<string, string>>(() => Object.fromEntries(ALL_FORMATS.map(([id]) => [id, ''])));
  const generationProgressRef = useRef({ studio: false, guide: false });

  const isEditing = Boolean(editingPair);
  const isEditRoute = Boolean(editId);

  const fileReady = Boolean(generation.source && generation.schem && generation.cover && generation.views.filter(Boolean).length === 8 && generation.board);
  const slug = useMemo(() => slugify(form.title || generation.source?.name || ''), [form.title, generation.source?.name]);
  const toggleMetadata = (field: 'content_themes' | 'content_categories', value: string, max = Number.POSITIVE_INFINITY) => {
    setForm((current) => {
      const selected = current[field];
      if (selected.includes(value)) return { ...current, [field]: selected.filter((entry) => entry !== value) };
      if (selected.length >= max) return current;
      return { ...current, [field]: [...selected, value] };
    });
  };
  const generatedChecks = [
    { label: '.schem · Guia 3D', ready: Boolean(generation.schem) },
    { label: 'Capa 4 vistas · Guia 3D', ready: Boolean(generation.cover) },
    { label: '8 vistas · Guia 3D', ready: generation.views.filter(Boolean).length === 8 },
    { label: 'Prancha · Guizz Studio', ready: Boolean(generation.board) },
  ];

  const getAccessToken = useCallback(async () => {
    const token = await getClientAdminAuthToken();
    if (!token) throw new Error('Faça login com a conta administradora.');
    return token;
  }, []);

  useEffect(() => {
    let active = true;
    const verifyAdmin = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch('/api/admin/status', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        if (!response.ok) throw new Error('not-admin');
        const access = await readApiResult<{ publishingConfigured?: boolean; catalogConfigured?: boolean; githubStorageConfigured?: boolean }>(response, 'Não foi possível verificar o acesso administrativo');
        if (active) {
          setPublishingConfigured(access.publishingConfigured === true);
          if (access.publishingConfigured !== true) {
            const missing = [
              access.catalogConfigured === false ? 'catálogo Supabase' : '',
              access.githubStorageConfigured === false ? 'armazenamento GitHub Releases (GITHUB_RELEASES_TOKEN)' : '',
            ].filter(Boolean).join(' e ');
            setError(`A publicação ainda não está configurada: adicione ${missing || 'as credenciais do servidor'} ao .env.local e reinicie o site.`);
          }
          setCheckingAccess(false);
        }
      } catch {
        router.replace(`/${locale}`);
      }
    };
    void verifyAdmin();
    return () => { active = false; };
  }, [getAccessToken, locale, router]);

  useEffect(() => {
    if (checkingAccess || !editId) return;
    let active = true;

    const loadPublication = async () => {
      setError(null);
      setStatus('Carregando as edições Bedrock e Java para edição conjunta…');
      try {
        const token = await getAccessToken();
        const response = await fetch(`/api/admin/publisher/publication?id=${encodeURIComponent(editId)}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const result = await readApiResult<{ data: { bedrock: PublishedEdition; java: PublishedEdition } }>(response, 'Não foi possível carregar a publicação');
        if (!active) return;
        const { bedrock, java } = result.data;
        setEditingPair({ bedrockId: bedrock.id, javaId: java.id });
        setForm({
          title: bedrock.title,
          description: bedrock.description,
          version: bedrock.version || '1.21.0',
          file_size: bedrock.file_size || '',
          content_themes: selectedMetadata(bedrock.content_themes, CONTENT_THEMES),
          content_size: typeof bedrock.content_size === 'string' && CONTENT_SIZES.includes(bedrock.content_size as typeof CONTENT_SIZES[number]) ? bedrock.content_size : '',
          content_categories: selectedMetadata(bedrock.content_categories, CONTENT_CATEGORIES),
        });
        setLinks((current) => ({
          ...current,
          ...linksFromEdition(bedrock.download_formats),
          ...linksFromEdition(java.download_formats),
        }));
        setStatus('Editando uma publicação única: Bedrock e Java continuarão separados no catálogo público.');
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar a publicação.');
      }
    };

    void loadPublication();
    return () => { active = false; };
  }, [checkingAccess, editId, getAccessToken]);

  useEffect(() => {
    const finishGeneration = (generator: 'studio' | 'guide') => {
      generationProgressRef.current[generator] = true;
      if (generationProgressRef.current.studio && generationProgressRef.current.guide) {
        setIsGenerating(false);
        setStatus('Capa e oito vistas do Guia 3D, mais a prancha do Guizz Studio, estão prontas.');
      }
    };

    const listener = (event: MessageEvent) => {
      const fromStudio = event.origin === window.location.origin && event.source === studioRef.current?.contentWindow;
      const fromGuide = event.origin === window.location.origin && event.source === guideRef.current?.contentWindow;
      if (!fromStudio && !fromGuide) return;

      const envelope = event.data as { guizzPublisher?: number } & PublisherMessage;
      if (!envelope?.guizzPublisher) return;
      const data = envelope as PublisherMessage;

      if (data.type === 'status' && data.message) setStatus(data.message);
      if (data.type === 'error') {
        setError(data.message || 'Um dos visualizadores retornou um erro.');
        setIsGenerating(false);
        return;
      }

      if (fromStudio) {
        if (data.type === 'ready') { setStudioReady(true); setStatus('Guizz Studio pronto para gerar a prancha.'); }
        if (data.type === 'loaded') { setStudioLoaded(true); setStatus('Construção carregada no Guizz Studio.'); }
        if (data.type === 'board' && data.buffer) {
          setGeneration((current) => ({ ...current, board: new Blob([data.buffer!], { type: data.mime || 'image/png' }) }));
        }
        if (data.type === 'generated') { setStudioGenerated(true); finishGeneration('studio'); }
        return;
      }

      if (data.type === 'ready') { setGuideReady(true); setStatus('Guia 3D pronto para converter e gerar as oito vistas.'); }
      if (data.type === 'converted' && data.buffer) {
        setGeneration((current) => ({ ...current, schem: new Blob([data.buffer!], { type: data.mime || 'application/octet-stream' }) }));
        // Convert once with the original engine, then hand the exact generated
        // .schem to Studio for its board. Running two hidden original
        // converters at once was slow and could leave the publication waiting.
        const studioBuffer = data.buffer.slice(0);
        studioRef.current?.contentWindow?.postMessage({
          guizzPublisher: 1,
          type: 'load',
          name: data.name || 'construcao.schem',
          title: data.name || 'Construção Guizzprints',
          buffer: studioBuffer,
        }, window.location.origin, [studioBuffer]);
        setStatus('Conversor nativo do Guia 3D concluiu o .schem para Java.');
      }
      if (data.type === 'cover' && data.buffer) {
        setGeneration((current) => ({ ...current, cover: new Blob([data.buffer!], { type: data.mime || 'image/png' }) }));
      }
      if (data.type === 'loaded') { setGuideLoaded(true); setStatus('Construção carregada no Guia 3D.'); }
      if (data.type === 'warmed') { setGuideWarmed(true); setStatus('Guia 3D terminou de renderizar o holograma e aguarda as capturas.'); }
      if (data.type === 'view' && data.buffer && Number.isInteger(data.index) && data.index! >= 0 && data.index! < 8) {
        setGeneration((current) => {
          const views = [...current.views];
          views[data.index!] = new Blob([data.buffer!], { type: data.mime || 'image/png' });
          return { ...current, views };
        });
      }
      if (data.type === 'generated') finishGeneration('guide');
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  // The Studio is invisible, so recover its worker automatically if a cached
  // wrapper did not initialize. This also upgrades an already-open publisher
  // after a local code refresh without losing the form or selected file.
  useEffect(() => {
    if (isEditRoute || studioReady) {
      studioRestartAttemptsRef.current = 0;
      return;
    }
    const timeout = window.setTimeout(() => {
      if (studioRestartAttemptsRef.current >= 2 || !studioRef.current) return;
      studioRestartAttemptsRef.current += 1;
      setStatus('Iniciando o Guizz Studio em segundo plano…');
      studioRef.current.src = `/guide3d/studio-publisher.html?session=${Date.now()}`;
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [isEditRoute, studioReady]);

  // Never leave a selected source behind an invisible iframe that failed to
  // boot. The exact missing engine is named so the administrator can retry
  // after the local helper restarts.
  useEffect(() => {
    const source = generation.source;
    if (!source || (studioReady && guideReady)) return;
    const timeout = window.setTimeout(() => {
      const waitingFor = [
        !guideReady ? 'Guia 3D' : '',
        !studioReady ? 'Guizz Studio original' : '',
      ].filter(Boolean).join(' e ');
      setIsGenerating(false);
      setError(`${waitingFor} não iniciou. O arquivo não foi enviado; reinicie o site local e selecione-o novamente.`);
      setStatus('A geração não foi iniciada porque um dos motores não respondeu.');
    }, 20_000);
    return () => window.clearTimeout(timeout);
  }, [generation.source, guideReady, studioReady]);

  const selectSource = (file: File | undefined) => {
    if (!file) return;
    if (!/\.mcstructure$/i.test(file.name)) { setError('O publicador aceita somente arquivos .mcstructure.'); return; }
    if (file.size > 100 * 1024 * 1024) { setError('O arquivo precisa ter no máximo 100 MB.'); return; }
    deliveredSourceRef.current = null;
    studioGenerationSourceRef.current = null;
    guideWarmupSourceRef.current = null;
    guideGenerationSourceRef.current = null;
    generationProgressRef.current = { studio: false, guide: false };
    setError(null); setPublishedItems(null); setIsGenerating(false); setStudioLoaded(false); setGuideLoaded(false); setGuideWarmed(false); setStudioGenerated(false); setGeneration({ source: file, views: [] });
    setStatus('Preparando o arquivo para geração automática…');
  };

  // The selected structure goes first to the Guide's untouched original
  // converter. Its resulting .schem is forwarded to Studio for the board,
  // avoiding duplicate conversion work and a second hidden iframe.
  useEffect(() => {
    const source = generation.source;
    if (!source || !studioReady || !guideReady || deliveredSourceRef.current === source) return;
    deliveredSourceRef.current = source;
    let cancelled = false;

    const deliver = async () => {
      try {
        setStudioLoaded(false);
        setGuideLoaded(false);
        setStatus('Enviando o .mcstructure para os geradores…');
        const buffer = await source.arrayBuffer();
        if (cancelled || deliveredSourceRef.current !== source) return;
        const guideBuffer = buffer.slice(0);
        guideRef.current?.contentWindow?.postMessage({ guizzPublisher: 1, type: 'load', name: source.name, title: form.title || source.name, buffer: guideBuffer }, window.location.origin, [guideBuffer]);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Não foi possível ler o arquivo .mcstructure.');
      }
    };
    void deliver();
    return () => { cancelled = true; };
  }, [generation.source, guideReady, studioReady, form.title]);

  // Start Studio's board generation as soon as it receives the construction.
  // In parallel, the Guide converts, warms the hologram, then creates the
  // public four-view cover and its eight gallery views.
  useEffect(() => {
    const source = generation.source;
    if (!source || !studioReady || !studioLoaded || studioGenerationSourceRef.current === source) return;
    studioGenerationSourceRef.current = source;
    setError(null);
    setIsGenerating(true);
    setStatus('Guizz Studio criando a prancha; o Guia 3D prepara a capa e o holograma em paralelo…');
    generationProgressRef.current = { studio: false, guide: false };
    studioRef.current?.contentWindow?.postMessage({ guizzPublisher: 1, type: 'generateStudio', title: form.title || 'Construção Guizzprints' }, window.location.origin);
  }, [generation.source, studioLoaded, studioReady, form.title]);

  useEffect(() => {
    const source = generation.source;
    if (!source || !guideReady || !guideLoaded || guideWarmupSourceRef.current === source) return;
    guideWarmupSourceRef.current = source;
    setStatus('Guia 3D renderizando e estabilizando o holograma enquanto o Guizz Studio gera a prancha…');
    guideRef.current?.contentWindow?.postMessage({ guizzPublisher: 1, type: 'warmup' }, window.location.origin);
  }, [generation.source, guideLoaded, guideReady]);

  useEffect(() => {
    const source = generation.source;
    if (!source || !guideWarmed || !guideReady || !guideLoaded || guideGenerationSourceRef.current === source) return;
    guideGenerationSourceRef.current = source;
    setStatus(studioGenerated
      ? 'Guia 3D estabilizado. Gerando as oito vistas em PNG…'
      : 'Guia 3D estabilizado. Gerando a capa de quatro vistas e as oito imagens…');
    guideRef.current?.contentWindow?.postMessage({ guizzPublisher: 1, type: 'generate', title: form.title || 'Construção Guizzprints' }, window.location.origin);
  }, [generation.source, guideLoaded, guideReady, guideWarmed, studioGenerated, form.title]);

  const uploadPublisherFile = async (kind: string, file: Blob, fileName: string, token: string, format = '', timeoutMessage = 'O envio do arquivo demorou demais. Tente novamente.') => {
    const contentType = file.type || 'application/octet-stream';
    if (file.size <= PUBLISHER_CHUNK_BYTES) {
      const body = new FormData();
      body.set('kind', kind); body.set('format', format); body.set('slug', slug);
      body.set('file', new File([file], fileName, { type: contentType }));
      const response = await fetchWithTimeout('/api/admin/publisher/assets', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body }, 180_000, timeoutMessage);
      const result = await readApiResult<{ data: { url: string } }>(response, 'Falha ao enviar o arquivo');
      return result.data.url as string;
    }

    const uploadId = crypto.randomUUID();
    const totalBytes = file.size;
    const totalChunks = Math.ceil(totalBytes / PUBLISHER_CHUNK_BYTES);
    for (let index = 0; index < totalChunks; index += 1) {
      const chunk = file.slice(index * PUBLISHER_CHUNK_BYTES, Math.min(totalBytes, (index + 1) * PUBLISHER_CHUNK_BYTES), contentType);
      const body = new FormData();
      body.set('uploadId', uploadId); body.set('index', String(index)); body.set('totalChunks', String(totalChunks)); body.set('totalBytes', String(totalBytes));
      body.set('chunk', new File([chunk], `${fileName}.part`, { type: contentType }));
      const response = await fetchWithTimeout('/api/admin/publisher/assets/chunk', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body }, 180_000, timeoutMessage);
      await readApiResult<{ data: { uploadId: string; index: number } }>(response, 'Falha ao enviar uma parte do arquivo');
      setStatus(`Enviando ${fileName}: ${index + 1}/${totalChunks} partes…`);
    }
    const response = await fetchWithTimeout('/api/admin/publisher/assets/complete', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, format, slug, uploadId, fileName, contentType, totalChunks, totalBytes }),
    }, 180_000, timeoutMessage);
    const result = await readApiResult<{ data: { url: string } }>(response, 'Falha ao finalizar o envio do arquivo');
    return result.data.url as string;
  };

  const uploadAsset = async (kind: string, file: Blob, fileName: string, token: string) => uploadPublisherFile(kind, file, fileName, token, '', 'O envio de um arquivo gerado demorou demais. Tente publicar novamente.');

  const uploadDownloadFile = async (formatId: string, file: File | undefined) => {
    if (!file || uploadingDownload) return;
    setUploadingDownload(formatId);
    setError(null);
    try {
      const token = await getAccessToken();
      const url = await uploadPublisherFile('download', file, file.name, token, formatId, 'O envio do arquivo demorou demais. Tente novamente.');
      setLinks((current) => ({ ...current, [formatId]: url }));
      const label = ALL_FORMATS.find(([id]) => id === formatId)?.[1] || formatId;
      setStatus(`${label} enviado para o armazenamento do catálogo. O link foi preenchido automaticamente.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Não foi possível enviar este arquivo de download.');
    } finally {
      setUploadingDownload(null);
    }
  };

  const publish = async () => {
    if (editingPair) {
      if (!form.title.trim() || !form.description.trim()) { setError('Informe o título e a descrição detalhada.'); return; }
      setIsPublishing(true); setError(null); setStatus('Salvando Bedrock e Java juntos no editor…');
      try {
        const token = await getAccessToken();
        const downloadLinks = ALL_FORMATS.map(([id]) => ({ id, url: links[id].trim() })).filter((link) => Boolean(link.url));
        const response = await fetchWithTimeout('/api/admin/publisher/publication', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, ...editingPair, download_links: downloadLinks }),
        }, 60_000, 'O salvamento demorou demais. Tente novamente.');
        const result = await readApiResult<{ data: PublishedItems }>(response, 'Não foi possível salvar as duas edições');
        setPublishedItems(result.data);
        setStatus('Bedrock e Java foram atualizados juntos. O catálogo público continua separado por categoria.');
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : 'Não foi possível salvar as duas edições.');
      } finally {
        setIsPublishing(false);
      }
      return;
    }
    if (publishingConfigured === false) { setError('A publicação ainda não está configurada. Configure o catálogo Supabase e o GitHub Releases antes de publicar.'); return; }
    if (!form.title.trim() || !form.description.trim()) { setError('Informe o título e a descrição detalhada.'); return; }
    if (!fileReady || !generation.source || !generation.schem || !generation.cover || !generation.board) { setError('Gere a capa, as oito vistas e a prancha do Guizz Studio antes de publicar.'); return; }
    setIsPublishing(true); setError(null); setStatus('Enviando arquivos gerados para o catálogo…');
    try {
      const token = await getAccessToken();
      const source = await uploadAsset('source', generation.source, `${slug}.mcstructure`, token);
      const schem = await uploadAsset('schem', generation.schem, `${slug}.schem`, token);
      const cover = await uploadAsset('cover', generation.cover, `${slug}-capa-4-vistas.png`, token);
      const board = await uploadAsset('board', generation.board, `${slug}-prancha.png`, token);
      const views: string[] = [];
      for (let index = 0; index < 8; index += 1) {
        const view = generation.views[index];
        if (!view) throw new Error('Uma das oito vistas não foi gerada pelo Guia 3D.');
        views.push(await uploadAsset('view', view, slug + '-vista-' + String(index + 1).padStart(2, '0') + '.png', token));
      }
      const downloadLinks = ALL_FORMATS.map(([id]) => ({ id, url: links[id].trim() })).filter((link) => Boolean(link.url));
      if (!downloadLinks.some((link) => link.id === 'mcstructure')) downloadLinks.push({ id: 'mcstructure', url: source });
      if (!downloadLinks.some((link) => link.id === 'schem')) downloadLinks.push({ id: 'schem', url: schem });
      const response = await fetchWithTimeout('/api/admin/publisher/publish', {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, assets: { source, schem, cover, views, board }, download_links: downloadLinks }),
      }, 60_000, 'A criação no catálogo demorou demais. Tente novamente.');
      const result = await readApiResult<{ data: { bedrockId: string; javaId: string } }>(response, 'Não foi possível publicar este item');
      setPublishedItems({ bedrockId: result.data.bedrockId, javaId: result.data.javaId }); setStatus('Publicado nas categorias Bedrock e Java.');
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Não foi possível publicar este item.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (checkingAccess) return <div className="flex min-h-screen items-center justify-center bg-[#07090D]"><Loader2 className="animate-spin text-blue-500" size={34} /></div>;

  return (
    <main className="min-h-screen bg-[#07090D] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-[#1D2433] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><Link href={`/${locale}/upload`} className="rounded-xl border border-[#1D2433] bg-[#111318] p-2 text-zinc-400 transition hover:text-white"><ArrowLeft size={18} /></Link><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-red-400">Acesso administrativo</p><h1 className="text-2xl font-black">{isEditing ? 'Editor Bedrock + Java' : 'Publicador 3D Guizz'}</h1></div></div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300"><LockKeyhole size={14} /> Apenas administrador</span>
        </header>

        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>}
        {publishedItems && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200"><div><span>{isEditing ? 'As duas edições foram atualizadas juntas.' : 'Publicado nas duas categorias.'}</span><p className="mt-1 text-xs font-normal text-emerald-100/70">Bedrock e Java continuam como páginas separadas no catálogo público.</p></div><div className="flex flex-wrap gap-2"><Link href={`/${locale}/mod/${publishedItems.bedrockId}`} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-black">Abrir Bedrock</Link><Link href={`/${locale}/mod/${publishedItems.javaId}`} className="rounded-lg bg-orange-400 px-3 py-2 text-xs font-black text-black">Abrir Java</Link><Link href={`/${locale}/admin/publisher?edit=${encodeURIComponent(publishedItems.bedrockId)}`} className="rounded-lg border border-blue-300/40 px-3 py-2 text-xs font-black text-blue-100 hover:bg-blue-300/10">Editar as duas</Link></div></div>}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-center gap-3"><FileText className="text-red-400" /><div><h2 className="font-black">Informações da construção</h2><p className="text-xs text-zinc-500">A descrição aparecerá na página pública.</p></div></div>
              {isEditRoute && <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-400/25 bg-blue-500/[.05] px-4 py-3 text-sm text-blue-100"><Layers3 className="mt-0.5 shrink-0 text-blue-300" size={18} /><span>Bedrock e Java estão unidos neste editor. Os campos e links serão salvos nas duas páginas, que continuam separadas no catálogo público.</span></div>}
              <div className="grid gap-4 sm:grid-cols-2"><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Título da construção" className="rounded-xl border border-[#283244] bg-[#07090D] px-4 py-3 text-sm outline-none focus:border-red-400 sm:col-span-2" /><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Descrição detalhada: o que é a construção, como instalar e o que está incluído." rows={7} className="resize-y rounded-xl border border-[#283244] bg-[#07090D] px-4 py-3 text-sm outline-none focus:border-red-400 sm:col-span-2" /><div className="flex items-center rounded-xl border border-red-400/30 bg-red-500/[.06] px-4 py-3 text-sm font-bold text-red-100 sm:col-span-2">Esta construção será publicada em Bedrock e Java, com downloads próprios para cada edição.</div><input value={form.version} onChange={(event) => setForm((current) => ({ ...current, version: event.target.value }))} placeholder="Versão do Minecraft" className="rounded-xl border border-[#283244] bg-[#07090D] px-4 py-3 text-sm" /><input value={form.file_size} onChange={(event) => setForm((current) => ({ ...current, file_size: event.target.value }))} placeholder="Tamanho do download" className="rounded-xl border border-[#283244] bg-[#07090D] px-4 py-3 text-sm" /></div>
            </section>

            <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <Gamepad2 className="mt-0.5 text-blue-400" />
                <div>
                  <h2 className="font-black">Tema e categorias</h2>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">Escolha como a construção será encontrada no catálogo. Estas escolhas acompanham Bedrock e Java; formatos de arquivo aparecem apenas no download.</p>
                </div>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[.06] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-emerald-300">Edição publicada</p>
                  <p className="mt-1 font-black text-emerald-50">Minecraft Bedrock</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-100/65">Holoprint, `.mcstructure`, `.mcaddon` e `.mcworld`.</p>
                </div>
                <div className="rounded-xl border border-orange-400/25 bg-orange-400/[.06] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-orange-300">Edição publicada</p>
                  <p className="mt-1 font-black text-orange-50">Minecraft Java</p>
                  <p className="mt-1 text-xs leading-5 text-orange-100/65">`.litematic`, `.schem`, `.schematic`, World e `.mcfunction`.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center gap-2"><Palette size={16} className="text-blue-300" /><h3 className="text-sm font-black">Tema principal</h3><span className="text-xs text-zinc-500">Obrigatório · escolha um</span></div>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_THEMES.map((theme) => {
                      const selected = form.content_themes.includes(theme);
                      return <button key={theme} type="button" aria-pressed={selected} onClick={() => toggleMetadata('content_themes', theme, 1)} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${selected ? 'border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-950/30' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-300 hover:border-blue-400/70 hover:text-white'}`}>{selected && <CheckCircle2 className="mr-1 inline-block" size={13} />}{theme}</button>;
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2"><Ruler size={16} className="text-blue-300" /><h3 className="text-sm font-black">Tamanho</h3><span className="text-xs text-zinc-500">Escolha a escala principal</span></div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CONTENT_SIZES.map((size) => {
                      const selected = form.content_size === size;
                      return <button key={size} type="button" aria-pressed={selected} onClick={() => setForm((current) => ({ ...current, content_size: current.content_size === size ? '' : size }))} className={`min-h-11 rounded-xl border px-3 text-xs font-black transition ${selected ? 'border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-950/30' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-300 hover:border-blue-400/70 hover:text-white'}`}>{selected && <CheckCircle2 className="mr-1 inline-block" size={13} />}{size}</button>;
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1"><Layers3 size={16} className="text-blue-300" /><h3 className="text-sm font-black">Categorias da construção</h3><span className="text-xs text-zinc-500">Obrigatório · selecione as que representam esta construção. {form.content_categories.length} selecionada{form.content_categories.length === 1 ? '' : 's'}</span></div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CONTENT_CATEGORIES.map((category) => {
                      const selected = form.content_categories.includes(category);
                      return <button key={category} type="button" aria-pressed={selected} onClick={() => toggleMetadata('content_categories', category)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${selected ? 'border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-950/30' : 'border-[#2b3548] bg-[#0B0F17] text-zinc-300 hover:border-blue-400/70 hover:text-white'}`}>{selected && <CheckCircle2 className="mr-1 inline-block" size={13} />}{contentCategoryLabel(category, locale)}</button>;
                    })}
                  </div>
                </div>
              </div>
            </section>

            {!isEditRoute && <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-xl sm:p-6">
              <div className="mb-4 flex items-center gap-3"><Layers3 className="text-red-400" /><div><h2 className="font-black">Arquivo e geração automática</h2><p className="text-xs text-zinc-500">Envie um `.mcstructure` uma única vez. O Guia 3D prepara a capa com quatro vistas, o modelo e as oito imagens; o Guizz Studio trabalha em segundo plano somente para criar a prancha.</p></div></div>
              <input ref={sourceRef} type="file" accept=".mcstructure,application/octet-stream" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ''; selectSource(file); }} />
              <button type="button" onClick={() => sourceRef.current?.click()} className="flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-red-400/50 bg-red-500/[.06] px-4 py-5 text-center text-sm font-bold text-red-100 transition hover:bg-red-500/[.12]"><Upload size={21} /> <span>{generation.source ? `Trocar ${generation.source.name} e gerar novamente` : 'Selecionar .mcstructure e gerar tudo'}</span><span className="text-xs font-medium text-red-200/70">Capa com 4 vistas pelo Guia 3D; prancha pelo Guizz Studio; `.schem` e oito imagens são preparados automaticamente.</span></button>
              <div aria-hidden="true">
                <iframe ref={studioRef} tabIndex={-1} title="Gerador de prancha Guizz Studio" src="/guide3d/studio-publisher.html" className="pointer-events-none fixed left-0 top-0 h-[720px] w-[1200px] border-0 opacity-0" />
                <iframe
                  ref={guideRef}
                  tabIndex={-1}
                  title="Gerador Guia 3D"
                  src="/guide3d/publisher.html?publisher=1"
                  // The wrapper queues a load until its engine is ready. Mark
                  // its transport ready here so a fast engine handshake can
                  // never be missed while React is mounting.
                  onLoad={() => setGuideReady(true)}
                  className="pointer-events-none fixed left-0 top-0 h-[720px] w-[1200px] border-0 opacity-0"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3"><p className="text-sm text-zinc-400">{status}</p>{isGenerating && <span className="inline-flex items-center gap-2 text-xs font-bold text-red-200"><Loader2 size={14} className="animate-spin" /> Gerando materiais</span>}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">{generatedChecks.map(({ label, ready }) => <span key={label} className={`flex items-center gap-1 rounded-lg border px-2 py-2 ${ready ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-[#283244] text-zinc-600'}`}><CheckCircle2 size={13} /> {label}</span>)}</div>
            </section>}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-xl"><div className="mb-4 flex items-center gap-3"><LinkIcon /><div><h2 className="font-black">Arquivos e links de download</h2><p className="text-xs text-zinc-500">Envie o arquivo diretamente ou cole um link HTTPS. O `.mcstructure` e o `.schem` gerados entram automaticamente.</p></div></div>{Object.entries(FORMAT_GROUPS).map(([family, formats]) => <div key={family} className="mb-5"><p className={`mb-2 text-[10px] font-black uppercase tracking-[.2em] ${family === 'Bedrock' ? 'text-emerald-300' : 'text-orange-300'}`}>{family}</p><div className="space-y-3">{formats.map(([id, label]) => <div key={id}><label className="block"><span className="mb-1 block text-xs font-bold text-zinc-300">{label}</span><input type="url" value={links[id]} onChange={(event) => setLinks((current) => ({ ...current, [id]: event.target.value }))} placeholder="https://…" className="w-full rounded-lg border border-[#283244] bg-[#07090D] px-3 py-2 text-xs outline-none focus:border-red-400" /></label><input ref={(node) => { downloadUploadRefs.current[id] = node; }} type="file" accept={DOWNLOAD_FILE_ACCEPT[id]} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ''; void uploadDownloadFile(id, file); }} /><button type="button" disabled={Boolean(uploadingDownload)} onClick={() => downloadUploadRefs.current[id]?.click()} className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#33435f] bg-[#0b1220] px-3 py-2 text-xs font-bold text-blue-200 transition hover:border-blue-400 hover:bg-blue-500/10 disabled:cursor-wait disabled:opacity-55"><Upload size={14} /> {uploadingDownload === id ? 'Enviando arquivo…' : 'Enviar arquivo'}</button></div>)}</div></div>)}</section>
            <button type="button" disabled={(!isEditing && !fileReady) || isPublishing || (publishingConfigured === false && !isEditing)} onClick={() => void publish()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-4 text-sm font-black shadow-lg shadow-red-950/40 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-45"><Upload size={18} /> {isPublishing ? (isEditing ? 'Salvando as duas edições…' : 'Publicando…') : isEditing ? 'Salvar Bedrock + Java' : publishingConfigured === false ? 'Configure o armazenamento para publicar' : 'Publicar no catálogo'}</button>
            <p className="text-center text-xs leading-5 text-zinc-600">{isEditing ? 'Uma única ação atualiza os dados e os links das duas páginas relacionadas.' : 'Cada material gerado sobe para o lote GitHub atual. Ao atingir 1.000 arquivos, o próximo lote é escolhido automaticamente.'}</p>
          </aside>
        </section>
      </div>
    </main>
  );
}

function LinkIcon() { return <ImageIcon className="text-red-400" />; }
