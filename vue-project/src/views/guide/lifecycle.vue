<template>
  <h5>
   
 defineExpose 用于暴露组件的属性
3.2之前，所有ref和reactive返回的响应式对象都会自动暴漏给父组件，
3.2之后，需要使用defineExpose暴露 声明哪些属性应该暴漏

  </h5>
  <div class="about">
    <h1>lifecycle</h1>
    {{ a }}
  </div>
</template>
<script  setup>

import { reactive ,computed,ref,onMounted,onUpdated,
  onUnmounted,
  onRenderTracked
 } from 'vue'
let a = ref(0)

setTimeout(() => {
  a.value= 2
}, 1000);

onMounted(()=>{
  // console.log(1111);
})
onUpdated(()=>{
  // console.log(3333);
})
onUnmounted(()=>{
  // console.log('onUnmounted');
})
// onRenderTracked 会在组件的每次渲染时调用 比onMounted更早
onRenderTracked(()=>{
  // console.log('000');
})
const c = 1
const d = ref(2)
//  defineExpose 用于暴露组件的属性
// 3.2之前，所有ref和reactive返回的响应式对象都会自动暴漏给父组件，
// 3.2之后，需要使用defineExpose暴露 声明哪些属性应该暴漏
defineExpose({c,d}) 

</script>
<style>

</style>
