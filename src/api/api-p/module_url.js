export default BSEURL => {
  return {
    searchModule: BSEURL + "/planUse/searchModule", // 根据name搜索微机楼、微模块间、微模块
    buildingStatistics: BSEURL + "/planUse/count/", // 微机楼统计，以及中心地图列表
    regionId: BSEURL + "/planUse/getRegion", // 获取区域
    roomCount: BSEURL + "/planUse/roomCount/", // 4.	根据微机楼ID和微模块间ID获取微模块间统计信息
    cabinetDetail: BSEURL + "/planUse/cabinetDetail/", // 5.	根据机柜ID获取机柜详细信息(机柜详情、机柜统计信息、U位列表)
    getUnit: BSEURL + "/planUse/getUnit/", //	6.	根据机柜ID、交付状态（可选）获取U位信息列表
    src1: "assets" //	6.	根据机柜ID、交付状态（可选）获取U位信息列表
  };
};
