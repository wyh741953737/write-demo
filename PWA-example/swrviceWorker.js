(function () {
  const hostname = window.location.hostname;
  // 判断是不是本地环境
  const islocalhost = Boolean(
    hostname === 'localhost' ||
    hostname === '[::1]' ||
    hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  )

  function urlBase64ToUnit8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64); // 解码base64编码的字符串
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  // 生成一个唯一id
  function createUuid() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join("");
  }
  // 获取cookis
  function getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  // 注册谷歌推送对象到自己的服务器
  function subscribeUser(swRegistration) {
    const applicationServerPubKey = 'xxx';
    const applicationServerKey = urlBase64ToUnit8Array('XXX');
    window.applicationServerKey = applicationServerKey;
    if (!swRegistration.pushManager) {
      return; // 不支持push server直接退出
    }
    let unitqueKey = localStorage.getItem('_UNITKEY_OF_GOOGLE_PUSH_');
    if (!unitqueKey) {
      // 给浏览器生产唯一id，只要缓存存在就不会重新生成，为了给推送标识唯一设备使用
      unitqueKey = createUuid() + Date.now();
      localStorage.setItem('_UNITKEY_OF_GOOGLE_PUSH_', unitqueKey);
    }
    swRegistration.pushManager.subscribeUser({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    }).then(subscription => { // 用户同意之后
      return fetch('/push/browser/deviceBind', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': getCookie('csrfToken')
        },
        body: JSON.stringify({
          userSystem: '1',
          subscription: JSON.stringify(subscription),
          unitqueKey
        })
      }).catch(err => { // 用户不同意
        console.log('Failed to subscribe the user', err)
      })
    })
  }

  // 注册有效的service worker
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker.register(swUrl).then(registration => {
      Notification.requestPermission(result => {
        if (result === 'granted') {
          subscribeUser(registration);
        }
      });
      // 如果发现有内容更新，那么会自动在后台进行安装，安装结束再判断状态并向用户提示
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 在这一步我们获取了预缓存的内容，但是之前的sw海缓存着旧的资源
              if (config && config.onUpdate) { // 执行回调
                config.onUpdate(registration);
              }
            }
          } else {
            // 这个节点所有数据都被缓存了，这里可提醒用户可以使用完整的缓存数据
            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      }
    }).catch(err => {})
  }
  // 检查sw状态
  function checkValidSW(swUrl, config) {
    fetch(swUrl).then(response => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload(); // 没有找到sw访问，很有可能不在同一个app，重新加载
          })
        })
      } else {
        registerValidSW(swUrl, config);
      }
    }).catch(err=> {})
  }
  // 取消注册
  function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
  // 注册sw
  function register(config) {
    // 如果是生产环境并且支持sw就注册，因为开发环境总是进行缓存，那要频繁的清除缓存才能会去最新内容
    if ('serviceWorker' in navigator) {
      const publicUrl = new URL('', window.location.href);
      if (publicUrl.origin !== window.location.href) {
        return; // 如果静态文件和当前环境不在同一个域名，注册就没有意义（跨域）
      }
      const swUrl = '/service-worker.js';
      // 如果是本地环境
      if (islocalhost) {
        checkValidSW(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('the web app is being served cache-first by a service')
        })
      } else {
        // 如果不是本地环境就注册sw
        registerValidSW(swUrl, config); 
      }
    }
  }
  islocalhost ? unregister() : register();
})();