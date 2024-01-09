<template>
    <el-dialog :width="props.width" :style="{ height: height }" v-model="dialogFromVisible" :title="maslg(props.title)"
        :close-on-click-modal="false" align-center :draggable="true">
        <div class="choose_form-top">
            <!-- <div class="top_box">
                <div class="top_text">
                    {{ maslg('流程分类:') }}
                </div>
                <el-select v-model="chooseCategory" :placeholder="maslg('请选择表单分类')" class="top_input" clearable>
                    <el-option v-for="item in categorData" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </div> -->
            <div class="top_box">
                <div class="top_text">
                    {{ maslg('流程名称:') }}
                </div>
                <el-input v-regCharacter v-debounce="SearchClick" :maxlength="maxlength" v-model="chooseName"
                    :placeholder="maslg('请输入流程名称')" class="top_input" clearable></el-input>
            </div>
            <div class="top_btn">
                <el-button type="primary" class="search_btn searchform_btn" @click="SearchClick">{{
                    maslg('查询')
                }}</el-button>
                <el-button type="primary" class="reload_btn searchform_btn" @click="resetClick">{{
                    maslg('重置')
                }}</el-button>
            </div>
        </div>
        <el-table :data="apiTableData.length > 0 ? apiTableData : tableData" border style="width: 100%;" :height="440"
            :show-overflow-tooltip="true" header-row-class-name="checker_table" highlight-current-row @row-click="selectRow"
            ref="formTable" v-loading="tableLoading" :empty-text="maslg('无数据')">
            <el-table-column type="index" width="50" />
            <el-table-column v-for="item in tableColumn" :key="item.prop" :prop="item.prop" :label="item.label"
                :width="item.width">
                <template #default="scope" v-if="item.isCustom">
                    <slot name="customColumn" :scope="scope" :data="item"></slot>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="apiTotal" :pageSize="pageSize" :small="false" @sizeChange="sizeChange"
            @currentChange="currentChange" ref="paginationBox">
        </pagination>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">{{ maslg('关闭') }}</el-button>
                <el-button type="primary" @click="submitForm">
                    {{ maslg('确认') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import pagination from '@/components/pagination/index.vue'
import { AxiosResponse } from 'axios';
import { ElMessage, TableInstance } from 'element-plus';
import { debounce } from '@/hooks/debounce';

const { proxy } = <ComponentInternalInstance>getCurrentInstance()
interface propsType {
    width?: string | number,//弹窗宽度
    height?: string,
    title: string,//弹窗名称
    tableData?: any[],//表格数据
    tableColumn: {
        prop: string,
        label: string,
        width?: string,
        isCustom?: boolean
    }[],
    tableLoading?: boolean,
    pageSize: number[],
    total?: number,
    tablesApi?: (params: object) => Promise<AxiosResponse<any, any>>,
    categorData?: { label: string, value: string }[]
}
const emit = defineEmits<{
    'returnFlowData': [val: any]
}>()
const props = withDefaults(defineProps<propsType>(), {
    width: 800,
    title: '',
    height: '63%'
})
const apiTableData = ref<any[]>([])
const apiTotal = ref<number>(0)
const chooseCategory = ref('')
const params = reactive({
    rows: props.pageSize[0],
    page: 1,
    queryJson: ''
})
const searchParam = {
    keyword: '',
    // Category: ''
}
const formTable = ref<TableInstance>()
const fromApiData = () => {
    props.tablesApi!(params).then((res: any) => {
        if (res.code == 200) {
            apiTableData.value = res.data.rows
            apiTotal.value = res.data.records
            if (selectRowData.value) {
                let setData = apiTableData.value.find((item: any) => {
                    return item.F_Id == selectRowData.value.F_Id
                })
                nextTick(() => {
                    formTable.value!.setCurrentRow(setData)
                })
            }
        }
        else {
            ElMessage.error(proxy?.maslg(res.info))
        }
    }).catch(err => {
        console.log(err);

        ElMessage.error(proxy?.maslg('获取表格数据失败'))
    })
}

watch(() => props.tablesApi, (val) => {
    if (val) {
        fromApiData()
    }
}, {
    immediate: true
})
const chooseName = ref('')
const { debounceFunction } = debounce()
const SearchClick = () => {
    // searchParam.Category = chooseCategory.value
    searchParam.keyword = chooseName.value
    params.queryJson = JSON.stringify(searchParam)
    fromApiData()
}
const resetClick = () => {
    // searchParam.Category = ''
    searchParam.keyword = ''
    chooseName.value = ''
    chooseCategory.value = ''
    params.rows = props.pageSize[0]
    params.page = 1
    params.queryJson = ''
    fromApiData()
}
const sizeChange = (val: number) => {
    params.rows = val
    fromApiData()
}
const selectRowData = ref<any>()
const selectRow = (row: any) => {
    selectRowData.value = row
}
const currentChange = (val: number) => {
    params.page = val
    fromApiData()
}
const handleClose = () => {
    dialogFromVisible.value = false
}
const submitForm = () => {
    if (!selectRowData.value) {
        return ElMessage.error(proxy?.maslg('请选择数据'))
    }
    emit('returnFlowData', selectRowData.value)
    dialogFromVisible.value = false
}

const returnBackChooseRow = (val: any) => {
    selectRowData.value = val
    // fromApiData()
}
const dialogFromVisible = ref(false)
defineExpose({ dialogFromVisible, returnBackChooseRow })
</script>

<style scoped></style>