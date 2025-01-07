<script  setup>
import { reactive ,nextTick,ref,version,useTemplateRef,onMounted,useCssModule} from 'vue'
import  SfcSub from './sfcSub.vue'
//<script setup> 中的代码会在每次组件实例被创建的时候执行
// 本地的自定义指令不需要显式注册
const vMyDirective = {
  beforeMount:(el,binding,vnode,prevVnode)=>{
    // binding:{
    // value : baz
    // oldValue   
    // arg:   'foo'
    // modifiers:修饰符对象 {bar:true}
    // instance  
    // dir指令的定义对象
// }
    // console.log('beforeMount',el,binding,vnode,prevVnode)
    el.innerHTML = el.innerHTML + binding.value
  },
}
const hello = ref(' !!!')
const msg = 'sub message'
// defineModel v-model 可以在组件上使用以实现双向绑定
const modelvalue = ref('sub value')
const handleClick = ()=>{
  console.log(modelvalue.value,'modelvalue')
}
// const sfc = useTemplateRef('sfc')
const sfc = ref(null)
onMounted(()=>{
  console.log(sfc.value,'sfc')
})
defineOptions({
  inheritAttrs: false,
  customOptions: {
    name:'test',
    age:18
  }
})
const cssmodule = useCssModule()
console.log(cssmodule,'cssmodule')

const moduleA = useCssModule('moduleA')
console.log(moduleA,'moduleA')

const theme = ref({
  color:'red'
})
</script>
<template>
  <h2>语法定义</h2>
  <h2>script setup</h2>
  <h3>defineProps</h3>
  <h3>defineEmits</h3>
  <h3>defineModel 声明一个父组件和子组件都可以v-model绑定的prop</h3>
  <h3>defineOptions 声明组件选项例如inheritAttrs </h3>
  <h3>defineExpose 暴漏本组件属性</h3>
  <h3>defineSlots 类型提示</h3>
  <h3>useAttrs useSlots</h3>
  <h3>与script一起使用</h3>
  <h3>顶层await </h3>
  <h2>CSS功能</h2>
  <h3>scoped css</h3>
  <h4>使用scoped 子元素的根元素会同时被父组件和子组件的作用影响</h4>
  <h4>:deep()伪类 深度选择器 ,例如可以影响到子组件</h4>
  <h4>:slotted(div) 插槽选择器</h4>
  <h4>:global(div)全局选择器 不用另起一个style 跳出scope :global(h4) </h4>
  
  <h3>css modules : 使用：$style.xxx  暴漏style module</h3>
  <div :class="$style.title">css module</div>
  <div :class="moduleA.title">自定义module名称</div>
  <h4>通过useCssModule使用</h4>
  <h1 v-my-directive="hello">hello vue</h1>
  <div class="customClass wraper">
    <sfc-sub  :id="1212"  ref="sfc" @submit ='handleClick' v-model="modelvalue" :msg="msg"><div>slotContent</div></sfc-sub>
  </div>
  <h3>css v-bind('xxx')</h3>
  <div class="customClass">v-bind css</div>
  

</template>
<style scoped>
h3{
  color:#333
}
.wraper :deep(h3){
  color:blue
}

.customClass{
  color:v-bind('theme.color')
}
</style>

<style module>
.title{
  color: #000;
  font-size: 24px;
  font-weight: bold;
}
</style>
<style module="moduleA">
.title{
  color: rgb(96, 55, 185);
  font-size: 24px;
  font-weight: bold;
}

</style>