<template>
  <div class="about">
    <h1>slotchild</h1>
    <!-- slot中间默认内容 -->
    <!-- <slot :text="text">
         this is defalut content
    </slot> -->

    <!-- 具名插槽,在一个组件里有多个插槽出口 -->
    <p>
      <slot name="s1" :text='text1'></slot><br>
      <slot name="s2" :text='text2'></slot> <br>
      <slot name="s3" :text='text3'></slot>
    </p>
</div>
</template>
<script  setup>
import { ref } from 'vue'
const text1 = ref('this is scoped text1')
const text2 = ref('this is scoped text2')
const text3 = ref('this is scoped text3')
</script>
