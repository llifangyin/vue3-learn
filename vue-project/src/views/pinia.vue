<template>
  <div class="about">
    <h1>pinia</h1>
    <p>
      counter count:{{ counter.count }}
    </p>
    <h3>{{ todos.filter }}</h3>
    <p v-for="todo in todos.todos">
      {{ todo.text }} {{ todo.isFinished }}
    </p>

    <h2>store.user : {{ user.name }} {{ user.age }}</h2>

    <h2>getterStore : {{ gs.doubleNum }}  {{ gs.doublePlusOne }} {{ gs.getSum(2) }}  {{ gs.getOtherStore }}</h2>

    <h3>acions :{{ useActions.count }} </h3>
    <button  @click="useActions.decrement()">decrement</button>
  </div>
</template>
<script  setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import { useTodos } from '@/stores/todo'
import { useStore } from '@/stores/state'
import { usegetterStore } from '@/stores/getter'
import { useActionsStore } from '@/stores/actions'

const counter = useCounterStore();
// counter.count++;
// counter.$patch({count:counter.count+1})
// counter.increment()
const todos = useTodos()
// todos.addTodo('test1',true)
// todos.addTodo('test2',false)
// todos.$patch({filter:'no'})

const {filter,nextId,addTodo} = todos
// acions也被绑定到了store上
// console.log(filter,nextId,addTodo);

// storeToRefs为了从store中提取的属性时保持其响应性,只调store不用action时非常有用
// let {count}  = storeToRefs(counter)

const store = useStore()

const {user} = store
user.name='lisi'
user.age= 18

// $reset重置初始值  无效？
store.$reset()

// $patch 更改state   无效？
store.$patch({
  user:{name:'wagwu',age:33}
})

// getters
const gs = usegetterStore()

// actions
const useActions = useActionsStore()
useActions.decrement()
</script>
<style>

</style>
