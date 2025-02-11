export enum ShapeFlags {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
// 对上述代码的解释:
// ShapeFlags是一个枚举类型,定义了一些常量,用于表示虚拟节点的类型
// ELEMENT: 1, 表示元素节点
// FUNCTIONAL_COMPONENT: 1 << 1, 表示函数式组件
// STATEFUL_COMPONENT: 1 << 2, 表示有状态组件
// TEXT_CHILDREN: 1 << 3, 表示文本节点
// ARRAY_CHILDREN: 1 << 4, 表示数组节点
// SLOTS_CHILDREN: 1 << 5, 表示插槽节点
// TELEPORT: 1 << 6, 表示传送门节点
// SUSPENSE: 1 << 7, 表示Suspense节点
// COMPONENT: ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, 表示组件节点
// 通过这些常量,我们可以方便地判断一个虚拟节点的类型
// 例如,如果一个虚拟节点的shapeFlag的值为ShapeFlags.ELEMENT,则表示这是一个元素节点
// 如果一个虚拟节点的shapeFlag的值为ShapeFlags.COMPONENT,则表示这是一个组件节点
// 这样我们就可以根据shapeFlag的值来判断虚拟节点的类型,从而进行相应的操作
// 这样的设计可以使得代码更加清晰,易于维护和扩展

// 介绍 << 运算符
// << 是位运算符,用于将一个数的二进制表示向左移动指定的位数
// 例如,1 << 1,表示将1的二进制表示向左移动1位,结果为10,即2
// 1 << 2,表示将1的二进制表示向左移动2位,结果为100,即4
// 1 << 3,表示将1的二进制表示向左移动3位,结果为1000,即8

