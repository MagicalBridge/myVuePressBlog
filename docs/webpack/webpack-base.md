---
sidebar: auto
---

# 1.webpack基础
本质上, webpack是一个用于现代`JavaScript`应用程序的静态模块打包工具，当webpack处理程序的时候，它会在内部构建一个依赖图(dependency graph), 这个依赖图对应映射到项目所需要的每个模块，并生成一个或者多个`bundle`。

## 1.1如何安装
在 npm 项目中执行如下命令，可以安装对应的模块。
```bash
npm install  webpack webpack-cli --save-dev
```

## 1.2 入口(entry)
入口起点(entry point)指示，webpack应该使用哪个模块，来作为构建其内部依赖图(dependency graph)的开始，webpack会找出有哪些模块和库是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`,但是你可以通过在 `webpack configuration`中配置 entry 属性，来指定一个（或者多个）不同的入口起点。

### 1.2.1 src\index.js
我们在`src`目录中创建`index.js`,代码添加代码如下。

```js
let title = require('./title.txt');
document.write(title.default);
```

### 1.2.2 创建 webpack.config.js 文件
要想对webpack做更加详细的订制化配置，我们需要创建一个配置文件。
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
};
```

## 1.3 输出(output)

`output`属性告诉webpack在哪里输出它所创建的`bundle`,以及如何命名这些文件。

主要输出文件的默认值是 `./dist/main.js`,其他生成文件默认放置在 `./dist`文件夹中。

我们继续在 `webpack.config.js` 中添加 `output` 配置。


webpack.config.js
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  // 添加输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
};
```

## 1.4 loader
webpack 只能理解 `JavaScrit` 和 `JSON` 文件

loader 让webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖中

我们继续在 `webpack.config.js` 中添加 `loader` 配置。

webpack.config.js

```js
const path = require('path');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // 添加loader模块
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

## 1.5 插件(plugin)

`loader`用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

### 1.5.1 src/index.html

src/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
</body>
</html>
```

### 1.5.2 webpack.config.js

```js
const path = require('path');
// 引入 html-webpack-plugin 插件
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  // 新增加插件配置项
+  plugins: [
+    new HtmlWebpackPlugin({template: './src/index.html'})
+  ]
};
```

# 2.开发环境配置

## 2.1 开发服务器

### 2.1.1 安装服务器
```bash
npm install webpack-dev-server --save-dev
```

### 2.1.2 webpack.config.js

```js
module.exports = {
  //...其他配置
  devServer: {
    compress: true, // 是否压缩文件
    port: 8080, // 启动服务的端口
    open: true // 是否自动打开浏览器
  },
}
```

### 2.1.3 package.json

```json
  "scripts": {
    "build": "webpack",
+   "start": "webpack serve"
  }
```

## 2.2 支持CSS
- css-loader 用来翻译处理 @import 和 url() 这类css语法
- style-loader 可以把css插入到DOM中

### 2.2.1 安装模块

```bash
npm install style-loader css-loader -D
```

在`module`配置项中增加如下配置

### 2.2.2 webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
+     { test: /\.css$/, use: ['style-loader','css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### 2.2.3 src/bg.css

src/bg.css

```css
body {
  background-color: green;
}
```

### 2.2.4 src\index.css

src\index.css
```css
@import "./bg.css";
body{
  color:red;
}
```

### 2.2.5 src\index.js
src\index.js

```js
+import './index.css';
let title = require('./title.txt');
document.write(title.default);
```

