<template>

<h4>
1 全局注册的组件仍会打包，项目的依赖关系不明确 <br>
2  script setup单文件组件不需要注册直接使用<br>

3  setup 中用defineProps宏声明参数<br>
4  defineEmits 宏声明抛出的事件，返回一个等同于$emit方法的emit函数<br>

 5 单向数据流 <br>
 修改props的情况 <br>
一、 拿到props作为初始值 const title = ref(props.title) <br>
 二、进一步对props做转换，最好是定义一个计算属性 const normal = computed(()=>props.title.toUpperCase())
</h4>
    <div :style="{fontSize:fontSize+'em'}">
        <BlogPost 
         v-for="post in posts"
        :key="post.id" 
        :title="post.title"
        @enlarge-text = 'fontSize+=0.1'
        >{{ post.id }}</BlogPost>

        <component :is="BlogPost" title="isComponent"></component>

        <CustomInput v-model="searchText" />
    </div>

</template>
<script setup>
import { ref } from 'vue'
import BlogPost from './BlogPost.vue'
import CustomInput from './CustomInput.vue'

// const content = ref('this is content')
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
const fontSize = ref(1)

const searchText = ref('')
// 全局注册的组件仍会打包，项目的依赖关系不明确
// script setup单文件组件不需要注册直接使用

// setup 中用defineProps宏声明参数

</script>