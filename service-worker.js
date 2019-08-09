// Cache name
const CACHE_NAME = 'pwa-wetherapp-caches-v1';
// Cache targets
const urlsToCache = [
  './',
  './index.html',
  './js/main.js',
  './css/default.css',
  './css/app.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // キャッシュを開く
    caches.open(CACHE_NAME)
    .then((cache) => {
      // 指定されたファイルをキャッシュに追加する
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => {
        // このスコープに所属していて且つCACHE_NAMEではないキャッシュを探す
        return cacheName.startsWith(`${registration.scope}!`) &&
               cacheName !== CACHE_NAME;
      });
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheName) => {
        // いらないキャッシュを削除する
        return caches.delete(cacheName);
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      // キャッシュ内に該当レスポンスがあれば、それを返す
      if (response) {
        return response;
      }

      // 重要：リクエストを clone する。リクエストは Stream なので
      // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
      // 必要なので、リクエストは clone しないといけない
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            // キャッシュする必要のないタイプのレスポンスならそのまま返す
            return response;
          }

          // 重要：レスポンスを clone する。レスポンスは Stream で
          // ブラウザ用とキャッシュ用の2回必要。なので clone して
          // 2つの Stream があるようにする
          let responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
    })
  );
});


let installPromptEvent;

window.addEventListener('beforeinstallprompt', (event) => {
  // Chrome67以前で自動的にプロンプトを表示しないようにする?
  event.preventDefault();

  // イベントを変数に保存する
  installPromptEvent = event;

  // #btnを活性に
  document.querySelector('#btn').disabled = false;
});

// #btnをクリックした時にプロンプトを表示させる
document.querySelector('#btn').addEventListener('click', () => {
  // #btnを非活性に
  document.querySelector('#btn').disabled = true;

  // 　ホーム画面に追加のダイアログを表示させる
  installPromptEvent.prompt();

  // ダイアログの結果をプロミスで受け取る
  installPromptEvent.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    // Update the install UI to notify the user app can be installed
    installPromptEvent = null;
  });
});