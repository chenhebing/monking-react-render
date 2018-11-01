import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import { importFile } from 'monking/lib/util';

import devConfig from './webpack/webpack.dev.client.config';

export default async monking => {
    let compiler;
    if (monking.config.devWebpckConfig) {
        const customConfig = importFile(monking.config.devWebpckConfig);
        compiler = webpack(customConfig);
    } else {
        compiler = webpack(devConfig);
    }

    const middleware = await koaWebpack({
        compiler,
        devMiddleware: {
            publicPath: devConfig.output.publicPath,
            lazy: false,
            logLevel: 'error'
        },
        hotClient: {
            port: monking.config.port + 1
        }
    });
    monking.wss = middleware.hotClient.server;
    monking.webpackMemoryFs = middleware.devMiddleware.fileSystem;
    return middleware;
};
