---
sidebar: auto
---

# Koa

## 使用koa快速搭建一个服务

```js
const Koa = require("koa")

// 使用koa 创建一个应用实例
const app = new Koa()

app.use((ctx) => {
  ctx.body = "hello koa"
})

// 监听3000端口，接收一个回调
app.listen(3000, function () {
  console.log(`serve start 3000`)
})
```
上面短短的几行代码已经创建了一个简单的服务, 启动服务后, 浏览器地址栏输入 `localhost:3000` 页面打印 `hello koa`

koa 在源码中是使用类实现的，所以初始化的时候，使用 `new Koa()` 来实例化。

实例上有一个use方法，这就是个中间件，接收一个函数，函数中有两个参数：
- ctx：上下文，每请求一次都会产生一个上下文 
- next：

koa 这种中间件的设计，可以将不同的功能，通过中间件进行解耦，代码更加容易扩展和维护。并且我们在项目中处理路由模块时候经常用到的fs path等模块，在ctx上下文中做了统一的封装，非常方便。

## 手写一般koa

### 环境的搭建

如何能做到，引用自己写的koa代码，而不是使用 `node_modules`的代码能。我们创建一个名叫 koa 的文件夹。里面创建一个lib目录。
```
-koa
  -lib
  -package.json
```

其中package.json main字段，设置成 `lib/application.js`

### 实现 use 和 listen 两个方法。

在上述代码中，先实现use 和 listen 两个方法的逻辑。


