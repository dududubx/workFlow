<template>
    <div class="choose_form">
        <el-dialog style="height:610px" :width="800" v-model="dialogFromVisible" :title="maslg('选择表单')"
            :close-on-click-modal="false" align-center :draggable="true">
            <div class="choose_form-top">
                <div class="top_box">
                    <div class="top_text">
                        {{ maslg('表单分类:') }}
                    </div>
                    <el-select v-model="chooseCategory" :placeholder="maslg('请选择表单分类')" class="top_input">
                        <el-option v-for="item in categorData" :key="item.F_ItemId" :label="item.F_ItemName"
                            :value="item.F_ItemValue"></el-option>
                    </el-select>
                </div>
                <div class="top_box">
                    <div class="top_text">
                        {{ maslg('表单名称:') }}
                    </div>
                    <el-input v-regCharacter :maxlength="maxlength" v-model="chooseName" :placeholder="maslg('请输入表单名称')"
                        class="top_input" clearable></el-input>
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
            <el-table :data="tableData" border style="width: 100%" height="400" :show-overflow-tooltip="true"
                header-row-class-name="checker_table" highlight-current-row @row-click="selectRow" ref="formTable"
                v-loading="tableLoading">
                <el-table-column type="index" width="50" />
                <el-table-column :prop="formName" :label="maslg('表单名称')"></el-table-column>
                <el-table-column :prop="formNo" :label="maslg('表单代码')"></el-table-column>
            </el-table>
            <!-- <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="currentpage" v-model:page-size="pagesize"
                    :page-sizes="[10, 20, 30, 50]" small layout="total, sizes, prev, pager, next, jumper" background
                    :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-config-provider> -->
            <pagination :total="total" :pageSize="pageSize" :small="false" @sizeChange="sizeChange"
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
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, toRaw, nextTick, onMounted } from 'vue'
import pagination from '../pagination/index.vue'
import { checkPointApi } from '@/api/checkpoint'
import { ElMessage, TableInstance } from 'element-plus';
const { proxy } = <ComponentInternalInstance>getCurrentInstance()


const dialogFromVisible = ref(false)
const chooseCategory = ref('')
const chooseName = ref('')

const tableData = ref([])

const SearchClick = () => {
    params.category = chooseCategory.value
    params.keyword = chooseName.value
    let obj = {
        FormTypeId: chooseCategory.value,
        FormNameLike: chooseName.value
    }
    params.queryJson = JSON.stringify(obj)
    params.page = 1
    getData()
}

const resetClick = () => {
    chooseCategory.value = ''
    chooseName.value = ''
    params.category = ''
    params.keyword = ''
    params.queryJson = ''
    params.page = 1
    getData()
    paginationBox.value?.resetPage(params.page, params.rows)
}

const formTable = ref<TableInstance>()
const total = ref(0)
const pageSize = [10, 20, 30, 50]
const sizeChange = (val: number) => {
    params.rows = val
    params.page = 1
    clickRowData = {}
    getData()
}
const currentChange = (val: number) => {
    params.page = val
    clickRowData = {}
    getData()
}

const params = reactive({
    rows: 10,
    page: 1,
    category: '',
    keyword: '',
    queryJson: ''
})
const formName = ref('')
const formNo = ref('')
const tableLoading = ref(false)
const getData = () => {
    let openApi = formType == '2' ? 'getXA_NForm' : 'getFormData'
    formName.value = formType == '2' ? 'FormName' : 'F_Name'
    formNo.value = formType == '2' ? 'FormNo' : 'F_No'
    tableLoading.value = true
    checkPointApi[openApi](params).then(res => {
        if (res.code == 200) {
            tableData.value = res.data.rows
            total.value = res.data.records
            if (Object.keys(clickRowData).length > 0) {
                let setData = tableData.value.find((item: any) => {
                    return formType == '2' ? item.ID == clickRowData.ID : item.F_Id == clickRowData.F_Id
                })
                nextTick(() => {
                    formTable.value!.setCurrentRow(setData)
                })
            }
            tableLoading.value = false
        }
    }).catch(err => {
        tableLoading.value = false
        ElMessage.error({
            message: '获取表单数据失败'
        })
    })
}
const categorData = ref()
const getCategoryData = () => {
    let params = {
        code: 'FormSort'
    }
    checkPointApi.getFormCategory(params).then((res: any) => {
        if (res.code == 200) {
            categorData.value = res.data
        }

    }).catch(err => {
        ElMessage.error('获取表单分类数据失败')
    })
}
let formType = ''
const paginationBox = ref()
let original: pointFormData[] = []
const openDialog = (val: string, ischange: boolean, rowsData: tableData, originalData: pointFormData[]) => {
    if (val != '0') {
        formType = val
        if (ischange) {
            params.rows = 10
            params.page = 1
            params.category = ''
            params.keyword = ''
            params.queryJson = ''
            chooseCategory.value = ''
            chooseName.value = ''
            paginationBox.value?.resetPage(params.page, params.rows)
        }
        original = originalData
        // if (Object.keys(paramsData).length > 0) {
        //     for (let i in params) {
        //         params[i] = paramsData[i]
        //     }
        //     chooseCategory.value = formType == '0' ? params.category : params.queryJson ? JSON.parse(params.queryJson).FormTypeId : ''
        //     chooseName.value = formType == '0' ? params.keyword : params.queryJson ? JSON.parse(params.queryJson).FormNameLike : ''
        //     paginationBox.value?.resetPage(params.page, params.rows)
        // }
        clickRowData = rowsData
        getData()
    }
    dialogFromVisible.value = true
}
let clickRowData: tableData = {}
const selectRow = (val: tableData) => {
    // let id = original.formType == '0' ? original[0].rowsData?.ID : original[0].rowsData?.F_Id
    clickRowData = val
    clickRowData['formType'] = 'workForm'
}
const handleClose = () => {
    dialogFromVisible.value = false

}
const submitForm = () => {
    if (!clickRowData) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请选择表单')
        })
    }
    let find;
    if (original.length > 1) {
        find = original.find(item => {
            return item.formType == '2' ? clickRowData.ID == item.rowsData?.ID : item.formType == '1' ? clickRowData.F_Id == item.rowsData?.F_Id : undefined
        })
    }
    if (find) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('表单已设置')
        })
    }
    clickRowData['label'] = formType == '2' ? (clickRowData.FormName as string) : clickRowData.F_Name as string
    clickRowData['value'] = formType == '2' ? clickRowData.ID : clickRowData.F_Id
    emit('sendClickData', clickRowData)
    dialogFromVisible.value = false
}

const emit = defineEmits<{
    'sendClickData': [data: any]
}>()
onMounted(() => {
    getCategoryData()
})
defineExpose({
    openDialog
})
</script>

<style scoped></style>