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