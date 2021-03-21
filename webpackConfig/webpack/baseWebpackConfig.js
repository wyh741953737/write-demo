import { entries } from "core-js/core/array";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { webpack } from "webpack";

export default {
    target:  'web',
    context: root,
    entry: entries,
    output: {
        path: path.join(root, outputPath),
        publicPath: server.h5root+'/',
        filename: 'script/[name].[contenthash:10].js'
    },
    optimization: { // 优化
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups : {
                vendors : {
                    chunks: 'initial',
                    test: vendorRex,
                    name: 'vendors',
                    priority: 10,
                    enforce: true
                },
                default: {
                    chunks: 'initial',
                    minChunks: 2,
                    name: 'commons'
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new MiniCssExtractPlugin({ // 从js中提取css
            filename:  'styles/[name].[contenthash:8].css',
            chunkFilename: 'styles/[name].[contenthash:8].css'
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss/,
            debug: true,
            options: {
                output: {
                    path: path.join(root,  outputPath)
                },
                context: root,
                sassLoader: {
                    includePath: [path.resolve(root, `${baseDir}/styles`)]
                }
            }
        }),
        new webpack.ProviderPlugin({
            fetch: 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd'
        }),
        new AssetsPlugin({
            filename: 'assetsManifest.json',
            path: env === 'development' ? `${root}/server/views` : `${root}/build/server/views`,
            pretttyPrint: true,
        }),
    ],
    module: {
        rules: [
            {
                test:  /\.(es6|js|jsx)$/,
                exclude: /node_modules/,
                loader: 'bable-loader',
                options: {
                    babelrc: false,
                    cacheDirectory: '.tmp/babel-loader',
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                corejs: 3,
                                useBuiltIns: usage,
                                targets: { browsers: SUPPORT_BROWSERS },
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-transform-modules-commonjs',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-syntax-import-meta',
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ['@babel/plugin-proposal-optional-chaining', { loose: true }],
                      ],
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: env !=='production',
                            modules: false,
                        }
                    },{
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer({browsers: SUPPORT_BROWSERS_CSS})]
                        }
                    }, {
                        loader: 'resolve-url-loader'
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap:  env !== 'production',
                            includePaths: ['client.styles']
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
                options: {
                    name: 'styles/fonts/[name].[contenthash:8].[ext]'
                }
            }, 
            {
                test: /\.(png|jp(e)?g|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[contenthash:8].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', 'js', 'es6'],
        modules: [root,  path.join(root, baseDir), 'node_modules']
    }
}