export enum PatchFlags {
    TEXT = 1,//文本
    CLASS = 1 << 1,//类
    STYLE = 1 << 2,//样式
    PROPS = 1 << 3,//属性
    FULL_PROPS = 1 << 4,//完整属性
    HYDRATE_EVENTS = 1 << 5,//事件
    STABLE_FRAGMENT = 1 << 6,//稳定片段
    KEYED_FRAGMENT = 1 << 7,//键控片段
    UNKEYED_FRAGMENT = 1 << 8,//无键片段
    NEED_PATCH = 1 << 9,//需要修补
    DYNAMIC_SLOTS = 1 << 10,//动态插槽
    HOISTED = -1,//提升
    BAIL = -2//保释
}