/* Service worker for the talk deck — NETWORK-FIRST everywhere.
   Online: always fetches fresh (never stale after a deploy).
   Offline: falls back to the last cached copy of everything. */
const CACHE = 'ai-job-hunt-v2';
const PRECACHE = ["./", "./assets/crops/app-bad-chatgpt.png", "./assets/crops/app-bad-quiz.png", "./assets/crops/app-faw.png", "./assets/crops/app-switcher.png", "./assets/crops/referral-dm.png", "./assets/crops/resume-metrics.png", "./assets/crops/site-faw.png", "./assets/crops/site-l4n1skyy.png", "./assets/crops/site-mfrashad.png", "./assets/cv-page1.png", "./assets/me-event.jpg", "./assets/qr-mfrashad.png", "./assets/qr-toolkit.png", "./assets/videos/janelle-casestudy-scroll.mp4", "./assets/videos/janelle-interactive.mp4", "./assets/videos/rashad-portfolio.mp4", "./assets/web/anythingllm.png", "./assets/web/cleve.png", "./assets/web/comfyui.png", "./assets/web/github-mfrashad.png", "./assets/web/gitresume.png", "./assets/web/hannahdaud.png", "./assets/web/janelleis.png", "./assets/web/mfrashad.png", "./assets/web/rendercv.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit ||
          ((req.mode === 'navigate') ? caches.match('./', { ignoreSearch: true }) : undefined))
      )
  );
});
