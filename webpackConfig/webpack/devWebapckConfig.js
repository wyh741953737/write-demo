import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { webpack } from 'webpack';
import webpackMerge from 'webpack-merge';
import baseWebpackPlugin  from './baseWebpackConfig';

const baseCig =  deepclone(baseWebpackPlugin);

let entries =  baseCig.entries;
Object.keys(entries).forEach(key=> {
    const val = entries[key];
    if(!Array.isArray(val)) {
        entries[key] =  [hotDevServer, hotMiddlewareScript].concat(entries[key])
    }
})

baseCig.entries = entries;

const devConfig  =  webpackMerge.smart(baseConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
        filename: 'scripts/[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module : {
        rules: [
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            }
        ]
    }
})
devConfig.plugins.splice(1,1,new MiniCssExtractPlugin({
    filename: '',
    chunkFilename: ''
}))

export default devConfig;