var CACHE_NAME = '2';
var urlsToCache = [
  /*'/',
  '/index.html',
  '/bundle.js',
  '/material.min.css',
  '/material.min.js',
  '/favicon.ico'*/
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });
   
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // キャッシュがあったのでそのレスポンスを返す
          if (response) {
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
              function(response) {
                // レスポンスが正しいかをチェック
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
            
                // 重要：レスポンスを clone する。レスポンスは Stream で
                // ブラウザ用とキャッシュ用の2回必要。なので clone して
                // 2つの Stream があるようにする
                var responseToCache = response.clone();
            
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
            
                return response;
              }
            );
          }
          return fetch(event.request);
        }
      )
    );
  });




  