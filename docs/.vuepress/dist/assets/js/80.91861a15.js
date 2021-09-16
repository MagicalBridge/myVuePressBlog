(window.webpackJsonp=window.webpackJsonp||[]).push([[80],{487:function(s,t,n){"use strict";n.r(t);var a=n(44),r=Object(a.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("p",[s._v("题目描述")]),s._v(" "),n("p",[s._v("数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。")]),s._v(" "),n("p",[s._v("你可以假设数组是非空的，并且给定的数组元素总是存在多数元素。")]),s._v(" "),n("p",[s._v("示例：")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("输入：[1, 2, 3, 2, 2, 2, 5, 4, 2]\n输出：2\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[s._v("限制：\n1 <= 数组长度 <= 50000")]),s._v(" "),n("h2",{attrs:{id:"解题方案"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#解题方案"}},[s._v("#")]),s._v(" 解题方案")]),s._v(" "),n("p",[s._v("思路：")]),s._v(" "),n("ul",[n("li",[s._v("标签：摩尔投票")]),s._v(" "),n("li",[s._v("本题的常见的解法有三种\n"),n("ul",[n("li",[s._v("数组排序：首先将nums排序，由于该数字超过数组长度的一半，所以数组的中间元素就是答案，时间复杂度和快速排序时间复杂度相同。")]),s._v(" "),n("li",[s._v("哈希计数：遍历nums数组，将数字存在 hashMap 中，统计数字出现的次数，统计完成后再遍历一遍hashMap，找到超过一半计数的数字，时间复杂度为O(n)")]),s._v(" "),n("li",[s._v("摩尔投票：遍历nums数组，使用count进行计数，记录当前出现的数字为cur,如果遍历到的num与cur相等，则count自增，否则自减，当其减为0的时候将cur修改为当前遍历的num,通过递减抵消的方式，最终达到了剩下的数字是结果的效果")])])]),s._v(" "),n("li",[s._v("摩尔投票是最优解法")])]),s._v(" "),n("h2",{attrs:{id:"算法流程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#算法流程"}},[s._v("#")]),s._v(" 算法流程")]),s._v(" "),n("ul",[n("li",[s._v("1 初始化: 预期结果 cur = 0 和 计数器 count = 0")]),s._v(" "),n("li",[s._v("2 遍历数组nums,遍历过程中取到的数字为num")]),s._v(" "),n("li",[s._v("3 当count为0的时候，表示不同的数字已经将当前的结果抵消掉了，可以换新的数字进行尝试，则 cur = num")]),s._v(" "),n("li",[s._v("4 当 num == cur 时，表示遍历数字和预期结果相同，则计数器 count++")]),s._v(" "),n("li",[s._v("5 当 num != cur 时，表示遍历数字和预期结果不同，则计数器 count--")]),s._v(" "),n("li",[s._v("6 最终留下的数字 cur 就是最终的结果，出现次数超过一半的数字一定不会被抵消掉，最终得到了留存")])]),s._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/**\n * @param {number[]} nums\n * @return {number}\n */")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function-variable function"}},[s._v("majorityElement")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("nums")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" cur "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" count "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" num "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("of")]),s._v(" nums"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("count "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      cur "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" num"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("num "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" cur"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      count"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("else")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      count"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" cur"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br")])])])}),[],!1,null,null,null);t.default=r.exports}}]);