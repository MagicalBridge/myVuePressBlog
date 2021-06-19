---
sidebar: auto
---

# Vue-Router 源码解析

## Vue-Router

路由的概念相信大家都不陌生，它的作用就是根据不同的路径映射到不同的视图。我们在用Vue开发实际项目的时候会用到Vue-Router这个官方插件来帮助我们解决路由的问题。Vue-Router的能力十分强大，它支持hash、history、abstract 3种路由方式，提供了 `<router-link>` 和 `<router-view>` 2种组件，还提供了简单的路由配置和一系列好用的**API**.

我们结合一些具体的示例来讲解

```html
<div id="app"> 
  <h1>Hello App!</h1> 
  <p>
    <!-- 使⽤ router-link 组件来导航. --> 
    <!-- 通过传⼊ `to` 属性指定链接. --> 
    <!-- <router-link> 默认会被渲染成⼀个 `<a>` 标签 --> 
    <router-link to="/foo">Go to Foo</router-link> 
    <router-link to="/bar">Go to Bar</router-link> 
  </p> 
  <!-- 路由出⼝ --> <!-- 路由匹配到的组件将渲染在这⾥ --> 
  <router-view></router-view> 
</div>
```

```js
import Vue from 'vue' 
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 1. 定义（路由）组件。 
// 可以从其他⽂件 import 进来 
const Foo = { template: '<div>foo</div>' } 
const Bar = { template: '<div>bar</div>' } 

// 2. 定义路由 // 每个路由应该映射⼀个组件。 其中"component" 可以是 
// 通过 Vue.extend() 创建的组件构造器， 
// 或者，只是⼀个组件配置对象。 
// 我们晚点再讨论嵌套路由。 
const routes = [ 
  { path: '/foo', component: Foo }, 
  { path: '/bar', component: Bar } 
]

// 3. 创建 router 实例，然后传 `routes` 配置 
// 你还可以传别的配置参数, 不过先这么简单着吧。 

const router = new VueRouter({ 
  routes // （缩写）相当于 routes: routes 
})

// 4. 创建和挂载根实例。 
// 记得要通过 router 配置参数注⼊路由， 
// 从⽽让整个应⽤都有路由功能 

const app = new Vue({ 
  router 
}).$mount('#app')
```
这是一个很简单的例子,接下来我们先从 Vue.use(VueRouter) 说起。

## 路由注册
Vue 从它的设计上就是一个渐进式的JavaScript框架，它本身的核心是解决视图渲染的问题，其他的能力就通过插件的方式来解决。Vue-Router 就是官方维护的路由插件，在介绍它的注册实现之前，我们先来分析一下Vue通用插件的注册原理。

### Vue.use

Vue提供了Vue.use的全局API来注册这些插件，所以我们先来分析一下它的实现原理，定义在`vue/src/core/global-api/use.js`中：

```js
export function initUse (Vue: GlobalAPI) { 
  Vue.use = function (plugin: Function | Object) { 
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = [ ])) 
    if (installedPlugins.indexOf(plugin) > -1) { 
      return this 
    }
    const args = toArray(arguments, 1) 

    args.unshift(this) 
    
    if (typeof plugin.install === 'function') { 
      plugin.install.apply(plugin, args) 
    } else if (typeof plugin === 'function') { 
      plugin.apply(null, args) 
    }
    installedPlugins.push(plugin) 
    return this 
  } 
}
```

Vue.use 接收一个plugin参数，并且维护一个 _installedPlugins 数组，它存储所有注册过的 plugin 接着又会判断 plugin 有没有定义 install 方法，如果有的话则调用该方法，并且该方法执行的第一个参数是Vue；最后把plugin存储到_installedPlugins中。

可以看到Vue提供的插件注册机制是非常简单的，每个插件都需要提供一个静态的install方法，当我们执行Vue.use 注册插件的时候，就会执行这个 inistall 方法，并且这个install 方法的第一个参数我们可以拿Vue对象，这样的好处就是作为插件的编写方不需要再额外的去 import Vue了。