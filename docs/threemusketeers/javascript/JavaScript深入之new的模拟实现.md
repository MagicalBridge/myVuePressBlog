---
sidebar: auto
---

# 深入学习JavaScript之new的模拟实现

一句话介绍 new:

> new 操作符创建一个用户定义的对象类型的实例或者具有构造函数的内置对象类型之一

也许有点难以理解，我们在模拟 new 之前先看看 new 实现了哪些功能。

举个例子：

```js
// cutePerson 构造函数
function cutePerson(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";
}

// 因为缺乏锻炼的缘故，身体强度让人担忧
cutePerson.prototype.strength = 60;

cutePerson.prototype.sayYourName = function() {
  console.log("I am " + this.name);
};

var person = new cutePerson("Kevin", "18");

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // 60

person.sayYourName(); // I am Kevin
```

从这个例子中，我们可以看到，实例 person 可以：
1、访问到 cutePerson 构造函数里面的属性
2、访问到 cutePerson.prototype 中的属性

接下来，我们可以尝试模拟一下了。

因为 new 是关键字，所以无法像 bind 那样直接覆盖，所以我们先写一个函数，命名为 objectFactory，
来模拟 new 的实现，用的时候是这样的：

```js
function cutePerson () {
    ……
}
// 使用 new
var person = new cutePerson(……);

// 使用 objectFactory
var person = objectFactory(cutePerson, ……)
```

## 初步实现

分析：

因为 new 的结果是一个对象，因此在模拟实现的过程中，我们也要建立一个新的对象，假设
这个对象叫做 obj，因为 obj 会具有 cutePerson 构造函数的属性，想想经典继承的例子，
我们可以使用 cutePersona.apply(obj),arguments 来给 obj 添加属性。

在 JavaScript 深入学习系列的第一篇中，我们便讲了原型和原型链，我们知道实例的**proto**
属性会指向构造函数的 prototype 也正是因为建立起这样的关系，实际可以访问原型链上的属性。

现在，我们可以尝试着写第一版了。

```js
function objectFactory() {
  var obj = new Object(),
    Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  Constructor.apply(obj, arguments);

  return obj;
}
```

在这一版中,我们:

1、用 new Object 的方式构建出来一个对象 obj
2、取出第一个参数，就是我们要传入的构造函数，此外因为 shift 会修改原数组，所以 arguments
会被去除第一个参数
3、将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
4、使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
5、返回 obj

更多关于：

原型和原型链，可以看 《深入学习 JavaScript 之原型和原型链》
apply 可以看《》
经典继承可以看 《》

复制以下代码到浏览器中，我们可以做一个简单的测试

```js
function cutePerson(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";
}

cutePerson.prototype.strength = 60;

cutePerson.prototype.sayYourName = function() {
  console.log("I am " + this.name);
};

function objectFactory() {
  var obj = new Object(),
    Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj;
}

var person = objectFactory(cutePerson, "Kevin", "18");

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // 60

person.sayYourName(); // I am Kevin
```

返回值的效果实现：

接下来我们思考一种情况，假如构造函数有返回值，举一个例子。

```js
function cutePerson(name, age) {
  this.strength = 60;
  this.age = age;

  return {
    name: name,
    habit: "Games"
  };
}

var person = new cutePerson("kevin", "18");

console.log(person.name); // kevin
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.age); // undefined
```

在这个例子中构造函数返回了一个对象，在实例 person 中只能访问返回的对象中的属性。而且还要注意一点，在这里
我们是返回了一个对象，假如我们只是返回了一个基本类型值呢？

我们再举一个例子：

```js
function cutePerson(name, age) {
  this.strength = 60;
  this.age = age;

  return "handsome boy";
}

var person = new cutePerson("kevin", "18");

console.log(person.name); // undefined
console.log(person.habit); // undefined
console.log(person.strength); // 60
console.log(person.age); // 18
```

结果完全颠倒过来,这次尽管有返回值，但是相当于没有返回值进行处理。

所以我们还需要判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么。

## 进阶实现
再来看第二版本的代码：也是最后一版的代码

```js
// 因为new是关键字, 因此我们只能写一个函数模仿new的功能
function objFactory() {
  // 创建一个空的对象。
  var obj = new Object();
  // 拿到构造函数,shift 能够改变数组的大小和结构 也就是通过这个操作
  // 之后 arguments 会改变。
  var Constructor = Array.prototype.shift.call(arguments); 
  // 还记原型和原型链的关系吗。对象实例 通过 __proto__ 
  // 链接到自身的原型对象。
  obj.__proto__ = Constructor.prototype;
  // 执行这个函数 并改变this指向
  var ret =  Constructor.apply(obj,arguments);
  // 如果返回值是一个对象的话 就直接返回，如果不是的话 返回obj。
  return typeof ret === 'object' ? ret : obj;
}
```


<!-- 在真实的调用场景中 第一个参数是构造函数后面跟着的就是参数,我们使用new 操作符操作一个构造函数的时候 会创建一个对象这个对象可以继承构造函数的内部属性和原型链上的方法。

- 1 用new Object() 的方式新建了一个对象 obj
- 2 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
- 3 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
- 4 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
- 5 返回 obj -->