import { ShapeFlags } from '@vue/shared';
import { isSameVnode } from './createVnode';
export function createRenderer(renderOptions) {
    // core中不关心如何渲染,可跨平台
    const {
        insert: hostInsert,
        remove: hostRemove,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        patchProp: hostPatchProp
    } = renderOptions
    const mountChildren = (children,container) => {
        for(let i = 0;i<children.length;i++){
            patch(null,children[i],container)
        }
    }
    const mountElement = (vnode,container) => {
        const {type,props,children,shapeFlag} = vnode
        // ShapeFlags通过位运算判断节点类型
        // 第一次渲染时 虚拟节点和真实节点创建关联
        // 第二次再次渲染，通过虚拟节点找到真实节点，再次更新真实节点
        const el = vnode.el =  hostCreateElement(type)
        if(props){
            for(const key in props){
                hostPatchProp(el,key,null,props[key])
            }
        }
        // console.log(vnode,'vnode')
        // 如果大于0 说明是文本元素
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            hostSetElementText(el,children)
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            // 数组
            mountChildren(children,el)
        }

        hostInsert(el,container)
    }
    // 处理虚拟节点
    const processElement = (n1,n2,container) => {
        if(n1 == null){
            // 初始化
            mountElement(n2,container)
        }else{
            patchElement(n1,n2,container)
        }
    }
    const patchProps = (el,oldProps,newProps) => {
      for(const key in newProps){
            const prev = oldProps[key]
            const next = newProps[key]
            // if(prev !== next){
                hostPatchProp(el,key,prev,next)
            // }
        }
        for(const key in oldProps){
            if(!newProps.hasOwnProperty(key)){
                hostPatchProp(el,key,oldProps[key],null)
            }
        }
    }
    const unmountChildren = (children) => {
        for(let i = 0;i<children.length;i++){
            unmount(children[i])
        }
    }
    const patchChildren = (n1,n2,el) => {
        const c1 = n1.children
        const c2 = n2.children
        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag
 
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // 老的是数组 新的是文本
                // 移除老的
                unmountChildren(c1)
            }
            if(c1!==c2){
                hostSetElementText(el,c2)
            }
        }else{
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                // 老的是数组 新的是数组
               if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
                    // patchKeyedChildren(c1,c2,el)
               }else{
                    unmountChildren(c1)
               }
            }else{
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
                    // 老的是文本 
                    hostSetElementText(el,'')
                }
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
                    // 新的是数组
                    mountChildren(c2,el)
                }
            }

        }
    }

    // 比较新旧节点
    const patchElement = (n1,n2,container) => {
        // 比较差异
        let el = n2.el = n1.el 
        let oldProps = n1.props || {}
        let newProps = n2.props || {}
        patchProps(el,oldProps,newProps)
        patchChildren(n1,n2,el)
    }
    const patch = (n1,n2,container) => {
        // 处理虚拟节点
        if(n1 == n2){
            return
        }
        // 同一个节点
        if(n1 && isSameVnode(n1,n2)){
            unmount(n1)
            n1 = null
        }
        // n1.shapeFlag区分
        processElement(n1,n2,container)
        

    }
    const unmount = (vnode) => {
        hostRemove(vnode.el)
    }
    // 多次调用进行虚拟节点比较 再渲染
    const render = (vnode,container)=>{

        if(vnode == null){
            if(container._vnode){
                // 移出dom元素
               unmount(container._vnode)
            }
        }

        // 将虚拟节点变成真实节点渲染
        patch( container._vnode ||null,vnode,container)

        container._vnode = vnode // 保存虚拟节点


    }
    return {
        render
    }
}