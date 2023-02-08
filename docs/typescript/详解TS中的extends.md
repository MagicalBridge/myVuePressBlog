---
sidebar: auto
---

# Typescript中的extends用法总结

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



