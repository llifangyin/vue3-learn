<template>
  <div>
    <h3>useAttrs 从setup上下文中返回attrs对象，包含当前组件的透传attributes，用于setup中的，因为script setup中无法获取上下文</h3>
    <h3>useSlots 上下文返回的slots对象，包含父组件传递的插槽。这些插槽为可调用的函数，返回dom虚拟节点；ts中使用defineSlots</h3>
    <h3>useModel 驱动defineModel的底层辅助函数。3.5+</h3>
    <h3>useTemplateRef 返回一个浅层ref,其值将与模板汇总的具有匹配ref attrubute的元素或组件同步</h3>
    <input type="text" ref="input" :id='id' />
    <h3>useId 用于为无障碍属性或者表单生产每个应用内唯一id</h3>
    <!-- <input type="text" :value="title" placeholder="Title" /> -->
   </div>
</template>


<script setup>
import { ref ,h,toRefs,toRef,computed,
useTemplateRef  ,onMounted,useId

} from 'vue';
// useAttrs 选项是setup(props,context) 
  const inputRef = useTemplateRef('input')
  const id = useId()
  onMounted(() => {
    console.log(inputRef.value)
    console.log(id)
  })

</script>
<!-- <script>
  export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
</script> -->
<style>

</style>
