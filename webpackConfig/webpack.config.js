const { resolve } =  require('path');
const HtmlWebpackPlugin  =  require('html-webpack-plugin');

module.exports =  {
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', // 创建style标签，将js中的样式插入head生效
                    'css-loader' // 将css变成commonjs模块加载到js
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'] // sass同样的道理
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader', //要下url-loader和file-loader
                options: {
                    limit: 8 * 1024, // 图片大小小于8kb就会被base64处理，减少请求数量，但是图片体积会更大
                    esModule: false,
                    name: '[hash:10].[ext]' // 取文件的hash10位，ext保留后缀名
                }   
            },
            {
                text: /\.html$/,
                loader: 'html-loader' //处理html中图片，负责引入img，从而被url-loader处理
                // url-loader默认使用es6模块处理，html-loader是commonjs，就会冲突，关闭url-loader的es6，使用commonjs
            },
            {
                exclude: /\.(css|js|html)$/,
                loader: 'file-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html' // 赋值html文件并自动引入打包输出·的所有资源
        })
    ],
    devServer: { // 特点：只会在内存中编译打包，不会有任何输出, npx来启动webpack
        contentBase: resolve(__dirname, 'build'), // 项目构建后路径
        compress: true, // 启动gzip压缩
        port: 3000,
        open: true // 自动启动浏览器
    },
    mode: 'development'
}