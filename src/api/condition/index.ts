import http from '@/utils/request'

export const conditionApi = {
    //获取本地数据库表
    getDatabaseForm: (params: object) => {
        return http('get', '/DatabaseTable/GetPagingList', params)
    },
    //获取数据库表中的字段数据
    getFieldList: (params: object) => {
        return http('get', '/DatabaseTable/GetFieldList', params)
    },
    //获取本机数据库所有表
    getAllDatabaseList: (params: object = { dbCode: 'lrsystemdb' }) => {
        return http('get', '/DatabaseTable/GetList', params)
    }
}