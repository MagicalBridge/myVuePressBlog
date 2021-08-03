## 手写promsie

来看一下promise的简单示例。
```js
new Promise(()=>{
  console.log("executor")
})
console.log("ok")
// 控制行输出 =>  executor ok
```
- Promsie可以使用new关键词调用，所以Promise底层是一个类，在现阶段我们不考虑兼容性问题。
- 当使用Promise的时候，会传入一个executor函数，这个函数会立即执行。
- 当前这个executor函数可以传递两个参数，这两个参数也是函数，一个是resolve 一个是 reject，可以改变promise的状态。
- promise中有三种状态：
  - 成功态
  - 失败态
  - 中间状态

默认情况下promsie处于中间状态。使用new操作符操作promsie之后，会生成一个实例，每一个实例都拥有一个then方法，then方法接收两个函数作为参数，一个是成功回调，一个是失败回调。根据上面的描述信息，我们补充代码：

```js
let promise = new Promise((resolve, reject) => {
  console.log("executor")
})
console.log("ok")

promise.then(()=>{
  console.log("success");
},()=>{
  console.log("failed");
})
// 控制行输出 =>  executor ok
```

虽然我们在then方法中写了success 和 failed 但是既没有走成功回调，也没有走失败回调。这是因为，默认promsie处于的是等待状态。我们想要成功还是失败，需要主动调用resolve或者调用reject告诉promsie。如果调用resolve函数就是成功，如果调用reject就是失败。

我们尝试手写一版 Promise。使用 commonjs 规范，自定义一个js文件，之后使用Promsie的时候就导入自己手写的这个promsie。

```js
// promsie 有三种状态，分别是 等待  成功  失败 我们用常量来表示。
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
// Promsie 内部是一个类，我们这里使用 class 来实现
class Promise {
  // 构造函数的入参就是自执行函数 executor
  constructor(executor) {
    this.status = PENDING // promise默认的状态
    this.value = undefined // 成功的原因
    this.reason = undefined // 失败的原因
    // 成功resolve函数
    const resolve = (value) => {
      // 只有在 PENDING 状态下 才能 修改状态
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
      }
    }
    // 失败的reject函数
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      // 立即执行函数执行的时候如果抛出异常，直接走reject函数。
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // onFulfilled, onRejected
    if (this.status == FULFILLED) {
      // 成功调用成功方法，并传入成功的值
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      // 失败调用失败方法  并传入失败的原因
      onRejected(this.reason)
    }
  }
}

module.exports = Promise
```

我们在实际的使用场景中，一般在executor中传入的都是异步任务，类似于下面这样。
```js
let Promise = require('./promise')
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("executor")
  }, 1000)
})

console.log("ok")

promise.then(()=>{
  console.log("success");
},()=>{
  console.log("failed");
})
// => 控制台打印 ok 
```

执行上述代码发现，如果我们在executor中传入的是一个异步任务，虽然调用了resolve方法，但是并没有走 then方法的成功回调，这是为什么呢？因为默认promise处于pending状态，当我们用定时器去触发resolve的时候，then方法已经执行完毕了，但是我们自己手写的这一版本promsie，并没有处于pending状态。我们现在开始实现。







