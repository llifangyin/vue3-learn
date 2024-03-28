
<template>
    <div>
        <h4>{{ title }}     {{ normal }}</h4>    
        <button @click="$emit('enlarge-text')">Enlarge text</button>
        <h4>
            <slot />
            {{ normal }}
        </h4>
    </div>
</template>
<script setup>
// defineProps事故湖北在setup中可使用的编译宏命令，声明的props会自动暴漏给模板
import { ref, computed }from 'vue'
// defineProps(['title'])
const props = defineProps({
    title:String
})
const emit = defineEmits(['enlarge-text'])
emit('enlarge-text')
// defineEmits 宏声明抛出的事件，返回一个等同于$emit方法的emit函数

// 单向数据流
// 修改props的情况
//1、 拿到props作为初始值
const title = ref(props.title)
// 2、进一步对props做转换，最好是定义一个计算属性
const normal = computed(()=>props.title.toUpperCase())
console.log(normal.value);

</script>