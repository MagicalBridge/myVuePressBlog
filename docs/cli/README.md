---
sidebar: auto
---
# 脚手架

## 脚手架的搭建学习

### 发布属于自己的第一个脚手架

首先，首先我们需要创建一个npm的项目。在终端执行命令：
```
npm init -y
```
会生成一个package.json 文件

```json
{
  "name": "zf-process-cli",
  "version": "1.0.0",
  "description": "",
  "bin": {
    "zf-process-cli": "bin/index.js"
  },
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "chupengfei <chupengfeiit@gmail.com> (https://github.com/MagicalBridge)",
  "license": "ISC"
}
```

第二步：在根目录下创建一个bin目录，并创建一个index.js.

```
├── bin
│   └── index.js
└── package.json
```

第三步：先登录 npm 官网，如果自己使用nrm管理 npm 源的时候，不要忘记了切换到npm官方源。

```
nrm use npm // 切换到官方源进行处理
npm login 
```
按照要求填写用户名、密码、邮箱。

第四步：执行 npm publish 这一步需要注意，可能会因为发布过相同的版本而没有办法发布成功，注意修改版本。

### 脚手架的本地调试

第一步: 进入到脚手架所在的目录，执行 npm link。

具体的场景, 我本地创建一个脚手架, 还没有发布到线上，不能执行 `npm install -g zf-process-cli` 这种形式的安装。又想要调试脚手架是否可运行，可以在脚手架目录下执行执行`npm link`，

```shell
zf-process-cli git:(main) npm link

added 1 package, and audited 3 packages in 1s

found 0 vulnerabilities
```
第二步：如何确定脚手架本地已经链接成功？
此时使用 `which zf-process-cli` 查看当前脚手架的可执行命令已经被连接到了全局的node_module的bin目录下。如果显示已经连接到全局的node_module的bin目录下，说明已经连接成功，此时在终端中执行 脚手架的命令，就能启动脚手架。

```shell
zf-process-cli git:(main) ✗ which zf-process-cli
/Users/louis/.nvm/versions/node/v12.18.3/bin/zf-process-cli
```
事实上，我们在全局安装的所有的node_modules包都会默认放在这个目录下面
```shell
zf-process-cli git:(main) ✗ which npm
/Users/louis/.nvm/versions/node/v12.18.3/bin/npm

zf-process-cli git:(main) ✗ which yarn
/Users/louis/.nvm/versions/node/v12.18.3/bin/yarn
```
第三步：我们修改 脚手架中的代码，此时执行脚手架命令，会实时同步代码。

第四步：如何移除本地的链接？
我曾经尝试过使用`npm unlink zf-process-cli` 并没有成功。真实生效的命令是执行
```shell
npm uninstall -g zf-process-cli
```
这样就从全局的node_modules bin 目录下将脚手架移除了。

我们不禁会好奇，为什么会有这种情况，我们进入本地全局node_modules的下面bin目录执行如下操作

```shell
bin git:(f355b32) ✗ ll zf-process-cli
lrwxr-xr-x  1 louis  staff    47B  8 30 07:52 zf-process-cli -> ../lib/node_modules/zf-process-cli/bin/index.js
```

实际上执行link之后，生成了一个软连接，`bin/zf-process-cli` 指向的是 `../lib/node_modules/zf-process-cli/bin/index.js` 这个包的入口文件，这个是我们在package.json 中配置的规则。

```json{5-7}
{
  "name": "zf-process-cli",
  "version": "1.0.0",
  "description": "",
  "bin": {
    "zf-process-cli": "bin/index.js"
  },
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "chupengfei <chupengfeiit@gmail.com> (https://github.com/MagicalBridge)",
  "license": "ISC"
}
```

### 分包联合调试

在实际开发过程中，由于脚手架功能较多，不可能将所有的内容都写在一个包之中，需要将脚手架进行分包处理。这就是涉及到分包的联合调试，有这样的文件目录：

```
# zf-process-cli
.
├── core // 核心模块
│   ├── bin
│   │   └── index.js
│   └── package.json
└── lib // lib 工具模块
    ├── package.json
    └── src
        └── index.js
```

lib包还没有发布到npm线上的时候，就能够进行调试，这个应该如何操作呢？

第一步：在lib包中执行 `npm link` 变成全局模块。
```shell
# lib 目录下 
npm link
```
因为lib是一个库文件，且没有配置bin入口，因此执行完之后，再执行 which lib 是找不到的。但是在node_modules 中是能够找到lib 这个文件的。

第二步：进入 core 目录 执行 `npm link lib`
```shell
# core 目录下 
npm link lib
```
这样就能在core目录下添加一个node_modules文件夹，里面存放的就是lib目录。
```
# zf-process-cli
.
├── core
│   ├── bin
│   │   └── index.js
│   ├── node_modules
│   │   └── lib -> ../../lib
│   └── package.json
└── lib
    ├── package.json
    └── src
        └── index.js
```
第三步: 在core中引入 lib 模块的函数,可以使用。

```js
// core/bin/index.js
#!/usr/bin/env node
const lib = require("lib")

console.log(lib.sum);

console.log("welcome process-cli")
```

### 深入理解 npm link 命令

经过上述两个简单的用例可以看出来，无论是单一文件发布成脚手架，还是多包状态下调试，都离不开一个命令`npm link`。

- `npm link you-lib`: 将当前项目中node_modules下指定的库文件链接到 node 全局下 node_module下的库文件
- `npm link`: 将当前项目链接到 node 全局 node_modules中作为一个库文件，并解析 bin 配置创建可执行的文件

### 如何解除本地链接呢？
解除的步骤和链接的步骤是相反的。

- 第一步: 在core目录中执行`npm unlink lib` 这个步骤执行完毕后lib从core的依赖中解除。
- 第二步: 删除node_modules依赖，删除 package.lock 文件。
- 第三步: lib link到全局之后 执行 `npm  remove -g lib` 删除依赖包，然后删除 package.lock 文件。

## 使用 lerna 初始化项目
lerna 是一款非常优秀的包管理工具，上面我们手动创建的包可以很方便的交给工具。
- 1 使用 npm init -y 初始化一个npm 项目。
- 2 在本地安装 lerna 依赖、全局安装 lerna 依赖。
- 3 执行lerna init 初始化lerna项目
- 4 执行lerna create core 创建一个叫做core的包，这里需要注意，新建组，因为我们的子包肯定已经被注册过了。
- 5 执行lerna create utils 创建一个工具包。
