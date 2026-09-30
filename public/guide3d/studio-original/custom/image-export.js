(() => {
  if (window.__structureMediaInstalled) return
  window.__structureMediaInstalled = true
  const BRAND_DOMAIN='www.guizzprints.xyz'
  const style=document.createElement('style')
  style.textContent=`#structure-image-export{background:#dc2626;color:white;border:0;border-radius:8px;padding:12px;cursor:pointer}#media-studio{background:#09090b;color:#fafafa;border:1px solid #52525b;border-radius:14px;width:min(820px,94vw);max-height:90vh;font:14px system-ui}#media-studio::backdrop{background:#000b}#media-studio button,#media-studio a{background:#dc2626;color:white;border:0;border-radius:6px;padding:10px 14px;cursor:pointer;display:inline-block}#media-studio button:disabled{opacity:.5}#media-studio nav,#image-actions{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}#media-studio input{display:block;box-sizing:border-box;width:100%;background:#18181b;color:white;border:1px solid #52525b;padding:10px;margin:8px 0 16px}#media-studio .media-check{display:flex;align-items:center;gap:9px;margin:12px 0 16px;padding:11px 12px;background:#18181b;border:1px solid #3f3f46;border-radius:8px;color:#f4f4f5}#media-studio .media-check input[type=checkbox]{display:inline-block;width:18px;height:18px;margin:0;padding:0;accent-color:#dc2626}#media-studio p{line-height:1.6;color:#d4d4d8}#media-studio img{width:100%}#media-studio [hidden]{display:none!important}#media-studio progress{width:100%;accent-color:#dc2626}#media-studio #hologram-video{background:#0891b2;border:1px solid #22d3ee;box-shadow:0 0 18px #0891b255}#media-studio #hologram-video:hover{background:#0e7490}#individual-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:16px}#individual-gallery article{background:#18181b;border:1px solid #3f3f46;border-radius:9px;padding:10px}#individual-gallery h3{margin:0 0 8px;font-size:13px}#individual-gallery img{aspect-ratio:1;object-fit:contain;background:#c9eff8}`
  document.head.append(style)
  const button=document.createElement('button');button.id='structure-image-export';button.textContent='Imagem e vídeo'
  const modal=document.createElement('dialog');modal.id='media-studio'
  modal.innerHTML=`<button id="media-close" aria-label="Fechar" style="float:right">✕</button><h2>Imagem e vídeo</h2><nav><button id="tab-image">Imagens e capas</button><button id="tab-video">Vídeos</button></nav><section id="panel-image"><p>Gere a prancha técnica, uma capa com quatro perspectivas ou cada uma das dez vistas em PNG individual.</p><label>Nome da construção<input id="media-name" value="www.guizzprints.xyz" maxlength="100"></label><label>Autor (opcional)<input id="media-author" maxlength="100"></label><div id="image-actions"><button id="generate-sheet">Prancha completa</button><button id="generate-cover">Capa com 4 vistas</button><button id="generate-individual">Vistas individuais</button></div><progress id="sheet-progress" value="0" max="10" hidden></progress><p id="sheet-status" role="status"></p><a id="sheet-download" hidden>Baixar PNG</a><img id="sheet-preview" alt="Imagem gerada da estrutura" hidden><div id="individual-gallery" hidden></div></section><section id="panel-video" hidden><h3>Vídeo rápido de construção · MP4</h3><p>A construção começa vazia e aparece progressivamente, camada por camada e bloco por bloco, usando a câmera e as texturas do motor original.</p><button id="native-video">Gerar vídeo de construção MP4</button><p id="video-status" role="status">O vídeo será acelerado para ficar compacto. Ao concluir, clique em “Baixar MP4”.</p><hr style="border-color:#3f3f46;margin:20px 0"><h3>Time-lapse isométrico · WebM</h3><p>Usa as camadas Y reais do arquivo: sobe uma por uma, pausa e desce uma por uma. A velocidade é calculada automaticamente pela quantidade de camadas.</p><label class="media-check"><input id="hologram-grid" type="checkbox" checked>Mostrar grade no vídeo</label><button id="hologram-video">Gerar time-lapse por camadas</button><p id="hologram-status" role="status">Abra a estrutura em 3D; o total de camadas será detectado automaticamente.</p><hr style="border-color:#3f3f46;margin:20px 0"><h3>Gravação livre · WebM</h3><p>Para gravar seus próprios movimentos de câmera, feche esta janela e use o botão “Gravar vídeo” do visualizador.</p></section>`
  document.body.append(button,modal)
  const get=id=>modal.querySelector('#'+id)
  button.onclick=()=>modal.showModal()
  get('media-close').onclick=()=>modal.close()
  get('tab-image').onclick=()=>{get('panel-image').hidden=false;get('panel-video').hidden=true}
  get('tab-video').onclick=()=>{get('panel-image').hidden=true;get('panel-video').hidden=false}
  let runtime,previewURL,viewURLs=[]
  const viewLabels={
    'iso-se':'Sudeste','plan-top':'Vista superior','iso-sw':'Sudoeste',
    'elev-front':'Frente','elev-right':'Direita','elev-back':'Traseira','elev-left':'Esquerda',
    'iso-nw':'Noroeste','plan-bottom':'Vista inferior','iso-ne':'Nordeste'
  }
  const safeName=value=>(value||BRAND_DOMAIN).replace(/[<>:"/\\|?*]/g,'-')
  const asBlob=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Falha ao criar o PNG.')),'image/png'))
  const setMainResult=(blob,fileName,message)=>{
    if(previewURL)URL.revokeObjectURL(previewURL)
    previewURL=URL.createObjectURL(blob)
    const download=get('sheet-download');download.href=previewURL;download.download=fileName;download.hidden=false
    const preview=get('sheet-preview');preview.src=previewURL;preview.hidden=false
    get('individual-gallery').hidden=true
    get('sheet-status').textContent=message
  }
  const nativeContext=async()=>{
    if(!runtime)window.webpackChunk_N_E?.push([['local-media-studio'],{},r=>{runtime=r}])
    if(!runtime)throw Error('Aguarde o visualizador carregar.')
    const r=runtime,{chunkManager}=await r(92967)
    if(!chunkManager.hasBlocks())throw Error('Importe uma estrutura antes de gerar as imagens.')
    const dimensions=await chunkManager.getDimensions({})
    await r.e(56512)
    const generator=await r(56512),layout=r(46156)
    const chunkIds=Array.from(chunkManager.getChunkIdsFromMinMax(dimensions.minChunk,dimensions.maxChunk,false))
    return{r,chunkManager,dimensions,chunkIds,views:layout.U4.flat(),renderView:generator.renderSpecSheetViewBitmap}
  }
  const renderViews=async(viewIds,onProgress)=>{
    const context=await nativeContext(),results=[]
    const selected=viewIds?.length?viewIds.map(id=>context.views.find(view=>view.id===id)).filter(Boolean):context.views
    for(let index=0;index<selected.length;index++){
      const view=selected[index]
      results.push({view,bitmap:await context.renderView({view,chunkIds:context.chunkIds,dimensions:context.dimensions,possibleModdedBlocks:[],resolution:1200})})
      onProgress?.(index+1,selected.length)
    }
    return results
  }
  const drawContained=(ctx,image,x,y,width,height,padding=36)=>{
    const scale=Math.min((width-2*padding)/image.width,(height-2*padding)/image.height)
    const w=image.width*scale,h=image.height*scale
    ctx.drawImage(image,x+(width-w)/2,y+(height-h)/2,w,h)
  }
  get('generate-sheet').onclick=async()=>{
    const action=get('generate-sheet'),status=get('sheet-status'),progress=get('sheet-progress')
    action.disabled=true;progress.hidden=false;progress.value=0
    try{
      status.textContent='Preparando o gerador nativo…'
      if(!runtime)window.webpackChunk_N_E?.push([['local-media-studio'],{},r=>{runtime=r}])
      if(!runtime)throw Error('Aguarde o visualizador carregar.')
      const r=runtime,{chunkManager}=await r(92967),{hF}=await r(40920)
      if(!chunkManager.hasBlocks())throw Error('Importe uma estrutura antes de gerar a prancha.')
      const dimensions=await chunkManager.getDimensions({})
      const materials=await hF.getInstance().queue(w=>w.groupBlocksByName({gidsToIgnore:{},possibleModdedBlocks:[]}))
      await r.e(56512)
      const {renderSpecSheetPng}=await r(56512)
      const buildName=get('media-name').value.trim()||BRAND_DOMAIN
      const blob=await renderSpecSheetPng({buildName:BRAND_DOMAIN,brandText:BRAND_DOMAIN,watermarkText:BRAND_DOMAIN,creatorName:get('media-author').value.trim(),subtitle:'Todos os lados da construção, na mesma escala',dimensions,materials,possibleModdedBlocks:[],showWatermark:false,onProgress:(done,total)=>{progress.max=total;progress.value=done;status.textContent=`Vistas concluídas: ${done}/${total}`}})
      if(!(blob instanceof Blob)||!blob.size)throw Error('O gerador não retornou uma imagem válida.')
      setMainResult(blob,safeName(buildName)+'-prancha.png','Prancha pronta. Confira a prévia e baixe o PNG.')
    }catch(error){console.error('[Prancha PNG]',error);status.textContent=error.message||String(error)}finally{action.disabled=false}
  }
  const runViewExport=async mode=>{
    const action=get(mode==='cover'?'generate-cover':'generate-individual'),status=get('sheet-status'),progress=get('sheet-progress')
    action.disabled=true;progress.hidden=false;progress.value=0;get('sheet-download').hidden=true;get('sheet-preview').hidden=true;get('individual-gallery').hidden=true
    try{
      status.textContent='Renderizando as perspectivas nativas…'
      const coverIds=['iso-se','iso-sw','iso-nw','iso-ne']
      const rendered=await renderViews(mode==='cover'?coverIds:null,(done,total)=>{progress.max=total;progress.value=done;status.textContent=`Vistas concluídas: ${done}/${total}`})
      const buildName=get('media-name').value.trim()||BRAND_DOMAIN
      if(mode==='cover'){
        const picked=coverIds.map(id=>rendered.find(item=>item.view.id===id)).filter(Boolean)
        const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=2048
        const ctx=canvas.getContext('2d');ctx.fillStyle='#cceff7';ctx.fillRect(0,0,2048,2048)
        picked.forEach(({bitmap},index)=>{const x=index%2*1024,y=Math.floor(index/2)*1024;ctx.save();ctx.beginPath();ctx.rect(x,y,1024,1024);ctx.clip();drawContained(ctx,bitmap,x,y,1024,1024,58);ctx.restore()})
        ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(1024,0);ctx.lineTo(1024,2048);ctx.moveTo(0,1024);ctx.lineTo(2048,1024);ctx.stroke()
        ctx.font='700 56px system-ui';ctx.textAlign='center';ctx.fillStyle='white';ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=8;ctx.fillText(BRAND_DOMAIN,1024,1010)
        setMainResult(await asBlob(canvas),safeName(buildName)+'-capa-4-vistas.png','Capa com quatro vistas pronta.')
      }else{
        viewURLs.forEach(URL.revokeObjectURL);viewURLs=[]
        const gallery=get('individual-gallery');gallery.innerHTML=''
        for(const {view,bitmap} of rendered){
          const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1200
          const ctx=canvas.getContext('2d');ctx.fillStyle='#cceff7';ctx.fillRect(0,0,1200,1200);drawContained(ctx,bitmap,0,0,1200,1200,64)
          const label=viewLabels[view.id]||view.label
          ctx.fillStyle='rgba(9,9,11,.82)';ctx.fillRect(0,1120,1200,80);ctx.fillStyle='white';ctx.font='600 30px system-ui';ctx.textAlign='center';ctx.fillText(label.toUpperCase(),600,1172)
          const blob=await asBlob(canvas),url=URL.createObjectURL(blob);viewURLs.push(url)
          const card=document.createElement('article');card.innerHTML=`<h3>${label}</h3><img alt="${label}"><a>Baixar esta vista</a>`;card.querySelector('img').src=url
          const link=card.querySelector('a');link.href=url;link.download=`${safeName(buildName)}-${view.id}.png`;gallery.append(card)
        }
        gallery.hidden=false;status.textContent='As dez vistas individuais estão prontas para download.'
      }
      rendered.forEach(({bitmap})=>bitmap.close?.())
    }catch(error){console.error('[Vistas PNG]',error);status.textContent=error.message||String(error)}finally{action.disabled=false}
  }
  get('generate-cover').onclick=()=>runViewExport('cover')
  get('generate-individual').onclick=()=>runViewExport('individual')
  get('native-video').onclick=()=>{
    if(!window.structureNativeVideo?.ready){get('video-status').textContent='Abra uma estrutura em 3D e aguarde o carregamento.';return}
    get('video-status').textContent='Abrindo o gerador nativo. A renderização começa automaticamente…'
    const buildName=get('media-name')?.value?.trim()||BRAND_DOMAIN
    window.structureVideoFilename=`${safeName(buildName)}-construcao-em-camadas.mp4`
    window.structureNativeVideo.open();modal.close()
  }
})()

