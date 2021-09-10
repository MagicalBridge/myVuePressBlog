(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{505:function(a,t,e){"use strict";e.r(t);var s=e(44),r=Object(s.a)({},(function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"_1-webpack进阶"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-webpack进阶"}},[a._v("#")]),a._v(" 1.webpack进阶")]),a._v(" "),e("h2",{attrs:{id:"tapable"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#tapable"}},[a._v("#")]),a._v(" Tapable")]),a._v(" "),e("p",[a._v("webpack 本质上是一种事件流的机制，它的工作流程就是将各种插件串联起来，而实现这一切的核心就是Tapable，Tapable有点类似于 nodejs 中的events库。核心原理也是依赖于发布订阅模式。")]),a._v(" "),e("h2",{attrs:{id:"webpack中的懒加载"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#webpack中的懒加载"}},[a._v("#")]),a._v(" webpack中的懒加载")]),a._v(" "),e("p",[a._v("在webpack中，\b使用懒加载或者按需加载，是一种很好的优化网页或者应用的打开方式，这种方式实际上是先把你的代码在一些逻辑断点处离开, 然后在一些代码块中完成某些操作后，立即引用或者即将引用另外的一些代码块。这样就加快了应用的初始化的加载速度。减轻了它的总体体积，因为某些代码块可能永远也不可能会被加载。")]),a._v(" "),e("h3",{attrs:{id:"懒加载的场景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#懒加载的场景"}},[a._v("#")]),a._v(" 懒加载的场景")]),a._v(" "),e("p",[a._v("我们在真实的项目中可能会涉及文件的上传和下载操作，这个场景非常普遍，一般来说，下载场景就是从服务端请求一个下载链接，使用浏览器打开就好，但是上传场景就稍微有些复杂，可能会用到一些公共组件或者第三方的sdk。而这些sdk的体积可能非常大，并且，我们实际上在没有进行上传操作之前是不需要进行加载这部分代码的。所以这里我们使用懒加载是比较合理的。")])])}),[],!1,null,null,null);t.default=r.exports}}]);