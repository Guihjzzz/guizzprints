import { brandBedrockArchive, brandedDownloadName } from './addon-brand-core.mjs'

(() => {
  if (window.__guizzAddonBrandingInstalled) return
  window.__guizzAddonBrandingInstalled = true

  const nativeCreateObjectURL = URL.createObjectURL.bind(URL)
  const nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL)
  const nativeAnchorClick = HTMLAnchorElement.prototype.click
  const blobsByUrl = new Map()
  const busyAnchors = new WeakSet()
  let assetsPromise = null

  const toast = (() => {
    let element = null
    let timer = null
    return (message, state = 'working') => {
      if (!document.body) return
      if (!element) {
        element = document.createElement('div')
        element.id = 'guizz-addon-branding-toast'
        element.setAttribute('role', 'status')
        element.style.cssText = [
          'position:fixed', 'right:18px', 'bottom:18px', 'z-index:2147483647',
          'max-width:min(360px,calc(100vw - 36px))', 'padding:12px 14px',
          'border:1px solid rgba(255,255,255,.16)', 'border-radius:12px',
          'background:#17191f', 'color:#f5f7fb', 'font:600 13px/1.35 system-ui,sans-serif',
          'box-shadow:0 14px 40px rgba(0,0,0,.35)', 'transition:opacity .18s ease',
        ].join(';')
        document.body.append(element)
      }
      element.textContent = message
      element.style.borderColor = state === 'error' ? 'rgba(239,68,68,.9)' : state === 'success' ? 'rgba(34,197,94,.85)' : 'rgba(59,130,246,.85)'
      element.style.opacity = '1'
      clearTimeout(timer)
      if (state !== 'working') timer = window.setTimeout(() => { if (element) element.style.opacity = '0' }, 3500)
    }
  })()

  URL.createObjectURL = object => {
    const url = nativeCreateObjectURL(object)
    if (object instanceof Blob) {
      blobsByUrl.set(url, object)
      // Avoid retaining screenshots or videos created during a long session.
      window.setTimeout(() => blobsByUrl.delete(url), 5 * 60 * 1000)
    }
    return url
  }

  URL.revokeObjectURL = url => {
    // The exporter may revoke the source URL immediately after calling click().
    // The blob has already been captured, so keep it long enough to finish the
    // branding job while still revoking the browser URL on schedule.
    window.setTimeout(() => blobsByUrl.delete(url), 60 * 1000)
    return nativeRevokeObjectURL(url)
  }

  const fetchBytes = async path => {
    const response = await fetch(path, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Não foi possível carregar ${path}.`)
    return new Uint8Array(await response.arrayBuffer())
  }

  const loadAssets = () => {
    if (!assetsPromise) {
      assetsPromise = Promise.all([
        fetchBytes('/custom/guizz-pack-icon-blue.png'),
        fetchBytes('/custom/guizz-minecraft-title.png'),
      ]).then(([packIcon, minecraftTitle]) => ({ packIcon, minecraftTitle }))
    }
    return assetsPromise
  }

  const downloadExtension = name => /\.(?:mcaddon|mcpack)$/i.test(String(name || ''))

  const isBrandableAnchor = anchor => {
    if (!(anchor instanceof HTMLAnchorElement)) return false
    if (anchor.dataset.guizzBrandReady === '1') return false
    if (!downloadExtension(anchor.download)) return false
    return blobsByUrl.has(anchor.href)
  }

  const triggerBrandedDownload = async anchor => {
    if (busyAnchors.has(anchor)) return
    const source = blobsByUrl.get(anchor.href)
    if (!source) {
      nativeAnchorClick.call(anchor)
      return
    }

    busyAnchors.add(anchor)
    const originalName = anchor.download
    try {
      toast('Preparando o add-on Guizz…')
      const [assets, input] = await Promise.all([
        loadAssets(),
        source.arrayBuffer(),
      ])
      const output = await brandBedrockArchive(new Uint8Array(input), assets)
      const blob = new Blob([output.bytes], { type: 'application/octet-stream' })
      const outputUrl = nativeCreateObjectURL(blob)
      const relay = document.createElement('a')
      relay.href = outputUrl
      relay.download = brandedDownloadName(originalName)
      relay.dataset.guizzBrandReady = '1'
      relay.style.display = 'none'
      document.body.append(relay)
      nativeAnchorClick.call(relay)
      window.setTimeout(() => {
        relay.remove()
        nativeRevokeObjectURL(outputUrl)
      }, 30_000)
      toast(`Add-on pronto: ${output.packs} pack(s) Guizz atualizado(s).`, 'success')
    } catch (error) {
      console.error('[Guizz add-on branding]', error)
      toast('Não foi possível aplicar a identidade Guizz; o arquivo original será baixado.', 'error')
      anchor.dataset.guizzBrandReady = '1'
      nativeAnchorClick.call(anchor)
    } finally {
      busyAnchors.delete(anchor)
    }
  }

  // The original app creates a temporary <a download> and invokes .click().
  // Intercept only Bedrock pack downloads; all other exports keep their native
  // behavior and code path.
  HTMLAnchorElement.prototype.click = function (...args) {
    if (isBrandableAnchor(this)) {
      void triggerBrandedDownload(this)
      return undefined
    }
    return nativeAnchorClick.apply(this, args)
  }

  // Covers a direct user click if a future exporter renders a normal link.
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target.closest('a') : null
    if (!isBrandableAnchor(target)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    void triggerBrandedDownload(target)
  }, true)
})()
