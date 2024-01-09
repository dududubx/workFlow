


export function debounce() {
    let timer
    function debounceFunction(callback: Function) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback && callback()
        }, 500)
    }

    return {
        debounceFunction,
    }
}