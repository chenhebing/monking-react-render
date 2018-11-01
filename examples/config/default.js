export default {
    middlewares: [require.resolve('../../src/middleware.js')],
    webpackConfig: {
        splitChunks: [{
            name: 'vendor',
            priority: 0,
            chunks: 'all'
        }, {
            name: 'react.and.react-dom',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 10,
            chunks: 'initial'
        }]
    }
};
