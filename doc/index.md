### 目录结构

使用 monking-react-render，需要按照如下约定创建client目录，也可以使用提供的脚手架 [monking-cli](https://github.com/chenhebing/monking-cli) 直接生成模板；服务端的约定请参考[monking 文档](https://github.com/chenhebing/monking)

<pre>

├── client
│   ├── asset       // 用于放置一些必须的静态资源文件
│   ├── component   // 前端公共组件，强业务组件推荐和页面放在一起
│   ├── page        // 用于放置页面，约定需要一个页面名称的文件夹，下面包含 index.js 作为入口文件
│   └── style       // 公共样式文件夹
├── server
│   └── template    // 渲染模板，模板名称可以在 config 中配置
│       └── layout.html

</pre>

### 更多

- [client 端](./client.md)
- [渲染模板 -- template](./template.md)