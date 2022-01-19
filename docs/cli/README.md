---
sidebar: auto
---
# 脚手架

## 脚手架的搭建学习

### 脚手架的核心价值
- 自动化：项目重复代码拷贝/git操作/发布上线操作
- 标准化：项目创建/git flow/发布流程/回滚流程
- 数据化：研发过程系统化、数据化，使得研发过程可以量化

### 脚手架的理解
脚手架本质是一个操作系统的客户端，它通过命令行执行，比如：

```bash
vue create vue-test-app
```

上面这条命令由3个部分组成:
- 主命令：vue
- command：create
- command 的 params：vue-test-app

它表示创建一个vue项目，项目的名称 为 vue-test-app，以上是一个比较简单的脚手架命令。

实际场景中可能比较复杂，比如当前目录已经存在了，我们需要覆盖当前目录下文件，强制进行安装vue项目。

![脚手架运行原理](./../images/cli/02.png)

- 当我们在终端中输入vue后，会在环境变量中找到vue指令，which vue(在mac中，可以输入which vue 查看某些命令是否存在)。
我在本机中输入 which vue 输出vue这个命令的指令所在的目录。
```bash
which vue
/usr/local/bin/vue
```
根据输出的信息，我进入了  /usr/local/bin/vue 这个目录。查看vue命令的软链 因为我是通过yarn 全局安装的vue命令。所以指向的是yarn的目录。

```bash
vue -> ../../../Users/louis/.config/yarn/global/node_modules/.bin/vue
```

让我们总结一下：
- 终端中输入 vue create vue-test-app
- 终端中解析出vue 命令
- 终端在环境变量中 找到vue命令
- 终端根据vue命令链接到实际文件vue.js
- 终端利用node执行vue.js
- vue.js解析 command / options
- vue.js 执行 command
- 执行完毕，退出执行


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

### 总结一下脚手架本地link标准流程
- 因为本地的脚手架还没有发布上线，但是想要实现和发布后的脚手架的使用效果，首先在本地执行
``` shell 
cd your-cli-dir
npm link
```
执行上述操作之后，就可以像使用vue脚手架那样使用这个自己的脚手架了，而且更改了代码还能实时更新。

- 由于分包处理的原因，有时候脚手架需要链接本地的lib库
```bash
cd your-lib-dir
npm link # 将本地的lib库链接为全局的库

cd your-cli-dir
npm link your-lib # 进入脚手架目录，link lib库
```

### 总结一下如何解除本地链接
- 首先进入本地的lib库 解除本地链接
```bash
cd your-lib-dir
npm unlink
```

- 进入cli目录 解除链接
```bash
cd your-cli-dir
# link 存在
npm unlink your-lib 
# link 不存在
rm -rf node_modules
npm install
```

### 如何解除本地链接呢？
解除的步骤和链接的步骤是相反的。

- 第一步: 在core目录中执行`npm unlink lib` 这个步骤执行完毕后lib从core的依赖中解除。
- 第二步: 删除node_modules依赖，删除 package.lock 文件。
- 第三步: lib link到全局之后 执行 `npm  remove -g lib` 删除依赖包，然后删除 package.lock 文件。

## 使用 lerna
lerna 是一款基于git + npm非常优秀的多包管理工具，上面我们手动创建的包可以很方便的交给工具。

它有诸多优势，能够大幅减少重复操作，提升操作的标准化，lerna 是架构优化的产物，它揭示了一个架构的真理：项目复杂度提升之后，就需要对项目进行架构优化，架构优化的主要目的往往都是以效能为核心。

我们常见的优秀的开源项目 babel vue-cli 等都是基于 lerna 来管理的。


### 脚手架项目初始化
- 1 使用 npm init -y 初始化一个npm 项目。
- 2 在本地全局安装lerna,这样方便使用。
- 3 执行 `lerna init` 初始化lerna项目。
- 4 这里需要注意，使用lerna 创建的项目会自动初始化一个git。
- 5 创建 .gitignore 文件，用于忽略文件

### 创建package

```
lerna create <name> [loc] 
```
这是创建包的命令 指定包名 [loc] 方括号包裹起来的内容是可以不写的，用来手动指定路径。

- 1 执行lerna create core 创建一个叫做core的包，这里需要注意，新建组后在组里面创建子包，否则直接注册子包大概率已经被注册过了。如下图所示，第二行，我们创建的包是在 @zf-mock-cli 这个组下面
```json {2}
{
  "name": "@zf-mock-cli/core",
  "version": "1.0.0",
  "description": "> TODO: description",
  "author": "褚鹏飞 <540788769@qq.com>",
  "homepage": "https://github.com/MagicalBridge/architect-all-in-one#readme",
  "license": "ISC",
  "main": "lib/core.js",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "registry": "https://registry.npm.taobao.org/"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/MagicalBridge/architect-all-in-one.git"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1"
  },
  "bugs": {
    "url": "https://github.com/MagicalBridge/architect-all-in-one/issues"
  }
}
```
- 2 执行lerna create utils 创建一个工具包。工具包也放在 @zf-mock-cli 组下面。
```json {2}
{
  "name": "@zf-mock-cli/utils",
  "version": "1.0.0",
  "description": "> TODO: description",
  "author": "褚鹏飞 <540788769@qq.com>",
  "homepage": "https://github.com/MagicalBridge/architect-all-in-one#readme",
  "license": "ISC",
  "main": "lib/utils.js",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "registry": "https://registry.npm.taobao.org/"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/MagicalBridge/architect-all-in-one.git"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1"
  },
  "bugs": {
    "url": "https://github.com/MagicalBridge/architect-all-in-one/issues"
  }
}

```
- 3 使用lerna add 安装依赖 
```shell
lerna add <package> [@version] [--dev] [--exact] [--peer] 
```
::: warning
注意，如果我们直接执行 lerna add xxx 默认 lerna 会将package 安装到所有的包中
:::

```shell
➜  zf-mock-cli git:(main) ✗ lerna add mime
lerna notice cli v4.0.0
lerna info Adding mime in 2 packages
lerna info Bootstrapping 2 packages
lerna info Installing external dependencies
lerna info Symlinking packages and binaries
lerna success Bootstrapped 2 packages
```
从上面的安装信息可以看到，默认 lerna 将mime 模块安装到了 utils 和 core 两个包中。

如果我们想要安装到指定目录下应该如何操作呢？只需要跟上一个具体的路径就好.

```shell
lerna add <package> packages/utis
```

具体操作效果：
```shell
➜  zf-mock-cli git:(main) ✗ lerna add mime packages/utils 
lerna notice cli v4.0.0
lerna info Adding mime in 1 package
lerna info Bootstrapping 2 packages
lerna info Installing external dependencies
lerna info Symlinking packages and binaries
lerna success Bootstrapped 2 packages
```

- 4 learn link 链接依赖

如果我们创建的package中有互相的依赖,  `learn link` 可以帮助我们创建软连接。我们直接在项目中直接执行 `lerna link` 是没有多少效果的。我们必须在需要链接的模块下，手动添加依赖的名称和版本，然后执行 `lerna link` 这样才有效果。


### 脚手架的开发和测试
- 1 lerna exec 执行 shell 脚本 

在每个包下面执行脚本命令，需要在具体的命令前加上 `--` :

```shell
# 删除所有package 里面的 node_modules 依赖
lerna exec -- rf -rf node_modules

# 执行命令之后的效果
➜  zf-mock-cli git:(main) ✗ lerna exec -- rm -rf node_modules
lerna notice cli v4.0.0
lerna info Executing command in 2 packages: "rm -rf node_modules"
lerna success exec Executed command in 2 packages: "rm -rf node_modules"
```

::: warning
执行这个命令是在packages这个目录下面，而不是在根目录下面，这点需要特别注意。
:::

如果我们想要在指定目录下面执行脚本，需要添加 `--scope` 后缀

比如，我们只想要删除 utils 下面的 node_modules 可以执行下面的命令

```shell
# 只删除 utils 下面的 node_modules
lerna exec --scope @zf-mock-cli/util rm -rf node_modules

# 执行效果
➜  zf-mock-cli git:(main) ✗ lerna exec --scope @zf-mock-cli/utils -- rm -rf node_modules
lerna notice cli v4.0.0
lerna notice filter including "@zf-mock-cli/utils"
lerna info filter [ '@zf-mock-cli/utils' ]
lerna info Executing command in 1 package: "rm -rf node_modules"
lerna success exec Executed command in 1 package: "rm -rf node_modules"
```

- 2 lerna run 执行 npm 命令

这个命令主要是执行 npm 的script 脚本，默认行情况下，会执行所有的包下面的 package.json 下面的脚本信息。 同样这个命令也支持 --scope 选项。

- 3 lerna clean 清空依赖
```shell
lerna clean 
```
执行上述命令之后，会删除node_module 信息，但是package.json 里面的内容不会被删除。这点需要注意
- 4 lerna bootstrap 重新安装依赖

### 脚手架发布上线
- 1 lerna version bump version
- 2 lerna changed 查看上一个版本以来的所有变更
- 3 lerna diff 查看diff
- 4 lerna publish 项目发布



