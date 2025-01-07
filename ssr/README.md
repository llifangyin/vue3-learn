## 渲染一个应用
1. packge.json  声明type :  module 使nodejs已ES modules mode运行

> enderToString() 接收一个 Vue 应用实例作为参数,返回一个promise,当promise.resolve时都得到应用渲染的HTML,也可以使用**nodejs stream api**或**web streams api**来执行流式渲染


2. 把Vue SSR的代码移动到一个服务器请求处理函数里，将HTML段包装为完整的页面HTML。(安装express)

## 客户端激活
example.js中 点击按钮数字没有改变，html在客户端是完全静态的，没有在浏览器中加载vue
激活过程中，vue会创建一个跟服务端完全相同的应用实例，匹配dom节点，添加dom事件监听器
1. server.use(express.static('.')) 
2. <script type="module" src="/client.js"></script> 添加到 HTML 外壳以加载客户端入口文件
3. 使用sciprt type= 'importmap' 支持浏览器中使用vue
``` js
  {
"imports":{
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
}
}
```



## 更通用的解决方案

从例子到一个ssr应用还需要。
. 支持vue单文件组件，（两次构建过程： 客户端，服务器）**vue组件在ssr时的编译产物未字符串拼接，以此提高渲染性能**
. 服务器请求处理函数中，确保返回的html包含正确的客户资源链接和资源加载提示，(prefetch preload)，SSR和SSG模式之间切换
. 管理路由，数据获取，状态存储

### Nuxt 构建vue生态系统之上的全栈框架
### Quasar 基于vue的完整解决方案，一套代码库构建不同目标应用。SPA SSR PWA App桌面
### Vite SSR  内置vue服务渲染支持


## 组件生命周期
因为没有动态更新，onMounted和onUpdatad这样的生命周期钩子不会再ssr期间调用，只会再客户端运行。 将含有副作用的代码放到onMounted中

## 平台特有api
window document 等，建议封装通用api

## 跨请求状态污染
在 SSR 环境下，应用模块通常只在服务器启动时初始化一次
解决方案是在每个请求中为整个应用创建一个全新的实例 包括 router 和全局 store·
```js
// app.js （在服务端和客户端间共享）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// 每次请求时调用
export function createApp() {
  const app = createSSRApp(/* ... */)
  // 对每个请求都创建新的 store 实例
  const store = createStore(/* ... */)
  // 提供应用级别的 store
  app.provide('store', store)
  // 也为激活过程暴露出 store
  return { app, store }
}
```
## 自定义指令， getSSRProps
## teleports
```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```
