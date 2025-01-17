import { targetMap } from './reactiveEffect'
export function effect (fn,option?) {
// 创建一个响应式effect，数据变化后重新执行
    const _effect  = new ReactiveEffect(fn,()=>{
        _effect.run()
    })
    _effect.run() // 默认先执行一次

    return _effect
}
export let activeEffect ;
function preCleanEffect(effect){
    // console.log(effect,'pre')
    effect._depsLength = 0
    effect._trackId ++ // 每次执行id+1, 如果同一个effect执行，id就是相同的

}
function postCleanEffect(effect){
//    [flag,age,xxx,bbb,ccc]
// [flag-> effect._depslength = 1]
    if(effect.deps.length >  effect._depsLength){
        // 超过的删除
        for(let i = effect._depsLength; i<effect.deps.length;i++){
                cleanDepEffect(effect.deps[i],effect)//删除映射表中的effect
        }
        effect.deps.length = effect._depsLength // 更新依赖表的长度
    }
}
// effectScope.stop() // 停止依赖收集 不参加响应式处理
class ReactiveEffect{
    _trackId= 0;//记录effect执行的次数
    active = true; // 创建的effect是否处于激活状态
    deps = [] // 存放effect中用到的属性
    _depsLength = 0

    // 如果fn中依赖的数据发生变化后，需要重新调用scheduler => _effect.run
    constructor(public fn,public scheduler?){ }
    // fn就是用户传入的函数
    // scheduler 用来调度执行
    run(){
        // 让fn执行
        if(!this.active){
            return this.fn()
        }
        let lastEffect = activeEffect
        // 把当前的 ReactiveEffect 放到全局上， 可供依赖收集
        try{
            activeEffect = this
            // effect重新执行前，将上一次的依赖清空
            preCleanEffect(this) // 每一次调用effect的fun时，
            // 将effect的_trackId++
            // 保证同一个effect执行，id相同
            return this.fn() // track -> trackEffect(重新收集依赖)
        }
        finally{
            postCleanEffect(this)
            activeEffect = lastEffect //防止嵌套，保证收集的是当前的effect
        }
    }
}

function cleanDepEffect(dep,effect){
    dep.delete(effect)
    if(dep.size == 0){ // 删除总映射表 targetMap里的属性effect
        dep.cleanup()//把自己删除
    }
}
// 双向记忆
export function trackEffect(effect,dep){ 
    
    // dep.set(effect, effect._trackId)
    // // 将effect和dep关联起来
    // effect.deps[ effect._depsLength++] = dep
    
    // 重新收集依赖 将不需要的依赖清除
    
    // dep.get(effect) 第一次undefined
    // effect._trackId  渲染的次数 effect调用的次数
    // trackid用于记录执行的次数，防止一个属性在一个effect中多次收集
    // console.log(dep.get(effect),effect._trackId,'dep.get(effect)')
    // console.log(effect,'effect')
    if(dep.get(effect) !== effect._trackId){
        //  依赖收集
        dep.set(effect, effect._trackId) 
        // console.log('优化了多余的收集')
        let oldDep = effect.deps[ effect._depsLength]
        // 没有存过 初始化 第0个没有
        if(oldDep!==dep){
            if(oldDep){
                // 删除旧的，换新的
                cleanDepEffect(oldDep,effect)
            }
            // {flag,name}
            // {flag,age}
            // effect.deps -> 永远按照最新的收集顺序存放
            
            effect.deps[effect._depsLength++] = dep
        }else{
            effect._depsLength++
        }
        console.log(effect,111)
        // console.log(targetMap,'targetMap')
    }

}

// 触发更新
export function triggerEffect(dep){
    // dep 属性的映射表
    // console.log(dep.keys(),'dep.keys()')
    for(const effect of dep.keys()){
        // 触发更新
        // console.log(effect,'effect')    
        // cleanUp name是dep.xxx赋值的，for of遍历不到
        if(effect.scheduler){
            effect.scheduler() // => effect.run
        }
    }
}