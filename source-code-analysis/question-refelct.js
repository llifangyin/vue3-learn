// Reflect是个内置的对象 用于拦截js操作。它与proxy对象的方法一一对应
// Reflect 不是一个函数对象，不可构造
// Reflect 的所有属性和方法都是静态的（就像Math对象）

// 静态方法 
// 1. Reflect.get(target, propertyKey[, receiver]) 
// target: 目标对象 propertyKey: 属性名 receiver：如果target对象中指定了getter，receiver则为getter调用时的this值
// 描述：读取对象的属性，但他是通过函数调用来实现的
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

// 2. Reflect.set(target, propertyKey, value, receiver)
let obj3 = {}
Reflect.set(obj3,'x',1)
console.log(obj3) // {x:1}
let arr = [1,2,3]
Reflect.set(arr,1,4)
console.log(arr) // [1,4,3]


class Person {
    constructor(name) {
        this.name = name;
    }
    get greeting() {
        return `Hello, my name is ${this.name}`;
    }
}

const proxyPerson = new Proxy(new Person('Alice'), {
    get(target, property, receiver) {
        if (property === 'greeting') {
            return Reflect.get(target, property, receiver).toUpperCase();
        }
        return Reflect.get(target, property, receiver);
    }
});

console.log(proxyPerson.greeting); // HELLO, MY NAME IS ALICE



// 3. Reflect.has(obj, key)
// 4. Reflect.deleteProperty(obj, key)
// 5. Reflect.construct(target, args)
// 6. Reflect.apply(target, thisArg, args)
// 7. Reflect.defineProperty(target, propertyKey, attributes)
// 8. Reflect.getOwnPropertyDescriptor(target, propertyKey)
// 9. Reflect.getPrototypeOf(obj)
// 10. Reflect.setPrototypeOf(obj, newProto)
// 11. Reflect.isExtensible(obj)
// 12. Reflect.preventExtensions(obj)
// 13. Reflect.ownKeys(obj)


