import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `api-cache-v2`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'image' &&
              /\.(png|jpe?g|gif|webp|svg|avif|apng|bmp|ico|tiff?|blob)$/i.test(request.url),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }
        ],
      },
      manifest: {
        name: 'Story App - Dicoding Proyek Akhir',
        short_name: 'Story Apps',
        "description": "Aplikasi ini memungkinkan kamu untuk berbagi cerita dengan cara yang menyenangkan dan mudah. Seperti halnya Instagram Story, kamu bisa membuat cerita yang hanya bertahan selama 24 jam, memberi kesempatan untuk berbagi momen spesial dengan teman-teman tanpa meninggalkan jejak permanen. Dengan berbagai filter, teks, dan stiker yang bisa kamu tambahkan, setiap cerita yang kamu buat akan lebih menarik dan penuh warna. Aplikasi ini juga menawarkan kemudahan dalam menavigasi cerita orang lain, memungkinkan kamu untuk melihat momen mereka dengan cara yang interaktif. Terlebih lagi, aplikasi ini dirancang untuk memberikan pengalaman yang cepat dan responsif, sehingga kamu bisa berbagi cerita kapan saja dan di mana saja, baik di ponsel atau desktop.",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4a90e2',
        icons: [
          {
            src: '/icons/icon-123.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: "/screenshots/CityCareApp_001.png",
            sizes: "1920x1043",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/CityCareApp_002.png",
            sizes: "1920x1043",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/CityCareApp_003.png",
            sizes: "1920x1043",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/CityCareApp_004.png",
            sizes: "1080x2280",
            type: "image/png",
            form_factor: "narrow"
          },
          {
            src: "/screenshots/CityCareApp_005.png",
            sizes: "1080x2280",
            type: "image/png",
            form_factor: "narrow"
          },
          {
            src: "/screenshots/CityCareApp_006.png",
            sizes: "1080x2280",
            type: "image/png",
            form_factor: "narrow"
          }
        ],
        shortcuts: [{
          name: "Story Baru",
          short_name: "Baru",
          description: "Membuat story baru.",
          url: "/#/add",
          icons: [
            {
              src: "/icons/icon-123.png",
              type: "image/png",
              sizes: "512x512"
            }
          ]
        }]
      },

    }),

  ]
});

// import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';
// import { resolve } from 'path';

// export default defineConfig({
//   root: resolve(__dirname, 'src'),
//   publicDir: resolve(__dirname, 'src', 'public'),
//   // server: {
//   //   mimeTypes: {
//   //     'webmanifest': 'application/manifest+json'
//   //   }
//   // },
//   build: {
//     outDir: resolve(__dirname, 'dist'),
//     emptyOutDir: true,
//   },
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src'),
//     },
//   },
//   workbox: {
//     swDest: 'sw.workbox.bundle.js',
//     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
//     runtimeCaching: [
//       {
//         urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/.*$/,
//         handler: 'NetworkFirst',
//         options: {
//           cacheName: 'api-cache',
//           expiration: {
//             maxEntries: 50,
//             maxAgeSeconds: 60 * 60 * 24,
//           },
//         },
//       },
//       {
//         urlPattern: ({ request }) => request.destination === 'image',
//         handler: 'CacheFirst',
//         options: {
//           cacheName: 'images',
//           expiration: {
//             maxEntries: 20,
//             maxAgeSeconds: 60 * 60 * 24 * 7,
//           },
//         },
//       },
//     ],

//   },
//   plugins: [
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.svg', 'robots.txt'],
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
//       },
//       manifest: {
//         name: 'Story App - Dicoding Proyek Akhir',
//         short_name: 'Story Apps',
//         "description": "Aplikasi ini memungkinkan kamu untuk berbagi cerita dengan cara yang menyenangkan dan mudah. Seperti halnya Instagram Story, kamu bisa membuat cerita yang hanya bertahan selama 24 jam, memberi kesempatan untuk berbagi momen spesial dengan teman-teman tanpa meninggalkan jejak permanen. Dengan berbagai filter, teks, dan stiker yang bisa kamu tambahkan, setiap cerita yang kamu buat akan lebih menarik dan penuh warna. Aplikasi ini juga menawarkan kemudahan dalam menavigasi cerita orang lain, memungkinkan kamu untuk melihat momen mereka dengan cara yang interaktif. Terlebih lagi, aplikasi ini dirancang untuk memberikan pengalaman yang cepat dan responsif, sehingga kamu bisa berbagi cerita kapan saja dan di mana saja, baik di ponsel atau desktop.",
//         start_url: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#4a90e2',
//         icons: [
//           {
//             src: 'icons/icon-123.png',
//             sizes: '512x512',
//             type: 'image/png',
//           },
//         ],
//         screenshots: [
//           {
//             src: "screenshots/CityCareApp_001.png",
//             sizes: "1920x1043",
//             type: "image/png",
//             form_factor: "wide"
//           },
//           {
//             src: "screenshots/CityCareApp_002.png",
//             sizes: "1920x1043",
//             type: "image/png",
//             form_factor: "wide"
//           },
//           {
//             src: "screenshots/CityCareApp_003.png",
//             sizes: "1920x1043",
//             type: "image/png",
//             form_factor: "wide"
//           },
//           {
//             src: "screenshots/CityCareApp_004.png",
//             sizes: "1080x2280",
//             type: "image/png",
//             form_factor: "narrow"
//           },
//           {
//             src: "screenshots/CityCareApp_005.png",
//             sizes: "1080x2280",
//             type: "image/png",
//             form_factor: "narrow"
//           },
//           {
//             src: "screenshots/CityCareApp_006.png",
//             sizes: "1080x2280",
//             type: "image/png",
//             form_factor: "narrow"
//           }
//         ],
//         shortcuts: [{
//           name: "Story Baru",
//           short_name: "Baru",
//           description: "Membuat story baru.",
//           url: "/#/add",
//           icons: [
//             {
//               src: "icons/icon-123.png",
//               type: "image/png",
//               sizes: "512x512"
//             }
//           ]
//         }]
//       },
//     })
//   ]
// });
