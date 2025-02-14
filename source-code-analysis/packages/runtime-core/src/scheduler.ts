const queue = []//缓存当前要执行的队列
let isFlushing = false//是否正在执行
const resolvedPromise = Promise.resolve();//返回一个成功的promise

// 如果同时在一个组件中更新多个状态，job肯定是同一个
// 同时开启一个异步任务 
// job 更新方法 
export  function queueJob(job) {
    // 批处理
    if(!queue.includes(job)){
        queue.push(job)//队伍入列
    }

    if(!isFlushing){
        //异步调度
        isFlushing = true
        // 保证在主栈执行完毕后执行
        // 本轮事件环机制，延迟更新操作；  宏任务 => 微任务(Promise)
        resolvedPromise.then(()=>{
            isFlushing = false
            // copy一份 再执行
            let copy = queue.slice(0)//从0开始复制
            queue.length = 0
            copy.forEach((job)=>job())
            copy.length = 0
        })
    }
}