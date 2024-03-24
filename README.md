## 介绍
这是前端项目仓库 v3 版本，目前仓库只对接了 tp 项目，这个仓库不再模块化。

如果使用的是 v2 版本，请使用 V2 分支

感谢支持

## 专业版
[专业版本官方地址](https://catchadmin.com/pro)

首先感谢一直以来对 `CatchAdmin` 开源项目的支持和使用。作为一名开源工作者，我一直致力于开发出功能强大且易于使用的后台管理系统，以帮助您简化业务流程和提升工作效率。然而，由于某些原因，我不得不做出一些调整。为了能够继续开发和维护这个项目，我将推出一款付费的后台管理系统，以确保我能够持续为您提供高质量的服务和支持。

专业版本不会在开源版本做一些破坏性变更，所以当您从开源版本切换到专业版本，不会有任何开发心智负担。但是使用专业版本会有新的组件来配合您的工作。

我深信，付费后台管理系统将为您带来更多的价值和便利，帮助您提升工作效率

## 功能
- [x] 用户管理 后台用户管理
- [x] 部门管理 配置公司的部门结构，支持树形结构
- [x] 岗位管理 配置后台用户的职务
- [x] 菜单管理 配置系统菜单，按钮等等
- [x] 角色管理 配置用户担当的角色，分配权限
- [x] 操作日志 后台用户操作记录
- [x] 登录日志 后台系统用户的登录记录
- [x] 代码生成 生成 API 端的 CURD 操作
- [x] Schema 管理 生成表结构

## 讨论
- 可以提 `ISSUE`，请按照 `issue` 模板提问
- 加入 Q 群 `302266230` 暗号 `catchadmin`。
- 加微信入群，新建🆕

<img src="wechat.png" width="300"/>

## 项目地址
- [github catchadmin](https://github.com/jaguarjack/catch-admin)
## 文档地址
- [文档地址](https://catchadmin.com/docs/3.0/intro)
## 预览

![zRrjNd.png](https://i.imgtg.com/2023/02/16/dASpg.png)
![zRsAEQ.png](https://i.imgtg.com/2023/02/16/dAsKK.png)
![zRsUv6.png](https://i.imgtg.com/2023/02/16/dA0fB.png)
![zRsV4s.png](https://i.imgtg.com/2023/02/16/dAd5s.png)

## 体验地址
[demo 地址](https://v3.catchadmin.com)
- 账户: `catch@admin.com`
- 密码: `catchadmin`

## 视频教程(😂记得一键三连哦)
- [catchadmin 安装](https://www.bilibili.com/video/BV1eY411v71J/)
- [catchadmin 开发之模块创建](https://www.bilibili.com/video/BV1jP41127aW/)
- [catchadmin 之快速开发](https://www.bilibili.com/video/BV1Qh4y1J7eB/)

## 规范
### PHP
使用 fixer 进行代码检查, 具体请查看根目录下 `.php-cs-fixer.dist.php` 文件的规范，还需要进行以下两步骤
```shell
mkdir path
```
```shell
composer require --working-dir=path friendsofphp/php-cs-fixer                                                                                      
```
安装完成之后可以使用
```shell
composer cs
```
进行代码格式化，这个命令会直接修改文件完成修正，如果只需要查看格式是否正确,那么使用
```shell
composer cs-diff
```

## 感谢🙏
> 排名不分先后

- [ThinkPHP](https://thinkphp.cn)
- [Vue](https://cn.vuejs.org/)
- [ElementPlus](https://element-plus.org)
- [JetBrains](https://www.jetbrains.com/)


