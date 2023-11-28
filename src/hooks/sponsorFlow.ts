import { Ref, onMounted, ref, reactive, nextTick } from 'vue'
import type { UploadProps, UploadUserFile, UploadInstance, UploadFile } from 'element-plus'
interface sponsorFlow {
    title: string,
    grade: string,
    receiveInput: string,
    reactiveObj: any[],
    accessoryData: UploadUserFile[],
    document: UploadUserFile[]
}

export function sponsorConfig() {
    const sponsorFlowData = reactive<sponsorFlow>({
        title: '',
        grade: '',
        receiveInput: '',
        reactiveObj: [],
        accessoryData: [],
        document: []
    })
    const gradeOptions = [{
        label: '普通',
        value: '0'
    }, {
        label: '重要',
        value: '1'
    }, {
        label: '紧急',
        value: '2'
    }]

    const handleRemoveAccessory = (dom: ref<UploadInstance>, file: UploadFile) => {
        dom.handleRemove(file)
    }
    return {
        sponsorFlowData,
        gradeOptions,
        handleRemoveAccessory
    }
}