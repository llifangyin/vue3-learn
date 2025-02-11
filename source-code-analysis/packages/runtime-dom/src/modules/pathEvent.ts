function createInvoker(nextValue) {
    const invoker = e => {
        invoker.value(e)
    }
    invoker.value = nextValue
    return invoker
}
export default function patchEvent(el, name, nextValue) {
    // 把事件绑定到元素上 _vei缓存元素的某个事件
    // _vei vue event invokers(调用)
    const invokers = el._vei || (el._vei = {})
    const eventName = name.slice(2).toLowerCase()
    const exist = invokers[name]
    if(nextValue && exist){
        return exist.value = nextValue
    }
    if(nextValue){
       const invoker = (invokers[name] =  createInvoker(nextValue))
        return   el.addEventListener(eventName, invoker)
    }
    if(exist){
      el.removeEventListener(eventName, exist)
        invokers[name] = undefined
    }
   
}