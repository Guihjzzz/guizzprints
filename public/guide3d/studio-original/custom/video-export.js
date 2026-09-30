(() => {
  if (window.__structureVideoRecorderInstalled) return
  window.__structureVideoRecorderInstalled = true

  const button = document.createElement('button')
  button.id = 'structure-video-recorder'
  button.type = 'button'
  button.textContent = '● Gravar vídeo'
  button.title = 'Grava o canvas 3D atual em WebM a 60 FPS'
  document.body.appendChild(button)

  let recorder = null
  let stream = null
  let chunks = []

  const preferredMime = () => [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ].find((type) => MediaRecorder.isTypeSupported(type)) || ''

  const finish = () => {
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
    recorder = null
    button.dataset.recording = 'false'
    button.textContent = '● Gravar vídeo'
  }

  button.addEventListener('click', () => {
    if (recorder?.state === 'recording') {
      recorder.stop()
      button.disabled = true
      return
    }
    const canvases = [...document.querySelectorAll('canvas')]
      .filter((canvas) => canvas.width > 0 && canvas.height > 0)
      .sort((a, b) => b.width * b.height - a.width * a.height)
    const canvas = canvases[0]
    if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder !== 'function') {
      alert('Abra um modelo 3D antes de iniciar a gravação.')
      return
    }
    chunks = []
    stream = canvas.captureStream(60)
    const mimeType = preferredMime()
    recorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 12_000_000 } : undefined)
    recorder.ondataavailable = ({ data }) => { if (data?.size) chunks.push(data) }
    recorder.onerror = () => { button.disabled = false; finish() }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder?.mimeType || 'video/webm' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bloxelizer-turntable-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2_000)
      button.disabled = false
      finish()
    }
    recorder.start(250)
    button.dataset.recording = 'true'
    button.textContent = '■ Parar e baixar'
  })
})()
