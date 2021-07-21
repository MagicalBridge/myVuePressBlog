---
sidebar: auto
---

# 剑指offer09.用两个栈实现队列

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 `appendTail` 和 `deleteHead`，分别完成:
- 队列尾部插入整数
- 在队列头部删除整数的功能。
 
若队列中没有元素，deleteHead 操作返回 -1。

示例 1：
```
输入：
["CQueue","appendTail","deleteHead","deleteHead"]
[[],[3],[],[]]
输出：[null,null,3,-1]
```


示例 2：
```
输入：
["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]
[[],[],[5],[2],[],[]]
输出：[null,-1,null,null,5,2]
```

栈的特点是先进后出，而队列的特点是先进先出，我们用两个栈正好能把顺序反过来实现类似队列的操作。

具体的实现是一个栈作为压入栈，在压入数据时候只往这个栈中压入，记为 stackPush 另一个栈只作为弹出栈，在弹出数据的时候只从这个栈弹出，记为 stackPop

数据压入栈的时候，顺序是先进后出的，那么只要把stackPush的数据再压入stackPop中，顺序就变回来了。例如，将1~5依次压入 stackPush，那么从stackPush的栈顶到栈底为 5~1，此时依次将 5~1 倒入 stackPop, 那么从stackPop的栈顶到栈底就变成了 1~5 再从stackPop 弹出时，顺序就像队列一样。


听起来很简单，实际上必须做到以下两点。

- 1、如果stackpush 要往stackpop 中压入数据，那么必须一次性把stackpush中的数据全部压入。
- 2、如果stackpop不为空，stackpush 绝对不能向stackpop中压入数据。

违反以上两点都会发生错误。






```js
var CQueue = function() {
  this.pushStack = [];
  this.popStack = [];
};

/** 
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {

};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {

};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```