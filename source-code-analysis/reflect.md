# Reflect 详解

讲到Proxy对象相信大家都肯定很熟悉，vue3的响应式原理就是以此为基础的。**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

### Proxy语法简要介绍
```js
const p = new Proxy(target, handler)
```
handler常用方法
+ get - 拦截对象属性的读取操作
+ set - 拦截对象属性的设置操作
+ has - 拦截属性查询操作
+ deleteProperty - 拦截属性删除操作
+ ownKeys - 拦截对象自身属性的枚举操作
+ constructor - 拦截对象的构造函数调用操作
+ getPropertyOf - 拦截获取对象原型操作
+ setPropertyOf - 拦截设置对象原型操作
+ defineProperty - 拦截对象属性的定义操作

### 举例

```js
var p = new Proxy({},{
    defineProperty(target,prop,descriptor){
        console.log(111)
        return Reflect.defineProperty(target,prop,descriptor)
    }
})
Object.defineProperty(p,'name',{
    value:'proxy',
    type:'custom'
})
// console.log(p);
var desc = {
    configurable:true,
    enumrable:true,
    value:10
}
Object.defineProperty(p,'a',desc)
console.log(p.name,p.a);
```

## 那么vue的proxyHandler里为什么要使用Reflect呢?🤔

### 先来看一下Reflect对象

+ Reflect 反射 是一个内置对象，提供可拦截JavaScript操作的方法。Reflect的原型就是Object  
+ Reflect 不是一个函数对象，不可构造
+ Reflect 的所有属性和方法都是静态的（就像Math对象）

#### 静态方法
 1. **Reflect.get(target, propertyKey[, receiver])** 
 target: 目标对象 propertyKey: 属性名 receiver：如果target对象中指定了getter，receiver则为getter调用时的this值
 描述：读取对象的属性，但他是通过函数调用来实现的

```js
let obj = {
    x:1,
    y:2
}
console.log(Reflect.get(obj,'x')) // 1
console.log(Reflect.get([1,2,3],1)) // 2

let x = {p:1}
let obj2 = new Proxy(x,{
    get(t,k,r){
        return k + ' is the key'
    }
})

console.log(Reflect.get(obj2,'x')) // x is the key
```


2.  **Reflect.set(target, propertyKey, value, receiver)**
 描述：Reflect.set 方法允许你在对象上设置属性。它的作用是给属性赋值并且就像 property accessor 语法一样，但是它是以函数的方式
 ```js
 let obj3 = {}
Reflect.set(obj3,'x',1)
console.log(obj3) // {x:1}
let arr = [1,2,3]
Reflect.set(arr,1,4)
console.log(arr) // [1,4,3]

 ```
3. **Reflect.has(obj, key)**
描述：Reflect.has 用于检查一个对象是否拥有某个属性，相当于in 操作符 。
```js
Reflect.has({ x: 0 }, "x"); // true
Reflect.has({ x: 0 }, "y"); // false

// 如果该属性存在于原型链中，返回 true
Reflect.has({ x: 0 }, "toString");

// Proxy 对象的 .has() 句柄方法
obj = new Proxy(
  {},
  {
    has(t, k) {
      return k.startsWith("door");
    },
  },
);
Reflect.has(obj, "doorbell"); // true
Reflect.has(obj, "dormitory"); // false
```
4. R**eflect.deleteProperty(obj, key)**
描述：Reflect.deleteProperty 允许你删除一个对象上的属性。返回一个 Boolean 值表示该属性是否被成功删除。它几乎与非严格的 delete operator 相同。
```js
var obj = { x: 1, y: 2 };
Reflect.deleteProperty(obj, "x"); // true
obj; // { y: 2 }

var arr = [1, 2, 3, 4, 5];
Reflect.deleteProperty(arr, "3"); // true
arr; // [1, 2, 3, , 5]

// 如果属性不存在，返回 true
Reflect.deleteProperty({}, "foo"); // true

// 如果属性不可配置，返回 false
Reflect.deleteProperty(Object.freeze({ foo: 1 }), "foo"); // false

```
5. **Reflect.construct(target, args)**
Reflect.construct允许你使用可变的参数来调用构造函数，这和使用new 操作符搭配对象展开符调用一样。
6. **Reflect.apply(target, thisArg, args)**
调用一个方法并且显式地指定 this 变量和参数列表 (arguments) ，参数列表可以是数组，或类似数组的对象。
7. **Reflect.defineProperty(target, propertyKey, attributes)**
Reflect.defineProperty 方法允许精确添加或修改对象上的属性。
8. **Reflect.getOwnPropertyDescriptor(target, propertyKey)**
Reflect.getOwnPropertyDescriptor方法返回一个属性描述符，如果给定的属性存在于对象中，否则返回 undefined 。与 Object.getOwnPropertyDescriptor() 的唯一不同在于如何处理非对象目标。
9. **Reflect.getPrototypeOf(obj)**
Reflect.getPrototypeOf 返回指定对象的原型 (即内部的 [[Prototype]] 属性的值) 。
10.** Reflect.setPrototypeOf(obj, newProto)**
Reflect.setPrototypeOf 方法改变指定对象的原型（即，内部的 [[Prototype]] 属性值）
11. **Reflect.isExtensible(obj)**
静态方法 Reflect.isExtensible() 判断一个对象是否可扩展（即是否能够添加新的属性）。
12. Reflect.preventExtensions(obj)
Reflect.preventExtensions 方法阻止新属性添加到对象 (例如：防止将来对对象的扩展被添加到对象中)。该方法与 Object.preventExtensions() 方法相似。
13. **Reflect.ownKeys(obj)**
Reflect.ownKeys 方法返回一个由目标对象自身的属性键组成的数组。



### 总结使用Reflect的好处

1. **一致性**：Reflect 的方法与 Proxy 的陷阱方法一一对应，使得代码更简洁和一致。☑️
2. **返回值**：Reflect 的方法返回布尔值，表示操作是否成功，而 Object 的方法在某些情况下会抛出异常，这使得错误处理更加复杂。☑️
3. **函数调用**：Reflect 的方法是函数调用形式，这使得它们更容易与其他函数组合使用。☑️
4. **避免歧义**：使用 Reflect 可以避免在 Proxy 陷阱中直接调用 Object 方法时可能出现的递归调用问题。☑️
5. **标准化**：Reflect 是 ES6 引入的标准化对象，提供了一组更现代和统一的 API。☑️

这些特性使得 Reflect 在处理 Proxy 时更加方便和可靠，因此 Vue3 选择使用 Reflect 而不是 Object 的方法。



### 参考代码分析 Vue3(v3.5.13)
reactive.ts中new Proxy(target,baseHandlers)
```ts
  function createReactiveObject(
// 省略很多参数
) {
// 省逻很多判断逻辑
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )
  proxyMap.set(target, proxy)
  return proxy
}
```
baseHandlers中定义了Proxy的配置项
```ts
class MutableReactiveHandler extends BaseReactiveHandler {
    // ...
  set(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ): boolean {
    //    省略一些判断
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver,
    )
    // ...省略一些触发更新逻辑
    return result
  }

  deleteProperty(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
  ): boolean {
    const result = Reflect.deleteProperty(target, key)
    //   省略一些触发更新逻辑
    return result
  }

  has(target: Record<string | symbol, unknown>, key: string | symbol): boolean {
    const result = Reflect.has(target, key)
    //  省略一些收集依赖逻辑
    return result
  }

  ownKeys(target: Record<string | symbol, unknown>): (string | symbol)[] {
    //  省略一些收集依赖逻辑
    return Reflect.ownKeys(target)
  }
}
```

## 总结
通过分析，我们可以看到 Vue3 在其源码中大量使用了 Reflect 的方法。

比如has方法 ``` const result = Reflect.has(target, key)```有布尔值的返回值类型，利用了Reflect有返回值的特性,并且使用了函数式的调用方式。使得代码更加简洁、可靠和易于维护。因此，Vue3 选择使用 Reflect 而不是直接使用 Object 的方法来处理 Proxy 操作。

Reflect 的这些特性使得它在处理 Proxy 时更加方便和可靠，从而提升了 Vue3 的响应式系统的性能和稳定性。