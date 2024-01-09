import { ref, reactive, onMounted, nextTick, computed, toRef } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import ru from 'element-plus/dist/locale/ru.mjs'

export function setLanguage() {
    let getLanguage = localStorage.getItem('Language')
    const language = ref('zh-CN')
    if (getLanguage) {
        language.value = getLanguage
    }
    const locale = computed(() => (
        language.value === 'Ru' ? ru : language.value === 'en' ? en : language.value === 'zh-TW' ? zhTw : zhCn
    ))
    onMounted(async () => {
        await nextTick()
        window.addEventListener('setItemEvent', (e) => {
            if (e['key'] == 'Language' && e['newValue']) {
                language.value = e['newValue']
            }
        })
    })
    return {
        locale
    }
}
