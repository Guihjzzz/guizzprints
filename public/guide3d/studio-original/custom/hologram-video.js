(() => {
  if (window.__guizzHologramVideoInstalled) return
  window.__guizzHologramVideoInstalled = true

  const waitForButton = (attempt = 0) => {
    const button = document.getElementById('hologram-video')
    if (!button) {
      if (attempt < 120) setTimeout(() => waitForButton(attempt + 1), 250)
      return
    }
    install(button)
  }

  const install = (button) => {
    if (button.dataset.guizzHologramBound) return
    button.dataset.guizzHologramBound = 'true'

    const getStatus = () => document.getElementById('hologram-status')
    const getDialog = () => document.getElementById('media-studio')
    const safeName = (value) => (value || 'www.guizz.xyz').replace(/[<>:"/\\|?*]/g, '-').trim() || 'www.guizz.xyz'
    let recorder = null
    let animationFrame = 0
    let running = false
    let cancelRequested = false

    const chooseSourceCanvas = () => {
      const candidates = [...document.querySelectorAll('canvas')]
        .filter((canvas) => !canvas.dataset.guizzHologramOutput && canvas.width > 0 && canvas.height > 0)
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      return candidates[0] || null
    }

    const updateStatus = (message) => {
      const status = getStatus()
      if (status) status.textContent = message
    }

    const preferredMimeType = () => {
      const types = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ]
      return types.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || ''
    }

    const drawLiveFrame = (ctx, source, width, height) => {
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.filter = 'none'
      ctx.fillStyle = '#f2f5f7'
      ctx.fillRect(0, 0, width, height)
      // The viewer itself owns the grid, camera, lighting and actual block visibility.
      // Copying it without a screen-space mask preserves real Minecraft Y layers.
      ctx.drawImage(source, 0, 0, width, height)
      ctx.restore()
    }

    const isVisible = (element) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
    }

    const findLayerControls = () => {
      const sliders = [...document.querySelectorAll('[role="slider"][aria-valuemin][aria-valuemax]')]
        .filter((element) => /last visible y layer|última camada(?: y)? visível/i.test(element.getAttribute('aria-label') || ''))
        .filter(isVisible)
      const slider = sliders[0]
      const increase = [...document.querySelectorAll('button[aria-label="Increase layer"]')].find(isVisible)
      const decrease = [...document.querySelectorAll('button[aria-label="Decrease layer"]')].find(isVisible)
      if (!slider || !increase || !decrease) return null
      const min = Number(slider.getAttribute('aria-valuemin'))
      const max = Number(slider.getAttribute('aria-valuemax'))
      if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) return null
      return {
        slider,
        sliderId: slider.id,
        increase,
        decrease,
        min,
        max,
        total: max - min + 1,
        read: () => Number((document.getElementById(slider.id) || slider).getAttribute('aria-valuenow')),
      }
    }

    const findGridControl = () => document.querySelector('button[aria-label="Show / hide grid"]')

    const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const pause = async (milliseconds) => {
      const end = performance.now() + milliseconds
      while (!cancelRequested && performance.now() < end) {
        await new Promise((resolve) => setTimeout(resolve, Math.min(50, Math.max(1, end - performance.now()))))
      }
    }

    const invokeLayerControl = (control) => {
      // React stores the current event handlers on the DOM node. Calling that
      // handler directly avoids browsers ignoring an untrusted .click() event.
      const propsKey = Object.keys(control).find((key) => key.startsWith('__reactProps$'))
      const reactHandler = propsKey ? control[propsKey]?.onClick : null
      if (typeof reactHandler === 'function') {
        reactHandler({
          type: 'click',
          target: control,
          currentTarget: control,
          nativeEvent: null,
          defaultPrevented: false,
          preventDefault() { this.defaultPrevented = true },
          stopPropagation() {},
          persist() {},
        })
        return 'react'
      }
      control.click()
      return 'dom'
    }

    const stepLayer = async (controls, direction) => {
      const before = controls.read()
      const label = direction > 0 ? 'Increase layer' : 'Decrease layer'
      const control = [...document.querySelectorAll(`button[aria-label="${label}"]`)].find(isVisible)
        || (direction > 0 ? controls.increase : controls.decrease)
      if (!control) return before
      const method = invokeLayerControl(control)
      for (let attempt = 0; attempt < 8; attempt += 1) {
        await nextPaint()
        const current = controls.read()
        if (Number.isFinite(current) && current !== before) return current
      }
      console.warn('[Time-lapse por camadas] Controle não alterou a camada.', { direction, before, method })
      return controls.read()
    }

    const setLayer = async (controls, target) => {
      const safeTarget = Math.min(controls.max, Math.max(controls.min, target))
      let current = controls.read()
      const maxAttempts = controls.total + 3
      for (let attempt = 0; attempt < maxAttempts && current !== safeTarget; attempt += 1) {
        if (cancelRequested) break
        const next = await stepLayer(controls, safeTarget > current ? 1 : -1)
        if (!Number.isFinite(next) || next === current) break
        current = next
      }
      return current
    }

    const createProgressHud = (total) => {
      document.getElementById('guizz-layer-video-progress')?.remove()
      const hud = document.createElement('aside')
      hud.id = 'guizz-layer-video-progress'
      hud.style.cssText = 'position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:30;width:min(430px,calc(100vw - 32px));padding:12px 14px;border:1px solid #22d3ee;border-radius:12px;background:rgba(9,9,11,.94);color:#fafafa;font:13px system-ui;box-shadow:0 12px 40px #0009;pointer-events:auto'
      hud.innerHTML = `<strong style="display:block;margin-bottom:7px">Gravando time-lapse por camadas</strong><div data-message>Preparando ${total} camadas…</div><progress data-progress value="0" max="100" style="display:block;width:100%;margin:9px 0;accent-color:#06b6d4"></progress><button type="button" style="background:#dc2626;color:white;border:0;border-radius:7px;padding:8px 12px;cursor:pointer">Cancelar</button>`
      hud.querySelector('button').onclick = () => {
        cancelRequested = true
        hud.querySelector('[data-message]').textContent = 'Cancelando e restaurando as camadas…'
        stopRecording()
      }
      document.body.appendChild(hud)
      return {
        element: hud,
        update(message, percent) {
          hud.querySelector('[data-message]').textContent = message
          hud.querySelector('[data-progress]').value = Math.min(100, Math.max(0, percent))
        },
      }
    }

    const download = (blob) => {
      const nameInput = document.getElementById('media-name')
      const name = safeName(nameInput?.value)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${name}-timelapse-isometrico.webm`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    }

    const stopRecording = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = 0
      if (recorder && recorder.state !== 'inactive') recorder.stop()
    }

    const start = async () => {
      if (running) {
        cancelRequested = true
        updateStatus('Encerrando o time-lapse…')
        stopRecording()
        return
      }
      if (!window.MediaRecorder) {
        updateStatus('Este navegador não oferece gravação WebM.')
        return
      }

      const source = chooseSourceCanvas()
      if (!source) {
        updateStatus('Abra uma estrutura em 3D antes de gerar o time-lapse.')
        return
      }

      const layerControls = findLayerControls()
      if (!layerControls) {
        updateStatus('Abra a visualização 3D no eixo Y para o site identificar as camadas reais.')
        return
      }
      const showGridInVideo = document.getElementById('hologram-grid')?.checked !== false

      const mimeType = preferredMimeType()
      if (!mimeType) {
        updateStatus('O navegador não encontrou um formato WebM compatível.')
        return
      }

      const maxSize = 1280
      const scale = Math.min(1, maxSize / Math.max(source.width, source.height))
      const width = Math.max(2, Math.floor(source.width * scale / 2) * 2)
      const height = Math.max(2, Math.floor(source.height * scale / 2) * 2)
      const output = document.createElement('canvas')
      output.dataset.guizzHologramOutput = 'true'
      output.width = width
      output.height = height
      output.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:2px;height:2px;pointer-events:none;opacity:0'
      document.body.appendChild(output)
      const context = output.getContext('2d', { alpha: false, desynchronized: true }) || output.getContext('2d')
      if (!context) {
        output.remove()
        updateStatus('Não foi possível preparar a composição do vídeo.')
        return
      }

      const fps = 30
      const stream = output.captureStream?.(fps)
      if (!stream) {
        output.remove()
        updateStatus('Este navegador não permite capturar o vídeo holográfico.')
        return
      }

      const originalLayer = layerControls.read()
      running = true
      cancelRequested = false
      button.textContent = 'Parar e baixar time-lapse'
      button.disabled = false
      getDialog()?.close()
      const hud = createProgressHud(layerControls.total)
      const chunks = []
      let recordingFailed = false
      let failureMessage = ''
      let gridToggled = false
      try {
        hud.update(`Preparando ${layerControls.total} camadas reais…`, 0)
        if (!showGridInVideo) {
          const gridControl = findGridControl()
          if (!gridControl) throw Error('O controle da grade não foi encontrado.')
          invokeLayerControl(gridControl)
          gridToggled = true
          await nextPaint()
          hud.update(`Grade desativada · preparando ${layerControls.total} camadas…`, 0)
        }
        const firstLayer = await setLayer(layerControls, layerControls.min)
        if (firstLayer !== layerControls.min) throw Error('O visualizador não conseguiu selecionar a primeira camada.')

        recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 })
        const stopped = new Promise((resolve) => {
          recorder.onstop = resolve
        })
        recorder.ondataavailable = (event) => { if (event.data?.size) chunks.push(event.data) }
        recorder.onerror = (event) => {
          recordingFailed = true
          cancelRequested = true
          console.error('[Time-lapse isométrico]', event.error || event)
          stopRecording()
        }

        const render = () => {
          if (!recorder || recorder.state === 'inactive') return
          drawLiveFrame(context, source, width, height)
          animationFrame = requestAnimationFrame(render)
        }
        drawLiveFrame(context, source, width, height)
        recorder.start(200)
        animationFrame = requestAnimationFrame(render)

        const steps = Math.max(1, layerControls.total - 1)
        const millisecondsPerLayer = Math.min(420, Math.max(70, Math.round(8000 / steps)))
        await pause(450)

        for (let target = layerControls.min + 1; target <= layerControls.max && !cancelRequested; target += 1) {
          const current = await stepLayer(layerControls, 1)
          if (current < target) throw Error(`Falha ao subir para a camada ${target}.`)
          const completed = target - layerControls.min
          const percent = (completed / steps) * 45
          hud.update(`Subindo: camada ${completed + 1} de ${layerControls.total}`, percent)
          updateStatus(`Subindo camada ${completed + 1}/${layerControls.total}`)
          await pause(millisecondsPerLayer)
        }

        if (!cancelRequested) {
          hud.update(`Estrutura completa: ${layerControls.total} camadas`, 50)
          await pause(2200)
        }

        for (let target = layerControls.max - 1; target >= layerControls.min && !cancelRequested; target -= 1) {
          const current = await stepLayer(layerControls, -1)
          if (current > target) throw Error(`Falha ao descer para a camada ${target}.`)
          const removed = layerControls.max - target
          const percent = 50 + (removed / steps) * 50
          hud.update(`Descendo: camada ${current - layerControls.min + 1} de ${layerControls.total}`, percent)
          updateStatus(`Descendo camada ${current - layerControls.min + 1}/${layerControls.total}`)
          await pause(millisecondsPerLayer)
        }

        if (!cancelRequested) await pause(450)
        stopRecording()
        await stopped
      } catch (error) {
        recordingFailed = true
        cancelRequested = true
        failureMessage = error?.message || String(error)
        window.__guizzLayerVideoLastError = {
          message: failureMessage,
          stack: error?.stack || '',
          layer: layerControls.read(),
          min: layerControls.min,
          max: layerControls.max,
          time: new Date().toISOString(),
        }
        console.error('[Time-lapse por camadas]', error)
        updateStatus(failureMessage)
        stopRecording()
      } finally {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        animationFrame = 0
        output.remove()
        stream.getTracks().forEach((track) => track.stop())
        const cancelled = cancelRequested
        cancelRequested = false
        await setLayer(layerControls, originalLayer).catch((error) => console.error('[Restaurar camada]', error))
        if (gridToggled) {
          const gridControl = findGridControl()
          if (gridControl) {
            invokeLayerControl(gridControl)
            await nextPaint()
          }
        }
        cancelRequested = cancelled
        running = false
        button.textContent = 'Gerar time-lapse por camadas'
        recorder = null
        if (!cancelled && !recordingFailed && chunks.length) {
          download(new Blob(chunks, { type: mimeType }))
          updateStatus(`Time-lapse concluído com ${layerControls.total} camadas. Download iniciado.`)
          hud.update(`Pronto: ${layerControls.total} camadas gravadas`, 100)
        } else {
          updateStatus(recordingFailed ? failureMessage : 'Geração do time-lapse cancelada.')
          hud.update(recordingFailed ? `Erro: ${failureMessage}` : 'Gravação cancelada.', 0)
        }
        setTimeout(() => hud.element.remove(), 2200)
      }
    }

    button.addEventListener('click', start)
  }

  waitForButton()
})()
