let total = 0
for (let i = 0; i < 100000000; i++) {
  total += i
}

// 发送消息给主线程
self.postMessage({ total: total })

self.addEventListener('message', e => {
  console.log(e.data)
})
