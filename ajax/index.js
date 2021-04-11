
// 0:未初始化还未发生请求，1：建立连接，还未open，2：已经open，3：正在请求，有部分响应数据可用了，4：响应完成。onreadyStateChange事件，当状态码发生变化会触发

function ajax(options) {
    const defaults = {
        type: 'get',
        data: {},
        url: '',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(){},
        error: function() {},
    }
    options = Object.assign(defaults, options);
    let params;
    for(let attr in options.data) {
        params += attr + '=' + options.data[attr] + '&';
    }
    params = params.substr(0, params.length-1);
    const xhr = new XMLHttpRequest;

    if(options.type.toLowerCase() === 'get') {
        options.url = options.url + '?' + params;
    }
    xhr.open(options.type, options.url);

    if(options.type.toLowerCase() === 'post') {
        const contentType = options.header['Content-Type']
       xhr.setRequestHeader('Content-Type',contentType);
       if(contentType === 'application/json') {
           xhr.send(JSON.stringify(options.data))
       } else {
           xhr.send(params);
       }
       xhr.send(params);
    } else if(options.type.toLowerCase() === 'get') {
        xhr.send();
    }
    xhr.onload = function() {
        if(xhr.status === 200) {
            const responseType = xhr.getResponseHeader('Content-Type');
            if(responseType.includes('application/json')) {
                options.success(JSON.parse(xhr.responseText));
            }
        } else {
            options.error(xhr.responseText, xhr);
        }
    }
}

//    ie不支持onload事件，要监听onreadyStateChange
//    ajax请求在低版本IE浏览器中，ajax请求有严重的性能问题，即在请求地址不发生变化情况下，只有第一次会发到服务器，之后都是从缓存中获取，即使服务器数据更新了
//  解决：保证请求参数值不一样就好了 xhr.open('get', 'http://...?+Math.random())
