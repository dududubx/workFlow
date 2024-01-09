import http from '@/utils/request'

export const checkSponsorApi = {
    //通过流程编码获取流程模板
    getSchemeByCode: function (params) {
        return http('get', '/NWFProcess/GetSchemeByCode', params)
    },
    //获取表单是否独占信息
    getFormGfus: function (params) {
        return http('get', '/XA_Form/XAFormBase/gfus', params)
    },
    //获取设计表单数据
    getDesignFormData: function (params) {
        return http('get', '/Custmerform/GetFormData', params)
    },
    //获取自定义表单数据
    getinstanceFormData: function (params) {
        return http('get', '/Custmerform/GetInstanceForm', params)
    },
    //获取关联文档中协同文档的数据
    getProcessPageList: function (params) {
        return http('get', '/XA_Base/XABaseSelectDocs/GetMyFinishProcessPageList', params)
    },
    //获取流程模板信息
    getProcessInfoApi: function (params) {
        return http('get', '/NWFProcess/GetProcessDetails', params)
    },
    //上传附件分片数据
    uploadAnnexesFild: function (params) {
        return http('post', '/Annexes/UploadAnnexesFileChunk', params)
    },
    //合并附件分片数据
    mergeAnnexesFild: function (params) {
        return http('post', '/Annexes/MergeAnnexesFile', params)
    },
    //删除附件
    deletAnnexesFild: function (params) {
        return http('post', '/Annexes/DeleteAnnexesFile', params)
    },
    //下载附件
    downloadAnnexesFild: function (params) {
        return http('post', '/Annexes/DownAnnexesFile', params, 'base', 'blob')
    },
    //保存流程草稿
    saveDraft: function (params) {
        return http('post', '/NWFProcess/SaveDraft', params)
    },
    //获取流程附件信息
    getTaskFilesList: function (params) {
        return http('get', '/Annexes/GetAnnexesFileList', params)
    },
    //获取流程上传附件以及文档数据
    getXAWFTaskFile: function (params) {
        return http('get', '/XAWFTaskFiles/GetTaskFilesList', params)
    },
    //判断下一节点是否有审核人
    getNextAuditorsState: function (params) {
        return http('post', '/XAWFTaskFiles/GetNextAuditorsState', params)
    },
    //获取流程下一节点审核人员
    getNextAuditorData: function (params) {
        return http('get', '/NWFProcess/GetNextAuditors', params)
    },
    //创建流程
    createFlowApi: function (params) {
        return http('post', '/NWFProcess/CreateFlow', params)
    },
    //审批流程
    auditFlow: function (params) {
        return http('post', '/NWFProcess/AuditFlow', params)
    },
    //通过流程实例主键获取模板信息
    getSchemeEntityById: function (params) {
        return http('get', '/NWFScheme/GetSchemeEntityById', params)
    },
    //保存流程模板实体信息
    saveSchemeEntity: function (params) {
        return http('post', '/NWFScheme/SaveSchemeEntity', params)
    },
    //重新发起流程
    againCreateFlow: function (params) {
        return http('post', '/NWFProcess/AgainCreateFlow', params)
    },
    //根据流程进程主键获取实体信息
    getProcessEntity: function (params) {
        return http('get', '/NWFProcess/GetProcessEntity', params)
    },
    //根据流程进程主键获取流程模板
    getSchemeByProcessId: function (params) {
        return http('get', '/NWFProcess/GetSchemeByProcessId', params)
    },
    //流程加签审核
    signAuditFlow: function (params) {
        return http('post', '/NWFProcess/SignAuditFlow', params)
    },
    //传阅节点审批
    referFlow: function (params) {
        return http('post', '/NWFProcess/ReferFlow', params)
    },
    //创建子流程
    createChildFlow: function (params) {
        return http('post', '/NWFProcess/CreateChildFlow', params)
    },
    //获取印章数据
    getStampInfo: function (params: object) {
        return http('get', '/StampInfo/GetList', params)
    },
    //获取印章图片
    getStampImg: function (params: object) {
        return http('get', '/StampInfo/GetImg', params, 'base', 'blob')
    },
    //获取上传文件的预览数据
    getPreviewFile: function (params: object) {
        return http('get', '/Annexes/PreviewFile', params, 'base', 'blob')
    },
    //获取签名图片
    getSignImg: function (params: object) {
        return http('get', '/Img/Down', params, 'base', 'blob')
    }
}