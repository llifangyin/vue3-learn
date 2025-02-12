import { ShapeFlags } from '@vue/shared';
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
        const el = hostCreateElement(type)
        if(props){
            for(const key in props){
                hostPatchProp(el,key,null,props[key])
            }
        }
        console.log(vnode,'vnode')
        
        // 如果大于0 说明是文本元素
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            hostSetElementText(el,children)
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            // 数组
            mountChildren(children,el)
        }

        hostInsert(el,container)
    }
    const patchElement = (n1,n2,container) => {
       
    }
    const patch = (n1,n2,container) => {
        // 处理虚拟节点
        if(n1 ==n2){
            return
        }
        if(n1 == null){
            // 初始化
            mountElement(n2,container)
        }else{
            // 更新
            patchElement(n1,n2,container)
        }
       

    }
    // 多次调用进行虚拟节点比较 再渲染
    const render = (vnode,container)=>{
        // 将虚拟节点变成真实节点渲染
        patch( container._vnode ||null,vnode,container)

        container._vnode = vnode // 保存虚拟节点


    }
    return {
        render
    }
}