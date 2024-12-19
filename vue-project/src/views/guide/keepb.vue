<template>
  <div >
    keepb
     <input type="text" v-model="text">
  </div>
</template>

<script setup>
import { ref,shallowRef,onActivated,onDeactivated } from 'vue'
const text = ref('')
// 注册状态的钩子
onActivated(() => { 
  // / 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  console.log('bbbbb11111111');
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log('bbbbb2222');
})
</script>

<style lang="scss" scoped>
</style>