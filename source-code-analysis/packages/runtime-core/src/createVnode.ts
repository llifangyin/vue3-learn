import { isString, ShapeFlags } from "@vue/shared";
export function isVnode(vnode){
    return vnode.__v_isVNode
}
export const Text = Symbol('Text')
export function createVNode(type, props, children?) {
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    const vnode = {
        __v_isVNode: true,
        type,
        props,
        children,
        key: props?.key,//for diff
        el: null,//真实节点
        shapeFlag
    }
    if(children){
        if(Array.isArray(children)){
            vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
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