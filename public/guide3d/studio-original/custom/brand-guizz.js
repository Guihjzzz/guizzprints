(() => {
  if (window.__guizzBrandInstalled) return
  window.__guizzBrandInstalled = true

  const replaceBrand = value => String(value).replace(/\bBloxelizer\b/gi, 'Guizz')

  const updateAttributes = root => {
    root.querySelectorAll?.('[aria-label], [title], [alt], meta[content]').forEach(element => {
      for (const attribute of ['aria-label', 'title', 'alt', 'content']) {
        if (!element.hasAttribute(attribute)) continue
        const value = element.getAttribute(attribute)
        const next = replaceBrand(value)
        if (next !== value) element.setAttribute(attribute, next)
      }
    })

    root.querySelectorAll?.('a[aria-label*="Guizz" i]').forEach(link => {
      if (/home/i.test(link.getAttribute('aria-label') || '')) link.setAttribute('aria-label', 'Guizz home')
    })
  }

  const updateText = () => {
    if (!document.body) return
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const nodes = []
    let node
    while ((node = walker.nextNode())) {
      const parent = node.parentElement
      if (parent && /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/i.test(parent.tagName)) continue
      nodes.push(node)
    }
    nodes.forEach(textNode => {
      const next = replaceBrand(textNode.nodeValue)
      if (next !== textNode.nodeValue) textNode.nodeValue = next
    })
  }

  const apply = () => {
    document.title = replaceBrand(document.title)
    updateAttributes(document)
    updateText()
  }

  const style = document.createElement('style')
  style.textContent = `
    a[aria-label="Guizz home"] svg { display: none !important; }
    a[aria-label="Guizz home"] > div:first-of-type {
      width: 76px !important;
      min-width: 76px !important;
      height: 24px !important;
      display: flex !important;
      align-items: center !important;
    }
    a[aria-label="Guizz home"] > div:first-of-type::after {
      content: "Guizz";
      color: currentColor;
      display: block;
      font: 700 19px/24px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: -0.04em;
    }
  `
  document.head.append(style)

  const start = () => {
    apply()
    // React/Next pode hidratar o cabeçalho alguns instantes depois. Duas
    // reaplicações curtas cobrem essa hidratação sem manter um observer
    // permanente sobre milhares de nós do visualizador.
    window.setTimeout(apply, 500)
    window.setTimeout(apply, 1800)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
})()
