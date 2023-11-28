import { createApp } from 'vue'
import './style.css'
import '@/assets/style/custom.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import TreeFilter from "@/components/TreeFilter/index.vue";
import contentBox from './components/contentBox/contentBox.vue'
import dispatchEventStroage from '@/utils/watchLocalStorage'
import { createPinia } from 'pinia'
import router from './router'
import Regcharacter from './directive/inputCharacter'

const app = createApp(App)
app.config.globalProperties.maslg = (text: string) => {
    return ((window as any).maslg && (window as any).maslg.get(text)) || text
}
app.config.globalProperties.maxlength = 50
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        maslg: (text: string) => string,
        maxlength: number
    }
}

const pinia = createPinia()
app.component('content-box', contentBox)
app.use(dispatchEventStroage)
app.use(router)
app.directive('regCharacter', Regcharacter)
app.use(ElementPlus).use(pinia).component('TreeFilter', TreeFilter).mount('#app')
