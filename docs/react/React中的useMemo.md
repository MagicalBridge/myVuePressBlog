---
sidebar: auto
---

# React中的useMemo
[原文链接](https://medium.com/swlh/should-you-use-usememo-in-react-a-benchmarked-analysis-159faf6609b7)

## 1. 什么是 useMemo？

useMemo 是 React 提供的一个hook 函数。这个钩子允许开发人员缓存变量的值和依赖列表。如果此依赖项列表中的任何变量发生更改，React 将重新运行此函数去处理并重新缓存它。如果依赖项列表中的变量值没有改版，则 React 将从缓存中获取值。

useMemo 主要是对组件的重新渲染有影响。一旦组件重新渲染，监听到它的依赖项没有发生改变，就会从缓存中提取值，而不必一次又一次地循环数组或者处理数据。

## 2. react 官方是怎么介绍 useMemo 的？

关于 useMemo，它在应该什么时候使用并没有被提及。只是简单地提到它的作用和使用方法。在使用 useMemo 之前，我们应该弄清楚数据应该有多复杂或大？开发者应该什么时候使用 useMemo？

## 3. 实验

首先让我们先定义一个假设，让我们首先定义要执行的对象和处理的复杂性为 n。如果 n = 100，那么我们需要循环遍历100条数据，以获得 memo-ed 变量的最终值。

然后，我们还需要分开两个操作：
- 第一是组件的初始渲染，在这种情况下，如果一个变量使用 useMemo 或不使用 useMemo，它们都必须计算初始值。
- 二是使用 useMemo 重新渲染，可以从缓存中取值，将表现出来的性能优势和不使用 useMemo 版本做对比。

### 3.1. 基准测试设置

我们设置了一个小的 React 组件如下，它将生成一个复杂度为 n 的对象，复杂度定义在 level变量中，作为参数传递给组件 。

```jsx
// BenchmarkNormal.jsx
import React from 'react';

const BenchmarkNormal = ({level}) => {
  const complexObject = {
    values: []
  };
  for (let i = 0; i <= level; i++) {
    complexObject.values.push({ 'mytest' });
  }
  return ( <section>Benchmark level: {level}</section>);
};

export default BenchmarkNormal;
```

这是我们正常的基准组件，我们还将为 useMemo 做一个基准组件 BenchmarkMemo。

```jsx
// BenchmarkMemo.jsx
import React, { useMemo } from 'react';

const BenchmarkMemo = ({level}) => {
const complexObject = useMemo(() => {
  const result = {
    values: []
  };
  
  for (let i = 0; i <= level; i++) {
    result.values.push({'mytest'});
  };
  return result;
}, [level]);
return (<section>Benchmark with memo level: {level}</section>);
};

export default BenchmarkMemo;
```

然后，我们在 `App.js` 中添加这些组件，当按下按钮时显示。我们还使用 React 的  `Profiler` 来计算渲染时间。
