---
sidebar: auto
---

# magicalUI

## 起步
首先搭建组价库的开发环境：

因为我们是业务组件，和我们的项目有比较强的依赖关系, 所以直接使用react脚手架进行搭建就可以。

### 创建react组件库项目

这里我们要创建ts项目

```bash
npx create-react-app magical-ui --template typescript
```
[官方参考链接](https://create-react-app.dev/docs/adding-typescript/)

这里安装的时候出现了一些小的插曲，执行上述命令没有反应，自己思考一下，原来是因为自己切换了公司的npm源，但是自己又没有开vpn，所以确实会有这个方面的问题。

npx是什么？
- 避免安装全局模块，npx可以运行它而不进行全局安装。就拿我们现在这个脚手架来说，可能只是创建项目的时候用到了，如果全局安装了会造成一种浪费。当我们执行上述代码的时候 它会先下载到一个临时目录，使用之后再删除。
- 调用项目内部安装模块。

### 编写一个ts组件

```ts
import React from "react"

interface IHelloProps {
  message?: string
}

const Hello: React.FunctionComponent<IHelloProps> = (props) => {
  return <h2>{props.message}</h2>
}

// 默认属性
Hello.defaultProps = {
  message:"hello world"
}

export default Hello
```

这里泛型放在函数的定义上，暂时还不明白为什么这么写。









