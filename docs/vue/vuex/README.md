---
sidebar: auto
---

# Vuex 源码解析

## Vuex初始化

Vuex的初始化主要包含两个方面：
- 1、install（安装过程）
- 2、Store实例化

## 安装
当我们在代码中通过`import Vuex from 'vuex'`的时候，实际上引用的是一个对象,它的定义在 `src/index.js`中：

```js
export default { 
  Store, 
  install, 
  version: '__VERSION__', 
  mapState, 
  mapMutations, 
  mapGetters, 
  mapActions, 
  createNamespacedHelpers 
}
```
和 Vue-Router 一样，Vuex也同样存在一个静态的`install`方法,它的定义在`src/store.js`中：
```js
// src/store.js
export function install (_Vue) { 
  if (Vue && _Vue === Vue) { 
    if (process.env.NODE_ENV !== 'production') { 
      console.error( '[vuex] already installed. Vue.use(Vuex) should be called only once.' ) 
    }return 
  }
  Vue = _Vue 
  applyMixin(Vue)
}
```

install 的逻辑其实很简单，把传入的 _Vue 赋值给Vue 并执行 applyMixin(Vue) 方法，它是定义在 src/mixin.js 中:

```js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) { 
    Vue.mixin({ beforeCreate: vuexInit }) 
  } else { 
    // override init and inject vuex init procedure 
    // for 1.x backwards compatibility. 354
    const _init = Vue.prototype._init 
    Vue.prototype._init = function (options = {}) { 
      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit _init.call(this, options) 
    }
  }
  function vuexInit () { 
    const options = this.$options 
    // store injection 
    if (options.store) { 
      this.$store = typeof options.store === 'function' ? options.store() : options.store 
    } else if (options.parent && options.parent.$store) { 
      this.$store = options.parent.$store 
    } 
  }
}
```

applyMixin 就是这个 `export default function` 它还兼容了 1.0版本的，我们这里只关注 2.0 以上版本的逻辑，它实际上就是在全局混入了一个 beforeCreate 钩子函数，它的实现非常简单，就是把option.store 保存在所有的组件的 this.$store 中，这个options.store 就是我们在实例化Store 对象的实例。

## Store 实例化

我们在 import Vuex 之后，会实例化其中的Store对象，返回store实例并传入 new Vue 的Options 中，也就是我们刚才提到的 option.store。

举个简单的例子，如下:

```js
export default new Vuex.Store({
  actions, 
  getters, 
  state, 
  mutations, 
  modules // ...
})
```

