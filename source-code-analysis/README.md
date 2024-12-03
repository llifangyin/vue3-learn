## vue3优化概述

+ monorepo 代码管理方式
+ typescript 类型语言
+ FLOW静态类型检查 => typescript 类型检查
+ tree-shaking 减少打包体积（不会打包没有引入的组件）
+ 数据劫持优化
1. object.defineProperty 深层dom对象消耗性能
2. proxy 真正访问内部对象时才变成响应式，而不是无脑递归

+ 编译优化 
1. 运行时patch优化
2. block tree 嵌套更新速度：模块的大小=> 动态内容的数量

+ 语法优化
1. Composintion API

+ 优化逻辑复用
1. mixins vue2
2. hook vue3 

+ RFC (git) 每个版本改动可控(Request for comment)


## Composition API

