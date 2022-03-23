---
sidebar: auto
---

# Button 组件

## Button组件的两个关键属性
在我们使用btn组件的时候，一般来说，我们会传入 ButtonType 用来控制 按钮的样式，比如是传统的样式，还是一些警告的样式。还会传入尺寸信息，用来控制大小。并且对于button组件来说，一般会分文两种，一种是 link类型的，这种类型在底层是使用a标签来实现的，另一种就是使用 button 原生实现的。

### 需要给组件动态的绑定样式
这里使用到了一个很有名库 `classnames`, 并且在ts项目中使用还需要安装类型约束。`"@types/classnames": "^2.2.9",`

[使用方法](https://www.npmjs.com/package/classnames)

终端执行安装命令：
```bash
yarn add classnames
yarn add @types/classnames --dev
```

在package中新增开发依赖
```json
...
"devDependencies": {
  "@types/classnames": "^2.3.1"
}
...
```

文件夹的规范：样式自己单独维护，同一个组件的所有文件，包括测试文件，自己单独维护。

## 使用枚举和接口定义组件属性

关于组件的属性定义，我们可以使用枚举，同时接口中又能够使用枚举的值，这是一种ts的使用技巧。

```ts
export enum ButtonSize {
  Large = "lg",
  Small = "sm"
}

export enum ButtonType {
  Primary = 'primary',
  Default = 'default',
  Danger = 'danger',
  Link = 'link'
}

interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  children: React.ReactNode;
  href?: string;
}
```
