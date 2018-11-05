import merge from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import config from 'monking/lib/config';

import baseConfig, { postcssLoaderConfig, htmlWebpackPluginTemplate, htmlWebpackPluginChunks } from './webpack.base.config';

const devConfig = merge(baseConfig, {
    output: {
        path: config.path.public,
        filename: '[name].js',
        library: 'APP',
        publicPath: config.webpackPublicPath || '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                plugins: ['react-hot-loader/babel']
            }
        }, {
            test: /page[\\/][.-\w]*[\\/]index\.jsx?$/,
            loader: require.resolve('react-hot-loader-loader')
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'css-hot-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[name]_[local]__[hash:base64:5]'
                    }
                },
                postcssLoaderConfig,
                'less-loader'
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        ...Object.keys(baseConfig.entry).map(name => {
            return new HtmlWebpackPlugin({
                chunks: [name, ...htmlWebpackPluginChunks],
                filename: `${name}.dev.html`,
                template: htmlWebpackPluginTemplate
            });
        }),
        new FriendlyErrorsWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerPort: config.port + 2,
            openAnalyzer: !!config.openAnalyzer
        })
    ]
});

devConfig.entry = Object.keys(devConfig.entry).reduce((result, item) => {
    result[item] = Array.prototype.concat.apply(['css-hot-loader/hotModuleReplacement'], devConfig.entry[item]);
    return result;
}, {});

export default devConfig;
