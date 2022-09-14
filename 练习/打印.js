const printRequest = function(url) {
  return new Promise((resolve, reject) => {
    const isLink = url.every(item => LINK.test(item.url));
    if (!isLink) return reject({ type: 'urlError', message: '打印链接错误' });
    let xhr = new XMLHttpRequest();
    xhr.open('post', `http://127.0.0.1:7777/storehouse/print/printPdf`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
      if (xhr.status == 200 && xhr.readyState == 4) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject({ type: 'serviceError', message: '服务报错' });
      }
    };
    xhr.onerror = e => {
      // 接口未找到说明服务未启动
      reject({ type: 'noService', message: '打印服务未安装/启动' });
    };

    xhr.send(JSON.stringify(url));
  });
};


const LINK = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
// 下载链接
const downloadUrl = 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/printservice/CJ-Print.exe';
