
// 0:未初始化还未发生请求，1：建立连接，还未open，2：已经open，3：正在请求，有部分响应数据可用了，4：响应完成。onreadyStateChange事件，当状态码发生变化会触发

function ajax(options) {
   if(options.method.toLowerCase() === 'post') {
       xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
   }
//    ajax请求
}