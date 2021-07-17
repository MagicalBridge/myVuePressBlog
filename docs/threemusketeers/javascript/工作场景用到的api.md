---
sidebar: auto
---

# 实际场景用到的api

## [String.prototype.trim()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)

2021年7月16日，我在做智营销的需求的时候，在处理用户输入的 textarea 文本域的时候，为了分割数据，必须提前将用户输入的字符串的头部和尾部的空格去掉。就是使用到了这个api。

这是个优化需求，之前是一个input，使用vue自带的 v-model.trim 能去除空格。这次就记住了。