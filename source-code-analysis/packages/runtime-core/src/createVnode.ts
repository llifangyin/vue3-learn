import { isTeleport } from "./components/Teleport";
import { isFunction, isObject, isString, ShapeFlags } from "@vue/shared";

export function isVnode(vnode){
    return vnode.__v_isVNode
}
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')
/**
 * Fragment:
 * 用于表示一组节点的容器，它本身不会在 DOM 中产生额外的包装元素。
 * 当渲染时，Fragment 会直接渲染其子节点，不会生成额外的 DOM 结构，
 * 这对于需要返回多个根节点的情况非常有用。
 */
export function createVNode(type, props, children?, patchFlag?){ 
    const shapeFlag = isString(type) 
    ? ShapeFlags.ELEMENT //元素
    :isTeleport(type)
    ?ShapeFlags.TELEPORT//传送门
    :isObject(type) 
    ?ShapeFlags.STATEFUL_COMPONENT//有状态组件
    :isFunction(type)
    ?ShapeFlags.FUNCTIONAL_COMPONENT//函数式组件
    :0;
    const vnode = {
        __v_isVNode: true,
        type,
        props,
        children,
        key: props?.key,//for diff
        el: null,//真实节点
        shapeFlag,
        ref:props?.ref,
        patchFlag,
    }

    // 有patchFlag 说明是动态节点 才会收集
    if(currentBlock && patchFlag >0){
        currentBlock.push(vnode)
    }

    if(children){
        if(Array.isArray(children)){
            vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
        }else if(isObject(children)){ //slots 已对象的形式传入
            vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
        }else{
            children = String(children)
            vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
        }
    }
    return vnode
}
export function isSameVnode(n1,n2){
    return n1.key === n2.key && n1.type === n2.type
}


let currentBlock = null
export function openBlock(){
   currentBlock = []//收集动态节点
}

export function closeBlock(){
    currentBlock = null
}
export function setupBlock(vnode){
    // 当前的elementblock收集子节点 用当前block收集
    vnode.dynamicChildren = currentBlock
    closeBlock()
    return vnode
}
export function createElementBlock(type,props,children,patchFlag?){
    // 收集子节点
    return  setupBlock(createVNode(type,props,children,patchFlag))

}
export function toDisplayString(val){
    return val == null
    ?''
    :isString(val)
    ?val
    :isObject(val)
    ?JSON.stringify(val)
    :String(val)
}
export { createVNode as  createElementVNode}