const CACHE_NAME = "tuta-v1";
const API_CACHE = "tuta-api-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", "/feed", "/reels", "/wallet", "/shop"])),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isFeedOrReelsApi =
    url.pathname.startsWith("/api/feed/posts") || url.pathname.startsWith("/api/reels/items");

  if (isFeedOrReelsApi) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const fresh = await fetch(request);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ posts: [], items: [], offline: true }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
    );
  }
});
