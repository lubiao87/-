export default BSEURL => {
  return {
    // 机楼模块
    getCountyList: BSEURL + "/build/getCountyList", // 获取广州市内区县分公司
    getBuildListByParamPage: BSEURL + "/build/getBuildListByParamPage", // 按条件分页查询机楼列表
	// 接入间
    getAccessRoomListByPage: BSEURL + "/room/getAccessRoomListByPage", // 按条件分页查询接入间列表
	// 机房模块
    getFloorListByBuildId: BSEURL + "/room/getFloorListByBuildId", // 根据机楼Id查询楼层列表
    insertRoomSelective: BSEURL + "/room/insertRoomSelective", // 新增机房
    getRoomListByParamPage: BSEURL + "/room/getRoomListByParamPage", // 按条件分页查询机房列表
    getRoomDetailById: BSEURL + "/room/getRoomDetailById", // 根据机房Id查询机房详情
    updateRoomSelective: BSEURL + "/room/updateRoomSelective", // 修改机房
    batchDeleteRoom: BSEURL + "/room/batchDeleteRoom", // 批量删除机房
    batchImportRoom: BSEURL + "/room/batchImportRoom", // 批量导入机房数据
	// 机架模块
    insertFrameSelective: BSEURL + "/frame/insertFrameSelective", // 新增机架
    getFrameListByParamPage: BSEURL + "/frame/getFrameListByParamPage", // 按条件分页查询机架列表
    getFrameDetailById: BSEURL + "/frame/getFrameDetailById", // 根据机架Id查询机架详情
    updateFrameSelective: BSEURL + "/frame/updateFrameSelective", // 修改机架信息
    batchDeleteFrame: BSEURL + "/frame/batchDeleteFrame", // 批量删除机架
    getEquipmentListByParamPage: BSEURL + "/frame/getEquipmentListByParamPage", // 按条件分页查询设备列表
    batchImportframe: BSEURL + "/frame/batchImportframe", // 批量导入机架数据
    getFrameName: BSEURL + "/frame/getFrameName", // 机架类型名称集合
	// 其他物体模块
    insertOtherSelective: BSEURL + "/other/insertOtherSelective", // 新增其他物体
    getOtherListByParamPage: BSEURL + "/other/getOtherListByParamPage", // 按条件分页查询其他物体列表
    getOtherDetailById: BSEURL + "/other/getOtherDetailById", // 根据cjId查询其他物体详情
    updateOtherSelective: BSEURL + "/other/updateOtherSelective", // 修改其他物体信息
    batchDeleteOther: BSEURL + "/other/batchDeleteOther", // 批量删除其他物体
    batchImportOther: BSEURL + "/other/batchImportOther", // 批量导入其他物体
    getOtherName: BSEURL + "/other/getOtherName", //获取其他物体名称集合
	// 列头柜模块
    insertColumnCabinetSelective: BSEURL + "/columnCabinet/insertColumnCabinetSelective", // 新增列头柜
    getColumnCabinetListByParamPage: BSEURL + "/columnCabinet/getColumnCabinetListByParamPage", // 按条件分页查询列头柜列表
    getColumnCabinetDetailById: BSEURL + "/columnCabinet/getColumnCabinetDetailById", // 查询列头柜详情
    updateColumnCabinetSelective: BSEURL + "/columnCabinet/updateColumnCabinetSelective", // 修改列头柜信息
    batchDeleteColumnCabinet: BSEURL + "/columnCabinet/batchDeleteColumnCabinet", // 批量删除列头柜
	// 申请单模块
    getApplyListByParamPage: BSEURL + "/apply/getApplyListByParamPage", // 按条件分页查询申请单列表
    getApplyDetailById: BSEURL + "/apply/getApplyDetailById", // 根据申请单Id查询申请单详情
    getApplyAuditDetail: BSEURL + "/apply/getApplyAuditDetail", // 查询申请单审核比对信息
    updateApplySelective: BSEURL + "/apply/updateApplySelective", // 修改申请单信息
  };
};