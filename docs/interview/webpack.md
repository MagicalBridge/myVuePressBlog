---
sidebar: auto
---

# webpack

## webpack的热更新原理
[参考文章](https://juejin.cn/post/6844904008432222215#heading-2)

所谓的热更新指的是无需刷新整个页面的同时，更新模块。

优势：节省时间、提升开发体验。

刷新的两种形式：
  - 一种是页面刷新，不保留页面状态，就是简单粗暴，直接window.location.reload()
  - 另一种是基于WDS (Webpack-dev-server)的模块热替换，只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态，比如复选框的选中状态、输入框的输入等。

webpack的重新编译构建流程：
- 1、项目启动后，进行构建打包，当前的这些构建编译会生成一个hash值。
- 2、每次修改代码代码保存后，就会触发新的编译，然后生成新的hash值，生成一个新的js文件，并且还有一个新的json文件。
- 3、并且所生成的json文件的名称和上一次编译出来的js文件hash值有名称上的联系，依次类推，本次输出的hash值会被作为下次热更新的标识。
- 4、每次修改代码之后，触发重新编译，紧接着浏览器就会发出两次请求，请求的文件就是新生成的js文件和新生成的JSON文件。这个json里面其实存储的是映射关系。
- 5、如果没有修改代码，但是做了保存操作，并不会生成新的js文件，但是json文件依然会生成。

基于webpack-dev-server的热更新实现原理：
- 1、热更新基于webpack-dev-server模块，初始化会启动webpack，生成compiler实例，并且使用express启动一个server服务，让浏览器可以请求本地的静态资源，本地的server启动后，再启动 websocket 服务，通过websocket，可以建立本地服务和浏览器的长连接的双向通信。
- 2、首次启动之后，客户端和服务端建立链接，浏览器获取到构建编译后的文件。此时webpack通过使用compiler.watch监听文件的变化，文件变化，触发编译。编译完成后，继续监听。
- 3、当webpack编译结束后，会生成已改动模块的json文件和已改动模块代码的js文件，会通过socket模块发送给浏览器最新的代码hash值。
- 4、客户端中的socket代码也是服务端通过配置入口文件的形式注入到bundle.js中的, 客户端中的socket代码实际上注册了两个事件，一个是hash，一个是ok, hash主要就是更新最后一次打包的值，ok事件里面做更新检查操作。
- 5、ok事件通过node中的event模块，发射了一个 webpackHotUpdate 事件，把工作重新交给了webapck。
- 6、webpack 监听了 webpackHotUpdate 事件，这里的更新操作又借用了 HotModuleReplacementPlugin 这个插件的能力。
- 7、此时客户端会向服务端发起ajax请求，把生成的新的JSON文件和js文件请求回来。然后替换和删除旧模块。然后执行代码。
- 8、当模块热重载失败后，会进行浏览器的刷新。
 

## webpack工作流：
- 1 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的配置对象
- 2 用上一步得到的参数初始化Compiler对象
- 3 加载所有配置的插件
- 4 执行对象的run方法开始执行编译
- 5 根据配置中的entry找出入口文件
- 6 从入口文件出发，调用所有配置的loader对模块进行编译
- 7 再找出该模块依赖的模块，再递归本步骤，直到所有入口依赖的文件都经过了本步骤的处理。
- 8 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk
- 9 再把每个chunk转换成一个单独的文件加入到输出列表
- 10 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

