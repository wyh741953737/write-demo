const { resolve } =  require('path');
const HtmlWebpackPlugin  =  require('html-webpack-plugin');
const MiniCssExtracgtPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkBoxWebpackPlugin = require('workbox-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const cleanWebpaclPlugin = require('clean-webpack-plugin');

const { webpack } = require('webpack');

process.env.NODE_ENV = 'development'; // 开启开发环境css兼容处理

const commonCssLoader = [
    MiniCssExtracgtPlugin.loader,
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => [
                require('postcss-preset-env')()
            ]
        }
    },
    'less-loader' // less-loade将less转成css，再用postcss-preset-env对css进行兼容性处理，css-loader将css加载到js中，mincss提取成单独文件
]
module.exports =  {
    // entry: { // 多入口，一个入口输出一个bundle
    //     main: './src/index.js',
    //     test: './src/test.js'
    // },
    entry: './src/index.js',
    output: {
        filename: 'js[name].[contenthash:10].js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'eslint-loader', // eslint-loader要先检查，enforce：’pre优先执行
                options: {
                    fixed: true // 自动修复
                }
            },
           {
               oneof: [
                {
                    test: /\.css$/,
                    use: [...commonCssLoader],
                },
                        // 'style-loader', // 创建style标签，将js中的样式插入head生效
                        // MiniCssExtracgtPlugin.loader, // 生产环境：style-loader不能要，提取js中css成单独文件
                        // 'css-loader', // 将css变成commonjs模块加载到js
                        // postcss postcss-loader在webpack中用，还有用postcss-preset-env，能够帮助postcss识别环境，加载指定的配置
                        // postcss-preset-env帮助postcss找到package.json中browserlist里面的配置，通过配置加载指定的css兼容性样式
                        // "browserslist": {
                        //     "development": [
                        //       "last 1 chrome version",
                        //       "last 1 firefox version",
                        //       "last 1 safari version"
                        //     ],
                        //     "production": [
                        //       ">0.2%",
                        //       "not dead",
                        //       "not op_mini all"
                        //     ]
                        //   },
                        // 在开发过程中上面是按照生产环境配置的，开发环境中你要设置node环境变量 
                {
                        test: /\.less$/,
                        use: [...commonCssLoader]
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
                },
                // 1:bebel/preset-env只能转换基本语法，比如promise不能转换
                // 2:全部兼容性处理 @babel/polyfill,体积很大，在页面直接import "@babel/polyfill"
                // 3:按需加载指定兼容性的库 core-js
                {
                    test: /\.js$/,
                    exclude: /node_module/,
                    use: [
                        {
                            loader: 'thread-loader',
                            options: {
                                worker: 2 // 开启2个进程
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', // 预测包：babel提供一个平台转换es6，babel要靠babel-core（它也没这个能力，靠preset-env） preset-env里汇总很多插件，解析es6语法，简化了我们使用。
                                    {
                                        useBuiltIns: 'usage', // 按需加载只打包你引入但是浏览器没实现的， 默认false：polyfill全部引入， usage:按需， entry:
                                        corejs: {
                                            version: 3, 
                                        },
                                        targets: { // 指定兼容性做到哪个版本
                                            chrome: '60',
                                            firefox: '60',
                                            ie: '9',
                                            safari: '10',
                                            edge: '17'
                                        }
                                    }
                                ]
                                ],
                                cacheDirectory: true // 开启babel缓存，第二次构建的时候会读取之前的缓存
                            }
                        }
                    ]
                    // 缓存：babel缓存：cacheDirectory：true，让第二次打包构建速度更快
                    // 文件资源缓存：hash：每次webpack构建时都会生成一个唯一的hash，因为js和css共用一个hash，重新打包所有缓存失效
                    //  chunkhash：根据chunk生成hash值，css是在js中被引入的，所以属于同一个chunk
                    // contenthash：根据文件内容生成hash值，不同文件hash值一定不一样，让代码上线运行缓存更好用 
                }
               ]
           }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: { // 开启html压缩，移除空白，去除注释
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true, // 压缩内联css
            },
            template: './src/index.html' // 赋值html文件并自动引入打包输出·的所有资源
        }),
        new MiniCssExtracgtPlugin({
            filename: 'css/build.css' // 对单独提取的文件重命名，单独提取后是通过link标签引入的不会出现闪屏现象，js体积不会那么大，解析速度快点
        }),
        new OptimizeCssAssetsWebpackPlugin(), //压缩css 
        new WorkBoxWebpackPlugin.GenerateSW({
            clientsClaim: true, // 删除旧的serviceWorker
            skipWaiting: true // 帮助serviceWorker快速启动
        }),
        // 告诉webpack哪些库不参与打包，使用时候名称也得变
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包输出去，并在html中子弹引入
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        }),
        new cleanWebpaclPlugin(['dist']) // 清除dist文件
    ],
    optimization: {
        splitChunks: {
            chunks: 'all' // 将node_modules中代码单独打包成一个chunk输出，自动分析多入口文件中有没有共用文件，如果有会单独打包成一个
        }
    },
    devServer: { // 特点：只会在内存中编译打包，不会有任何输出, npx来启动webpack
        contentBase: resolve(__dirname, 'build'), // 项目构建后路径
        compress: true, // 启动gzip压缩
        port: 3000,
        open: true, // 自动启动浏览器
        hot: true, // 改一个模块全部重新打包，开启HMR模块热替换可以优化开发环境构建速度
        proxy: { 
            '/api': { 
                target: 'http://....',
                pathRewrite: {'/api': ''} // 不以/api开头
            }
        }
    },
    devTool: 'eval-source-map',
    externals: {
        jquery: 'jQuery' // 忽略jquery
    },
    mode: 'development' // 将环境改成production就会启动js压缩
}

// HMR： 样式文件style-loader实现了HMR，所以开发环境用style-loader，生产环境提取成单独文件
//      js文件默认不支持，需要修改js代码，if(module.hot){ module.hot.accept('./print.js', function() {})} 只能处理费js入口文件
//      html文件默认不能，html只有一个，它变全变，同时导致不能热更新了（修改没有重新打包），

// source-map  [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
// source-map 外部：错误代码准确信息，源代码错误位置
// inline-source-map, 内联构建速度快，只生成一个内联source-map。错误代码准确信息，源代码错误位置
// hidden-source-map 外部
// eval-source-map 内联，每个文件都生成对应的source-map
// nosource-source-map 外部
// cheap-source-map 外部 
// 内联：构建速度快，构建后体积大。外部：生成文件，内联没有

// 开发环境：速度快，调试友好
    // 速度快：eval>inline>cheap    eval-cheap-source-map eval-source-map
    // 调试友好： source-map cheap-module-source-map， cheap-source-map
    // eval-source-map（脚手架默认用的） 或者eval-cheap-module-source-map
// 生产环境： source-map cheap-module-source-map

// tree shaking:去除无用代码，减少代码体积前提是必须使用es6模块化，开启production环境。在package.json中配置："sideEffect":false所有代码都没有副作用都可以进行treeshaking
// 问题：可能会将css @babel.polyfill文件干掉 
// "sideEffect": ["*.css"] 保证css不会被treeshaking

// 代码分割：通过单入口和多入口。optimization: {splitChunk: 'all'}.
// 3: 通过import动态导入。将某个文件打包成单独文件 import(/* webpackChunkName: 'test'*/'./test').then({add} => {})
// 一般是单入口+optimization配置加import动态导入完成代码的分割

// lazy loading懒加载(延迟加载)， import(/* webpackChunkName*/test.js).then({add}=>{})
// 预加载prefetch，其他资源加载完浏览器会在空闲时加载js文件，，懒加载：文件需要的时候才加载 import(/* webpackChunkName: 'test', webpackPrefetch: true*/'.test').then({add} => {})

// PWA离线可以访问，workbox-webpack-plugin,在入口文件中判断并注册serviceworker，但是eslint不认识window navigator全局变量
// 需要修改package.json中eslintconfig "env": {"browser":true} 表示支持浏览器变量
// serviceworker必须运行在服务器上，nodejs，2：npm i server -g server启动服务器将build目录下所有资源作为静态资源暴露出去
// 多进程打包：优化打包速度 npm i thread-loader,一般给babel用。进程开启是要时间的，进程通信也要花时间，所以多进程打包给工作消耗时间长的用（js）

// externals：不打包，手动通过cdn引入。
// dell和externals类似，指定哪些包不参与打包， webpack将node_module打包成一个，dell将node_module中第三方库打包成不同chunk
