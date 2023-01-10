---
sidebar: auto
---

# React中的useMemo和useCallback

在react性能优化中，重复渲染问题是个逃不开的话题，useMemo、useCallback、在实际业务中有非常丰富的使用场景，让我们一起来梳理下这两个个hooks的使用。

## 正确理解 useMemo、useCallback、memo 的使用场景
在我们平时的开发中很多情况下我们都在滥用 useMemo、useCallback这两个 hook， 实际上很多情况下我们不需要甚至说是不应该使用，因为这两个 hook 在**首次render**时需要做一些额外工作来提供缓存。

同时既然要提供缓存那必然需要额外的内存来进行缓存，综合来看这两个 hook 其实并不利于页面的首次渲染甚至会拖慢首次渲染，这也是我们常说的“不要在一开始就优化你的组件，出现问题的时候再优化也不迟”的根本原因。

### useCallback 的作用
简单来说就是返回一个函数，只有在依赖项发生变化的时候才会更新（返回一个新的函数）。

### useCallback 的应用


### useMemo 的作用

简单来说就是传递一个创建函数和依赖项，创建函数会需要返回一个值，只有在依赖项发生改变的时候，才会重新调用此函数，返回一个新的值。

### 应用一：缓存子组件props中的引用类型

useMemo能针对传入子组件的值进行缓存优化。

```jsx
// ...
const [count, setCount] = useState(0);

const userInfo = {
  // ...
  age: count,
  name: 'Jace'
}

return <UserCard userInfo={userInfo}>
```

```jsx
// ...
const [count, setCount] = useState(0);

const userInfo = useMemo(() => {
  return {
    // ...
    name: "Jace",
    age: count
  };
}, [count]);

return <UserCard userInfo={userInfo}>
```

很明显，上面的userInfo每次都是一个新的对象，无论count有没有发生变化，都会导致UserCard重新渲染，而下面的这种写法则会在 count 改变后才会返回新的对象。

上面的场景比较简单，我们再来看一个更复杂的例子，在这之前，我们首先要明确组件在什么情况下会重新渲染。
- 组件的props 或者 state 变化会导致组件重新渲染
- 父组件重新渲染会导致其子组件重新渲染

这一步优化的目的是: **在父组件跟子组件没有关系的状态变更导致的重新渲染可以不渲染子组件，造成不必要的性能消耗**

大部分时候我们是明确知道这个目的的，但是很多时候却并没有达到目的，存在一定的误区：

#### 误区一：

```jsx
import { useCallback, useState } from "react";

const Child = (props) => {};

const App = () => {
  const handleChange = useCallback(() => {}, []);
  const [count, setCount] = useState(0);
  
  return (
    <>
      <div
        onPress={() => {
          setCount(count + 1);
        }}
      >
        increase
      </div>
      <Child handleChange={handleChange} />
    </>
  );
};

export default App;
```

我们很容易写出这样的代码，实际上完全不起作用，因为只要父组件重新渲染，Child 组件也会跟着重新渲染，这里的 useCallback 完全是白给的。

#### 误区二：

```jsx
import { useCallback, useState, memo } from "react";

const Child = memo((props) => {});

const App = () => {
  const handleChange = () => {};
  const [count, setCount] = useState(0);
  return (
    <>
      <div
        onPress={() => {
          setCount(count + 1);
        }}
      >
        increase
      </div>
      <Child handleChange={handleChange} />
    </>
  );
};

export default App;
```

对于复杂的组件项目中会使用 memo 进行包裹，目的是为了对组件接受的 props 属性进行浅比较来判断组件要不要进行重新渲染。这当然是正确的做法，但是问题出在 props 属性里面有引用类型的情况，例如数组、函数，如果像上面这个例子中这样书写，handleChange 在 App 组件每次重新渲染的时候都会重新创建生成，引用当然也是不一样的，那么势必会造成 Child 组件重新渲染。所以这种写法也是没有意义的。


#### 正确示范：

```jsx
import { useCallback, useState, memo, useMemo } from "react";

const Child = memo((props) => {});

const App = () => {
  const [count, setCount] = useState(0);
  // 保证传入的函数引用不变
  const handleChange = useCallback(() => {}, []);

  // 保证传入的list 不变
  const list = useMemo(() => {
    return [];
  }, []);

  return (
    <>
      <div
        onPress={() => {
          setCount(count + 1);
        }}
      >
        increase
      </div>
      <Child handleChange={handleChange} list={list} />
    </>
  );
};

export default App;
```

总结一下，memo是为了防止组件在 props 没有变化时重新渲染, 但是如果组件中存在类似于上面例子中的引用类型，还是那个原因每次渲染都会被重新创建，引用会改变，所以我们需要缓存这些值保证引用不变，避免不必要的重复渲染。


### 应用二：缓存 useEffect 的引用类型依赖

```jsx
import { useEffect } from 'react'
export default () => {
  const msg = {
    info: 'hello world',
  }
  useEffect(() => {
    console.log('msg:', msg.info)
  }, [msg])
}
```

上面代码中msg是一个对象，并且也是useEffect的依赖，这本意是在msg变化的时候打印msg的信息，但是实际上每次组件在render的时候msg都会被重新创建，msg的引用在每次render的时候都不一样，所以这里useEffect在每次render的时候都会重新执行，和我们预期的不一样，此时 useMemo 就可以派上用场了。

```jsx
import { useEffect, useMemo } from "react";

const App = () => {
  const msg = useMemo(() => {
    return {
      info: "hello world",
    };
  }, []);

  useEffect(() => {
    console.log("msg:", msg.info);
  }, [msg]);
};

export default App;
```

## 参考链接
[详解React中的useCallback和useMemo](https://juejin.cn/post/6844904101445124110#heading-7)