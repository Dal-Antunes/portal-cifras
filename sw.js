// Guarda o portal no aparelho para funcionar sem internet.
// Página: abre na hora com a cópia guardada e, se houver internet, busca a versão nova por trás
// (antes esperava a internet até 4 segundos, o que parecia travado com sinal fraco).
// Bibliotecas grandes (fontes, banco de dados, leitor de PDF) ficam num cache que não é apagado a cada versão.
const VERSAO = 'cifras-2026-11-26-15';
const LIBS = 'cifras-libs-1';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './firebase-config.js'];
const BIBLIOTECAS = ['./vendor/fontes.css', './vendor/firebase-app-compat.js', './vendor/firebase-auth-compat.js',
  './vendor/firebase-firestore-compat.js', './vendor/pdf.js', './vendor/pdf.worker.js'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSAO);
    await c.addAll(ARQUIVOS.map(u => new Request(u, { cache: 'reload' })));
    const l = await caches.open(LIBS);
    for (const u of BIBLIOTECAS) { if (!(await l.match(u))) { try { await l.add(u); } catch (_) {} } }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO && k !== LIBS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function paginaNova(cache) {
  const r = await fetch('./index.html', { cache: 'no-cache' });
  if (r.ok) await cache.put('./index.html', r.clone());
  return r;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(VERSAO);
      const guardada = (await cache.match('./index.html')) || (await cache.match('./'));
      if (guardada) { e.waitUntil(paginaNova(cache).catch(() => {})); return guardada; }
      try { return await paginaNova(cache); } catch (_) { return Response.error(); }
    })());
    return;
  }
  if (url.pathname.endsWith('/firebase-config.js')) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req)));
    return;
  }
  const ehLib = url.pathname.includes('/vendor/');
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(ehLib ? LIBS : VERSAO).then(c => c.put(req, copia)); }
    return r;
  })));
});
