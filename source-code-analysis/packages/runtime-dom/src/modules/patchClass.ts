export default function patchClass(el, preValue, nextValue) {
    if (preValue !== nextValue) {
        if (nextValue) {
            el.className = nextValue;
        }
        else {
            el.className = '';
        }
    }

}