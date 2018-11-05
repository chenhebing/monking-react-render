import path from 'path';

const cwd = process.cwd();

const defaultPath = {
    public      : path.join(cwd, 'static'),
    client      : path.join(cwd, 'client'),
    lib         : path.join(cwd, 'lib'),
    pages       : path.join(cwd, 'client/page'),
    components  : path.join(cwd, 'client/component'),
    assets      : path.join(cwd, 'client/asset'),
    styles      : path.join(cwd, 'client/style'),
    templates   : path.join(cwd, 'server/template')
};

const alias = {
    '@page': defaultPath.pages,
    '@component': defaultPath.components,
    '@style': defaultPath.styles,
    '@asset': defaultPath.assets,
    '@lib': defaultPath.lib
};

export default {
    template: 'layout.html',
    ssrRender: true,
    onlyServer: false,
    path: defaultPath,
    alias,
    webpackConfig: {
        splitChunks: []
    },
    webpackPublicPath: false,   // webpack publicPath config
    devWebpckConfig: false,     // 自定义webpack config path
    postcssConfig: false,       // 自定义 postcss config path
    openAnalyzer: false,        // 是否打开webpack的bundle结果
    showVConsole: false         // 在测试环境，是否打开vconsole
};
