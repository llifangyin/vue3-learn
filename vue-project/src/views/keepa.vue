<template>
  <div >
     keepa-count:{{ count }}
     <button @click="add">add</button>
  </div>
</template>

<script setup>
import {ref} from "vue"
const count = ref(0)
function add(params) {
        count.value ++
}

</script>

<style lang="scss" scoped>
</style>