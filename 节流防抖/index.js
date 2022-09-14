    
    
// 节流： 一定时间内只会执行一次，每隔2秒执行一次，不管期间触发多少次
// 防抖：一定时间后执行一次，如果这个时间内再次触发，重新计时，比如电脑休眠，10分钟没有操作开始休眠，10分钟内再次触发，重新开始计时
// 一般使用在输入搜索字符一段时间后再去获取数据。


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


// // 防抖应用： 输入框，一段时间用户还输入，就重新计时
        // const input = document.getElementById('input');
        // let timeout;
        // input.addEventListener('keyUp',() => {
        //     const data = input.data
        //     clearTimeout(timeout);
        //     setTimeout(() => {
        //         mockData(data); // 2秒之后执行真正的操作
        //     }, 2000);
        // })
        // function mockData(data) {
        //     console.log(data)
        // }

        // 节流
        const body = document.getElementsByTagName('body')[0];
        let  timeOut;
        let flag = true;
        body.onscroll = () => {
            if(flag) { 
                console.log('111');
                flag = false;
                setTimeout(() => {
                    flag = true
                }, 2000);
            }
        }


        // 输入完毕过2秒查询
        function debounce(func, time) {
            let timeOut;
            return function() {
                if(timeOut) clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    func.apply(this)
                }, time);
            }
        }


        // 输入完立即查询
        function delayDebounce(func, time) {
            let timeOut;
            return function() {
                if(timeOut) clearTimeout(timeOut)
                let callNow = !timeOut
                timeOut = setTimeout(() => {
                    timeOut = null;
                }, time);
                if(callNow) func.apply(this)
            }
        }


        function debounce(fn, await, immediate) {
            const now = new Date(); // 23：45：00
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
        // const input = document.getElementById('input');
        // const executor = debounce(function(value) {
        //     console.log('fetch');
        //     return value;
        // }, 1000);
        // let value = null;
        // input.addEventListener('input', function(e) {
        //     executor.execute(e.target.value);
        //     value = executor.result;
        // })