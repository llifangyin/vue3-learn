export  default function patchStyle(el, preValue, nextValue) {
    const style = el.style
    if (!nextValue) {
        el.removeAttribute('style')
    } else {
        for (const key in nextValue) {
            style[key] = nextValue[key]
        }
        if (preValue) {
            for (const key in preValue) {
                if(nextValue){
                    if (!nextValue[key]) {
                        style[key] = ''
                    }
                }
            }
        }
    }
}