<template>
  <h3>typesciprt工具类型</h3>
  <h3>MaybeRef</h3>
  <h3>MaybeRefOrGetter</h3>
  <h3>PropType 用于在用运行时 props 声明时给一个 prop 标注更复杂的类型定义</h3>
  <h3>CSSProperties 用于扩展在样式属性绑定上允许的值的类型</h3>
  ...

  <h2>自定义渲染api</h2>
  <h3>createRenderer 创建一个自定义渲染器，通过提供特定节点创建以及更改api</h3>
  
  <h2>编译时标志</h2>
  <h3>_VUE_OPTIONS_API_ 启用禁用api支持</h3>
  <h3>_VUE_PROD_DEVTOOLS_ 生产环境启用开发者工具支持</h3>
  <h3>__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ 生产环境激活不匹配的详细技能广告，</h3>
</template>
<script  >
import { reactive ,nextTick,ref,version,useTemplateRef,onMounted,useCssModule} from 'vue'
import { createRenderer } from '@vue/runtime-core'

// import type { PropType } from 'vue'

// props: {
//     book: {
//       // 提供一个比 `Object` 更具体的类型
//       type: Object as PropType<Book>,
//       required: true
//     }
//   }
// declare module 'vue' {
//   interface CSSProperties {
//     [key: `--${string}`]: string
//   }
// }

// const  { render ,createApp} =  createRenderer({
//   patchProp,
//   insert,
//   remove,
//   createElement
// })
// console.log(render,createApp)
// export  {render,createApp}
</script>
<style scoped>



</style>

