import { ref, computed } from 'vue'
import { defineStore } from 'pinia';

// export const useCounterStore = defineStore('counter',{
//   // state:() => { 
//   //   return {count:0}
//   //  }
//   //  或者
//     state:()=>({count:0}),
//     actions:{
//       increment(){
//         this.count++
//       }
//     }
// })

export const useCounterStore = defineStore('couter',()=>{
  const count = ref(0)
  function increment(){
    count.value++
  }
  return { count,increment}
})

