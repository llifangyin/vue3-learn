import { ShapeFlags } from '@vue/shared';
import { isSameVnode,Text,Fragment} from './createVnode';
import { getSequence } from './seq';
import { reactive, ReactiveEffect } from '@vue/reactivity';
import { queueJob } from './scheduler';
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
    const mountElement = (vnode,container,anchor) => {
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

        hostInsert(el,container,anchor)
    }
    // 处理虚拟节点
    const processElement = (n1,n2,container,anchor) => {
        if(n1 == null){
            // 初始化
            mountElement(n2,container,anchor)
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
    // 全量diff 递归diff
    // 快速diff 靶向更新
    const patchKeyedChildren = (c1,c2,el) => {
        // 对比两个children差异

        // 1.减少比对范围 从头开始比较， 从尾部比较，确定不一样的范围
        // 2 从头比对，从未比对，如果有多余的或新增的，直接操作即可

        let i = 0 //比对的索引
        let e1 = c1.length - 1 //老的最后一项索引
        let e2 = c2.length - 1 //新的最后一项索引

        // [a,b,c] => [a,b,d,e]
        // 从头开始比对
        while(i <= e1 && i <= e2){
            const n1 = c1[i]
            const n2 = c2[i]
            // 一个不一样就停止
            if(isSameVnode(n1,n2)){
                patch(n1,n2,el)// 递归比较 子节点 更新props等
            }else{
                break
            }
            i++
        }
        // a b c  => d e b c
        while(i <= e1 && i <= e2){
            const n1 = c1[e1]
            const n2 = c2[e2]
            if(isSameVnode(n1,n2)){
                patch(n1,n2,el)
            }else{
                break
            }
            e1--
            e2--
        }
        // a b  => a b c i = 2 e1 = 1 e2 = 2  i> e1  i<e2新增了
        // a b => c a b i=0 e1 = -1 e2 = 0    i>e1i<=e2 新增了 往前插入
        if(i>e1 ){
            if(i<=e2){
                // 说明新增了
                const nextPos = e2 + 1
                const anchor =  c2[nextPos]?.el
                while(i<=e2){
                    patch(null,c2[i],el,anchor)
                    i++
                }
            }
        }else if(i>e2){
            // a b c => a b i = 2 e1 = 2 e2 = 1  i<=e1 i>e2 删除了
            //  c a b  => a b  i = 0 e1 = 1 e2 = -1  i<=e1 i>e2 删除了
            if(i<=e1){
               while(i<=e1){
                     unmount(c1[i])
                     i++
                }
            }
        }
        // 特殊比对
        // a b c d e q f g => a b   e c d h   f g

        let s1 = i // 老的开始索引
        let s2 = i// 新的开始索引
        const keyToNewIndexMap = new Map()//映射表用于快速查找，老的是否在新的里面，没有删除，有更新
        let toBePatched = e2 - s2 + 1//倒序插入的数量
        // 根据新的节点找到老的位置
        let newIndexToOldMapIndex = new Array(toBePatched).fill(0);//[0,0,0,0]


        for(let i = s2;i<=e2;i++){
            const nextChild = c2[i]
            keyToNewIndexMap.set(nextChild.key,i)
        }
        // Map(4) {'e' => 2, 'c' => 3, 'd' => 4, 'h' => 5}  keyToNewIndexMap
        // console.log(keyToNewIndexMap,'keyToNewIndexMap')
        // 删除老的，复用旧的
        for(let i = s1;i<=e1;i++){
            const prevChild = c1[i]
            const newIndex = keyToNewIndexMap.get(prevChild.key)
            if(newIndex == undefined){
                // 老的有新的没有
                unmount(prevChild)
            }else{
                //避开0可能是第一个元素 区分新的元素 i+1 从1开始
                newIndexToOldMapIndex[newIndex - s2] = i + 1
                patch(prevChild,c2[newIndex],el)
            }
        }
        // console.log(newIndexToOldMapIndex,'newIndexToOldMapIndex');
        // 求最长递增子序列

        // 调整顺序
        // 按照新的队列倒序插入 新的元素多 创建  
        // 获取最长子序列
        const increasingSeq = getSequence(newIndexToOldMapIndex)
        // console.log(increasingSeq,'increasingSeq')
        let j = increasingSeq.length - 1;//最后一项
        for(let i = toBePatched-1;i>=0;i--){
            
            let newIndex = s2 + i//h对应的索引，找他的下一个元素 作为锚点
            let anchor = c2[newIndex + 1]?.el 
            // console.log(anchor,'anchor')
            if(c2[newIndex].el){
                // 列表中已存在的元素
                if(i == increasingSeq[j]){
                    j-- ; // 递减 不做新增处理 diff优化
                }else{
                    hostInsert(c2[newIndex].el,el,anchor)
                }
            }else{
                // 新元素
                patch(null,c2[newIndex],el,anchor)
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
                    patchKeyedChildren(c1,c2,el)
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
    const processText = (n1,n2,container) => {
        if(n1 == null){
            // 初始化
            n2.el = hostCreateText(n2.children,container)
            hostInsert(n2.el,container)
        }else{
            // 更新
            const el = n2.el = n1.el
            if(n1.children !== n2.children){
                hostSetText(el,n2.children)
            }
        }
    }
    const processFragment = (n1,n2,container) => {
        if(n1 == null){
            // 初始化
            mountChildren(n2.children,container)
        }else{
            // 更新
            patchChildren(n1,n2,container)
        }
    }
    const initProps = (instance,rawProps) => {
        // rawProps 用户传入的props
        const props = {}
        const attrs = {}
        const propsOptions = instance.propsOptions || {} //组件中定义的props
        // console.log(rawProps,'rawProps')
        if(rawProps){
            for(let key in rawProps){
                const value = rawProps[key] // string | number 
                if(key in propsOptions){
                    //props不需要深度结构，组件里不能更改属性 正常是shallowReactive
                    props[key] = value
                }else{
                    attrs[key] = value
                }
            }
        }
        instance.props = reactive(props)
        instance.attrs = attrs

    }
    const mountComponent = (vnode,container,anchor) => {
        // n2 => vnode
        // 组件挂载
        // 可以根据自己的状态 重新渲染
        // console.log(n2,'n2')
        // n2是新节点 type props children
        const { data= ()=>{},render ,props:propsOptions={}} = vnode.type // 为什么这里是type    
        // h=> return createVNode(type,propsOrChildren,children) 第一个参数是type : { data,render }
        
        const state = reactive(data())
        const instance ={
            state,
            vnode:vnode,
            subTree:null,//子树
            isMounted:false,
            update:null,//更新函数
            props:{},
            attrs:{},
            propsOptions,//用户传入的props
            component:null,
        }
        // 根据propsOptions 区分出props 和 attrs

        // 元素更新 n2.el = n1.el
        // 组件更新 n2.subTree = n1.subTree
        vnode.component = instance
        // console.log(propsOptions,'propsOptions')
        initProps(instance,vnode.props)
        console.log(instance,'instance')

        const componentUpdateFn = ()=>{
            // console.log(data(),'data')
            // 区分第一次创建和更新
            if(!instance.isMounted){
                // console.log(render,'render')
                const subTree = render.call(state,state)//执行render函数
                // 第一个state是this 第二个是参数
                // subTree  return h(xxx)是个虚拟节点 即要渲染的虚拟节点
                instance.subTree = subTree
                patch(null,subTree,container,anchor)
                instance.isMounted = true
            }else{
                // 更新
                const prev = instance.subTree
                const next = render.call(state,state)
                patch(prev,next,container,anchor)
                instance.subTree = next
            }

         }
         // 响应式数据变化后重新渲染  
          const effect = new ReactiveEffect(componentUpdateFn,
             ()=> queueJob(update)
         )
         const update = ( instance.update   = ()=>{ effect.run()} )
        update()
    }
    const processComponent = (n1,n2,container,anchor) => {
        if(n1 == null){
            // 初始化
            mountComponent(n2,container,anchor)
        }else{
            // 更新
            // patchComponent(n1,n2,container)
        }
    }
    const patch = (n1,n2,container, anchor= null) => {
        // 处理虚拟节点
        if(n1 == n2){
            return
        }
        // 同一个节点
        if(n1 && !isSameVnode(n1,n2)){
            unmount(n1)
            n1 = null
        }
   
        const {type,shapeFlag} = n2
        switch(type){
            case Text:
                processText(n1,n2,container)
                break;
            case Fragment:
                processFragment(n1,n2,container)
                break;
            default:
                if(shapeFlag & ShapeFlags.ELEMENT){
                    processElement(n1,n2,container,anchor)
                }else if(shapeFlag & ShapeFlags.COMPONENT){
                    // 组件 vue3中函数式组件废弃了，没有性能节约
                    
                    processComponent(n1,n2,container,anchor)
                }
        }
        // n1.shapeFlag区分
        // processElement(n1,n2,container,anchor)
        

    }
    const unmount = (vnode) => {
        if(vnode.type == Fragment){//数组
            console.log(vnode,'vnode');
            
            unmountChildren(vnode.children)
        }else{
            hostRemove(vnode.el)
        }
    }
    // 多次调用进行虚拟节点比较 再渲染
    const render = (vnode,container)=>{

        if(vnode == null){
            if(container._vnode){
                // 移出dom元素
               unmount(container._vnode)
            }
        }else{
            // 将虚拟节点变成真实节点渲染
            patch( container._vnode ||null,vnode,container)
            container._vnode = vnode // 保存虚拟节点
        }
    }
    return {
        render
    }
}