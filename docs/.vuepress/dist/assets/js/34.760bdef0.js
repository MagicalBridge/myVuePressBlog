(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{414:function(t,r,e){"use strict";e.r(r);var a=e(44),s=Object(a.a)({},(function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"说一下vue-router的原理是什么"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#说一下vue-router的原理是什么"}},[t._v("#")]),t._v(" 说一下vue-router的原理是什么?")]),t._v(" "),e("p",[t._v("vue-router 是vue的一个插件。")]),t._v(" "),e("p",[t._v("核心就是更新视图但是不重新请求页面。")]),t._v(" "),e("p",[t._v("vue-router实现单页面跳转，提供了三种方式： hash模式，history模式、abstract模式，根据传递的mode配置来决定采用哪一种方式。")]),t._v(" "),e("ul",[e("li",[t._v("hash: 使用url hash 值来作为路由。默认模式。")]),t._v(" "),e("li",[t._v("history： 依赖HTML5 history API 和服务端配置。")]),t._v(" "),e("li",[t._v("abstract: 支持所有JavaScript运行环境，如nodejs服务端")])]),t._v(" "),e("p",[t._v("Hash模式：\nhash指的是浏览器url中 # 后面的内容 ，包含#。hash 是url中的锚点，代表的是网页中的一个位置，单单改变 #后面的部分，浏览器只会加载响应位置的内容，不会重新加载页面。")]),t._v(" "),e("ul",[e("li",[t._v("即 # 是用来指导浏览器动作的，对于服务端完全无用 http请求中不包含#")]),t._v(" "),e("li",[t._v("每一次改变#后面的部分，都会在浏览器的历史记录中增加一个记录，使用后退按钮可以回到上一个位置")])]),t._v(" "),e("p",[t._v("HashHistory中的api：\n我们可以为hash的改变添加监听事件。")]),t._v(" "),e("p",[t._v("其中提供了两个方法： pushState  replacestate 这两个方法的共同的特点是：当调用他们改变浏览器的历史栈的时候，虽然当前url改变了，但是浏览器不会立即发出请求该url。")]),t._v(" "),e("p",[t._v("History模式：\n底层使用的是Html5中的history api 帮助实现 url跳转无需重新加载页面。\n这种模式需要在服务端则增加一个覆盖所有情况的候选资源：如果url匹配不到任何静态资源，则应该返回一个配置好的默认页面。")]),t._v(" "),e("p",[t._v("Abstract模式:\n根据平台差异可以看出，在 Weex 环境中只支持使用 abstract 模式。 不过，vue-router 自身会对环境做校验，如果发现没有浏览器的 API，vue-router 会自动强制进入 abstract 模式，所以 在使用 vue-router 时只要不写 mode 配置即可，默认会在浏览器环境中使用 hash 模式，在移动端原生环境中使用 abstract 模式。")]),t._v(" "),e("p",[t._v("https://juejin.cn/post/6844903695365177352#heading-13")]),t._v(" "),e("p",[t._v("https://zhuanlan.zhihu.com/p/37730038")])])}),[],!1,null,null,null);r.default=s.exports}}]);