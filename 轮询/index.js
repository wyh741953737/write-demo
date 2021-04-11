let timerId;
function getData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({data: '我是模拟请求返回的数据'})
        }, 1000);
    })
}

async function start() {
    const {data} = await getData();
    console.log(data)
    timerId = setTimeout(start, 1000); // 每隔1秒调用start获取数据
}
start();

function stop() {
    clearTimeout(timerId);
}

const button = document.querySelector('#button');
let isPlay = true;
button.addEventListener('click', function() {
    isPlay = !isPlay;
    button.innerHTML = isPlay ? '暂停' : '播放';
    isPlay ? start() : stop();
}, false)