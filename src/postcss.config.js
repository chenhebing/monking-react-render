module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-preset-env': {
            browsers: 'cover 99.5%'
        },
        'cssnano': {
            'preset': 'advanced',
            'autoprefixer': false,
            'postcss-zindex': false
        }
    }
};
