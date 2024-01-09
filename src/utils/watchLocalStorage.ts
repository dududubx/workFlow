
export default function dispatchEventStroage() {
    let signSetItem = localStorage.setItem
    localStorage.setItem = function (key: string, val) {
        let setEvent = new Event('setItemEvent')
        setEvent['key'] = key
        setEvent['newValue'] = val
        window.dispatchEvent(setEvent)
        signSetItem.apply(this, arguments as any)
    }
}