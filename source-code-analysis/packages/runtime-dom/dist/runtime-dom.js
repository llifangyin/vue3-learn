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
function isString(value) {
  return typeof value === "string";
}

// packages/runtime-core/src/createVnode.ts
function isVnode(vnode) {
  return vnode.__v_isVNode;
}
var Text = Symbol("Text");
function createVNode(type, props, children) {
  const shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
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
    console.log(newIndexToOldMapIndex, "newIndexToOldMapIndex");
    const increasingSeq = getSequence(newIndexToOldMapIndex);
    console.log(increasingSeq, "increasingSeq");
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
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 == n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }
    const { type } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        processElement(n1, n2, container, anchor);
    }
  };
  const unmount = (vnode) => {
    hostRemove(vnode.el);
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
  Text,
  createRenderer,
  createVNode,
  h,
  isSameVnode,
  isVnode,
  render
};
//# sourceMappingURL=runtime-dom.js.map
