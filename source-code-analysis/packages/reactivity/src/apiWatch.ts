import { isFunction, isObject } from "@vue/shared"
import { effect, ReactiveEffect } from "./effect"
import { isReactive } from "./reactive"
import { isRef } from "./ref"
import { watchEffect } from 'vue';
export function watch(source,cb,options={} as any){
    //  source getter
    // cb  scheduler
    // watchEffect  也是基于doWatch实现
    return doWatch(source,cb,options)
}
function traverse(source,depth,currentDepth = 0,seen = new Set()){
    // depth 递归方法 
    if(!isObject(source)){
        // console.log(source,'source1');
        return source
    }
    if(depth){ // 
        if( currentDepth >= depth){
            // console.log(source,'source2');
            return source
        }
        currentDepth++ // 递归深度
    }
    if(seen.has(source)){
        // console.log(source,'source3');
        return source
    }
    for(let key in source){
        traverse(source[key],depth,currentDepth,seen)
    }
    // console.log(source,'source4');
    
    return source // 遍历触发每个属性的getter
  

}
export function watchEffect(getter,options = {} as any){
    return doWatch(getter,null,options)
}
function doWatch(source,cb,{deep,immediate}){

    const reactiveGetter = (source) => traverse(source,deep == false? 1:undefined)
    // 产生一个给reactiveEffect使用的getter，需要对这个对象进行取值操作
    // 会过来当前的reactiveEffect
    let getter
    if(isReactive(source)){
         getter = () => reactiveGetter(source)
    }else if(isRef(source)){
        getter = () => {
            return source.value
        }
    }else if(isFunction(source)){
        getter = source
    }
    
    let oldValue ;

    let clean;
    const onCleanUp = (fn) => {
        // 清除副作用
        clean = () => {
            fn()
            clean = undefined
        }
    }

    const job = () => {
        if(cb){
            const newValue =   effect.run()
            if(clean){
                clean() // 执行回调前 先调用上一次的清理操作
            }

            cb(newValue,oldValue,onCleanUp)
            oldValue = newValue
        }else{
            effect.run()
        }
    }
    const effect = new ReactiveEffect(getter,job)

    if(cb){
        if(immediate){
            job()
        }else{
            oldValue = effect.run()
        }
    }else{
        // watchEffect
        effect.run()
    }
    const unwatch = () => {
        effect.stop()   
    }
    return unwatch
}


