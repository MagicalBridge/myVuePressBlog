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
- 整体思路：先将开头和结尾处多余的空格去掉，从后向前遍历，通过前后指针锁定单词，跳过中间的空格，最终将整个句子中的单词翻转。
- 时间复杂度：O(n) 空间复杂度: O(n)

算法流程:
- 1 首先将原始字符串去掉开头和结尾的空格得到 tmp，便于之后直接从单词处理开始。
- 2 初始化单词起始位置 start 和单词的结束位置 end 指针，位置在字符串结尾处。
- 3 初始化结果字符串 res 为空字符串
- 4 当start >= 0 时候，说明字符串未遍历结束，作为循环条件
- 5 tmp[start] 位置如果不是空格，说明还没有获取到完整的单词 则 start--
- 6 获取到完整的单词之后 截取[start+1, end+1] 这一段字符串加入结果字符串中，翻转单词。
- 7 在 tmp[start] 位置如果为空格，说明还没有到下一个单词的结尾位置，则 start-- 
- 8 到单词结尾位置之后，end = start，往复进行上述流程，将单词全部反转
- 9 将结果字符串 res 去掉开头和结尾多余的空格

```js
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  let tmp = s.trim();
  let start = tmp.length - 1;
  let end = tmp.length - 1;
  let res = "";
  while(start >= 0) {
    // 从后往前找到单词的边界，不符合循环条件的时候
    // 说明tmp[start]为” “ 此时已经找到了边界
    while(start >= 0 && tmp[start] != ' ') {
      start--;
    }
    // substring 方法不包含end的位置，处理完之后直接在单词后面添加空格
    // 也是简单粗暴
    res += tmp.substring(start + 1, end + 1) + " ";
    // 单词与单词之间可能会有多个空格，这个循环就是解决了这个问题
    while(start >= 0 && tmp[start] == ' ') {
      start--;
    }
    // 让end 和 start 重新在同一个索引上，开始下一个循环
    end = start;
  }
  // 别忘了这样处理的单词末尾会有一个空格 需要去除
  return res.trim();
};
```