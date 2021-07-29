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

当前这个executor函数可以传递两个参数，这两个参数也是函数 一个 resolve 一个是 reject，来描述promise的状态。

promise中有三种状态：
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

虽然我们在then方法中写了success 和 failed 但是既没有走成功回调，也没有走失败回调。这是因为，默认promsie处于的是等待状态。我们想要成功还是失败，需要主动告诉promsie。如果调用resolve函数就是成功，如果调用reject就是失败。





