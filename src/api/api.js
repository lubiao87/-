// 导入api接口模块
import reqUrl from "./api-p/request_url";
import reqUrl2 from "./api-p/module_url";
import reqUrl3 from "./api-p/maintain_url";

// 获取当前环境变量 true => 生产环境 false => 开发环境
const BASEURL =
  process.env.NODE_ENV === "production" ? "/AccessRoom" : "/AccessRoom";
export const api = {
  ...reqUrl(BASEURL)
};
export const api2 = {
  ...reqUrl2(BASEURL)
};
export const api3 = {
  ...reqUrl3(BASEURL)
};
// export const url = modelUrl;

export default [api, api2, api3];
