import { ElMessage } from "element-plus";

export function validSubmitData() {
    const tipInfo = (type: string, message: string) => {
        ElMessage[type]((window as any).maslg.get(message))
    }
    const validateChecker = (val: any[], formType: string) => {
        let isaccross = true
        let hasEmptyData = val.find(item => {
            return item.seletItem == '' || item.inputItem == ''
        })

        let fieldEmpty
        val.forEach(item => {
            if (item.seletItem == 'field' && (!item.fieldForm || !item.fieldCategory || (formType != '2' && !item.relativeField))) {
                fieldEmpty = item
            }
        })
        if (hasEmptyData || fieldEmpty) {
            isaccross = false
            tipInfo('error', '审核者信息不能为空')
        }
        return isaccross
    }
    const validateCondition = (val: any[]) => {
        let isaccross = false
        let isEmpty = val.find(item => {
            return !item.primaryKeyField || !item.compareField || !item.compareType || !item.dataValue
        })
        if (isEmpty) {
            isaccross = true
            tipInfo('error', '判断节点中判断条件设置中部分为空')
        }
        return isaccross
    }
    return {
        validateChecker,
        validateCondition
    }
}