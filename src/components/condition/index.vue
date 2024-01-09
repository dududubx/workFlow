<template>
    <div class="condition">
        <el-collapse accordion v-model="collapseClick">
            <el-collapse-item :title="maslg('条件判断节点配置')" name="0">
                <el-form ref="condition" :model="conditionData" :rules="conditionRules" label-position="left"
                    @submit.native.prevent label-width="100px">
                    <el-form-item prop="name" :label="maslg('节点名称')">
                        <el-input v-regCharacter :maxlength="maxlength" v-model="conditionData.name"
                            :placeholder="maslg('请输入节点名称')" clearable @input="changPointName"></el-input>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item :title="maslg('判断条件设置')" class="collapse_form" name="1">
                <div class="pointForm" v-for="(item, index) in conditionData.conditionFormData" :key="index">
                    <div class=" condition-form">
                        <div class="title">{{ maslg('高级模式') }}</div>
                        <div class="switch_item">
                            <el-switch v-model="item.pattern"></el-switch>
                        </div>
                    </div>
                    <div class="condition-form" v-show="item.pattern">
                        <div class="title">{{ maslg('数据库表') }}</div>
                        <div class="condition-form_select">
                            <el-input v-model="item.databaseTable" class="select_input center_input"
                                @click="openChooseForm(item)" :readonly="true">
                                <template #append>
                                    <el-icon @click="openChooseForm(item)">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="condition-form" v-show="item.pattern">
                        <div class=" title">{{ maslg('关联主键字段') }}</div>
                        <div class="condition-form_select">
                            <el-select v-model="item.primaryKeyField" :placeholder="maslg('请选择关联主键字段')" clearable>
                                <el-option v-for="citem in item.primaryFieldData" :key="citem.value" :value="citem.value"
                                    :label="citem.label"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="condition-form">
                        <div class=" title">{{ maslg('比较字段/控件') }}</div>
                        <div class="condition-form_select">
                            <el-select v-model="item.compareField" :placeholder="maslg('请选择比较字段/控件')" clearable>
                                <el-option v-for="citem in item.compareFieldData" :key="citem.value" :value="citem.value"
                                    :label="citem.label">
                                    <span style="float:left;color:#333333;font-size:13px;">{{ maslg(citem.label) }}</span>
                                    <span style="float:right;color:#8198b5;font-size:13px;">{{
                                        maslg(citem.value) }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="condition-form">
                        <div class=" title">{{ maslg('比较类型') }}</div>
                        <div class="condition-form_select">
                            <el-select v-model="item.compareType" :placeholder="maslg('请选择比较类型')" clearable>
                                <el-option v-for=" item in compareData" :label="maslg(item.label)" :key="item.value"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="condition-form">
                        <div class=" title">{{ maslg('数据值') }}</div>
                        <div class="condition-form_select">
                            <el-input v-regCharacter :maxlength="maxlength" v-model="item.dataValue"
                                :placeholder="maslg('请输入数据值')" clearable>
                            </el-input>
                        </div>
                    </div>
                    <div class="form_del">
                        <el-button class="form_del-btn" :icon="Delete" @click="delConditionForm(index)"> {{ maslg('删除') }}
                        </el-button>
                    </div>
                </div>
                <el-button class="add_btn form_btn" :icon="Plus" @click="addConditionForm"> {{ maslg('添加') }} </el-button>
            </el-collapse-item>
        </el-collapse>
        <el-dialog style="height:610px" :width="800" v-model="dialogFromVisible" :title="maslg('选择表单')"
            :close-on-click-modal="false" align-center :draggable="true">
            <div class="choose_form-top">
                <div class="top_box">
                    <div class="top_text">
                        {{ maslg('关键字查询:') }}
                    </div>
                    <el-input v-regCharacter v-debounce="SearchClick" :maxlength="maxlength" v-model="param.tableName"
                        :placeholder="maslg('请输入表名或代码关键字')" clearable class="top_input"></el-input>
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
                v-loading="tableLoading" :empty-text="maslg('无数据')">
                <el-table-column prop="tdescription" :label="maslg('表名称')"></el-table-column>
                <el-table-column prop="name" :label="maslg('表代码')"></el-table-column>
            </el-table>
            <pagination :total="total" :small="false" :pageSize="pageSize" @sizeChange="handleSizeChange"
                @currentChange="handleCurrentChange" ref="paginationBox">
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
import { ref, reactive, ComponentInternalInstance, getCurrentInstance, toRefs, toRef, useModel, watch, nextTick } from 'vue'
import { FormRules, FormInstance, ElMessage, TableInstance } from 'element-plus'
import { Delete, Plus, MoreFilled } from '@element-plus/icons-vue'
import { Shape, Connection } from 'bpmn-js/lib/model/Types';
import { checkPointApi } from '@/api/checkpoint';
import { conditionApi } from '@/api/condition';
import pagination from '../pagination/index.vue'
const { proxy } = <ComponentInternalInstance>getCurrentInstance()
interface databaseTable {
    name?: string,
    code?: string
}
const props = defineProps<{
    conditionData: conditionData,
    nodeList: (Shape | Connection)[],
    clickElement: Shape
}>()
//派发事件
const emit = defineEmits<{
    'changPointName': [name: string],
    'update:conditionData': [val: object]
}>()
//修改节点名称
const changPointName = () => {
    emit('changPointName', conditionData.value.name)
}
const conditionData = useModel(props, 'conditionData')
const collapseClick = ref('0')
const pageSize = [50, 100, 200, 400]
let eleConfigData
watch(() => props.clickElement, (val) => {
    if (val) {
        collapseClick.value = '0'
        props.nodeList.map(item => {
            if (item.type == "bpmn:SequenceFlow" && item.target.id == props.clickElement.id) {
                if (conditionData.value.formType && conditionData.value.formType != item.source.configData.pointFormData[0].formType) {
                    conditionData.value.conditionFormData = [{
                        pattern: conditionData.value.formType == '2' ? false : true,
                        databaseTable: '',
                        primaryKeyField: '',
                        compareField: '',
                        compareType: '',
                        dataValue: '',
                        rowsData: {},
                        primaryFieldData: [],
                        compareFieldData: [],
                    }]
                }
                nextTick(() => {
                    eleConfigData = item.source.configData
                    conditionData.value.formType = item.source.configData?.pointFormData[0].formType
                    let setFormField = conditionData.value.conditionFormData.find(item => {
                        return Object.keys(item.rowsData).length == 0
                    })

                    if (setFormField && eleConfigData) {
                        getDifferentData[eleConfigData.pointFormData[0].formType](eleConfigData.pointFormData[0])
                        // setFieldSelect()
                    }
                })

            }
        })
    }
}, {
    immediate: true
})
const setFieldSelect = () => {
    conditionData.value.conditionFormData.map(item => {
        if (Object.keys(item.rowsData).length == 0) {
            item.compareFieldData = compareFieldData.value
            if (conditionData.value.formType == '2') {
                item.pattern = false
                item.primaryFieldData = [{
                    label: '系统主键ID',
                    value: 'ID'
                }]
                item.primaryKeyField = 'ID'
            }
            else {
                item.pattern = true
            }
        }
    })
}
const compareFieldData = ref<any[]>([])
const getDifferentData: differentData = {
    '2': async (val: pointFormData) => {
        checkPointApi.getSmartFieldList({ queryJson: JSON.stringify({ FormId: (val.rowsData as tableData).ID }), isDefaultField: true }).then((res: any) => {
            if (res.code == 200) {
                compareFieldData.value = []
                res.data.map(item => {
                    item['name'] = item.TableCode
                    if (item.IsMain == '1') {
                        conditionData.value.tableCode = item.TableCode
                        conditionData.value.formCode = item.FormCode
                        item.TableFieldList.map(titem => {
                            titem['label'] = titem.FieldName
                            titem['value'] = titem.FieldCode
                            compareFieldData.value.push(titem)

                        })
                    }
                })

                setFieldSelect()
            }
        }).catch(err => {
            ElMessage({
                type: 'error',
                message: proxy?.maslg('获取表单数据失败')
            })
        })
    },
    '0': async (val: pointFormData) => {
        conditionData.value.tableCode = ''
        conditionData.value.formCode = val.rowsData!.value as string
        conditionData.value.conditionFormData.map(item => {
            item.pattern = true
        })
    },
    '1': (val: pointFormData) => {
        let isMain = val.tabsData.find(item => {
            return item.relationField == ''
        })
        if (isMain) {
            conditionData.value.tableCode = isMain?.name
            conditionData.value.formCode = val.rowsData!.F_No as string
            conditionApi.getFieldList({ dbCode: 'lrsystemdb', tableName: isMain.name }).then((res: any) => {
                if (res.code == 200) {
                    res.data.map(item => {
                        item['label'] = item.f_remark
                        item['value'] = item.f_column
                    })
                    compareFieldData.value = res.data
                    setFieldSelect()
                }

            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: proxy?.maslg('获取表字段失败')
                })
            })
        }

    }
}
//节点设置配置项
const condition = ref<FormInstance>()
const conditionRules = reactive<FormRules<conditionData>>({
    name: [{
        required: true, message: proxy?.maslg('请输入节点名称'), trigger: 'blur'
    }]
})
const compareData = ref<checkerCategory>([{
    label: '等于',
    value: '1'
}, {
    label: '不等于',
    value: '2'
}, {
    label: '大于',
    value: '3'
}, {
    label: '大于等于',
    value: '4'
}, {
    label: '小于',
    value: '5'
}, {
    label: '小于等于',
    value: '6'
}, {
    label: '包含',
    value: '7'
}, {
    label: '不包含',
    value: '8'
}, {
    label: '包含于',
    value: '9'
}, {
    label: '不包含于',
    value: '10'
}])

const delConditionForm = (index) => {
    conditionData.value.conditionFormData.splice(index, 1)
}
const addConditionForm = () => {
    let hasEmpty = conditionData.value.conditionFormData.find(item => {
        return !item.primaryKeyField || !item.compareField || !item.compareType || !item.dataValue
    })
    if (hasEmpty) {
        return ElMessage.error(proxy?.maslg('请设置判断条件'))
    }
    conditionData.value.conditionFormData.push({
        pattern: false,
        databaseTable: '',
        primaryKeyField: '',
        compareField: '',
        compareType: '',
        dataValue: '',
        rowsData: {},
        primaryFieldData: [],
        compareFieldData: []
    })

    if (eleConfigData) {
        getDifferentData[eleConfigData.pointFormData[0].formType](eleConfigData.pointFormData[0])
    }
}

const dialogFromVisible = ref(false)
const tableData = ref<databaseTable[]>([])
let param = reactive({
    dbCode: 'lrsystemdb',
    tableName: '',
    rows: 50,
    page: 1
})
const tableLoading = ref(false)
const total = ref(0)
const getDatabaseData = () => {
    tableLoading.value = true
    conditionApi.getDatabaseForm(param).then(async (res: any) => {
        tableLoading.value = false
        if (res.code == 200) {
            tableData.value = res.data.rows
            total.value = res.data.records
            await nextTick()
            if (Object.keys(nowCondition.value!.rowsData).length > 0) {
                let findData = res.data.rows.find(item => {
                    return item.name == nowCondition.value!.rowsData.name
                })
                formTable.value!.setCurrentRow(findData)
            }
        }

    }).catch(err => {
        tableLoading.value = false
        ElMessage({
            type: 'error',
            message: proxy?.maslg('获取数据库表失败')
        })
    })
}
const nowCondition = ref<conditionFormData>()
const formTable = ref<TableInstance>()
const paginationBox = ref<InstanceType<typeof pagination>>()
let rowsData;
const openChooseForm = async (val: conditionFormData) => {
    nowCondition.value = val
    rowsData = val.rowsData
    if (rowsData.hasOwnProperty('page') && rowsData.hasOwnProperty('rows')) {
        param.page = rowsData.page
        param.rows = rowsData.rows
    }
    else {
        param.page = 1
        param.rows = 50
    }
    paginationBox.value?.resetPage(param.page, param.rows)
    await getDatabaseData()
    dialogFromVisible.value = true
}
const SearchClick = () => {
    param.page = 1
    getDatabaseData()
}
const resetClick = () => {
    param.tableName = ''
    param.page = 1
    paginationBox.value?.resetPage(param.page, param.rows)
    getDatabaseData()
}

const handleSizeChange = (val) => {
    param.rows = val
    param.page = 1
    paginationBox.value?.resetPage(param.page, param.rows)
    getDatabaseData()
}
const handleCurrentChange = (val) => {
    param.page = val
    getDatabaseData()
}


const selectRow = (val) => {
    rowsData = val
}
const handleClose = () => {
    dialogFromVisible.value = false
}
const submitForm = () => {
    if (!rowsData) {
        return ElMessage({
            type: 'error',
            message: proxy?.maslg('请选择数据表')
        })
    }
    rowsData['page'] = param.page
    rowsData['rows'] = param.rows
    nowCondition.value!.rowsData = rowsData
    nowCondition.value!.databaseTable = rowsData.tdescription
    fieldParams.tableName = nowCondition.value!.rowsData.name as string
    conditionData.value.conditionFormData.map(item => {
        if (item.pattern) {
            item.compareField = ''
        }
    })
    getFieldData()
    dialogFromVisible.value = false
}
let fieldParams = {
    dbCode: 'lrsystemdb',
    tableName: ''
}
const getFieldData = async () => {
    await conditionApi.getFieldList(fieldParams).then((res: any) => {
        if (res.code == 200) {
            res.data.map(item => {
                item['value'] = item.f_column
                item['label'] = item.f_remark
            })
            nowCondition.value!.compareFieldData = res.data
            nowCondition.value!.primaryFieldData = res.data
            nowCondition.value!.primaryKeyField = ' '
        }
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: proxy?.maslg('获取字段信息失败')
        })
    })
}
</script>

<style scoped>
:deep(.el-pagination) {
    padding-top: 10px;
}
</style>