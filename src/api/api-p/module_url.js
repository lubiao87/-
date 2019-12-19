export default BSEURL => {
  return {
    getFrameList: BSEURL + "/machineFrame/getFrameList", // 根据name搜索微机楼、微模块间、微模块
    getRoomByIdData: BSEURL + "/data/getRoomByIdData" // 根据id获取机房信息
  };
};
