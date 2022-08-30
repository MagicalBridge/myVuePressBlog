---
sidebar: auto
---

# vue-edit

## 安装antd-vue，并配置全局注册 

```js
// main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

## 页面整体骨架的搭建
