---
sidebar: auto
---

# output

output选项指定webpack输出的位置，其中比较重要的也是经常用到的有path和publicPath。

## output.path
- 默认值 process.cwd()

output.path只是指示输出的目录，对应一个绝对路径，例如在项目中通常会做如下配置：

```js
output: {
	path: path.resolve(__dirname, '../dist'),
}
```
## output.publicPath
- 默认值 空字符串

官方解释：
::: tip
webpack 提供一个非常有用的配置，该配置能帮助你为项目中的所有**资源**指定一个**基础路径**，它被称为公共路径(publicPath)。
:::

这里说的所有资源的基础路径是指项目中引用css，js，img等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用，所以其实打包后资源的访问路径可以用如下公式表示：

> 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径

例如:

```js
output.publicPath = '/dist/'

// image
options: {
 	name: 'img/[name].[ext]?[hash]'
}

// 最终图片的访问路径为
output.publicPath + 'img/[name].[ext]?[hash]' = '/dist/img/[name].[ext]?[hash]'

// js output.filename
output: {
	filename: '[name].js'
}

// 最终js的访问路径为
output.publicPath + '[name].js' = '/dist/[name].js'

// extract-text-webpack-plugin css
new ExtractTextPlugin({
	filename: 'style.[chunkhash].css'
})
// 最终css的访问路径为
output.publicPath + 'style.[chunkhash].css' = '/dist/style.[chunkhash].css'
```

这个最终的资源访问路径在使用 html-webpack-plugin 打包后得到的html中可以看到，所以 publicPath设置成**相对路径**后，相对路径是相对于build之后的index.html的, 例如如果设置publicPath: `./dist/`，则打包后js的引用路径为 `./dist/main.js`

webpack.config.js 配置文件
```js {9}
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name][hash:6].js",
    path: path.resolve(__dirname, "dist"),
    publicPath:"./dist/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            // 用babel-loader 需要把es6转换成es5
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
}
```
打包出来的 html 的资源引用
```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack-publicPath</title>
</head>
<body>
  
<script src="./dist/main1832ee.js"></script></body>
</html>
```

::: tip
在真实的开发环境中，可以通过 process.env 来获取变量相关的信息
:::
