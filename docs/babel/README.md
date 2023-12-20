---
sidebar: auto
---

# Babel

## babel 的编译流程
babel 是 source to source 的转换，整体编译流程分为三步：
- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

## babel 常用的包说明

1. **@babel/preset-env**:  `@babel/preset-env` 是 Babel 的一个预设，它根据目标环境自动确定需要转换的语法和功能，从而使开发者不必手动配置每个转换。

假设你的项目使用了一些新的 ECMAScript 特性，比如箭头函数、模板字符串、let 和 const 等，而你希望在转换时只针对较老的浏览器，比如 Internet Explorer 11。在这种情况下，你可以创建一个 .babelrc 文件或在 package.json 中的 babel 字段中进行配置，指定 `@babel/preset-env`

```json
// .babelrc 文件中的配置
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "ie": "11"
        }
      }
    ]
  ]
}
// package.json 中的配置
{
  "babel": {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "ie": "11"
          }
        }
      ]
    ]
  }
}
```
在这个例子中，targets 指定了目标环境，即 Internet Explorer 11。@babel/preset-env 将会根据这个目标环境自动确定需要的转换，以确保你的代码在这个特定浏览器版本中能够正常运行。这样，你就不需要手动管理每个特性的转换配置，Babel 会帮你根据目标环境进行优化。

如果你在使用 `@babel/preset-env` 时没有指定 `targets` 属性，Babel 将会默认使用配置中的 browserslist 属性（如果存在的话）来确定目标环境。如果 browserslist 也不存在，那么默认情况下，`@babel/preset-env` 将转换为当前主流浏览器的最新两个版本。

举个例子，如果你的项目的 package.json 文件包含了 browserslist 配置，例如：

```json
{
  "browserslist": "> 0.5%, last 2 versions, Firefox ESR, not dead"
}
// > 0.5%: 包括全球使用量超过 0.5% 的浏览器版本。
// last 2 versions: 包括每个浏览器的最新两个版本。
// Firefox ESR: 包括 Firefox 的 ESR（Extended Support Release）版本。
// not dead: 排除那些已经被官方宣布为 "dead"（不再支持更新）的浏览器。
```

那么 `@babel/preset-env` 将会根据这个配置确定需要进行的转换。这样，你可以确保你的代码在项目目标浏览器范围内得到了适当的转换，而不需要手动指定 targets。

如果你没有在项目中设置 browserslist 且也没有手动设置 targets，@babel/preset-env 将默认转换为最新两个版本的主流浏览器。这样的默认配置通常适用于大多数项目，因为大多数开发者希望支持当前和上一个主流浏览器版本。


