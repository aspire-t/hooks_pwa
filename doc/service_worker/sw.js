self.addEventListener('install', event => {
  console.log('install', event)
  // 让 service worker 跳过等待，直接进入activate状态
  // 等待skipWaiting结束，才进入到activate
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
  // 表示service worker激活后，立即获取控制权
  console.log('activate', event)
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  console.log('fetch', event)
})
