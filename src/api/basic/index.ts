import http from '@/utils/request'

export const basicApi = {
    //获取数据库数据
    getDatabaseData: function (params: object) {
        return http('get', '/DatabaseLink/GetTreeList', params)
    },
    //获取流程表单分类数据
    getFlowCategory: function (params: object) {
        return http('get', '/DataItem/GetEnabledDetailList', params)
    },
    //保存流程设计数据
    saveFlowData: function (params: object) {
        return http('post', '/NWFScheme/SaveForm', params)
    },
    //获取流程模板信息
    getFlowSchemeData: function (params: object) {
        return http('get', '/NWFScheme/GetFormData', params)
    }
}