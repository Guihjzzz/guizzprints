const NATIVE_CONVERTER_URL = "/converter?guizz_bridge=1";
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
  const frame = createConverterFrame();
  try {
    onProgress("Iniciando o conversor nativo…");
    const converterWindow = await waitForFrame(frame);
    const converterDocument = converterWindow.document;
    const capture = installDownloadCapture(converterWindow);

    onProgress("Carregando os recursos originais…");
    const fileInput = await waitFor(
      () => [...converterDocument.querySelectorAll('input[type="file"]')]
        .find((input) => input.multiple && !String(input.accept || "").includes(".jar")),
      120000,
      "O campo de importação do conversor"
    );

    const nativeFile = new converterWindow.File([await file.arrayBuffer()], file.name, {
      type: file.type || "application/octet-stream",
      lastModified: file.lastModified || Date.now(),
    });
    const transfer = new converterWindow.DataTransfer();
    transfer.items.add(nativeFile);
    fileInput.files = transfer.files;
    fileInput.dispatchEvent(new converterWindow.Event("input", { bubbles: true }));
    fileInput.dispatchEvent(new converterWindow.Event("change", { bubbles: true }));
    onProgress(`Identificando ${file.name}…`);

    const formatSelect = await waitFor(
      () => converterDocument.querySelector("#export-format"),
      180000,
      "A leitura nativa do arquivo"
    );
    onProgress("Convertendo para Sponge .schem…");
    setNativeValue(formatSelect, "schem");
    await waitFor(() => formatSelect.value === "schem", 10000, "A seleção do formato .schem");

    const exportButton = await waitFor(
      () => [...converterDocument.querySelectorAll("button")]
        .find((button) => button.textContent.trim() === "Export" && !button.disabled),
      30000,
      "O botão de exportação nativo"
    );
    capture.start();
    exportButton.click();

    const converted = await Promise.race([
      capture.result,
      delay(180000).then(() => { throw new Error("A exportação nativa não terminou dentro do limite de tempo."); }),
    ]);
    const baseName = file.name.replace(/\.[^.]+$/u, "") || "conversao";
    return new File([converted.blob], `${baseName}.schem`, { type: "application/octet-stream" });
  } finally {
    frame.remove();
  }
}
