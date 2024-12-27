<template>
  <div>
    <h3>shallowRef: ref()的浅层作用形式</h3>
    <h3>triggerRef: 强制触发一个依赖于浅层ref的副作用， 通常在对浅引用的内部值进行深度变更后使用</h3>
    <h3>customRef: 创建一个自定义的ref,显示的声明对其依赖追踪和更新触发的控制方式</h3>
    <h3><input type="text" v-model="text"></h3>

    <h3>shallowReactive: 只对跟级别的属性是响应式的。reactive的浅层作用形式；属性的值会被原样的存储和暴露，ref的属性不会自动解包了</h3>

   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,watch ,
  reactive,watchEffect,readonly, watchPostEffect, watchSyncEffect ,
  isRef,unref,toValue,shallowRef,
  triggerRef,customRef ,shallowReactive
} from 'vue';
// shallowRef与ref的区别在于shallowRef只会对第一层数据进行响应式处理，只对.value的访问是响应式的
// 常常用于对大型数据结构的性能优化 或 与外部的状态管理系统集成

const state = shallowRef({count:1})
// watch(()=>state.value,(val)=>{
//   console.log(val,'changed') //{count: 3}'changed'
// })
state.value.count  = 2
// console.log(state.value,'state.value')//{count:2} 但是没有触发响应式
state.value = {count:3}
// console.log(state.value,'state.value') //{count:3} 触发了响应式


const shallow = shallowRef({msg:'hello'})
watchEffect(()=>{
  // console.log(shallow.value,'shallow.value.msg')//hello ; world
})
triggerRef(shallow)
shallow.value.msg = 'world'

// customRef 预期接收一个工厂函数作为参数，该工厂函数接收一个track和trigger函数作为参数，并返回一个带有get和set方法的对象
// 一般来说 track函数用于追踪依赖，trigger函数用于触发更新

// 创建个防抖ref 只在最新一次set调用的一段固定间隔后再调用

const useDeouncedRef = (value,delay=200)=>{
  let timeout
  return customRef((track,trigger)=>{
    return {
      get(){
        track()//追踪依赖
        return value
      },
      set(newValue){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
          value = newValue
          trigger() //触发更新
        },delay)
      }
    }
  })
}
const text = useDeouncedRef('hello',2000)
// watch(()=>text.value,(val)=>{
//   //防抖更新
//   console.log(val,'text.value')
// })

const shallowR = shallowReactive({foo:1,nested:{bar:2}})

shallowR.foo ++

watchEffect(()=>{
  console.log(shallowR.foo,'shallowR.foo')//2
})



</script>
<style>

</style>
