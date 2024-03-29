---
sidebar: auto
---

# 剑指Offer39.数组中出现次数超过一半的数字

题目描述

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

你可以假设数组是非空的，并且给定的数组元素总是存在多数元素。

示例：

```
输入：[1, 2, 3, 2, 2, 2, 5, 4, 2]
输出：2
```

限制：
1 <= 数组长度 <= 50000

## 解题方案

哈希表:

我们知道出现次数最多的元素大于 `n/2` 次，所以可以使用hash表来快速统计每个元素出现的次数。

我们使用哈希映射（HashMap）来存储每个元素以及出现的次数。对于哈希映射中的每个键值对，键表示一个元素，值表示该元素出现的次数。

我们用一个循环遍历数组 nums 并将数组中的每个元素加入哈希映射中。在这之后，我们遍历哈希映射中的所有键值对，返回值最大的键。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  const map = new Map()

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    // 如果map中存在
    if (!map.has(num)) {
      map.set(num, 1)
    } else {
      map.set(num, map.get(num) + 1)
    }
  }

  // 遍历map使用 entries 这个方法 非常合适
  for(let [key,value] of map.entries()) {
    if (value > (nums.length / 2)) {
      return key
    }
  }
};
```


思路：
- 标签：摩尔投票
- 本题的常见的解法有三种
  - 数组排序：首先将nums排序，由于该数字超过数组长度的一半，所以数组的中间元素就是答案，时间复杂度和快速排序时间复杂度相同。
  - 哈希计数：遍历nums数组，将数字存在 hashMap 中，统计数字出现的次数，统计完成后再遍历一遍hashMap，找到超过一半计数的数字，时间复杂度为O(n)
  - 摩尔投票：遍历nums数组，使用count进行计数，记录当前出现的数字为cur,如果遍历到的num与cur相等，则count自增，否则自减，当其减为0的时候将cur修改为当前遍历的num,通过递减抵消的方式，最终达到了剩下的数字是结果的效果
- 摩尔投票是最优解法

## 算法流程
- 1 初始化: 预期结果 cur = 0 和 计数器 count = 0
- 2 遍历数组nums,遍历过程中取到的数字为num
- 3 当count为0的时候，表示不同的数字已经将当前的结果抵消掉了，可以换新的数字进行尝试，则 cur = num
- 4 当 num == cur 时，表示遍历数字和预期结果相同，则计数器 count++
- 5 当 num != cur 时，表示遍历数字和预期结果不同，则计数器 count--
- 6 最终留下的数字 cur 就是最终的结果，出现次数超过一半的数字一定不会被抵消掉，最终得到了留存

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  let cur = 0;
  let count = 0;
  for(const num of nums){
    if(count == 0) {
      cur = num;
    }
    if(num == cur) {
      count++;
    } else {
      count--;
    }
  }
  return cur;
};
```

