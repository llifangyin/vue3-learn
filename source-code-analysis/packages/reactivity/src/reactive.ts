import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandler'
import { ReactiveFlags } from './constant'

// 用于记录代理后的结果，可以复用
const reactiveMap = new WeakMap()
// ref使用
export function toReactive(value){
    return isObject(value)?reactive(value):value
}
export function reactive (target) {
    return createReactiveObject(target)
}
function createReactiveObject(target){
    // 响应式对象必须是对象
    if(!isObject(target)){
        return
    }
    // 如果有缓存直接返回
    if(reactiveMap.has(target)){
        return reactiveMap.get(target)
    }
    // 如果是响应式对象直接返回
    if(target[ReactiveFlags.IS_REACTIVE]){
        // 取属性触发get方法 被代理过的对象会有get这个属性
        return target
    }
    // new proxy代理
    // Proxy的参数 1.目标对象 2.处理对象
    // 2处理对象的参数 1.目标对象 2.属性 3.代理对象
    let proxy = new Proxy(target,mutableHandlers)
    // console.log(proxy,'proxy')
    reactiveMap.set(target,proxy)// 根据对象缓存代理对象
    return proxy
}


// 使用weakMap缓存代理对象，避免重复代理
// WeakMap的键keys是弱引用的，当键所引用的对象在其他地方不在被引用时，垃圾回收机制可以自动回收这些对象
// Map的键keys是强引用的，当键所引用的对象在其他地方不在被引用时，垃圾回收机制不会自动回收这些对象
// WeakMap的keys只能为对象 ，Map可以使用任意类型的键
// WeakMap适用于缓存机制，