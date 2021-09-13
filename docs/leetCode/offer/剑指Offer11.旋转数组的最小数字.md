把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。例如，数组 [3,4,5,1,2] 为 [1,2,3,4,5]的一个旋转，该数组的最小值为1。

第一感觉：模式识别，就是二分查找，然后紧接着没有什么思路，这题确定性的一点是肯定存在最小值的。所以返回值已经确定了，这点确实没有什么疑问，最终的返回的下标肯定是 left 下标。

对于 第一组用例来说: left = 0 right = 4 mid为2，就是5 所在的位置。
进入循环条件之后 number[2] > number[4] 此时最小值肯定在 [mid.right],且当前的mid需要更新区间，因为本身这轮循环的mid已经比right位置的值要大。

我们将这个用例修改一下, 变成  [4,5,1,2,3] left = 0 right = 4 mid为2 也就是 1 所在的位置，此时 number[2] < number[4] 最小值在 [left,mid]的位置。right = mid 此时 范围缩小在了 left = 0 right = 2 mid = 1 继续循环 此时 number[mid] > number[right] left = mid + 1 跳出while循环。返回left值。


示例 1：
```
输入：[3,4,5,1,2]
输出：1
```

示例 2：
```
输入：[2,2,2,0,1]
输出：0
```

## 解题方案
思路:
- 标签: 二分查找
- 整体思路：首先数组是一个有序数组的旋转，从这个条件可以看出，数组是大小有规律的，一般对于有序数组而言，二分查找是比较容易想出来的模式识别。
- 算法流程
  - 1 初始化下标 left 和 right
  - 2 每次计算中间下标 mid = (right + left) / 2,这里的除法是整数运算，不能出现小数
  - 3 当 number[mid] < number[right] 时候，说明最小值在[left,mid]区间中，则令right = mid，用于下一轮的计算
  - 4 当 number[mid] > number[right] 时候，说明最小值在 [mid,right]区间中，则令 left = mid + 1, 用于下一轮的计算
  - 5 当 number[mid] == number[right] 时候, 无法判断最小值在哪个区间之中，此时让 right--，缩小区间范围，在下一轮进行判断.

为什么是 right-- 缩小范围，而不是left++？
- **因为数组是升序的，所以最小值一定是靠近左侧，而不是右侧**
- 比如 当存在 [1,2,2,2,2] 这种情况的时候，left = 0 rihgt = 4, mid = 2 数值满足，numbers[mid] == numbers[right] 这个条件，如果 left++，则找不到最小值。

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
var minArray = function(numbers) {
  // 设置左区间、右区间 都是闭区间
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    let mid = parseInt((right + left) / 2);
    if (numbers[mid] < numbers[right]) {
      right = mid;
    } else if (numbers[mid] > numbers[right]) {
      left = mid + 1;
    } else {
      right --;
    }
  }
  // 数组是升序的 最小值一定在左边
  return numbers[left];
};
```
