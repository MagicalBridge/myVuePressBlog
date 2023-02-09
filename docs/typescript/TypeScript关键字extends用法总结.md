---
sidebar: auto
---

# TypeScript关键字extends用法总结
[参考文章](https://juejin.cn/post/6998736350841143326#comment)

## 1.接口继承

extends 用来做继承功能，大家应该都不陌生，ES6中Class语法也是使用它来做继承使用，在TS中用法也类似，来看示例：

```ts
interface T1 {
  name: string;
}

interface T2 {
  age: number;
}

// 多重继承,  逗号分隔
interface T3 extends T1,T2 {
  nationality: string; // 国籍
}

// 符合规范
const t3:T3 = {
  name: '小明',
  age: 18,
  nationality:'中国'
}
```

上面示例中，T1和T2两个接口，分别定义了name和age两个属性，T3则使用extends使用多重继承的方式，继承了T1和T2，同时定义了自己的属性nationality，此时，T3除了自己的属性之外，还同时具有来自T1和T2的属性。

## 2.条件判断

### 普通用法

条件判断的用法，先直接看个例子

```ts
// 示例1
interface Animal {
  eat(): void
}

interface Dog extends Animal {
  bite(): void
}

// A的类型为string
type A = Dog extends Animal ? string : number;

const a: A = "这是一个字符串"
```

`extends`用来条件判断的语法和JS中的三元表达是很相似，如果问号前面的判断为真，则将第一个类型string赋值给A，否则将第二个类型number赋值给A。

那么，接下来的问题就是，extends判断条件真假的逻辑是什么？

很简单，**如果extends前面的类型能够赋值给extends后面的类型，那么表达式判断为真，否则为假。**

上面的示例中，Dog 是 Animal 的子类，父类比子类的限制更少，能满足子类，则一定能够满足父类，Dog类型的值可以赋值给Animal类型的值，判断为真。

再看一个例子：

```ts
// 示例2
interface A1 {
  name: string;
}

interface A2 {
  name: string;
  age: number;
}
// A的类型为string
type A = A2 extends A1 ? string : number;

const a: A = 'this is string';
```

A1，A2两个接口，满足A2的接口一定可以满足A1，所以条件为真，A的类型取string

到目前为止已经介绍了extends的基本的用法，非常好理解。


### 泛型用法

- 1.分配条件类型

先看示例：

```ts
type A1 = 'x' extends 'x' ? string : number; // string 
type A2 = ('x' | 'y') extends 'x' ? string : number; // number

type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'> // string | number
```

A1和A2是extends条件判断的普通用法，和上面的判断方法一样, 'y' extends 'x' 值为假，所以 'x' | 'y' extends 'x' 值为假。

P是带参数的T的泛型类型，它的表达式和A1, A2的形式完全相同，A3是泛型类型P传入参数'x' | 'y'得到的类型，如果将'x' | 'y'带入泛型类的表达式，可以看到和A2类型的形式是完全一样的，那是不是说明，A3和A2的类型就是完全一样的呢？

有兴趣可以自己试一试，这里就直接给结论了

```ts
type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'>  // A3的类型是 string | number
```

这种表现确实有些反直觉，这种反直觉的结果的原因就是所谓的**分配条件类型**（Distributive Conditional Types）

> When conditional types act on a generic type, they become distributive when given a union type

用通俗的语言来解释上面这句话:

对于使用extends关键字的条件类型（即上面的三元表达式类型），如果extends前面的参数是一个**泛型类型**，当传入该参数的是联合类型时，则使用分配律计算最终的结果。分配率是指，将联合类型的联合项拆成单项，分别带入条件类型，然后将每个单项带入得到的结果再联合起来，得到最终的判断结果。

还是用上面的例子说明：

```ts
type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'>  // A3的类型是 string | number
```

该例子中，extends的前面参数是T，T是一个泛型参数，在A3的定义中，给T传入的是 'x' 和 'y' 的联合类型 `'x' | 'y'`, 满足分配律，于是'x'和'y'被拆开，分别代入`P<T>`:

```ts
P<'x' | 'y'> => P<'x'> | P<'y'>
```

'x'代入得到

```ts
'x' extends 'x' ? string : number => string
```

'y'代入得到

```ts
'y' extends 'x' ? string : number => number
```

然后将每一项代入得到的结果联合起来，得到 `string | number`

总之，满足两个要点即可适用分配律：第一，参数是泛型类型，第二，代入参数的是联合类型。


- 2.特殊的never

我们都知道，never类型是所有类型的子类型

```ts
// never是所有类型的子类型
type A1 = never extends 'x' ? string : number; // string

type P<T> = T extends 'x' ? string : number;
type A2 = P<never> // never
```

上面的示例中，A2和A1的结果竟然不一样，看起来never并不是一个联合类型，所以直接代入条件类型的定义即可，获取的结果应该和A1一直才对。

事实上，这里还是条件分配类型在起作用，**never被认为是空的联合类型**，也就是说，没有联合项的联合类型，所以还是满足上面的分配律，所以`P<T>`的表达式其实根本就没有执行，所以A2的定义也就类似于永远没有返回的函数一样，是never类型的。


- 3.防止条件判断中的分配

```ts
type P<T> = [T] extends ['x'] ? string : number;
type A1 = P<'x' | 'y'> // number
type A2 = P<never> // string
```

在条件判断类型的定义中，将泛型参数使用[]括起来，即可阻断条件判断类型的分配，此时，传入参数T的类型将被当做一个整体，不再分配。








