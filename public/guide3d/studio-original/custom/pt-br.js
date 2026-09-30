(() => {
  if (window.__bloxelizerPtBrInstalled) return
  window.__bloxelizerPtBrInstalled = true

  // O espelho antigo registrava um Service Worker que mantinha chunks JavaScript
  // corrompidos em cache. Remova-o antes da próxima navegação para usar os
  // arquivos restaurados do site original.
  if (navigator.serviceWorker?.getRegistrations) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    }).catch(() => {})
  }
  if (window.caches?.keys) {
    window.caches.keys().then((keys) => keys.forEach((key) => window.caches.delete(key))).catch(() => {})
  }

  document.documentElement.lang = 'pt-BR'

  const translations = new Map(Object.entries({
    'Drop your schematics anywhere': 'Solte suas estruturas em qualquer lugar',
    'Preview them in 3D, follow them layer by layer, or convert to another format. Bring in several and they land in one scene. Everything runs on your machine, nothing is uploaded.': 'Visualize em 3D, acompanhe camada por camada ou converta para outro formato. Adicione vários arquivos à mesma cena. Tudo funciona no seu computador e nada é enviado.',
    'Choose a file': 'Escolher arquivo',
    'Choose files': 'Escolher arquivos',
    'Paste a URL': 'Colar URL',
    'Run a generator': 'Abrir gerador',
    'Nothing leaves your browser': 'Nada sai do seu navegador',
    'Files': 'Arquivos',
    'File': 'Arquivo',
    'Viewer': 'Visualizador',
    'Materials': 'Materiais',
    'Export': 'Exportar',
    'Import': 'Importar',
    'Open': 'Abrir',
    'Browse': 'Procurar',
    'Add files': 'Adicionar arquivos',
    'Add file': 'Adicionar arquivo',
    'Clear scene': 'Limpar cena',
    'Remove': 'Remover',
    'Rename': 'Renomear',
    'Close': 'Fechar',
    'Cancel': 'Cancelar',
    'Apply': 'Aplicar',
    'Chunked export': 'Exportação em partes',
    'Split the build into multiple files.': 'Divida a construção em vários arquivos.',
    'Single file': 'Arquivo único',
    'Small': 'Pequeno',
    'Medium': 'Médio',
    'Large': 'Grande',
    'Each file will cover up to': 'Cada arquivo terá até',
    'Toggle chunked export': 'Alternar exportação em partes',
    'Save': 'Salvar',
    'Copy': 'Copiar',
    'Copied': 'Copiado',
    'Download': 'Baixar',
    'Download MP4': 'Baixar MP4',
    'Download all': 'Baixar tudo',
    'Convert': 'Converter',
    'Convert files': 'Converter arquivos',
    'Converter': 'Conversor',
    'Output format': 'Formato de saída',
    'Input format': 'Formato de entrada',
    'Select output format': 'Selecione o formato de saída',
    'Drop files here': 'Solte os arquivos aqui',
    'Drop a file here': 'Solte um arquivo aqui',
    'Drop a file or click to browse': 'Solte um arquivo ou clique para procurar',
    'Schematics, 3D models & images': 'Estruturas, modelos 3D e imagens',
    'ACCEPTED FORMATS': 'FORMATOS ACEITOS',
    'PROPERTIES': 'PROPRIEDADES',
    'Import files': 'Importar arquivos',
    'Import mod .jars': 'Importar mods .jar',
    'JAVA MC VERSION': 'VERSÃO DO MINECRAFT JAVA',
    'FILE NAME': 'NOME DO ARQUIVO',
    'CHUNK SIZE': 'TAMANHO DOS LOTES',
    'Drag & drop files': 'Arraste e solte arquivos',
    'No files loaded': 'Nenhum arquivo carregado',
    'No file selected': 'Nenhum arquivo selecionado',
    'Loading': 'Carregando',
    'Loading...': 'Carregando...',
    'Loading file...': 'Carregando arquivo...',
    'Processing...': 'Processando...',
    'Converting...': 'Convertendo...',
    'Conversion complete': 'Conversão concluída',
    'Conversion failed': 'Falha na conversão',
    'Unsupported file format': 'Formato de arquivo não compatível',
    'Settings': 'Configurações',
    'Viewer settings': 'Configurações do visualizador',
    'General': 'Geral',
    'Appearance': 'Aparência',
    'Language': 'Idioma',
    'About': 'Sobre',
    'Help': 'Ajuda',
    'Help & shortcuts': 'Ajuda e atalhos',
    'Keyboard shortcuts': 'Atalhos do teclado',
    'Rendering': 'Renderização',
    'Optimized rendering': 'Renderização otimizada',
    'Faster on large scenes': 'Mais rápida em cenas grandes',
    'High quality rendering': 'Renderização de alta qualidade',
    'Dark mode': 'Modo escuro',
    'Light mode': 'Modo claro',
    'Scene': 'Cena',
    'Build it!': 'Construir!',
    'Layers': 'Camadas',
    'Layer': 'Camada',
    'Show all': 'Mostrar tudo',
    'Hide all': 'Ocultar tudo',
    'Previous layer': 'Camada anterior',
    'Next layer': 'Próxima camada',
    'Reset camera': 'Redefinir câmera',
    'Reset view': 'Redefinir visualização',
    'Perspective': 'Perspectiva',
    'Orthographic': 'Ortográfica',
    'Wireframe': 'Estrutura de arame',
    'Textures': 'Texturas',
    'Lighting': 'Iluminação',
    'Shadows': 'Sombras',
    'Ambient occlusion': 'Oclusão ambiente',
    'Play': 'Reproduzir',
    'Pause': 'Pausar',
    'Stop': 'Parar',
    'Speed': 'Velocidade',
    'Selected': 'Selecionado',
    'Visible': 'Visível',
    'Hidden': 'Oculto',
    'Search': 'Pesquisar',
    'Search blocks': 'Pesquisar blocos',
    'Name': 'Nome',
    'Format': 'Formato',
    'Size': 'Tamanho',
    'Dimensions': 'Dimensões',
    'Blocks': 'Blocos',
    'Block count': 'Quantidade de blocos',
    'Actions': 'Ações',
    'Generate': 'Gerar',
    'Back': 'Voltar',
    'Next': 'Avançar',
    'Done': 'Concluído',
    'Export build tutorial': 'Exportar vídeo da construção',
    'Ready': 'Pronto',
    'Recording…': 'Gravando…',
    'Finalizing video…': 'Finalizando vídeo…',
    'Cancelled': 'Cancelado',
    'Error': 'Erro',
    'Elapsed 0s': 'Decorrido 0s',
    'Elapsed': 'Decorrido',
    'ETA': 'Tempo restante',
    'Preparing…': 'Preparando…',
    'Step back': 'Voltar um passo',
    'Step forward': 'Avançar um passo',
    'Spectator mode': 'Modo espectador',
    'Skip intro': 'Pular introdução',
    'Select all': 'Selecionar tudo',
    'Deselect all': 'Desmarcar tudo',
    'Zoom in': 'Aproximar',
    'Zoom out': 'Afastar',
    'Fit to view': 'Ajustar à tela',
    'Fullscreen': 'Tela cheia',
    'Exit fullscreen': 'Sair da tela cheia',
    'Bloxelizer home': 'Página inicial do Bloxelizer',
    'Generate blocks with a Scriptelizer generator': 'Gerar blocos com um gerador Scriptelizer',
    'Home': 'Início',
    'Sign in': 'Entrar',
    'Toggle theme': 'Alternar tema',
    'Schematics': 'Estruturas',
    'Scripts': 'Geradores',
    'Tools': 'Ferramentas',
    'NEW': 'NOVO',
    'Minecraft schematic converter': 'Conversor de estruturas Minecraft',
    'Convert Minecraft schematics between .litematic, .schem, .schematic, .nbt, .bp (Axiom), and .mcstructure, then preview them with layer-by-layer build guides and export in the format you need. Everything runs in your browser — no upload, no account.': 'Converta estruturas Minecraft entre .litematic, .schem, .schematic, .nbt, .bp (Axiom) e .mcstructure. Depois, visualize-as com guias de construção camada por camada e exporte no formato desejado. Tudo funciona no navegador, sem envio de arquivos e sem precisar de conta.',
    'Drop a Minecraft schematic': 'Solte uma estrutura Minecraft',
    'or': 'ou',
    "We'll detect the format, let you view your build layer by layer in 2D / 3D, and let you export it to any format.": 'Detectaremos o formato para você visualizar a construção camada por camada em 2D ou 3D e exportá-la para qualquer formato.',
    'Turn an image into pixel art or map art': 'Transforme uma imagem em pixel art ou arte de mapa',
    'Upload an image and build it out of blocks or maps.': 'Envie uma imagem e transforme-a em uma construção feita de blocos ou mapas.',
    'Turn your Minecraft skin into a statue': 'Transforme sua skin do Minecraft em uma estátua',
    'Upload a skin, pose it, and export a block-by-block statue.': 'Envie uma skin, escolha a pose e exporte uma estátua bloco por bloco.',
    'OR PASTE A URL': 'OU COLE UMA URL',
    'WORLD CONVERTER': 'CONVERSOR DE MUNDOS',
    'Support Bloxelizer': 'Apoie o Bloxelizer',
    'Bloxelizer is free for everyone. Subscribing to Plus helps keep the platform running and funds new features — thank you!': 'O Bloxelizer é gratuito para todos. Assinar o Plus ajuda a manter a plataforma e financia novos recursos. Obrigado!',
    '2D build guide PDF export': 'Exportação do guia de construção 2D em PDF',
    'Texture pack import & support across Bloxelizer': 'Importação e suporte a pacotes de textura em todo o Bloxelizer',
    'Voxelize 3D models and images using Modded Blocks': 'Transforme modelos 3D e imagens em voxels usando blocos modificados',
    'Private schematics': 'Estruturas privadas',
    'Team creation': 'Criação de equipes',
    'Team sharing': 'Compartilhamento em equipe',
    'Build progress tracking': 'Acompanhamento do progresso da construção',
    'Bulk converter access': 'Acesso ao conversor em lote',
    'No ads, forever': 'Sem anúncios, para sempre',
    'Plus-only upgrades': 'Melhorias exclusivas do Plus',
    'Subscribe to Plus': 'Assinar o Plus',
    'Starting at $3.99/mo · Cancel anytime': 'A partir de US$ 3,99/mês · Cancele quando quiser',
    'Supported schematic formats': 'Formatos de estrutura compatíveis',
    'Sponge schematic': 'Estrutura Sponge',
    'MCEdit schematic': 'Estrutura MCEdit',
    'Structure block': 'Bloco de estrutura',
    'Axiom blueprint': 'Projeto Axiom',
    'Bedrock structure': 'Estrutura Bedrock',
    'The format of the Litematica mod for Fabric. Stores named regions, a block-state palette, and the metadata the mod uses to draw in-game placement guides.': 'Formato do mod Litematica para Fabric. Armazena regiões nomeadas, uma paleta de estados de blocos e os metadados usados pelo mod para exibir guias de posicionamento dentro do jogo.',
    'The modern WorldEdit and FAWE format. Holds a single region of namespaced block states inside gzipped NBT, and is what most servers expect for pasting.': 'Formato moderno do WorldEdit e FAWE. Armazena uma região com estados de blocos dentro de um NBT compactado e é aceito pela maioria dos servidores.',
    'The legacy format built on numeric block IDs. Still used by older WorldEdit builds and by tools that predate the 1.13 block flattening.': 'Formato antigo baseado em IDs numéricos de blocos. Ainda é usado por versões antigas do WorldEdit e por ferramentas anteriores à versão 1.13.',
    'Vanilla Java structure files, readable by structure blocks in-game and by data packs, with a size limit of 48 blocks on each axis.': 'Arquivos de estrutura padrão da Edição Java, lidos por blocos de estrutura e pacotes de dados, com limite de 48 blocos em cada eixo.',
    'The blueprint format of the Axiom editor mod, which bundles the build together with a preview thumbnail and its own metadata.': 'Formato de projeto do editor Axiom, que reúne a construção, uma miniatura e seus próprios metadados.',
    'The Bedrock Edition structure format, used by structure blocks and add-ons on Bedrock, Pocket, and console versions of Minecraft.': 'Formato de estrutura da Edição Bedrock, usado por blocos de estrutura e complementos nas versões Bedrock, Pocket e console do Minecraft.',
    'Drop a Minecraft schematic, world, or 3D model into the converter. The format is detected from the file, so nothing has to be selected up front.': 'Solte uma estrutura Minecraft, um mundo ou um modelo 3D no conversor. O formato será detectado automaticamente.',
    'Inspect the build in the 3D viewer or step through it in the 2D layer-by-layer guide to confirm the blocks came across the way you expect.': 'Confira a construção no visualizador 3D ou percorra o guia 2D camada por camada para confirmar que os blocos foram convertidos como esperado.',
    'Pick the export format and Minecraft version you need, then download the converted file straight from your browser.': 'Escolha o formato de exportação e a versão do Minecraft e baixe o arquivo convertido diretamente pelo navegador.',
    'How to convert a Minecraft schematic': 'Como converter uma estrutura Minecraft',
    'Frequently asked questions': 'Perguntas frequentes',
    'Which Minecraft formats can I convert?': 'Quais formatos do Minecraft posso converter?',
    'Can I preview a build before downloading it?': 'Posso visualizar uma construção antes de baixá-la?',
    'Is the converter free to use?': 'O conversor é gratuito?',
    'Are my files uploaded to a server?': 'Meus arquivos são enviados para um servidor?',
    'Will blocks be lost when converting between editions?': 'Algum bloco será perdido ao converter entre edições?',
    'Popular conversions': 'Conversões populares',
    'View all formats →': 'Ver todos os formatos →',
    'Install app': 'Instalar aplicativo',
    'Creator rewards': 'Recompensas para criadores',
    'Schematic viewer': 'Visualizador de estruturas',
    'Format converters': 'Conversores de formato',
    'Format guides': 'Guias de formatos',
    'Legacy Converter': 'Conversor antigo',
    'Privacy policy': 'Política de privacidade',
    'Terms of service': 'Termos de serviço',
    'Refund policy': 'Política de reembolso',
    'Third-party licenses': 'Licenças de terceiros',
    'PIXELIZER': 'PIXELIZADOR',
    'Pixelizer': 'Pixelizador',
    'Hide Pixelizer panel': 'Ocultar painel do Pixelizador',
    'Pixel art': 'Pixel art',
    'Map art': 'Arte de mapa',
    'IMAGES': 'IMAGENS',
    'Images': 'Imagens',
    'Import images': 'Importar imagens',
    'No images yet. Import one to start converting.': 'Ainda não há imagens. Importe uma para iniciar a conversão.',
    'TOOLS': 'FERRAMENTAS',
    'Pan': 'Mover tela',
    'Pan the canvas': 'Mover a tela',
    'Draw': 'Desenhar',
    'Draw single blocks': 'Desenhar blocos individuais',
    'Erase': 'Apagar',
    'Erase blocks': 'Apagar blocos',
    'Brush': 'Pincel',
    'Draw a 3×3 area': 'Desenhar uma área de 3×3',
    'Block to draw with': 'Bloco usado para desenhar',
    'Open Block selector': 'Abrir seletor de blocos',
    'BLOCK PALETTE': 'PALETA DE BLOCOS',
    'Block palette': 'Paleta de blocos',
    'Editing palette for': 'Editando a paleta de',
    'All images (shared)': 'Todas as imagens (compartilhada)',
    'No blocks picked, so every image can use every available block.': 'Nenhum bloco foi escolhido; todas as imagens podem usar qualquer bloco disponível.',
    'Presets': 'Predefinições',
    'Wool': 'Lã',
    'Concrete': 'Concreto',
    'Terracotta': 'Terracota',
    'Wood': 'Madeira',
    'Stone': 'Pedra',
    'Nature': 'Natureza',
    'Greyscale': 'Escala de cinza',
    'In this palette': 'Nesta paleta',
    'Clear': 'Limpar',
    'Pick a preset or add blocks below to restrict the palette.': 'Escolha uma predefinição ou adicione blocos abaixo para limitar a paleta.',
    'Add blocks…': 'Adicionar blocos…',
    'DITHERING': 'PONTILHAMENTO',
    'Dithering': 'Pontilhamento',
    'None': 'Nenhum',
    'flat, blocky': 'cores chapadas',
    'smoothest': 'mais suave',
    'high contrast': 'alto contraste',
    'Strength': 'Intensidade',
    'Up to date': 'Atualizado',
    'Import an image to convert.': 'Importe uma imagem para converter.',
    'CREATION': 'CRIAÇÃO',
    'Creation': 'Criação',
    'Hide Creation panel': 'Ocultar painel de criação',
    'Export creation': 'Exportar criação',
    'Save creation': 'Salvar criação',
    'PREVIEW': 'VISUALIZAÇÃO',
    'Preview': 'Visualização',
    'Open in Voxelizer': 'Abrir no Voxelizador',
    'Layer by layer': 'Camada por camada',
    'Materials list': 'Lista de materiais',
    'Snapshot': 'Capturar imagem',
    'Open info model': 'Abrir informações do modelo',
  }))

  const sentenceReplacements = [
    [/^Preview (.+) in 3D$/i, 'Visualizar $1 em 3D'],
    [/^(\d+) blocks?$/i, '$1 blocos'],
    [/^(\d+) materials?$/i, '$1 materiais'],
    [/^Layer (\d+)(?: of (\d+))?$/i, (_all, current, total) => total ? `Camada ${current} de ${total}` : `Camada ${current}`],
    [/^Selected layer: (\d+)$/i, 'Camada selecionada: $1'],
    [/^File size: (.+)$/i, 'Tamanho do arquivo: $1'],
    [/^Failed to load (.+)$/i, 'Não foi possível carregar $1'],
    [/^Export as (.+)$/i, 'Exportar como $1'],
    [/^Convert to (.+)$/i, 'Converter para $1'],
    [/^\+(\d+) more$/i, '+$1 outros'],
  ]

  function translateString(value) {
    if (!value) return value
    const leading = value.match(/^\s*/)?.[0] || ''
    const trailing = value.match(/\s*$/)?.[0] || ''
    const key = value.trim()
    if (!key) return value
    const exact = translations.get(key)
    if (exact) return leading + exact + trailing
    for (const [pattern, replacement] of sentenceReplacements) {
      if (pattern.test(key)) return leading + key.replace(pattern, replacement) + trailing
    }
    return value
  }

  function translateElement(element) {
    for (const attribute of ['aria-label', 'placeholder', 'title', 'alt']) {
      if (!element.hasAttribute?.(attribute)) continue
      const current = element.getAttribute(attribute)
      const translated = translateString(current)
      if (translated !== current) element.setAttribute(attribute, translated)
    }
  }

  function translateTree(root) {
    if (!root) return
    if (root.nodeType === Node.TEXT_NODE) {
      if (root.parentElement?.matches('script, style, noscript')) return
      const translated = translateString(root.nodeValue)
      if (translated !== root.nodeValue) root.nodeValue = translated
      return
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
    let node
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement?.matches('script, style, noscript')) continue
        const translated = translateString(node.nodeValue)
        if (translated !== node.nodeValue) node.nodeValue = translated
      } else {
        translateElement(node)
      }
    }
  }

  function translateMetadata() {
    document.title = document.title
      .replace('Minecraft Schematic Viewer', 'Visualizador de Estruturas Minecraft')
      .replace('Schematic Converter', 'Conversor de Estruturas')
      .replace('Minecraft schematic converter', 'Conversor de estruturas Minecraft')
      .replace('Minecraft Pixel Art & Map Art Maker - Image to Blocks', 'Criador de Pixel Art e Arte de Mapa - Imagem para Blocos')
      .replace('Convert Between All Formats', 'Converta entre todos os formatos')
      .replace('3D Models', 'Modelos 3D')
      .replace('Block Editor', 'Editor de Blocos')
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = 'Visualize, edite e converta estruturas Minecraft diretamente no navegador.'
  }

  // React precisa hidratar o HTML original antes que qualquer texto mude.
  // Alterar o DOM durante a hidratação desmonta os listeners dos botões.
  function startTranslation() {
    translateMetadata()
    translateTree(document.body)
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateTree(mutation.target)
        else {
          mutation.addedNodes.forEach(translateTree)
          if (mutation.type === 'attributes') translateElement(mutation.target)
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label', 'placeholder', 'title', 'alt'],
    })
  }
  window.addEventListener('load', () => setTimeout(startTranslation, 1500), { once: true })
})()
