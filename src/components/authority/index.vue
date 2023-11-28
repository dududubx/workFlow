<template>
    <div class="authority_table">
        <el-dialog style="height:610px" :width="800" v-model="dialogFromVisible" :title="maslg('设置表单字段/控件权限')"
            :close-on-click-modal="false" align-center :draggable="true">
            <div class="authority_table-top">
                <el-tabs v-model="activeName" @tab-change="changeTab">
                    <el-tab-pane v-for="(item, index) in tabsData" :key="item.ID" :name="item.ID"
                        :label="item.TableName"></el-tab-pane>
                </el-tabs>
            </div>
            <el-table :data="tableData" border style="width: 100%" height="440" :show-overflow-tooltip="true"
                header-row-class-name="checker_table" v-loading="tableLoading">
                <el-table-column prop="fieldName" :label="maslg('字段名称')"></el-table-column>
                <el-table-column prop="fieldCode" :label="maslg('字段代码')"></el-table-column>
                <el-table-column prop="operate" :label="maslg('操作')">
                    <template #default="scope">
                        <el-checkbox label="isLook" v-model="scope.row.isLook">{{ maslg('查看') }} </el-checkbox>
                        <el-checkbox label="isEdit" v-model="scope.row.isEdit" v-if="!onlyLook">{{ maslg('编辑') }}
                        </el-checkbox>
                        <el-checkbox label="isNotNull" v-model="scope.row.isNotNull" v-if="!onlyLook">{{ maslg('必填') }}
                        </el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
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
import { ref, reactive, toRaw, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { ElMessage, TabPaneName } from 'element-plus';
import { checkPointApi } from '@/api/checkpoint';

const { proxy } = <ComponentInternalInstance>getCurrentInstance()
// interface differentData {

// }

const emit = defineEmits<{
    'sendFieldData': [formData: any[], fieldData: authorityTable[]]
}>()

//表格展示数据
const tableData = ref<authorityTable[]>([])
//所有数据
const tableAllData = ref<authorityTable[]>([])
const dialogFromVisible = ref(false)
const activeName = ref('')

const handleClose = () => {
    dialogFromVisible.value = false
}
const submitForm = () => {
    emit('sendFieldData', toRaw(tabsData).value, toRaw(tableAllData).value)
    dialogFromVisible.value = false
}
const tabsData = ref<any[]>([])
const tableLoading = ref(false)
const onlyLook = ref(false)
const openDialog = async (val: pointFormData, id: string, look: boolean) => {
    dialogFromVisible.value = true
    onlyLook.value = look
    if (val.tabsData.length > 0) {
        tabsData.value = val.tabsData
        activeName.value = tabsData.value[0].ID
    }
    tableAllData.value = val.fieldData
    setTableData(activeName.value)
}
const changeTab = (name: TabPaneName) => {
    setTableData(name)
}

const setTableData = (name: TabPaneName) => {
    tableData.value = []
    tableAllData.value.map(item => {
        if (item.TableId == name && item.IsHide != '1') {
            tableData.value.push(item)
        }
    })
}
defineExpose({
    openDialog
})
</script>

<style scoped></style>