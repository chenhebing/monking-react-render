import merge from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import config from 'monking/lib/config';
import VConsolePlugin from 'vconsole-webpack-plugin';

import ExposePlugin from './expose.plugin';

import baseConfig from './webpack.base.config';

const postcssLoaderConfig = config.postcssConfig ? 'postcss-loader' : {
    loader: 'postcss-loader',
    options: {
        config: {
            path: path.resolve(__dirname, '../postcss.config.js')
        }
    }
};

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
            test: /page[\\/]\w*[\\/]index\.jsx?$/,
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
                chunks: [name, ...((config.webpackConfig && config.webpackConfig.splitChunks) || []).map(item => item.name)],
                filename: `${name}.dev.html`,
                template: path.join(config.path.templates, config.template),
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeTagWhitespace: true
                }
            });
        }),
        new webpack.DefinePlugin({
            webpackDefineSpaServer: false,
            ...config.webpackDefinePlugin
        }),
        new FriendlyErrorsWebpackPlugin(),
        new VConsolePlugin({
            enable: !config.isProd && config.showVConsole
        }),
        new BundleAnalyzerPlugin({
            analyzerPort: config.port + 2,
            openAnalyzer: !!config.openAnalyzer
        }),
        new ExposePlugin({
            React: require.resolve('react'),
            ReactDOM: require.resolve('react-dom')
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                ...((config.webpackConfig && config.webpackConfig.splitChunks) || []).reduce((result, item) => {
                    result[item.name] = item;
                    return result;
                }, {})
            }
        }
    }
});

devConfig.entry = Object.keys(devConfig.entry).reduce((result, item) => {
    result[item] = Array.prototype.concat.apply(['css-hot-loader/hotModuleReplacement'], devConfig.entry[item]);
    return result;
}, {});

export default devConfig;
