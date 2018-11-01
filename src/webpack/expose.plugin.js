export default class WebpackExposeRequirePlugin {
    constructor (options) {
        this.options = options;
    }

    apply (compiler) {
        compiler.hooks.make.tap('expose-require-plugin-compiler', (compilation) => {
            compilation.mainTemplate.hooks.beforeStartup.tap('expose-require-plugin-maintemplate', (source, chunk) => {
                const exposeMap = {};
                compilation.modules.forEach(module => Object.keys(this.options).some(key => {
                    if (this.options[key] === module.resource) {
                        exposeMap[key] = module.id;
                        return true;
                    }
                    return false;
                }));
                const exposeStr = Object.keys(exposeMap).map(item => `
                    window.${item} = __webpack_require__('${exposeMap[item]}');
                `).join('\n');
                return source + exposeStr;
            });
        });
    };
}
