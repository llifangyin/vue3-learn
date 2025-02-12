import { isString, ShapeFlags, isObject,  } from '@vue/shared';
import { createVNode, isVnode } from './createVnode';
export  function h(type, propsOrChildren, children) {
   let l = arguments.length;
   if(l === 2){
    // 属性 或虚拟节点
        if(isObject(propsOrChildren) && !Array.isArray(propsOrChildren)){
            if(isVnode(propsOrChildren)){
                return createVNode(type,null,[propsOrChildren])
            }else{
                return createVNode(type,propsOrChildren)
            }
        }
        // 数组或文本
         return createVNode(type,null,propsOrChildren)

   }else{
        if(l > 3){
            children = Array.prototype.slice.call(arguments,2)

        }
         if(l === 3 && isVnode(children)){
            children = [children]
        }

        return createVNode(type,propsOrChildren,children)

   }
}
