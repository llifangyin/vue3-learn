<template>
  <div>
    <h3>ref接受一个内部值，返回一个响应式的，可更改的ref对象，此对象只有一个指向其内部值的value</h3>
    <h3>computed: 接受一个getter函数，返回一个只读的响应式ref对象</h3>
    <h3>reactive: 返回一个对象的响应式代理</h3>
    <h3>readonly:接受一个对象，返回一个原值的只读代理</h3>
    <h3>watchEffect: 立即执行一个函数，同时响应式地追踪其依赖，并在依赖修改时重新执行</h3>
    <h3>watch: 侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数</h3>
  </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,reactive,watchEffect,readonly, watchPostEffect, watchSyncEffect } from 'vue';

// 可读的计算属性ref
const count = ref(0);
const plusOne = computed(() => count.value + 1);
plusOne.value ++ //不执行

// console.log(plusOne.value,'plusone'); // 1
// console.log(count.value,'count'); // 0
const plusTwo = computed({
  get: () => count.value + 2,
  set: val => {
    count.value = val - 2;
  },
  onTrack() { //监听
    console.log('onTrack');
  },
  onTrigger() {//触发
    console.log('onTrigger');
  }
})
plusTwo.value = 5;
// console.log(count.value,'plusTwo'); // 3


const obj = reactive({count:0})
obj.count ++;
// console.log(obj.count,'obj.count');

const count1 = ref(0);
const obj1 = reactive({count1})
// console.log(obj1,'obj1');
// console.log(obj1.count1 == count1.value) // true 不用.value自动解包 (数组和map对象需要.value,不会解包)

count1.value ++
// console.log(count1.value,'count1.value');//1
// console.log(obj1.count1,'obj1.count1');//1

obj1.count1 ++
// console.log(count1.value,'count1.value');//2
// console.log(obj1.count1,'obj1.count1');//2

const count2  = ref(1)
const obj2 = reactive({})
obj2.count2 = count2//自动解包
count2.value ++
// console.log(count2.value,'count2.value'); // 2
// console.log(obj2.count2,'obj2.count2'); // 2

const original = reactive({ count: 0 })
const copy = readonly(original)
watchEffect(() => {
  console.log(copy.count,'watch')//用来做响应性跟踪
})
original.count ++
// copy.count++ //报错

// const stop = watchEffect(() => {
//   console.log('watchEffect');
// })
// pause() //暂停监听
// resume() //恢复监听
// stop() //停止监听

// watchEffect {flush: 'pre'} //副作用函数在组件更新之前执行 默认；
// watchEffect {flush: 'post'} //会使监听器延迟到组件渲染之后执行
// watchEffect {flush: 'sync'} //在响应式依赖发生变化时立即触发侦听器
// onCleanup 用于清理副作用
// 在某些情况下，你可能需要在副作用重新执行之前清理上一次的副作用。例如，清理定时器或取消API请求。
// watchEffect(async (onCleanup) => {
//   const { response, cancel } = doAsyncWork(id.value)
//   // `cancel` 会在 `id` 更改时调用
//   // 以便取消之前
//   // 未完成的请求（又更新了,还存在未完成的请求）
//   onCleanup(cancel)
//   data.value = await response
// })
// watchPostEffect 简写
// watchSyncEffect

// watch
// 第一个值是要监听的数据源，第二个值是回调函数 
// 第三个值是配置项 imeediate deep  flush(刷新时机) onTrack(调试侦听器) once(只执行一次)
// watch(source, callback, {
//   flush: 'post',
//   onTrack(e) {
//     debugger
//   },
//   onTrigger(e) {
//     debugger
//   }
// })
// 与watchEffect不同 watch可以懒执行副作用，明确由哪个状态触发执行，可以访问前一个值和当前值

// onWatcherCleanup 3.5+ 清理副作用
// import { watch, onWatcherCleanup } from 'vue'

// watch(id, (newId) => {
//   const { response, cancel } = doAsyncWork(newId)
//   // 如果 `id` 变化，则调用 `cancel`，
//   // 如果之前的请求未完成，则取消该请求
//   onWatcherCleanup(cancel)
// })
</script>
<style>

</style>
