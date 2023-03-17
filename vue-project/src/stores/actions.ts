import { defineStore } from 'pinia'

export const useActionsStore = defineStore('actionsStore',{
    state:()=>({
        count:10
    }),
    getters:{
        doubleCount:(state)=>{
            return state.count *2
        }
    },
    actions:{
        // action可以通过this访问到整个store实例
        // increment:(state) => { state.count++ }, 
        // 异步调用:await fn()
        decrement(){
            this.count --
        },
        // async requset(name){
        //     return new Promise(resolve,rejects){
        //         if(name){
        //             const res = name + 'successful'
        //             resolve(res)
        //         }else{
        //             rejects('error')
        //         }
        //     }
        // }

    }

})