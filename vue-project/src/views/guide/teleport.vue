<template>
  <div >
    <button @click="showModal = true">showModal</button>     
    <!-- 传送至body -->
    <Teleport to="body">
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>cusomt header</h3>
        </template>
        <template v-slot="content">
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia minus similique molestiae laudantium reprehenderit aliquid eius quae eveniet? Eius, magni. Facere, ex pariatur rem quas ipsa odio soluta impedit aut?</div>            
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<script setup>
import {ref} from "vue"
import Modal from "./modal.vue"
const showModal = ref(false)

</script>

<style  scoped>
</style>