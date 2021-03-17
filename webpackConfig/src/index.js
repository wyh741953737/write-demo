import './index.css';
import './index.less';

function add(a, b) {
    return a+b;
}

add(1,2)

// 注册serviceworker
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js'),then(() => {}).catch(error => {})
    })
}