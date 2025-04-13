
// Service Worker para o Venice Guide PWA

const CACHE_NAME = 'venice-guide-v6';

// Arquivos que serão cacheados
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/admin'
];

// Instalação do service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  // Skip waiting força o service worker a se tornar ativo imediatamente
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
      .then(() => console.log('Service Worker: All files cached'))
      .catch(error => console.error('Service Worker: Cache failed', error))
  );
});

// Ativação do service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  
  // Claim controla todos os clientes imediatamente
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Clearing Old Cache', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  
  // Notifica todos os clientes que o service worker foi atualizado
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_ACTIVATED' });
    });
  });
});

// Estratégia de cache: stale-while-revalidate
self.addEventListener('fetch', (event) => {
  // Não intercepte requisições para o manifest
  if (event.request.url.includes('manifest.json')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // Atualiza o cache em segundo plano
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(err => console.log('Error fetching resource: ', err));
          
          return response;
        }

        // Se não estiver no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone a resposta para o cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(err => {
            console.log('Fetch error:', err);
            // Se falhar ao buscar na rede, podemos servir uma página offline
            return new Response('Network error, not able to fetch resource');
          });
      })
  );
});

// Lidar com mensagens enviadas para o service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_FOR_UPDATE') {
    // Força verificação de atualização
    self.registration.update();
  }
  
  if (event.data && event.data.type === 'TRIGGER_INSTALL') {
    // Tenta forçar a instalação do PWA notificando todos os clientes
    console.log('Service Worker: Received TRIGGER_INSTALL message');
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        console.log('Service Worker: Sending SHOW_INSTALL_PROMPT to client');
        client.postMessage({ 
          type: 'SHOW_INSTALL_PROMPT',
          timestamp: new Date().getTime()
        });
      });
    });
  }
});

// Evento "push" para notificações push
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Venice Guide',
    body: 'Novas atualizações disponíveis!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      // Se não for JSON, use o texto
      notificationData.body = event.data.text();
    }
  }

  const showNotification = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge
    }
  );

  event.waitUntil(showNotification);
});

// Evento quando o usuário clica em uma notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      // Se já tiver uma janela aberta, foco nela
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não tiver, abra uma nova
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
