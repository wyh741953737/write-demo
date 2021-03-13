开发环境和生产环境将es6模块化编译成浏览器能识别的文件

开发环境比生产多一个压缩的js文件
webpack本身只能识别js和json不能识别css和图片

处理样式：

处理html(插件）： html-webpack-plugin,
    new HtmlWebpackPlugin()