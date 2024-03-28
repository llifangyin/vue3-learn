<template>
  <h4>
    $attrs对象包括了除了props和emit之外的所有attr
  </h4>
  <div class="about">
    <h1>attr</h1>
    <AttrChild class="parentClass" ></AttrChild>

</div>
</template>
<script  setup>
import AttrChild from './AttrChild.vue'

</script>
