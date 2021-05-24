(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{364:function(t,a,s){"use strict";s.r(a);var v=s(45),n=Object(v.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"前端面试之道"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前端面试之道"}},[t._v("#")]),t._v(" 前端面试之道")]),t._v(" "),s("h2",{attrs:{id:"javascript基础知识面试题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#javascript基础知识面试题"}},[t._v("#")]),t._v(" JavaScript基础知识面试题")]),t._v(" "),s("h3",{attrs:{id:"原始类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#原始类型"}},[t._v("#")]),t._v(" 原始类型")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("JavaScript 中原始类型有六种，原始类型既只保存原始值，是没有函数可以调用的。")])]),t._v(" "),s("h4",{attrs:{id:"六种原始类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#六种原始类型"}},[t._v("#")]),t._v(" 六种原始类型")]),t._v(" "),s("ul",[s("li",[t._v("string")]),t._v(" "),s("li",[t._v("number")]),t._v(" "),s("li",[t._v("boolean")]),t._v(" "),s("li",[t._v("null")]),t._v(" "),s("li",[t._v("undefined")]),t._v(" "),s("li",[t._v("symbol")])]),t._v(" "),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),s("p",[t._v("为什么说原始类型没有函数可以调用，但"),s("code",[t._v("'1'.toString()")]),t._v("却又可以在浏览器中正确执行？")])]),t._v(" "),s("p",[t._v("因为"),s("code",[t._v("'1'.toString()")]),t._v("中的字符串"),s("code",[t._v("'1'")]),t._v("在这个时候会被封装成其对应的字符串对象，以上代码相当于"),s("code",[t._v("new String('1').toString()")]),t._v("，因为"),s("code",[t._v("new String('1')")]),t._v("创建的是一个对象，而这个对象里是存在"),s("code",[t._v("toString()")]),t._v("方法的。")]),t._v(" "),s("h4",{attrs:{id:"null到底是什么类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#null到底是什么类型"}},[t._v("#")]),t._v(" null到底是什么类型")]),t._v(" "),s("p",[t._v("现在很多书籍把"),s("code",[t._v("null")]),t._v("解释成空对象，是一个对象类型。然而在早期"),s("code",[t._v("JavaScript")]),t._v("的版本中使用的是32位系统，考虑性能问题，使用低位存储变量的类型信息，"),s("code",[t._v("000")]),t._v("开头代表对象，而"),s("code",[t._v("null")]),t._v("就代表全零，所以将它错误的判断成"),s("code",[t._v("Object")]),t._v("，虽然后期内部判断代码已经改变，但"),s("code",[t._v("null")]),t._v("类型为"),s("code",[t._v("object")]),t._v("的判断却保留了下来，至于"),s("code",[t._v("null")]),t._v("具体是什么类型，属于仁者见仁智者见智，你说它是一个"),s("code",[t._v("bug")]),t._v("也好，说它是空对象，是对象类型也能理解的通。")]),t._v(" "),s("h3",{attrs:{id:"对象类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#对象类型"}},[t._v("#")]),t._v(" 对象类型")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),s("p",[t._v("在 JavaScript 中，除了原始类型，其他的都是对象类型，对象类型存储的是地址，而原始类型存储的是值。")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" a "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" b "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" a"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\na"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("b"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 输出[1]")]),t._v("\n")])])]),s("p",[t._v("在以上代码中，创建了一个对象类型"),s("code",[t._v("a")]),t._v("(数组)，再把"),s("code",[t._v("a")]),t._v("的地址赋值给了变量"),s("code",[t._v("b")]),t._v("，最后改变"),s("code",[t._v("a")]),t._v("的值，打印"),s("code",[t._v("b")]),t._v("时，"),s("code",[t._v("b")]),t._v("的值也同步发生了改变，因为它们在内存中使用的是同一个地址，改变其中任何一变量的值，都会影响到其他变量。")])])}),[],!1,null,null,null);a.default=n.exports}}]);