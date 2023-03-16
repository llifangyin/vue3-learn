<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{ state.count }}</div>
    <button @click="increment">{{state.count }}</button>
    <h1>{{ obj.nested.count }}</h1>
    <h3>
      ref在顶层属性访问会自动解包不需要.value
    </h3>
    <h3>
      {{ obj1.foo  }}
    </h3>
    <h3>
      <!-- 解析不出来 -->
      {{ foo + 1 }}
    </h3>
  </div>
</template>
<script  setup>

import { reactive ,nextTick,ref} from 'vue'

const state = reactive({
  count:0
})
function increment(params) {
  state.count++
  state.count++
  mutateDeeply()
  nextTick(()=>{
    console.log('state.count',state.count);
  })
}

// reactive 仅对对象 数组有效 ； 不可替换响应式对象；
//  对属性解构赋值的变量会失去响应式
const raw = {}
const proxy = reactive(raw)
console.log(proxy == reactive(raw));
console.log(proxy == reactive(proxy));
let s = reactive({count:0})
s = reactive({count:1})
console.log(s,s.count);

let c = s.count
c++
console.log(s,s.count);
let {count} = state
count++
console.log(s,s.count);

const obj = reactive({
  nested:{count:0},
  arr:['foo','bar']
})
function mutateDeeply(){
  obj.nested.count ++
  obj.arr.push('baz')
}


// ref 定义任何值类型的响应式变量
// 封装一个带value属性的RefImpl对象
const count1 = ref(0)
console.log(count1,count1.value); 
// 当值为对象类型是，会用reactive转换它的value


const obj1 = {
  foo:ref(1),
  bar:ref(2)
}
// ref在顶层访问对象中的解包
obj1.foo.value++
const {foo,bar} = obj1
console.log(foo.value,bar.value);

// ref在响应式对象中的解包
const c2 = ref(0)
const s2 = reactive({count:c2})
console.log(s2);
s2.count = 1
console.log(c2.value);

const books = reactive([ref('vue3')])
console.log(books[0].value);
// ref在数组 map对象中作为值不会解包
const map = reactive(new Map([['count',ref(0)]]))
console.log(map);
console.log(map.get('count'));
console.log(map.get('count').value);
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
