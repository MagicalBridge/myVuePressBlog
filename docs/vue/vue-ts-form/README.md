---
sidebar: auto
---

# Vue + ts + 表单

## 核心功能
- 表单生成
- 主题系统
- 插件系统

相比较和表单组件库的区别
- 无需写代码
- 可以全栈通用
- 可以跨平台

## 2-1 vue3项目初始化搭建
- 了解vue3的项目的结构
- 学习vue3项目的一些基本开发知识
- 讲解vue3和vue2的一些区别

保证本地安装了vue-cli工具, 创建项目:

```
vue create vue-ts-json-form
```

这里我们选择手动选择需要的内容, 我这里使用vue-cli创建项目遇到了网络问题，给我造成了不小的困扰，我因此进行了项目的拷贝。也是安装依赖成功了。

在 tsconfig.json 文件中有一个选项值得我们关注：

```json
"jsx": "preserve",
```
事实上ts是支持编译jsx, 这个配置就是告诉ts不要去编译，因为虽然同样是jsx但是vue和react还是不一样的。

我们后期需要安装专门的babel插件来转换vue3的代码。

## 2-2 代码格式化工具 prettier

在根目录上新建 .prettierrc 文件。

添加配置：

```json
{
  "semi": false, // 是否要写分号
  "singleQuote": true, // 单引号
  "arrowParens": "always", // 是否要写 (x) => 
  "trailingComma": "all" // 是否obj属性最后加上一个逗号
}
```

## 





