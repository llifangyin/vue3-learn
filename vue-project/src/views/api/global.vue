<template>
  <button id="counter" @click="increment">{{ count }}</button>
  <H3>
    <pre>

    import { createApp } from 'vue'
    import App from './App.vue'
    const app = createApp({
      App  // 根组件选项 
    })

    app.mount('#app')//将应用实例挂载在一个容器元素中。
    // 参数可以是一个实际的 DOM 元素或一个 CSS 选择器 (使用第一个匹配到的元素)。返回根组件的实例。
    app.onUnmount() //注册一个回调函数，在应用卸载时调用
    app.component() //如果同时传递一个组件名字符串及其定义，则注册一个全局组件；   如果只传递一个名字，则会返回用该名字注册的组件 (如果存在的话)。
    // 注册一个选项对象
    app.component('my-component', {
      /* ... */
    })

    // 得到一个已注册的组件
    const MyComponent = app.component('my-component')

    app.directive() //注册一个全局自定义指令
 
    // 注册（对象形式的指令）
    app.directive('my-directive', {
      /* 自定义指令钩子 */
    })

    // 注册（函数形式的指令）
    app.directive('my-directive', () => {
      /* ... */
    })
    // 得到一个已注册的指令
    const myDirective = app.directive('my-directive')

    app.use() //安装一个插件。
    import ElementPlus from 'element-plus'
    app.use(ElementPlus)

    app.mixin() //全局注册一个混入，影响注册之后所有创建的每个应用实例。

    app.provide() // 注册一个全局的依赖注入，可以在任何后代组件中使用 inject 注入它。
    app.provide('message', 'hello') // 注册一个名为 'message' 的依赖注入，值为 'hello'。

    import { inject } from 'vue'
    export default {
      setup() {
        console.log(inject('message')) // 'hello'
      }
    }

    app.version // 返回当前 Vue 的版本号
    <!-- export default {
      install(app) {
        const version = Number(app.version.split('.')[0])
        if (version < 3) {
          console.warn('This plugin requires Vue 3')
        }
      }
    } -->

      app.config// 全局配置对象，包含 Vue 的全局配置。

      app.config.errorHandler// 一个函数，用来处理组件渲染和观察期间未捕获错误。它会接收错误的错误信息和 Vue 实例。

      app.config.warnHandler

      app.config.performance// 一个布尔值，用来配置是否开启性能追踪。
      设置此项为 true 可以在浏览器开发工具的“性能/时间线”页中启用对组件初始化、编译、渲染和修补的性能表现追踪。

      app.config.compilerOptions.comments// 一个布尔值，用来配置是否保留模板编译时产生的注释。默认情况下，注释会被删除。

      app.config.globalProperties// 一个对象，包含应用程序中经常需要使用的属性。在 setup() 函数中可以通过 this 访问这些属性。



      nextTick //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

      defineComponent// 在定义 Vue 组件时提供类型推导的辅助函数

      defineAsyncComponent// 定义一个异步组件，它在运行时是懒加载的。参数可以是一个异步加载函数，或是对加载行为进行更具体定制的一个选项对象。
      const AsyncComp = defineAsyncComponent(() =>  import('./AsyncChild.vue')  )
  </pre>
  </H3>

</template>
<script  setup>

import { reactive ,nextTick,ref,version} from 'vue'
console.log(version,'version')


const count = ref(0)

async function increment() {
  count.value++

  // DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0

  await nextTick(()=>{
    console.log('nextTick')
    console.log(document.getElementById('counter').textContent) // 1
  })
  // DOM 此时已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>
