<template>
  <div>
    <h2>服务端渲染API </h2>
    <h3>renderToString</h3>
    <h3>renderToNodeStream 将输入渲染为要给nodejs readable stream实例</h3>
    <h3>pipeToNodeWritable 将输入渲染并pipe到一个nodejs writable stream实例</h3>
    <h3>renderToWebStream 将输入渲染未一个web ReadableStream实例 </h3>
    <h3>pipeToWebWritable 将输入渲染你并pipe到一个web WritableStream实例</h3>
    <h3>renderToSimpleStream 通过一个简单的接口，将输入为stream模式进行渲染</h3>
    <h3>useSSRContext 运行时api，上下文对象</h3>

    <h1>
      什么是SSR
    </h1>
    <p>
      SSR是服务端渲染，是指在服务端将vue组件渲染为html字符串，然后将其发送到浏览器，最终将其激活为可交互的页面。
    </p>
    <h1>
      为什么使用SSR
    </h1>
    <p>
      1. 更好的SEO，搜索引擎爬虫可以直接查看完全渲染的页面。
      2. 首屏渲染时间更快。
      3. 统一的心智模型，使用相同的语言以及相同的声明式、面向组件的心智模型开发整个应用，
      不需要后端模板系统和前端框架之间来回切换
    </p>
    <h1>
      权衡是否使用SSR
    </h1>
    <p>
     1. 开发中的限制，浏览器特定的代码，如window对象或document对象，只能在浏览器环境中使用；一些外部库可能需要特殊处理才能在服务器渲染应用程序中运行。
     2. 需要nodejs环境
     3. 更高的服务器负载，nodejs渲染一个应用比托管静态文件需要更多的CPU和内存
     4. 使用场景，内容展示速度极快的场景
    </p>
    <h1>基础使用，见ssr项目</h1>
  </div>
</template>
<script  setup>
import {} from 'vue';

</script>

<style scoped>

</style>