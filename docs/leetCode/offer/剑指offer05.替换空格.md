请实现一个函数，把字符串 s 中的每个空格替换成"%20"。


示例 1：

```
输入：s = "We are happy."
输出："We%20are%20happy."
```

## 解决方案

思路：
- 标签：字符串
- 最简单的方案是使用库函数了，当然题目肯定不是希望我们这样做
- 增加一个新的字符串，遍历原来的字符串，遍历过程中，如果非空则将原来的字符直接拼接在新字符串中，如果遇到空格则将 %20 拼接到新的字符串中
- 时间复杂度O(n) 空间复杂度：o(n)

```js
/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
  let res = ''
  for(let i = 0;i < s.length; i++) {
    const ch = s[i]
    if ch === " ") {
      res += "%20"
    } else {
      res += ch[i]
    }
  }
  return res
}
``` 

复杂性分析:
- 时间复杂度：O(n)。遍历字符串 s 一遍。
- 空间复杂度：O(n)。额外创建字符数组。