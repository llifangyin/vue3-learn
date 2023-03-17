<template>
  <div class="about">
    <h1>内置组件</h1>
    <h3>vue提供了两个内置组件 Transtion 和 transition-group</h3>
    <button @click="show = !show">Toogle</button>
    <Transition  mode="out-in">
      <p v-if="show">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro necessitatibus nostrum qui consectetur. Saepe amet nulla sunt. Inventore voluptas reprehenderit, excepturi quibusdam dolorum, odit sunt tenetur et praesentium rem iste.
      </p>
    </Transition>
    
    <Transition mode="out-in"><span v-if="show">jack</span></Transition>
    <Transition name="jack">
      <p v-if="show">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error porro, temporibus cupiditate ullam, sed nisi fugiat aliquid dolor iste esse eos natus! Vel libero a blanditiis quae, nulla doloremque iste?
      </p>
    </Transition>
      <!-- js钩子 -->
      <Transition
        @before-enter="fn"
        @enter="fn"
        @after-enter="fn"
      @enter-cancelled="fn"
      @before-leave="fn"
      @leave="fn"
      @after-leave="fn"
      @leave-cancelled="fn"
      >
        <p v-if="show">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error porro, temporibus cupiditate ullam, sed nisi fugiat aliquid dolor iste esse eos natus! Vel libero a blanditiis quae, nulla doloremque iste?
      </p>
      </Transition>
      <!-- 相同 -->
      <!-- 都支持基本的props,css过度class,js钩子监听器 -->
      <!-- 区别 -->
      <!--
        不会渲染一个元素,可传入tag指定一个
        过度模式不可用
        每个元素唯一的key
        class会加载里欸包元素上而不是容器上
        -->
      <button @click="add">add</button>
      <transition-group name="list" tag="ul">
        <li v-for="(item, i) in list" :key="i">
        {{ item }}</li>
      </transition-group>
</div>
</template>
<script  setup>
import { ref } from 'vue'
const show = ref(true);
function fn(params) {
  console.log(1111);
}
const list = ref([])
list.value = [1,2,3,4,5]
function add(){
  list.value.push(Math.floor(Math.random()*100))
}
</script>

<style>
/* 当一个Transition组件中的元素插入或移除时,vue会
1.检测是否采用了css动画,该动画会添加或移除
2.是否有js钩子函数,调用
3.如果都没有,dom插入,删除在浏览器的下一个动画帧执行
 */


/* 6个进入离开的class */
/* .v-enter-from
.v-enter-active
.v-enter-to
.v-leave-from
.v-leave-to
.v-leave-active */

/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* 给calss命令 */
/* name='jack' */
.jack-enter-active,
.jack-leave-active {
  transition: opacity 0.5s ease;
}

.jack-enter-from,
.jack-leave-to {
  opacity: 0;
}



.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>