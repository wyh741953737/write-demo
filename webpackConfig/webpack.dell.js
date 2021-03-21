const { resolve } = require('core-js/fn/promise');
const webpack = require('webpack');
module.exports = {
    entry: {
        jquery: ['jquery']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dll'),
        libary: '[name]_[hash]' // 打包的库里面向外暴露出去的内容的名字
    },
    plugin: [
        new webpack.DllPlugin({
            name: '[name]_[hash]', // 映射库的暴露的内容名称
            path: resolve(__dirname, 'dll/mainfest.json') // 输出文件名字
        })
    ]
}

// 运行时候 webpack --config webpack.dll.js