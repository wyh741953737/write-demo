const path = require('path');
module.exports = {
    entry: '',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `myfile[contenthash:10].js`
    },
    rules: [
        {
            test: /\.(css|less)$/,
            use: [
                devMode ? MiniCssExtractionPlugin.loader: 'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            mode: 'local',
                            localIdentName: '[name]_[local]'
                        }
                    }
                }
            ]
        }
    ]
}