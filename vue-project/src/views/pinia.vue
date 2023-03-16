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
  </div>
</template>
<script  setup>
import { useCounterStore } from '@/stores/counter'
import { useTodos } from '@/stores/todo'

const counter = useCounterStore();
// counter.count++;
// counter.$patch({count:counter.count+1})
// counter.increment()
const todos = useTodos()
todos.addTodo('test1',true)
todos.addTodo('test2',false)
todos.$patch({filter:'no'})
</script>
<style>

</style>
