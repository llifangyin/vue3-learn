<template>
  <div class="about">
    <h1>{{ msg }}</h1>

    <SlotChild class="parentClass">
      this is slot content; 
    <!-- 解开下一行注释就会触发onupdated -->
    <slot></slot>



    <!-- 作用域插槽 可以访问子组件的状态 -->
      <template #s2="scope">
        hello slot1 
      {{ scope.text }}
      </template>
    </SlotChild>
</div>
</template>
<script  setup>
import SlotChild from './SlotChild_test.vue'
import { ref,onUpdated } from 'vue'
const msg = ref('this is messages')
onUpdated(() => {
  console.log('updated parent')
})
setTimeout(() => {
  msg.value = 'changed msg'
}, 1000);
</script>
