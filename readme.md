# monking-react-render

依赖于 [monking](https://github.com/chenhebing/monking)，为其提供前端渲染的支持。

### Installation

``` bash
$ # 强烈建议使用 yarn 安装依赖
$ yarn add monking-react-render
```
monking >= 1.0.0

### Configuration Middleware

monking-react-render 基于 koa-webpack 提供了前端热更新的支持，需要将其配置到 config 中，例如：

```javascript
// config/default.js

export default {
    middlewares: ['monking-react-render/lib/middleware']
};
```

### Using

monking-react-render 提供了 view 的修饰器，monking 中依赖注入了 render。

```javascript
// server/controller/home.js

import { Get } from 'monking';
import { view } from 'monking-react-render';

export default class Home {
    @Get('/home')
    @view('/home')
    async home (render) {
        render({
            title: 'home page'
        });
    }
}

```

### Expose Config


```javascript

export default {
    openAnalyzer: false,        // 是否打开webpack的bundle结果
    showVConsole: false,        // 是否打开vconsole
    webpackConfig: {
        splitChunks: []         //用于配置webpack split chunk
    }
};

```

### License

MIT