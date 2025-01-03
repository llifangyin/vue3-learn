<template>
    <div>
        subContent
        <h3>
            <slot />
        </h3>
        <h3>
            <slot name="namedSlot"></slot>
        </h3>

    </div>
  </template>
  
  
  <script setup>
  import { ref ,h,toRefs,toRef,computed,
 useAttrs,useSlots
  } from 'vue';
const attrs = useAttrs()
console.log(attrs,'attrs')
const slot = useSlots()
console.log(slot,'slot')
console.log(slot.default(),'slot.default')
// useSlots：用于在组合式 API 中访问插槽，返回一个包含父组件传递的插槽的对象
// 通过使用 useSlots，你可以在组合式 API 中更方便地访问和渲染插槽内容，提高代码的可读性和可维护性。
  </script>

  <style>
  
  </style>
  