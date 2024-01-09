
import { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
    search: () => void
}

export const vDebounce: Directive = {
    mounted(el: ElType, binding: DirectiveBinding) {
        let timer: NodeJS.Timeout | null = null
        el.search = () => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                // if (!(window as any).globalConfig.autoSearch) return
                binding.value()
            }, 500)
        }
        el.addEventListener('input', el.search)
    },
    beforeUnmount(el: ElType) {
        el.removeEventListener('input', el.search)
    }
}