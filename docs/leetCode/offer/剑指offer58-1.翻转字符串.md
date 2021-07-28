---
sidebar: auto
---

# 剑指offer58-1.翻转单词顺序

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student.",则输出"student. a am I"。

示例 1：
```
输入: "the sky is blue"
输出: "blue is sky the"
```

示例 2：
```
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```
示例3：
```
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```
方法一：

这道题目在示例中给了比较特殊的两个示例，一种是首尾有空格的情况，这种情况，翻转过去要把空格去掉，第二种是如果单词中间有多个空格，翻转之后只保留一个空格。

根据上面两种情况，我们可以在处理字符串的时候，使用 trim 函数去除首尾空格，再利用正则表达式将字符串中间的部分多个空格替换成一个，这样处理之后，借助数组的api很好解决。
```js
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  // 首先将字符串去除头尾空格，替换多个空格为一个
  let trimStr = s.trim().replace(/\s+/g, " ");
  // 分割数组
  let arr = trimStr.split(" ");
  // 翻转之后 组成新的字符串 返回
  return arr.reverse().join(" ")
};
```

方法二：双指针

算法解析：
- 倒序遍历字符串 s，记录单词的左右索引边界i, j 