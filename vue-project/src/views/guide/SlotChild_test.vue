<template>
  <div class="about">
    <h1>SlotChild</h1>

    <slot name="default">
         this is defalut content
    </slot>

    <!-- 具名插槽,在一个组件里有多个插槽出口 -->
    <p>
      <slot name="s1" :text='text1'></slot><br>
      <slot name="s2" :text='text2'></slot> <br>
    </p>
</div>
</template>
<script  setup>
import { ref ,onUpdated} from 'vue'
const text = ref('this is default text')
const text1 = ref('this is scoped text1')
onUpdated(() => {
  console.log('updated child')
})
</script>
