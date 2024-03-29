---
sidebar: auto
---

# node中的发布订阅

nodeJS中有两大比较核心系统，一个是关于异步的，另外一个就是事件驱动。

Node.js 中的 events 模块是一个内置模块，用于实现事件驱动架构。它提供了一个 EventEmitter 类，用于处理事件的订阅和触发。

## 内置模块中发布订阅的使用

```js
// 引入事件模块
const EventEmitter = require("events")

// 构造函数
function Girl() {}

// 实现原型继承 这里使用的是ES6原型继承的方法
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)

// 绑定事件 （绑定的时候还木有失恋）
girl.on("失恋了", (text) => {
  console.log("哭：" + text)
})
// 可以绑定多个事件 
girl.on("失恋了", (text) => {
  console.log("吃：" + text)
})

girl.on("失恋了", (text) => {
  console.log("呜呜呜：" + text)
})

// 过了一段时间之后，真的失恋了，触发失恋方法
setTimeout(() => {
  girl.emit("失恋了","不开心")
}, 1000)

// 控制台打印 
哭不开心
吃不开心
呜呜呜不开心
```

这段代码演示了在 node 中通过原型链实现类的继承。在这个例子中，我们有一个 `Girl` 类，想要让它继承 `EventEmitter` 类的原型方法（`on`、`emit`、`off`、`once` 等）。

首先，我们导入 `events` 模块，获取 `EventEmitter` 类：

```javascript
const EventEmitter = require("events");
```

接着，我们定义一个空的构造函数 `Girl`：

```javascript
function Girl() {}
```

然后，我们希望 `Girl` 类继承 `EventEmitter` 类的原型方法。通常使用 ES6 的 `extends` 关键字实现类的继承，但在这里选择了使用原型链的方式：

```javascript
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype);
```

这行代码使用 `setPrototypeOf` 方法，将 `Girl` 类的原型设置为 `EventEmitter` 类的原型。通过这种方式，`Girl` 类就继承了 `EventEmitter` 类的原型方法，即可以在 `Girl` 的实例上使用 `on`、`emit`、`off`、`once` 等事件触发器的方法。

上面代码展示的就是node中`events`模块简单的使用, Girl的实例调用on方法订阅了"失恋了"这个事件名称，第二个参数接收一个回调函数，当我们在一秒之后使用emit触发了"失恋了"这个事件的时候，订阅的所有的回调函数都会执行。


## 自己实现events模块,on和emit实现
接下来我们尝试手写一版EventEmitter的方法实现。发布订阅的核心原理其实就是维护一个事件群，key存储事件名称，value存储是一个数组，数组中存放的是所有的订阅的回调方法。


先来实现一个简单的发布订阅功能，支持 on 和 emit 方法 
```js
// events.js
// 源码中使用的就是构造函数的形式
function EventEmitter() {
  // 这里声明的是实例属性
  this._events = {}
}

// 订阅方法 接收两个参数一个是 事件名称 一个是回调函数 
EventEmitter.prototype.on = function(eventName, callback) {
  // 在真正使用的过程中 this 指向的是girl 但是上面没有 _events 这里我们需要做一个判空处理
  // 没有的话，我们手动给this上添加一个
  if(!this._events) {
    this._events = {}
  }
  // 构造一个 {'xxx':[fn1,fn2]} 这种形式
  if (this._events[eventName]) { // 存在
    // 更新数组 {'xxx':[fn1,fn2]} 
    this._events[eventName].push(callback)
  } else { // 不存在这个事件 {'xxx':[fn1]} 
    this._events[eventName] = [callback]
  }
}
// 发布方法 接收参数一个是 事件名称 其余的是传递进来的散装参数 
EventEmitter.prototype.emit = function(eventName, ...args) {
  this._events[eventName].forEach(fn => {
    fn(...args)
  })
}

// commonJS规范的导出模式 引用使用 require
module.exports = EventEmitter;
```

既然能够发布和订阅，就一定可以取消事件的订阅。女孩子在失恋后哭了一次就不哭了，变得坚强了。

```js
// 引入事件模块
const EventEmitter = require("events")

function Girl() {}

Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)

const cry = (text) => {
  console.log("哭" + text)
}
// 绑定事件 （绑定的时候还木有失恋）
girl.on("失恋了", cry)
// 可以绑定多个事件 
girl.on("失恋了", (text) => {
  console.log("吃" + text)
})

// 过了一段时间之后，真的失恋了，触发失恋方法
setTimeout(() => {
  girl.emit("失恋了","不开心")
  girl.off("失恋了",cry) // 将哭的事件解绑
  girl.emit("失恋了","不开心")
}, 1000)

// 控制台打印 解绑了哭
哭不开心
吃不开心

吃不开心
```

基于上面的这个需求，我们添加一个off方法来解绑事件。

```js
// events.js
// 源码中使用的就是构造函数的形式
function EventEmitter() {
  this._events = {}
}

// 订阅方法 接收两个参数一个是 事件名称 一个是回调函数 
EventEmitter.prototype.on = function(eventName, callback) {
  // 在真正使用的过程中 this 指向的是girl 但是上面没有 _events 这里我们需要做一个判空处理
  if(!this._events) {
    this._events = {}
  }
  // 构造一个 {'xxx':[fn1,fn2]} 这种形式
  if (this._events[eventName]) { // 存在
    // 更新数组 {'xxx':[fn1,fn2]} 
    this._events[eventName].push(callback)
  } else { // 不存在这个事件 {'xxx':[fn1]} 
    this._events[eventName] = [callback]
  }
}
// 发布方法 接收参数一个是 事件名称 其余的是传递进来的散装参数 
EventEmitter.prototype.emit = function(eventName,...args) {
  this._events[eventName].forEach(fn => {
    fn(...args)
  })
}

EventEmitter.prototype.off = function(eventName, callback) {
  if(this._events && this._events[eventName]) {
    // 过滤出来不想等的 相等的就自然解绑掉了
    this._events[eventName] = this._events[eventName].filter(fn => fn !== callback)
  }
}


// commonJS规范的导出模式 引用使用 require
module.exports = EventEmitter;
```

还有一种场景, 有些事件只需要执行一次，这个时候我们需要实现once方法

```js
girl.once("失恋了", () => {
  console.log("逛街")
})
// 将哭泣的函数抽离出去
const cry = (text) => {
  console.log("哭" + text)
}
// 绑定事件 （绑定的时候还木有失恋）
girl.on("失恋了", cry)
// 可以绑定多个事件
girl.on("失恋了", (text) => {
  console.log("吃" + text)
})

setTimeout(() => {
  girl.emit("失恋了", "不开心")
  girl.off("失恋了", cry)
  girl.emit("失恋了", "不开心")
}, 1000)
```


```js
// events.js
// 源码中使用的就是构造函数的形式
function EventEmitter() {
  this._events = {}
}

// 订阅方法 接收两个参数一个是 事件名称 一个是回调函数 
EventEmitter.prototype.on = function(eventName, callback) {
  // 在真正使用的过程中 this 指向的是girl 但是上面没有 _events 这里我们需要做一个判空处理
  if(!this._events) {
    this._events = {}
  }
  // 构造一个 {'xxx':[fn1,fn2]} 这种形式
  if (this._events[eventName]) { // 存在
    // 更新数组 {'xxx':[fn1,fn2]} 
    this._events[eventName].push(callback)
  } else { // 不存在这个事件 {'xxx':[fn1]} 
    this._events[eventName] = [callback]
  }
}
// 发布方法 接收参数一个是 事件名称 其余的是传递进来的散装参数 
EventEmitter.prototype.emit = function(eventName,...args) {
  this._events[eventName].forEach(fn => {
    fn(...args)
  })
}

EventEmitter.prototype.off = function(eventName, callback) {
  if(this._events && this._events[eventName]) {
    // 过滤出来不想等的 相等的就自然解绑掉了
    this._events[eventName] = this._events[eventName].filter(fn => fn !== callback && fn.l !== callback)
  }
}

// 只执行一次的方法 
EventEmitter.prototype.once = function(eventName, callback) {
  const one = () => {
    callback()
    this.off(eventName,one)
  }
  one.l = callback // 自定义属性
  // 先执行绑定方法 
  this.on(eventName, one)
  // 执行完毕之后 再执行解绑事件 继续利用切片的思想实现
}


// commonJS规范的导出模式 引用使用 require
module.exports = EventEmitter;
```
