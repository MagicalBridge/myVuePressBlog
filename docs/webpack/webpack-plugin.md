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

`apply`方法在 `webpack compiler` 安装插件时候会调用一次，`apply`接收 `webpack compiler` 对象实例的引用, 你可以在 compiler 对象实例上注册各种事件钩子函数，来影响 webpack 的所有构建流程，以便完成更多其他的构建任务。

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

上面的代码是一个可以创建 webapck 构建文件列表 markdown的plugin，实现上相对简单，但是呈现了一个webpack plugin的基本形态。



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

webpack 是基于`Node.js`开发的，plugin也不例外，所以 plugin 的调试和调试 Node.js 代码并无两样，简单的使用 console 来打印相关信息，复杂一点的使用断点，或者利用编辑器提供的功能，例如 VSCode 的 DEBUG。

## 深入hooks

看了上述 plugin 基础模样的例子，聪明的读者会发现，我们需要开发 plugin 时，最重要的就是了解和使用 webpack 提供的 hooks。

当开发需要时，我们可以查阅官方文档中提供的事件钩子列表：

[compiler hooks](https://webpack.js.org/api/compiler-hooks/)
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

上述提到的 webpack compiler 中使用了多种类型的事件钩子，根据其名称就可以区分是同步还是异步的，对于同步的事件钩子来说，注册事件方法tap可用，例如上述的 `shouldEmit` 应该这样来注册事件函数的：
```js
apply(compiler) {
  compiler.hooks.shouldEmit.tap('PluginName', (compilation) => { /* ... */ })
}
```

但是如果是异步的事件钩子，那么可以使用 tapPromise 或者 tapAsync 来注册事件函数，tapPromise 要求返回 Promsie 以便处理异步，而 tapAsync 则需要使用callback来返回结果，例如：

```js
compiler.hooks.done.tapPromise('PluginName', (stats) => {
  // 返回 promise
  return new Promise((resolve, reject) => {
    // 这个例子是写一个记录 stats 的文件
    fs.writeFile('path/to/file', stats.toJson(), (err) => err ? reject(err) : resolve())
  })
})

// 或者
compiler.hooks.done.tapAsync('PluginName', (stats, callback) => {
  // 使用 callback 来返回结果
  fs.writeFile('path/to/file', stats.toJson(), (err) => callback(err))
})

// 如果插件处理中没有异步操作要求的话，也可以用同步的方式
compiler.hooks.done.tap('PluginName', (stats, callback) => {
  callback(fs.writeFileSync('path/to/file', stats.toJson())
})
```

关于 webpack hooks 底层的实现，其实都是基于 webpack 作者开发的[tapable](https://github.com/webpack/tapable/)

而这个工具库提供的钩子类型远不止上述我们提到的这几种，多样化的钩子类型，主要是为了能够覆盖多种场景。

- 连续地执行注册的事件函数
- 并行地执行注册的事件函数
- 一个接一个地执行注册的事件函数，从前边的事件函数获取输入，即瀑布流的方式
- 异步地执行注册的事件函数
- 在允许时停止执行注册的事件函数，一旦一个方法返回了一个非undefined的值，就跳出执行流。

除了同步和异步的区别，我们再参考上述一些使用场景，以及官方文档的api, 进一步将事件钩子类型做一个区分。

名字带有 parallel 的，注册的事件会并行调用，如：
- AsyncParallelHook
- AsyncParallelBailHook

名称带有 bail 的，注册的事件函数会被顺序调用，直至一个处理方法有返回值（ParallelBail 的事件函数则会并行调用，第一个返回值会被使用）:
- SyncBailHook
- AsyncParallelBailHook
- AsyncSeriesBailHook

名称带有 waterfall 的，每个注册的事件函数，会将上一个方法的返回结果作为输入参数，如：
- SyncWaterfallHook
- AsyncSeriesWaterfallHook

通过上面的名称可以看出，有一些类型是可以结合到一起的，如 AsyncParallelBailHook，这样它就具备了更加多样化的特性。

了解了 webpack 中使用的各个事件钩子的类型，才能在开发 plugin 更好地去把握注册事件的输入和输出，同步和异步，来更好地完成我们想要的构建需求。


## Compiler 和 Compilation
上边提到的 hooks 基础类型是开发 plugin 的基石（虽然有的时候你用不到那么多类型的 hooks），而 webpack 的 compiler 和 compilation 提供的各种 hooks 和 api，则是开发 plugin 所必不可少的材料，这一部分的内容都在官方文档中有介绍：

- compiler 提供的 hook [compiler hooks](https://webpack.js.org/api/compiler-hooks/)
- compilation 提供的 hook [compilation hooks](https://webpack.js.org/api/compilation-hooks/)
- compilation 对象提供的 api [compilation api](https://webpack.js.org/api/compilation-object/)

我们简单介绍一下关键环节用到的部分，其他的内容希望读者们可以在 demo 中一一尝试来挖掘用法，来帮助自己更好地理解 webpack 构建过程和 compilation 的用法。

```js
class FlowPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap('FlowPlugin', (context, entry) => {
      // entry 配置被 webpack 处理好之后触发
      // console.log(`entryOption: ${entry}`);
    });

    compiler.hooks.beforeRun.tap('FlowPlugin', (compiler) => {
      // compiler 执行之前触发
      // 可以从参数 compiler 读取到执行前的整个编译器状态
      // console.log(compiler.options.plugins);
    });

    compiler.hooks.compilation.tap('FlowPlugin', (compilation) => {
      // 构建需要的 compilation 对象创建之后，可以从参数获取 compilation 读取到该次构建的基础状态
      // 通常 compilation 的 hooks 绑定一般也在该阶段处理
      // console.log(compilation);

      compilation.hooks.buildModule.tap('FlowPlugin', (module) => {
        // 一个模块开始构建之前，可以用于修改模块信息
        // 模块代码内容的转换依旧是应该 loader 来处理，plugin 着眼于其他信息的调整或获取
        // console.log(module);
      });

      compilation.hooks.finishModules.tap('FlowPlugin', (modules) => {
        // 所有模块都被成功构建时执行，可以获取所有模块的相关信息
        // console.log(modules);
      });

      compilation.hooks.chunkAsset.tap('FlowPlugin', (chunk, filename) => {
        // chunk 对应的一个输出资源添加到 compilation 时执行，可以获取 chunk 对应输出内容信息
        // module 也有 moduleAsset，但实际使用 chunk 会更多
        // console.log(chunk, '\n', filename);
      });
    });

    compiler.hooks.make.tap('FlowPlugin', (compilation) => {
      // compilation 完成编译后执行，可以从参数查看 compilation 完成一次编译后的状态
      // console.log(compilation);
    });

    compiler.hooks.shouldEmit.tap('FlowPlugin', (compilation) => {
      // 在输出构建结果前执行，可以通过该 hook 返回 true/false 来控制是否输出对应的构建结果
      return true;
    });

    compiler.hooks.assetEmitted.tap(
      'FlowPlugin',
      (file, content) => {
        // 在构建结果输出之后执行，可以获取输出内容的相关信息
        // console.log(content);
      }
    );

    compiler.hooks.done.tap('FlowPlugin', (stats) => {
      // 完成一次构建后执行，可以输出构建执行结果信息
      // console.log(stats);
    });

    compiler.hooks.failed.tap('FlowPlugin', (error) => {
      // 构建失败时执行，用于获取异常进行处理
      // console.log(error);
    });
  }
}

module.exports = FlowPlugin;
```

通过 compiler 和 compilation 的生命周期 hooks，读者们也可以更好地深入了解 webpack 的整个构建工作是如何进行的，以后也能更好地应对 webpack 构建中遇见的疑难杂症。




















