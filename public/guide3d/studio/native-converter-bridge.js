import { convertFileToSchem } from "./converter/formatBridge.js";
const SUPPORTED_INPUT = /\.(?:mcstructure|litematic|schem|schematic|nbt|bp|mcstructurezip|zip)$/i;

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function waitFor(read, timeout, description) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeout) {
    try {
      const value = read();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await delay(120);
  }
  throw new Error(`${description} não respondeu${lastError ? `: ${lastError.message}` : "."}`);
}

function setNativeValue(element, value) {
  const descriptor = Object.getOwnPropertyDescriptor(element.ownerDocument.defaultView.HTMLSelectElement.prototype, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new element.ownerDocument.defaultView.Event("input", { bubbles: true }));
  element.dispatchEvent(new element.ownerDocument.defaultView.Event("change", { bubbles: true }));
}

function installDownloadCapture(converterWindow) {
  let resolveDownload;
  let rejectDownload;
  let active = false;
  const result = new Promise((resolve, reject) => {
    resolveDownload = resolve;
    rejectDownload = reject;
  });

  const urls = new Map();
  const originalCreateObjectURL = converterWindow.URL.createObjectURL.bind(converterWindow.URL);
  converterWindow.URL.createObjectURL = (object) => {
    const url = originalCreateObjectURL(object);
    if (object instanceof converterWindow.Blob) urls.set(url, object);
    return url;
  };

  let captured = false;
  async function capture(anchor) {
    if (!active || captured) return false;
    const name = String(anchor?.download || "");
    const href = String(anchor?.href || "");
    if (!/\.schem$/i.test(name) && !href.startsWith("blob:")) return false;
    captured = true;
    try {
      const blob = urls.get(href) || await converterWindow.fetch(href).then((response) => response.blob());
      if (!blob?.size) throw new Error("O conversor gerou um arquivo vazio.");
      resolveDownload({ blob, name: name || "conversao.schem" });
    } catch (error) {
      rejectDownload(error);
    }
    return true;
  }

  const anchorPrototype = converterWindow.HTMLAnchorElement.prototype;
  const originalClick = anchorPrototype.click;
  anchorPrototype.click = function guizzCapturedDownload() {
    if (active && (/\.schem$/i.test(String(this.download || "")) || String(this.href || "").startsWith("blob:"))) {
      void capture(this);
      return;
    }
    return originalClick.call(this);
  };
  converterWindow.document.addEventListener("click", (event) => {
    const anchor = event.target?.closest?.("a[download]");
    if (!anchor || !active) return;
    if (/\.schem$/i.test(String(anchor.download || "")) || String(anchor.href || "").startsWith("blob:")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      void capture(anchor);
    }
  }, true);

  return {
    start() { active = true; },
    result,
  };
}

function createConverterFrame() {
  const frame = document.createElement("iframe");
  frame.className = "native-converter-bridge-frame";
  frame.title = "Conversor nativo em execução";
  frame.setAttribute("aria-hidden", "true");
  frame.src = NATIVE_CONVERTER_URL;
  document.body.appendChild(frame);
  return frame;
}

function waitForFrame(frame) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("O conversor nativo demorou demais para iniciar.")), 120000);
    frame.addEventListener("load", () => {
      window.clearTimeout(timer);
      resolve(frame.contentWindow);
    }, { once: true });
    frame.addEventListener("error", () => {
      window.clearTimeout(timer);
      reject(new Error("Não foi possível carregar o conversor nativo."));
    }, { once: true });
  });
}

export function supportsNativeConversion(file) {
  return Boolean(file?.name && SUPPORTED_INPUT.test(file.name));
}

export async function convertWithNativeEngine(file, onProgress = () => {}) {
  if (!supportsNativeConversion(file)) throw new Error(`Formato não suportado: ${file?.name || "arquivo sem nome"}`);
  onProgress("Lendo o arquivo com o conversor original…");
  const result = await convertFileToSchem(file);
  const baseName = file.name.replace(/\.[^.]+$/u, "") || "conversao";
  onProgress("Conversão para Sponge .schem concluída.");
  return new File([result.bytes], `${baseName}.schem`, { type: "application/octet-stream" });
}
