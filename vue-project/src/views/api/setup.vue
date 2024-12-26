<template>
  <h1>基本使用</h1>
  <h1>访问 Props</h1>
  <h1>Setup 上下文</h1>
  <h1>与渲染函数一起使用</h1>

  <setup-sub :title="count" ref="subRef" :title1="count1"></setup-sub>
  <set-render ref="renderRef"></set-render>
  <button @click="handleClick">+</button>
</template>

<script setup>
import { ref ,toRefs} from 'vue';
import SetupSub from './Setupsub.vue'
import SetRender from './SetRender.vue'

const count = ref('hello vue');
const count1 = ref('hello vue111');
const subRef = ref(null);
// console.log(subRef,'subRef')
// console.log(subRef.value.count,'subRef.epxose')

const renderRef = ref(null);
const handleClick = ()=>{
  renderRef.value.increment()
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>
