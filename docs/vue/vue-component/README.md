---
sidebar: auto
---

<!-- ## vue中的组件 -->

## 一、vue中的组件

### 写在前面

vue.js 最精髓的，正是它的组件与组件化，写一个vue工程，也正是写一个个的组件。

业务场景千变万化，而不变的是vue.js组件的核心思想使用技巧，掌握了vue.js组件的各种开发模式，再复杂的场景也可以应对。

### 组件的分类

一般来说，vue.js 组件主要分为三类：

1. 由 vue-router 产生的每个页面，本质上也是一个组件 （.vue），主要承载当前页面的HTML结构，包含数据的获取、数据整理、数据可视化等常规业务。整个文件相对较大，但是一般不会有 `props` 选项和`自定义事件`,因为它作为路由的渲染，不会被复用，因此也不会对外提供接口。在项目开发中，我们写的大部分代码都是这类组件（页面），协同开发时候，每个人维护自己的页面，很少有交集。这类组件相对好些，因为主要是还原设计稿，完成需求，不需要太多模块和架构设计上的考虑。

2. 不包含业务，独立、具体功能的基础组件，比如、模态框等。这类组件作为项目的基础控件，会被大量使用，因此组价你的API进行过高强度的抽象，可以通过不同的配置实现不同的功能。独立组件的开发难度要高于第一类组件，因为它的侧重点是API的设计、兼容性、性能，以及复杂的功能。 这类组件对JavaScript的编程能力有一定的要求，也会包含非常多的技巧，比如在不依赖 Vuex 和 Bus(因为独立组件，无法依赖其他库)的情况下，各组件的通信、还会涉及到很多其他问题。


3. 业务组件。它不像第二类独立组件只包含某个功能，而是在业务中被多个页面复用的，它与独立组件的区别是，业务组件只在当前项目中会用到，不具有通用性，而且会包含一些业务，比如数据请求；而独立组件不含业务，在任何项目中都可以使用，功能单一，比如一个具有数据校验功能的输入框。业务组件更像是介于第一类和第二类之间，在开发上也与独立组件类似，但寄托于项目，你可以使用项目中的技术栈，比如 Vuex、axios、echarts 等，所以它的开发难度相对独立组件要容易点，但也有必要考虑组件的可维护性和复用性。


## 二、3个API: prop、event、slot

### 组件的构成

一个再复杂的组件，都是由三个部分组成：prop、event、slot，它们构成了vue.js的组价的API,如果你开发的是一个通用组件，那一定要事先设计好这三部分，因为组件一旦发布，后面再修改 API 就很困难了，使用者都是希望不断新增功能，修复 bug，而不是经常变更接口。如果你阅读别人写的组件，也可以从这三个部分展开，它们可以帮助你快速了解一个组件的所有功能。

#### 属性prop

prop 定义了这个组件有哪些可配置的属性，组件的核心功能也都是它来确定的。写通用组件的时候，props最好使用**对象**的写法，这样可以针对每个属性设置类型、默认值或者自定义校验属性的值，这点在组件开发中很重要，如果我们使用props的数组用法，这样的组件往往不够严谨，比如我们封装一个自己的按钮组件 `<i-button>`

```vue
<template>
  <button :class="'i-button-size' + size" :disabled="disabled"></button>
</template>
<script>
  // 判断参数是否是其中之一
  function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true;
      }
    }
    return false;
  }

  export default {
    props: {
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large', 'default']);
        },
        default: 'default'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
```

使用组件:
```html
<i-button size="large"></i-button>
<i-button disabled></i-button>
```

让我们分析下上面的组件，组件中我们定义了两个属性：尺寸size和是否禁用disabled。其中size使用 `validator` 进行了值的自定义验证，也就是说，从父级传入的size，它的值必须是指定的 small、large、default 中的一个，默认值是default，如果传入这三个以外的值，都会抛出一条警告。

要注意的是，组件里定义的props，都是**单向数据流**，也就是只能通过父级修改，组件自己不能修改props的值，只能修改定义在data里面的数据，非要修改，也是通过后面介绍的自定义事件通知父级，由父级来修改。

在使用组件的时候，也可以传入一些标准的html特性，比如 id  class

```html
<i-button id="btn1" class="btn-submit"></i-button>
```

这样的html特性，在组件内的 `<button>`元素上会继承,并不需要在props里面再定义一遍，这个特性是默认支持的，如果不期望开启，在组件选项里面配置`inheritAttrs: false` 就可以禁用了。


#### 属性prop

如果要给上面的按钮组件 `<i-button>` 添加一些文字内容，就要用到组件的第二个API: 插槽 slot，它可以分发组件的内容，比如在上面的按钮组件中定义一个插槽:

```vue
<template>
  <button :class="'i-button-size' + size" :disabled="disabled">
    <slot></slot>
  </button>
</template>
```

这里的 `<slot>` 节点就是指定的一个插槽的位置，这样在组件内部就可以扩展内容了：

```vue
<i-button>按钮 1</i-button>
<i-button>
  <strong>按钮 2</strong>
</i-button>
```

当需要多个插槽时候，会用到具名的slot，比如上面的组件我们再添加一个slot，用于设置另一个图标组件:

```vue
<template>
  <button :class="'i-button-size' + size" :disabled="disabled">
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>
```

```vue
<i-button>
  <i-icon slot="icon" type="checkmark"></i-icon>
  按钮 1
</i-button>
```

这样，父级内定义的内容，就会出现在组件对应的slot里面，没有写名字的，就是默认的slot。

在组件的 `<slot>` 里也可以写一些默认的内容，这样在父级没有写任何slot时候，它们就会出现，比如：

```vue
<slot>提交</slot>
```

