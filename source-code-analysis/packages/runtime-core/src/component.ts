import { proxyRefs, reactive } from "@vue/reactivity"
import { hasOwn, isFunction } from "@vue/shared"

export function createComponentInstance(vnode){

    const instance ={
        data:null,
        vnode:vnode,
        subTree:null,//子树
        isMounted:false,
        update:null,//更新函数
        props:{},
        attrs:{},
        propsOptions:vnode.type.props,//用户传入的props
        component:null,
        proxy:null,//代理props attrs data 可以直接访问
        setupState:null,// setup返回的状态
    }

    return instance
}
const initProps = (instance,rawProps) => {
    // rawProps 用户传入的props
    const props = {}
    const attrs = {}
    const propsOptions = instance.propsOptions || {} //组件中定义的props
    // console.log(rawProps,'rawProps')
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key] // string | number 
            if(key in propsOptions){
                //props不需要深度结构，组件里不能更改属性 正常是shallowReactive
                props[key] = value
            }else{
                attrs[key] = value
            }
        }
    }
    instance.props = reactive(props)
    instance.attrs = attrs

}
// 策略模式 
const publicProperty = {
    $attrs:(instance)=>instance.attrs,
    // ...
}
const handler =   {
        get(target,key){
            const {data,props,setupState} = target
            if(data && hasOwn(data,key)){
                return data[key]
            }else if(props && hasOwn(props,key)){
                return props[key]
            }else if(setupState && hasOwn(setupState,key)){
                return setupState[key]
            }
            // 对于无法修改的属性 $attrs $slots只能读取
            const getter =  publicProperty[key]
            if(getter){
                return getter(target)
            }
        },
        set(target,key,value){
            const {data,props,setupState} = target
            if(data && hasOwn(data,key)){
                data[key] = value
            }else if(props && hasOwn(props,key)){
                // props[key] = value
                console.warn('props is readonly');
                return false
            }else if(setupState && hasOwn(setupState,key)){
                setupState[key] = value
            }
            return true
    }
}

// 初始化组件  给实例的属性赋值 ; 给代理对象得data props attrs做响应式处理
export function setupComponent(instance){
    const { vnode } = instance
    initProps(instance,vnode.props) //赋值属性
    instance.proxy = new Proxy(instance,handler)//赋值代理对象

    const {data=()=>{},render,setup} = vnode.type

    if(setup){
        // setupcontext [attrs,slots,emit]
        const setupContext = {

        }
        const setupResult = setup(instance.props,setupContext)

        if(isFunction(setupResult)){
            instance.render = setupResult
        }else{
            // proxyRefs 自动脱包
            instance.setupState = proxyRefs(setupResult)//状态
        }
    }



    // const { data = ()=>{},render ,props:propsOptions={}} = vnode.type // 为什么这里是type    
        // h=> return createVNode(type,propsOrChildren,children) 第一个参数是type : { data,render }
    if(!isFunction(data)){
        // data中可以拿到proxy
        console.warn('data must be a function');
    }else{
        instance.data = reactive(data.call(instance.proxy))
    }
    // 没有render用自己的render，有的话就是上述的setup定义的
    if(!instance.render){
        instance.render  = render
    }

}