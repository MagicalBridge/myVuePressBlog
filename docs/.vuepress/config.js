module.exports = {
  title: "褚鹏飞的博客",
  description: "终于等到你",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    // navbar: false, // 配置这个选项，将会在所有页面禁用导航栏
    lastUpdated: "最后更新时间",
    sidebar: "auto",
    head: [["link", { rel: "icon", href: "/icon.png" }]],
    nav: [
      {
        text: "算法",
        items: [
          // {
          //   text: "常用算法",
          //   link: "/algorithms/",
          // },
          {
            text: "LeetCode算法题解",
            link: "/leetCode/leetCode/",
          },
          {
            text: "牛客算法题解",
            link: "/leetCode/niuke/",
          },
          {
            text: "面试题算法题解",
            link: "/leetCode/valuableBook/",
          },
          {
            text: "剑指offer算法题解",
            link: "/leetCode/offer/",
          }
        ],
      },
      // {
      //   text: "数据结构",
      //   link: "/dataStructure/",
      // },
      // {
      //   text: "计算机网络",
      //   link: "/network/",
      // },
      {
        text: "Vue",
        items: [
          // {
          //   text: "Vue2原理剖析",
          //   link: "/vue/vue-analysis/",
          // },
          {
            text: "Vue2源码解析",
            link: "/vue/vue2-analysis/",
          },
          {
            text: "Vue3源码解析",
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
        items: [
          {
            text: "React中的性能优化",
            link: "/react/React中的性能优化",
          },
          {
            text: "React中的useRef",
            link: "/react/React中的useRef",
          },
          {
            text: "React中的forwardRef",
            link: "/react/React中的forwardRef",
          },
          {
            text: "React中的useMemo",
            link: "/react/React中的useMemo",
          },
        ],
      },
      {
        text: "前端工程化",
        items: [
          {
            text:"Babel",
            link:"/babel/"
          },
          {
            text: "webpack基础",
            link: "/webpack/webpack-base",
          },
          {
            text: "webpack进阶",
            link: "/webpack/webpack-advance",
          },
          // {
          //   text: "webpack打包分析",
          //   link: "/webpack/webpack打包分析",
          // },
          // {
          //   text:"webpack-抽象语法树",
          //   link:"/webpack/webpack-抽象语法树"
          // },
          {
            text:"Rollup",
            link:"/rollup/"
          }
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
        text: "服务端",
        items: [
          {
            text: "Linux",
            link: "/linux/",
          },
          // {
          //   text: "Git工具",
          //   link: "/git/",
          // },
          {
            text: "Nginx",
            link: "/nginx/nginx-base/",
          },
          {
            text: "Docker",
            link: "/docker/",
          },
          // {
          //   text: "kubernetes",
          //   link: "/k8s/",
          // },
          {
            text: "MySQL",
            link: "/database/mysql/",
          },
          {
            text: "MongoDB",
            link: "/database/mongodb/",
          },{
            text: "Redis",
            link: "/redis/"
          },
          // {
          //   text: "MQ",
          //   link: "/MQ/"
          // }
        ],
      },
      // {
      //   text: "通俗写作",
      //   link: "/writing/",
      // },
      {
        text: "前端基础",
        items:[
          {
            text: "JavaScript",
            link: "/threemusketeers/javascript/",
          },
          {
            text: "TypeScript",
            link: "/typescript/",
          },
          {
            text: "HTML",
            link: "/threemusketeers/html/",
          },
          {
            text: "CSS",
            link: "/threemusketeers/css/",
          }
        ],
      },
      // {
      //   text: "前端面试之道",
      //   link: "/interview/",
      // },
    ],
    sidebar: [],
  },
}
