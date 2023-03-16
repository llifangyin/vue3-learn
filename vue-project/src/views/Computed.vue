<template>
  <div class="about">
    <h1>This is an computed page</h1>
    <div>
      <h1>has books?</h1>
      <span>{{ pbMsg }}</span>
      <h4>{{ fullName }}</h4>
    </div>
  </div>
</template>
<script  setup>

import { reactive ,computed,ref} from 'vue'
const author = reactive({
  name:'john',
  books:['vue','angular','react']
})
const pbMsg = computed(()=>{
  return author.books.length>0?'yes':"no"
})
// 返回一个ComputedRefImpl 对象，跟一般的ref类似，会自动解包
console.log(pbMsg);
// 计算与方法对比
// 计算属性的值会基于其响应式依赖被缓存，响应式以来不更新不会重新计算
// 方法调用会在渲染时再次执行
// 可写计算属性 getter setter
const firstName = ref('john')
const lastName = ref('Doe')
let  fullName = computed({
  get(){
    return firstName.value + '' + lastName.value
  },
  set(newVal){
    [firstName.value,lastName.value] = newVal.split(' ')
  }
})
fullName.value = "cobe bryant"

</script>
<style>

</style>
