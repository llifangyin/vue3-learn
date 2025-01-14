import { activeEffect,trackEffect,triggerEffect } from "./effect"

const targetMap = new WeakMap();//不会导致内存泄漏 存放收集的关系
export const createDep = (cleanUp,key)=>{
    const dep = new Map() as any;//创建的收集器还是个map
    dep.cleanUp = cleanUp; 
    dep.name = key ;//自定义的标识映射表给哪个属性服务的 
    return dep
}
export function track(target,key){
    // activeEffect  有说明是在effect中访问的，需要收集依赖
    if(activeEffect){
        // console.log(activeEffect,key,'activeEffect')
        let depsMap = targetMap.get(target)
        if(!depsMap){
            depsMap = new Map()
            targetMap.set(target, depsMap)
        }
        let dep = depsMap.get(key)
        if(!dep){
            dep = new Map()
            depsMap.set(
                key,
                dep =  createDep(()=>
                 depsMap.delete(key),key // 删除属性
                )
            )
        }
        //将当前的effect放入dep（映射表）中，
        // 后续可以根据值的变化触发此dep中存放的effect
        trackEffect(activeEffect,dep);
        console.log(targetMap,'targetMap')
        console.log(activeEffect,dep,'===')
    }
}
    //  使用示例：
    // effect(() => {
    //     app.innerHTML = `name ${state1.name} age ${state1.age}`
    // })
    // effect(() => {
    //     app.innerHTML = `name ${state1.name} `
    // })
    // 收集结果： map
    // {
    //     {name:'xxx',age:18}:{
    //         age:{
    //             effect
    //         },
    //         name:{
    //             effect,efefct
    //         }
    //     }
    // }

    export function trigger(target,key,value,oldValue){
        // console.log(target,key,value,oldValue,'trigger')
        // depMap 依赖收集表
        const depMap = targetMap.get(target)
        if(!depMap){
            return
        }
        let dep = depMap.get(key)
        if(dep){
            // 触发更新
            console.log(dep,'dep')
            triggerEffect(dep)
        }

    }