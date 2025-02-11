

import {nodeOps} from './nodeOps'
import patchProp from './patchProp'
import {createRenderer } from '@vue/runtime-core'
const renderOptions = Object.assign({patchProp},nodeOps)

// render函数采用domApi进行渲染
export const render  = (vnode,container) => {
    return createRenderer(renderOptions).render(vnode,container)
}

// @vue/runtime-core = > runtime-core => reactivity
export * from '@vue/runtime-core'
