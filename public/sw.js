const STATIC_CACHE = "staticStuffV1";
const DYNAMIC_CACHE = "dynamicStuffV1";

self.addEventListener("install", function(event) {
    console.log("[Service Worker] Installing service worker...", event);
    event.waitUntil(caches.open(STATIC_CACHE).then((cache) => {
        console.log(`[Service Worker] Precaching App Shell into '${STATIC_CACHE}'`);
        return cache.addAll([
            "/",
            "/src/js/app.js",
            "/src/js/feed.js",
            "/src/js/material.min.js",
            "/src/css/app.css",
            "/src/css/feed.css",
            "/src/images/main-image.jpg",
            // CDNs
            "https://fonts.googleapis.com/css?family=Roboto:400,700",
            "https://fonts.googleapis.com/icon?family=Material+Icons",
            "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
            // Fonts from CDNs
            "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            "https://fonts.gstatic.com/s/materialicons/v118/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
        ]);
    }));
});

self.addEventListener("activate", function(event) {
    console.log("[Service Worker] Activating service worker...", event);
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                console.log(`[Service Worker] deleting cache '${key}'`);
                return caches.delete(key);
            }
        })))
    );
    return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    // console.log("[Service Worker] Fetching...", event);
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log("[Service Worker] Fetching from cache", event);
                return response;
            } else {
                return fetch(event.request).then(fetchResponse => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        console.log(`[Service Worker] Caching into '${DYNAMIC_CACHE}'`);
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            }
        })
    );
});
