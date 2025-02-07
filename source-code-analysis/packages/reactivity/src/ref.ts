 import { activeEffect, trackEffect,triggerEffect } from './effect';
import { toReactive } from './reactive'
import { createDep } from './reactiveEffect'
export function ref(value){
    return createRef(value)
}
function createRef(value){
    return new RefImpl(value)
}
// RefImpl英文的全称是Reference Implementation，
// 中文的意思是参考实现，这里的RefImpl是一个类，它的实例对象就是ref函数的返回值。
class RefImpl{
    public __v_isRef = true // ref表示
    public _value ;//保存ref的值
    public dep;//收集对应的effect
    constructor(public _rawValue){
        //  return isObject(value)?reactive(value):value
        this._value = toReactive(_rawValue) // 将传入的值转换为响应式对象
    }
    get value(){
        trackRefValue(this)
        return this._value
    }
    set value(newValue){
        if(newValue !== this._rawValue){
            this._rawValue = newValue
            this._value = newValue
            triggerRefValue(this)
        }
    }
}
export function trackRefValue(ref){

    if(activeEffect){
        console.log(activeEffect,'收集依赖 trackRefValue');
       trackEffect(activeEffect,
        ref.dep = ref.dep || createDep(() => ref.dep = undefined ,'undefined')
       )
    }
}
export function triggerRefValue(ref){
    let  dep = ref.dep
    if(dep){
        triggerEffect(dep) // 依赖收集
    }
}

class ObjectRefImpl{
    public __v_isRef = true
    constructor(public _object,public _key){
    }
    get value(){
        return this._object[this._key]
    }
    set value(newValue){
        this._object[this._key] = newValue
    }
}
export function toRef(object,key){
    return new ObjectRefImpl(object,key)
    // return object[key] // 得有.value 
}
export function toRefs(object){
    const ret = Array.isArray(object)?new Array(object.length):{}
    for(const key in object){
        ret[key] = toRef(object,key)
    }
    return ret
}

export function proxyRefs(objectWidthRef){
    return new Proxy(objectWidthRef,{
        get(target,key,reveiver){
            // return target[key].value
            let r =  Reflect.get(target,key,reveiver)
            return r.__v_isRef?r.value:r // 自动脱ref
        },
        set(target,key,value,reveiver){
           const oldvalue =  target[key]
           if(oldvalue !== value){
                if(oldvalue.__v_isRef){
                    oldvalue.value = value
                    return true
                }else{
                    return Reflect.set(target,key,value,reveiver)
                }
           }
        }
    })
}
export function isRef(value){
    return value ? value.__v_isRef === true:false
}