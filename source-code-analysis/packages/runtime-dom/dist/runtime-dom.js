// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  insert(el, parent, anchor) {
    parent.insertBefore(el, anchor || null);
  },
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  createElement(type) {
    return document.createElement(type);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  setText(node, text) {
    node.nodeValue = text;
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSibling(node) {
    return node.nextSibling;
  }
};

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, preValue, nextValue) {
  if (preValue !== nextValue) {
    if (nextValue) {
      el.className = nextValue;
    } else {
      el.className = "";
    }
  }
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, preValue, nextValue) {
  const style = el.style;
  if (!nextValue) {
    el.removeAttribute("style");
  } else {
    for (const key in nextValue) {
      style[key] = nextValue[key];
    }
    if (preValue) {
      for (const key in preValue) {
        if (nextValue) {
          if (!nextValue[key]) {
            style[key] = "";
          }
        }
      }
    }
  }
}

// packages/runtime-dom/src/modules/pathEvent.ts
function createInvoker(nextValue) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = nextValue;
  return invoker;
}
function patchEvent(el, name, nextValue) {
  const invokers = el._vei || (el._vei = {});
  const eventName = name.slice(2).toLowerCase();
  const exist = invokers[name];
  if (nextValue && exist) {
    return exist.value = nextValue;
  }
  if (nextValue) {
    const invoker = invokers[name] = createInvoker(nextValue);
    return el.addEventListener(eventName, invoker);
  }
  if (exist) {
    el.removeEventListener(eventName, exist);
    invokers[name] = void 0;
  }
}

// packages/runtime-dom/src/modules/pathAttr.ts
function pathAttr(el, key, nextValue) {
  if (nextValue == null) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, nextValue);
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preValue, nextValue) {
  if (key === "class") {
    return patchClass(el, preValue, nextValue);
  } else if (key === "style") {
    return patchStyle(el, preValue, nextValue);
  } else if (key[0] === "o" && key[1] === "n") {
    return patchEvent(el, key, nextValue);
  } else {
    return pathAttr(el, key, nextValue);
  }
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isFunction(value) {
  return typeof value === "function";
}
function isString(value) {
  return typeof value === "string";
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);

// packages/runtime-core/src/createVnode.ts
function isVnode(vnode) {
  return vnode.__v_isVNode;
}
var Text = Symbol("Text");
var Fragment = Symbol("Fragment");
function createVNode(type, props, children) {
  const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : (
    //有状态组件
    0
  );
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    key: props?.key,
    //for diff
    el: null,
    //真实节点
    shapeFlag
  };
  if (children) {
    if (Array.isArray(children)) {
      vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
    } else if (isObject(children)) {
      vnode.shapeFlag |= 32 /* SLOTS_CHILDREN */;
    } else {
      children = String(children);
      vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
    }
  }
  return vnode;
}
function isSameVnode(n1, n2) {
  return n1.key === n2.key && n1.type === n2.type;
}

// packages/runtime-core/src/h.ts
function h(type, propsOrChildren, children) {
  let l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      } else {
        return createVNode(type, propsOrChildren);
      }
    }
    return createVNode(type, null, propsOrChildren);
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    }
    if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}

// packages/runtime-core/src/seq.ts
function getSequence(arr) {
  const result = [0];
  let start;
  let end;
  let middle;
  const parentNodeIndex = result.slice(0);
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI != 0) {
      const resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        result.push(i);
        parentNodeIndex[i] = resultLastIndex;
        continue;
      }
    }
    start = 0;
    end = result.length - 1;
    while (start < end) {
      middle = (start + end) / 2 | 0;
      if (arr[result[middle]] < arrI) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    if (arrI < arr[result[start]]) {
      result[start] = i;
      parentNodeIndex[i] = result[start - 1];
    }
  }
  let l = result.length;
  let last = result[l - 1];
  while (l-- > 0) {
    result[l] = last;
    last = parentNodeIndex[last];
  }
  return result;
}

// packages/reactivity/src/effect.ts
function effect(fn, option) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if (option) {
    Object.assign(_effect, option);
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
var activeEffect;
function preCleanEffect(effect4) {
  effect4._depsLength = 0;
  effect4._trackId++;
}
function postCleanEffect(effect4) {
  if (effect4.deps.length > effect4._depsLength) {
    for (let i = effect4._depsLength; i < effect4.deps.length; i++) {
      cleanDepEffect(effect4.deps[i], effect4);
    }
    effect4.deps.length = effect4._depsLength;
  }
}
var ReactiveEffect = class {
  // 默认是脏值
  // 如果fn中依赖的数据发生变化后，需要重新调用scheduler => _effect.run
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    //记录effect执行的次数
    this.active = true;
    // 创建的effect是否处于激活状态
    this.deps = [];
    // 存放effect中用到的属性
    this._depsLength = 0;
    this._running = 0;
    // 是否正在执行 防止嵌套
    this._dirtyLevel = 4 /* Dirty */;
  }
  get dirty() {
    return this._dirtyLevel == 4 /* Dirty */;
  }
  set dirty(val) {
    this._dirtyLevel = val ? 4 /* Dirty */ : 0 /* NoDirty */;
  }
  // fn就是用户传入的函数
  // scheduler 用来调度执行
  run() {
    this._dirtyLevel = 0 /* NoDirty */;
    if (!this.active) {
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      preCleanEffect(this);
      this._running++;
      return this.fn();
    } finally {
      this._running--;
      postCleanEffect(this);
      activeEffect = lastEffect;
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      preCleanEffect(this);
      postCleanEffect(this);
    }
  }
};
function cleanDepEffect(dep, effect4) {
  dep.delete(effect4);
  if (dep.size == 0) {
    dep.cleanup();
  }
}
function trackEffect(effect4, dep) {
  if (dep.get(effect4) !== effect4._trackId) {
    dep.set(effect4, effect4._trackId);
    let oldDep = effect4.deps[effect4._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanDepEffect(oldDep, effect4);
      }
      effect4.deps[effect4._depsLength++] = dep;
    } else {
      effect4._depsLength++;
    }
  }
}
function triggerEffect(dep) {
  for (const effect4 of dep.keys()) {
    if (effect4._dirtyLevel < 4 /* Dirty */) {
      effect4._dirtyLevel = 4 /* Dirty */;
    }
    if (effect4.scheduler) {
      if (!effect4._running) {
        effect4.scheduler();
      }
    }
  }
}

// packages/reactivity/src/reactiveEffect.ts
var targetMap = /* @__PURE__ */ new WeakMap();
var createDep = (cleanup, key) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.name = key;
  return dep;
};
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = /* @__PURE__ */ new Map();
      targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      dep = /* @__PURE__ */ new Map();
      depsMap.set(
        key,
        dep = createDep(
          () => depsMap.delete(key),
          key
          // 删除属性
        )
      );
    }
    trackEffect(activeEffect, dep);
  }
}
function trigger(target, key, value, oldValue) {
  const depMap = targetMap.get(target);
  if (!depMap) {
    return;
  }
  let dep = depMap.get(key);
  if (dep) {
    triggerEffect(dep);
  }
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return result;
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
function reactive(target) {
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target);
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  let proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class {
  //收集对应的effect
  constructor(_rawValue) {
    this._rawValue = _rawValue;
    this.__v_isRef = true;
    this._value = toReactive(_rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this._rawValue) {
      this._rawValue = newValue;
      this._value = newValue;
      triggerRefValue(this);
    }
  }
};
function trackRefValue(ref2) {
  if (activeEffect) {
    console.log(activeEffect, "\u6536\u96C6\u4F9D\u8D56 trackRefValue");
    trackEffect(
      activeEffect,
      ref2.dep = ref2.dep || createDep(() => ref2.dep = void 0, "undefined")
    );
  }
}
function triggerRefValue(ref2) {
  let dep = ref2.dep;
  if (dep) {
    triggerEffect(dep);
  }
}
var ObjectRefImpl = class {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
};
function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
function toRefs(object) {
  const ret = Array.isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
function proxyRefs(objectWidthRef) {
  return new Proxy(objectWidthRef, {
    get(target, key, reveiver) {
      let r = Reflect.get(target, key, reveiver);
      return r.__v_isRef ? r.value : r;
    },
    set(target, key, value, reveiver) {
      const oldvalue = target[key];
      if (oldvalue !== value) {
        if (oldvalue.__v_isRef) {
          oldvalue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, reveiver);
        }
      }
    }
  });
}
function isRef(value) {
  return value ? value.__v_isRef === true : false;
}

// packages/reactivity/src/computed.ts
var ComputedRefImpl = class {
  constructor(getter, setter) {
    this.setter = setter;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      //fn
      () => {
        triggerRefValue(this);
      }
    );
  }
  get value() {
    if (this.effect.dirty) {
      this._value = this.effect.run();
      trackRefValue(this);
    }
    return this._value;
  }
  set value(v) {
    this.setter(v);
  }
};
function computed(getterOroptions) {
  let onlyGetter = isFunction(getterOroptions);
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOroptions;
    setter = () => {
    };
  } else {
    getter = getterOroptions.get;
    setter = getterOroptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}

// packages/reactivity/src/apiWatch.ts
function watch(source, cb, options = {}) {
  return doWatch(source, cb, options);
}
function traverse(source, depth, currentDepth = 0, seen = /* @__PURE__ */ new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (depth) {
    if (currentDepth >= depth) {
      return source;
    }
    currentDepth++;
  }
  if (seen.has(source)) {
    return source;
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, seen);
  }
  return source;
}
function watchEffect(getter, options = {}) {
  return doWatch(getter, null, options);
}
function doWatch(source, cb, { deep, immediate }) {
  const reactiveGetter = (source2) => traverse(source2, deep == false ? 1 : void 0);
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => {
      return source.value;
    };
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  let clean;
  const onCleanUp = (fn) => {
    clean = () => {
      fn();
      clean = void 0;
    };
  };
  const job = () => {
    if (cb) {
      const newValue = effect4.run();
      if (clean) {
        clean();
      }
      cb(newValue, oldValue, onCleanUp);
      oldValue = newValue;
    } else {
      effect4.run();
    }
  };
  const effect4 = new ReactiveEffect(getter, job);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect4.run();
    }
  } else {
    effect4.run();
  }
  const unwatch = () => {
    effect4.stop();
  };
  return unwatch;
}

// packages/runtime-core/src/scheduler.ts
var queue = [];
var isFlushing = false;
var resolvedPromise = Promise.resolve();
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvedPromise.then(() => {
      isFlushing = false;
      let copy = queue.slice(0);
      queue.length = 0;
      copy.forEach((job2) => job2());
      copy.length = 0;
    });
  }
}

// packages/runtime-core/src/component.ts
function createComponentInstance(vnode) {
  const instance = {
    data: null,
    vnode,
    subTree: null,
    //子树
    isMounted: false,
    update: null,
    //更新函数
    props: {},
    attrs: {},
    slots: {},
    //插槽
    propsOptions: vnode.type.props,
    //用户传入的props
    component: null,
    proxy: null,
    //代理props attrs data 可以直接访问
    setupState: null
    // setup返回的状态
  };
  return instance;
}
var initProps = (instance, rawProps) => {
  const props = {};
  const attrs = {};
  const propsOptions = instance.propsOptions || {};
  if (rawProps) {
    for (let key in rawProps) {
      const value = rawProps[key];
      if (key in propsOptions) {
        props[key] = value;
      } else {
        attrs[key] = value;
      }
    }
  }
  instance.props = reactive(props);
  instance.attrs = attrs;
};
var initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
    instance.slots = children;
  } else {
    instance.slots = {};
  }
};
var publicProperty = {
  $attrs: (instance) => instance.attrs,
  $slots: (instance) => instance.slots
  // ...
};
var handler = {
  get(target, key) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    } else if (setupState && hasOwn(setupState, key)) {
      return setupState[key];
    }
    const getter = publicProperty[key];
    if (getter) {
      return getter(target);
    }
  },
  set(target, key, value) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
    } else if (props && hasOwn(props, key)) {
      console.warn("props is readonly");
      return false;
    } else if (setupState && hasOwn(setupState, key)) {
      setupState[key] = value;
    }
    return true;
  }
};
function setupComponent(instance) {
  const { vnode } = instance;
  initProps(instance, vnode.props);
  initSlots(instance, vnode.children);
  instance.proxy = new Proxy(instance, handler);
  const { data = () => {
  }, render: render2, setup } = vnode.type;
  if (setup) {
    const setupContext = {};
    const setupResult = setup(instance.props, setupContext);
    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else {
      instance.setupState = proxyRefs(setupResult);
    }
  }
  if (!isFunction(data)) {
    console.warn("data must be a function");
  } else {
    instance.data = reactive(data.call(instance.proxy));
  }
  if (!instance.render) {
    instance.render = render2;
  }
}

// packages/runtime-core/src/renderer.ts
function createRenderer(renderOptions2) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions2;
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  const mountElement = (vnode, container, anchor) => {
    const { type, props, children, shapeFlag } = vnode;
    const el = vnode.el = hostCreateElement(type);
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(el, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(children, el);
    }
    hostInsert(el, container, anchor);
  };
  const processElement = (n1, n2, container, anchor) => {
    if (n1 == null) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const patchProps = (el, oldProps, newProps) => {
    for (const key in newProps) {
      const prev = oldProps[key];
      const next = newProps[key];
      hostPatchProp(el, key, prev, next);
    }
    for (const key in oldProps) {
      if (!newProps.hasOwnProperty(key)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = c2[nextPos]?.el;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]);
          i++;
        }
      }
    }
    let s1 = i;
    let s2 = i;
    const keyToNewIndexMap = /* @__PURE__ */ new Map();
    let toBePatched = e2 - s2 + 1;
    let newIndexToOldMapIndex = new Array(toBePatched).fill(0);
    for (let i2 = s2; i2 <= e2; i2++) {
      const nextChild = c2[i2];
      keyToNewIndexMap.set(nextChild.key, i2);
    }
    for (let i2 = s1; i2 <= e1; i2++) {
      const prevChild = c1[i2];
      const newIndex = keyToNewIndexMap.get(prevChild.key);
      if (newIndex == void 0) {
        unmount(prevChild);
      } else {
        newIndexToOldMapIndex[newIndex - s2] = i2 + 1;
        patch(prevChild, c2[newIndex], el);
      }
    }
    const increasingSeq = getSequence(newIndexToOldMapIndex);
    let j = increasingSeq.length - 1;
    for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
      let newIndex = s2 + i2;
      let anchor = c2[newIndex + 1]?.el;
      if (c2[newIndex].el) {
        if (i2 == increasingSeq[j]) {
          j--;
        } else {
          hostInsert(c2[newIndex].el, el, anchor);
        }
      } else {
        patch(null, c2[newIndex], el, anchor);
      }
    }
  };
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    } else {
      if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          patchKeyedChildren(c1, c2, el);
        } else {
          unmountChildren(c1);
        }
      } else {
        if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
          hostSetElementText(el, "");
        }
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          mountChildren(c2, el);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    let el = n2.el = n1.el;
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    patchProps(el, oldProps, newProps);
    patchChildren(n1, n2, el);
  };
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      n2.el = hostCreateText(n2.children, container);
      hostInsert(n2.el, container);
    } else {
      const el = n2.el = n1.el;
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processFragment = (n1, n2, container) => {
    if (n1 == null) {
      mountChildren(n2.children, container);
    } else {
      patchChildren(n1, n2, container);
    }
  };
  const updateProps = (instance, prevProps, nextProps) => {
    if (hasPropsChange(prevProps, nextProps)) {
      for (let key in nextProps) {
        instance.props[key] = nextProps[key];
      }
      for (let key in prevProps) {
        if (!(key in nextProps)) {
          delete instance.props[key];
        }
      }
    }
  };
  const updateComponentPreRender = (instance, nextVNode, container) => {
    instance.next = null;
    instance.vnode = nextVNode;
    updateProps(instance, instance.props, nextVNode.props);
  };
  function setupRenderEffect(instance, container, anchor) {
    const componentUpdateFn = () => {
      const { render: render3 } = instance;
      if (!instance.isMounted) {
        const subTree = render3.call(instance.proxy, instance.proxy);
        instance.subTree = subTree;
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
      } else {
        if (instance.next) {
          updateComponentPreRender(instance, instance.next, container);
        }
        const prev = instance.subTree;
        const next = render3.call(instance.proxy, instance.proxy);
        patch(prev, next, container, anchor);
        instance.subTree = next;
      }
    };
    const effect4 = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update)
    );
    const update = instance.update = () => {
      effect4.run();
    };
    update();
  }
  const mountComponent = (vnode, container, anchor) => {
    const instance = vnode.component = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container, anchor);
  };
  const hasPropsChange = (prevProps, nextProps) => {
    const nextKeys = Object.keys(nextProps);
    if (prevProps.length !== nextKeys.length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (prevProps[key] !== nextProps[key]) {
        return true;
      }
    }
    return false;
  };
  const shouldUpdateComponent = (n1, n2) => {
    const { props: prevProps, children: preChildren } = n1;
    const { props: nextProps, children: nextChildren } = n2;
    if (preChildren || nextChildren) {
      return true;
    }
    if (hasPropsChange(prevProps, nextProps)) {
      return true;
    }
    return false;
  };
  const updateComponent = (n1, n2) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;
      instance.update();
    }
  };
  const processComponent = (n1, n2, container, anchor) => {
    if (n1 == null) {
      mountComponent(n2, container, anchor);
    } else {
      updateComponent(n1, n2);
    }
  };
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 == n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }
    const { type, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      case Fragment:
        processFragment(n1, n2, container);
        break;
      default:
        if (shapeFlag & 1 /* ELEMENT */) {
          processElement(n1, n2, container, anchor);
        } else if (shapeFlag & 6 /* COMPONENT */) {
          processComponent(n1, n2, container, anchor);
        }
    }
  };
  const unmount = (vnode) => {
    if (vnode.type == Fragment) {
      unmountChildren(vnode.children);
    } else {
      hostRemove(vnode.el);
    }
  };
  const render2 = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return {
    render: render2
  };
}

// packages/runtime-dom/src/index.ts
var renderOptions = Object.assign({ patchProp }, nodeOps);
var render = (vnode, container) => {
  return createRenderer(renderOptions).render(vnode, container);
};
export {
  Fragment,
  ReactiveEffect,
  Text,
  activeEffect,
  computed,
  createRenderer,
  createVNode,
  effect,
  h,
  isReactive,
  isRef,
  isSameVnode,
  isVnode,
  proxyRefs,
  reactive,
  ref,
  render,
  toReactive,
  toRef,
  toRefs,
  trackEffect,
  trackRefValue,
  triggerEffect,
  triggerRefValue,
  watch,
  watchEffect
};
//# sourceMappingURL=runtime-dom.js.map
