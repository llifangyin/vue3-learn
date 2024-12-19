<template>
  <div >
    <h1>plugin</h1>
    <div>
      {{ $translate('greetings.hello') }}
    </div>
  </div>
</template>

<script setup>
import {inject} from "vue"
const i18n = inject('i18n')
console.log(i18n.greetings.hello);
</script>

<style  scoped>
</style>