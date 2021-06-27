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

// 监听3000端口
app.listen(3000, function () {
  console.log(`serve start 3000`)
})
```
上面短短的几行代码已经创建了一个简单的服务, 启动服务后, 浏览器地址栏输入 `localhost:3000` 页面打印 `hello koa`

