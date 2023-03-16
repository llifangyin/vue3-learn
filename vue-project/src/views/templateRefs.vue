<template>
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
import { ref,onMounted ,watchEffect}from 'vue'
// 声明一个ref存放元素的引用
const input = ref(null)
// onMounted(()=>{
//   input.value.focus()
// })
watchEffect(()=>{
  if(input.value){
    console.log('挂载后');
    input.value.focus()
  }else{
    console.log('还未挂在');
  }
})
const list = ref([1,2,3,4,5])
const itemRefs = ref([])
onMounted(()=>{
  console.log(itemRefs.value);
})
const lifecycle = ref(null)
console.log(lifecycle,lifecycle.c,lifecycle.d,'lifecycle');
</script>
<style>

</style>
