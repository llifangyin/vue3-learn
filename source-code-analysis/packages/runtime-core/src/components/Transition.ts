import { h } from "../h"


// requestAnimationFrame 会在下一帧执行，返回一个promise对象
const nextFrame = (fn)=>{
    requestAnimationFrame(()=>{
        requestAnimationFrame(fn)
    })
}
export function resolveTransitionProps(props) {
    const {
        name='v',
        enterFromClass = `${name}-enter-from`,
        enterActiveClass = `${name}-enter-active`,
        enterToClass = `${name}-enter-to`,
        leaveFromClass = `${name}-leave-from`,
        leaveActiveClass = `${name}-leave-active`,
        leaveToClass = `${name}-leave-to`,
        onBeforeEnter,
        onEnter,
        onLeave,
    } = props
    // console.log(name,'name');
    // console.log(enterFromClass,enterActiveClass,enterToClass,'enter');
    // console.log(leaveFromClass,leaveActiveClass,leaveToClass,'leave');
    // console.log(onBeforeEnter,onEnter,onLeave,'on');
    
    
    return {
        onBeforeEnter(el) {
            onBeforeEnter && onBeforeEnter(el)
            el.classList.add(enterFromClass)
            el.classList.add(enterActiveClass)
        },
        onEnter(el,done) {
            const resolve = ()=>{
                el.classList.remove(enterActiveClass)
                el.classList.remove(enterToClass)
                done && done()
            }
            onEnter && onEnter(el,resolve)

            // 进入后，下一帧移除enterFromClass，添加enterToClass
            nextFrame(()=>{//保证动画产生
                el.classList.remove(enterFromClass)
                el.classList.add(enterToClass)

                // onEnter.length 参数个数，有done是2个参数，没有done是1个参数
                if(!onEnter || onEnter.length < 2){
                    el.addEventListener('transitionEnd',resolve)
                }
            })
        },
        onLeave(el,done) {
            onLeave && onLeave(el)
            const resolve = ()=>{
                el.classList.remove(leaveActiveClass)
                el.classList.remove(leaveToClass)
                done && done()
            }
            el.classList.add(leaveFromClass)
            // 保证颜色生效后在过渡效果
            document.body.offsetHeight;//立刻绘制
            el.classList.add(leaveActiveClass)
            nextFrame(()=>{
                el.classList.remove(leaveToClass)
                el.classList.add(leaveToClass)
                if(!onLeave || onLeave.length < 2){
                    el.addEventListener('transitionEnd',resolve)
                }
            })
        }
    }
}
export  function Transition(props,{slots}) {
// 组件更新时更新插槽 slots属性会覆盖
//   Object.assign(instance.slots,nextVNode.children)
    // console.log('props slots',props,slots)

    // 函数式组件出列属性后 ，会传递给封装一个有状态的组件，
    // 状态组件里 setup处理
    const propsWithHooks = resolveTransitionProps(props)
    // console.log('propsWithHooks',propsWithHooks)
    return h(baseTransitionImpl, propsWithHooks, slots)
}
// 真正的状态组件 只需要渲染时 调用封装后的钩子函数即可
const baseTransitionImpl = {
    props:{
        onBeforeEnter: Function,
        onEnter: Function,
        onLeave: Function,
    },
    setup(props, { slots }) {
        return () => {
            const vnode = slots.default && slots.default()
            if(!vnode) return

            // 渲染前  和 选然后
            // const oldVnode = instance.subTree
            vnode.transition = {
                beforeEnter: props.onBeforeEnter,
                enter: props.onEnter,
                leave: props.onLeave,
            }
            // console.log(vnode,'vnode')

            return vnode

        }
    }
}