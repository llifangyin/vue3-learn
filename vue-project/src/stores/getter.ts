import { defineStore } from 'pinia'
import { useTodos } from './todo'

export  const usegetterStore = defineStore('main',{
    state:()=> ({
        num:2
    }),
    getters:{
        doubleNum:(state)=>{return state.num * 2},
        // 大多时候，getter仅依赖state, 也可自定义计算getter this访问到getter
        doublePlusOne():number{
            return this.doubleNum +1
        },
        // 向getter传递参数，需要getter返回一个函数,此时，getter不在被缓存
        getSum(state){
            return (num:number)=> state.num + num
        },
        getOtherStore(state){
            const todos = useTodos()
            return todos.filter + '- finished'
        }
       

    }
})
