(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{378:function(t,a,s){t.exports=s.p+"assets/img/1.75aed4bf.jpeg"},379:function(t,a,s){t.exports=s.p+"assets/img/02.ba74f5c8.png"},422:function(t,a,s){"use strict";s.r(a);var e=s(44),r=Object(e.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"nginx"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#nginx"}},[t._v("#")]),t._v(" nginx")]),t._v(" "),e("h2",{attrs:{id:"_1-nginx使用场景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-nginx使用场景"}},[t._v("#")]),t._v(" 1.nginx使用场景")]),t._v(" "),e("ul",[e("li",[t._v("静态资源服务器")]),t._v(" "),e("li",[t._v("反向代理服务器")]),t._v(" "),e("li",[t._v("API接口服务")])]),t._v(" "),e("p",[e("img",{attrs:{src:s(378),alt:"nginx使用场景"}})]),t._v(" "),e("h2",{attrs:{id:"_2-nginx优势"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-nginx优势"}},[t._v("#")]),t._v(" 2.nginx优势")]),t._v(" "),e("ul",[e("li",[t._v("高并发高性能")]),t._v(" "),e("li",[t._v("可扩展性好")]),t._v(" "),e("li",[t._v("高可靠性")]),t._v(" "),e("li",[t._v("热部署")]),t._v(" "),e("li",[t._v("开源许可证")])]),t._v(" "),e("h2",{attrs:{id:"_3-环境"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-环境"}},[t._v("#")]),t._v(" 3.环境")]),t._v(" "),e("p",[t._v("为了保证可被外界访问，可以先关闭阿里云的防火墙")]),t._v(" "),e("h3",{attrs:{id:"_3-1-关闭防火墙"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-关闭防火墙"}},[t._v("#")]),t._v(" 3.1 关闭防火墙")]),t._v(" "),e("table",[e("thead",[e("tr",[e("th",[t._v("功能")]),t._v(" "),e("th",[t._v("命令")])])]),t._v(" "),e("tbody",[e("tr",[e("td",[t._v("停止防火墙")]),t._v(" "),e("td",[t._v("systemctl stop firewalld.service")])]),t._v(" "),e("tr",[e("td",[t._v("永久关闭防火墙")]),t._v(" "),e("td",[t._v("systemctl disable firewalld.service")])])])]),t._v(" "),e("h3",{attrs:{id:"_3-2-安装依赖的模块"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-安装依赖的模块"}},[t._v("#")]),t._v(" 3.2 安装依赖的模块")]),t._v(" "),e("div",{staticClass:"language-bash line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("yum  -y "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" gcc gcc-c++ autoconf pcre pcre-devel "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("make")]),t._v(" automake openssl openssl-devel\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br")])]),e("table",[e("thead",[e("tr",[e("th",[t._v("软件包")]),t._v(" "),e("th",[t._v("描述")])])]),t._v(" "),e("tbody",[e("tr",[e("td",[t._v("gcc")]),t._v(" "),e("td",[t._v("gcc是指整个gcc的这一套工具集合，它分为gcc前端和gcc后端（我个人理解为gcc外壳和gcc引擎），gcc前端对应各种特定语言（如c++/go等）的处理（对c++/go等特定语言进行对应的语法检查, 将c++/go等语言的代码转化为c代码等），gcc后端对应把前端的c代码转为跟你的电脑硬件相关的汇编或机器码")])]),t._v(" "),e("tr",[e("td",[t._v("gcc-c++")]),t._v(" "),e("td",[t._v("而就软件程序包而言，gcc.rpm就是那个gcc后端，而gcc-c++.rpm就是针对c++这个特定语言的gcc前端")])]),t._v(" "),e("tr",[e("td",[t._v("autoconf")]),t._v(" "),e("td",[t._v("autoconf是一个软件包，以适应多种Unix类系统的shell脚本的工具")])]),t._v(" "),e("tr",[e("td",[t._v("pcre")]),t._v(" "),e("td",[t._v("PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库")])]),t._v(" "),e("tr",[e("td",[t._v("vim")]),t._v(" "),e("td",[t._v("Vim是一个类似于Vi的著名的功能强大、高度可定制的文本编辑器")])]),t._v(" "),e("tr",[e("td",[t._v("wget")]),t._v(" "),e("td",[t._v("wget 是一个从网络上自动下载文件的自由工具，支持通过 HTTP、HTTPS、FTP 三个最常见的 TCP/IP协议 下载，并可以使用 HTTP 代理")])])])]),t._v(" "),e("h2",{attrs:{id:"_4-nginx的架构"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-nginx的架构"}},[t._v("#")]),t._v(" 4.nginx的架构")]),t._v(" "),e("h3",{attrs:{id:"_4-1-轻量"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-轻量"}},[t._v("#")]),t._v(" 4.1 轻量")]),t._v(" "),e("ul",[e("li",[t._v("源代码只包含核心模块")]),t._v(" "),e("li",[t._v("其他非核心功能都是通过模块实现的，可以自由选择")])]),t._v(" "),e("h3",{attrs:{id:"_4-2-架构"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-架构"}},[t._v("#")]),t._v(" 4.2 架构")]),t._v(" "),e("ul",[e("li",[t._v("nginx 采用的是多进程(单线程)和多路IO复用模型")])]),t._v(" "),e("h4",{attrs:{id:"_4-2-1-工作流程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-1-工作流程"}},[t._v("#")]),t._v(" 4.2.1 工作流程")]),t._v(" "),e("ul",[e("li",[t._v("1、nginx启动后，会有一个"),e("code",[t._v("master")]),t._v("进程和多个相互独立的"),e("code",[t._v("worker")]),t._v("进程。")]),t._v(" "),e("li",[t._v("2、接收来自外界的信号，向各 "),e("code",[t._v("worker")]),t._v("进程发送信号，每个进程都有可能来处理这个连接。")]),t._v(" "),e("li",[t._v("3、master进程能监控worker进程的运行状态，当worker进程退出后 （异常情况下），会自动启动新的worker进程。")])]),t._v(" "),e("p",[e("img",{attrs:{src:s(379),alt:"nginx使用场景"}})]),t._v(" "),e("ul",[e("li",[t._v("worker 进程数，一般会设置成机器的cpu核数，因为更多的worker数，只会导致进程相互竞争cpu，从而带来不必要的上下文切换")]),t._v(" "),e("li",[t._v("使用多进程模型，不仅能够提高并发率，而且多个进程之间相互独立，一个worker进程挂了不会影响到其他的worker进程")])]),t._v(" "),e("h3",{attrs:{id:"_5-nginx的安装"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-nginx的安装"}},[t._v("#")]),t._v(" 5.nginx的安装")]),t._v(" "),e("h3",{attrs:{id:"_5-1-版本的分类"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-1-版本的分类"}},[t._v("#")]),t._v(" 5.1 版本的分类")]),t._v(" "),e("ul",[e("li",[t._v("Mainline version 开发版本")]),t._v(" "),e("li",[t._v("Stable version 稳定版本")]),t._v(" "),e("li",[t._v("Legacy versions  历史版本")])]),t._v(" "),e("h3",{attrs:{id:"_5-2-centos下使用-yum-安装"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-2-centos下使用-yum-安装"}},[t._v("#")]),t._v(" 5.2 CentOS下使用 YUM 安装")]),t._v(" "),e("p",[e("code",[t._v("vi /etc/yum.repos.d/nginx.repo")])]),t._v(" "),e("p",[t._v("写入下面配置")]),t._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("[nginx]\nname=nginx repo\nbaseurl=http://nginx.org/packages/centos/7/$basearch/\ngpgcheck=0\nenabled=1\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br"),e("span",{staticClass:"line-number"},[t._v("3")]),e("br"),e("span",{staticClass:"line-number"},[t._v("4")]),e("br"),e("span",{staticClass:"line-number"},[t._v("5")]),e("br")])]),e("p",[t._v("执行安装命令")]),t._v(" "),e("div",{staticClass:"language-bash line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("yum "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" nginx -y //安装nginx\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br")])]),e("p",[t._v("查看安装情况")]),t._v(" "),e("div",{staticClass:"language-bash line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[t._v("nginx -v //查看安装的版本\nnginx -V //查看编译时的参数\n")])]),t._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[t._v("1")]),e("br"),e("span",{staticClass:"line-number"},[t._v("2")]),e("br")])])])}),[],!1,null,null,null);a.default=r.exports}}]);