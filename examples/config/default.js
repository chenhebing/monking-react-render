export default {
    middlewares: [require.resolve('../../src/middleware.js')],
    pluginConfig: [require.resolve('../../src/config.js')],
    webpackConfig: {
        splitChunks: [{
            name: 'vendor',
            priority: 0,
            chunks: 'initial',
            enforce: true
        }, {
            name: 'react.and.react-dom',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 10,
            chunks: 'initial',
            enforce: true
        }]
    }
};
