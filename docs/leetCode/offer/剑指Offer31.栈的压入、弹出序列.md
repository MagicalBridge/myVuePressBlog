## 题目描述
输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有的数字均不相等，例如：
例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。

示例 1：
```
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1
```

示例 2：
```
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。
```

## 解题方案
思路：模拟

借用一个辅助栈 模拟 压入/弹出操作的排列 根绝是否能够模拟成功 即可得到结果。

算法流程
- 1 建立一个辅助栈
- 2 遍历入栈序列
  - 元素入栈
  - 若辅助栈栈顶元素等于弹出序列元素 则执行出栈操作
- 3 返回结果

```js
function validateStackSequences (pushed, poped) {
  // 创建一个辅助栈
  let stack = []
  let i = 0

  for (let element of pushed) { // 脑海中浮现for of 循环
    stack.push(element) 
    while (stack.length !== 0 && stack[stack.length-1] === poped[i]) {
      stack.pop();
      i++
    }
  }
  return stack.length === 0
}
```


