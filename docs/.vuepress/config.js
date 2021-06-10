module.exports = {
  title: "褚鹏飞的博客",
  description: "终于等到你",

  themeConfig: {
    // navbar: false, // 配置这个选项，将会在所有页面禁用导航栏
    // lastUpdated: "最后更新时间",
    sidebar: "auto",
    head: [["link", { rel: "icon", href: "/icon.png" }]],
    nav: [
      {
        text: "前端面试之道",
        link: "/interview/",
      },
      {
        text: "Vue",
        items: [
          {
            text: "Vue内部原理剖析",
            link: "/vue/vue-analysis/",
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
        text: "nginx",
        items: [
          {
            text: "nginx",
            link: "/nginx/nginx-base/",
          }
        ],
      },
      {
        text: "LeetCode算法题解",
        link: "/leetCode/",
      },
      {
        text: "通俗写作",
        link: "/writing/",
      },
    ],
    sidebar: [],
  },
}
