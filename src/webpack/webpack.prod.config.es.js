import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config from 'monking/lib/config';

import baseConfig, { postcssLoaderConfig, htmlWebpackPluginTemplate, htmlWebpackPluginChunks } from './webpack.base.config';

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
                chunks: [name, ...htmlWebpackPluginChunks],
                filename: `${name}.html`,
                template: htmlWebpackPluginTemplate,
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
        })
    ]
});

export default clientConfig;
