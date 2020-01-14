export default BSEURL => {
  return {
    logout: BSEURL + "/user/logout", // 退出
    login: BSEURL + "/user/login", // 登录

    queryTbRoleList: BSEURL + "/role/queryTbRoleList",  // 获取角色列表
    getPermissionTree: BSEURL + "/role/getResources",  // 获取权限树
    getCheckResources :  BSEURL + '/role/getCheckResources/',//获取角色当前的权限
    updateResourcesCommit :  BSEURL + '/role/updateResources/',//修改角色权限提交
    roleAddCommit : BSEURL + '/role/addRole',//新增角色
    roleUpdateCommit :  BSEURL + '/role/updateCommit',//修改角色提交
    batchDeleteRoles :  BSEURL + '/role/batchDeleteRole',//批量删除角色

    queryTbSysUserList : BSEURL + '/user/queryTbSysUserList',//获取用户列表
    getAllRole : BSEURL + '/user/getRoleList',//获取角色选项
    getAllOrgan : BSEURL + '/user/getOrganList',//获取机构选项
    addUserCommit : BSEURL + '/user/addUser',//新增用户
    updateUserCommit : BSEURL + '/user/updateUser',//修改用户
    batchDeleteUsers : BSEURL + '/user/batchDeleteUser',//批量删除用户
  };
};
