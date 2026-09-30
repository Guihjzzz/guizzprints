;(() => {
  if (window.__guizzStudioPublisherBridge) return;
  window.__guizzStudioPublisherBridge = true;

  const EVENT = 'guizzStudioPublisher';
  // The Studio is embedded by the publisher from this same deployment.  This
  // works on Vercel and custom domains without granting a cross-origin caller
  // access to the selected construction bytes.
  const allowedOrigin = (origin) => String(origin || '') === location.origin;
  let runtime;
  let lastLoadId = '';
  let loading = false;

  const reply = (target, origin, type, payload = {}, transfer = []) => {
    try { target?.postMessage({ [EVENT]: 1, type, ...payload }, origin, transfer); } catch (error) { console.error('[Guizz Studio publisher]', error); }
  };

  const getContext = async () => {
    if (!runtime) window.webpackChunk_N_E?.push([['guizz-publisher'], {}, (r) => { runtime = r; }]);
    if (!runtime) throw new Error('Aguarde o Guizz Studio inicializar.');
    const r = runtime;
    const { chunkManager } = await r(92967);
    const dimensions = await chunkManager.getDimensions({});
    const chunkIds = Array.from(chunkManager.getChunkIdsFromMinMax(dimensions.minChunk, dimensions.maxChunk, false));
    await r.e(56512);
    const generator = await r(56512);
    const layout = r(46156);
    return { r, chunkManager, dimensions, chunkIds, views: layout.U4.flat(), renderView: generator.renderSpecSheetViewBitmap };
  };

  const waitForBuild = async () => {
    const started = Date.now();
    while (Date.now() - started < 60000) {
      try {
        const context = await getContext();
        if (context.chunkManager.hasBlocks()) return context;
      } catch (_) {}
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    throw new Error('O Guizz Studio não terminou de abrir a construção.');
  };

  const renderViews = async (ids) => {
    const context = await waitForBuild();
    const selected = ids.map((id) => context.views.find((view) => view.id === id)).filter(Boolean);
    const output = [];
    for (const view of selected) {
      output.push({ view, bitmap: await context.renderView({ view, chunkIds: context.chunkIds, dimensions: context.dimensions, possibleModdedBlocks: [], resolution: 1200 }) });
    }
    return output;
  };

  const toBlob = (canvas) => new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao criar PNG.')), 'image/png'));
  const drawContained = (ctx, image, x, y, width, height, padding) => {
    const scale = Math.min((width - padding * 2) / image.width, (height - padding * 2) / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
  };
  const emitBlob = async (target, origin, type, blob, payload = {}) => {
    if (!(blob instanceof Blob) || !blob.size) throw new Error('O Guizz Studio não gerou ' + type + '.');
    const buffer = await blob.arrayBuffer();
    reply(target, origin, type, { ...payload, buffer, mime: blob.type || 'image/png' }, [buffer]);
  };

  const openBuild = async (data, event) => {
    const loadId = String(data.loadId || '');
    if (loadId && loadId === lastLoadId) {
      reply(event.source, event.origin, 'loaded', { loadId });
      return;
    }
    if (loading) return;
    if (!(data.buffer instanceof ArrayBuffer) && !data.sourceUrl) throw new Error('Arquivo .mcstructure ausente.');
    loading = true;
    try {
      reply(event.source, event.origin, 'status', { message: 'Abrindo o .mcstructure no Guizz Studio…' });
      let buffer = data.buffer;
      if (!(buffer instanceof ArrayBuffer)) {
        const url = new URL(String(data.sourceUrl));
        if (url.protocol !== 'https:' || url.hostname !== 'github.com' || !url.pathname.startsWith('/Guizzhjz/guizzprints-assets/releases/download/')) throw new Error('A prévia aceita somente arquivos dos Releases do Guizzprints.');
        const response = await fetch(url.toString(), { cache: 'no-store' });
        if (!response.ok) throw new Error('Falha ao baixar a construção (HTTP ' + response.status + ').');
        buffer = await response.arrayBuffer();
      }
      const input = [...document.querySelectorAll('input[type="file"]')].find((node) => node.accept.includes('.mcstructure'));
      if (!input) throw new Error('Campo de importação do Guizz Studio não foi encontrado.');
      const fileName = String(data.name || 'construcao.mcstructure').replace(/[^a-zA-Z0-9._ -]/g, '_');
      const files = new DataTransfer();
      files.items.add(new File([buffer], fileName, { type: 'application/octet-stream' }));
      input.value = '';
      input.files = files.files;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      const context = await waitForBuild();
      const dimensions = await context.chunkManager.getDimensions({});
      lastLoadId = loadId;
      reply(event.source, event.origin, 'loaded', {
        loadId,
        name: fileName,
        dimensions: {
          width: Number(dimensions.max?.x || 0) - Number(dimensions.min?.x || 0) + 1,
          height: Number(dimensions.max?.y || 0) - Number(dimensions.min?.y || 0) + 1,
          depth: Number(dimensions.max?.z || 0) - Number(dimensions.min?.z || 0) + 1,
        },
      });
    } finally {
      loading = false;
    }
  };

  const generate = async (data, event) => {
    const target = event.source;
    const origin = event.origin;
    const brandDomain = 'www.guizzprints.xyz';
    const context = await waitForBuild();
    const { r, dimensions } = context;
    reply(target, origin, 'status', { message: 'Gerando prancha completa no Guizz Studio…' });
    const { hF } = await r(40920);
    await r.e(56512);
    const { renderSpecSheetPng } = await r(56512);
    const materials = await hF.getInstance().queue((worker) => worker.groupBlocksByName({ gidsToIgnore: {}, possibleModdedBlocks: [] }));
    const board = await renderSpecSheetPng({ buildName: brandDomain, brandText: brandDomain, watermarkText: brandDomain, creatorName: '', subtitle: 'Todos os lados da construção, na mesma escala', dimensions, materials, possibleModdedBlocks: [], showWatermark: false, onProgress: (done, total) => reply(target, origin, 'status', { message: 'Prancha Guizz Studio: ' + done + '/' + total + ' vistas.' }) });
    await emitBlob(target, origin, 'board', board);

    // O publicador já cria a capa e as oito vistas pelo Guia 3D. Aqui o
    // Studio nativo fica responsável somente pela sua prancha original.
    if (data.includeViews === false) {
      reply(target, origin, 'generated');
      return;
    }

    reply(target, origin, 'status', { message: 'Gerando capa com quatro vistas no Guizz Studio…' });
    const coverIds = ['iso-se', 'iso-sw', 'iso-nw', 'iso-ne'];
    const coverViews = await renderViews(coverIds);
    try {
      if (coverViews.length !== 4) throw new Error('As quatro vistas isométricas não foram encontradas.');
      const canvas = document.createElement('canvas');
      canvas.width = 2048; canvas.height = 2048;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas 2D indisponível.');
      ctx.fillStyle = '#cceff7'; ctx.fillRect(0, 0, 2048, 2048);
      coverViews.forEach(({ bitmap }, index) => {
        const x = (index % 2) * 1024, y = Math.floor(index / 2) * 1024;
        ctx.save(); ctx.beginPath(); ctx.rect(x, y, 1024, 1024); ctx.clip();
        drawContained(ctx, bitmap, x, y, 1024, 1024, 58); ctx.restore();
      });
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 8; ctx.beginPath();
      ctx.moveTo(1024, 0); ctx.lineTo(1024, 2048); ctx.moveTo(0, 1024); ctx.lineTo(2048, 1024); ctx.stroke();
      ctx.font = '700 56px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 8;
      ctx.fillText(brandDomain, 1024, 1010);
      await emitBlob(target, origin, 'cover', await toBlob(canvas));
    } finally {
      coverViews.forEach(({ bitmap }) => bitmap.close?.());
    }

    if (data.includeViews !== false) {
      reply(target, origin, 'status', { message: 'Gerando oito vistas no Guizz Studio…' });
      const ids = ['iso-se', 'iso-sw', 'iso-nw', 'iso-ne', 'elev-front', 'elev-right', 'elev-back', 'elev-left'];
      const labels = { 'iso-se': 'Sudeste', 'iso-sw': 'Sudoeste', 'iso-nw': 'Noroeste', 'iso-ne': 'Nordeste', 'elev-front': 'Frente', 'elev-right': 'Direita', 'elev-back': 'Traseira', 'elev-left': 'Esquerda' };
      const rendered = await renderViews(ids);
      try {
        for (let index = 0; index < rendered.length; index += 1) {
          const { view, bitmap } = rendered[index];
          const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1200;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) throw new Error('Canvas 2D indisponível.');
          ctx.fillStyle = '#cceff7'; ctx.fillRect(0, 0, 1200, 1200);
          drawContained(ctx, bitmap, 0, 0, 1200, 1200, 64);
          ctx.fillStyle = 'rgba(9,9,11,.82)'; ctx.fillRect(0, 1120, 1200, 80);
          ctx.fillStyle = 'white'; ctx.font = '600 30px system-ui'; ctx.textAlign = 'center';
          ctx.fillText(labels[view.id] || view.label || ('Vista ' + (index + 1)), 600, 1172);
          await emitBlob(target, origin, 'view', await toBlob(canvas), { index });
          reply(target, origin, 'status', { message: 'Oito vistas Guizz Studio: ' + (index + 1) + '/8.' });
        }
      } finally {
        rendered.forEach(({ bitmap }) => bitmap.close?.());
      }
    }
    reply(target, origin, 'generated');
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || !allowedOrigin(event.origin)) return;
    const data = event.data;
    if (!data || data[EVENT] !== 1) return;
    if (data.type === 'load' || data.type === 'preview') void openBuild(data, event).catch((error) => reply(event.source, event.origin, 'error', { message: error?.message || String(error) }));
    if (data.type === 'generate') void generate(data, event).catch((error) => reply(event.source, event.origin, 'error', { message: error?.message || String(error) }));
  });

  const announceReady = async () => {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      const input = [...document.querySelectorAll('input[type="file"]')]
        .find((node) => node.accept.includes('.mcstructure'));
      if (input && window.webpackChunk_N_E) {
        // O DOM aparece antes da hidratação React. Esperar alguns frames evita
        // que o primeiro `change` seja descartado pelo importador original.
        await new Promise((resolve) => setTimeout(resolve, 850));
        if (window.parent !== window) {
          try { window.parent.postMessage({ [EVENT]: 1, type: 'studio-ready' }, '*'); } catch (_) {}
        }
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  };
  void announceReady();
})();
