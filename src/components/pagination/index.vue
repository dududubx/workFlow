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
import { setLanguage } from '@/hooks/setLanguage'

const porps = withDefaults(defineProps<{
    total: number,
    pageSize: number[],
    small?: boolean,
}>(), {
    total: 0,
    pageSize: () => [10, 20, 30, 50],
    small: false,
})

const total = toRef(porps, 'total')
const pageSize = toRef(porps, 'pageSize')
const { locale } = setLanguage()
// const small = toRef(porps, 'small')

const currentpage = ref(1)


const size = pageSize.value[0]
const currentSize = ref(size)

// let getLanguage = localStorage.getItem('Language')
// const language = ref('zh-CN')
// if (getLanguage) {
//     language.value = getLanguage
// }
// const locale = computed(() => (
//     language.value === 'zh-CN' ? zhCn : language.value === 'en' ? en : language.value === 'zh-TW' ? zhTw : ru
// ))
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
    // await nextTick()
    // window.addEventListener('setItemEvent', (e) => {
    //     if (e['key'] == 'Language' && e['newValue']) {
    //         language.value = e['newValue']
    //     }
    // })
})
defineExpose({ resetPage })
</script>

<style scoped lang="less">
:deep(.el-pagination) {
    padding-top: 15px;
    justify-content: flex-end;

    .is-first {
        color: #303133;
        font-size: 14px;
    }

    .el-input__inner {
        color: #303133;
    }

    .el-pagination__jump {
        color: #303133;
    }

    .btn-next,
    .btn-prev,
    .el-pager li {
        background-color: #f0f2f5;
        border-radius: 4px;
    }

    .el-pager li.is-active {
        background: linear-gradient(90deg, #0080ff 0%, #4cdcec 100%);
        color: #fff;
    }
}
</style>