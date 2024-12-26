<template>
   <!-- <button @click="count++">{{ count }}</button> -->
  setup是组件中使用组合式api的入口

  toRef和toRefs的区别
  toRef:接受一个响应式对象和对象的key，返回一个ref对象
  toRefs:接受一个响应式对象，返回一个对象，对象的每个属性都是一个ref对象
</template>
<script>
import { ref ,toRefs,toRef} from 'vue';
export default {
  props:{
    title:String,
    title1:String
  },
  setup(props,context) {
    const count = ref(0);
    // console.log(props,'props')

    const  { title } = toRefs(props)
    const title1 = toRef(props,'title1')

    // console.log(title.value,'title')
    // console.log(title1.value,'title1')
    // console.log(context,'context')
    // console.log(context.attrs,'context.attrs')
    // console.log(context.slots,'context.slots')
    // console.log(context.emit,'context.emit')
    // console.log(context.expose,'context.expose')
    const { expose } = context;
    // expose('count', count);
    return { count };
  },
  mounted() {
    // console.log('mounted',this.count);
  },
};
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>
