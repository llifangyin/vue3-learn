<template>
  <div >
     keepa-count:{{ count }}
     <button @click="add">add</button>
  </div>
</template>

<script setup>
import { ref,shallowRef,onActivated,onDeactivated } from 'vue'
// 注册状态的钩子
onActivated(() => { 
  // / 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  console.log('aaaaaa1111');
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log('aaaaaa222');
})
const count = ref(0)
function add(params) {
  count.value ++
}

</script>

<style lang="scss" scoped>
</style>