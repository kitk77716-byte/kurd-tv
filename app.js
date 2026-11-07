const video=document.getElementById('video');
const msg=document.getElementById('playerMessage');
const title=document.getElementById('playerTitle');
const official=document.getElementById('officialLink');
let hls=null;
function card(ch){
  const b=document.createElement('button');b.className='channel-card';b.type='button';b.dataset.id=ch.id;
  b.innerHTML=`<span class="logo">${ch.short}</span><span class="card-text"><strong>${ch.name}</strong><small>${ch.note||''}</small></span><span class="card-live">LIVE</span>`;
  b.addEventListener('click',()=>play(ch));return b;
}
function render(){
 const kurd=CHANNELS.filter(x=>x.group==='kurd'),world=CHANNELS.filter(x=>x.group==='world');
 kurd.forEach(x=>document.getElementById('kurdGrid').appendChild(card(x)));
 world.forEach(x=>document.getElementById('worldGrid').appendChild(card(x)));
 document.getElementById('kurdCount').textContent=`${kurd.length} کەناڵ`;
 document.getElementById('worldCount').textContent=`${world.length} کەناڵ`;
}
function stopPlayer(){if(hls){hls.destroy();hls=null;}video.pause();video.removeAttribute('src');video.load();}
function play(ch){
 document.querySelectorAll('.channel-card').forEach(x=>x.classList.toggle('active',x.dataset.id===ch.id));
 title.textContent=ch.name;
 const page=ch.official|| (ch.type==='page'?ch.url:'#');
 official.href=page;official.style.display=page==='#'?'none':'inline';
 stopPlayer();
 if(ch.type==='hls'){
   msg.textContent='پەخش بار دەکرێت...';
   if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=ch.url;video.play().then(()=>msg.textContent='').catch(()=>msg.textContent='پەخشەکە بەردەست نییە؛ ماڵپەڕی فەرمی بکەرەوە.');}
   else if(window.Hls&&Hls.isSupported()){
     hls=new Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(ch.url);hls.attachMedia(video);
     hls.on(Hls.Events.MANIFEST_PARSED,()=>video.play().then(()=>msg.textContent='').catch(()=>msg.textContent='بۆ دەستپێکردن دوگمەی Play دابگرە.'));
     hls.on(Hls.Events.ERROR,(e,d)=>{if(d.fatal)msg.textContent='پەخشەکە لەم کاتەدا بەردەست نییە؛ ماڵپەڕی فەرمی بکەرەوە.';});
   }else{msg.textContent='ئەم وێبگەڕە پشتگیری ئەم جۆرە پەخشە ناکات؛ ماڵپەڕی فەرمی بکەرەوە.';}
 }else{
   msg.textContent='ئەم کەناڵە لە ماڵپەڕی فەرمی خۆی دەکرێتەوە، چونکە ڕێگەی پەخشکردنی ناوخۆیی دیاری نەکراوە.';
 }
 document.getElementById('playerSection').scrollIntoView({behavior:'smooth',block:'start'});
}
render();
// Kurdsat 1 is shown first as requested; do not autoplay.
const installBtn=document.getElementById('installBtn');let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.classList.remove('hidden');});
installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt=null;installBtn.classList.add('hidden');});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
