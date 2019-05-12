export default (BSEURL) => {
  return {
    // 登录
    login: BSEURL + '/user/login ',
   
    getOrganList: BSEURL + '/organ/getOrganList', 
    
  }
}
