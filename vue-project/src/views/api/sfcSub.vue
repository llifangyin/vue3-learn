<script  setup>
import { watchEffect,useAttrs } from 'vue'
// const props = defineProps({
//   msg:String
// })
const { msg } = defineProps(['msg'])
const emit = defineEmits(['submit'])
// defineEmits defineProps都是只能在setup中使用的编译器宏，不需要导入，随着setup的处理过程一同被编译掉
// 引入的选项会从setup中提升到模板的作用域
//defineModel v-model 可以在组件上使用以实现双向绑定
// const modelvalue = defineModel({ default: '1111',})
const [modelvalue,modelModifiers] = defineModel({ 
  set(value){
    if(modelModifiers.trim){
      return value.trim()
    }
    return value
  }
})
// modelvalue.value = '    2222222'
watchEffect(()=>{
  console.log('msg',msg)
})  

// defineExpose 使用setup的组件模式时关闭的，通过模板引用或者$parent链获取到的组件的公开示例，
// 不会暴漏任何在setup中声明的绑定 可以通过defineExpose暴露属性
const a = 1 
const b = 2
defineExpose({a,b})
// defineOptions 是 Vue 3.3+ 引入的一个组合式 API，用于在 <script setup> 中定义组件的选项。
// 它提供了一种更简洁和直观的方式来配置组件的选项，而不需要使用传统的选项式 API。
defineOptions({
  name:'sfc---sub',
  // emits: [],
  // props:[],
  inheritAttrs: false,//子组件不在继承父组件的属性
})
// 在 <script setup> 使用 slots 和 attrs 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 $slots 和 $attrs 来访问它们

// defineSlots 这个宏可以用于为 IDE 提供插槽名称和 props 类型检查的类型提示

const attrs = useAttrs()
console.log(attrs,'attrs')



// 顶层await 可以使用await 结果代码会被编译未 async setup()
// const post = await fetch(`/api/post/1`).then((r) => r.json())

{/* <script setup lang="ts" generic="T"> */}

</script>

<script>
// setup 可以和普通的script 一起使用。普通的 <script> 在有这些需要的情况下或许会被使用到：
//1. 声明无法在 <script setup> 中声明的选项 ;setup中可通过 defineOptions(3.3+) 定义
// 2. 声明模块的具名导出
// 3. 运行需要在模块作用域内执行一次的副作用，或创建单例对象
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>
<template>
  <div>

  <slot></slot>
  <h3 >{{ msg }}</h3>
  <input type="text"  v-model.trim="modelvalue">
  <button :id="$attrs.id" @click="emit('submit')">submit</button>
  </div>
</template>
<style scoped>
h3{
  font-style: italic;
}
:slotted(div){
  color:cyan
}
:global(h4){
  color:rgb(93, 97, 89)
}
</style>