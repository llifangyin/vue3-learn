import { ShapeFlags } from "@vue/shared"

export const Teleport= {
    __isTeleport: true,
    remove(vnode,unmountChildren){
        const { shapeFlag,children} = vnode
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
           unmountChildren(children)
        }
    },
    process(n1,n2,container,anchor, parentComponent, internals){
    // render(h(Teleport,{to:'#root2'},[1234,'abc']), app)
      let { mountChildren, patchChildren,move } = internals
        if(!n1){
            const target = n2.target=  document.querySelector(n2.props.to)
            if(target){
                mountChildren(n2.children,container,parentComponent)
            }
        }else{
            patchChildren(n1,n2,n2.target,parentComponent)
            if(n2.props.to ! == n1.props.to){
                const nextTarget = n2.target = document.querySelector(n2.props.to)
               n2.children.forEach(child => {
                     move(child,nextTarget,anchor)
               });
            }
        }
    }
}
export const isTeleport = (type: any) => type.__isTeleport