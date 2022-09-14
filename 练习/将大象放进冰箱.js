const openDoor = (cb) => {
  setTimeout(cd, 1000);
}

const putIn = (cb) => {
  setTimeout(cd, 3000);
}

const closeDoor = (cb) => {
  setTimeout(cd, 1000);
}

const done = () => {
  console.log('done')
}

// 将大象放进冰箱过程：先打开门，成功后，把大象放进去，成功后关门
openDoor(() => {
  putIn(() => {
    closeDoor(() => {
      done();
    })
  })
})
// 使用回调地狱实现，我们也可以使用Promise去实现

const open = (cb) => new Promise((res) => setTimeout(() => cb, 1000));
const put = (cb) => new Promise((res) => setTimeout(() => cb, 1000));
const close = (cb) => new Promise((res) => setTimeout(() => cb, 1000));


// 实现并行下载多个图片
const urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
]

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      resolve(img);
    }
    img.onerror = function () {
      reject(new Error('出错了'))
    }
  })
}

function load(urls, fn, limit) {
  const data = [];
  let p = Promise.resolve();
  const splitArr = (urls) => {
    let array = [];
    const base = Math.ceil(urls / limit); // 10/3向上取整4，10个url分成4组  base=4, limit=3
    for (let i = 0; i < base; i++) {
      array.push(urls.slice(i * limit, (i + 1) * limit));
    }
    return array;
  }
  // 得到的splitArr是[['u1', 'u2', 'u3', '],    ['u4','u5','u6'], ['u7','u8','u9'],    ['u10', 'u11']], 四个组
  const ajaxImg = (urlItem) => {
    return urlItem.forEach(url => loadImage(url));
  }
  const sliceUrls = splitArr(urls);
  sliceUrls.forEach(sliceUrl => {
    p = p.then(() => Promise.all(ajaxImg(sliceUrls))).then((res) => {
      data.push(res);
      return data;
    })
  })
  return p;
}

