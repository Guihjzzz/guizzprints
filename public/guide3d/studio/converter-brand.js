(() => {
  const frame = document.querySelector("#nativeConverterFrame");
  if (!frame) return;

  function applyVisualSkin() {
    try {
      const doc = frame.contentDocument;
      if (!doc?.head || doc.querySelector('link[data-guizz-visual-skin]')) return;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = "/converter-brand.css?v=1";
      link.dataset.guizzVisualSkin = "active";
      doc.head.appendChild(link);
      doc.documentElement.dataset.guizzVisualSkin = "active";
    } catch (error) {
      console.warn("[Guizz Visual] Não foi possível aplicar o tema ao conversor", error);
    }
  }

  frame.addEventListener("load", applyVisualSkin);
  applyVisualSkin();
})();
