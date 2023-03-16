<template>
  <div class="about">
    <h1>watch</h1>
    {{ source.count }}
  </div>
</template>
<script  setup>

import { ref,watch,reactive,watchEffect }from 'vue'
const x = ref(1)
const y = ref(2)
setTimeout(() => {
  x.value = 3
}, 1000);
// watch第一个参数是数据源，可以是一个ref 一个响应式对象，一个getter函数或多个数据源数组
// 单个ref
watch(x,(newX)=>{
  console.log(newX);
})
// getter函数
watch(()=>x.value+y.value,(sum)=>{
  console.log(sum,'sum');
})
// 多个数组
watch([x,()=>y.value],([newX,newY])=>{
  console.log(newX,newY);
})



let obj = reactive({count:1})

setTimeout(() => {
  obj.count = 4
}, 1500);
// 不能直接监听对象的属性 xxx
watch(obj.count,(newObj)=>{
  console.log(newobj.count.value);
})
// 需要返回要给getter函数
watch(()=> obj.count,(count)=>{
  console.log(count,'count');
})

let b = reactive({count:0})
b.count++
watch( ()=>b.count,(val)=>{
  console.log(val,'deep');
},{deep:true},{immediate:true})

// flush:'post' 侦听回调vue更新之后的dom
const source = reactive({count:1})
setTimeout(() => {
  source.count ++
}, 1000);
watch(source,(val)=>{
  console.log('flush before');
})
watch(source,(val)=>{
  console.log('flush after');
},{
  flush:'post'
})

// watchEffect 更简洁不用传监听的值，会立即执行不需要指定immediate:true,
watchEffect(()=>{
  const res = source.count + obj.count
  console.log(res,'res');
})

// 正常同步创建的watch 如果异步创建要给侦听器必须手动停止它，以防内存泄露

// 会自动停止
watchEffect(()=>{})
// 不会自动停止
setTimeout(() => {
  watchEffect(()=>{})
}, 100);
// 手动停止一个侦听器
const unwatch = watchEffect(()=>{})
unwatch() //执行即释放
</script>
<style>

</style>
