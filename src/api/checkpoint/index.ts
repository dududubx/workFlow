import http from '@/utils/request'

export const checkPointApi = {
    //获取通知策略数据
    getNoticeData: function (params: object) {
        return http('get', '/StrategyInfo/GetList', params)
    },
    //获取自定义表单分页数据
    getFormData: function (params: object) {
        return http('get', '/Custmerform/GetPageList', params)
    },
    //获取智能表单分页数据
    getXA_NForm: function (params: object) {
        return http('get', '/XA_NForm/XANForm/GetPageList', params)
    },
    //获取表单分类接口
    getFormCategory: function (params: object) {
        return http('get', '/DataItem/Details', params)
    },
    //获取智能表单视图列表
    getSmartFormViewList: function (params: object) {
        return http('get', '/XA_NForm/XANForm/GetXA_NFormViewList', params)
    },
    //获取智能表单表列表数据
    getSmartFormList: function (params: object) {
        return http('get', '/XA_NForm/XANForm/GetXA_NFormTablesList', params)
    },
    //获取智能表单列表字段权限数据
    getSmartFormOperaList: function (params: object) {
        return http('get', '/XA_NForm/XANForm/GetXA_NFormViewOperSetList', params)
    },
    //获取自定义表单实例数据
    getFormFieldData: function (params: object) {
        return http('get', '/Custmerform/GetFormData', params)
    },
    //获取系统表单树型数据
    getSystemFormTree: function (params: object) {
        return http('get', '/Module/GetModuleTree', params)
    },
    //获取系统表单实例的列表信息
    getSystemList: function (params: object) {
        return http('get', '/Module/GetAuthorizeButtonColumnListTwo', params)
    },
    //获取相对角色的数据
    getRelativeData: function (params: object) {
        return http('get', '/XA_NForm/XANFormEnum/GetEnumValuesByEnumName', params)
    },
    //获取选择智能表单后的表单字段和数据表
    getSmartFieldList: function (params: object) {
        return http('get', '/XA_NForm/XANForm/GetNewTableFieldList', params)
    },
    //获取自定义表单的表
    getFormTableList: function (params: object) {
        return http('get', '/XA_Form/XAFormTableSet/GetList', params)
    }
}