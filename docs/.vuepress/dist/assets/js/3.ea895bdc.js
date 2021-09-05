(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{369:function(s,e,a){s.exports=a.p+"assets/img/05.c4971390.jpg"},370:function(s,e,a){s.exports=a.p+"assets/img/01.fb31894c.png"},371:function(s,e,a){s.exports=a.p+"assets/img/02.74580573.png"},372:function(s,e,a){s.exports=a.p+"assets/img/03.954f29da.png"},373:function(s,e,a){s.exports=a.p+"assets/img/04.b0d8ec4c.png"},374:function(s,e,a){s.exports=a.p+"assets/img/06.dedf68c3.png"},430:function(s,e,a){"use strict";a.r(e);var r=a(44),t=Object(r.a)({},(function(){var s=this,e=s.$createElement,r=s._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[r("h1",{attrs:{id:"docker"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker"}},[s._v("#")]),s._v(" Docker")]),s._v(" "),r("h2",{attrs:{id:"什么是docker"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#什么是docker"}},[s._v("#")]),s._v(" 什么是Docker")]),s._v(" "),r("p",[s._v("Docker 是一个开源的应用容器引擎。开发者可以将自己的应用打包在自己的镜像里面，然后迁移到其他平台的 Docker 中。镜像中可以存放你自己自定义的运行环境，文件，代码，设置等等内容，再也不用担心环境造成的运行问题。镜像共享运行机器的系统内核。")]),s._v(" "),r("p",[s._v("同样， Docker 也支持跨平台。你的镜像也可以加载在 Windows 和 Linux，实现快速运行和部署。")]),s._v(" "),r("h2",{attrs:{id:"docker解决了什么问题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker解决了什么问题"}},[s._v("#")]),s._v(" Docker解决了什么问题")]),s._v(" "),r("p",[s._v("一句话，解决了运行环境和配置问题的"),r("strong",[s._v("软件容器")]),s._v("，方便于持续集成并有助于整体发布推动软件虚拟化技术。")]),s._v(" "),r("h2",{attrs:{id:"docker三要素"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker三要素"}},[s._v("#")]),s._v(" Docker三要素")]),s._v(" "),r("ul",[r("li",[r("strong",[s._v("镜像 (image)")]),s._v(":")])]),s._v(" "),r("p",[s._v("Docker镜像就是一个"),r("strong",[s._v("只读")]),s._v("的模板，镜像可以用来创建docker容器，一个镜像可以创建很多容器。")]),s._v(" "),r("ul",[r("li",[r("strong",[s._v("容器（Container）")])])]),s._v(" "),r("p",[s._v("Docker利用容器（Container）独立运行的一个或者一组应用，容器是用镜像创建爱你的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证平台的安全。可以把容器看成是一个简单的Linux环境（包括root用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。容器的定义几乎和镜像一模一样，也是一堆层的统一视角，唯一区别在于容器的最上面那一层是可读可写的。")]),s._v(" "),r("ul",[r("li",[r("strong",[s._v("仓库")])])]),s._v(" "),r("p",[s._v("是集中存放镜像的地方,我们可以把镜像发布到仓储中，需要的时候从仓储中拉取下来就可以了。")]),s._v(" "),r("h2",{attrs:{id:"docker架构"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker架构"}},[s._v("#")]),s._v(" Docker架构")]),s._v(" "),r("p",[r("img",{attrs:{src:a(369),alt:"docker架构"}})]),s._v(" "),r("h2",{attrs:{id:"docker安装-centos7"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker安装-centos7"}},[s._v("#")]),s._v(" Docker安装 (CentOS7)")]),s._v(" "),r("p",[s._v("在Docker安装之前，我们首先安装"),r("code",[s._v("device-mapper-persistent-data")]),s._v(" 和 "),r("code",[s._v("lvm2")]),s._v(" 两个依赖。")]),s._v(" "),r("p",[r("code",[s._v("device-mapper-persistent-data")]),s._v(" 是 "),r("code",[s._v("Lunix")]),s._v("下的一个存储驱动，Linux 上的高级存储技术。")]),s._v(" "),r("p",[r("code",[s._v("lvm2")]),s._v(" 的作用是创建逻辑磁盘分区，这里我们使用CentOS的Yum包管理工具安装两个依赖。")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[s._v("yum "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y yum-utils device-mapper-persistent-data lvm2\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[r("img",{attrs:{src:a(370),alt:"前置依赖"}})]),s._v(" "),r("p",[s._v("依赖安装完毕后，我们将阿里云的 Docker 镜像源添加进去。可以加速 Docker 的安装。")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[r("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[s._v("最后安装 docker")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[s._v("yum "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" docker-ce -y\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[r("img",{attrs:{src:a(371),alt:"docker安装完毕"}})]),s._v(" "),r("p",[s._v("接着执行一下 "),r("code",[s._v("docker -v")]),s._v(" ，这条命令可以用来查看 Docker 安装的版本信息。当然也可以帮助我们查看 docker 安装状态。如果正常展示版本信息，代表 Docker 已经安装成功。")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[s._v("docker -v\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[r("img",{attrs:{src:a(372),alt:"验证版本"}})]),s._v(" "),r("h2",{attrs:{id:"docker安装-hello-world镜像"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker安装-hello-world镜像"}},[s._v("#")]),s._v(" Docker安装 hello-world镜像")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[s._v("docker run hello-world\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[r("img",{attrs:{src:a(373),alt:"hello-world"}})]),s._v(" "),r("p",[s._v("从图中展示的信息可以看到，在执行run命令的时候，首先会从本地查找镜像，发现在本地没有找到，就去仓库中寻找，下载之后，基于这个镜像创建一个容器。")]),s._v(" "),r("h2",{attrs:{id:"docker的常用命令"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#docker的常用命令"}},[s._v("#")]),s._v(" Docker的常用命令")]),s._v(" "),r("p",[s._v("帮助命令")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 帮助命令")]),s._v("\ndocker --help\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br")])]),r("p",[s._v("列出本地主机上的所有镜像")]),s._v(" "),r("div",{staticClass:"language-shell line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-shell"}},[r("code",[r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 列出本地主机上的所有镜像")]),s._v("\ndocker images\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br")])]),r("p",[r("img",{attrs:{src:a(374),alt:"镜像"}})]),s._v(" "),r("p",[s._v("各个选项说明:")]),s._v(" "),r("ul",[r("li",[s._v("REPOSITORY: 表示镜像仓库")]),s._v(" "),r("li",[s._v("TAG: 镜像标签")]),s._v(" "),r("li",[s._v("IMAGE ID: 镜像id")]),s._v(" "),r("li",[s._v("CREATED: 镜像创建时间")]),s._v(" "),r("li",[s._v("SIZE: 镜像大小")])]),s._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),r("p",[s._v("同一个仓库可以有多个TAG，代表这个仓库源的不同个版本，我们使用"),r("code",[s._v("REPOSITORY:TAG")]),s._v(" 来定义不同的镜像。如果你不指定一个镜像的版本标签，将默认是使用最新的版本。")])]),s._v(" "),r("p",[s._v("当然 docker images 后面还可以添加 options 参数：")]),s._v(" "),r("div",{staticClass:"language- line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[s._v("docker images -a // 显示全部镜像，镜像是分层的\ndocker images -q // 只显示镜像的 images id\ndocker search xxx // 从dockerhub 中查找指定名称的镜像\ndocker search -s 30 xxx // 查找指定镜像在一定star数量之上的\ndocker pull xxx // 拉取指定名称的镜像 注意默认拉取的是最新的版本的镜像\ndocker rmi  xxx // 删除指定镜像 如果不添加任何标签默认删除最新版本的镜像\ndocker rmi -f xxx // 强制删除指定镜像\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br"),r("span",{staticClass:"line-number"},[s._v("3")]),r("br"),r("span",{staticClass:"line-number"},[s._v("4")]),r("br"),r("span",{staticClass:"line-number"},[s._v("5")]),r("br"),r("span",{staticClass:"line-number"},[s._v("6")]),r("br"),r("span",{staticClass:"line-number"},[s._v("7")]),r("br")])])])}),[],!1,null,null,null);e.default=t.exports}}]);