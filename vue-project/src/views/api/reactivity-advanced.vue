<template>
  <div>
    <h3>shallowRef: ref()的浅层作用形式</h3>
    <h3>triggerRef: 强制触发一个依赖于浅层ref的副作用， 通常在对浅引用的内部值进行深度变更后使用</h3>
    <h3>customRef: 创建一个自定义的ref,显示的声明对其依赖追踪和更新触发的控制方式</h3>
    <h3><input type="text" v-model="text"></h3>

    <h3>shallowReactive: 只对跟级别的属性是响应式的。reactive的浅层作用形式；属性的值会被原样的存储和暴露，ref的属性不会自动解包了</h3>
    <h3>shallowReadonly:readonly的浅层作用形式</h3>
    <h3>toRaw: 根据一个Vue创建的代理返回原始对象</h3>
    <h3>markRaw: 将一个对象标记为不可被转为代理，返回该对象本身</h3>
    <h3>effectScope: 创建一个effect作用域，可以捕获其中所创建的响应式副作用（计算器和侦听器）</h3>
    <h3>onScopeDispose: 在当前活跃的effect作用域上注册一个处理回调函数。在相关的effect作用域停止时会调用这个回调函数</h3>

   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,watch ,
  reactive,watchEffect,readonly, watchPostEffect, watchSyncEffect ,
  isRef,unref,toValue,shallowRef,
  triggerRef,customRef ,shallowReactive,toRaw,markRaw,
  isReactive,effectScope,getCurrentScope,onScopeDispose
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
  // console.log(shallowR.foo,'shallowR.foo')//2
})

// toRaw 用于临时读取而不引起代理访问的跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，谨慎使用
const foo = {}
const  reactFoo = reactive(foo)
// console.log(toRaw(reactFoo) === foo) //true

// markRow 使用场景： 有些只不应该是响应式的，比如第三方库的对象，或者是已经被reactive处理过的对象
// 党呈现不可以变数据源的大型数据结构时，可以使用markRaw来提高性能
const bar = markRaw({})
// console.log(isReactive(bar)) //false
// const bar1 = reactive(bar)
// console.log(bar1,isReactive(bar1)) //{__v_skip: true} true

const raw1 = reactive({
  foo:1,
  bar:{
    baz:2
  }
})
const raw2 = markRaw(raw1)
// console.log(isReactive(raw2,'raw2')) //true
raw2.foo ++ //3
// console.log(raw1,raw2,'raw1 raw2') 
// const raw3 = reactive(raw2)
// console.log(isReactive(raw3),'raw3') //true


const scope  = effectScope()
// 创建一个effect作用域，可以捕获其中所创建的响应式副作用（计算器和侦听器）
// 作用域内的副作用会在作用域停止时自动停止
const count = ref(1)
scope.run(()=>{
  const doubled = computed(()=>count.value * 2)
  console.log(getCurrentScope(),'getCurrentScope inner')//null
  watch(()=>doubled.value,()=>{
    console.log(doubled.value,'doubled.value watch')//2 4 6

  })
  watchEffect(()=>{
    console.log(count.value,'count.value watchEffect')//1 2 3
  })
})
count.value ++
// scope.stop()
console.log(getCurrentScope(),'getCurrentScope')//null

// onScopeDispose 
//可以作为可复用的组合式函数中onUnmounted的替代方案，用于在effect作用域停止时执行清理操作




</script>
<style>

</style>
 