<template>
    <div class="collapse_content">
        <el-form ref="advanceForm" v-model="advanceData" label-width="119px" label-position="left" @submit.native.prevent>
            <el-form-item prop="category" :label="maslg('操作类型')" class="operatecate_item">
                <el-radio-group v-model="advanceData.category">
                    <el-radio label="sql">{{ maslg('SQL脚本') }}</el-radio>
                    <el-radio label="interface">{{ maslg('接口') }}</el-radio>
                </el-radio-group>
                <el-tooltip :content="toolText" raw-content placement="bottom" effect="dark">
                    <div class="tool_tip">
                        <el-icon color="#d2d2d2">
                            <QuestionFilled />
                        </el-icon>
                    </div>
                </el-tooltip>
            </el-form-item>
            <div class="sql_container" v-if="advanceData.category == 'sql'">
                <el-form-item prop="database" :label="maslg('数据库')">
                    <!-- <el-select  v-model="advanceData.database">
                        <el-option-group v-for="item in databaseData" :key="item.id" :label="item.text">
                            <el-option v-for="citem in item.ChildNodes" :key="citem.id" :label="citem.text"
                                :value="citem.id">
                            </el-option>
                        </el-option-group>
                    </el-select> -->
                    <el-tree-select v-model="advanceData.database" :data="databaseData" check-strictly
                        :render-after-expand="false" :placeholder="maslg('请选择数据库')" clearable />
                </el-form-item>
                <el-form-item prop="agreeSQL"
                    :label="maslg(advanceData.hasOwnProperty('disagreeSQL') ? '同意SQL脚本' : 'SQL脚本')">
                    <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="advanceData.agreeSQL"
                        :placeholder="maslg('请输入SQL脚本')"></el-input>
                </el-form-item>
                <el-form-item prop="disagreeSQL" :label="maslg('不同意SQL脚本')"
                    v-if="advanceData.hasOwnProperty('disagreeSQL')">
                    <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="advanceData.disagreeSQL"
                        :placeholder="maslg('请输入SQL脚本')"></el-input>
                </el-form-item>
            </div>
            <div class="sql_container" v-if="advanceData.category == 'interface'">
                <el-form-item prop="agreePort"
                    :label="maslg(advanceData.hasOwnProperty('disagreeSQL') ? '同意接口地址' : '接口地址')">
                    <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="advanceData.agreePort"
                        :placeholder="maslg('请输入接口地址')"></el-input>
                </el-form-item>
                <el-form-item prop="disagreePort" :label="maslg('不同意接口地址')"
                    v-if="advanceData.hasOwnProperty('disagreePort')">
                    <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="advanceData.disagreePort"
                        :placeholder="maslg('请输入接口地址')"></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, getCurrentInstance, ComponentInternalInstance, toRefs, toRef, onMounted, useModel } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { basicApi } from '@/api/basic'
const { proxy } = <ComponentInternalInstance>getCurrentInstance()

const props = defineProps<{
    advanceData: advancedForm
}>()
// const advanceData = reactive<advancedForm>({
//     category: 'SQL',
//     database: '',
//     agreeSQL: '',
//     disagreeSQL: '',
//     agreePort: '',
//     disagreePort: ''
// })
// const emit = defineEmits<{
//     'update:advanceData': [val: object]
// }>()
//父组件的数据变化子组件视图更新
let advanceData = useModel(props, 'advanceData')
const emit = defineEmits<{
    'update:advanceData': [val: object]
}>()
const toolText = ref<string>('')
watch(() => advanceData.value.category, (newVal, oldVal) => {
    if (newVal == 'sql') {
        toolText.value = proxy?.maslg(`注意：请配置SQL语句, 支持动态参数<br/>
        1.{processId}流程进程主键<br/>
        2.{userId}用户Id<br/>
        3.{userAccount}用户账号<br/>
        4.{companyId}用户公司<br/>
        5.{departmentId}用户部门<br/>
        6.{code}1撤销2作废3删除草稿`) as string
    }
    else {
        toolText.value = proxy?.maslg(`注意：必须要开发人员指导下进行配置支持Post方法的接口,
        <br/>json数据格式。<br/>
        {</br>
            processId:'流程发起实例主键',</br>
            userId:'用户Id',</br>
            userAccount:'用户账号',</br>
            companyId:'用户公司',</br>
            departmentId:'用户部门',</br>
            code:'1撤销2作废'</br>
        }
       `) as string
    }
}, {
    immediate: true
})
const databaseData = ref()
onMounted(() => {
    basicApi.getDatabaseData({}).then((res: any) => {
        if (res.code == 200) {
            databaseData.value = res.data
            databaseData.value.map(item => {
                item['label'] = item.text
                item['value'] = item.id
                item['children'] = []
                if (item.ChildNodes) {
                    item.ChildNodes.map(citem => {
                        citem['label'] = citem.text
                        citem['value'] = citem.id
                        item['children'].push(citem)
                    })
                }
            })
        }
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '获取数据库数据失败'
        })
    })
})
</script>

<style scoped></style>