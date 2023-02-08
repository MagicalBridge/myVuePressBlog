---
sidebar: auto
---

# Typescript中定义数组对象多重嵌套

## 数组包裹对象

```ts
const list: list = [
  {
    img: "../../../../image/1.png",
    text: "限时抢购",
    url: "/pages/index/index",
  },
]
```

- 接口定义：

```ts
interface listItem {
  img: string,
  text: string,
  url: string
}

interface list {
  [index: number]: listItem
}
```

## 多重嵌套，数组包对象包数组包对象

写类型的时候，应该从最内层开始写，然后写道最外层

```ts
// 从内往外部写类型
interface dataObj {
  num: number
  price: number
}

// 上一层
interface dataItem {
  name: string
  info: dataObj
}

// 再上一层
interface data {
  [index: number]: dataItem
}

// 再上一层
interface listItem2 {
  url: string
  text: string
  data: data
}
// 最上层
interface list2 {
  [index: number]: listItem2
}

// 多重嵌套 数组包对象  包数组  包对象
const list2: list2 = [
  {
    url: "/pages/index/indedx",
    text: "text",
    data: [
      {
        name: "test",
        info: {
          num: 10,
          price: 20,
        },
      },
      {
        name: "test",
        info: {
          num: 10,
          price: 20,
        },
      },
    ],
  },
  {
    url: "/pages/index/indedx",
    text: "text",
    data: [
      {
        name: "test",
        info: {
          num: 10,
          price: 20,
        },
      },
    ],
  },
]
```

