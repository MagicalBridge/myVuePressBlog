---
sidebar: auto
---

# webpack plugin

## 初始化环境
 
为了演示自己编写的plugin的功能时候正常，我们可以创建一个开发环境:
- 首先安装 webpack webpack-cli
- 创建配置文件 webpack.config.js

```json
{
  "name": "update-blog-plugin",
  "version": "0.1.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.config.js"
  },
  "keywords": [],
  "author": "chupengfei <chupengfeiit@gmail.com> (https://github.com/MagicalBridge)",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.69.1",
    "webpack-cli": "^4.9.2"
  }
}
```

webpack.config.js

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  mode: "development",
  plugins: [
  ],
};
```

- 创建 plugins 文件目录，存放自己编写的plugins

首先编写第一个同步的plugin。


```js
// done
class DonePlugin {
  constructor() {
  }
  apply(compiler) {
    console.log(1)
    // 调用hooks done 流程的 tap 方法，接收一个回调函数
    compiler.hooks.done.tap("DonePlugin", (stats) => {
      console.log("编译完成");
    });
  }
}

module.exports = DonePlugin
```

从上面的代码可以看出，plugin的实现可以是一个类，使用时候传入相关的配置来创建一个实例，然后放到配置的`plugins`字段中，而 plugin 实例中最重要的方法是 `apply`。

`apply`方法在webpack compiler 安装插件时候会调用一次，`apply`接收 webpack compiler 对象实例的引用,你可以在 compiler 对象实例上注册各种事件钩子函数，来影响 webpack 的所有构建流程，以便完成更多其他的构建任务。

> 事件钩子可以理解为当 webpack 运行中执行到某个钩子的状态时，便会触发你注册的事件，即发布订阅模式。

我们再来看一个例子：

```js

```





