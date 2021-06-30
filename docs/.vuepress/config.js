module.exports = {
  title: "褚鹏飞的博客",
  description: "终于等到你",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    // navbar: false, // 配置这个选项，将会在所有页面禁用导航栏
    // lastUpdated: "最后更新时间",
    sidebar: "auto",
    head: [["link", { rel: "icon", href: "/icon.png" }]],
    nav: [
      {
        text: "算法",
        link: "/algorithms/",
      },
      {
        text: "数据结构",
        link: "/dataStructure/",
      },
      {
        text: "计算机网络",
        link: "/network/",
      },
      {
        text: "Vue",
        items: [
          {
            text: "Vue2内部原理剖析",
            link: "/vue/vue-analysis/",
          },
          {
            text: "Vue3内部原理剖析",
            link: "/vue/vue3-analysis/",
          },
          {
            text: "Vue组件探索",
            link: "/vue/vue-component/",
          },
          {
            text: "Vuex源码解析",
            link: "/vue/vuex/",
          },
          {
            text: "Vue-Router源码解析",
            link: "/vue/vue-router/",
          },
        ],
      },
      {
        text: "React",
        link: "/react/",
      },
      {
        text: "webpack",
        items: [
          {
            text: "webpack基础",
            link: "/webpack/webpack-base",
          },
        ],
      },
      {
        text: "Node.js",
        items: [
          {
            text: "Node基础",
            link: "/node/node-base/",
          },
          {
            text: "Express",
            link: "/node/express/",
          },
          {
            text: "Koa",
            link: "/node/koa/",
          },
        ],
      },
      {
        text: "数据库",
        items: [
          {
            text: "mySql",
            link: "/database/mysql/",
          },
          {
            text: "mongodb",
            link: "/database/mongodb/",
          }
        ],
      },
      {
        text: "nginx",
        items: [
          {
            text: "nginx",
            link: "/nginx/nginx-base/",
          }
        ],
      },
      {
        text: "算法题解",
        items: [
          {
            text: "leetCode算题解",
            link: "/leetCode/leetCode/",
          },
          {
            text: "面试题",
            link: "/leetCode/valuableBook/",
          },
          {
            text: "剑指offer",
            link: "/leetCode/offer/",
          }
        ],
      },
      // {
      //   text: "通俗写作",
      //   link: "/writing/",
      // },
      {
        text: "前端三剑客",
        items:[
          {
            text: "javascript",
            link: "/threemusketeers/javascript/",
          },
          {
            text: "HTML",
            link: "/threemusketeers/html/",
          }
        ],
      },
      {
        text: "前端面试之道",
        link: "/interview/",
      },
    ],
    sidebar: [],
  },
}
