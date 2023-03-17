<template>
  <div class="childClass">
    child 
    {{ $attrs }}
    <!-- $attrs对象包括了除了props和emit之外的所有attr -->
  </div>
</template>
<script  setup>
import { onMounted ,ref} from 'vue'
onMounted(()=>{
})
</script>
