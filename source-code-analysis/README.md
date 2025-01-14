[bilibili](https://www.bilibili.com/video/BV1SJq8YwEnd?vd_source=5f81aa32e3d31be9ce29a6f3bdb44718&p=4&spm_id_from=333.788.videopod.episodes)
## vue3优化概述

+ monorepo 代码管理方式
1. pnpm-workspace.yaml package声明，
2. pkg.json 里workspaces声明
3. tsconfig里baseUrl paths声明，公共模块的别名
4. npmrc文件里 shamefully-hoist 依赖提升到根目录
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

### minimist 解析参数命令
```js
// "dev": " node scripts/dev.js reactivity -f esm",
const args = minimist( process.argv.slice(2));
const target = args._[0] || "reactivity";// 要打包的模块 
const formats = args.f || "iife";// 打包的格式 iife(立即执行，默认值) cjs esm
```
```js
import { isObject } from '@vue/shared';

console.log(isObject('abc')); 
console.log(isObject({})); 
```
```js
// iife
(() => {
  // packages/shared/src/index.ts
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }

  // packages/reactivity/src/index.ts
  console.log(isObject("abc"));
  console.log(isObject({}));
})();
//# sourceMappingURL=reactivity.js.map

```
```js
// esm cjs
// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/index.ts
console.log(isObject("abc"));
console.log(isObject({}));
//# sourceMappingURL=reactivity.js.map

```
