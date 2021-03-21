import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import { plugins } from "../webpack.config";
import baseWebpackConfig from "./baseWebpackConfig";

const optionDefinitions =  [
    {name: 'analyze', type: Boolean, defaultValue: false}
]

const options = cmmandLineArgs(optionDefinitions);
const baseConfig = cloneDeep(baseWebpackConfig);
if(options.analyze)  {
    plugins.push(
        new BundleAnalyzerPlugin({
            analyzeMode: 'server',
            analyzeHost:  '127.0.0.1',
            analyzePort: '8888',
        })
    )
}

export default webpackMerge.smart(baseConfig, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                parraller:  true
            }),
            new OptimizeCssAssetsPlugin({})
        ]
    },
    plugins
})