::: tip
如果你是第一次使用 VUE，建议先去看看 VUE 文档，了解一下。
:::
## 下载 vue 项目
在使用前端项目之前，你需要安装前端管理器，这个不多做解释了。推荐使用`yarn` 安装，首先你需要安装 `yarn` 管理器。使用淘宝镜像。
```sh
yarn config set registry https://registry.npm.taobao.org/
```
#### 下载项目
```sh
git clone https://a.ittim.ltd:18888/erp-oms/erp-vue.git
```

#### 进入目录,使用 yarn 安装
```sh
yarn install
```

#### 配置接口地址，找到 vue 项目下的 
- `.env.development` 文件是配置开发环境的 API 接口地址 (实际上就是 PHP 项目的地址)

#### 启动开发模式
请先在前端项目根目录下的`.env.development` 文件设置 `VUE_APP_BASE_API`开发环境的 API 请求地址
```sh
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://127.0.0.1:9090'
```
然后启动项目
```sh
npm run dev
```

::: tip
vue 后台使用了是 `element admin` [文档地址](https://panjiachen.gitee.io/vue-element-admin-site/zh/)
:::