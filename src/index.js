import React from 'react';
import ReactDomServer from 'react-dom/server';
import path from 'path';
import fs from 'fs';
import serializeJs from 'serialize-javascript';
import handlebars from 'handlebars';
import moduleAlias from 'module-alias';
import hook from 'css-modules-require-hook';

import assethook from 'asset-require-hook';

import { importFile } from 'monking/lib/util';
import config from 'monking/lib/config';

moduleAlias.addAliases(config.alias);

hook({
    generateScopedName: '[name]_[local]__[hash:base64:5]',
    ...(config.cmrhConf ? config.cmrhConf : {})
});

assethook({
    extensions: ['png', 'jpg', 'jpeg', 'gif']
});

const view = (pagePath) => {
    global.webpackDefineSpaServer = true;
    // 这边本来是可以依赖注入的，但是babel转码的时候，将参数名字改变了，依赖注入失效
    const viewHtmlSsr = (context) => (locals) => {
        const staticPath = config.path.public;
        const mfs = context.app.webpackMemoryFs;
        const fileContent = config.isProd
            ? fs.readFileSync(path.join(staticPath, pagePath, 'index.html'), 'utf8')
            : mfs.readFileSync(path.join(staticPath, pagePath, 'index.dev.html'), 'utf8');
        const page = importFile(path.join(config.path.pages, pagePath, 'index'));
        const $react = ReactDomServer.renderToString(React.createElement(page, locals));
        context.type = 'text/html';
        context.body = handlebars.compile(fileContent)({
            $react,
            $initState: serializeJs(locals),
            ...locals
        });
    };
    const viewHtml = (context) => () => {
        const staticPath = config.path.public;
        const mfs = context.app.webpackMemoryFs;
        const fileContent = config.isProd
            ? fs.readFileSync(path.join(staticPath, pagePath, 'index.html'), 'utf8')
            : mfs.readFileSync(path.join(staticPath, pagePath, 'index.dev.html'), 'utf8');
        context.type = 'text/html';
        context.body = fileContent;
    };

    if (config.ssrRender) {
        importFile(path.join(config.path.pages, pagePath, 'index'));
    }

    return (controller, action) => {
        controller.__view = controller.__view || {};
        controller.__view.pagePath = controller.__view.pagePath || {};
        controller.__view[action] = config.ssrRender ? viewHtmlSsr : viewHtml;
        controller.__view.pagePath[action] = pagePath;
    };
};

export { view };
