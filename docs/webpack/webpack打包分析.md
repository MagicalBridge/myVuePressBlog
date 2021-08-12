## webpack 打包文件分析

### .src/title.js
```js
module.exports = 'webpack'
```

### .src/index.js
```js
const title = require('./title')
console.log(title);
```
### ./dist/main.js 
打包之后的结果：
```js{2-6,8,11,25,34-37}
;(() => {
  var __webpack_modules__ = {
    "./src/title.js": (module) => {
      module.exports = "webpack"
    },
  }
  // The module cache
  var __webpack_module_cache__ = {}

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    })

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)

    // Return the exports of the module
    return module.exports
  }

  var __webpack_exports__ = {}
  // This entry need to be wrapped in an IIFE because 
  // it need to be isolated against other modules in the chunk.
  ;(() => {
    const title = __webpack_require__(/*! ./title */ "./src/title.js")
    console.log(title)
  })()
})()
```
- 1、打包之后的结果是一个自执行函数。 
- 2、{2-6}行定义了一个 __webpack_modules__ 对象，key 是配置引用的模块，value 是一个函数，接收一个module参数，将title.js 中的内容放进了函数体内。
  ```js
  var __webpack_modules__ = {
    "./src/title.js": (module) => {
      module.exports = "webpack"
    },
  }
  ```
- 3、34-37行也是一个自执行函数，也是程序的入口，可以看到, 这里调用了webpack中自定义的一个 __webpack_require__ 函数, 入参就是 __webpack_modules__ 中的key。

- 4、我们接着定位到 __webpack_require__  这个方法 入参是一个 moduleId, {8}行定义了一个缓存对象，首先在函数中判断，这个moduleId是否存在了，如果存在了就返回 cachedModule的exports 对象。创建一个对象，这个对象中的key是 exports value 是一个空的对象。

- 5 开始用__webpack_modules__ 根据 传入的 moduleId 调用对象的函数。传入的三个参数。

- 6 {25} 执行函数 得到 `module.exports = "webpack"` 最后返回的 module.exports 就是 字符串 webpack。