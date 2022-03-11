---
sidebar: auto
---

# promisify函数的实现

将基于回调的api，改写成基于promsie的。这样用起来比较方便。

我们一般读取文件，使用的是下面这样的语法：

```js
var fs = require("fs")
var path = require("path")

fs.readFile(path.resolve(__dirname, "file.txt"), function (err, data) {
  if (err) return console.error(err)
  console.log(data.toString())
})
// 上面能够打印 内容
```

如果借用 promisify函数，包装处理过后，会是这样的用法：
```js
let fs = require("fs")
let path = require("path")
const util = require("util")
const readFile = util.promisify(fs.readFile)

readFile(path.resolve(__dirname, "file.txt")).then(
  (data) => {
    console.log(data.toString())
  },
  (err) => {
    console.log(err)
  }
)
```

被 util.promisify 包装后函数，可以使用promise方式调用。

```js
var fs = require("fs")
var path = require("path")
const util = require("util")

function promisify(fn) {
  // 首先包装过的之后还行执行，说明返回的是一个函数
  return function (...args) {
    return new Promise((resolve, reject) => {
      // 内部的回调函数还是需要自己写
      fn(...args, (err, data) => {
        if(err) reject(err)
        resolve(data.toString())
      })
    })
  }
}

const readFile = promisify(fs.readFile)

readFile(path.resolve(__dirname, "file.txt")).then(
  (data) => {
    console.log(data.toString())
  },
  (err) => {
    console.log(err)
  }
)
```








