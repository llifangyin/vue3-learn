<template>
  <div>
    <h3>provide 提供一个值,可以被后代组件注入</h3>
    <h3>inject 注入一个由祖先组件或者整个组件(app.provide)提供的值</h3>
    <injectSub></injectSub>
   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,
  reactive,watchEffect,onMounted,provide
} from 'vue';
import injectSub from './injectionSub.vue'
// provide与和生命周期函数类似,在setup函数中使用
const name = ref('vue3');
provide('name',name);

</script>
<style>

</style>
