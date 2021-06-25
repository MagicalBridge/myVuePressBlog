---
sidebar: auto
---

# call和apply的模拟实现

## call

一句话介绍call:

> call() 方法使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或方法 

举个🌰:
```js
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1
```

注意两点：
::: tip
- 1.call 改变了this的指向，指向到foo
- 2.bar 函数执行了
:::

## 模拟实现第一步

那么我们该怎么模拟实现这两个效果呢？
试想当调用call的时候，把foo对象改造成如下:

```js
var foo = {
  value: 1,
  bar: function() {
    console.log(this.value)
  }
};

for.bar(); // 1
```
这个时候 this 就指向了foo，是不是很简单呢？

但是这样却给 foo 对象添加了一个属性，这可不行呀！

不过也不必担心，我们用delete 再删除它不就好了~

所以我们模拟的步骤可以分为：
- 1.将函数设置为对象的属性
- 2.执行该函数
- 3.删除这个函数

以上个例子为例：就是：
```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
···
