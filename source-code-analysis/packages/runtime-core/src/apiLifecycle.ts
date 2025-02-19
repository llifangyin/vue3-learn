import { currentInstance, setCurrentInstance, unsetCurrentInstance } from "./component"
export const enum LifeCycles{
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u',
    BEFORE_UNMOUNT = 'bum',

}
// createHook为一个工厂函数，返回一个函数，这个函数接收一个hook参数，打印出hook的值

export function createHook(type){
    return (hook,target=currentInstance)=>{
        // 当前组件实例,存到此钩子上
    //    console.log(type, hook)
        //    组件中运行的 有示例
       if(target){
        // bm:[hook1,hook2]
        // 类似于依赖收集，每个钩子都会收集对应的实例/
        const hooks =  target[type] ||( target[type] = [])
        // 让currentInstance 存储到当前的钩子上
        const wrapHook = ()=>{
            // 钩子执行前，对实例进行矫正
            setCurrentInstance(target)
            hook.call(target)
            unsetCurrentInstance()
        }
        hooks.push(wrapHook)
        // 执行函数内部，保证实例的正确的
       }

    }
}


export const onBeforeMount = createHook(LifeCycles.BEFORE_MOUNT)
export const onMounted = createHook(LifeCycles.MOUNTED)
export const onBeforeUpdate = createHook(LifeCycles.BEFORE_UPDATE)
export const onUpdated = createHook(LifeCycles.UPDATED)
export const onBeforeUnmount = createHook(LifeCycles.BEFORE_UNMOUNT)

export function invokeHooks(hooks){
    for(let i=0;i<hooks.length;i++){
        hooks[i]()
    }
}