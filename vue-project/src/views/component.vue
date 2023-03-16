<template>
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

// setup 中庸defineProps宏声明参数

</script>