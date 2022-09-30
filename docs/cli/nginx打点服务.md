---
sidebar: auto
---

# nginx打点服务

## 为何要拆分日志

access.log 日志默认不会拆分，会越积累越多，大文件不容易操作

离线分析日志，计算统计结果，一般是计算昨天的

试想这种场景下，从 access.log 一个大文件读取方便，还是拆分的零散文件方便。

## 如何拆分日志
根据流量情况，流量越大日志文件积累的越快，按照天、小时、分钟来拆分。
例如：将 access.log 按照天拆分到某个文件夹中。

```
logs_by_day/access.2022-0x-09log
logs_by_day/access.2022-0x-10.log
logs_by_day/access.2022-0x-11.log
```

拆分日志的技术实现
- nginx依然是持续的写入access.log
- 启动定时任务，到凌晨00:00, 即将当前的 access.log 复制一份，并按照指定的日期命名。
- 将当前的access.log内容清空，这样nginx持续写入access.log，即新一天的日志。

## 定时任务

### linux crontab
- 创建一个空的文件 a.txt
- 执行 crontab -e 编辑文件
- 加入一行 `* * * * * echo $(date) >> /User/cpff/a.txt`, 每分钟执行一次。
- 保存并退出
- 观察文件

### nodejs 工具

npm 插件 node-cron 或者使用 node-schedule
- 安装 cron 和 fs-extra
- 新建 demo/cron-demo.js 文件
- 运动该文件




