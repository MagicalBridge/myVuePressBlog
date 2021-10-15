---
sidebar: auto
---

# JavaScript深入之原型和原型链

## 开篇：
在Brendan Eich大神为`JavaScript`设计面向对象系统的时候，借鉴了`Self` 和`Smalltalk`这两门
基于原型的语言，之所以选择基于原型的面向对象系统，并不是因为时间匆忙，它设计起来相对简单，而是因为从一开始Brendan Eich就没打算在`Javascipt`中加入类的概念。

以类为中心的面向对象的编程语言中，类和对象的关系可以想象成铸模和铸件的关系，对象总是从类中创建而来，
而在原型编程的思想中，类并不是必须的，对象未必需要从一个类中创建而来。

JavaScript是一门完全面向对象的语言，如果想要更好地使用JavaScript的面向对象系统，原型和原型链就是个绕不开的话题，

今天我们就一起来学习一下这方面的知识。

## 理解三个重要的属性：`prototype`、`__proto__`、`constructor`

见名知意，所谓的"**链**"描述的其实是一种关系，加上**原型**两个字，可以理解为原型之间的关系，既然是一种关系，就需要维系，就好比我们走亲访友，亲情就是一种纽带，类比在JavaScript当中——**函数、对象实例、实例原型**
也有自身的联系，而他们之间的纽带就是下面这三个重要的属性：

**三个重要的属性：`prototype`、`__proto__`、`constructor`**


### prototype

我们先来看看第一个属性：`prototype`

所谓属性，指的是一个事物的特征，就比如美女的一大特征是“大长腿”，那“大长腿"就是美女的属性，类比到JavaScript中函数，每一个函数都有一个`prototype`属性，这属性就是与生俱来的特质。这里需要特别强调一下，是**函数**，普通的对象是没有这个属性的，（这里为什么说普通对象呢，因为在JavaScript里面，**一切皆为对象**，所以这里的普通对象不包括函数对象）

我们来看一个例子：

```JavaScript
function Person() {

}
// 虽然写在注释里面，但是需要注意的是
// prototype 是函数才会有的属性 （哈哈哈，看来在JavaScript中函数果然是有特权的……）
Person.prototype.name = "Kevin";
var person1 = new Person();
var person2 = new Person();

console.log(person1.name) // Kevin
console.log(person2.name) // Kevin
```

上面的代码中我们创建了一个**构造函数**`Person`，并且在实例原型上面添加了一个`name`属性赋值为`"Kevin"`;

然后分别创建了两个**实例对象**:`person1、person2`;

当我们打印两个**实例对象**上name属性时均输出了`Kevin`(可以亲自试一下)。

我们不禁疑惑，这个`Person.prototype`到底是什么，为什么在上面添加属性，在
构造函数的实例化对象上都能访问到呢？

其实 Person这个函数的`prototype`属性指向了一个对象，即:`Person.prototype`也是一个对象。（真是好多对象）**这个对象正是调用该构造函数而创建的实例的原型**。也就是这个例子中的`person1`和`person2`的原型。

为了便于理解，我们将上面的这段话拆解一下：

>* 1.调用的构造函数：  Person
>* 2.使用什么调用：    new关键字
>* 3.得到了什么：     两个实例化对象person1、person2
>* 4.实例化对象和原型是什么关系: person1和person2的原型就是 Person.prototype

那什么是原型呢？可以这样理解：
::: tip
每一个JavaScript对象（null除外）在创建的时候就会与之关联另外一个对象，这个对象就是我们所说的原型，而每一个对象都会从原型"继承"属性。
:::

上面的代码中我们并没有直接在`person1`和`person2`中添加name属性 但是这两个对象却能够访问name属性,就是这个道理。

我们用一张图表示构造函数和实例原型之间的关系:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/29/16898b91e713ac0c~tplv-t2oaga2asx-image.image)

好了 构造函数和实例原型之间的关系我们已经梳理清楚了，那我们怎么表示实例与实例原型，也就是`person1`或者`person2`和`Person.prototype` 之间的关系呢。这时候需要请出我们理解原型链的第二个重要属性`__proto__`


### `__proto__`

这个属性有什么特征呢？

其实这是每一个JavaScript对象（除了null）都具有的一个属性，叫__proto__,这个属性会指向该对象的原型，即作为实例对象和实例原型的之间的链接桥梁,**这里强调，是对象，同样，因为函数也是对象，所以函数也有这个属性。**

我们看一个代码示例：

```JavaScript
function Person() {

}

var person = new Person();
console.log(person.__proto__ === Person.prototype); //true;
```

有了第二个属性的帮助，我们就能更加全面的理解这张关系图了：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/29/16898bcf2bd5b9e0~tplv-t2oaga2asx-image.image)

通过上面的关系图我们可以看到,`构造函数Person` 和`实例对象person` 分别通过`prototype`和`__proto__` 和实例原型`Person.prototype`进行关联，根据箭头指向我们不禁要有疑问：**实例原型是否有属性指向构造函数或者实例呢？**

这时候该请出我们的第三个属性了：`constructor`


### constructor
实例原型指向实例的属性倒是没有,因为一个构造函数可能会生成很多个实例，但是原型指向构造函数的属性倒是有的，这就是我们的`constructor`——每一个原型都有一个`constructor`属性指向关联的构造函数。

我们再来看一个示例：

```JavaScript
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```
好了到这里我们再完善下关系图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/29/16898bfa7d21ac26~tplv-t2oaga2asx-image.image)

通过对三个属性的介绍，我们总结一下：

```JavaScript
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

上述代码中我们我们执行了以下操作：

>* 1.声明了构造函数 Person;
>* 2.使用new操作符调用 Person 实例化了一个person 对象;
>* 3.判断实例化对象通过__proto__是否指向实例原型;
>* 4.判断实例原型通过constructor是否能找到对应的构造函数;
>* 5.使用Object.getPrototypeOf方法传入一个对象 找到对应的原型对象;

了解了构造函数。实例原型、和实例对象之间的关系，接下来我们讲讲实例和原型的关系：

## 实例与原型

**当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。**

我们再举一个例子：

```JavaScript
  function Person() {

  }

  Person.prototype.name = 'Kevin';

  var person = new Person();

  person.name = 'Daisy';
  console.log(person.name) // Daisy

  delete person.name;
  console.log(person.name) // Kevin
```

在上面这个例子中，我们给实例person添加了name属性，当我们打印person.name的时候，结果自然为Daisy

但是当我们删除了`person`下面的name属性后，读取`person.name`，依然能够成功输出Kevin，实际情况是从 person 对象中找不到 name 属性就会从 person 的原型也就是 `person.__proto__` ，也就是 `Person.prototype`中查找，幸运的是我们找到了 name 属性，结果为 Kevin。

但是我们不禁有疑问，如果万一没有找到该怎么办？

我们来看下一层的关系 **原型的原型**

## 原型的原型

我们前面提到过，原型也是一个对象，那么既然是对象，那肯定就有创建它的构造函数，
这个构造函数就是Object();

```JavaScript
  var obj = new Object();
  obj.name = 'Kevin';
  console.log(obj.name); // Kevin;
```

其实原型对象就是通过Object构造函数生成的，结合之前我们所说的，实例__proto__指向构造函数的
prototype 所以我们再丰富一下我们的关系图；


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/29/16898c4978539394~tplv-t2oaga2asx-image.image)

到了这里我们对于 构造函数、实例对象、实例原型之间的关系又有了进一步的认识。
说了这么多，终于可以介绍原型链了。

## 原型链

那Object.prototype 的原型呢？Object是根节点的对象，再往上查找就是null，我们可以打印：
```JavaScript
  console.log(Object.prototype.__proto__ === null) // true
```
然而 null 究竟代表了什么呢？

引用阮一峰老师的 《undefined与null的区别》 就是：

null 表示“没有对象”，即该处不应该有值。

所以 Object.prototype.__proto__ 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

我们可以将null 也加入最后的关系图中，这样就比较完整了。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/29/16898c65dc0834c2~tplv-t2oaga2asx-image.image)

上图中相互关联的原型组成的链状结构就是原型链，也就是红色的这条线

## 补充
最后，补充三点大家可能不会注意到的地方：

### constructor

首先是constructor，我们看一个例子：

```JavaScript
function Person() {

}

var person = new Person();
console.log(person.constructor === Person); // true
```
当获取`person.constructor`时，其实 person 中并没有`constructor` 属性,当不能读取到`constructor`属性时，会从 person 的原型也就是 `Person.prototype`中读取，正好原型中有该属性，所以：

```JavaScript
person.constructor === Person.prototype.constructor
```

### `__proto__`
其次是 __proto__ ，绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.__proto__ 时，可以理解成返回了 Object.getPrototypeOf(obj)。

### 真的是继承吗？
最后是关于继承，前面我们讲到“每一个对象都会从原型‘继承’属性”，实际上，继承是一个十分具有迷惑性的说法，引用《你不知道的JavaScript》中的话，就是：

继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。



























