const DEFAULT_ORIGINAL_CONVERTER_PATH = '/guide3d/original-converter';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

function converterBaseUrl() {
  return new URL(DEFAULT_ORIGINAL_CONVERTER_PATH, location.origin).toString().replace(/\/$/, '');
}

function converterFrame(baseUrl) {
  const frame = document.createElement('iframe');
  frame.title = 'Conversor original Guizzprints';
  frame.setAttribute('aria-hidden', 'true');
  frame.allow = '';
  frame.tabIndex = -1;
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;opacity:0;pointer-events:none';
  frame.src = `${baseUrl}/bridge.html`;
  document.body.appendChild(frame);
  return frame;
}

function ownOriginIsSupported() {
  return location.protocol === 'https:'
    || (location.protocol === 'http:' && LOCAL_HOSTS.has(location.hostname));
}

/**
 * Runs the untouched native converter inside its own HTTPS origin. The
 * converter receives only the selected local file and sends the `.schem`
 * bytes back through a strict postMessage handshake; nothing is uploaded.
 */
export async function convertWithOriginalEngine(file, onProgress = () => {}) {
  if (!file?.size) throw new Error('O arquivo de origem está vazio.');
  if (!ownOriginIsSupported()) throw new Error('Abra o Guizzprints em HTTPS ou em localhost para usar o conversor original.');

  if (/\.schem$/i.test(file.name)) return file;

  const baseUrl = converterBaseUrl();
  const origin = new URL(baseUrl).origin;
  const frame = converterFrame(baseUrl);
  const requestId = `guizz-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const timeoutMs = 5 * 60 * 1000;

  try {
    return await new Promise((resolve, reject) => {
      let ready = false;
      let sent = false;
      let pingTimer = 0;
      const timeout = window.setTimeout(() => finish(new Error('O conversor original demorou demais para responder.')), timeoutMs);
      const finish = (error, converted) => {
        window.clearTimeout(timeout);
        window.clearInterval(pingTimer);
        window.removeEventListener('message', receive);
        frame.remove();
        if (error) reject(error);
        else resolve(converted);
      };
      const send = async () => {
        if (sent || !ready) return;
        sent = true;
        try {
          onProgress('Enviando o arquivo ao conversor original…');
          const buffer = await file.arrayBuffer();
          frame.contentWindow?.postMessage({
            guizzOriginalConverter: 1,
            type: 'convert',
            requestId,
            name: file.name,
            buffer,
          }, origin, [buffer]);
        } catch (error) {
          finish(error instanceof Error ? error : new Error(String(error)));
        }
      };
      const receive = (event) => {
        if (event.origin !== origin || event.source !== frame.contentWindow) return;
        const data = event.data;
        if (!data || data.guizzOriginalConverter !== 1) return;
        if (data.type === 'ready') {
          ready = true;
          onProgress('Conversor original pronto…');
          void send();
          return;
        }
        if (data.requestId !== requestId) return;
        if (data.type === 'status' && data.message) {
          onProgress(String(data.message));
          return;
        }
        if (data.type === 'error') {
          finish(new Error(String(data.message || 'O conversor original não conseguiu processar o arquivo.')));
          return;
        }
        if (data.type === 'converted' && data.buffer instanceof ArrayBuffer) {
          finish(null, new File([data.buffer], String(data.name || `${file.name.replace(/\.[^.]+$/u, '')}.schem`), {
            type: String(data.mime || 'application/octet-stream'),
          }));
        }
      };
      window.addEventListener('message', receive);
      const ping = () => frame.contentWindow?.postMessage({ guizzOriginalConverter: 1, type: 'hello' }, origin);
      frame.addEventListener('load', ping, { once: true });
      pingTimer = window.setInterval(() => { if (!ready) ping(); }, 1200);
      frame.addEventListener('error', () => finish(new Error('Não foi possível iniciar o conversor original.')), { once: true });
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
