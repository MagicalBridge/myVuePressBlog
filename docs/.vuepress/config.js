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
            text: "leetCode算题解",
            link: "/leetCode/leetCode/",
          },
          {
            text: "牛客算题解",
            link: "/leetCode/niuke/",
          },
          // {
          //   text: "面试题",
          //   link: "/leetCode/valuableBook/",
          // },
          {
            text: "剑指offer",
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
        items: [
          {
            text: "React中的性能优化",
            link: "/react/React中的性能优化/",
          },
          {
            text: "React中的useRef",
            link: "/react/React中的useRef/",
          },
          {
            text: "React中的forwardRef",
            link: "/react/React中的forwardRef/",
          }
        ],
      },
      {
        text: "前端工程化",
        items: [
          {
            text: "webpack基础",
            link: "/webpack/webpack-base",
          },
          {
            text: "webpack进阶",
            link: "/webpack/webpack-advance",
          },
          {
            text: "webpack打包分析",
            link: "/webpack/webpack打包分析",
          },
          {
            text:"webpack-抽象语法树",
            link:"/webpack/webpack-抽象语法树"
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
            text: "linux",
            link: "/linux/",
          },
          {
            text: "git工具",
            link: "/git/",
          },
          {
            text: "nginx",
            link: "/nginx/nginx-base/",
          },
          {
            text: "docker",
            link: "/docker/",
          },
          {
            text: "kubernetes",
            link: "/k8s/",
          },
          {
            text: "mySql",
            link: "/database/mysql/",
          },
          {
            text: "mongodb",
            link: "/database/mongodb/",
          },{
            text: "redis",
            link: "/redis/"
          },
          {
            text: "MQ",
            link: "/MQ/"
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
            text: "typescript",
            link: "/typescript/",
          },
          {
            text: "HTML",
            link: "/threemusketeers/html/",
          },
          {
            text: "css",
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
