<template>
  <h4>
    watchEffect会马上执行
    <br>
    ref绑定dom，初始化为null，挂载后才可以获取dom节点
    <br>
    父组件获取子组件defineExpose暴漏的属性要等挂载后才可以获取
  </h4>
  <div class="about">
    <h1>tempalteRefs</h1>
    <input type="text" ref="input">
    <ul>
      <li v-for="(item, index) in list" ref="itemRefs" :key="index">
        {{ item }}
      </li>
    </ul>
    <Lifecycle ref="lifecycle" />
  </div>
</template>
<script  setup>
import Lifecycle from './lifecycle.vue'
import { onActivated } from 'vue';
import { ref,onMounted ,watchEffect}from 'vue'
// 声明一个ref存放元素的引用
const input = ref(null)
// onMounted(()=>{
//   input.value.focus()
// })
watchEffect(()=>{
  // 渲染dom后 ref挂载为dom节点
  if(input.value){
    console.log(input.value,1111);
    console.log('挂载后');
    input.value.focus()
  }else{
    // 初始化为挂载input为null
    console.log('还未挂载');
  }
})
const list = ref([1,2,3,4,5])
const itemRefs = ref([])
onMounted(()=>{
  // console.log(itemRefs.value); // 五个list的虚拟dom 
})
const lifecycle = ref(null)
console.log(lifecycle,lifecycle.c,lifecycle.d,'lifecycle');
// 挂载后才可以获取子组件 defineExpose暴漏的属性
onMounted(()=>{
  console.log(lifecycle,lifecycle.value.c,lifecycle.value.d,'lifecycle');
})  
</script>
<style>

</style>
