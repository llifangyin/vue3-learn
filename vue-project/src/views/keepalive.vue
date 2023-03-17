<template>
  <div class="about">
    <h1>keepalive</h1>
    <!-- keepalive是一个内置组件,它的功能时再多个组件间动态切换时缓存被移除的组件实现 -->
    <!-- include exclude 正则表达式限制行为 -->
    <!-- include匹配name值 默认文件名 -->
    <keep-alive :include="['keepa','keepb']" :max="1">
      <component :is="componentId" ></component>
    </keep-alive>
    <!-- 当一个组件被移除,但被keepalive缓存时,它将变为不活跃状态而不是卸载 -->


    <button @click="toogle">toogle</button>
</div>
</template>
<script  setup>
import KeepA from './keepa.vue'
import KeepB from './keepb.vue'
import { ref,shallowRef,onActivated,onDeactivated } from 'vue'
// 注册状态的钩子
onActivated(() => { 
  // / 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  console.log(111);
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log(222);
})


console.log(KeepA); 
// name("keepa") render setup 

// shallowRef ref的浅层作用形式,值会原样存储和暴漏,不会深层递归转为响应式
// 只有.value时响应式的

const componentId = shallowRef(KeepB)
function toogle(){
  componentId.value = componentId.value ==KeepA?KeepB:KeepA
}



</script>
