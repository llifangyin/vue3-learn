// 主要是对节点元素的属性操作 class  style event
//  diff 比对属性的变化，然后更新
import   patchClass from './modules/patchClass'
import   patchStyle from './modules/patchStyle'
import patchEvent from './modules/pathEvent'
import pathAttr from './modules/pathAttr'
export default function patchProp(el, key, preValue, nextValue) {
    if(key === 'class'){
        return patchClass(el, preValue, nextValue)
    }else if(key === 'style'){
        return patchStyle(el, preValue, nextValue)
    }else if(key[0] === 'o' && key[1] === 'n'){
        //事件
        return patchEvent(el, key, nextValue)
    }else {
        return pathAttr(el, key, nextValue)
    }
}