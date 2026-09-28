import { convertWithNativeEngine, supportsNativeConversion } from "./native-converter-bridge.js?v=2";

const frame = document.querySelector("#engineFrame");
const viewerCard = document.querySelector("#viewerCard");
const loadingScreen = document.querySelector("#loadingScreen");
const engineStatus = document.querySelector("#engineStatus");
const stateDot = document.querySelector("#stateDot");
const toastElement = document.querySelector("#toast");
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalEyebrow = document.querySelector("#modalEyebrow");
const modalContent = document.querySelector("#modalContent");
const modalFooter = document.querySelector("#modalFooter");
const schemInput = document.querySelector("#schemInput");
const schemDropzone = document.querySelector("#schemDropzone");
const fileStatus = document.querySelector("#fileStatus");
const loadedFileName = document.querySelector("#loadedFileName");
const modelTitle = document.querySelector("#modelTitle");
const loadingTitle = document.querySelector("#loadingTitle");
const loadingCopy = document.querySelector("#loadingCopy");
const formatBadge = document.querySelector("#formatBadge");
const exportFormat = document.querySelector("#exportFormat");
const studioModeButton = document.querySelector("#studioModeButton");
const openStudioButton = document.querySelector("#openStudioButton");
const nativeConverterButton = document.querySelector("#nativeConverterButton");

const controls = [...document.querySelectorAll("button[id]:not(#fullscreenButton), input[id]")];
let viewerReady = false;
let toastTimer = 0;
let busyAction = "";
let latestShots = [];
let uploadInFlight = false;
let conversionInFlight = false;
let pendingSchemFile = null;
let activeSchemUrl = "";
let activeSchemName = "";
let completeStudio = false;
// Kept for the message bridge and QA fixtures. Public non-Sponge uploads pass
// through the untouched native converter controlled by the external bridge.
let engineEdited = false;
let loadedEngineBlockCount = null;
let pendingExport = null;

const frameUrl = new URL(frame.dataset.src, window.location.href);
const frameOrigin = frameUrl.origin;
const messageTargetOrigin = frameOrigin === "null" ? "*" : frameOrigin;

const LOCAL_STYLES_KEY = "guizz-local-styles-v1";

function readLocalStyles() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_STYLES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((style) => style && style.sid) : [];
  } catch (error) {
    console.warn("[Guizz Studio] Não foi possível ler os estilos locais", error);
    return [];
  }
}

function writeLocalStyles(styles) {
  try {
    localStorage.setItem(LOCAL_STYLES_KEY, JSON.stringify(styles));
    return true;
  } catch (error) {
    console.error("[Guizz Studio] Falha ao salvar estilos locais", error);
    return false;
  }
}

function setStudioMode(open) {
  completeStudio = Boolean(open);
  document.body.classList.toggle("studio-mode", completeStudio);
  studioModeButton.setAttribute("aria-pressed", String(completeStudio));
  studioModeButton.querySelector(".studio-mode-label").textContent = completeStudio ? "Voltar ao painel Guizz" : "Estúdio completo";
  studioModeButton.title = completeStudio ? "Fechar o estúdio completo" : "Abrir todas as ferramentas do motor original";
  if (openStudioButton) openStudioButton.setAttribute("aria-pressed", String(completeStudio));
  if (viewerReady) send("studioPanel", { open: completeStudio });
  window.setTimeout(() => send("relayout"), 120);
}

function setState(label, state = "ready") {
  engineStatus.textContent = label;
  stateDot.className = `state-dot ${state}`;
}

function toast(message, kind = "") {
  clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.className = `toast visible ${kind}`;
  toastTimer = window.setTimeout(() => {
    toastElement.className = "toast";
  }, 3600);
}

function send(command, payload = {}) {
  if (!frame.contentWindow) return false;
  frame.contentWindow.postMessage({ bi: 1, cmd: command, ...payload }, messageTargetOrigin);
  return true;
}

// Automated visual QA runs on the same local page with `?qa=...`.  Expose the
// existing message bridge only in that mode so tests can select an exact build
// step without adding production controls or reaching into the sandboxed iframe.
const qaParams = new URLSearchParams(window.location.search);
if (qaParams.has("qa")) {
  window.__guizzQaSend = send;
  const qaStepButton = document.createElement("button");
  qaStepButton.type = "button";
  qaStepButton.id = "guizzQaFinalStep";
  qaStepButton.setAttribute("aria-label", "QA: ir para etapa auditada");
  qaStepButton.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:.001;z-index:-1;padding:0;border:0";
  qaStepButton.addEventListener("click", () => {
    const step = Number(document.documentElement.dataset.guizzQaStep || 1);
    send("rgoto", { n: step });
  });
  document.body.appendChild(qaStepButton);
  document.documentElement.dataset.guizzQaBridge = "ready";
  const fixtureName = qaParams.get("qaFixture");
  const fixtures = {
    all: "qa-all-blocks.mcstructure",
    aquatic: "qa-aquatic.mcstructure",
    geometry: "qa-geometry-edge.mcstructure",
  };
  if (fixtures[fixtureName]) {
    fetch(`./${fixtures[fixtureName]}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Fixture HTTP ${response.status}`);
        return response.blob();
      })
      .then(async (blob) => {
        const fixture = new File([blob], fixtures[fixtureName]);
        if (fixture.name.endsWith(".schem")) return loadSchemFile(fixture);
        // Legacy format conversion remains available only for internal visual
        // fixtures; the public upload path uses the untouched native converter.
        const { convertFileToSchem } = await import("./converter/formatBridge.js?v=13");
        return loadSchemFile((await convertFileToSchem(fixture)).file);
      })
      .catch((error) => console.error("[Guizz QA] fixture não carregada", error));
  }
}

function enableTools(enabled) {
  document.querySelectorAll("#timelapseButton, #materialsButton, #configButton, #coverButton, #shotsButton, #videoButton, #timelapseVideoButton, #exportButton, #exportFormat")
    .forEach((control) => { control.disabled = !enabled; });
}

function setFileStatus(label, state = "ready") {
  loadedFileName.textContent = label;
  fileStatus.className = `file-status ${state}`;
}

function resetStats() {
  document.querySelector("#statBlocks").textContent = "—";
  document.querySelector("#statSteps").textContent = "—";
  document.querySelector("#statDims").textContent = "—";
}

function finishSchemRequest() {
  uploadInFlight = false;
  schemDropzone.classList.remove("loading");
  schemInput.disabled = false;
  nativeConverterButton.disabled = false;
  if (activeSchemUrl) {
    URL.revokeObjectURL(activeSchemUrl);
    activeSchemUrl = "";
  }
  schemInput.value = "";
}

function displayBuildName(fileName) {
  return String(fileName || "Construção")
    .replace(/\.schem$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Construção";
}

async function loadSchemFile(file) {
  if (!file) return;
  if (uploadInFlight) {
    toast("Aguarde o arquivo atual terminar de carregar.", "error");
    return;
  }
  if (!/\.schem$/i.test(file.name)) {
    schemInput.value = "";
    setFileStatus("Converta este arquivo para .schem no conversor completo", "error");
    toast("Abra o conversor completo para importar este formato e exportar .schem.", "error");
    return;
  }
  if (!viewerReady) {
    pendingSchemFile = file;
    setFileStatus(`${file.name} aguardando o motor 3D`, "loading");
    toast("Arquivo recebido. Ele será aberto quando o motor estiver pronto.");
    return;
  }

  uploadInFlight = true;
  activeSchemName = file.name;
  schemInput.disabled = true;
  schemDropzone.classList.add("loading");
  loadingTitle.textContent = "Abrindo a construção";
  loadingCopy.textContent = "Lendo o .schem original e criando as etapas";
  loadingScreen.classList.remove("hidden");
  enableTools(false);
  resetStats();
  setFileStatus(`${file.name} · abrindo…`, "loading");
  setState("Motor 3D lendo o .schem…", "busy");
  try {
    if (!file.size) throw new Error("O arquivo .schem está vazio.");
    engineEdited = false;
    loadedEngineBlockCount = null;
    activeSchemUrl = URL.createObjectURL(file);
    formatBadge.textContent = "SCHEM";
    setFileStatus(`${file.name} · enviando ao motor 3D…`, "loading");
    setState("Montando guia a partir do .schem original…", "busy");
    console.info("[Guizz Schem] Arquivo original enviado ao motor", { source: file.name, bytes: file.size });
    send("loadSchem", {
      url: activeSchemUrl,
      name: file.name,
      title: displayBuildName(file.name),
    });
  } catch (error) {
    console.error("[Guizz Schem] falha ao abrir", { file: file.name, message: error?.message, stack: error?.stack, error });
    engineEdited = false;
    loadedEngineBlockCount = null;
    setFileStatus(`${file.name} · falha ao abrir`, "error");
    finishSchemRequest();
    loadingScreen.classList.add("hidden");
    enableTools(true);
    setState("Falha ao abrir o arquivo", "error");
    toast(`Não foi possível abrir: ${error?.message || "arquivo inválido"}`, "error");
  }
}

async function importMinecraftFile(file) {
  if (!file) return;
  if (uploadInFlight || conversionInFlight) {
    toast("Aguarde o arquivo atual terminar de carregar.", "error");
    return;
  }
  if (/\.schem$/i.test(file.name)) {
    await loadSchemFile(file);
    return;
  }
  if (!supportsNativeConversion(file)) {
    schemInput.value = "";
    setFileStatus(`${file.name} · formato não suportado`, "error");
    toast("Use .mcstructure, .litematic, .schem, .schematic, .nbt, .bp ou um pacote compatível.", "error");
    return;
  }

  conversionInFlight = true;
  schemInput.disabled = true;
  nativeConverterButton.disabled = true;
  schemDropzone.classList.add("loading");
  loadingTitle.textContent = "Conversão nativa";
  loadingCopy.textContent = "Iniciando o conversor original";
  loadingScreen.classList.remove("hidden");
  enableTools(false);
  resetStats();
  setState("Conversor nativo trabalhando…", "busy");
  setFileStatus(`${file.name} · preparando conversão…`, "loading");
  try {
    const converted = await convertWithNativeEngine(file, (progress) => {
      loadingCopy.textContent = progress;
      setFileStatus(`${file.name} · ${progress}`, "loading");
    });
    console.info("[Guizz Native Converter] conversão concluída", {
      source: file.name,
      sourceBytes: file.size,
      output: converted.name,
      outputBytes: converted.size,
    });
    conversionInFlight = false;
    schemInput.disabled = false;
    nativeConverterButton.disabled = false;
    schemDropzone.classList.remove("loading");
    schemInput.value = "";
    toast("Conversão nativa concluída. Abrindo o modelo 3D.");
    await loadSchemFile(converted);
  } catch (error) {
    console.error("[Guizz Native Converter] falha", { file: file.name, error });
    conversionInFlight = false;
    schemInput.disabled = false;
    nativeConverterButton.disabled = false;
    schemDropzone.classList.remove("loading");
    schemInput.value = "";
    loadingScreen.classList.add("hidden");
    enableTools(true);
    setState("Falha na conversão nativa", "error");
    setFileStatus(`${file.name} · falha na conversão`, "error");
    toast(`Falha na conversão: ${error?.message || "erro desconhecido"}`, "error");
  }
}

function formatNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("pt-BR") : "—";
}

function updateStats({ blocks, steps, dims } = {}) {
  if (blocks !== undefined && blocks !== null) document.querySelector("#statBlocks").textContent = formatNumber(blocks);
  if (steps !== undefined && steps !== null) document.querySelector("#statSteps").textContent = formatNumber(Math.max(0, Number(steps) - 1));
  if (dims) {
    const w = dims.w ?? dims[0];
    const h = dims.h ?? dims[1];
    const l = dims.l ?? dims[2];
    document.querySelector("#statDims").textContent = [w, h, l].every(Number.isFinite) ? `${w}×${h}×${l}` : "—";
  }
}

function setBusy(action, message) {
  busyAction = action;
  setState(message, "busy");
  const button = document.querySelector(`#${action}Button`);
  if (button) button.disabled = true;
}

function clearBusy(message = "Motor 3D pronto") {
  const button = busyAction ? document.querySelector(`#${busyAction}Button`) : null;
  if (button) button.disabled = false;
  busyAction = "";
  setState(message, "ready");
}

function safeName(value, fallback = "construcao") {
  const normalized = String(value || fallback)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function downloadDataUrl(url, name) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function openModal({ eyebrow = "Resultado", title, content, footer = "" }) {
  modalEyebrow.textContent = eyebrow;
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modalFooter.innerHTML = footer;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function showGallery(shots, title = "Imagens geradas") {
  latestShots = shots.filter((shot) => shot && shot.url);
  const content = latestShots.length
    ? `<div class="gallery">${latestShots.map((shot, index) => `
        <article class="shot-card">
          <img src="${shot.url}" alt="Vista ${index + 1} da construção" />
          <footer><span>${escapeHtml(shot.label || (shot.deg !== undefined ? `${shot.deg}°` : "Isométrica"))}</span><button type="button" data-download-shot="${index}">Baixar PNG</button></footer>
        </article>`).join("")}</div>`
    : `<div class="empty-result">Nenhuma imagem foi produzida pelo motor.</div>`;
  const footer = latestShots.length > 1
    ? `<button class="modal-action" type="button" id="downloadShotsCollage">Baixar painel único PNG</button>
       <button class="modal-action primary" type="button" id="downloadShotsZip">Baixar todas em ZIP</button>`
    : "";
  openModal({ eyebrow: "Captura", title, content, footer });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function showMaterials(message) {
  const list = Array.isArray(message.list) ? message.list : [];
  const content = list.length
    ? `<div class="material-list">${list.map((item) => `
        <div class="material-item">
          ${item.icon ? `<img src="${item.icon}" alt="" />` : "<span></span>"}
          <strong>${escapeHtml(item.name)}</strong>
          <span>${formatNumber(item.count)}</span>
        </div>`).join("")}</div>`
    : `<div class="empty-result">A construção não informou materiais.</div>`;
  openModal({ eyebrow: `${formatNumber(message.total)} blocos`, title: "Lista de materiais", content });
}

async function downloadShotsZip() {
  if (!latestShots.length || typeof JSZip === "undefined") return;
  const zip = new JSZip();
  latestShots.forEach((shot, index) => {
    const base64 = shot.url.split(",")[1];
    const suffix = shot.deg !== undefined ? `${String(shot.deg).padStart(3, "0")}-graus` : `vista-${index + 1}`;
    zip.file(`guizz-${suffix}.png`, base64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadBlob(blob, "guizz-vistas.zip");
  toast("Pacote com as imagens criado.");
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Uma das capturas não pôde ser lida."));
    image.src = url;
  });
}

async function downloadShotsCollage() {
  if (latestShots.length < 2) return;
  setState("Montando painel com todas as vistas…", "busy");
  try {
    const images = await Promise.all(latestShots.map((shot) => loadImage(shot.url)));
    const columns = latestShots.length <= 4 ? 2 : 4;
    const rows = Math.ceil(images.length / columns);
    const cellWidth = 640;
    const cellHeight = 420;
    const header = 104;
    const canvas = document.createElement("canvas");
    canvas.width = columns * cellWidth;
    canvas.height = header + rows * cellHeight;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas 2D indisponível.");

    // Keep the combined download consistent with each individual view: a clean
    // white product plate rather than the former dark dashboard-style collage.
    context.fillStyle = "#f6f6f6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#1f2937";
    context.font = "700 34px system-ui, sans-serif";
    context.fillText(displayBuildName(activeSchemName || modelTitle.textContent), 32, 48);
    context.fillStyle = "#b91c1c";
    context.font = "700 22px system-ui, sans-serif";
    context.fillText("www.guizz.xyz", 32, 80);

    images.forEach((image, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * cellWidth;
      const y = header + row * cellHeight;
      context.fillStyle = index % 2 ? "#ffffff" : "#f1f5f9";
      context.fillRect(x, y, cellWidth, cellHeight);
      context.strokeStyle = "#d1d5db";
      context.lineWidth = 1;
      context.strokeRect(x + .5, y + .5, cellWidth - 1, cellHeight - 1);
      const scale = Math.min((cellWidth - 28) / image.width, (cellHeight - 28) / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(image, x + (cellWidth - width) / 2, y + (cellHeight - height) / 2, width, height);
      context.fillStyle = "rgba(31,41,55,.8)";
      context.font = "600 18px system-ui, sans-serif";
      const label = latestShots[index].label || (latestShots[index].deg !== undefined ? `${latestShots[index].deg}°` : `Vista ${index + 1}`);
      context.fillText(label, x + 18, y + cellHeight - 18);
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("O navegador não conseguiu codificar o PNG.");
    downloadBlob(blob, `guizz-${safeName(displayBuildName(activeSchemName || modelTitle.textContent))}-painel.png`);
    toast("Painel único com todas as vistas criado.");
  } catch (error) {
    console.error("[Guizz Capturas] falha ao criar painel", error);
    toast(`Falha ao criar o painel: ${error.message}`, "error");
  } finally {
    setState("Motor 3D pronto", "ready");
  }
}

function hasEngineEdits(message) {
  return Object.keys(message?.map || {}).length > 0
    || Object.keys(message?.cells || {}).length > 0
    || (Array.isArray(message?.del) && message.del.length > 0);
}

function requestExport() {
  if (pendingExport) {
    toast("Aguarde a exportação atual terminar.", "error");
    return;
  }
  const title = displayBuildName(activeSchemName || modelTitle.textContent || "guizz-estrutura");
  const id = `guizz-export-${Date.now()}`;
  setBusy("export", "Exportando a construção editada…");
  pendingExport = { id, title };
  send("exportSchem", { save: false, id });
}

window.addEventListener("message", (event) => {
  const message = event.data;
  if (event.source !== frame.contentWindow) return;
  if (frameOrigin !== "null" && event.origin !== frameOrigin) return;
  if (!message || message.bi !== 1) return;

  switch (message.cmd) {
    case "ready":
      viewerReady = true;
      loadingScreen.classList.add("hidden");
      enableTools(true);
      updateStats(message);
      send("auth", { member: true });
      send("gate", { on: false });
      send("bg", { mode: "dark" });
      send("memberStyles", { list: readLocalStyles() });
      send("studioPanel", { open: completeStudio });
      if (Number(message.blocks) > 0 && Number(message.steps) > 0) {
        send("rgoto", { n: Number(message.steps) });
        window.setTimeout(() => {
          send("relayout");
          send("thumbAim", { rot: 45, el: 35.264, zoom: 1, shadow: 0.22, ao: true });
        }, 180);
      }
      setState(message.catalogReady === false ? "Motor pronto com geometria de segurança" : "Motor 3D e catálogo de modelos prontos", "ready");
      document.documentElement.dataset.guizzCatalogReady = String(message.catalogReady !== false);
      if (pendingSchemFile) {
        const file = pendingSchemFile;
        pendingSchemFile = null;
        window.setTimeout(() => loadSchemFile(file), 0);
      }
      break;
    case "stepsChanged":
      updateStats({ blocks: message.blocks, steps: message.steps, dims: message.dims });
      if (!uploadInFlight && loadedEngineBlockCount !== null
        && Number.isFinite(Number(message.blocks))
        && Number(message.blocks) !== loadedEngineBlockCount) {
        engineEdited = true;
        document.documentElement.dataset.guizzEngineEdited = "true";
      }
      break;
    case "buildLoaded":
      if (message.blocks !== undefined) document.querySelector("#statBlocks").textContent = formatNumber(message.blocks);
      if (uploadInFlight) {
        // O motor emite duas fases: primeiro confirma que os bytes foram lidos;
        // depois envia `painted: 1` quando a nova cena já chegou ao WebGL.
        if (!message.painted) {
          setFileStatus(`${activeSchemName} · montando o guia…`, "loading");
          setState("Criando etapas e geometrias…", "busy");
          break;
        }
        const name = activeSchemName;
        loadedEngineBlockCount = Number.isFinite(Number(message.blocks)) ? Number(message.blocks) : null;
        modelTitle.textContent = displayBuildName(name);
        setFileStatus(`${name} · carregado`, "ready");
        finishSchemRequest();
        loadingScreen.classList.add("hidden");
        enableTools(true);
        setState("Construção pronta", "ready");
        window.setTimeout(() => {
          send("relayout");
          send("thumbAim", { rot: 45, el: 35.264, zoom: 1, shadow: 0.22, ao: true });
        }, 220);
      }
      if (message.painted && qaParams.has("qa") && qaParams.get("qaStep") === "final") {
        const finalStep = Number(message.steps);
        if (Number.isFinite(finalStep) && finalStep > 0) {
          document.documentElement.dataset.guizzQaStep = String(finalStep);
          window.setTimeout(() => send("rgoto", { n: finalStep }), 260);
        }
      }
      toast("Construção carregada no guia 3D.");
      break;
    case "buildFailed":
      console.error("[Guizz Schem] Falha ao processar", { file: activeSchemName, error: message.error });
      if (uploadInFlight) {
        engineEdited = false;
        loadedEngineBlockCount = null;
        setFileStatus(`${activeSchemName} · falha ao abrir`, "error");
        finishSchemRequest();
        loadingScreen.classList.add("hidden");
        enableTools(true);
      }
      setState("Falha ao carregar a construção", "error");
      toast(`Falha no modelo: ${message.error || "erro desconhecido"}`, "error");
      break;
    case "timelapseDone":
      clearBusy("Timelapse concluído");
      toast("Timelapse concluído.");
      break;
    case "timelapseVidProgress":
      setState(`Gravando timelapse por camadas · ${Math.max(0, Math.min(100, Math.round(Number(message.progress) || 0)))}%`, "busy");
      break;
    case "timelapseVidDone":
      clearBusy("Vídeo por camadas concluído");
      if (message.err || !message.buf) {
        toast(`Falha ao gerar o timelapse: ${message.err || "arquivo vazio"}`, "error");
      } else {
        const mime = message.mime || "video/webm";
        downloadBlob(new Blob([message.buf], { type: mime }), `guizz-${safeName(activeSchemName || modelTitle.textContent)}-camadas.webm`);
        toast("Timelapse WebM de montagem e desmontagem baixado.");
      }
      break;
    case "shotsDone":
      clearBusy("Capturas concluídas");
      showGallery(message.shots || [], "8 vistas da construção");
      break;
    case "thumbShotDone":
      clearBusy("Capa concluída");
      if (message.err) {
        toast(`Falha ao gerar a capa: ${message.err}`, "error");
      } else {
        showGallery([{ url: message.url, label: "Capa isométrica" }], "Capa isométrica");
      }
      break;
    case "spinVidDone":
      clearBusy("Vídeo concluído");
      if (message.err || !message.buf) {
        toast(`Falha ao gerar vídeo: ${message.err || "arquivo vazio"}`, "error");
      } else {
        const mime = message.mime || "video/webm";
        downloadBlob(new Blob([message.buf], { type: mime }), `guizz-${safeName(message.styleName)}.webm`);
        toast("Vídeo WebM gerado e baixado.");
      }
      break;
    case "schemExport":
      if (pendingExport && (!message.id || message.id === pendingExport.id)) {
        const request = pendingExport;
        pendingExport = null;
        if (message.err || !message.bytes) {
          clearBusy("Falha na exportação");
          toast(`Falha na exportação: ${message.err || "arquivo vazio"}`, "error");
        } else {
          downloadBlob(new Blob([message.bytes], { type: "application/octet-stream" }), `${safeName(request.title)}.schem`);
          clearBusy("Exportação concluída");
          toast("Arquivo .schem da construção atual baixado.");
        }
      } else if (message.err) toast(`Falha na exportação: ${message.err}`, "error");
      break;
    case "editState":
      engineEdited = engineEdited || hasEngineEdits(message);
      document.documentElement.dataset.guizzEngineEdited = String(engineEdited);
      break;
    case "materials":
      showMaterials(message);
      break;
    case "openMaterials":
      send("materials");
      break;
    case "saveStyle": {
      const style = message.style || {};
      const styles = readLocalStyles();
      const sid = style.sid || `guizz-local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const saved = { ...style, sid, member: true };
      const index = styles.findIndex((item) => item.sid === sid);
      if (index >= 0) styles[index] = saved;
      else styles.push(saved);
      const ok = writeLocalStyles(styles);
      send("styleSaved", { req: message.req, ok, sid, thumb: message.png || "", err: ok ? "" : "Armazenamento local indisponível" });
      if (ok) toast("Estilo salvo neste navegador.");
      break;
    }
    case "styleRenamed": {
      const styles = readLocalStyles();
      const style = styles.find((item) => item.name === message.from);
      if (style) {
        style.name = message.to;
        writeLocalStyles(styles);
      }
      send("renameStyle", { from: message.from, to: message.to });
      break;
    }
    case "wantRemote":
      openModal({
        eyebrow: "Controle compacto",
        title: "Comandar o guia 3D",
        content: `<div class="remote-pad">
          <p>Controle etapas e câmera sem fechar o estúdio.</p>
          <div class="remote-step-row">
            <button type="button" data-engine-command="previous">◀ Etapa anterior</button>
            <button type="button" data-engine-command="next">Próxima etapa ▶</button>
          </div>
          <div class="remote-orbit" aria-label="Girar câmera">
            <button type="button" data-engine-command="orbit-left" aria-label="Girar para a esquerda">↶</button>
            <button type="button" data-engine-command="orbit-up" aria-label="Girar para cima">↑</button>
            <button type="button" data-engine-command="orbit-down" aria-label="Girar para baixo">↓</button>
            <button type="button" data-engine-command="orbit-right" aria-label="Girar para a direita">↷</button>
          </div>
          <button class="remote-primary" type="button" data-engine-command="timelapse">▶ Reproduzir timelapse</button>
          <button type="button" data-engine-command="materials">Lista de materiais</button>
        </div>`,
      });
      break;
    case "configData": {
      const blob = new Blob([JSON.stringify(message.config || {}, null, 2)], { type: "application/json" });
      downloadBlob(blob, "guizz-configuracao.json");
      toast("Configuração do guia exportada.");
      break;
    }
  }
});

document.querySelector("#timelapseButton").addEventListener("click", () => {
  setBusy("timelapse", "Reproduzindo timelapse…");
  send("timelapse");
});

studioModeButton.addEventListener("click", () => setStudioMode(!completeStudio));
openStudioButton.addEventListener("click", () => setStudioMode(true));
document.querySelectorAll("[data-studio-view]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!completeStudio) setStudioMode(true);
    send("studioView", { view: button.dataset.studioView });
  });
});

schemInput.addEventListener("change", () => {
  const file = schemInput.files && schemInput.files[0];
  if (file) void importMinecraftFile(file);
});

nativeConverterButton.addEventListener("click", () => {
  if (!uploadInFlight && !conversionInFlight) schemInput.click();
});

schemDropzone.addEventListener("click", () => {
  if (!uploadInFlight && !conversionInFlight) schemInput.click();
});

schemDropzone.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !uploadInFlight && !conversionInFlight) {
    event.preventDefault();
    schemInput.click();
  }
});

["dragenter", "dragover"].forEach((type) => schemDropzone.addEventListener(type, (event) => {
  event.preventDefault();
  if (!uploadInFlight && !conversionInFlight) schemDropzone.classList.add("dragging");
}));

["dragleave", "drop"].forEach((type) => schemDropzone.addEventListener(type, (event) => {
  event.preventDefault();
  schemDropzone.classList.remove("dragging");
}));

schemDropzone.addEventListener("drop", (event) => {
  if (!uploadInFlight && !conversionInFlight) void importMinecraftFile(event.dataTransfer && event.dataTransfer.files[0]);
});

document.querySelector("#spinToggle").addEventListener("change", (event) => {
  send("spin", { on: event.target.checked });
});

document.querySelector("#gridToggle").addEventListener("change", (event) => {
  send("setGrid", { hidden: !event.target.checked });
});

document.querySelector("#materialsButton").addEventListener("click", () => send("materials"));
document.querySelector("#configButton").addEventListener("click", () => send("getConfig"));

document.querySelector("#coverButton").addEventListener("click", () => {
  setBusy("cover", "Gerando capa isométrica…");
  send("thumbShot", { size: 1200, rot: 45, el: 35.264, zoom: 1, shadow: 0.28, ao: true });
});

document.querySelector("#shotsButton").addEventListener("click", () => {
  setBusy("shots", "Gerando 8 vistas…");
  send("shots", { n: 8, size: 1200 });
});

document.querySelector("#videoButton").addEventListener("click", () => {
  setBusy("video", "Gravando vídeo giratório…");
  send("spinVid", { size: 720, seconds: 7, shadow: 0.28 });
});

document.querySelector("#timelapseVideoButton").addEventListener("click", () => {
  setBusy("timelapseVideo", "Preparando timelapse por camadas…");
  send("timelapseVid", {
    size: 720,
    seconds: 0,
    rotate: true,
    grid: document.querySelector("#gridToggle").checked,
  });
});

document.querySelector("#exportButton").addEventListener("click", () => {
  requestExport();
});

exportFormat.addEventListener("change", () => {
  const format = exportFormat.value || "schem";
  document.querySelector("#exportButton").setAttribute("aria-label", `Baixar construção em ${format}`);
});

document.querySelector("#fullscreenButton").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await viewerCard.requestFullscreen();
  } catch (error) {
    toast(`Não foi possível abrir a tela cheia: ${error.message}`, "error");
  }
});

document.addEventListener("click", (event) => {
  const closeTarget = event.target.closest("[data-close-modal]");
  if (closeTarget) closeModal();

  const downloadTarget = event.target.closest("[data-download-shot]");
  if (downloadTarget) {
    const index = Number(downloadTarget.dataset.downloadShot);
    const shot = latestShots[index];
    if (shot) downloadDataUrl(shot.url, `guizz-vista-${index + 1}.png`);
  }

  if (event.target.closest("#downloadShotsZip")) downloadShotsZip();
  if (event.target.closest("#downloadShotsCollage")) void downloadShotsCollage();

  const engineControl = event.target.closest("[data-engine-command]");
  if (engineControl) {
    const command = engineControl.dataset.engineCommand;
    if (command === "previous") send("rstep", { d: -1 });
    else if (command === "next") send("rstep", { d: 1 });
    else if (command === "orbit-left") send("orbit", { dx: -0.18, dy: 0 });
    else if (command === "orbit-right") send("orbit", { dx: 0.18, dy: 0 });
    else if (command === "orbit-up") send("orbit", { dx: 0, dy: -0.12 });
    else if (command === "orbit-down") send("orbit", { dx: 0, dy: 0.12 });
    else if (command === "materials") send("materials");
    else if (command === "timelapse") {
      closeModal();
      setBusy("timelapse", "Reproduzindo timelapse…");
      send("timelapse");
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

frame.addEventListener("load", () => {
  setState("Inicializando visualizador…", "busy");
});

window.setTimeout(() => {
  if (!viewerReady) {
    setState("O motor está demorando para responder", "error");
    toast("O visualizador ainda não respondeu. Verifique o console do navegador.", "error");
  }
}, 15000);

enableTools(false);

// O motor envia `ready` apenas uma vez. O iframe só recebe o endereço depois
// que toda a ponte postMessage acima já está registrada, evitando perder esse
// evento em servidores locais muito rápidos.
frame.src = frame.dataset.src;
