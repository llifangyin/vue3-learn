const person = {
    name: 'John',
    get aliasName(){
        console.log('get aliasName')
        return this.name + ' Doe';
    }
}
let proxyPerson = new Proxy(person, {
    get(target, key,recevier){
        // recevier 代理对象 ;  target 代理目标对象 person
        console.log(key,'key')
        // return target[key]; //person.name不会触发get
        // return recevier[key]; //死循环
        return Reflect.get(target, key, recevier);
        // reflect功能 将目标对象的属性读取操作转发到目标对象的get方法
        // 将 target[key] 转发到 target.get(key)
    }
});
// console.log(person.aliasName) // John Doe
// console.log(proxyPerson.name) // 
console.log(proxyPerson.aliasName) // John Doe