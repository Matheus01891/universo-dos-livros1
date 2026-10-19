'use strict';
(() => {
 const $=id=>document.getElementById(id);
 const safeRead=(key,def)=>{try{return localStorage.getItem(key)??def;}catch{return def;}};
 const safeWrite=(key,val)=>{try{localStorage.setItem(key,val);}catch{}};
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 let current=clamp(parseInt(safeRead('porta_estrelas_page_v4','1'),10)||1,1,24);
 let font=clamp(parseInt(safeRead('porta_estrelas_font_v4','19'),10)||19,16,25);
 let sound=safeRead('porta_estrelas_sound_v4','yes')==='yes';
 let lastFocus=null,navHistory=[],reading=false,finishTimer=null,toastTimer=null;
 let audio=null;
 const movie=new StoryCinema($('sceneCanvas'),$('renderNotice'));
 const say=(msg)=>{clearTimeout(toastTimer);$('toast').textContent=msg;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2900);};
 function beep(type='tap'){
  if(!sound)return;
  try {audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
   const now=audio.currentTime;const notes=type==='magic'?[523.25,659.25,784,1046.5]:type==='bell'?[392,523.25,659.25,1046.5]:[660];
   notes.forEach((freq,i)=>{let osc=audio.createOscillator(),gain=audio.createGain();osc.type=type==='bell'?'sine':'triangle';osc.frequency.value=freq;osc.connect(gain);gain.connect(audio.destination);let start=now+i*.10;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(type==='tap'?.014:.026,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+(type==='tap'?.13:.6));osc.start(start);osc.stop(start+(type==='tap'?.14:.63));});
  }catch(e){console.warn('Áudio não disponível',e);}
 }
 function stopVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel();reading=false;$('readLabel').textContent='Ouvir esta página';$('readIcon').textContent='◖))';}
 function stopMovie(){movie.action=null;movie.stopModelAction?.();$('playLabel').textContent='Ver a magia';$('playSymbol').textContent='▶';$('btnPlay').disabled=false;$('effectCaption').classList.remove('visible');document.querySelectorAll('.choice').forEach(btn=>btn.disabled=false);$('btnContinue').disabled=false;}
 function gotoPage(n,track=true){if(n<1||n>BOOK.length)return;stopVoice();stopMovie();if(track&&current!==n)navHistory.push(current);current=n;safeWrite('porta_estrelas_page_v4',String(current));render();}
 function animate(kind,done,caption){
  if(movie.action){movie.finish();return;}
  stopVoice();beep(kind==='bell'?'bell':'magic');
  const title=movie.start(kind,done||null);
  $('effectCaption').textContent=caption||title;
  $('effectCaption').classList.add('visible');
  $('playLabel').textContent='Pular cena';$('playSymbol').textContent='↷';
  document.querySelectorAll('.choice').forEach(btn=>btn.disabled=true);
  $('btnContinue').disabled=true;
  const complete=movie.action.done;
  movie.action.done=()=>{stopMovie();if(complete)complete();};
 }
 function onChoice(choice){if(movie.action)return;animate(choice.shot,()=>gotoPage(choice.to),choice.caption);}
 function onReplay(){if(movie.action){movie.finish();return;}let page=BOOK[current-1];animate(page.shot,()=>{});}
 function buildChoices(page){const out=$('choices');out.replaceChildren();if(page.choices?.length){for(const c of page.choices){const btn=document.createElement('button');btn.type='button';btn.className='choice';const sp=document.createElement('span');sp.textContent=c.label;const arrow=document.createElement('span');arrow.className='choice-symbol';arrow.textContent='↗';btn.append(sp,arrow);btn.addEventListener('click',()=>onChoice(c));out.append(btn);}}
  $('btnContinue').hidden=Boolean(page.choices)||Boolean(page.end);
  $('interactionKicker').textContent=page.end?'🏅 MISSÃO CONCLUÍDA':page.choices?'✨ VOCÊ DECIDE A AVENTURA':'📚 SUA PRÓXIMA DESCOBERTA';
  $('interactionPrompt').textContent=page.prompt||(page.end?'Você terminou a aventura!': 'Quando terminar de ler, avance para a próxima página.');
  if(page.end){let finish=document.createElement('button');finish.type='button';finish.className='continue';finish.textContent='🏅 Receber meu Diploma Estelar';finish.onclick=showDiploma;out.append(finish);let restart=document.createElement('button');restart.type='button';restart.className='choice';restart.textContent='↻ Ler o livro novamente';restart.onclick=()=>{navHistory=[];gotoPage(1,false);};out.append(restart);}
  else if(!page.choices){$('btnContinue').replaceChildren(document.createTextNode(page.continueLabel||'Continuar a história'));let arrow=document.createElement('span');arrow.textContent='→';$('btnContinue').appendChild(arrow);$('btnContinue').onclick=()=>gotoPage(current+1);}
 }
 function render(){const page=BOOK[current-1];if(!page)return;document.documentElement.style.setProperty('--bodyfont',font+'px');
  $('chapterLabel').textContent=page.chapter;$('pageCount').textContent=String(current).padStart(2,'0')+' / 24';$('pageKicker').textContent='PÁGINA '+String(current).padStart(2,'0');$('sceneKind').textContent='CENA '+String(current).padStart(2,'0');$('sceneName').textContent=page.title;$('storyTitle').textContent=page.title;
  const text=$('storyParagraphs');text.replaceChildren();for(const paragraph of page.paragraphs){let p=document.createElement('p');p.textContent=paragraph;text.appendChild(p);}
  $('storyQuote').hidden=!page.quote;if(page.quote)$('quoteText').textContent=page.quote;
  const speaker=SPEAKERS[page.speaker]||SPEAKERS.lia;$('portrait').textContent=speaker[0];$('speakerName').textContent=speaker[1];$('speakerRole').textContent=speaker[2];
  $('progressFill').style.width=(current/24*100)+'%';$('progressLabel').textContent=Math.round(current/24*100)+'%';$('progressTrack').setAttribute('aria-valuenow',String(current));
  $('btnPrevious').disabled=current===1&&!navHistory.length;
  // As escolhas não podem ser ignoradas pelo botão de navegação, mantendo coerência.
  $('btnNext').disabled=Boolean(page.choices)||page.end;
  buildChoices(page);movie.setPage(current);
  $('playLabel').textContent='Ver a magia';$('playSymbol').textContent='▶';
  if(window.innerWidth<650&&document.activeElement?.tagName==='BUTTON'){$('storyTitle').scrollIntoView({behavior:'smooth',block:'start'});}
 }
 function openModal(title,body,mode='text'){lastFocus=document.activeElement;$('modalTitle').textContent=title;$('modalBody').replaceChildren();if(mode==='html')$('modalBody').innerHTML=body;else $('modalBody').textContent=body;$('modal').hidden=false;$('modalClose').focus();}
 function closeModal(){$('modal').hidden=true;lastFocus?.focus?.();}
 function chapterModal(){const outer=document.createElement('div');outer.className='chapter-list';for(let i=0;i<BOOK.length;i++){const btn=document.createElement('button');btn.type='button';btn.className='chapter-tile'+(i+1===current?' active':'');const sm=document.createElement('small');sm.textContent='PÁGINA '+String(i+1).padStart(2,'0');btn.append(sm,document.createTextNode(BOOK[i].title));btn.onclick=()=>{closeModal();gotoPage(i+1);};outer.append(btn);}openModal('Escolha uma página','');$('modalBody').append(outer);}
 function helpModal(){openModal('Como explorar o livro',`<div class="help-copy"><p>📖 <strong>Leia a história</strong> na página clara. A cena ao lado mostra o que está acontecendo no mundo de Lia.</p><p>🎬 Clique em <strong>Assistir à cena</strong> para ver a ação com movimento de câmera e efeitos. Você pode pular a animação a qualquer momento.</p><p>✨ Quando surgirem escolhas, <strong>selecione uma opção</strong> para decidir como a aventura continua. As trilhas da ponte e da floresta se encontram novamente no lago.</p><p>🔊 Use <strong>Ouvir esta página</strong> para escutar a narração em português. Use A− e A+ para ajustar as letras.</p><p>👧 Para substituir a Lia ilustrada por um modelo real, importe um arquivo <strong>.GLB</strong>. O arquivo original .MAX precisa ser convertido antes.</p><label class="import-btn">Importar modelo 3D (.GLB) <input id="modelInput" type="file" accept=".glb,model/gltf-binary"></label><span class="model-status" id="modelStatus">O modelo não é enviado para nenhum servidor. A importação é temporária e ocorre no navegador.</span><p>Modelos com animações internas nomeadas Idle, Walk, Jump ou Wave podem usar essas animações nas cenas. Sem essas animações, o motor movimenta o personagem inteiro.</p></div>`,'html');
  const input=$('modelInput');input.onchange=async()=>{let file=input.files?.[0];if(!file)return;let status=$('modelStatus');status.textContent='Preparando o personagem…';try{await movie.importGLB(file);status.textContent='✓ Modelo carregado: '+file.name;say('Personagem 3D importado!');}catch(e){status.textContent='⚠ '+e.message;}};
 }
 function showDiploma(){openModal('Seu Diploma Estelar',`<div class="help-copy" style="text-align:center"><div style="font-size:43px">🏅 ✦ 🌙</div><h3 style="font-family:Playfair Display,serif;font-size:27px;color:#614277;margin:8px 0">Explorador(a) Estelar</h3><p>Este diploma celebra sua jornada pelas 24 páginas e sua descoberta de que coragem, gentileza e amizade iluminam o mundo.</p><button type="button" id="downloadDiploma" class="special-btn">↓ Salvar diploma (PNG)</button></div>`,'html');$('downloadDiploma').onclick=downloadDiploma;beep('bell');}
 function downloadDiploma(){const c=document.createElement('canvas');c.width=1400;c.height=980;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,1400,980);g.addColorStop(0,'#221842');g.addColorStop(1,'#564280');x.fillStyle=g;x.fillRect(0,0,1400,980);x.lineWidth=5;x.strokeStyle='#f1d59b';x.strokeRect(40,40,1320,900);x.strokeStyle='#b79bd5';x.strokeRect(62,62,1276,856);x.fillStyle='#ffdfa0';x.textAlign='center';x.font='60px Georgia';x.fillText('✦ ✧ ✦',700,190);x.font='bold 68px Georgia';x.fillText('DIPLOMA ESTELAR',700,318);x.font='42px Georgia';x.fillStyle='#fff6ed';x.fillText('Explorador(a) do Reino Estelar',700,432);x.font='30px sans-serif';x.fillText('Concluiu a aventura A Porta que Respirava Estrelas',700,520);x.fillText('e descobriu o poder da coragem, da amizade e da gentileza.',700,565);x.fillStyle='#ffe0a6';x.font='96px Georgia';x.fillText('★',700,724);x.font='26px sans-serif';x.fillText('24 páginas de imaginação e descobertas',700,821);const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='Meu-Diploma-Estelar.png';a.click();say('Diploma preparado para salvar!');}
 $('btnContinue').onclick=()=>gotoPage(current+1);
 $('btnPlay').onclick=onReplay;
 $('btnPrevious').onclick=()=>{if(movie.action)stopMovie();const prev=navHistory.pop();gotoPage(prev||current-1,false);};
 $('btnNext').onclick=()=>gotoPage(current+1);
 $('btnChapters').onclick=chapterModal;$('btnHelp').onclick=helpModal;$('modalClose').onclick=closeModal;
 $('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeModal();});
 $('btnSound').onclick=()=>{sound=!sound;safeWrite('porta_estrelas_sound_v4',sound?'yes':'no');$('btnSound').querySelector('span').textContent=sound?'Som ligado':'Som desligado';$('btnSound').setAttribute('aria-pressed',String(sound));if(sound)beep();};
 $('btnSound').querySelector('span').textContent=sound?'Som ligado':'Som desligado';$('btnSound').setAttribute('aria-pressed',String(sound));
 $('btnFontMinus').onclick=()=>{font=clamp(font-1,16,25);safeWrite('porta_estrelas_font_v4',String(font));document.documentElement.style.setProperty('--bodyfont',font+'px');};
 $('btnFontPlus').onclick=()=>{font=clamp(font+1,16,25);safeWrite('porta_estrelas_font_v4',String(font));document.documentElement.style.setProperty('--bodyfont',font+'px');};
 $('btnRead').onclick=()=>{if(reading){stopVoice();return;}if(!('speechSynthesis' in window)){say('Leitura em voz alta indisponível neste navegador.');return;}stopVoice();const page=BOOK[current-1],utterance=new SpeechSynthesisUtterance([page.title,...page.paragraphs,page.quote||''].join('. '));utterance.lang='pt-BR';utterance.rate=.9;utterance.pitch=1.05;let voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang.toLowerCase()==='pt-br'&&/fem|maria|francisca|luciana|helena/i.test(v.name))||voices.find(v=>v.lang.toLowerCase()==='pt-br')||null;reading=true;$('readLabel').textContent='Parar narração';$('readIcon').textContent='■';utterance.onend=()=>stopVoice();utterance.onerror=()=>stopVoice();window.speechSynthesis.speak(utterance);};
 window.addEventListener('keydown',e=>{if(!$('modal').hidden){if(e.key==='Escape'){closeModal();}return;}const element=e.target;if(element?.tagName==='INPUT'||element?.tagName==='TEXTAREA')return;if(e.key==='ArrowLeft'&&!$('btnPrevious').disabled) $('btnPrevious').click();if(e.key==='ArrowRight'&&!$('btnNext').disabled)$('btnNext').click();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&reading)stopVoice();});
 render();
})();
