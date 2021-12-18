输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有的偶数位于数组的后半部分。

示例：
```
输入：nums = [1,2,3,4]
输出：[1,3,2,4] 
注：[3,1,2,4] 也是正确的答案之一。
```

## 解题方案
思路：
- 标签：双指针
- 整体思路: 首先指定前指针 start 和 后指针 end，然后前指针定位偶数，后指针定位奇数，定位到之后将两个值互换，直到数组遍历完成。

算法流程：
- 1 初始化指针 start = 0, 后指针 end = nums.length - 1
- 2 当`start < end`时候表示该数组还未遍历完成，则继续进行奇数和偶数的交换
- 3 当nums[start] 为奇数时候，则 start++, 直到找到不为奇数的下标为止。
- 4 当nums[end] 为偶数时候，则 end-- 直到找到不为偶数的下标为止
- 5 交换nums[start] 和 nums[end],继续下一轮交换
- 6 返回 nums, 即为交换后的结果

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function(nums) {
  let start = 0;
  let end = nums.length - 1;
  while(start < end) {
    while(start < end && (nums[start] % 2) === 1) {
      start ++
    }
    while(start < end && (nums[end] % 2 === 0)) {
      end --
    }
    let temp = nums[start]
    nums[start] = nums[end]
    nums[end] = temp
  }
  return nums
}
```

这道题目在牛客网上的问法有些许的差异，要求的交换位置之后，数组中元素的相对位置不应该发生变化，针对这种问法，最直观的解法还是使用两个数组分别存储奇数和偶数，遍历完成之后，将两个数组合并起来。
```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function(nums) {
  if (nums.length === 0) {
    return nums
  }
  // 创建两个数组：奇数数组和偶数数组
  let odd = [];
  let even = [];
  // 遍历数组，奇数元素和偶数元素，分别存放
  for (let i = 0; i < nums.length; i++ ) {
    if (nums[i] % 2 === 1) { // 奇数
      odd.push(nums[i])
    } else {
      even.push(nums[i])
    }
  }
  return odd.concat(even)
}
```

## 1218复习：
- 今天在重新复习这道题目的时候，突然明白了开头的两个while循环的作用：就是让left走到为偶数的位置，right走到为奇数的位置，因为题目要求的是奇数在前面，偶数在后面，走到不符合的位置后，调整位置。
- 对着牛客题目的问法，将这道题目重新梳理了一下。