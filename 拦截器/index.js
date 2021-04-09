
function InterceptorManager(){
    this.handlers = [];
}

InterceptorManager.prototype.use = function (fulfilled,rejected) {
    this.handlers.push({
        fulfilled,
        rejected
    })
}

function Axios(instanceConfig){
    this.defaults = instanceConfig;
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
    }
}
Axios.prototype.request = function (config) {
    function dispatchRequest(){
        const method = (config.method || "get").toUpperCase();
        return new Promise((resolve,reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300){
                        const data = JSON.parse(xhr.responseText);
                        const headers = xhr.getAllResponseHeaders();
                        const request = xhr;
                        const status = xhr.status;
                        const statusText = xhr.statusText
                        resolve({
                            config,
                            data,
                            headers,
                            request,
                            status,
                            statusText
                        });
                    }else{
                        reject("请求失败"+xhr.status+xhr.statusText);
                    }
                }
            }

            if(typeof config.params === "object"){
                // 将object 转为 urlencoded {a:1,b:2} a=1&b=2
                const arr = Object.keys(config.params);
                const arr2 = arr.map(v=>v+"="+config.params[v]);
                const url = arr2.join("&");
                config.url +=  "?" + url;
            }
            xhr.open(method,config.url);
            if(method === "POST" || method === "PUT" || method === "PATCH"){
                if(typeof config.data === "object")
                    xhr.setRequestHeader("content-type","application/json");
                else if(typeof config.data === "string")
                    xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
                    xhr.send(JSON.stringify(config.data));
            }else{
                xhr.send();
            }

        })
    }
    // dispatchRequest 发送请求，undefined 用来补位
    var chain = [dispatchRequest, undefined];

    this.interceptors.request.handlers.forEach(interceptor=>{
        chain.unshift(interceptor.fulfilled,interceptor.rejected)
    })

    this.interceptors.response.handlers.forEach(interceptor=>{
        chain.push(interceptor.fulfilled,interceptor.rejected);
    })

    let promise = Promise.resolve(config);

    // 如果链条长度不为 0
    while (chain.length){
        // 依次取出 chain 的回调函数, 并执行
        promise = promise.then(chain.shift(),chain.shift())
    }
    return promise;
}


function createInstance(defaultConfig){
    const context = new Axios(defaultConfig);
    Axios.prototype.request.bind(context);

    var instance = Axios.prototype.request.bind(context);

    Object.keys(Axios.prototype).forEach(method=>{
        instance[method] = Axios.prototype[method].bind(context)
    })
    Object.keys(context).forEach(attr=>{
        instance[attr] = context[attr];
    })
    return instance;
}

export default createInstance;