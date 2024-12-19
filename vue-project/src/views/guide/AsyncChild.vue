<template>
  <div class="about">
    <h1>动态子组件</h1>
    {{ msg }}

</div>
</template>
<script  setup>
import { ref } from 'vue'
const msg = ref('message')

</script>
