---
sidebar: auto
---

# 手写Vue核心原理

## 一.使用Rollup搭建开发环境

### 1.什么是Rollup?
Rollup 是一个 JavaScript 模块打包器, 可以将小块代码编译成大块复杂的代码 Rollup 更专注于 `JavaScript` 类库打包 （开发应用时使用Webpack，开发库时使用Rollup）

### 2.环境搭建

安装rollup环境:
```sh
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

`rollup.config.js`文件编写

```js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 模块化类型
    file: 'dist/umd/vue.js', 
    name: 'Vue', // 打包后的全局变量的名字
    sourcemap: true // 代码调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // glob写法
    }),
    process.env.ENV === 'development'? serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    }) : null
  ]
}
```

配置.babelrc文件

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

执行脚本配置

```json
"scripts": {
  "build:dev": "rollup -c",
  "serve": "cross-env ENV=development rollup -c -w"
}
```

## 二.Vue响应式原理

Vue的实现是一个函数声明，为了将各个模块拆分方便, 使用的原型的写法。Vue函数接收一个 options 作为参数，options是一个对象，这个options就是用户传递进来的配置选项，这个配置选项中包含 data el watch computed methods。。。

在使用vue-cli脚手架进行开发的时候，都是单组件文件 每个组件本质上都是Vue实例。

导出vue构造函数

```js
import { initMixin } from './init';

function Vue(options) {
  // options 为用户传入的选项
  this._init(options);
}
initMixin(Vue); // 给原型上新增_init方法

export default Vue;
```

只要加载了index.js, 上面的代码都会依次执行，并且是要首先执行的，那么所有在mixin上挂载的所有原型方法都会预先执行，init方法是在`new Vue`的阶段执行的。

## 添加 initMixin 方法的实现
initMixin相当于一个插件，实现起来就是一个函数。 将构造函数作为参数传递进去，对构造函数进行扩展，这里使用了在构造函数的原型上进行扩展的方式，所有的组件实例均可以共享, 表示在vue的基础上做一次混合操作, 这种设计思想也是非常值得借鉴的。

```js
export function initMixin(Vue) {
  // 扩展原型上的方法
  Vue.prototype._init = function (options) {
    // 原型方法中的this指向new出来的实例, 所有的单文件组件、页面都具有这个方法，
    // 这里将this赋值给vm实例，可以使用里面的所有属性。
    const vm = this
    // 用户传递进来的options属性挂载到vm上面, 这时我们能够操作 vm.$options    
    // 将不同的状态放在不同的对象下面进行维护
    initState(vm)
  }
}
```

上面代码中我们封装了一个函数，函数内部扩展了 `_init`方法，这个方法中执行initState方法。开始实现initState方法。

```js
import { observe } from "./observer/index" // node_resolve_plugin
import { isFunction } from "./utils"

export function initState(vm) {
  // 状态的初始化 先 props methods data computed watch
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  // if(opts.computed){
  //   initComputed();
  // }

  // if(opts.watch){
  //   initWatch();
  // }
}

function initData(vm) {
  let data = vm.$options.data
  // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty 只能拦截已经存在的属性
  data = vm._data = isFunction(data) ? data.call(vm) : data
  // 响应式处理
  observe(data)
}
```

上面代码中，函数接收vm作为参数，会根据条件进行分流，因为组件或者页面中会有很多的配置，data、props、computed 不同的数据放在不同的函数中做处理。

上面有一个细节需要注意，我们传递的data数据有可能是函数，也有可能是个对象，所以这里需要先做个判断。

这里把 `vm._data ` 然后再把数据赋值给data，这样做的原因是，我们实际上是把 data传给了 observe 函数，这个时候已经和 vm 没有关系了。

为了能在vm上访问到数据，加一个地址引用。

## 解决属性代理的问题。
到目前为止，我们在取属性的时候，都是使用`vm._data.xxx`这种形式。但是我们在实际使用中，其实更多的是直接采用 `vm.xxx` 这种方式直接取属性。

为了解决这个问题，我们可以加上一层代理。

```js
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    },
  })
}
```

这样在initData中可以添加这样的函数

```js{17-20}
import { observe } from "./observer/index" // node_resolve_plugin
import { isFunction } from "./utils"

export function initState(vm) {
  // 状态的初始化 先 props methods data computed watch
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty 只能拦截已经存在的属性
  data = vm._data = isFunction(data) ? data.call(vm) : data
  
  // 用户访问vm.xxx => vm._data.xxx
  for (let key in data) {
    proxy(vm, "_data", key)
  }
  
  // 响应式处理
  observe(data)
}
```


## observe 函数的实现

```js
import { isObject } from "../utils"

export function observe(data) {
  // 如果是对象才观测 
  if (!isObject(data)) {
    return
  }
  // 默认最外层的data必须是一个对象
  return new Observer(data)
}

// 检测数据变化
class Observer {
  constructor(data) {
    this.walk(data) // 对象劫持的逻辑
  }
  walk(data) {
    // 使用Object.keys不会枚举原型链上的属性
    Object.keys(data).forEach((key) => {
      // 响应式方法
      defineReactive(data, key, data[key])
    })
  }
}
```

上面代码中 observe 是一个函数，接收用户传递的data数据，首先判断传递的data 是否为对象类型，vue文档中规定了，data也必须为对象类型。

这个函数返回一个Observer实例，Observer是一个对象，初始化执行walk方法，这个walk方法就是对对象的属性进行遍历。然后开始响应式处理。

defineReactive 这个方法接收三个参数，当前的对象、当前的属性、属性的值。

这里面就牵扯到一个性能问题，如果data中的属性很多，vue2中就会对每一个对象使用defineProperty进行劫持。

```js
function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      // 新的值和老的值一样，直接return。
      if(newVal === value) { 
        return 
      }
      value = newVal
    },
  })
}
```

上面的代码只能解决对象的一层劫持，如果对象有多层嵌套，就不满足需求。还有一种场景是，我们给一个属性重新赋值成一个新的对象，也不会变成响应式。为了解决上述问题，我们需要进行一个递归的处理。

```js{3,14}
function defineReactive(data, key, value) {
  // 本身用户默认值是对象套对象 需要递归处理 （性能差）
  observe(value) 
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      // 新的值和老的值一样，直接return。
      if(newVal === value) { 
        return 
      }
      // 如果用户赋值一个新对象，需要将这个对象进行劫持
      observe(newVal) 
      value = newVal
    },
  })
}
```

## 数组的递归监控

vue中并没有和对象一样直接使用defineProperty劫持数组中的每一个元素，原因是这种做法非常消耗性能，并且我们平时使用数组很少通过索引操作数组。

数组中有七个方法，这七个方法会改变原数组。

push、shift、pop、unshift、reverse、sort、splice。

在响应式方法中做一个分流逻辑，针对数组做单独的处理。
```js{5-12}
import { arrayMethods } from "./array"
// ...
class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      // 数组劫持的逻辑
      // 对数组原来的方法进行改写，切片编程、高阶函数
      data.__proto__ = arrayMethods
    } else {
      this.walk(data) //对象劫持的逻辑
    }
  }
  walk(data) {
    // 对象
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}
...
```

在对数组的处理中又用到了原型链的知识，`data.__proto__ = arrayMethods` 这个非常关键，将数组的原型链做了改写，指向了自己写的方法。

所达到的效果就是，当数组调用自身的api时候，会首先沿着原型链向上查找，这样我们就能拦截这些方法的调用。

来看下 arrayMethods 方法的实现。

```js
let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)
// arrayMethods.__proto__ = Array.prototype 继承
let methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"]
methods.forEach((method) => {
  // 用户调用的如果是以上七个方法 会用我自己重写的，否则用原来的数组方法
  arrayMethods[method] = function (...args) {
    // 调用原有的方法
    oldArrayPrototype[method].call(this, ...args) // arr.push(1,2,3);
  }
})
```

上面涉及的场景中，数组中存放的都是普通值，在实际的应用场景中，数组中存放的可能是对象类型的结构，当用户改变对象中的数据的时候，理所应当应该进行数据的响应式。因此需要对数组内部的数据进行响应式的监控。

```js{9-10,15-19}
import { arrayMethods } from "./array"
// ...
class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      // 数组劫持的逻辑
      // 对数组原来的方法进行改写，切片编程、高阶函数
      data.__proto__ = arrayMethods
      // 如果数组中的数据是对象类型，需要监控对象的变化
      this.observeArray(data)
    } else {
      this.walk(data) //对象劫持的逻辑
    }
  }
  observeArray(data) {
    // 对我们数组的数组 和 数组中的对象再次劫持 递归了
    // [{a:1},{b:2}]
    data.forEach((item) => observe(item))
  }
  walk(data) {
    // 对象
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}
```

上面高亮的代码部分就是针对数组中是对象类型的递归响应式处理。

用户在实际操作过程中还有可能直接执行 push、unshift、splice 等操作，此时，对于新放入数组的元素，也应该进行观测。这个时候，就需要在拦截的方法中对这些方法做特殊的处理。

```js{11-24}
let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)
// arrayMethods.__proto__ = Array.prototype 继承
let methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"]
methods.forEach((method) => {
  // 用户调用的如果是以上七个方法 会用我自己重写的，否则用原来的数组方法
  arrayMethods[method] = function (...args) {
    // 调用原有的方法
    oldArrayPrototype[method].call(this, ...args) // arr.push(1,2,3);
  }
  let inserted
  let ob = this.__ob__ // 根据当前数组获取到observer实例
  switch (method) {
    case "push":
    case "unshift":
      inserted = args // 就是新增的内容
      break
    case "splice":
      inserted = args.slice(2)
    default:
      break
  }
  // 如果有新增的内容要进行继续劫持, 我需要观测的数组里的每一项，而不是数组
  if (inserted) ob.observeArray(inserted)
})
```

在第12行，我们观察到了一个细节，this上有一个 `__ob__` 属性，这里的this指的是当前的数组，数组上本身是没有这个属性的，事实上，这个属性是在Observer定义的。

```js{4-7}
class Observer {
  constructor(data) {
    // 对象中的所有属性 进行劫持
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, // 不可枚举的
    })
    // data.__ob__ = this; // 所有被劫持过的属性都有__ob__
    if (Array.isArray(data)) {
      // 数组劫持的逻辑
      // 对数组原来的方法进行改写， 切片编程  高阶函数
      data.__proto__ = arrayMethods
      // 如果数组中的数据是对象类型，需要监控对象的变化
      this.observeArray(data)
    } else {
      this.walk(data) //对象劫持的逻辑
    }
  }
  observeArray(data) {
    // 对我们数组的数组 和 数组中的对象再次劫持 递归了
    // [{a:1},{b:2}]
    data.forEach((item) => observe(item))
  }
  walk(data) {
    // 对象
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}
```

这里使用 defineProperty 给data本身添加了一个不可枚举的属性 `__ob__`, 将当前的 Observer 实例放了上去。这样在使用的时候 data上就可以取到实例上的方法。这种设计确实很值得借鉴。

## 处理render方法

上面的章节中，我们已经实现了数据的劫持，下一步就应该处理数据和模板之间的关联关系，我们会在组件中书写template, 需要将数据渲染到模板上面。

```js{11-14}
export function initMixin(Vue) {
  // 扩展原型上的方法
  Vue.prototype._init = function (options) {
    // 原型方法中的this指向new出来的实例, 所有的单文件组件、页面都具有这个方法，
    // 这里将this赋值给vm实例，可以使用里面的所有属性。
    const vm = this
    // 用户传递进来的options属性挂载到vm上面, 这时我们能够操作 vm.$options    
    // 将不同的状态放在不同的对象下面进行维护
    initState(vm)

    if (vm.$options.el) {
      // 将数据挂载到这个模板上
      vm.$mount(vm.$options.el)
    }
  }
}
```
### 实现`$mount`方法

`$mount` 和 `_init` 都是定义在 initMixin 上的方法 要处理多种场景，比如用户有没有传递 render 方法，如果用户没有传递，就需要我们帮助用户生成 render 方法， compileToFunction 这个函数就是做这个事情的，之所以生成的render方法就是考虑到数据的反复变更，把模板转换成函数，利用函数封装的能力，对模板进行解析、修改对比。借助diff算法，最后生成新的dom。最终进行生成真实dom进行挂载。

```js
// ....
Vue.prototype.$mount = function (el) {
  const vm = this
  const options = vm.$options
  el = document.querySelector(el)
  vm.$el = el
  // 把模板转化成 对应的渲染函数 => 虚拟dom概念 vnode => diff算法 更新虚拟dom => 产生真实节点，更新
  if (!options.render) {
    // 没有render用template，目前没render
    let template = options.template
    if (!template && el) {
      // 用户也没有传递template 就取el的内容作为模板
      template = el.outerHTML
      let render = compileToFunction(template)
      options.render = render
    }
  }
}
...
```

compileToFunction 方法中涉及到对标签的解析，在vue2中使用的是正则匹配的方式，遍历完整个字符串，解析出来里面的标签和标签里面的属性。

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function start(tagName,attrs){
  console.log(tagName,attrs)
}
function end(tagName){
  console.log(tagName)
}
function chars(text){
  console.log(text);
}
function parseHTML(html){
  while(html){
    let textEnd = html.indexOf('<');
    if(textEnd == 0){
      const startTagMatch = parseStartTag();
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs);
        continue;
      }
      const endTagMatch = html.match(endTag);
      if(endTagMatch){
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    let text;
    if(textEnd >= 0){
      text = html.substring(0,textEnd);
    }
    if(text){
      advance(text.length);
      chars(text);
    }
  }

  function advance(n){
    html = html.substring(n);
  }

  function parseStartTag(){
    const start = html.match(startTagOpen);
    if(start){
      const match = {
        tagName:start[1],
        attrs:[]
      }
      advance(start[0].length);
      let attr,end;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
        advance(attr[0].length);
        match.attrs.push({name:attr[1],value:attr[3]});
      }
      if(end){
        advance(end[0].length);
        return match
      }
    }
  }
}
export function compileToFunctions(template){
  parseHTML(template);
  return function(){}
}
```

## 生成ast雨语法树

上面实现了对于标签的识别，事实上我们识别完标签之后, **还需要构造标签之间的关系**，谁是谁的子元素，谁是谁的父元素。

这里用到了栈这种数据结构的特性。语法树就是用对象描述js语法

```js
{
  tag:'div',
  type:1,
  children:[{tag:'span',type:1,attrs:[],parent:'div对象'}],
  attrs:[{name:'zf',age:10}],
  parent:null
}
```

最终返回一棵树结构

```js
let root;
let currentParent;
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement(tagName,attrs){
  return {
    tag:tagName,
    type:ELEMENT_TYPE,
    children:[],
    attrs,
    parent:null
  }
}
function start(tagName, attrs) {
  let element = createASTElement(tagName,attrs);
  if(!root){
    root = element;
  }
  currentParent = element;
  stack.push(element);
}
function end(tagName) {
  let element = stack.pop();
  currentParent = stack[stack.length-1];
  if(currentParent){
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}
function chars(text) {
  text = text.replace(/\s/g,'');
  if(text){
    currentParent.children.push({
      type:TEXT_TYPE,
      text
    })
  }
}
```
## codegen根据ast生成对应字符串拼接代码

以下是代码生成的核心逻辑：

```js
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{aaaaa}}

// html字符串 =》 字符串  _c('div',{id:'app',a:1},'hello')
function genProps(attrs) {
  // [{name:'xxx',value:'xxx'},{name:'xxx',value:'xxx'}]
  let str = ""
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === "style") {
      // color:red;background:blue
      let styleObj = {}
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        styleObj[arguments[1]] = arguments[2]
      })
      attr.value = styleObj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(el) {
  if (el.type == 1) {
    // element = 1 text = 3
    return generate(el)
  } else {
    let text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`
    } else {
      // 'hello' + arr + 'world'    hello {{arr}} {{aa}} world
      let tokens = []
      let match
      let lastIndex = (defaultTagRE.lastIndex = 0) // CSS-LOADER 原理一样
      while ((match = defaultTagRE.exec(text))) {
        // 看有没有匹配到
        let index = match.index // 开始索引
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`) // JSON.stringify()
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join("+")})`
    }
  }
}

function genChildren(el) {
  let children = el.children // 获取儿子
  if (children) {
    return children.map((c) => gen(c)).join(",")
  }
  return false
}

export function generate(el) {
  //  _c('div',{id:'app',a:1},_c('span',{},'world'),_v())
  // 遍历树 将树拼接成字符串
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? genProps(el.attrs) : "undefined"
  }${children ? `,${children}` : ""})`

  return code
}
```

假设我们有下面的template结构：
```html
<div style="color:red">hello {{name}} <span></span></div>
```

经过我们通过正则匹配生成的ast语法树之后，我们需要拼接成如下字符串的形式:
```js
_c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
```
也就是 generate 函数最终返回的 code。


拿到 code 之后，我们使用`new Function` 和 with，生成最终的renderFn。

```js
export function compileToFunctions(template) {
  // 生成ast语法树
  let root = parseHTML(template);
  // 根据ast语法树拼接成字符串
  let code = generate(root);
  // 基于new Function 和 with 生成render函数
  let render = `with(this){return ${code}}`;
  let renderFn = new Function(render);
  // 最终 compileToFunctions 就是返回一个render函数
  return renderFn
}
```

## 执行挂载操作

生成render函数之后，我们在`$mount`方法上要进行挂载操作:

```js{18}
// ....
Vue.prototype.$mount = function (el) {
  const vm = this
  const options = vm.$options
  el = document.querySelector(el)
  vm.$el = el
  // 把模板转化成 对应的渲染函数 => 虚拟dom概念 vnode => diff算法 更新虚拟dom => 产生真实节点，更新
  if (!options.render) {
    // 没有render用template，目前没render
    let template = options.template
    if (!template && el) {
      // 用户也没有传递template 就取el的内容作为模板
      template = el.outerHTML
      let render = compileToFunction(template)
      options.render = render
    }
  }
  mountComponent(vm, el)
}
...
```

我们来看下 mountComponent 的实现

```js
// 这个方法会在index.js 中会被调用，原型上拥有 _update 方法
// 这个方法接收一个vnode作为参数
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // 这里才是真正生成真实dom的地方
  }
}

export function mountComponent(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render()) // 后续更新可以调用updateComponent方法
    // 用虚拟dom 生成真实dom
  }
  // 初始化会首先执行一次
  updateComponent()
}
```

上面代码中的`vm._render`方法，其实内部调用就是我们在上面生成的render方法。之所以在这里可以使用`vm._render`是因为在index.js中会调用 `renderMixin(Vue)`

核心就是实现 `_update` 还有 `_render`。


我们来看下 `_render` 的实现: 

```js
import { createElement, createTextElement } from "./vdom/index"

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // createElement
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function (text) {
    // createTextElement
    return createTextElement(this, text)
  }
  Vue.prototype._s = function (val) {
    // stringify
    if (typeof val == "object") return JSON.stringify(val)
    return val
  }
  Vue.prototype._render = function () {
    const vm = this
    // 就是我们解析出来的render方法，同时也有可能是用户写的
    let render = vm.$options.render 
    let vnode = render.call(vm)
    return vnode
  }
}
```

`_update` 方法的核心是一个patch方法，用于新老vnode的对比，然后生成新的dom，最后插入到节点上。

```js
export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType == 1) {
    // 用vnode  来生成真实dom 替换原本的dom元素
    const parentElm = oldVnode.parentNode // 找到他的父亲
    let elm = createElm(vnode) //根据虚拟节点 创建元素
    parentElm.insertBefore(elm, oldVnode.nextSibling)

    parentElm.removeChild(oldVnode)
  }
}

function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode
  if (typeof tag === "string") {
    // 元素
    vnode.el = document.createElement(tag) // 虚拟节点会有一个el属性 对应真实节点
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

```

