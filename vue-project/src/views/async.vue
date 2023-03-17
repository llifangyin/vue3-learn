<template>
  <div class="about">
    <h1>async component异步组件</h1>
    <AsyncComp></AsyncComp>
    <AsyncPinia></AsyncPinia>
</div>
</template>
<script  setup>
import { defineAsyncComponent } from 'vue'
import loading from './loading.vue'
import error from './error.vue'
// 大型项目,把应用拆分更小的块,从服务器加载相关组件

// es模块导入返回一个promise
const AsyncComp = defineAsyncComponent(() =>  import('./AsyncChild.vue')  )
// console.log(AsyncComp);
// 得到的是包装过的组件,尽在页面渲染时才会调用内部实际组件的函数,可以实现延迟加载
const AsyncPinia = defineAsyncComponent({
  loader:()=> import('./pinia.vue'),
  loadingComponent:loading,
  delay:2000,
  errorComponet:error,
  timeout:3000
})

// 注意
// ()=>{} 没有返回值 如果需要里面加return
// ()=>  默认饭hi
// ()=>(xx) == ()=>{return xx}

// 搭配Suspense使用
</script>
