## 1.1 初识 npm script

首先介绍创建 package.json 文件的科学方法，目标是掌握 npm init 命令。然后通过在终端中运行自动生成的test命令，详细说明 npm脚本的执行流程。然后，动手给项目添加 eslint 命令，熟悉创建自定义命令的基本流程。

### 用npm init 快速创建项目

npm 为我们提供了快速创建 package.json 文件的命令 npm init，执行该命令会问几个基本问题，如包名称、版本号。作者信息。入口文件、仓库地址、许可协议等，多数问题已经提供了默认值，你可以在问题后面敲回车接收默认值。

```
package name: (hello-npm-script)
version: (0.1.0)
description: hello npm script
entry point: (index.js)
test command:
git repository:
keywords: npm, script
license: (MIT)
```

上面的例子指定了描述（description）和关键字（keywords）两个字段，基本问题问完之后 npm 会把 package.json 文件内容打出来供你确认:

```json
{
  "name": "hello-npm-script",
  "version": "0.1.0",
  "description": "hello npm script",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "script"
  ],
  "author": "",
  "license": "MIT"
}
```