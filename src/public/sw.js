

// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing...');
//   self.skipWaiting();

//   event.waitUntil(
//     caches.open('v1').then((cache) => {
//       return cache.addAll([
//         '/',
//         '/index.html',
//         '/src/scripts/index.js',
//         '/src/styles/styles.css',
//         '/src/scripts/pages/app.js',
//         '/src/public/manifest.webmanifest',
//         '/src/public/favicon.png',
//         '/src/scripts/database.js',
//         '/src/scripts/utils/index.js',
//         '/src/scripts/utils/useCamera.js',
//         '/src/scripts/utils/notification.js',
//       ]);
//     })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   if (
//     event.request.method !== 'GET' ||
//     event.request.url.startsWith('ws://') || event.request.url.startsWith('wss://')
//   ) return;

//   event.respondWith(
//     fetch(event.request)
//       .then((networkResponse) => {
//         const clonedResponse = networkResponse.clone();
//         caches.open('v1').then((cache) => cache.put(event.request, clonedResponse));
//         return networkResponse;
//       })
//       .catch(() => {
//         return caches.match(event.request).then((cachedResponse) => {
//           return cachedResponse || new Response('Data tidak tersedia offline', {
//             status: 503,
//             statusText: 'Service Unavailable',
//           });
//         });
//       })
//   );
// });


// self.addEventListener('push', (event) => {
//   event.waitUntil(
//     (async () => {
//       let data;
//       let notificationData = { title: 'Default Title', body: 'Default message body' };

//       try {
//         const registration = await self.registration.pushManager.getSubscription();

//         if (!registration) {
//           return;
//         }

//         if (event.data) {
//           try {
//             data = event.data.json();
//           } catch (e) {
//             data = { title: 'Notifikasi baru', body: event.data.text() };
//           }
//         }

//         notificationData.title = data.title || 'Default Title';
//         notificationData.body = data.body || 'Default message body';

//       } catch (e) {
//         console.error('Error during push event handling:', e);
//         notificationData.title = 'Error';
//         notificationData.body = 'Failed to process notification.';
//       }

//       await self.registration.showNotification(notificationData.title, {
//         body: notificationData.body
//       });
//     })()
//   );
// });


// self.addEventListener('message', (event) => {
//   console.log(`UI thread mengirim pesan: ${event.data}`);
// });



// import { precacheAndRoute } from 'workbox-precaching';

// precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/scripts/index.js',
        '/src/styles/styles.css',
        '/src/scripts/pages/app.js',
        '/src/public/manifest.webmanifest',
        '/src/public/favicon.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
});

self.addEventListener('fetch', async (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      let data;
      let notificationData = { title: 'Default Title', body: 'Default message body' };

      try {
        const registration = await self.registration.pushManager.getSubscription();

        if (!registration) {
          return;
        }

        if (event.data) {
          try {
            data = event.data.json();
          } catch (e) {
            data = { title: 'Notifikasi baru', body: event.data.text() };
          }
        }

        notificationData.title = data.title || 'Default Title';
        notificationData.body = data.body || 'Default message body';

      } catch (e) {
        console.error('Error during push event handling:', e);
        notificationData.title = 'Error';
        notificationData.body = 'Failed to process notification.';
      }

      await self.registration.showNotification(notificationData.title, {
        body: notificationData.body
      });
    })()
  );
});


self.addEventListener('message', (event) => {
  console.log(`UI thread mengirim pesan: ${event.data}`);
});


