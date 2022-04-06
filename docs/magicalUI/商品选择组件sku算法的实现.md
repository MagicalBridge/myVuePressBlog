---
sidebar: auto
---

# 消费分期商品选择组件sku算法的实现

## 需求
在消费分期项目中，用户在选择商品页面，需要根据颜色、型号、存储等属性来选择商品。涉及到了sku商品选择的问题。

这里简化下需求，有这样的三个数组：

```js
let names = ["iPhone X", "iPhone XS"]
let colors = ["黑色", "白色"]
let storages = ["64g", "256g"]
```

需要把他们所有的排列组合穷举出来，最终得到这样的一个数组：

```js
[
  ["iPhone X", "黑色", "64g"],
  ["iPhone X", "黑色", "256g"],
  ["iPhone X", "白色", "64g"],
  ["iPhone X", "白色", "256g"],
  ["iPhone XS", "黑色", "64g"],
  ["iPhone XS", "黑色", "256g"],
  ["iPhone XS", "白色", "64g"],
  ["iPhone XS", "白色", "256g"],
]
```

由于这些属性数组是不定项的，所以不能简单的用三重暴力循环来求解了。

## 思路

如果我们选用递归和回溯法来解决这个问题，那么最重要的问题就是设计我们的递归函数。

## 思路分解
用上面举的例子来说明，比如我们目前的属性数组就是：`names、colors、storages`，首先我们会处理names 数组，很显然，对于每个属性数组，都需要去**遍历他**, 然后一个一个选择后再去和下一个数组的每一项进行组合。

我们设计的递归函数接收两个参数:
- index 对应当前正在处理的下标，是names 还是 colors 或者是 names、colors、storages。
- prev 上一次递归已经拼接成的结果，比如 `['iPhone X', '黑色']`


## 递归函数
- 处理属性数组的下标0：假设我们在第一次循环中选择了 `iPhone XS` 此时我们有一个未完成的结果状态，假设我们叫做 `prev`, 此时 prev = ['iPhone XS'].

- 处理属性数组的下标1：那么就处理到 `colors` 数组了，并且我们拥有 prev，在遍历color的时候继续递归的去把 prev 拼接成 `prev.concat(color)`, 也就是 ['iPhone XS','黑色'] 这样继续把这个 prev 交给下一次递归。

- 处理属性数组的下边2：那么就处理到 storages 数组的了，并且我们拥有了 name + color 的 prev，在遍历 storages 的时候继续递归的去把 prev 拼接成 prev.concat(storage)，也就是 ['iPhone XS', '黑色', '64g']，并且此时我们发现处理的属性数组下标已经到达了末尾，那么就放入全局的结果变量 res 中，作为一个结果。

## 编码实现
```js
let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", "256g"]

let combine = function (...chunks) {
  let res = []

  let helper = function (chunkIndex, prev) {
    let chunk = chunks[chunkIndex]
    let isLast = chunkIndex === chunks.length - 1
    for (let val of chunk) {
      let cur = prev.concat(val)
      if (isLast) {
        // 如果已经处理到数组的最后一项了 则把拼接的结果放入返回值中
        res.push(cur)
      } else {
        helper(chunkIndex + 1, cur)
      }
    }
  }

  // 从属性数组下标为 0 开始处理
  // 并且此时的 prev 是个空数组
  helper(0, [])

  return res
}

console.log(combine(names, colors, storages))

```