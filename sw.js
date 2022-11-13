const staticCache = 'static-cache-2';
const dynamicCache = 'dynamic-cache-2';

self.importScripts('constantes.js');

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

const cacheResources = async () => {
    const assets = [
        ...fonts,
        ...styles,
        ...scripts,
        ...pages,
        ...fallback,
    ];

    let cache = await caches.open(staticCache);
    return cache.addAll(assets)
}

self.addEventListener('install', evt => {
    evt.waitUntil(cacheResources())
});

const updatingCache = async () => {
    let chave = await caches.keys();
    return Promise.all(chave
        .filter(chave => chave !== staticCache && chave !== dynamicCache)
        .map(chave => caches.delete(chave))
    )
}

self.addEventListener('activate', evt => {
    evt.waitUntil(updatingCache());
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request)
                .then(fetchRes => {
                    return caches.open(dynamicCache)
                        .then(cache => {
                            cache.put(evt.request.url, fetchRes.clone());
                            return fetchRes;

                        })
                });
        })
            .catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('./fallback.html')
                }
            })
    );
});

