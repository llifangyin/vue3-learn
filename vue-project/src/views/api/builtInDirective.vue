<template>
     <h2>指令</h2>   
     <h3>v-text: 更新textContent </h3>
     <div>
        <span v-text="msg"></span>
        <span>{{ msg }}</span>
    </div>

     <h3>v-html: 作为普通html插入,scoped样式不会作用于html里的内容 </h3>
     <h3>v-show display none</h3>
    <h3>v-if: 会删除节点 </h3>
    <!-- <template v-for="todo in todos">
        <li v-if="!todo.isComplete">
            {{ todo.name }}
        </li>
        </template> -->
    <h3>v-on : 给元素绑定事件监听器 缩写 @ ;参数event 修饰符：stop prevent capture self once lfet right middle passive</h3>
    <h3>v-bind: 动态绑定属性 缩写: 参数与值相同时可以省略（3.4+）  修饰符.camel .prop .attr</h3>
    <svg :view-box.camel="viewBox"></svg>
    <div :someProperty.prop="someObject"></div>
    <!-- 等同于 -->
    <div .someProperty="someObject"></div>
    <h3>v-model 表单输入元素或组件上创建双向绑定 ； 修饰符 .lazy(监听change而不是input) .number .trim(移出两端空格)</h3>
    <h3>v-slot: 声明具名插槽或期望接收props的作用域插槽</h3>
    <!-- 接收 prop 的具名插槽 -->
    <!-- <InfiniteScroll>
    <template v-slot:item="slotProps">
        <div class="item">
        {{ slotProps.item.text }}
        </div>
    </template>
    </InfiniteScroll> -->

    <!-- 接收 prop 的默认插槽，并解构 -->
     <!--<Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
    </Mouse> -->
    <h3>v-pre 跳过该元素下的编译</h3>
    <span v-pre>{{ this will not be compiled }}</span>
    <h3>v-once 进渲染一次，并跳过以后的更新</h3>
    <ul>
        <li v-for="todo in todos" v-once>
            {{ todo.name }}
        </li>
    </ul>
    <h3> v-memo 缓存应该模板的子树。(3.2+)</h3>
    <ul>
        <li v-for="todo in todos" v-memo="{ name: todos[0].name=== 'vue' }">
            {{ todo.name }}
        </li>
    </ul>
    <h3>v-cloak 用于隐藏尚未编译的dom模板</h3>
    <div v-cloak>
        {{ msg }}
    </div>
</template>


<script setup>
import {
    ref, h, toRefs, toRef, computed,
    useAttrs, useSlots
} from 'vue';
const msg = ref('hello');
const todos = ref([
    { name: 'vue', isComplete: false },
    { name: 'react', isComplete: true },
    { name: 'angular', isComplete: false }
])
//  v-if比v-for的优先级高 同时使用，v-if条件无法访问到v-for作用域内定义的变量别名
    // v-on:click="handle('ok', $event)"
    // camel  将短横线命名转换为驼峰命名
    setTimeout(() => {
            // todos.value.push({ name: 'jquery', isComplete: false })
            todos.value[1].name = 'jquery' //v-momo跳过更新
            //  v-memo="{ name: todos[0].name=== 'vue' }"
            // 如果数组里的每个值都与最后一次的渲染相同，那么整个子树的更新将被跳过  
            // v-memo 仅用于性能至上场景中的微小优
            // 当搭配 v-for 使用 v-memo，确保两者都绑定在同一个元素上。v-memo 不能用在 v-for 内部
    }, 1000);
    const ok = ref(true)
</script>
<style>
[v-cloak] {
  display: none;
}
</style>