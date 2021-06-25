---
sidebar: auto
---

# Vue3.0源码结构分析

## Vue2与Vue3的对比
- 对于TypeScript支持不友好（所有属性都放在了this对象上，难以推导组价的数据类型）
- 大量的API挂载在vue对象的原型上，难以实现TreeShaking
- 架构层面对于跨平台dom渲染的开发支持不友好
- CompositionAPI。受ReactHook启发
- 对虚拟DOM进行了重写、对模板的编译进行了优化操作

## monorepo介绍
monorepo 是一种将多个package放在同一个repo中的代码管理模式

Vue3中 使用 yarn workspace + lerna 来管理项目。

::: tip
采用monorepo代码管理形式需要使用yarn
:::

```json
"workspaces": [
  "packages/*"
]
```
> 通过 `workspaces`来指定需要管理的模块