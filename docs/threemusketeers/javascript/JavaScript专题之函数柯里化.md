## 定义
维基百科中对柯里化（Currying）的定义为：
>In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument.

翻译成中文：
在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举个例子：
```js
function add(a, b) {
  return a + b; 
}
// 执行add 函数 一次传入两个参数即可
add(1, 2) // 3

// 假设有个 curry 函数可以做到柯里化
var addCarry = curry(add)
addCarry(1)(2) // 3
```

## 用途

我们会讲到如何写出这个carry函数，并且会将这个curry函数写的很强大，但是在编写之前，我们需要知道柯里化到底有什么用？

举个例子：

```js
function ajax(type, url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true)
  xhr.send(data)
}

// 虽然 ajax 这个函数非常通用，但是在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST')
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```
curry的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

可是即便如此，是不是依然感觉没有什么用呢？

如果我们仅仅是把参数一个一个传递进去，意义可能不大，但是如果我们是把柯里化后的函数传递给其他函数比如 map 呢？

举个例子：

比如我们有这样一段数据:
```js
var person = [{name: 'kevin'}, {name: 'daisy'}]
```

我们要获取所有的name值，我们可以这样做:

```js
var name = person.map(function(item) {
  return item.name
})
```