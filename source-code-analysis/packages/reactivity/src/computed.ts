import { isFunction } from '@vue/shared'
import { ReactiveEffect, effect } from './effect';
import { trackRefValue, triggerRefValue } from './ref';

class ComputedRefImpl{
    public _value;
    public effect;
    public dep;
    constructor( getter,public setter){
        // 创建一个effect 管理当前的dirty属性
        this. effect = new ReactiveEffect(
            ()=>getter(this._value),//fn
            ()=>{ //scheduler
                // 计算依赖属性的值变化了,触发渲染
                triggerRefValue(this) 
                // 将dirty变为true
            }
        )
    }
    get value(){
        // 需要额外处理 每次取值不用都run
        if(this.effect.dirty){
            this._value = this.effect.run()
            return this._value
        }
        // 如果当前在effect中访问了属性,这个计算属性收集effct
        trackRefValue(this)
        return this._value //fn -> getter(_value)
    }
    set value(v){ 
        this.setter(v)
    }
}
export function computed(getterOroptions) {
    let onlyGetter = isFunction(getterOroptions) 
    let getter;
    let setter;
    if(onlyGetter){
        getter = getterOroptions
        setter = () => {}
    }else{
        getter = getterOroptions.get
        setter = getterOroptions.set
    }
    console.log(getter, setter)
    return new ComputedRefImpl(getter, setter)
}
