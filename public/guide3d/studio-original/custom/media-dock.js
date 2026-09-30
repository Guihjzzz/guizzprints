(() => {
  if (window.__guizzMediaDockInstalled) return

  const mount = () => {
    const imageButton = document.getElementById('structure-image-export')
    const videoButton = document.getElementById('structure-video-recorder')
    if (!imageButton || !videoButton) {
      window.setTimeout(mount, 250)
      return
    }

    window.__guizzMediaDockInstalled = true

    const style = document.createElement('style')
    style.textContent = `
      #guizz-media-dock {
        position: fixed;
        top: 68px;
        right: 16px;
        /* Header menus use z-index 20; keep this utility below them so a
           settings popover always stays clickable even if both are open. */
        z-index: 15;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        pointer-events: none;
        font: 600 13px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #guizz-media-toggle,
      #guizz-media-panel,
      #guizz-media-panel button {
        pointer-events: auto;
      }
      #guizz-media-toggle {
        border: 1px solid rgba(248, 113, 113, .5);
        border-radius: 10px;
        padding: 9px 13px;
        background: #18181b;
        color: #fafafa;
        box-shadow: 0 8px 22px rgba(0, 0, 0, .3);
        cursor: pointer;
      }
      #guizz-media-toggle:hover,
      #guizz-media-toggle[aria-expanded="true"] { background: #27272a; }
      #guizz-media-panel {
        display: none;
        width: min(240px, calc(100vw - 32px));
        box-sizing: border-box;
        padding: 10px;
        gap: 8px;
        border: 1px solid #3f3f46;
        border-radius: 12px;
        background: rgba(24, 24, 27, .97);
        box-shadow: 0 14px 36px rgba(0, 0, 0, .5);
      }
      #guizz-media-dock[data-open="true"] #guizz-media-panel { display: grid; }
      #guizz-media-panel::before {
        content: "Exportar e gravar";
        display: block;
        color: #a1a1aa;
        font-size: 11px;
        letter-spacing: .08em;
        text-transform: uppercase;
        padding: 2px 3px 4px;
      }
      #guizz-media-panel #structure-image-export,
      #guizz-media-panel #structure-video-recorder {
        position: static !important;
        inset: auto !important;
        z-index: auto !important;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        justify-content: center;
        box-shadow: none;
      }
      #guizz-media-panel #structure-image-export {
        background: #dc2626;
      }
      #guizz-media-panel #structure-video-recorder {
        background: #27272a;
        border: 1px solid #52525b;
      }
      #guizz-media-panel #structure-video-recorder:hover { background: #3f3f46; }
      @media (max-width: 640px) {
        #guizz-media-dock { top: 64px; right: 10px; }
      }
    `
    document.head.append(style)

    const dock = document.createElement('aside')
    dock.id = 'guizz-media-dock'
    dock.dataset.open = 'false'
    dock.setAttribute('aria-label', 'Ferramentas de mídia')

    const toggle = document.createElement('button')
    toggle.id = 'guizz-media-toggle'
    toggle.type = 'button'
    toggle.textContent = 'Mídia'
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-controls', 'guizz-media-panel')

    const panel = document.createElement('div')
    panel.id = 'guizz-media-panel'
    panel.setAttribute('role', 'group')
    panel.setAttribute('aria-label', 'Exportar e gravar')
    panel.append(imageButton, videoButton)
    dock.append(toggle, panel)
    document.body.append(dock)

    const setOpen = open => {
      dock.dataset.open = String(open)
      toggle.setAttribute('aria-expanded', String(open))
      toggle.textContent = open ? 'Fechar mídia' : 'Mídia'
    }

    const openMedia = tab => {
      // A central Guizz usa esta ponte somente para revelar o painel já
      // existente. A geração de PNG/WebM continua inteiramente no motor
      // original, pelos mesmos botões e funções nativas.
      const modal = document.getElementById('media-studio')
      if (!modal) {
        window.setTimeout(() => openMedia(tab), 120)
        return
      }
      if (!modal.open) imageButton.click()
      const selectPanel = () => {
        if (tab === 'video') document.getElementById('tab-video')?.click()
        else document.getElementById('tab-image')?.click()
      }
      requestAnimationFrame(() => requestAnimationFrame(selectPanel))
      setOpen(false)
    }

    toggle.addEventListener('click', () => setOpen(dock.dataset.open !== 'true'))
    document.addEventListener('pointerdown', event => {
      if (!dock.contains(event.target)) setOpen(false)
    })
    imageButton.addEventListener('click', () => setOpen(false), { capture: true })
    window.addEventListener('message', event => {
      const trustedLocalOrigin = /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(event.origin || '')
      if (!trustedLocalOrigin || event.data?.type !== 'guizz:open-media') return
      openMedia(event.data.tab === 'video' ? 'video' : 'image')
    })
    window.__guizzMediaDockReady = true
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true })
  else mount()
})()
