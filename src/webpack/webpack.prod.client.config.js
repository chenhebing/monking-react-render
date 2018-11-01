import merge from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import VConsolePlugin from 'vconsole-webpack-plugin';
import config from 'monking/lib/config';

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

const clientConfig = merge(baseConfig, {
    output: {
        path: config.path.public,
        filename: '[name].[chunkhash].js',
        library: 'APP',
        publicPath: config.webpackPublicPath || '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
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
        new CleanWebpackPlugin(['static'], {
            root: config.path.root,
            exclude: ['favicon.ico'],
            verbose: false,
            dry: false
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
        ...Object.keys(baseConfig.entry).map(name => {
            return new HtmlWebpackPlugin({
                chunks: [name, ...((config.webpackConfig && config.webpackConfig.splitChunks) || []).map(item => item.name)],
                filename: `${name}.html`,
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
        new VConsolePlugin({
            enable: !config.isProd && config.showVConsole
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

export default clientConfig;
