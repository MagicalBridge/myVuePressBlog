---
sidebar: auto
---

# jwt的实现原理

## JWT的结构主要分为三个部分，中间使用.进行分割
- Header 头部 {typ: 'JWT', alg: 'HS256'}
- Payload 负载 需要的数据 {id,username}
- Signature 签名 xxxqq

```
组成的格式：

{typ: 'JWT', alg: 'HS256'} => base64.{id,username} => base64.xxxqq
```

## 如何手动自己实现一个jwt的函数

一般来说，jwt的主要经过两个过程：
- 生成签名
- 解密签名

基于此，我们可以封装两个方法：encode、decode

```js
let jwt = {
  toBase64(str) {
    // 如何转换成base64, 字符串不能直接转换为base64,得先转成buffer
    return Buffer.from(str).toString("base64");
  },
  // 从base64 还原成str
  fromBase64ToString(base64) {
    return Buffer.from(base64, "base64").toString("utf8");
  },
  // 加密的算法
  sign(str, secret) {
    return require("crypto")
      .createHmac("sha256", secret)
      .update(str)
      .digest("base64");
  },
  decode(token, secret) {
    // 将三个部分取出来
    let [header, content, sign] = token.split(".");
    let h = JSON.parse(this.fromBase64ToString(header));
    let c = JSON.parse(this.fromBase64ToString(content));
    // 如果token 解密出来的和加密的不一致 抛出异常
    if (sign !== this.sign([header, content].join("."), secret)) {
      throw new Error("not allow") // 报错
    }
    return c
  },

  // 接收两个参数 一个是参数荷载，一个是密钥
  encode(payload, secret) {
    // 按照规则，将第一部分的内容转化为base64
    let header = this.toBase64(JSON.stringify({ typ: "JWT", alg: "HS256" }));
    let content = this.toBase64(JSON.stringify(payload));
    // 签名使用 `header + . + content` 加上 HS256 算法实现的
    let sign = this.sign([header, content].join("."), secret);

    // 按照这样的写法生成签名
    return [header, content, sign].join(".");
  },
};

module.exports = jwt;
```



