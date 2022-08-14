---
sidebar: auto
---

# Egg.js


## Egg.js 如何使用第三方插件？

Egg.js是基于nodejs, 所以可以使用nodejs的所有模块，需要在egg.js中做相应的配置。

## Egg.js使用操作mongoDB数据库
这里使用 egg-mongo-native 这个库去操作数据库。
[egg-mongo-native](https://github.com/brickyang/egg-mongo-native/blob/master/README.zh_CN.md)

第一步：安装：
```sh
npm i egg-mongo-native --save
```

第二步：插件文件里面启用插件

> 找到{app_root}/config/plugin.js

```js{11-13}
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 配置mongo插件
  mongo: {
    enable: true,
    package: 'egg-mongo-native',
  },
};
```

第三步：config.default.js 中配置数据库
```js{3-14}
module.exports = appInfo => {
  // ...
  config.mongo = {
    client: {
      host: '47.103.72.18',
      port: '27898',
      name: 'cdp-wpm-cli',
      user: '',
      password: '',
      options: {
        useUnifiedTopology: true,
      },
    },
  };
  // ...
};
```
上述配置完成就可以直接在代码中使用了。

```js
// project controller
'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async index() {
    const { ctx } = this;
    // 项目中直接使用 this.app.mongo 就能访问到实例
    const result = await this.app.mongo.find('project');
    ctx.body = result;
  }
}

module.exports = ProjectController;
```



