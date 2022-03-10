---
sidebar: auto
---

# Promise.abort 方法

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

但是我给的时间范围是1秒中，超过这个时间，我认为你就已经失败了，直接走失败态。

```js
setTimeout(() => {
  p1.abort("超时了")
}, 1000)
```

通过需求的描述我们大概能够想到, 采用失败状态，就很像我们使用的reject函数。

其实abort方法可以考虑借用race的能力，自己构造一个promise，让自己的这个promise 执行reject，那根据race方法的意义，原本的那个请求，就不再会成功了。

```js
function wrap(p1) {
  let abort
  let p = new Promise((resolve, reject) => {
    abort = reject
  })

  let p2 = Promise.race([p, p1])
  p2.abort = abort
  return p2
}
```
真实的使用场景中 p1 是一个Promise异步操作。p2依然是一个promise, 依然具有then方法

```js
p2.then((data)=>{
  console.log(data)
},(err)=>{
  console.log(err)
})
```

在源码实现中，我们还看到了，p2上面绑定了一个abort方法，这个方法其实是一个reject方法，这个reject方法是属于我们自己创建的promsie的。

调用了 p2.abort 相当于调用了 p的reject方法，相当于调用了p的reject方法，p又因为是 Promise.race([p, p1])的入参，因此, 简介的导致了 p1的这个promsie的结果被放弃了。


```js
setTimeout(()=>{
  p2.abort("超时了")
}, 1000)
```

