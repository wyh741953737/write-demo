请求报文：
  请求行：请求方式,路径
  请求头：host,cookie,content-type,withCreditends,cache-control，useragent，accept，
  请求体：请求参数
响应报文
  响应行：状态码，消息
  响应头：content-Type，set-cookie
  响应体：

  状态码：
    100消息
    200成功
    300:重定向
    401：未授权的
    403：资源没有改变
    500服务器内部错误无法完成请求

请求方式：
get 参数路径后不安全
post：参数请求体，安全
head：和get类似，只返回响应头
put：更新
options：预检，发起一个跨域请求时检测访问到能支持的请求方式，第一次请求返回201
delete：删除
trace：检测数据如何被篡改

请求参数：
query查询参数，放在url后，敏感的不要用，有长度限制
params：参数保存在url后，url/id/age
请求体参数：urlencoded格式a=b&c=d     json格式：{name:'a'}



### axios特点
基于promise的异步请求，浏览器node都能用，支持请求和响应拦截器，支持请求取消，请求响应数据转换，批量发多个请求

axios({
  url:'',
  method: '',
  params: {} //params携带的query参数
  data: {} // data携带请求体参数，默认是json编码
})


axios.create根据指定配置创建一个新的axios。新的axios没有取消请求和批量请求的方法，其他都一致，设计这个api的目的是项目
中有部分接口需要的配置和另一部分接口需要的配置不太一样
请求拦截器：对请求做统一处理，追加请求头，请求参数，界面loading等
响应拦截器：对成功数据和失败的处理，
取消请求：axios.cancelToken
let cancel；
axios({
  url:'',
  cancelToken: new cancelToken((c) => {
    cancel = c
  })
})
其他地方调用c函数执行取消发送请求，isCancel可以用了判断是否是用户取消请求
批量发送多个请求
axios.all([一个个promise实例]).then()