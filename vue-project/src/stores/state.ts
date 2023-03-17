import { defineStore } from 'pinia'

// store被定义为一个返回初始状态的函数 
// 兼容ts
interface State {
    userList:UserInfo[],
    user:UserInfo | null
}
export const  useStore = defineStore('storeId',{
    state: ():State => { 
        return{
            // userList:[] as UserInfo[],
            // user:null as UserInfo | null
            userList:[],
            user:{name:'zhangsan',age:111}
        }
     }
})

interface UserInfo{
    name:string,
    age:number
}

