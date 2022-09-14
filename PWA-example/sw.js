// serviceWorker最重要的就是缓存，在这些逻辑
// serviceWorker生命周期，主要有3个，
// install事件会在SW注册成功时候触发，主要用于缓存资源、只要sw改变就触发
// active事件会在SW激活时候触发，主要用于删除旧的资源
// fetch事件会在发送请求时候触发，主要用于操作缓存或者读取网络资源，收到任意资源时候触发
// 如果sw.js发生改变，install事件会重新触发，active会在install事件后触发，但是如果已经存在，那么处于等待状态，直到当前SW终止
// 通过self.skipWaiting()方法跳过等待，返回一个promise对象
// 通过event.waitUntil()方法会在promise结束后才会结束当前声明周期函数，防止浏览器在异步操作之前就停止了生命周期
// SW激活后会在下一次刷新页面的时候生效，可以通过self.clients.claim()立即获取控制权

const CACHE_NAME = 'cache_V1';
// 主要用来缓存内容
self.addEventListener('install',async event => {
  // 会让SW跳过等待，直接进入到active状态,skipWait返回一个promise对象是异步的，导致还没执行下面的active监听就执行完了
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll([
    '/',
    '/image/logo.png',
    '/index.css',
    '/mainfest.json'
  ])
  // event.waitUntil(self.skipWaiting());
  self.skipWaiting(); // 上面用了await就不用waituntil了
  // 等待skipWaiting结束再进入active状态；
})

// 主要用来清除缓存
self.addEventListener('activate', async event => {
  const keys = await caches.keys();
  keys.forEach(key => {
    if (key !== CACHE_NAME) {
      caches.delete(key);
    }
  })
  self.clients.claim();
//  / event.waitUntil(/self.clients.claim()); // SW被注册后要再下一次刷页面才生效，这行代码可以立即获取控制权
})

// 获取请求和响应,判断资源是否能够请求，能够请求就响应成功的结果，断网或者请求失败就读取缓存
self.addEventListener('fetch', event => {
  const req = event.request; // 得到请求对象
  const url = new URL(req.url); // 通过URL实例化的对象，直接获取req.url是字符串
  if (url.origin !== self.origin) { // 说明不同源
    return;
  }
  if (req.url.includes('/api')) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
})

// cache优先，适用于静态资源
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME); // 先打开缓存
  const caches = await cache.match(req); // 获取req对应的响应结果
  if (cached) { // 如果缓存中有直接返回
    return cached;
  } else { // 缓存中没有走网络请求 
    return fetch(req);
  }
}
// 网络优先,获取了结果就往缓存里存
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fetch = await fetch(req);
    cache.put(req, fetch.clone()); // 把响应的备份存起来
    return fetch;
  } catch(e) {
    const cached = await cache.match(req);
    return cached;
  }
}