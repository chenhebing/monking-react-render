import merge from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import config from 'monking/lib/config';
import HappyPack from 'happypack';
import os from 'os';

import baseConfig, { postcssLoaderConfig, htmlWebpackPluginTemplate, htmlWebpackPluginChunks } from './webpack.base.config';

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

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
            use: 'happypack/loader?id=happyBabel',
            exclude: /node_modules/
        }, {
            test: /page[\\/][.-\w]*[\\/]index\.jsx?$/,
            loader: require.resolve('react-hot-loader-loader')
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: 'happypack/loader?id=happyStyle'
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
        new HappyPack({
            id: 'happyBabel',
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'babel-loader',
                options: {
                    plugins: ['react-hot-loader/babel']
                }
            }]
        }),
        new HappyPack({
            id: 'happyStyle',
            threadPool: happyThreadPool,
            loaders: [
                'css-hot-loader',
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[name]_[local]__[hash:base64:5]',
                        modules: true
                    }
                },
                postcssLoaderConfig,
                {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }
            ]
        })
    ]
});

devConfig.entry = Object.keys(devConfig.entry).reduce((result, item) => {
    result[item] = Array.prototype.concat.apply(['css-hot-loader/hotModuleReplacement'], devConfig.entry[item]);
    return result;
}, {});

export default devConfig;
