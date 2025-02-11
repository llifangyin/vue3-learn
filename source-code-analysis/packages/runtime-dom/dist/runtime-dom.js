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
        if (!nextValue[key]) {
          style[key] = "";
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

// packages/runtime-core/src/index.ts
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
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode;
    const el = vnode.el = hostCreateElement(type);
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, {}, props[key]);
      }
    }
    console.log(vnode, "vnode");
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(el, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
  };
  const patchElement = (n1, n2, container) => {
  };
  const patch = (n1, n2, container) => {
    if (n1 == n2) {
      return;
    }
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const render2 = (vnode, container) => {
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
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
  createRenderer,
  render
};
//# sourceMappingURL=runtime-dom.js.map
