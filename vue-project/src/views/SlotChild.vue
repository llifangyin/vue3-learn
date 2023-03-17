<template>
  <div class="about">
    <h1>slotchild</h1>
    <!-- slot中间默认内容 -->
    <!-- <slot :text="text">
         this is defalut content
    </slot> -->

    <!-- 具名插槽,在一个组件里有多个插槽出口 -->
    <p>
      <slot name="s1" :text='text'></slot>
      <slot name="s2" :text='text'></slot>
      <slot name="s3" :text='text'></slot>
    </p>
</div>
</template>
<script  setup>
import { ref } from 'vue'
const text = ref('this is scoped text')
</script>
