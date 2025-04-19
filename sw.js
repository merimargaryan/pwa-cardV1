const CACHE_NAME = 'visitka-cache-v3';
const OFFLINE_URL = 'offline.html';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/offline.html',
  '/images/photo.jpg',
  '/images/phone-qr.png',
  '/images/telegram-qr.png',
  '/images/vk-qr.png',
  '/images/github-qr.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка и кэширование всех ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование всех ресурсов');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Стратегия: Сначала кэш, потом сеть с автоматическим обновлением кэша
self.addEventListener('fetch', event => {
  // Для навигационных запросов
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Клонируем ответ для кэширования
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
  }
  // Для всех других запросов
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Возвращаем кэшированный ответ если есть
          if (cachedResponse) {
            return cachedResponse;
          }
          // Иначе загружаем из сети и кэшируем
          return fetch(event.request)
            .then(response => {
              // Не кэшируем неподходящие ответы
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
              return response;
            })
            .catch(() => {
              // Для HTML-страниц возвращаем offline.html
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
});