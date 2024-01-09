<template>
    <div class="line">
        <el-collapse accordion v-model="collapseClick">
            <el-collapse-item :title="maslg('节点连线配置')" name="0">
                <el-form ref="lineForm" :model="lineData" :rules="lineFormRules" label-width="100px" label-position="left"
                    @submit.native.prevent>
                    <el-form-item prop="name" :label="maslg('连线名称')">
                        <el-input v-regCharacter :maxlength="maxlength" v-model="lineData.name"
                            :placeholder="maslg('请输入节点连线名称')" @input="changPointName" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="color" :label="maslg('连线颜色')" v-if="showConfig">
                        <el-radio-group v-model="lineData.color" @change="changeWhiteColor">
                            <el-radio label="black">{{ maslg('黑色') }}</el-radio>
                            <el-radio label="red">{{ maslg('红色') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="lineStrategy" :label="maslg('连线通过策略')" v-if="showConfig">
                        <el-radio-group v-model="lineData.lineStrategy" class="line_radio">
                            <el-radio label="agree">{{ maslg(changeRadio ? '是' : '线条起始节点【同意】') }}</el-radio>
                            <el-radio label="disagree">{{ maslg(changeRadio ? '否' : '线条起始节点【不同意】') }}</el-radio>
                            <el-radio label="allthrough">{{ maslg('所有情况都通过') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item :title="maslg('高级配置')" name="1">
                <advanced v-model:advanceData="lineData.advanceData"></advanced>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, getCurrentInstance, ComponentInternalInstance, watch, toRefs, toRef, useModel } from 'vue'
import { FormRules, FormInstance } from 'element-plus'
import advanced from '@/components/advancedConfig/index.vue'
import { Shape } from 'bpmn-js/lib/model/Types';

const { proxy } = <ComponentInternalInstance>getCurrentInstance()

const props = defineProps<{
    clickElement: Shape,
    lineData: lineForm
}>()
const collapseClick = ref('0')
const showConfig = ref(true)
const changeRadio = ref(false)
watch(() => props.clickElement, (val) => {
    if (val) {
        collapseClick.value = '0'
        if (val.source.type == "bpmn:IntermediateCatchEvent") {
            showConfig.value = false
        }
        else {
            showConfig.value = true
        }
        if (val.source.type == 'bpmn:ParallelGateway') {
            changeRadio.value = true
        }
        else {
            changeRadio.value = false
        }
    }
}, {
    immediate: true
})
//将父级传过来的数据转为响应式数据
const lineData = useModel(props, 'lineData')

const lineForm = ref<FormInstance>()
// const lineFormData = reactive<lineForm>({
//     name: '',
//     color: '',
//     lineStrategy: ''
// })
const lineFormRules = reactive<FormRules<lineForm>>({
    // name: [{
    //     required: true, message: proxy?.maslg('请输入连线名称'), trigger: 'blur'
    // }]
})

const changeWhiteColor = (val) => {
    emit('changelineColor', val)
}
const emit = defineEmits<{
    'changPointName': [name: string],
    'changelineColor': [color: string],
    'update:lineData': [val: object]
}>()
const changPointName = () => {
    emit('changPointName', lineData.value.name)
}
</script>

<style scoped></style>