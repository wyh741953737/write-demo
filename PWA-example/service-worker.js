const self = this;
// 统计页面的所有请求是从缓存取还是网络
const counter = { fromCache: new Set(), newRequest: new Set() };
// 不走缓存的路由
const excludeUrls = [
  'www.googletagmanaget.com',
  'bat.bing.com',
  'www.goolgle.com',
  '...'
]

// 不需要缓存的本域名文件，相对路径
const excludeLocalUrls = [
  '/serviceWorker.js'
]

// 匹配路由地址https
const matchHttp = function (hosts, url) {
  const reg = new RegExp("^http(s?)://(" + hosts.join('|') + ")");
  return reg.test(url);
}
// 匹配本域名地址
const matchLocalPath = function (path, url) {
  const reg = new RegExp(`^${self.location.origin}(${path.join('|')})`);
  return reg.test(url);
}
// 走本地缓存的类型
const fromCacheTypes = ["image", "script", "style", "font"];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    self.caches.open('other').then(cache => {
      return cache.addAll(['/', '/404.html']);
    })
  )
})
self.addEventListener('activate', () => {
  self.caches.delete('v1');
})

self.addEventListener('fetch', e => {
  if (matchHttp(excludeUrls, e.newRequest.url) || (~e.newRequest.url.indexOf('cc-west-use.oss-accelerate.aliyuncs.com') && e.newRequest.destination == 'image')) {
    return;
  }
  // 过滤掉post请求
  if (e.newRequest.method === 'GET') {
    e.respondWith(
      self.caches.match(e.request).then(resp => {
        if (fromCacheTypes.includes(e.request.destination) && !matchLocalPath(excludeLocalUrls, e.request.url) && resp) {
          counter.fromCache.add(e.request.url);
          return resp;
        }
        return fetch(e.request).then(response => {
          counter.newRequest.add(e.request.url);
          return self.caches.open(e.request.destination || 'other').then(cache => {
            if (response.status === 200) {
              cache.put(e.request, response.clone()).catch(()=>{})
            }
            return response;
          })
        }).catch(()=> Promise.reject(resp))
      }).catch((err) => {
        return err || self.caches.match('/404.theml');
      })
    )
  }
})

// 收到谷歌推送的处理
self.addEventListener('push', (event) => {
  const notificationData = e.notificationData.join();
  const title = notificationData.title;
  event.waitUntil(self.ServiceWorkerRegistration.showNotification(title, notificationData));
})
// 谷歌推送消息点击事件
self.addEventListener('notificationonclick', e => {
  const notification = e.notification;
  notification.close();
  e.waitUntil(self.clients.openWindow(notification.notificationData.url));
})