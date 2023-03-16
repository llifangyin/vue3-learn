<template>
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
  console.log(1111);
})
onUpdated(()=>{
  console.log(3333);
})
onUnmounted(()=>{
  console.log('onUnmounted');
})
onRenderTracked(()=>{
  console.log(444);
})
const c = 1
const d = ref(2)
defineExpose({c,d})
</script>
<style>

</style>
