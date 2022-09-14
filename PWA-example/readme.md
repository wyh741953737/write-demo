### PWA优势
适用于所有浏览器，能够借助serviceWorker在离线或者网络差时访问，可添加到桌面，像app一样，避免下载，和原生app一样，拥有首屏加载动画，可以隐藏地址栏，通过推送让客户回流

### 使用步骤
1：在根目录创建mainfest.json文件
2：在index。html中引入<link rel="mainfest" ref="mainfest.json" />
3：配置mainfest.json，需要在https或者http://localhost下面访问

### mainfest配置
name: 应用名称，启动动画中的文字
short name：简称，主屏幕显示
start url：启动设备时加载的url，一般配置首页路径
icons：图标144*144，数组
background color
theme color
display:app的显示模式，fullscreen全屏（不显示状态栏）， standlone， minimal-ui：看起来像独立应用程序，但是有浏览器地址栏

### Service Worker
离线或者网速差访问，提高体验，是一个独立的线程，不会抢资源，特殊的web worker
和web worker区别
1）都是基于https或者在http://localhost中访问。
2）webWorker是临时的，结果不能持久保存，下次同样复杂操作只能重新计算，而ServiceWorer一旦被install永远存在，除非手动删除
3）用到的时候可以直接被唤醒，不用就自动睡眠
4）可编程截取代理请求和返回，缓存文件，缓存的文件可以被网页进程取到，包括离线状态
5）离线内容开发者可控
6）异步实现，内部都是通过promise实现
Service Worker可以理解为代理服务器，它可以操作缓存（如果不怎么变动的就取缓存不请求服务器），也可以拦截请求响应，发送请求。
这样离线就取缓存的内容

### web worker
浏览器中的js是单线程的，一个时间内只能做一件事，如果在主线程中做计算会造成性能问题，w3c提供了web worker，做一些负责耗时的活，完成后通过postMessage通知主线程。它是独立运行的线程，不能操作DOM和BOM，基于https

使用：1：创建一个webworker
      const worker = new Worker('worker.js') // workder.js中做复杂计算
      2：计算结束通过self.postMessage(msg)给主线程发消息
      3：主线程通过worker.onmessage=function(msg) {}监听消息
      4：主线程也可以用同样的方式发送消息
### Service Worker的使用
1）在window.onload中注册service worker，防止和其它资源竞争(一进来就注册会和其它资源竞争)，navigation对象内置了serviceWorker属性，老版本浏览器不兼容，要进行浏览器兼容if('serviceWorker' in nagivator)
2）注册service worker，navigator.serviceWorker.register('./sw.js')返回一个promise对象

### fetch中的API
操作http，发送请求，早期只能XMLHttpRequest，
基于promise，可以在SW，Cache API中使用，XMLHttpRequest只能用在DOM里面
fetch(url,config)
response是一个二进制数据流，要调用res.json方法转换成json数据,得到的也是promise，return就可以实现链式调用

### cacheStorage
也是做缓存，专门配合SW实现资源缓存，caches的api类似于数据库的操作，
caches.open(cacheName).then(cache = {}) 打开缓存，返回一个匹配cacheName的chache对象的promise，类似于连接数据库
caches.keys()返回一个promise对象，包括所有的缓存的key（数据库名）
caches.delete(key)根据key删除对应缓存

cache.put(req,res)把请求作为key，并把对应响应存起来
cache.add(url)根据url发起请求，并把结果存起来
cache.addAll(urls)抓取一个urls数组，并把对应结果存起来
cache.match(req)获取req对应的res

### notification通知的api
notification.permission可以获取用户授权信息，default默认未授权，denied拒绝的，Granted授权的可以弹框
notification.requestPermission请求用户授权
new Notification('title',{body'c'})显示通知
在未授权时可以通过self.registration.showNotification('你好',{body:'msg'})显示通知

### 避免缓存跨域资源
只缓存满足以下条件的结果
1）响应状态码为200， 避免缓存304，404，50X等结果
2）响应类型为basic或者cors，即只缓存同源或者正确的跨域请求的结果，避免缓存错误的响应和不正确的跨域请求响应
对于接口，网络优先
