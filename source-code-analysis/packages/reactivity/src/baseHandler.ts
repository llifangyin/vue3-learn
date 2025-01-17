import { isObject } from "@vue/shared"
import { track,trigger } from "./reactiveEffect"
import { reactive } from "./reactive"
import { ReactiveFlags } from "./constant"

//  proxy 搭配reflect使用, 
// Reflect是一个内置对象，它提供拦截 JavaScript 操作的方法。

export const mutableHandlers = {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        // console.log(receiver,'receiver')
        // 依赖收集
        track(target,key)//收集属性，和effect关联在一起

        let res = Reflect.get(target,key,receiver)
        if(isObject(res)){ // 如果是对象，递归代理
            return reactive(res)
        }

        // 当取值的时候，应该让响应式属性和effect映射起来
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        // 触发更新
        // 修改 找到属性，让对应的effect重新执行 
        // 触发更新 todo
        let oldValue = target[key]
        let result = Reflect.set(target,key,value,receiver)
        if(oldValue !== value){
            // 页面更新
            trigger(target,key,value,oldValue)
        }
        return result
        // return Reflect.set(target,key,value,receiver)
    }
}