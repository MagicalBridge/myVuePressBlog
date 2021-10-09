---
sidebar: auto
---

# 模板引擎的实现原理

## ejs模板引擎的初体验

我们以ejs为例子，这个模板引擎是非常常见的。我们创建一个模板文件，以ejs的语法在模板中声明变量，最终ejs会将占位符替换为变量。

./src/template.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <%=name%>
  <%=age%>
</body>
</html>
```

./src/ejs.js
```js
const ejs = require('ejs');
// 复杂的情况
(async function() {
  let r = await ejs.renderFile('template.html', {name: "louis", age: 18})
  console.log(r);
})();
```
最终渲染出来的字符串
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  louis
  18
</body>
</html>
```
我们可以尝试写一版自己的ejs的模板引擎。

## 简单的变量替换
./src/ejs.js
```js
const fs = require("fs")
const util = require("util")
const path = require("path")
const read = util.promisify(fs.readFile)

let ejs = {
  async renderFile(filename, options) {
    let content = await read(filename, "utf8")
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    // replace 接收一个回调函数作为参数 第一个参数是模式 第二个参数是匹配到的
    content = content.replace(/<%=(.+?)%>/g, function () {
      // arguments[1] => name  arguments[1] => age
      return options[arguments[1]]
    })
    return content
  }
}

;(async function() {
  let r = await ejs.renderFile('template.html', {name: "louis", age: 18})
  console.log(r);
})();
```

## 复杂版本的替换: 列表遍历
./src/template.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
  <body>
    <% arr.forEach((item) => { %>
      <li><%=item%></li>
    <% }) %>
  </body>
</html>
```




