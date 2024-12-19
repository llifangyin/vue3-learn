<template>
  <h4>
   1  watch第一个参数是数据源，可以是一个ref 一个响应式对象，一个getter函数或多个数据源数组 <br>
   2  需要返回要给getter函数 不能直接监听对象的属性  ()=> obj.count <br>

   3 {flush:post} 表示观察者回调将在 DOM 更新后运行
   如果你的回调函数需要读取更新后的 DOM 属性或者执行依赖于 DOM 的操作。<br>

   4 watchEffect 更简洁不用传监听的值，会立即执行不需要指定immediate:true,<br>
   5 如果异步创建要给侦听器watchEffect 必须手动停止它，以防内存泄露
<br>
   6 watch 和 watchEffect 都返回一个停止函数
  </h4>
  <div class="about">
    <h1>watch</h1>
    <!-- {{ source.count }} -->
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
  // console.log(newX); // 3
})
// getter函数
watch(()=>x.value+y.value,(sum)=>{
  // console.log(sum,'sum'); // 5
})
// 多个数组
watch([x,()=>y.value],([newX,newY])=>{
  // console.log(newX,newY); // 3 2
})



let obj = reactive({count:1})

setTimeout(() => {
  obj.count = 4
}, 1500);

// 不能直接监听对象的属性 不是个响应式对象
watch(obj.count,(newObj)=>{
  console.log(newobj.count.value,'dddd');
})
// 需要返回要给getter函数 不能直接监听对象的属性
watch(()=> obj.count,(count)=>{
  // console.log(count,'count');
})

let b = reactive({count:0})
watch( ()=>b.count,(val)=>{
  // console.log(val,'deep');// 1
},{deep:true,immediate:true})
b.count++

// flush:'post' 侦听回调在vue更新之后的dom
const source = reactive({count:1})
setTimeout(() => {
  source.count ++
}, 1000);
// watch(source,(val)=>{
//   console.log('flush before');
// })
// watch(source,(val)=>{
//   console.log('flush after');
// },{
//   flush:'post'
// })

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


// 手动停止一个侦听器 watchEffect 返回一个停止函数
const unwatch = watchEffect(()=>{})
unwatch() //执行即释放
</script>
<style>

</style>
