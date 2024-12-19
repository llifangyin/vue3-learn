<template>
  <div >
     
  </div>
</template>

<script setup>
import {} from "vue"
// suspense  组件数中异步依赖的处理,可以等待多层组件数的各个依赖异步获取结果,
// 顶层展示加载中

// 可等待异步依赖有两种
// 1.带有异步setup钩子的组件  await
// 2.异步组件
// 有两个插槽
// #dafault #fallback

// 三个事件  
// pengding 挂起状态触发 
// resolve default插槽获取完成新内容时触发
// fallback 插槽内容显示时触发


// <Transition mode="out-in">
//     <KeepAlive>
//       <Suspense>
//         <!-- 主要内容 -->
//         <component :is="Component"></component>

//         <!-- 加载中状态 -->
//         <template #fallback>
//           正在加载...
//         </template>
//       </Suspense>
//     </KeepAlive>
//   </Transition>
</script>

<style  scoped>
</style>