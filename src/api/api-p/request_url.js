export default BSEURL => {
  return {
    logout: BSEURL + "/user/logout", // 退出
    login: BSEURL + "/user/login" // 登录
    // getOrganList: BSEURL + '/organ/getOrganList', // 获取机构列表
    // getOrganDetail: BSEURL + '/organ/update/',   // 获取某个机构详细信息
    // organUpdateCommit:BSEURL + '/organ/updateCommit',//修改机构提交
    // deleteOrgan : BSEURL + '/organ/delete/',//删除机构信息
    // queryTbSysRoleList : BSEURL + '/role/queryTbSysRoleList',//获取角色列表
    // roleAddCommit : BSEURL + '/role/addRole',//新增角色
    // getPermissionTree : BSEURL+ '/role/getResources',//角色获取权限树
    // getCheckResources :  BSEURL + '/role/getCheckResources/',//获取角色当前的权限
    // updateResourcesCommit :  BSEURL + '/role/updateResources/',//修改角色权限提交
    // batchDeleteRoles :  BSEURL + '/role/batchDeleteRole',//批量删除角色
    // updateRole :  BSEURL + '/role/update/',//修改角色
    // roleUpdateCommit :  BSEURL + '/role/updateCommit',//修改角色提交
    // queryTbSysUserList : BSEURL + '/user/queryTbSysUserList',//获取用户列表
    // getAllRole : BSEURL + '/user/getRoleList',//获取角色选项
    // getAllOrgan : BSEURL + '/user/getOrganList',//获取角色选项
    // addUserCommit : BSEURL + '/user/addUser',//新增用户
    // updateUserCommit : BSEURL + '/user/updateUser',//修改用户
    // batchDeleteUsers : BSEURL + '/user/batchDeleteUser',//批量删除用户
    // resourceList: BSEURL + '/resource/list', //资源列表
    // buildingDetail: BSEURL + '/resource/buildingDetail',
    // moduleRoomListByBuilding: BSEURL + '/resource/moduleRoomListByBuilding', //微机房详情
    // moduleRoomDetail: BSEURL + '/resource/moduleRoomDetail', //微模块间详情
    // moduleListByRoom: BSEURL + '/resource/moduleListByRoom', //查找某一微模块间下微模块列表
    // moduleDetail: BSEURL + '/resource/moduleDetail', //微模块详情
    // cabinetListByModule: BSEURL + '/resource/cabinetListByModule',  //查找某一模块下机架列表
    // cabinetDetail: BSEURL + '/resource/cabinetDetail', //机架详情
    // applyList: BSEURL + '/apply/applyList',  //审批列表
    // applyDetail: BSEURL + '/apply/applyDetail', //审批详情
    // applyOccupy: BSEURL + '/apply/applyOccupy', //生成预占信息
    // applyOaAgent: BSEURL + '/apply/applyOaAgent', //提交OA审批
    // cancelApply: BSEURL + '/apply/cancelApply', //取消申请
    // preemptList: BSEURL + '/apply/preemptList', //预占信息列表
    // getOrganListNoYingFu: BSEURL + '/organ/getOrganListNoYingFu', //查询区县列表
    // buildingUpdate: BSEURL + '/resource/buildingUpdate', //微机楼更新
    // buildinglist: BSEURL + '/resource/buildinglist', //微机楼下拉选择列表
    // moduleRoomUpdate: BSEURL + '/resource/moduleRoomUpdate', //微模块间更新
    // moduleRoomSelectList: BSEURL + '/resource/moduleRoomSelectList', //微模块间下拉选择列表
    // moduleUpdate: BSEURL + '/resource/moduleUpdate', //微模块更新
    // moduleSelectList: BSEURL + '/resource/moduleSelectList', //微模块下拉选择列表
    // cabinetUpdate:BSEURL + '/resource/cabinetUpdate', //机柜更新
    // cabinetSelectList:BSEURL + '/resource/cabinetSelectList', //机柜下拉选择列表
    // unitUpdate:BSEURL + '/resource/unitUpdate',  //设备更新
    // resourcePlaningList:BSEURL + '/resourcePlaning/list', //资源规划列表
    // moduleDelete:BSEURL + '/resource/moduleDelete', //删除微模块
    // cabinetDelete:BSEURL + '/resource/cabinetDelete', //删除机柜
    // auditingRecord : BSEURL + '/apply/auditingRecord/', //审核记录
    // moduleCount: BSEURL + '/planUse/moduleCount/',
    // getApplyDetail: BSEURL + '/apply/getApplyDetail/',
    // checkeiaclogin:BSEURL + "/eac/checkeiaclogin", //检查EIAC是否登录
    // eiacloginForm:BSEURL + "/eac/eiacloginForm" //EIAC登录
  };
};
