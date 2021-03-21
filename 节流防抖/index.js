function debounce(fn, await, immediate) {
    const now = new Date(); 
    let lastTime = 0;
    let timer = null;
    let params = null;
    let _this = null;

    // 主要初始化的参数有：等待时间await，进来的时间startTime， 是否立即执行immediate，参数params

    // 延迟执行
    function later() {
        const nowTime = new Date(); // 23：45：01
        if(nowTime-lastTime < await) { // 如果还没到时间
            const remainTime = await - (nowTime - lastTime); // 距离到时还有多久：1秒
            timer = setTimeout(later, remainTime); // 1秒后再来执行later
        } else { // 如果到时了，执行这个函数，执行完将定时器清空，this清空
            deBouncer.result = fn.apply(_this, params);
            timer = null;
            _this = null;
            params = null;
        }
    }

    // 执行器
    function execute() {
        lastTime = new Date(); // 执行到这的时间
        _this = this; 
        params = arguments;
        try {
            if(immediate && timer === null) { // 如果是立刻执行并且时间为空
                deBouncer.result = fn.apply(_this, params);
            }
            return deBouncer.result;
        } finally {
            if(timer === null) {
                timer = setTimeout(later, await)
            }
        }
    }

    const deBouncer = {
        execute,
        result: null,
    }
    return deBouncer;

}
const input = document.getElementById('input');
const executor = debounce(function(value) {
    console.log('fetch');
    return value;
}, 1000);
let value = null;
input.addEventListener('input', function(e) {
    executor.execute(e.target.value);
    value = executor.result;
})


function throttle(fn, delay) {
    let valid = true;
    return function() {
        if(!valid) {
            return false;
        }
        valid = false;
        setTimeout(() => {
            fn();
            valid = true
        }, delay);
    }
}