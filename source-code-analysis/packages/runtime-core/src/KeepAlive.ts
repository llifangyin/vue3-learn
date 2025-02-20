import { ShapeFlags } from '@vue/shared';
import { onMounted, onUpdated } from './apiLifecycle';
import { getCurrentInstance } from './component';

export const KeepAlive = {
    __isKeepAlive: true,
    props:{
      max:Number,
    },
    setup(props, { slots }) {

      // 在组件中需要dom方法将dom元素移动到div中
      // 还可以卸载某个元素
      const keys = new Set()//记录组件缓存的key
      const cache = new Map()// 缓存表
  
      let pendingCacheKey = null; // 缓存的key
      // keepalive isObject 是有状态组件
      const instance = getCurrentInstance();
      const cacheSubTree = () => {
        cache.set(pendingCacheKey, instance.subTree);
      }


      // 初始化
      const {move,createElement,unmount:_unmount} = instance.ctx.renderer;
      // 还原vnode上的标识
      function reset(vnode){
        let shapeFlag = vnode.shapeFlag;
        if(shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE){
          shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
        }
        if(shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE){
          shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
        }
        vnode.shapeFlag = shapeFlag;
      }
      function unmount(vnode){
        reset(vnode);
        _unmount(vnode);
      }
      const purnCacheEntry = (key) => {
        keys.delete(key);
        const cached = cache.get(key);
        unmount(cached);//卸载
    }
      // 激活
      instance.ctx.activate = (vnode,container,anchor) => {
        move(vnode,container,anchor);
      }
      // 卸载
      const storageContent = createElement('div');//存储容器
      instance.ctx.deactivate = (vnode) => {
        move(vnode,storageContent,null); //移动到存储容器
      }

      onMounted(cacheSubTree)
      onUpdated(cacheSubTree)
      // 当前keepalive组件没变，只更新子元素 第一次触发onMounted,此后触发onUpdated
      return ()=>{
        const vnode = slots.default();
        const key =  vnode.key == null ? vnode.type : vnode.key;
        const cachedVNode = cache.get(key);
        const {max,} = props;
        pendingCacheKey = key;
        if(cachedVNode){
          vnode.component = cachedVNode.component;//复用组件实例
          vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE //标识不需要做初始化了
          keys.delete(key);
          keys.add(key);
        }else{
          console.log(max,keys.size,'max,keys.size')
          if(max && keys.size >= max){
            // 最大缓存
            // 获取set中第一个元素 keys.values().next().value
            let first = keys.values().next().value;
            console.log(first,'first')
            purnCacheEntry(first);
          }
          keys.add(key);
        }
        vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE; //标识keepalive 不需要真正卸载
        //组件加载完毕后再缓存
        return vnode; 
      }
    }
};
export const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;