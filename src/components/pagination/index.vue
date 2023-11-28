<template>
    <div>
        <el-config-provider :locale="locale">
            <el-pagination v-model:current-page="currentpage" v-model:page-size="currentSize" :page-sizes="pageSize"
                :small="small" layout="total, sizes, prev, pager, next, jumper" background :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-config-provider>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, nextTick, computed, toRef } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import ru from 'element-plus/dist/locale/ru.mjs'

const porps = withDefaults(defineProps<{
    total: number,
    pageSize: number[],
    small: boolean,
}>(), {
    total: 0,
    pageSize: () => [10, 20, 30, 50],
    small: false,
})

const total = toRef(porps, 'total')
const pageSize = toRef(porps, 'pageSize')
// const small = toRef(porps, 'small')

const currentpage = ref(1)


const size = pageSize.value[0]
const currentSize = ref(size)

let getLanguage = localStorage.getItem('Language')
const language = ref('zh-CN')
if (getLanguage) {
    language.value = getLanguage
}
const locale = computed(() => (
    language.value === 'zh-CN' ? zhCn : language.value === 'en' ? en : language.value === 'zh-TW' ? zhTw : ru
))
const emit = defineEmits<{
    'sizeChange': [val: number],
    'currentChange': [val: number]
}>()
const handleSizeChange = (val: number) => {
    currentSize.value = val
    currentpage.value = 1
    emit('sizeChange', val)
}

const handleCurrentChange = (val: number) => {
    currentpage.value = val
    emit('currentChange', val)
}

const resetPage = (page: number, size: number) => {
    currentpage.value = page
    currentSize.value = size
}
onMounted(async () => {
    await nextTick()
    window.addEventListener('setItemEvent', (e) => {
        if (e['key'] == 'Language' && e['newValue']) {
            language.value = e['newValue']
        }
    })
})
defineExpose({ resetPage })
</script>

<style scoped></style>