<template>
  <h4>
    插槽内容可以获取到父组件的作用域,无法访问子组件的数据+
    <!-- 作用于插槽可以访问子组件的状态 v-slot:s1="scope" -->
  </h4>
  <div class="about">
    <h1>slot</h1>
    <h3>默认插槽</h3>
    <h3>具名插槽 <slot name="header"></slot>  </h3>
    <h3>作用域:普通v-slot='props' 具名 #slot='props'</h3>
    <h3>具名作用域插槽</h3>
    <h3>无渲染组件</h3>
    <!-- v-slot="slotProps" -->
    <SlotChild class="parentClass">
      this is slot content; 
<!-- // 插槽内容可以获取到父组件的作用域 
      无法访问子组件的数据-->
      {{ msg }}
      <template v-slot:s1="scope">
        hello slot1 
      {{ scope.text }}
      </template>
      <!-- v-slot缩写 #  -->
      <template #s2="scope">
        hello slot2
       {{ scope.text }}
      </template>
    
      <template #s3="scope">
        hello slot3
       {{ scope.text }}
      </template>
      {{ slotProps.text }}

      <!-- 作用域插槽 可以访问子组件的状态 -->
    </SlotChild>

</div>
</template>
<script  setup>
import SlotChild from './SlotChild.vue'
import { ref } from 'vue'
const msg = ref('this is messages')
</script>
