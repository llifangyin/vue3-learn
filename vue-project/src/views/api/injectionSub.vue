<template>
  <div>
    <h3>injectsub</h3>

    <h4>name:{{name}}</h4>
    <h5>path:{{path}}</h5>
    <h5>appName:{{appName}}</h5>
   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,
  reactive,watchEffect,onMounted,provide,inject
} from 'vue';
// provide与和生命周期函数类似,在setup函数中使用
const name = inject('name');
const path = inject('path','default path');
const appName = inject('appName',ref('default appName'));
</script>
<style>

</style>
