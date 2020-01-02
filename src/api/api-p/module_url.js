export default BSEURL => {
  return {
    getFrameList: BSEURL + "/machineFrame/getFrameList", // 根据name搜索微机楼、微模块间、微模块
    getRoomByIdData: BSEURL + "/data/getRoomByIdData", // 根据id获取机房信息
    getJiLouData: BSEURL + "/data/getJiLouData", // 获取机楼分布
    getJieRuJianData: BSEURL + "/data/getJieRuJianData", // 获取机楼分布
    getBuildStatistics: BSEURL + "/data/getBuildStatistics", // 获取区市其它数据
    getJieRuJianStatistics: BSEURL + "/data/getJieRuJianStatistics", // 接入间详情统计数据
    getAreaNumberData: BSEURL + "/data/getAreaNumberData" // 获取区域数量
  };
};
