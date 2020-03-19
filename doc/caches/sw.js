const CACHE_NAME = 'cache_v1'
// install主要用于缓存内容
self.addEventListener('install', async event => {
  // 开启一个cache，得到一个cache对象
  const cache = await caches.open(CACHE_NAME)
  // cache 对象就可以存贮数据，这里不用缓存sw.js
  await cache.addAll(['/doc/caches/index.html', '/doc/caches/index.css'])
  await self.skipWaiting()
})
// 清除旧的缓存
self.addEventListener('activate', async event => {
  const keys = await caches.keys()
  keys.forEach(key => {
    if (key !== CACHE_NAME) {
      caches.delete(key)
    }
  })
  await self.clients.claim()
})

// fetch 事件会再请求发送的时候 触发
// 判断资源是否能够请求成功，如果能够请求成功，就响应成功的结果，如果断网，请求失败了，读取caches缓存
self.addEventListener('fetch', event => {
  // 请求对象
  const req = event.request

  const url = new URL(req.url)

  // 不缓存不同源的数据
  // self.origin 也就是 location.origin
  if (url.origin !== self.origin) {
    return
  }

  if (req.url.include('/api')) {
    // 给浏览器响应
    event.respondWith(networkFirst(req))
  } else {
    event.respondWith(cacheFirst(req))
  }
})

// 网络优先
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME)
  try {
    // 先从网络读取最新的资源
    const fresh = await fetch(req)
    // 如果获取到了数据，应该要往缓存里面存一份数据
    // 把响应的备份存储到缓存中
    cache.put(req, fresh.clone())
    return fresh
  } catch (error) {
    // 从缓存中读取
    const cached = cache.match(req)
    return cached
  }
}

// 缓存优先，一般用于静态资源
async function cacheFirst(req) {
  // 从缓存中读取
  const cache = await caches.open(CACHE_NAME)
  const cached = cache.match(req)
  if (cached) {
    return cached
  } else {
    const fresh = await fetch(req)
    return fresh
  }
}
