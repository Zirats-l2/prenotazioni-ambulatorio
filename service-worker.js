// Service worker minimo: necessario perché il browser consideri il sito "installabile" come app.
// Non memorizza nulla in modo aggressivo: ogni richiesta va comunque in rete quando possibile,
// così il sito mostra sempre i dati aggiornati (prenotazioni, avvisi) e non versioni vecchie in cache.

const CACHE_NAME = 'studio-pezzucchi-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Prova sempre la rete; usa la cache solo come riserva se la rete non è raggiungibile (es. offline).
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
