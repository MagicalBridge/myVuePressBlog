## 手摸手教你手写promsie

来看一下promise的简单示例。
```js
new Promise(()=>{
  console.log("executor")
})
console.log("ok")
// 控制行输出 =>  executor ok
```
- Promsie可以使用new关键词调用，我们可以把Promise看成是一个类，在现阶段我们不考虑兼容性问题。
- 当使用Promise的时候，会传入一个 `executor` 函数，这个函数会立即执行。
- 这个executor函数可以传递两个参数，这两个参数也是函数，一个是resolve 另一个是reject，这两个函数的执行可以改变promise的状态。
- promise中有三种状态：
  - 成功态
  - 失败态
  - 中间状态

- 默认情况下promsie处于中间状态。
- 使用new操作符操作promsie之后，会生成一个实例，每一个实例都拥有一个then方法。
- then方法接收两个函数作为参数，一个是成功回调，一个是失败回调。根据上面的描述信息，我们补充代码：

```js
let promise = new Promise((resolve, reject) => {
  console.log("executor")
})
console.log("ok")

// 每个实例都用拥有一个then方法
promise.then(()=>{
  console.log("success");
},()=>{
  console.log("failed");
})
// 控制行输出 =>  executor ok
```

通过打印输出可以看到，虽然我们在then方法中写了success 和 failed 但是既没有走成功回调，也没有走失败回调。

这是因为默认状态下promsie处于的是等待状态。我们想要成功还是失败，需要主动调用resolve或者调用reject告诉promsie。如果调用resolve函数promise转变为成功状态，如果调用reject函数promise就转变为失败状态。

我们尝试手写一版Promise，使用 commonjs 规范，自定义一个js文件，之后使用Promsie的时候就导入自己手写的这个promsie。

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
```js{3-5}
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

执行上述代码发现，如果我们在executor中传入的是一个异步任务，虽然调用了resolve方法，但是并没有走实例的then方法的成功回调，这是为什么呢？因为默认promise处于pending状态，当我们用定时器去触发resolve的时候，then方法已经执行完毕了，但是我们自己手写的这一版本promsie，并没有处于pending状态。我们现在开始实现。

我们可以这样处理，准备两个数组，分别用于存放**成功回调函数**和**失败回调函数**，当我们真正触发 resolve 或者 reject 的时候遍历数组执行其中的回调函数。

这种实现的思路其实是发布订阅的模式。先订阅好所有的成功回调和失败回调，然后在触发resolve 和 reject 的时候执行发布。

```js{12,13,20,28,39-48}
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
    this.onResolvedCallbacks = []; // 存放成功的回调方法
    this.onRejectedCallbacks = []; // 存放失败的回调方法
    // 成功resolve函数
    const resolve = (value) => {
      // 只有在 PENDING 状态下 才能 修改状态
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
        this.onResolveCallbacks.forEach((fn) => fn())
      }
    }
    // 失败的reject函数
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
        this.onRejecteCallbacks.forEach((fn) => fn())
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
    if(this.status == PENDING){
      this.onResolvedCallbacks.push(() => { 
        // todo...
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        // todo...
        onRejected(this.reason);
      });
    }
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

promsie 到底在我们的日常开发中解决了什么问题？
- 解决了回调地域的问题。
- 解决了同步并发的问题。

假设我们有一个场景：存在两个文件  a.txt、b.txt。

a.txt 中的内容是一个字符串'b.txt', b.txt 中的内容是 'b'，我们希望先从 a.txt 中读取文件内容，然后再操作输出 b.txt的内容。
我们在不使用promsie的时候可能会写出如下的代码:

```js
fs.readFile('./a.txt','utf8',function (err, data) {
  if(err) return console.log(err)
  fs.readFile('./b.txt','utf8',(err,data) => {
    if(err) return console.log(err)
    console.log(data);
  })
})
```
这种写法有什么问题呢？就是不断地在上一个函数的回调中写逻辑，并且每一层都要写错误捕获逻辑。这样层级多了之后，代码就会变得难以维护。

基于此我们可以尝试使用`promise`封装一个方法。

```js
const fs = require('fs');
// 入参是文件的 路径 和 文件编码
function readFile(filePath, encoding) {
  // 返回一个 promsie实例
  return new Promise((resolve,reject) => {
    // 传递给原生的fs.readFile 方法一个回调函数
    fs.readFile(filePath,encoding, (err,data) => { 
      // 拿到文件读取结果之后，通过resolve 或者 reject 将结果返回。
      if(err) return reject(err);
      resolve(data);
    })
  })
}
```

如上述代码所示，我们封装了一个 readFile 方法，返回了一个 promise 实例，在自执行函数中调用原生的操作文件的方法，在文件读取结束之后，将结果通过resove 或者 reject 返回出来。


promise中给我们提供的then方法能够解决这种不断嵌套的问题。

接下来我们来好好梳理下这个then方法；

- promsie的链式调用，当调用then方法后，还会返回一个新的promise，新的promsie有自己的状态，如果我们用过jquery这个库的时候会知道，也会有链式调用的场景，但是返回的是this。这里为什么不能返回自身呢？原因就在于，promise的状态一旦改变之后，就不能再改回去了，否则状态就乱了，因此，需要返回一个新的promsie。
- 情况1：then中的方法返回值是一个普通值（不是promise）的情况，会作为**外层下一次then的成功结果**。
```js
readFile("./a.txt", "utf8").then((value)=>{
  reutrn 1
},(err)=>{
  console.log('fail',err)
}).then((data)=>{
  console.log('s',data) // 在这里输出 => s 1
},(err)=>{
  console.log('f',err)
})
```
- 情况2：then方法执行出错，比如 throw new Error("失败") 无论上一次是成功还是失败，只要返回的是普通值，都会执行下一次的then的成功。

```js
readFile("./a.txt", "utf8").then((value)=>{
  throw new Error("抛出异常")
},(err) => {
  console.log('fail',err) // 在这里输出 抛出异常 
}).then((data) => {
  console.log('s',data) // 同时默认在上层返回undefined => s undefined
},(err)=>{
  console.log('f',err)
})
```

- 情况3：如果then中方法返回的是一个promsie对象，此时会根据promsie的结果来处理是走成功还是失败。

```js{2}
readFile("./a.txt", "utf8").then((value)=>{
  return readFile('b.txt') // 这个执行的结果是 b
},(err) => {
  console.log('fail',err) 
}).then((data) => {
  console.log('s',data)  // => s b
},(err)=>{
  console.log('f',err)
})
```
在第{2}行, readFile('b.txt') 这个函数的执行结结果是返回一个b,就可以在下一个then的成功回调中拿到这个值。反之如果。readFile('b.txt') 返回的是一个失败的结果，那么就会走到第二个then的失败回调。

- 总结一下: 如果返回一个普通值（除了promsie）就会传递给下一个then的成功，如果返回一个失败的promsie或者抛出异常，会走下一个then的失败。


```js
let promise2 = new Promise((resolve, reject) => {
  resolve('成功')
}).then((data) => {
  console.log(data) // => ‘成功’
  return 'x'
})

promise2.then((data) => {
    console.log("success", data) // => success x
  },(err) => {
    console.log("failed", err)
  }
)
```
上面我们已经知道，每调用then方法一次，都会产生一个新的promsie，并且第一次then的时候，无论是成功和是失败，都会有隐含的返回值，如果不指定就是返回undefined，那这个返回值，是能够成为外面then的入参继续传递下去。

```js
let promise2 = new Promise((resolve, reject) => {
  resolve('成功')
}).then((data) => {
  console.log(data) // => 成功
  throw new Error("抛出异常")
})

promise2.then((data) => {
    console.log("success", data) 
  },(err) => {
    console.log("failed", err) // => failed  errorxxxx
  }
)
```

如果在第一个promise的成功回调函数中, 抛出异常，会在第二个then的方法中的失败回调中得到结果。这很显然是调用了第二个promsie的resolve或者reject方法，根据此，我们需要**同步捕获错误异常**。

```js{41,81-82}
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
    this.onResolvedCallbacks = []; // 存放成功的回调方法
    this.onRejectedCallbacks = []; // 存放失败的回调方法
    // 成功resolve函数
    const resolve = (value) => {
      // 只有在 PENDING 状态下 才能 修改状态
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
        this.onResolveCallbacks.forEach((fn) => fn())
      }
    }
    // 失败的reject函数
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
        this.onRejecteCallbacks.forEach((fn) => fn())
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
    // 每次then的时候 都会产生一个新的promsie，我们将这个新的promsie
    // 命名为Promsie2。又因为promise接收的是一个立即执行函数，并不会影响结果。
    let promsie2 = new Promise((resolve, reject) => {
      if(this.status == PENDING) {
        this.onResolvedCallbacks.push(() => { 
          try {
            // todo...
            let x = onFulfilled(this.value);
            resolve(x)
          catch(e) {
            reject(e)
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            // todo...
            let x = onRejected(this.reason);
            resolve(x)
          catch(e) {
            reject(e)
          }
        });
      }
      // onFulfilled, onRejected
      if (this.status == FULFILLED) {
        try {
          // 成功调用成功方法，并传入成功的值
          let x = onFulfilled(this.value)
          resolve(x)
        } catch(e) {
          reject(e)
        }
      }
      if (this.status === REJECTED) {
        try {
          // 失败调用失败方法  并传入失败的原因
          let x = onRejected(this.reason)
          resolve(x)
        } catch(e) {
          reject(e)
        }
      }
    })
    return promsie2
  }
}

module.exports = Promise
```

在promsieA+ 规范中有说过这样的点, **onFulfilled 和 onRejected 不能在当前上下文中调用，这里我就必须想办法，让这两个函数异步触发，异步触发，这里我们使用setTimeout来实现**，原因是我们没有办法模拟浏览器的微任务处理逻辑。

```js{44-52,55-63}
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
    this.onResolvedCallbacks = []; // 存放成功的回调方法
    this.onRejectedCallbacks = []; // 存放失败的回调方法
    // 成功resolve函数
    const resolve = (value) => {
      // 只有在 PENDING 状态下 才能 修改状态
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
        this.onResolveCallbacks.forEach((fn) => fn())
      }
    }
    // 失败的reject函数
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
        this.onRejecteCallbacks.forEach((fn) => fn())
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
    // 每次then的时候 都会产生一个新的promsie，我们将这个新的promsie
    // 命名为Promsie2。又因为promise接收的是一个立即执行函数，并不会影响结果。
    let promsie2 = new Promise((resolve, reject) => {
      if(this.status == PENDING) {
        this.onResolvedCallbacks.push(() => { 
          setTimeout(() => {
            try {
              // todo...
              let x = onFulfilled(this.value);
              resolve(x)
            } catch(e) {
              reject(e)
            }
          },0)
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              // todo...
              let x = onRejected(this.reason);
              resolve(x)
            } catch(e) {
              reject(e)
            }
          },0)
        });
      }
      // onFulfilled, onRejected
      if (this.status == FULFILLED) {
        setTimeout(() => {
          try {
            // 成功调用成功方法，并传入成功的值
            let x = onFulfilled(this.value)
            resolve(x)
          } catch(e) {
            reject(e)
          }
        },0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 失败调用失败方法  并传入失败的原因
            let x = onRejected(this.reason)
            resolve(x)
          } catch(e) {
            reject(e)
          }
        },0)
      }
    })
    return promsie2
  }
}

module.exports = Promise
```
在第一个promise then 方法中很可能返回的还是一个promsie, 也就是说 onFulfilled 执行完的x可能是一个Promise。类似于下面的代码：

```js
let promise2 = new Promise((resolve) => {
  resolve(1)
}).then((data) => {
    // onFulfilled 函数的返回值x 可能还是个 Promsie
    return new Promise((resolve, reject) => {
      // x 可能是一个promise
      setTimeout(() => {
        resolve("ok")
      }, 1000)
    })
  },(err) => {
    return 111
  }
)
promise2.then((data) => {
    console.log(data) // ok 
  },(err) => {
    console.log("error", err)
  }
)
```
我们可以看到，第二个then的成功回调中拿到的是新的创建出来的promise的结果。根据上面的描述，我们需要专门创建一个处理函数来针对x的不同取值做相应的操作，这个方法是相对独立的。

```js{48,59,72,83}
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
    this.onResolvedCallbacks = []; // 存放成功的回调方法
    this.onRejectedCallbacks = []; // 存放失败的回调方法
    // 成功resolve函数
    const resolve = (value) => {
      // 只有在 PENDING 状态下 才能 修改状态
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
        this.onResolveCallbacks.forEach((fn) => fn())
      }
    }
    // 失败的reject函数
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
        this.onRejecteCallbacks.forEach((fn) => fn())
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
    // 每次then的时候 都会产生一个新的promsie，我们将这个新的promsie
    // 命名为Promsie2。又因为promise接收的是一个立即执行函数，并不会影响结果。
    let promsie2 = new Promise((resolve, reject) => {
      if(this.status == PENDING) {
        this.onResolvedCallbacks.push(() => { 
          setTimeout(() => {
            try {
              // todo...
              let x = onFulfilled(this.value);
              resolvePromise(promsie2, x, resolve, reject)
            } catch(e) {
              reject(e)
            }
          },0)
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              // todo...
              let x = onRejected(this.reason);
              resolvePromise(promsie2, x, resolve, reject)
            } catch(e) {
              reject(e)
            }
          },0)
        });
      }
      // onFulfilled, onRejected
      if (this.status == FULFILLED) {
        setTimeout(() => {
          try {
            // 成功调用成功方法，并传入成功的值
            let x = onFulfilled(this.value)
            resolvePromise(promsie2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        },0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 失败调用失败方法  并传入失败的原因
            let x = onRejected(this.reason)
            resolvePromise(promsie2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        },0)
      }
    })
    return promsie2
  }
}

module.exports = Promise
```

下面我们开始书写 resolvePromise。

应该遵循以下原则:
- 1 如果promsie2和x是同一个promsie，应该抛出异常。
```js {3-5}
function resolvePromise(promsie2, x, resolve, reject) {
  // 核心流程
  if (promsie2 === x) {
    return reject(new TypeError("错误"))
  }
}
```
- 2 我们还需要考虑兼容别人的Promise 这部分逻辑稍微复杂一些。首先promsie是一个对象或者函数，如果是普通值直接返回就好，还需要明确Promise中是必须拥有then方法的，在获取then方法的时候可能会抛出异常，因此这部分需要做异常捕获操作。
```js{7-17}
function resolvePromise(promsie2, x, resolve, reject) {
  // 核心流程
  if (promsie2 === x) {
    return reject(new TypeError("错误"))
  }
  // 我可能写的promise 要和别人的promise兼容，考虑不是自己写的promise情况
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise 还必须拥有then方法，在取 then的时候，可能会抛出异常。
    // 这里应该捕获异常
    try {
      let then = x.then
    }catch(e) {
      reject(e) // 如果捕获到了异常，将异常直接传递给 reject 函数
    }
  } else {
    resolve(x) // 说明返回的是一个普通值 直接将他放到 promise2.resolve中。
  }
}
```
- 3 接下来，我们还需要判断 then 是不是一个函数，如果then 是一个函数，那么就要绑定this指向。如果不是一个函数，就是一种普通的值的处理逻辑。
- 4 别人的promsie可能会有致命的错误，就是调取完resolve之后，还可能调取reject逻辑。所以需要设置一个锁来保证调用的结果正确。

```js{12-24}
function resolvePromise(promsie2, x, resolve, reject) {
  // 核心流程
  if (promsie2 === x) {
    return reject(new TypeError("错误"))
  }
  // 我可能写的promise 要和别人的promise兼容，考虑不是自己写的promise情况
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise 还必须拥有then方法，在取 then的时候，可能会抛出异常。
    let called = false
    try {
      let then = x.then
      if (typeof then === 'function') {
        // 这里就认为是Promise了 这里面不 用 x.then的愿因是 可能还会触发自定义的getter
        // 如果成功就将成功的结果给promise2的resolve方法，如果失败, 就将失败的原因传递给reject方法
        // 这里只是稍微改变了 then的this指向。
        then.call(x, (y) => {
          if (called) return 
          called = true
          resolve(y)
        },(r) => {
          if (called) return 
          called = true
          reject(r)
        })
      } else { // then 是一个对象 直接使用resolve 函数返回出去
        resolve(x)
      }
    }catch(e) {
      if (called) return 
      called = true
      reject(e) // 如果捕获到了异常，将异常直接传递给 reject 函数
    }
  } else {
    resolve(x) // 说明返回的是一个普通值 直接将他放到 promise2.resolve中。
  }
}
```
- 5 还有一种嵌套调用promise的情况，这种情况需要做一个递归调用。

```js{19}
function resolvePromise(promsie2, x, resolve, reject) {
  // 核心流程
  if (promsie2 === x) {
    return reject(new TypeError("错误"))
  }
  // 我可能写的promise 要和别人的promise兼容，考虑不是自己写的promise情况
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise 还必须拥有then方法，在取 then的时候，可能会抛出异常。
    let called = false
    try {
      let then = x.then
      if (typeof then === 'function') {
        // 这里就认为是Promise了 这里面不 用 x.then的愿因是 可能还会触发自定义的getter
        // 如果成功就将成功的结果给promise2的resolve方法，如果失败, 就将失败的原因传递给reject方法
        // 这里只是稍微改变了 then的this指向。
        then.call(x, (y) => {
          if (called) return 
          called = true
          resolvePromise(promsie2, y, resolve, reject)
        },(r) => {
          if (called) return 
          called = true
          reject(r)
        })
      } else { // then 是一个对象 直接使用resolve 函数返回出去
        resolve(x)
      }
    } catch(e) {
      if (called) return 
      called = true
      reject(e) // 如果捕获到了异常，将异常直接传递给 reject 函数
    }
  } else {
    resolve(x) // 说明返回的是一个普通值 直接将他放到 promise2.resolve中。
  }
}
```

onFulfilled, onRejected 在使用then的时候很可能是不传递的。此时需要针对这种情况单独做处理。做一层判断。贴出完整实现
```js{85-86}
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"

// 利用x的值来判断是调用promise2的resolve还是reject
function resolvePromise(promise2, x, resolve, reject) {
  // 核心流程
  if (promise2 === x) {
    return reject(new TypeError("错误"))
  }
  // 我可能写的promise 要和别人的promise兼容，考虑不是自己写的promise情况
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise
    // 别人的promise可能调用成功后 还能调用失败~~~  确保了别人promise符合规范
    let called = false
    try {
      // 有可能then方法是通过defineProperty来实现的 取值时可能会发生异常
      let then = x.then
      if (typeof then === "function") {
        // 这里我就认为你是promise了  x.then 这样写会触发getter可能会发生异常
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject) // 直到解析他不是promise位置
          },
          (r) => {
            // reason
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // {}  {then:{}}
        resolve(x) // 常量
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x) // 说明返回的是一个普通值 直接将他放到promise2.resolve中
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING // promise默认的状态
    this.value = undefined // 成功的原因
    this.reason = undefined // 失败的原因
    this.onResolvedCallbacks = [] // 存放成功的回调方法
    this.onRejectedCallbacks = [] // 存放失败的回调方法
    const resolve = (value) => {
      // 成功resolve函数
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED // 修改状态
        // 发布
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      // 失败的reject函数
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED // 修改状态
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  // then中的参数是可选的
  then(onFulfilled, onRejected) {
    // onFulfilled, onRejected
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v
    onRejected = typeof onRejected === "function" ? onRejected : (err) => { throw err } 
    // 用于实现链式调用
    let promise2 = new Promise((resolve, reject) => {
      // 订阅模式
      if (this.status == FULFILLED) {
        // 成功调用成功方法
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            // 此x 可能是一个promise， 如果是promise需要看一下这个promise是成功还是失败 .then ,如果成功则把成功的结果 调用promise2的resolve传递进去，如果失败则同理

            // 总结 x的值 决定是调用promise2的 resolve还是reject，如果是promise则取他的状态，如果是普通值则直接调用resolve
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        // 失败调用失败方法
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status == PENDING) {
        // 代码是异步调用resolve或者reject的
        this.onResolvedCallbacks.push(() => {
          // 切片编程 AOP
          setTimeout(() => {
            try {
              // todo...
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              // todo...
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value)
    })
  }
  catch(errorFn) {
    return this.then(null, errorFn)
  }

  static all = function (promises) {
    return new Promise((resolve, reject) => {
      let result = []
      let times = 0
      const processSuccess = (index, val) => {
        result[index] = val
        if (++times === promises.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        // 并发 多个请求一起执行的
        let p = promises[i]
        if (p && typeof p.then === "function") {
          p.then((data) => {
            processSuccess(i, data)
          }, reject) // 如果其中某一个promise失败了 直接执行失败即可
        } else {
          processSuccess(i, p)
        }
      }
    })
  }
}
module.exports = Promise
```









