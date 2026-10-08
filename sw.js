// Cache photos, map engine and map data on the phone so repeat visits are fast and use less data.
const V='fk-v2';
const CACHE_FIRST=[/\/p\//,/cdnjs\.cloudflare\.com/,/unpkg\.com/,/fonts\.(googleapis|gstatic)\.com/,/tiles\.openfreemap\.org/,/cyberjapandata\.gsi\.go\.jp/];
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=r.url;
  if(CACHE_FIRST.some(re=>re.test(u))){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));
    return;
  }
  if(r.mode==='navigate'){
    // page itself: newest from network, saved copy when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r)));
  }
});
