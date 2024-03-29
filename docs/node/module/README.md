---
sidebar: auto
---

# 模块化
模块化是一种思想，将复杂的问题分解，让系统变的更容易维护。

模块化之于程序，就如同细胞之于生命体，是具有特定功能的组成单元，不同的模块负责不同的工作，它们以某种方式联系在一起，共同保证程序的正常运转。本文将包含以下几个部分：
- 1 不同的模块标准以及它们之间的区别；
- 2 如何编写模块；
- 3 模块打包的原理；

随着`JavaScript`的发展，社区中产生了很多的模块标准，在认识这些标准的同事，也要了解背后的思想。例如，它为什么会有这个特性，或者为什么要这样去实现，这对于我们自己编写模块也有所帮助。

## CommonJS

`CommonJS` 是由`JavaScript`社区于2009年提出的包含模块、文件、IO、控制台在内的一系列标准。在`Node.js`的实现中采用了`CommonJS`标准的一部分，并在其基础上进行了一些调整，我们所说的`CommonJS`模块和`Node.js`中的实现并不完全一样，现在一般谈到`CommonJS`其实是`Node.js`的版本，而非它的原始定义。


`CommonJS`最初只为服务器设计，直到 `Browserify` ——— 一个运行在`Node.js`环境下的模块打包工具，它可以将 `CommonJS`模块打包为浏览器可以单独运行的单个文件。这意味着客户端的代码也可以遵循`CommonJS`标准来编写。

不仅如此，借助`Node.js`的包管理器，npm开发者还可以获取他人的代码库，或者把自己的代码发布上去供他人使用，这种可以共享的传播的方式使的`CommonJS`在前端开发中逐渐流行起来。

### 模块
`CommonJS` 中规定每一个文件是一个模块。将一个`JavaScript`文件直接通过script标签插入页面中与封装成`CommonJS`模块最大的不同在于，前者的顶层作用域是全局作用域，在进行变量声明时会污染全局作用域；而后者会形成一个属于模块自身的作用域，所有的变量以及函数只有自己能够访问，对外是不可见的：

```js
// calculator.js
var name = 'calculater.js';

// index.js
var name = 'index.js';
require('./calculater.js');
console.log(name); // index.js
```

这里有两个文件，在index.js 中我们通过 CommonJS 的`require`函数加载 calculater.js运行之后控制台结果是`index.js`，**这说明 calculater.js中的变量声明并不会影响 index.js, 可见每一个模块是拥有各自作用域的。**

### 导出

导出是一个模块向外暴露自身的唯一方式。在CommonJS中，通过module.exports可以导出模块中的内容，如：

```js
module.exports = {
  name: 'calculater',
  add: function(a,b) {
    return a+b;
  }
};
```

CommonJS 模块内部会有一个module对象用于存放当前模块信息，可以理解成在每一个模块的最开始定义了以下对象：
```js
var module = {...};
// 模块自身的逻辑
module.exports = {...};
```

module.exports 用来指定该模块对外暴露哪些内容，在上面的代码中我们导出了一个对象，包含 name 和 add 两个属性，为了书写方便，
CommonJS也支持另一种简化的导出方式——直接使用exports。

```js
exports.name = 'calculater';
exports.add = function(a,b) {
  return a+b;
};
```

在实现效果上，这段代码和上面的module.exports没有任何不同，其内在机制是将exports 指向了 module.exports，而module.exports在初始化的时候是一个空的对象，我们可以简单的理解为CommonJS在每个模块的首部默认添加了以下代码：

```js
var module = {
  exports:{}
};

var exports = module.exports
```

因此，为exports.add 赋值相当于  module.exports 对象上添加一个属性。

在使用 exports 时候要注意一个问题，即不要直接给exports 赋值，否则会导致失效。如：

```js
exports = {
  name:'calculater'
}
```

上面的代码中，由于对exports进行了赋值操作，使其指向了新的对象，module.exports却仍然是原来的空对象，因此name属性并不会被导出。

另一个在导出时候容易犯的错误是不恰当的把module.exports于exports混用。

```js
exports.add = function(a,b){
  return a+b;
};

module.exports = {
  name:'calculater'
}
```
上面的代码先通过exports导出了add 属性，然后将module.exports重新赋值为另一个对象。这会导致原本拥有add属性的对象丢失了，最后导出的只有name。

另外 要注意导出语句不代表模块的末尾，在module.exports 或者 exports 后面的代码依旧照常执行。比如下面的console会在控制台上打出 'end'：

```js
module.exports = {
  name:'calculater',
};

console.log('end')
```
在实际开发中，为了提高可读性，不建议采取上面的写法，而是应该将 module.exports以及export语句放在模块的末尾。

### 导入

在CommonJS中使用require进行模块导入。如：
```js
// calculator.js
module.exports = {
  add: function(a,b){
    return a+b;
  };
};

// index.js
const calculator = require('./calculator.js');
const sum = calculator.add(2,3);
console.log(sum) // 5 
```

我们在index.js 中导入了calculator模块，并调用了它的add 函数。

当我们require一个模块的时候会有两种情况：
- require的模块是第一次被加载。这时候会首先执行这个模块，然后导出内容。
- require的模块被曾经加载过，这时候该模块的代码不会再次执行，**而是直接导出上次执行后的结果。**


请看下面的例子：

```js
// calculator.js
console.log('running calculator.js');

module.exports = {
  name:'calculator',
  add: function(a,b){
    return a+b;
  };
}

// index.js
const add = require('./calculator.js').add;
const sum = add(2,3);
console.log('sum:',sum);
const moduleName = require('./calculator.js').name;
console.log('end')
```

控制台输出如下结果：

```js
running calculator.js
sum:5
end
```

从结果可以看出，尽管我们有两个地方都调用了require('./calculator.js') 但是其实内部代码只执行了一遍。

我们前面提到，模块会有一个`module`对象存放其信息，这个对象中有一个属性loaded 用于记录该模块是否被加载过。他的值默认为false，当模块第一次被加载和执行过后置为true，后面再次加载时候回检查module。loaded 为true 则不会再次执行模块代码。

有时候我们加载一个模块，不需要获取其导出的内容，只是想想要通过执行它而产生某种作用，比如把它的接口挂载在全局对象上，此时直接使用require即可。

```js
require('./task.js')
```
上面这种写法 task.js 就会从上到下执行。

另外，require 函数可以接收表达式，借助这个特性我们可以动态的指定模块的加载路径。

```js
const moduleName = ['foo.js','bar.js'];
moduleNameforEach(name => {
  require('./'+name)
})
```

## ES6 Module

在JavaScript被设计之初，原本并没有包含模块的概念，基于越来越多的工程需求，为了使用模块化进行开发JavaScript社区中出现了多种模块的标准，一直到2015年6月，TC39标准委员会正式发布了ES6 从此JavaScript语言才具有了模块这一个特性。

### 模块

请看下面的例子,我们将前面的 calculator.js 和 index.js 使用ES6方式进行了改写。

```js
// calculator.js
export defaut {
  name: 'calculator',
  add:function() {
    return a+b
  }
}

// index.js
import calculator from './calculator.js';
const sum =  calculator.add(2,3);
console.log(sum); // 5
```

ES6 Module 会自动的采用严格模式，这在ES5 中是一个可选项，以前我们在文件开始添加 'use strict' 来控制是否开启严格模式，

### 导出

在ES6 Module 中使用export 命令来导出模块。export 有两种模式：
- 命名导出
- 默认导出
一个模块可以有多个命名导出，它有两种不同的写法：
```js
// 写法1
export const name = 'calculator';
export const add = function(a,b) {
  return a+b
}

// 写法2
const name = 'calculator';
const add = function(a,b) {
  return a+b
}
export { name, add }
```

第一种写法是将变量的声明和导出写在同一行；第二种则是先进行变量声明，然后再用同一个export语句导出，两种写法的效果是一样的。

在使用命名导出的时候，可以使用as关键字对变量重命名。如：
```js
const name = 'calculator'
const add = function(a,b) {return a+b};
export {
  name,
  add as getsum // 在导入时即为name 和 getSum
};
```

与命名导出不同，模块的默认导出只能由一个： 如：

```js
export default {
  name:'calculator',
  add: function(a,b) {
    return a+b
  }
}
```
我们可以将export default 理解为对外输出了一个名为default的变量，因此不需要像命名导出一样进行变量声明，直接导出值即可。

```js
// 导出字符串
export default 'this is calculator.js'

// 导出 class
export default class {...}

// 导出匿名函数
export default function() {...}
```

### 导入
ES6 Module 中使用import语法导入模块。首先我们来看如何加载带有命名导出的模块，请看下面的例子：
```js
// calculator.js
const name = 'calculator';
const add  = function(a,b) {
  return a+b
}
export {name,add}

// index.js
import {name, add} from './calculator.js'
add(2,3)
```
加载带有命名导出的模块时,import后面要跟一对大括号来将导入的变量名包裹起来，并且这些变量名需要与导出的变量名完全一致。导入变量的效果相当于在当前作用域下声明了这些变量（name和add）,并且不可对其更改，也就是所有导入的变量都是只读的。

与命名导出类似，我们可以通过as 关键字对导入的变量重新命名。如：
```js
import { name ,add as calculateSum } from 'calculator.js'
calculateSum(2,3);
```

在导入多个变量时，我们还可以采用整体导入的方式。如：

```js
import * as calculator from 'calculator.js'
console.log(calculator.add(2,3))
console.log(calculator.name)
```


使用 `import * as <myModule>`可以把所有导入的变量作为属性值添加到 `<myModule>` 对象中，从而减少了对当前作用域的影响。接下来处理默认导出，请看下面这个例子：

```js
// calculator.js
export default {
  name: 'calculator',
  add:function(a,b){
    return a+b;
  }
}

// index.js
import myCalculor from './calculator.js'
calculator.add(2,3)
```

对于默认导出来说，import后面直接跟变量名，并且这个名字可以自由指定（比如这里是myCalculor）,它指代了calculator.js 中默认导出的值。从原理上可以这样去理解：
```js
import {default as myCalculator} from './calculator.js'
```

最后看一个两种导入方式混合起来的例子：
```js
// index.js
import React,{Component} from 'react'
```

这里的React对应的是该模块默认导出，而 Component则是其命名导出中的一个变量。

:::warning
这里的React必须写在大括号前面，而不能顺序颠倒，否则会提示语法错误。
:::

## CommonJS 与 ES6 Module 的区别
上面我们分别介绍了 CommonJS 和 ES6 Module 两种形式的模块定义，在实际开发过程中我们经常会将两者混用，因此需要对比一下它们的各自特性。

### 动态与静态 

CommonJS 和 ES6 Module最本质的区别在于前者对模块依赖的解决是“动态的“，而后者是”静态的”，在这里“动态”的含义是，模块依赖关系的建立是发生在代码运行阶段；而“静态” 则是模块依赖关系的建立发生在代码编译阶段。

让我们先看一个CommonJS的例子：
```js
// calculator.js
module.exports = { 
  name: 'calculator' 
}
// index.js
const name = require('./calculator.js').name;
```

在上面介绍CommonJS的部分时我们提到过，当模块A加载模块B时（在上面的例子中是index.js 加载calculator.js）,会执行B中的代码，并将其module.exports 对象作为require函数的返回值进行返回。并且require的模块路径可以动态指定，支持传入一个表达式，我们甚至可以通过if语句判断是否加载某个模块。因此，在CommonJS 模块被执行前，并没有办法确定明确的依赖关系，模块的导入、导出发生在代码的运行阶段。

同样的例子，让我们再对比下ES6 Module的写法：
```js
// calculator.js 
export const name = 'calculator';

// index.js
import { name } from './calculator.js'
```

+ 死代码的检测和排除，我们可以用静态分析工具检测出来哪些模块没有被调用过。比如，在引用工具库的时候，工程中往往只用到了其中一部分组件或者接口，但是有可能会将其代码完整的加载进来。未被调用的模块代码永远不会被执行，也就成了死代码。通过静态分析可以在打包的时候去掉这些未曾使用过的模块，以减小打包资源体积。

+ 模块变量类型检查，JavaScript属于动态类型语言，不会在代码执行前检查类型错误（比如对一个字符串类型的值进行函数调用）。ES6 Module的静态模块结构有助于确保模块之间传递的值或者接口类型是正确的。典型的应用场景就是我们在vuex或者redux中使用的actionTypes，我们声明常量放在单独的一个文件中进行管理就是利用了ES6 Module的静态模块结构。

+ 编译器优化，在CommonJS等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而ES6 Module支持导入变量，减少引用层级，程序的效率更高

### 值拷贝与动态映射

在导入一个模块的时候，对于CommonJS来说，获取的是一份导出值的拷贝，而在ES6 Module中则是指的动态映射，并且这个映射是只读的。

上面的话直接理解起来可能比较困难，首先我们来看一个例子，了解一下什么是CommonJS 中的值拷贝。

```js
// calculator.js 
var count = 0;
module.exports = {
  count: count,
  add: function(a,b){
    count += 1;
    return a+b;
  }
}
// index.js
var count = require('./calculator.js').count;
var add = require('./calculator.js').add

console.log(count) // 0 (这里的count 是对calculator.js 中的count值拷贝)
add(2, 3)
console.log(count) // 0 calculator.js中变量值的改变不会对这里的拷贝值造成影响)

count += 1

console.log(count) // 1 (拷贝的值可以更改)
```

index.js 中的count 是对 calculator.js中count的一份值拷贝，因此在调用add函数时候，虽然更改了原本calculator.js中的值，但是并不会对index.js 中导入时候创建的副本造成影响。

另一方面，在CommonJS 中允许对导入的值进行更改，我们可以在index.js更改count和add 将其赋予新值，同样，由于是值的拷贝，这些操作不会影响 calculator.js本身。

下面我们使用ES6 Module 将上面的例子进行改写：

```js
// calculator.js 
let count = 0;
const add = function(a,b){
  count += 1;
  return a+b;
}
export { count, add }

// index.js
import {count,add} from './calculator.js'
console.log(count) // 0 (对ccalculator.js中的count值的映射)
add(2,3)
console.log(count) // 1(实时反映calculator.js中count值的变化)
// count += 1 ; // 不可更改，会抛出异常 SymtaxError: 'count' is read-only
```

上面的例子展示了ES6 Module 中导入的变量其实是对原有值的动态映射。index.js 中的 count 值是对 calculator.js 中的count值的实时反映，当我们通过add函数更改了calculator.js 中的count值时候，index.js 中的count值也随之变化。

我们不可以对ES6 Module 导入的变量进行更改，可以将这种映射关系理解为一面镜子，从镜子里面我们可以实时观察到原有的事务，但是并不可以操纵镜子中的影像。

### 循环依赖
**循环依赖是指模块A依赖于模块B，同时模块B依赖于模块A，** 比如下面这个例子：

```js
// a.js
import {foo} from './b.js';
foo()

// b.js
import {bar} from './a.js'
bar()
```

一般来说，工程中应该尽量避免循环依赖的产生，因为从软件设计的角度来说，单向的依赖关系更加清晰，而循环依赖则会带来一定的复杂度。而在实际开发中，循环依赖有时候会在我们不经意间产生，因为当工程的复杂度上升到足够的规模时，就容易出现隐藏的循环依赖关系。

简单来说，A和B 两个模块之间是否存在直接的循环依赖关系是很容易被发现的，但实际情况往往是 A依赖于B, B依赖于C，C依赖于D 最后绕了一圈，D又依赖于A，当中间的模块太多时候就很难发现A 和 B 之间存在着隐式的循环依赖。

因此，如何处理 循环依赖是开发者必须面要面对的问题，我们首先看一下CommonJS 中循环依赖的例子。
```js
// foo.js
const bar = require('./bar.js')
console.log('value of bar:',bar)
module.exports = "This is foo.js"

// bar.js
const foo = require('./foo.js')
console.log("value of foo:",foo)
module.exports = "This is bar.js"

// index.js
require('./foo.js')
```

在这里，index.js 是执行的入口，它加载了 foo.js, foo.js和bar.js之间存在循环依赖。让我们观察foo.js 和 bar.js 中的代码，理想状态下我们希望二者能够导入正确的值，并在控制台上输出：

```js
value of foo: This is foo.js
value of bar: This is bar.js
```

而当我们运行上面的代码时候，实际输出的却是：
```js
value of foo: {}
value of bar: This is bar.js
```

为什么foo的值是一个空的对象呢？让我们梳理一下代码的执行顺序。
- 1）index.js 导入了foo.js 此时开始执行foo.js 中的代码
- 2）foo.js 的第一句导入了bar.js 这个时候 foo.js 不会继续向下执行，而是进入了 bar.js 内部。
- 3）在bar.js 中又对foo.js 进行了require 这里产生了循环依赖，需要注意的是，执行权并不会再交给foo.js 而是直接取导出值也就是module.exports 但是由于foo.js 没有执行完毕 导出的值默认是空对象，因此 bar.js 执行到打印语句时候foo.js输出的是一个空的对象。
- 4）bar.js执行完毕 将执行权交给foo.js
- 5) foo.js 从require语句继续往下执行，在控制台打印value of bar（这个值是正确的）整个流程结束。

虽然循环依赖模块均被执行了，但是结果却不是我们想要的，因此在CommonJS 中，如果遇到循环依赖的问题，没有办法得到我们想要的结果。

我们再使用 ES6 Module的方式重写上面的例子。

```js
// foo.js
import bar from './bar.js'
console.log("value of bar:",bar)
export default 'This is foo.js'

// bar.js
import foo from './foo.js'
console.log("value of foo:",foo)
export default 'This is bar.js'
```

执行结果如下：
```js
value of foo: undefined
foo.js:3 value of bar: This is bar.js
```

很遗憾 在bar.js 中同样无法得到foo.js准确的导出值，只不过CommonJS默认导出的一个空的对象，这里获取的是undefined。

我们之前说过，CommonJS 获取到的是值的拷贝，ES6 Module 则是动态的映射，那么我们能否利用 ES6 Module的特性支持循环依赖呢?

```js
//index.js
import foo from './foo.js';
foo('index.js');

// foo.js
import bar from './bar.js';
function foo(invoker) {
  console.log(invoker + ' invokes foo.js');
  bar('foo.js');
}
export default foo;

// bar.js
import foo from './foo.js';
let invoked = false;
function bar(invoker) {
  if(!invoked) {
    invoked = true;
    console.log(invoker + ' invokes bar.js');
    foo('bar.js');
  }
}
export default bar;
```

上面代码执行的结果:

```js
index.js invokes foo.js
foo.js invokes bar.js
bar.js invokes foo.js
```

可以看到，foo.js和bar.js这一对循环依赖的模块均获取到了正确的导出值，我们分析下这个执行的过程。
- 1）index.js作为入口导入了foo.js，此时开始执行foo.js中的代码。
- 2）从foo.js导入了bar.js，执行权交给bar.js。
- 3）在bar.js中一直执行到其结束，完成bar函数的定义。注意，此时由于foo.js还没执行完，foo的值现在仍然是undefined。
- 4）执行权回到foo.js继续执行直到其结束，完成foo函数的定义。由于ES6Module动态映射的特性，此时在bar.js中foo的值已经从undefined成为了我们定义的函数，这是与CommonJS在解决循环依赖时的本质区别，CommonJS中导入的是值的拷贝，不会随着被夹在模块中原有值的变化而变化。
- 5）执行权回到index.js并调用foo函数，此时会依次执行foo→bar→foo，并在控制台打出正确的值。

由上面的例子可以看出，ES6 Module的特性使其可以更好地支持循环依赖，只是需要由开发者来保证当导入的值被使用时已经设置好正确的导出值。

## 加载其他模块
前面我们介绍的主要是CommonJS和ES6 Module，除此之外在开发中还有可能遇到其他类型的模块。有些如AMD、UMD等标准目前使用的场景已经不多，但当遇到这类模块时仍然需要知道如何去处理。

### 非模块化文件

非模块化文件指的是并不遵循任何一种模块标准的文件。如果你维护的是一个几年前的项目，那么极有可能里面会有非模块化文件，最常见的就是在script标签中引入的jQuery及其各种插件。

如何使用Webpack打包这类文件呢？其实只要直接引入即可，如：
```js
import "./jquery.min.js"
```

这句代码会直接执行jquery.min.js，一般来说jQuery这类库都是将其接口绑定在全局，因此无论是从script标签引入，还是使用Webpack打包的方式引入，其最终效果是一样的。


但假如我们引入的非模块化文件是以隐式全局变量声明的方式暴露其接口的，则会发生问题。如：
```js
// 通过在顶层作用域声明变量的方式暴露接口
var calculator = {
  // ...
}
```

由于Webpack在打包时会为每一个文件包装一层函数作用域来避免全局污染，上面的代码将无法把calculator对象挂在全局，因此这种以隐式全局变量声明需要格外注意。

### AMD

AMD是英文**Asynchronous Module Definition**（异步模块定义）的缩写，它是由JavaScript社区提出的专注于支持浏览器端模块化的标准。从名字就可以看出它与 CommonJS 和 ES6 Module 最大的区别在于它加载模块的方式是异步的。下面的例子展示了如何定义一个AMD模块。


AMD设计出一个简洁的写模块API:
```js
define(id?, dependencies?, factory);
```
- 第一个参数：id 为字符串类型，表示模块标识，表示模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。
- 第二个参数：dependencies 是一个当前模块的依赖，已被模块定义的模块标识的数组字面量。
- 第三个参数：factory 是一个需要实例化的函数或者是对象

```js
define('getSum',['calculator'], function(math) {
  return function(a,b) {
    console.log('sum: ' + calculator.add(a, b))
  }
})
```

在AMD中使用define函数来定义模块，它可以接受3个参数。第1个参数是当前模块的id，相当于模块名；第2个参数是当前模块的依赖，比如上面我们定义的getSum模块需要引入calculator模块作为依赖；第3个参数用来描述模块的导出值，可以是函数或对象。如果是函数则导出的是函数的返回值；如果是对象则直接导出对象本身。

和CommonJS类似，AMD也使用require函数来加载模块，只不过采用异步的形式。

```js
require(['getSum'],function(getSum) {
  getSum(2,3)
})
```

require的第1个参数指定了加载的模块，第2个参数是当加载完成后执行的回调函数。

通过AMD这种形式定义模块的好处在于其模块加载是非阻塞性的，当执行到require函数时并不会停下来去执行被加载的模块，而是继续执行require后面的代码，这使得模块加载操作并不会阻塞浏览器。

尽管AMD的设计理念很好，但与同步加载的模块标准相比其语法要更加冗长。另外其异步加载的方式并不如同步显得清晰，并且容易造成回调地狱（callbackhell）。在目前的实际应用中已经用得越来越少，大多数开发者还是会选择CommonJS或ES6 Module的形式。


### UMD
我们已经介绍了很多的模块形式，CommonJS、ES6 Module、AMD及非模块化文件，在很多时候工程中会用到其中两种形式甚至更多。有时对于一个库或者框架的开发者来说，如果面向的使用群体足够庞大，就需要考虑支持各种模块形式。

AMD模块以浏览器第一的原则发展,异步加载模块。

CommonJs 模块以服务器第一原则发展，选择同步加载。

为了兼容这两种方案，迫使人们想出了通用模块化规范UMD。

严格来说，UMD并不能说是一种模块标准，不如说它是一组模块形式的集合更准确。UMD的全称是Universal Module Definition，也就是通用模块标准，它的目标是使一个模块能运行在各种环境下，不论是CommonJS、AMD，还是非模块化的环境（当时ES6 Module还未被提出）。


请看下面例子：
```js
// calculator.js
(function(global, main) {
  // 根据当前环境采用不同的导出方式
  if (typeof define === "function" && define.amd) {
    // AMD
    define(...)
  } else if (typeof exports === "object"){
    // commonJS 
    module.exports = ...;
  } else {
    // 非模块化环境
    global.add = ...;
  }
}(this, function(){
  // 定义模块主体
  return {...}
}))
```
可以看出，UMD其实就是根据当前全局对象中的值判断目前处于哪种模块环境。当前环境是AMD，就以AMD的形式导出；当前环境是CommonJS，就以CommonJS的形式导出。

需要注意的问题是，UMD模块一般都最先判断AMD环境，也就是全局下是否有define函数，而通过AMD定义的模块是无法使用CommonJS或ES6 Module的形式正确引入的。

:::warning
在Webpack中，由于它同时支持AMD及CommonJS，也许工程中的所有模块都是CommonJS，而UMD标准却发现当前有AMD环境，并使用了AMD方式导出，这会使得模块导入时出错。当需要这样做时，我们可以更改UMD模块中判断的顺序，使其以CommonJS的形式导出即可。
:::

## 静态import 和动态 import
静态的import语句用于导入由另一个模块导出的绑定, 无论是否声明了 strict mode ，导入的模块都运行在严格模式下。在浏览器中，import 语句只能在声明了 `type="module"` 的 `script` 的标签中使用。

如果希望按照一定的条件或者按需加载模块的时候，动态import() 是非常有用的。
而静态型的 import 是初始化加载依赖项的最优选择，使用静态 import 更容易从代码静态分析工具和 `tree shaking` 中受益。

标准用法的import导入的模块是静态的，会使所有被导入的模块，在加载时就被编译（无法做到按需编译，降低首页加载速度）。有些场景中，你可能希望根据条件导入模块或者按需导入模块，这时你可以使用动态导入代替静态导入。下面的是你可能会需要动态导入的场景：

- 当静态导入的模块很明显的降低了代码的加载速度且被使用的可能性很低，或者并不需要马上使用它。(路由懒加载)
- 当静态导入的模块很明显的占用了大量系统内存且被使用的可能性很低。
- 当被导入的模块，在加载时并不存在，需要异步获取。

关键字 import 可以像调用函数一样来动态导入模块，以这种方式调用，将返回一个promise

```js
import("./modules/my-module.js")
  .then( module => {
    // do something
  })
```

使用这种方式也支持 await 关键字
```js
let module = await import('/modules/my-module.js');
```