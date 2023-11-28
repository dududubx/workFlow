import http from "@/utils/request";

export const organization = {
  // 获取组织机构完整树
  GetWholeTreeTwo: function (params: object) {
    return http('get',`/Company/GetWholeTreeTwo`, params);
  },
  //公司树结构
  GetCompanyTree: function (params: object) {
    return http('get',`/Company/GetTree`, params);
  },
  //部门树结构
  GetDepartmentTree: function (params: object) {
    return http('get',`/Department/GetTree`, params);
  },
  // 上级岗位
  GetTreeTwo: function (params: object) {
    return http('get',`/Post/GetTreeTwo`, params);
  },
  //获取省
  GetAreaTree: function (params: object) {
    return http('get',`/Area/Getlist`, params);
  },
  //获取公司数据
  GetComparyList: function (params: object) {
    return http('get',`/Company/GetList`, params);
  },
  // 获取组织机构权限
  GetOrgDataRightsSettingList: function (params: object) {
    return http('get',`/XA_Base/XABaseOrgDataOperRights/GetOrgDataRightsSettingList`, params);
  },
  // 获取公司实例数据
  GetComparyFrom: function (params: object) {
    return http('get',`/Company/GetForm`, params);
  },
  // 删除数据
  DEleteComparyFrom: function (params: object) {
    return http('get',`/Company/DeleteForm`, params);
  },
  //保存
  SaveCompany: function (params: object) {
    return http('post',`/Company/SaveForm`, params);
  },

  //部门
  //获取部门数据
  GetDepartmentList: function (params: object) {
    return http('get',`/Department/GetList`, params);
  },
  //部门岗位信息
  GetUserPageList: function (params: object) {
    return http('get',`/User/GetUserPageList`, params);
  },
  // 获取部门实体数据
  GetDepartmentForm: function (params: object) {
    return http('get',`/Department/GetForm`, params);
  },
  //获取部门岗位枚举数据

  GetEnumPostData: function (params: object) {
    return http('get',`/XA_NForm/XANFormEnum/GetEnumValuesByEnumName`, params);
  },
  // 获取用户信息列表
  GetEntityListByUserIds: function (params: object) {
    return http('get',`/User/GetEntityListByUserIds`, params);
  },
  //根据id获取部门
  GetCacheDepartmentListByIds: function (params: object) {
    return http('get',`/Department/GetCacheDepartmentListByIds`, params);
  },
  //根据id获取公司
  GetCacheCompanyListByIds: function (params: object) {
    return http('get',`/Company/GetCacheCompanyListByIds`, params);
  },
  //根据id获取岗位
  GetListByPostIds: function (params: object) {
    return http('get',`/Post/GetListByPostIds`, params);
  },
  //根据id获取角色
  GetListByRoleIds: function (params: object) {
    return http('get',`/Role/GetListByRoleIds`, params);
  },
  // 获取部门岗位表单数据
  GetDepartmentPostEntity: function (params: object) {
    return http('get',`/DepartmentPost/GetDepartmentPostEntity`, params);
  },
  // 删除部门
  DeleteDepartment: function (params: object) {
    return http('post',`/Department/DeleteForm`, params);
  },
  // 保存部门
  SaveDepartment: function (params: object) {
    return http('post',`/Department/SaveForm`, params);
  },


  // 用户
  GetUserList: function (params: object) {
    return http('get',`User/GetList`, params);
  },
  GetPageList: function (params: object) {
    return http('get',`User/GetPageList`, params);
  },
  //获取实体数据
  GetUserInfo: function (params: object) {
    return http('get',`/User/Info`, params);
  },
  // 删除数据
  DeleteUserFrom: function (params: object) {
    return http('get',`/User/DeleteForm`, params);
  },
  // 启用/禁用账号
  UpdateState: function (params: object) {
    return http('get',`/User/UpdateState`, params);
  },
  // 重置密码
  ResetPassword: function (params: object) {
    return http('post',`/User/ResetPassword`, params);
  },
  // 所有权限
  GetAllAuthList: function (params: object) {
    return http('get',`/Module/GetAllList`, params);
  },
  // 用户角色信息
  GetUserRelation: function (params: object) {
    return http('get',`/User/GetUserRelation`, params);
  },
  // 导出用户数据
  ExportUserList: function (params: object) {
    return http('post',`/User/ExportUserList`, params, 'base', 'blob');
  },

  // 岗位信息
  GetUserPost: function (params: object) {
    return http('get',`/User/GetUserPost`, params);
  },
  // 报存角色信息
  SaveUserRelationEntityList: function (params: object) {
    return http('post',`/User/SaveUserRelationEntityList`, params);
  },
  // 解锁
  UpdateLockstate: function (params: object) {
    return http('post',`/User/UpdateLockstate`, params);
  },
  // 保存角色
  SaveUser: function (params: object) {
    return http('post',`/User/SaveForm`, params);
  },
  //用户普通用户分页列表（除管理员以外的用户）
  GetOrdinaryUserPageList: function (params: object) {
    return http('get',`/User/GetOrdinaryUserPageList`, params);
  },

  // 岗位
  GetPostList: function (params: object) {
    return http('get',`Post/GetList`, params);
  },
  // 获取岗位实体信息

  GetPostForm: function (params: object) {
    return http('get',`/Post/GetForm`, params);
  },
  // 保存
  SavePost: function (params: object) {
    return http('post',`/Post/SaveForm`, params);
  },
  // 删除
  DeletePostForm: function (params: object) {
    return http('post',`/Post/DeleteForm`, params);
  },
  // 查看
  GetUserListByRelationId: function (params: object) {
    return http('get',`/UserRelation/GetUserListByRelationId`, params);
  },
  // 报存成员管理
  SaveUserRelation: function (params: object) {
    return http('post',`/UserRelation/SaveForm`, params);
  },
  // 角色
  // 获取列表数据
  GetRoleList: function (params: object) {
    return http('get',`/Role/GetList`, params);
  },
  // 获取分页列表数据
  GetRolePageList: function (params: object) {
    return http('get',`/Role/GetPageList`, params);
  },
  // 获取角色实体数据
  GetRoleForm: function (params: object) {
    return http('get',`/Role/GetForm`, params);
  },
  // 删除角色
  DeleteRoleForm: function (params: object) {
    return http('post',`/Role/DeleteForm`, params);
  },
  // 保存角色
  SaveRoleForm: function (params: object) {
    return http('post',`/Role/SaveForm`, params);
  },
  // 获取数据字典
  GetDetails: function (params: object) {
    return http('get',`/DataItem/Details`, params);
  },
  // 组织机构权限
  // 获取分页列表数据
  GetPostPageList: function (params: object) {
    return http('get',`/Post/GetList`, params);
  },
  SaveOrgDataOperForm: function (params: object) {
    return http('post',`/XA_Base/XABaseOrgDataOperRights/SaveForm`, params);
  },
  // 
  GetDeptExceptUserList: function (params: object) {
    return http('get',`/XA_Base/XABaseOrgDataOperRights/GetDeptExceptUserList`, params);
  },
  // 新数据
  GetDeptExceptNewUserList: function (params: object) {
    return http('get',`/XA_Base/XABaseOrgDataOperRights/GetDeptExceptNewUserList`, params);
  },
  // 复制权限
  CopyPermissionTo: function (params: object) {
    return http('post',`/XA_Base/XABaseOrgDataOperRights/CopyPermissionTo`, params);
  },
  // 授权信息
  GetAuthSetUserInfo: function (params: object) {
    return http('get',`/SystemAuthorize/GetAuthSetUserInfo`, params);
  },
}
