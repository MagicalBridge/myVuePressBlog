---
sidebar: auto
---

# Promise.all和Promise.race

## Promise.all方法
简而言之：Promise.all().then()适用于处理多个异步任务，且所有的异步任务都得到结果时的情况。

比如：用户点击按钮，会弹出一个弹出对话框，对话框中有**两部分数据**呈现，这两部分数据分别是不同的后端接口获取的数据。

弹框弹出后的初始情况下，就让这个弹出框处于`数据加载中`的状态，当这两部分数据都从接口获取到的时候，才让这个`数据加载中`状态消失。让用户看到这两部分的数据。

那么此时，我们就需求这两个异步接口请求任务都完成的时候做处理，所以此时，使用Promise.all方法，就可以轻松的实现，我们来看一下代码写法,以vue的使用场景举例。

```vue
<template>
  <div class="box">
    <el-button type="primary" plain @click="clickFn">点开弹出框</el-button>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    clickFn() {
      this.alertMask = true; // 打开弹出框
      this.loading = true; // 暂时还没数据，所以就呈现loading加载中效果

      // 第一个异步任务
      function asyncOne() {
        let async1 = new Promise(async (resolve, reject) => {
          setTimeout(() => {
            // 这里我们用定时器模拟后端发请求的返回的结果，毕竟都是异步的
            let apiData1 = "第一个接口返回数据啦";
            resolve(apiData1);
          }, 800);
        });
        return async1;
      }
      console.log("异步任务一", asyncOne());  // 返回的是一个Promise对象

      // 第二个异步任务
      function asyncTwo() {
        let async2 = new Promise(async (resolve, reject) => {
          setTimeout(() => {
            let apiData2 = "第二个接口返回数据啦";
            resolve(apiData2);
          }, 700);
        });
        return async2;
      }
      console.log("异步任务二", asyncTwo()); // 返回的是一个Promise对象

      let paramsArr = [asyncOne(), asyncTwo()]

      // Promise.all方法接收的参数是一个数组，数组中的每一项是一个个的Promise对象
      // 我们在 .then方法里面可以取到 .all的结果。这个结果是一个数组，数组中的每一项
      // 对应的就是 .all数组中的每一项的请求结果返回的值
      Promise
      .all(paramsArr)
      .then((value) => {
        console.log("Promise.all方法的结果", value);
        this.loading = true; // 现在有数据了，所以就关闭loading加载中效果
      });
    },
  },
};
</script>
```

`Promise.all`方法接收的参数是一个数组，数组中的每一项是一个个的`Promise`对象，我们在 `.then`方法里面可以取到 `.all`的结果。这个结果是一个数组，数组中的每一项对应的就是`.all`数组中的每一项的请求结果返回的值。

查看下控制台的打印输出

![promise.all](../../images/javascript/promise/01.png)


## Promise.race方法

通俗来说，Promise.race是赛跑机制，只认第一名，只会采用第一个先执行的结果作为返回值，而会忽略其他值。

Promise.race 一般的使用场景用于处理超时。

比如：点击按钮发送请求，当服务端的接口超过一定时间，假设是3秒钟，没有返回结果的时候，我们就提示用户请求超时。

```vue
<template>
  <div class="box">
    <el-button type="primary" plain @click="clickFn">点击测试</el-button>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    async clickFn() {

      // 第一个异步任务
      function asyncOne() {
        let async1 = new Promise(async (resolve, reject) => {
          setTimeout(() => {
            // 这里我们用定时器模拟后端发请求的返回的结果，毕竟都是异步的
            let apiData1 = "某个请求";
            resolve(apiData1);
          }, 4000);
        });
        return async1;
      }
      console.log("异步任务一", asyncOne());  // 返回的是pending状态的Promise对象

      // 第二个异步任务
      function asyncTwo() {
        let async2 = new Promise(async (resolve, reject) => {
          setTimeout(() => {
            let apiData2 = "超时提示";
            resolve(apiData2);
          }, 3000);
        });
        return async2;
      }
      console.log("异步任务二", asyncTwo()); // 返回的是pending状态的Promise对象

      // Promise.race接收的参数也是数组，和Promise.all类似。只不过race方法得到的结果只有一个
      // 就是谁跑的快，结果就使用谁的值
      let paramsArr = [asyncOne(), asyncTwo()]

      Promise
      .race(paramsArr)
      .then((value) => {
        console.log("Promise.race方法的结果", value);
        if (value == "超时提示") {
          this.$message({
            type: "warning",
            message: "接口请求超时了"
          })  
        } else {
          console.log('正常操作即可');
        }
      })
    },
  },
};
</script>
```
Promise.race接收的参数也是数组，和Promise.all类似。只不过race方法得到的结果只有一个, 就是谁跑的快，结果就使用谁的值。

## 模拟实现
既然已经知道了 Promise.all 和 Promise.race的使用场景，我们不妨来实现一版。

### promsie.all 模拟实现
- 1、接收的参数是一个数组。数组里面不一定非得是promise,比如一个常数也是可以的。
- 2、多个promise都拿到结果之后，统一返回，其中有一个失败了，就认为此次的处理失败了。
- 3、返回的结果也是按照入参的顺序返回的。
- 4、此方法可以使用 then 方法，返回值也是一个Promsie

```js
Promise.all([1,2,3,
  new Promise((resolve,reject)=>{resolve("成功1")}),  
  new Promise((resolve,reject)=>{resolve("成功2")}),  
]).then((data) => {
  console.log(data)
}).catch((error) => { 
  console.log(error)
})
// 打印结果: [1, 2, 3, '成功1', '成功2']

Promise.all([1,2,3,
  new Promise((resolve,reject)=>{resolve("成功1")}),  
  new Promise((resolve,reject)=>{reject("失败了")}),  
]).then((data) => {
  console.log(data)
}).catch((error) => { 
  console.log(error+"走到了catch") 
})
// 打印结果：失败了走到了catch
```

我们尝试自己手写一版：
```js
Promise.all = function(promises) {
  // 返回的是一个promsie
  return new Promise((resolve, reject) => {
    let result = []; // 顺序存储结果

    // 一个计数器
    let times = 0

    // 需要封装一个方法处理成功的逻辑
    const processSuccess = (index,value) => {
      // 创建映射关系，存放进数组中
      result[index] = value
      if (++times === promises.length) {
        resolve(result)
      }
    }

    // 并发执行异步任务
    for (let i = 0; i < promises.lenght; i++) {
      // 拿到每一个执行
      let p = promises[i]
      // 因为传递的参数不一定是哦promsie，所以需要进行类型判断
      // p存在，并且有then方法
      if (p && typeof p.then === "function") {
        // 执行这个promise 拿到它的执行结果 then 是个异步方法
        // 走入then 方法的时候 for循环已经执行完毕了
        p.then((data) => {
          processSuccess(i, data)
        },reject); // 其中任何一个promise失败了直接执行reject即可
      } else {
        processSuccess(i, p)
      }
    }
  })
}
```

### promsie.race 模拟实现
- 1、接收的参数是一个数组，数组中数据可以是任何类型。
- 2、采用的是赛跑机制，也就是说，谁先执行完，就采用谁的值。
- 3、并不代表其他的不执行了，其他的依然会执行，只不过会忽略掉执行结果。
- 4、返回的是一个promsie

```js
Promise.race([
  new Promise((resolve,reject)=>{resolve("成功1")}),  
  new Promise((resolve,reject)=>{resolve("成功2")}),  
  1,2,3
]).then((data) => {
  console.log(data)
}).catch((error) => { 
  console.log(error)
})
// 打印： 成功1

Promise.race([
  new Promise((resolve,reject)=>{reject("失败")}),  
  new Promise((resolve,reject)=>{resolve("成功2")}),  
  1,2,3
]).then((data) => {
  console.log(data)
}).catch((error) => { 
  console.log(error)
})
// 打印： 失败

Promise.race([
  1,
  new Promise((resolve,reject)=>{reject("失败")}),  
  new Promise((resolve,reject)=>{resolve("成功2")}),  
  2,3
]).then((data) => {
  console.log(data)
}).catch((error) => { 
  console.log(error)
})
// 打印：1
```
我们手动实现一版
```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    // 使用for循环遍历
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i]
      if (p && typeof p.then === "function" ) {
        // 无论有多少个promsie, 只要其中的一个成功就走成功，
        // 其中的一个失败就走失败
        p.then(resolve,reject)
      } else {
        resolve(p)
      }
    }
  })
}
```
