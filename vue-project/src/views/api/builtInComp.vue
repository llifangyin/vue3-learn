<template>
    <h2>内置组件</h2>
    <h3>Transition 为单个组件提供动画过度效果</h3>
    <Transition  mode='out-in'  @after-enter="onTransitionComplete">
        <div v-if="ok">toggled content</div>
    </Transition>
    <h3>TransitionGroup 为列表多个元素或组件提供过度效果</h3>
    <TransitionGroup tag="ul" name="slide">
        <li v-for="item in items" :key="item.id">
            {{ item.text }}
        </li>
    </TransitionGroup>
    <h3>keepAlive 缓存包裹在其中的动态切换组件，会缓存组件实例，而不会销毁他们</h3>
    <KeepAlive :max="10"  include="a,b">
    <!-- <component :is="view"></component> -->
    </KeepAlive>
    <h3>Teleport 将插槽内容渲染到dom的另一个位置 to= id class 属性选择器;defer稍后延迟(3.5+)</h3>
    <div id="test">
        <h1>test</h1>
    </div>
    <teleport to='#test'  defer>
        teleport
    </teleport>
    <h3>Suspense 用于协调对组件树中嵌套的异步依赖的处理；它可以让我们在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待是渲染一个加载状态</h3>
    <div>
        supense接受两个插槽，#default #fallback
    </div>
    <Suspense>
    <!-- 具有深层异步依赖的组件 -->
        suspenseContent

    <!-- 在 #fallback 插槽中显示 “正在加载中” -->
    <template #fallback>
        Loading...
    </template>
    </Suspense>
    <h2>内置特殊元素</h2>
    <h3>component 渲染动态组件的组件 is</h3>
    <component :is="compSub"> </component>
    <component :is="'span'">spancontent</component>
    <h3>slot 插槽内容出口</h3>
    <h3>template 内置指令不在dom中渲染时，可以作为占位符使用</h3>
    <h2> 内置特殊attributes</h2>
    <h3>key 作为vue虚拟dom算法提示，比较新旧节点列表时识别vnode</h3>
    <h3>ref 用于注册模板引用</h3>
    <p ref="p">hello</p>
    <h3>is 用于动态绑定组件；用于绑定原生元素，(使用vue组件替换原生元素)</h3>
    <table>
    <tr is="vue:my-row-component"></tr>
    </table>
</template>


<script setup>
import {
    ref, h, toRefs, toRef, computed,
    useAttrs, useSlots,useTemplateRef
} from 'vue';
import  compSub from './compSub.vue'

const ok = ref(true)
// setTimeout(() => {
//     ok.value = true
// }, 1000);
// const onTransitionComplete = () => {
//     console.log('transition complete')
// }
const items = ref([
    { id: 1, text: 'item1' },
    { id: 2, text: 'item2' },
    { id: 3, text: 'item3' }
])
// keepAlive 切换组件时。activated和deactivated钩子函数会被调用，缓存了组件实例

const p = useTemplateRef('p')
</script>
<style></style>