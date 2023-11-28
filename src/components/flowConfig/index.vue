<template>
    <div class="flowConfig">
        <div class="flowForm">
            <el-form ref="flowEle" :model="flowFormData" :rules="flowRules" size="small" label-width="100px"
                label-position="left" @submit.native.prevent>
                <div class="form_Top">
                    <el-form-item :label="maslg('流程名称:')" prop="name">
                        <el-input v-regCharacter v-model="flowFormData.name" :placeholder="maslg('请输入流程名称')" clearable
                            :maxlength="maxlength"></el-input>
                    </el-form-item>
                    <el-form-item :label="maslg('流程编号:')" prop="code">
                        <el-input v-regCharacter :maxlength="maxlength" v-model="flowFormData.code"
                            :placeholder="maslg('请输入流程编号')" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="maslg('流程分类:')" prop="category">
                        <el-select v-model="flowFormData.category" :placeholder="maslg('请选择流程分类')" clearable>
                            <el-option v-for="item in categoryData" :key="item.F_ItemId" :label="item.F_ItemName"
                                :value="item.F_ItemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="maslg('支持平台:')" prop="platform">
                        <el-checkbox-group v-model="flowFormData.platform">
                            <el-checkbox :label="'2'">{{ maslg('PC端') }}</el-checkbox>
                            <el-checkbox :label="'1'">{{ maslg('移动端') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <div class="form_bottom">
                    <el-form-item :label="maslg('不同意不验证表单:')" label-width="150px" class="switch_item" prop="validateForm">
                        <el-switch v-model="flowFormData.validateForm"></el-switch>
                    </el-form-item>
                    <div class="switch_tip">{{ maslg('(审批不同意时，不验证表单数据)') }}</div>
                    <el-form-item :label="maslg('我的代办中发起:')" label-width="150px" class="switch_item" prop="canagent">
                        <el-switch v-model="flowFormData.canagent"></el-switch>
                    </el-form-item>
                    <div class="switch_tip">{{ maslg('(支持在‘我的代办’中发起该流程)') }}</div>
                    <el-form-item :label="maslg('备注:')" prop="remark" class="remark_item" label-width="60px">
                        <el-input v-regCharacter type="textarea" v-model="flowFormData.remark" :autosize="{ minRows: 3 }"
                            :placeholder="maslg('请输入备注')"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="flowCollapse">
            <el-collapse>
                <el-collapse-item :title="maslg('撤销作废操作')">
                    <advanced v-model:advanceData="advanceData"></advanced>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, watch, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import advanced from '@/components/advancedConfig/index.vue'
import { basicApi } from '@/api/basic'
const { proxy } = <ComponentInternalInstance>getCurrentInstance()

const flowEle = ref<FormInstance>()
const flowFormData = reactive<RuleForm>({
    name: '',
    code: '',
    category: '',
    platform: [],
    validateForm: true,
    canagent: true,
    remark: ''
})
const flowRules = reactive<FormRules<RuleForm>>({
    name: [{
        required: true, message: proxy?.maslg('请输入流程名称'), trigger: 'blur'
    }],
    code: [{
        required: true, message: proxy?.maslg('请输入流程编号'), trigger: 'blur'
    }],
    category: [{
        required: true, message: proxy?.maslg('请选择流程分类'), trigger: 'change'
    }],
    platform: [{
        required: true, message: proxy?.maslg('请至少选择一个平台'), trigger: 'change', type: 'array'
    }],
    validateForm: [{
        required: true
    }],
    canagent: [{
        required: true
    }]

})
const operateData = reactive<OpearteForm>({
    opearteCate: 'SQL',
    dataBase: '',
    agreeSQL: '',
    disagreeSQL: '',
    agreePort: '',
    disagreePort: ''
})
const toolText = ref<string>('')
watch(() => operateData.opearteCate, (newVal, oldVal) => {
    if (newVal == 'SQL') {
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
let advanceData = reactive<advancedForm>({
    category: 'sql',
    database: '',
    agreeSQL: '',
    agreePort: '',
})
const validForm = (callback: Function) => {
    flowEle.value?.validate((valid) => {
        if (valid) {
            callback()
        }
        else {
            return false
        }
    })
}
const categoryData = ref<any[]>([])
onMounted(() => {
    basicApi.getFlowCategory({ itemCode: 'FlowSort' }).then((res: any) => {
        if (res.code == 200) {
            categoryData.value = res.data
        }
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: proxy?.maslg('获取流程分类数据失败')
        })
    })
})
defineExpose({ validForm, flowFormData, advanceData })
</script>

<style scoped lang="less">
@import '@/assets/style/flowconfig.less';
</style>