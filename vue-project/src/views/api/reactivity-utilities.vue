import { shallowRef } from 'vue';
<template>
  <div>
    <h3>isRef: 检查某个值是否是ref</h3>
    <h3>unref: isRef(val)?val.value:val的语法糖</h3>
    <h3>toRef:将值、refs或getters规范化为refs(3.3+)；可以基于响应式对象上的一个属性，创建一个对应的ref。这样创建的ref与其源属性保持同步；</h3>
    <h3>toValue: 将值、refs 或getters规范化为值，(3.3+)</h3>
    <h3>toRefs: 将一个响应式对象转为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的ref。每个单独的ref都是使用toRef创建的</h3>
    <h3>isProxy: 检查一个对象是否由reactive readonly shallowRef shallowReadonly创建的</h3>
    <h3>isReactive: 检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代</h3>
    <h3>isReadonly</h3>
   </div>
</template>
<script setup>
import { ref ,h,toRefs,toRef,computed,
  reactive,watchEffect,readonly, watchPostEffect, watchSyncEffect ,
  isRef,unref,toValue
} from 'vue';
const count = ref(0)
let count1 = 1
// console.log(isRef(count),isRef(count1)) // true false
// count.value ++
// count1 ++;
// console.log(unref(count),unref(count1)) // 0 0

const state = reactive({foo:1,bar:2})
const fooRef = toRef(state,'foo') //创建新的ref 与state.foo保持同步响应式
const fooRef1 = ref(state.foo) // 相当于ref(1) 没有与state.foo保持同步
state.foo ++
// console.log(state.foo,fooRef.value) // 2 2
fooRef.value ++
// console.log(state.foo,fooRef.value) // 3 3
// console.log(fooRef1.value,'fooRef1') // 1

const state2 = toRef(1) //3.3+版本才会支持
const state3 = toRef(()=>2)
// console.log(state2.value,state3.value,'toRef') //

// console.log(toValue(ref(1)),'toValue') // 1

const state4 = reactive({foo:1,bar:2})// Proxy {foo: 1, bar: 3}
const state4AsRefs = toRefs(state4) //  {foo: RefImpl, bar: RefImpl}
state4.foo ++
console.log(state4AsRefs.foo.value,'state4AsRefs.foo') // 1 2
state4AsRefs.bar.value ++
console.log(state4.bar,'state4.bar') //3

// 解构或展开返回的对象，而不会失去响应式
const {foo,bar} = toRefs(state4)
foo.value ++
console.log(state4.foo,'state4.foo') // 3
console.log(state4AsRefs.foo.value,'state4AsRefs.foo') // 3
</script>
<style>

</style>
