<template>
  <div>
    <h2>自定义元素</h2>
    <h3>defineCustomElement 与defineComponent系统，返回一个原生自定义元素类构造函数</h3>
    <my-vue-element></my-vue-element>

    <h3>useHost 一个组合式 API 辅助函数，返回当前 Vue 自定义元素的宿主元(3.5+)</h3>
    <h3>useShadowRoot  一个组合式 API 辅助函数，返回当前 Vue 自定义元素的 shadow root</h3>
    <h3>this.$host 一个选项式 API 的 property，暴露当前 Vue 自定义元素的宿主元素。</h3>
    <h2>渲染函数 h(tag,props,children)</h2>
    <ele1></ele1>
    <ele2></ele2>
    <ele3></ele3>
    <ele4></ele4>
    <ele5></ele5>
    <ele6></ele6>
    <ele7></ele7>
    <ele8></ele8>

    <h2>mergeProps 合并多个props对象，用于处理含有特定的props参数的情况</h2>
    <h2>cloneVNode </h2>
    <clonednode></clonednode>
    <h2>idVNode</h2>
    <h2>resolveComponent 按名称解析已注册的组件 必须在setup内调用</h2>
    <h3>用于动态组件渲染</h3>
    <h2>resolveDirective 按名称手动解析已注册的指令</h2>
    <h2>widthDirectives 给Vnode添加自定义指令</h2>
    <ele9></ele9>
    <h2>withModifier 给事件处理器添加v-on修饰符</h2>
    <ele10></ele10>
  </div>
</template>
<script  setup>
import { watchEffect, useAttrs, defineCustomElement, h, mergeProps ,cloneVNode,
  isVNode,withDirectives,onMounted,withModifiers,
} from 'vue';
import Element from './element.vue'

// 渲染函数
// h(tag,props,children)
const foo = 'foo'
const bar = 'bar'
const ele1 = h('p')
const ele2 = h('div',{id:'#foo'})
const ele3 = h('div',{class:'bar',innerHTML:'hello'})//innerHTML可以赋值子元素的
// 数据对象形式绑定
const ele4 = h('div',{class:[foo,{bar}],style:{color:'red'},innerHTML:'<h1>hello</h1>'})
// 事件监听器 onXxx
const ele5 = h('div',{onClick:()=>{console.log('click')},innerHTML:'<h1>click me</h1>'})
// children可以是个字符串
const ele7 = h('div',{id:'test'},'hello')
const ele6 = h('div','hello')//props可以省略
// children可以是个数组 同时包含vnode和字符串
const ele8 = h('div',['hello','world',h('span','test')])//children可以是个数组


// mergeProps 支持一下参数的处理，将他们合并为一个对象。 class  style onXxx事件
const handleA = ()=>{console.log('clickA')}
const handleB = ()=>{console.log('clickB')}
const one = {
  class:'foo',
  onClick:handleA
}
const two = {
  class:'bar',
  style:{
    color:'red'
  },
  onClick:handleB
}

const merged =  mergeProps(one,two)
console.log(merged,'merged')

const clonednode = cloneVNode(ele8,{class:'foo'})


console.log(isVNode(ele8),'isVNode')

// widthDirective 给Vnode添加自定义指令
// [Directive, value, argument, modifiers] 
const pin = {
  mounted(el,binding,vnode,prevVnode){
    console.log(el,binding,vnode,prevVnode)
    console.log('with directive')
  }
}
const ele9 = withDirectives(h('div','vnode directive'),[[pin,200,'top',{animate:true}]])

// withModifiers  (fn,modifiers)  给事件处理器添加v-on修饰符 [right, left, middle, passive, capture]
const ele10 = h('button',{
  onClick: withModifiers(() => { console.log('click') },['stop', 'prevent'])
},'widthmodifiers ')

// 动态解析组件
// const ComponentA = resolveComponent('ComponentA')

// defineCustomElement  支持常规组件  styles configureApp shadowRoot nonce
// const MyVueElement = defineCustomElement(Element,{
//   styles:`
//     h3{
//       color:red;
//     }
//   `,
//   configureApp(app){ 
//     app.config.globalProperties.$nonce = '123'
//   },
//   shadowRoot:{ // shadowRoot配置 mode:'open' | 'closed'
//     mode:'open'
//   },
//   nonce:'123'// 会传递给shadowRoot
// })
// 返回值是一个自定义元素构造函数，可以使用 customElements.define() 注册。

// 注册自定义元素
// customElements.define('my-vue-element',MyVueElement)

</script>

<style scoped>

</style>