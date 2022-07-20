# onecrm-pc项目开发规范

## 背景
onecrm项目使用的是中台提供的脚手架搭建，技术选型使用的是 React + TypeScript

## TypeScript的优势
  
#### 1、静态输入
>静态类型化是一种功能，可以在开发人员编写脚本时检测错误。查找并修复错误是当今开发团队的迫切需求。有了这项功能，就会允许开发人员编写更健壮的代码并对其进行维护，以便使得代码质量更好、更清晰。

#### 2、大型的开发项目
>有时为了改进开发项目，需要对代码库进行小的增量更改。这些小小的变化可能会产生严重的、意想不到的后果，因此有必要撤销这些变化。使用TypeScript工具来进行重构更变的容易、快捷。

#### 更好的协作
>当发开大型项目时，会有许多开发人员，此时乱码和错误的机也会增加。类型安全是一种在编码期间检测错误的功能，而不是在编译项目时检测错误。这为开发团队创建了一个更高效的编码和调试过程。

#### 更强的生产力
>干净的 ECMAScript 6 代码，自动完成和动态输入等因素有助于提高开发人员的工作效率。这些功能也有助于编译器创建优化的代码。


## 函数组件

React Hooks 出现以后，函数组件有了更多的出错概率，由于函数组件只是一个普通的函数，它非常容易进行类型声明

- 1、使用 **ComponentNameProps** 形式命名`Props`类型，并导出()。
- 2、优先使用**FC**类型来声明函数组件
>FC是FunctionComponent的简写, 这个类型定义了默认的 props(如 children)以及一些静态属性(如 defaultProps)

```ts
import React, { FC } from 'react';

/**
 * 声明Props类型
 */
export interface OneCrmComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export const OneCrmComponent: FC<OneCrmComponentProps> = props => {
  return <div>hello react</div>;
};
```

这里我们将 OneCrmComponentProps 接口类型定义导出，目的是为了后续的复用和向上层的抽象(可能多个函数组件的props是一致或者大部分类型一样，这样就可以抽象出更加基础的interface)。



你也可以直接使用普通函数来进行组件声明, 下文会看到这种形式更加灵活:
```ts
import React, { FC } from 'react';

export interface OneCrmComponentProps {
  className?: string;
  style?: React.CSSProperties;
  // 手动声明children
  children?: React.ReactNode;
}

export function OneCrmComponent(props: OneCrmComponentProps) {
  return <div>hello react</div>;
}
```
- 3、不要直接使用export default导出组件

我们的组件定义中不仅包含组件本身的定义，还可能包含接口类型定义等其他需要导出的模块, 在使用时，尽量采用解构导入的语法：

```ts
import { 
  OneCrmComponent,
  OneCrmComponentProps 
} from "OneCrmComponent.tsx"
```

- 4、默认属性的声明 
在使用js开发函数式组件的时，只需要给 defaultProps 设置一个对象即可。但是这种写法，在使用FC类型声明时，并不能完美支持。

```ts
import React, { FC } from 'react';

export interface OneCrmProps {
  name: string;
}

export const OneCrm: FC<OneCrmProps> = ({ name }) => <div>Hello {name}!</div>;

OneCrm.defaultProps = { name: 'oneCrm' };

// ❌! missing name
<OneCrm />;
```

如何解决这个问题，可以使用ES6中对象的默认值属性语法。

```ts
import React, { FC } from 'react';

export interface OneCrmProps {
  name?: string; // 声明为可选属性
}

// 利用对象默认属性值语法
export const OneCrm: FC<OneCrmProps> = ({ name = 'oneCrm' }) => <div>Hello {name}!</div>;

// 调用正常
<OneCrm />;
```

- 5、泛型函数组件

泛型在一些列表型或者容器型的组件中比较常用，直接使用FC无法满足需求：

```ts
import React from 'react';

export interface ListProps<T> {
  visible: boolean;
  list: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function List<T>(props: ListProps<T>) {
  return <div />;
}

// Test
function Test() {
  return (
    <List
      list={[1, 2, 3]}
      renderItem={i => {
        /*自动推断i为number类型*/
      }}
    />
  );
}
```







