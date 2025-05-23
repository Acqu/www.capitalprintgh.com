const CACHE_NAME = 'israeledwards-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/MainLayout.css',
    '/home.css',
    '/allproducts.css',
    '/app.css',
    '/bootstrap.css',
    '/bootstrap.grid.css',
    '/bootstrap.reboot.css',
    '/bootstrap.utilities.css',
    '/design.css',
    '/solution.css',
    '/serviceworker.js',
    '/images/icon-192.png'
];

// Install event: Cache resources and force the new worker to take over.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(urlsToCache.map(url => {
                return fetch(url).then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${url}`);
                    }
                    return cache.put(url, response);
                }).catch(error => console.error('Skipping resource:', error));
            }));
        })
    ); // **Closing bracket was missing here**
});

// Fetch event: Respond with cached response or fetch from network.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if available; otherwise, do a network fetch.
                return response || fetch(event.request)
                    .then((networkResponse) => {
                        // Optionally: You could update the cache here if needed.
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        // Optionally, return a fallback response.
                    });
            })
    );
});

// Activate event: Clean up old caches and claim clients.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName).catch((error) => {
                                console.error('Failed to delete cache:', error);
                            });
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
            .catch((error) => {
                console.error('Failed to activate service worker:', error);
            })
    );
});
