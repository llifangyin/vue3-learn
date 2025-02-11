export default function pathAttr(el, key, nextValue) {
    if (nextValue == null) {
        el.removeAttribute(key);
    }
    else {
        el.setAttribute(key, nextValue);
    }

}