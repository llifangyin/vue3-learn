export enum ReactiveFlags{
    IS_REACTIVE = '__v_isReactive',// 标识是否是响应式对象
}
export enum DirtyLevels{
    Dirty = 4, //脏值 取值运行计算属性
    NoDirty= 0, //不脏, 用上一次的返回结果
}
