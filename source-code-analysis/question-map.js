let m1 = new Map()
m1.set('foo', 'bar')
m1.set('baz', 'qux')
m1.name = 'test'

for(let [key, value] of m1){
    console.log(key, value)
}
console.log(m1.name) // test