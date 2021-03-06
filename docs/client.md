# client 端

monking-react-render 提供了服务端渲染，单页及多页可以同时共存。

通过修改 config 中 ssrRender 为 false，去除服务端预取的数据，那么也可以作为客户端渲染来使用。

### 目录结构

<pre>
├── client
│   ├── asset
│   │   └── img
│   │   └── font
│   ├── component
│   ├── page
│   │   ├── home
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   └── spa
│   │       ├── action
│   │       │   └── index.js
│   │       ├── index.js
│   │       ├── lib
│   │       │   └── index.js
│   │       ├── reducer
│   │       │   └── index.js
│   │       ├── router
│   │       │   └── index.js
│   │       └── view
│   │           ├── router1
│   │           │   └── index.js
│   │           └── router2
│   │               ├── index.css
│   │               └── index.js
│   └── style
├── server
│   └── template    // 渲染模板，模板名称可以在 config 中配置
│       └── layout.html
</pre>

#### page

client 端最重要核心的部分是 page 目录，我们约定，如果page为一级目录，那么二级目录必须包含 index.jsx 作为 webpack 打包的入口文件。

##### 多页

我们这边给的例子没有引入 redux，使用最基本的 react 开发；props是服务端渲染的预取数据。

```js
// home/index.jsx

import React, { Component } from 'react';
import { className } from './index.css';

export default class Home extends Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
        console.log('home page test');
    }
    render () {
        return (
            <div className={className}>
                <div onClick={this.handleClick}>
                    {this.props.title}
                </div>
            </div>
        );
    }
}

```

##### 单页

引入了 react-router 来管理路由、react-redux 来管理状态，单页的应用和多页可以同时存在项目中，我们可以根据不同的应用场景，选择使用单页还是多页。

```js
// spa/index.jsx

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

import { create } from './lib';
import RouterAPP from './router';

const clientRender = () => {
    const store = create(window.__INITIAL_STATE__);
    return () => (
        <Provider store={store}>
            <BrowserRouter>
                <RouterAPP></RouterAPP>
            </BrowserRouter>
        </Provider>
    );
}

// 供服务端渲染使用，请保持与 clientApp 一致
const serverApp = (props) => {
    const state = props;
    const store = create(state);
    return (
        <Provider store={store}>
            <StaticRouter location={state.url} context={state}>
                <RouterAPP></RouterAPP>
            </StaticRouter>
        </Provider>
    );
};

// eslint-disable-next-line
const App = webpackDefineSpaServer ? serverApp : clientRender();

export default App;
```

#### HMR

monking 中实现了服务端的局部热更新；monking-react-render 实现了客户端热更新，极大的提高了开发效率。大多数情况对开发人员来说都是无感知的，但是由于 redux 维护的 state 不会被 react-hot-loader 保留，所以对于使用 redux 的应用，生成 reducer 的需要手动热更新 reducer的 state 变化。



```js
// lib/index.js

import { createStore } from 'redux';

import reducer from '../reducer';

export const create = (state) => {
    const store = createStore(reducer, state);
    if (module.hot) {
        module.hot.accept('../reducer', () => {
            const nextReducer = require('../reducer').default;
            store.replaceReducer(nextReducer);
        })
    }
    return store;
};
```

#### alias

config 中定义了如下alias： @page、@component、@style、 @asset 和 @lib，你也可以在 config 中配置更多的alias
