<template>
  <div >
     {{x}},{{ y }}
  </div>
</template>

<script setup>
import {} from "vue"
// 组合式函数:利用组合式api封装和复用有状态逻辑的函数
import {useMouse} from './mouse.js'
const {x,y} = useMouse()

// unref() 如果参数是ref返回内部值,否则返回参数本身
</script>

<style  scoped>
</style>