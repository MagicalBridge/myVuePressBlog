module.exports = {
  title: "褚鹏飞的博客",
  description: "终于等到你",

  themeConfig: {
    // navbar: false, // 配置这个选项，将会在所有页面禁用导航栏
    lastUpdated: '最后更新时间',
    sidebar: 'auto',
    head: [["link", { rel: "icon", href: "/icon.jpeg" }]],
    nav: [
      {
        text: "前端面试之道",
        link: '/interview/'
      },
      {
        text: "写作",
        link: '/writing/'
      },
    ],
    sidebar: [
    ],
  },
}
