# 数据表

## 异步组件
异步组件是为另一个组件提供的包装器，可以懒加载，

## 编译器宏
实际上是更巧妙的字符串替换形式，defineProps defineEmits defineExpose

## 组合式函数
一种vue的常见用法，是一种使用框架的组合式api的方式
+ 是个函数
+ 用于封装和重用有状态的逻辑
+ 已use开头
+ 再setup函数中调用
+ 组合式函数返回一个普通对象，而不是响应式对象。
```js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```

## 组合式api 
使用script setup或setup函数

## 作用
 **响应式作用**：
 响应式作用是vue响应式系统的一部分，它指的是跟踪函数的依赖关系，并在他们的值发生变化时重新运行该函数的过程/
 watchEffect时最直接的创建作用的方式 （watch  computed


**副作用：** side effet
用于描述超出其局部作用域的操作或函数
当描述一个函数有副作用时，意味着改函数除了返回一个值外，还执行了函数外可以观察到的操作，更新了状态中的值，或者触发了网络请求
该术语通常描述渲染或计算属性。 最佳实践渲染不应该有副作用。同样，计算属性的getter函数不应该有副作用。

函数式编程中，纯函数是指其输出仅依赖于输入参数，没有任何副作用。
而副作用是指函数执行过程中对外部状态的修改或者对外部世界的影响。
这个概念被引入到响应式报错和框架设计中，用于明确区分哪些仅仅是计算的数据变化的逻辑（作用）和那些影响外部状态的操作；
vue中的副作用： 类似于函数式编程的副作用操作，涉及到对外部状态的修改或外部行为的触发。
副作用并不是负面的影响，
区分：纯粹的计算（作用） 涉及到外部状态或行为  （副作用）
利用生命周期钩子onmoutned onunmounted 管理副作用，确保再加载和卸载时清理外部资源
使用组合式api, watcheffect  watch computed创建作用，需要时处理副作用