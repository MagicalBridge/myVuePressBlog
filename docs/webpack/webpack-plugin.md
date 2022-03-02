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

## 编写plugin
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
class FileListPlugin {
  constructor() {
    // 读取plugin实例化时候传入的配置
  }
  apply(compiler) {
    // 在 compiler 的 emit hook 中注册一个方法，当 webpack 执行到该阶段时会调用这个方法
    compiler.hooks.emit.tap("FileListPlugin", (compilation) => {
      // 给生成的 markdown 文件创建一个简单标题
      let filelist = "In this build:\n\n";
      // 遍历所有编译后的资源，每一个文件添加一行说明
      for (var filename in compilation.assets) {
        filelist += "- " + filename + "\n";
      }
      // 将列表作为一个新的文件资源插入到 webpack 构建结果中
      compilation.assets["filelist.md"] = {
        source: function () {
          return filelist;
        },
        size: function () {
          return filelist.length;
        },
      };
    });
  }
}

module.exports = FileListPlugin;
```

## 调试plugin

你要在本地开发和调试 webpack plugin 是很容易的一件事情，你只需要创建一个 js 代码文件，如同上述的例子一样，该文件对外暴露一个类，然后在 webpack 配置文件中引用这个文件的代码，照样运行 webpack 构建查看结果即可。大概的配置方式如下：

```js
// 假设我们上述那个例子的代码是 ./plugins/FileListPlugin 这个文件
const FileListPlugin = require('./plugins/FileListPlugin.js')

module.exports = {
  // ... 其他配置
  plugins: [
    new FileListPlugin(), // 实例化这个插件，有的时候需要传入对应的配置
  ],
}
```

webpack 是基于 Node.js 开发的，plugin 也不例外，所以 plugin 的调试和调试 Node.js 代码并无两样，简单的使用 console 来打印相关信息，复杂一点的使用断点，或者利用编辑器提供的功能，例如 VSCode 的 DEBUG。

## 深入hooks

看了上述 plugin 基础模样的例子，聪明的读者会发现，我们需要开发 plugin 时，最重要的就是了解和使用 webpack 提供的 hooks。

当开发需要时，我们可以查阅官方文档中提供的事件钩子列表：

[compiler](https://webpack.js.org/api/compiler-hooks/)
[compilation hooks](https://github.com/webpack/webpack/blob/v4.42.1/lib/Compilation.js#L250)

我们可以看到在事件钩子列表中看到，webpack 中会有相当多的事件钩子，基本覆盖了 webpack 构建流程中的每一个步骤，你可以在这些步骤都注册自己的处理函数，来添加额外的功能，这就是 webpack 提供的 plugin 扩展。

如果你查看了前面 compiler hooks 或者 compilation hooks 的源码链接，你会看到事件钩子是这样声明的：

```js
this.hooks = {
  shouldEmit: new SyncBailHook(["compilation"]), // 这里的声明的事件钩子函数接收的参数是 compilation，
  done: new AsyncSeriesHook(["stats"]), // 这里接收的参数是 stats，以此类推
	additionalPass: new AsyncSeriesHook([]),
	beforeRun: new AsyncSeriesHook(["compilation"]),
  run: new AsyncSeriesHook(["compilation"]),
  emit: new AsyncSeriesHook(["compilation"]),
	afterEmit: new AsyncSeriesHook(["compilation"]),
	thisCompilation: new SyncHook(["compilation", "params"]),
  // ...
};
```

从这里你可以看到各个事件钩子函数接收的参数是什么，你还会发现事件钩子会有不同的类型，例如 SyncBailHook，AsyncSeriesHook，SyncHook，接下来我们再介绍一下事件钩子的类型以及我们可以如何更好地利用各种事件钩子的类型来开发我们需要的 plugin。

## hooks 类型













