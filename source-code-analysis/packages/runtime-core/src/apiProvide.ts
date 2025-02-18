
import { currentInstance } from './component'
export function provide(key,value){

    if(!currentInstance){
        console.warn(`provide() can only be used inside setup().`)
        return
    }
    // 获取父组件的provides/
    const parentProvide = currentInstance.parent?.provides
    let  provides = currentInstance.provides

    // 如果组组件新增了provide copy一份新的
    if(parentProvide === provides){
        provides = currentInstance.provides = Object.create(null)
    }
    provides[key] = value


}

export function inject(key,defaultValue){
    if(!currentInstance){
        console.warn(`inject() can only be used inside setup().`)
        return 
    }
    const  provides = currentInstance.parent?.provides
    if(provides && key in provides){
        return provides[key]
    }else {
        return defaultValue
    }
}