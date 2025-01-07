<template>
  <div>
    <h3>onMounted 注册一个回调函数，在组件挂载完成后执行</h3>
    <h3>onUpdated组件因响应式状态变更而更新后的调用</h3>
    <h3>onUnmounted组件实例被卸载之后调用</h3>
    <h3>onBeforeMount 组件挂在前调用</h3>
    <h3>onBeforeUpdate 在组件即将因为响应式状态改变而更新dom树之前调用</h3>
    <h3>onBeforeUnmout 在组件实例被卸载之前调用</h3>
    <h3> onErrerCaptured在捕获了后代组件传递的错误时调用</h3>
    <h3>onRenderTracked onRenderTriggered 跟踪依赖 触发渲染时调用</h3>
    <h3> onActivated onDeactivated 若组件时keepalive缓存树的一部分，当组件被插入 移除到dom中时调用</h3>
    <h3>onServerPrefetch 组件示例在服务器上被渲染时调用</h3>
    
   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,
  reactive,watchEffect,onMounted
} from 'vue';
//onMounted
//组件在一下情况视为已挂载 其所有同步子组件都已被挂载；其自身DOM树已经创建完并插入了父容器中
// 这个钩子通常执行需要访问组件所渲染的dom树相关的副作用，
// onUpdated 会在任意的dom更新后调用。可能由不同状态百年更导致的，多个状态变更可以在同一个渲染周期中批量执行的（考虑到性能因素）。特定状态更新后执行使用nextTick
// onUnmounted  以下情况视为已卸载： 所有子组件已被卸载；所有相关的响应式作用都停止（computed watch）
// 可以在这个钩子中手动i清理一些副作用。如计时器、dom监听等

// onBeforeMount 已经完成了响应式状态的设置，还未创建DOM节点。他即将首次执行DOM渲染
// onActivated keepalive组件,插入dom树时调用

// 对比
// onupdated  响应式变化dom更新后调用;(dom更新后执行的创建 更新属性,执行动画等)
// onactivated keepalive包裹时,组件插入到dom中时调用(组件激活时.重新获取数据 回复回滚位等)
</script>
<style>

</style>
