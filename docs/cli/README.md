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
    "process":"bin/index.js"
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