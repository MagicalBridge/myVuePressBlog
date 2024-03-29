---
sidebar: auto
---

# Promise.abort 和 Promise.catch方法

## Promise.abort

我们在日常开发中，可能会遇到一些超时问题，比如图片加载，就是不采用它的结果了，意思是即使之后再成功了也没什么作用了。

假设我们有这样一个场景：

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功")
  }, 3000)
})
```
上述代码是一个成功的promise。模拟的是一个异步请求，在3秒之后返回结果。

但是我给的时间范围是1秒中，超过这个时间，我认为你就已经失败了，直接走失败态, 不再会等待图片加载成功

```js
setTimeout(() => {
  p1.abort("超时了")
}, 1000)
```

其实`abort`方法可以考虑借用`race`的能力，自己构造一个`promise`，让自己的这个promise执行reject，那根据race方法的意义，原本的那个请求，就不再会成功了。

```js
// 入参是一个正在执行的promise
function getPromiseWithAbort(p1) {
  let abort
  let p = new Promise((resolve, reject) => {
    abort = reject
  })

  let p2 = Promise.race([p, p1])
  p2.abort = abort
  return p2
}
```

调用：

```js
// 业务promsie 3秒后能拿到结果
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("123")
  }, 1000)
})

// 通过包装函数，返回一个新的promsie
var promise1 = getPromiseWithAbort(promise)

// 调用业务promise的then方法准备拿结果
promise1.then((res) => {
  console.log(res)
})

// 如果要取消
promise1.abort("取消执行")
```

## Promise.catch

首先来说，`catch`方法返回一个Promsie，这个场景比较常见，就是调用完catch之后，还可以继续调用then方法，所以本质上catch其实是 `Promise.prototype.then()`的一个变种。

它的行为与调用`Promise.prototype.then(undefined, onRejected)` 相同。

再来说说catch的用法，catch方法接收一个参数，该参数是一个函数，拥有一个参数reason，参数的含义是 Promsie失败的原因。

```js
p.catch(function(reason) {})
```

我们来看一个例子：
```js
const p = new Promise((resolve, reject) => {
  reject(new Error("error"))
})

```



