export function effect (fn,option?) {
// 创建一个响应式effect，数据变化后重新执行
    const _effect  = new ReactiveEffect(fn,()=>{
        _effect.run()
    })
    _effect.run() // 默认先执行一次

    return _effect
}
export let activeEffect ;

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
            return this.fn()
        }
        finally{
            activeEffect = lastEffect //防止嵌套，保证收集的是当前的effect
        }
    }
}

// 双向记忆
export function trackEffect(effect,dep){
    dep.set(effect, effect._trackId)
    // 将effect和dep关联起来
    effect.deps[ effect._depsLength++] = dep
    console.log(effect.deps,'effect.deps')
}

// 触发更新
export function triggerEffect(dep){
    // dep 属性的映射表
    for(const effect of dep.keys()){
        // 触发更新
        if(effect.scheduler){
            effect.scheduler() // => effect.run
        }
    }
}