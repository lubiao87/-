<template>
  <div>
    <!-- 头部导航栏开始 -->
    <div class="header ui_header clearfix">
      <h1 class="ui_logo">
        <img class="ui-logoImg" src="../assets/common/image/logo.png" />
      </h1>
      <div class="ui-nav-center clearfix">
        <ul class="ui-nav-menu clearfix">
          <!-- <li class="ui-menu-firstli">
            <a class="ui-menu-firsta"
               :class="{ 'iscur':['//populationHome','/wifiHome','/regionalHome','/tradeHome'].indexOf(currentPath)>-1}">首页</a>
          </li> -->

          <li class="ui-menu-firstli current" v-show="isShowPlanManagement">
            <a
              class="ui-menu-firsta"
              :class="{
                iscur:
                  [
                    '/index',
                    '/lbsMapView'
                  ].indexOf(currentPath) > -1
              }"
              >规划使用管理</a
            >
            <ul class="ui-menu-second">
              <li
                class="ui-menu-secondli"
                v-show="isShowLbsMapView"
              >
                <a class="ui-menu-seconda" @click="pushPage('/lbsMapView')"
                  >微机楼可视化</a
                >
              </li>
            </ul>
          </li>

          <li class="ui-menu-firstli current" v-show="isShowResourcesManagement">
            <a
              class="ui-menu-firsta"
              :class="{
                iscur:
                  [
                    '/resourceList',
                    '/application',
                    '/preemptMessage',
                    '/requestMsg',
                    '/micromoduleDetal',
                    '/resourcePlanList',
                    '/maintainList'
                  ].indexOf(currentPath) > -1
              }"
              >资源管理</a
            >
            <ul class="ui-menu-second">
              <li class="ui-menu-secondli" v-show="isShowApplicationList">
                <a class="ui-menu-seconda" @click="pushPage('/application')"
                  >申请单信息</a
                >
              </li>
              <li class="ui-menu-secondli" v-show="isShowpreemptMessageList">
                <a class="ui-menu-seconda" @click="pushPage('/preemptMessage')"
                  >预占设备信息</a
                >
              </li>
              <li class="ui-menu-secondli" v-show="isShowMaintainList">
                <a class="ui-menu-seconda" @click="pushPage('/maintainList')"
                  >可维护列表</a
                >
              </li>
            </ul>
          </li>
          <li class="ui-menu-firstli" v-show="isShowSystemManagement">
            <a
              class="ui-menu-firsta"
              :class="{
                iscur:
                  [
                    '/orgManagement',
                    '/roleManagement',
                    '/sysUserManagement'
                  ].indexOf(currentPath) > -1
              }"
              >系统管理</a
            >
            <ul class="ui-menu-second">
              <!-- <li class="ui-menu-secondli" v-show="isShowOrgManagement"><a class="ui-menu-seconda"  @click="pushPage('/orgManagement')">机构管理</a></li> -->
              <li class="ui-menu-secondli" v-show="isShowRoleManagement"><a class="ui-menu-seconda"  @click="pushPage('/roleManagement')">角色管理</a></li>
              <li class="ui-menu-secondli" v-show="isShowSysUserManagement"><a class="ui-menu-seconda"  @click="pushPage('/sysUserManagement')">用户管理</a></li>
            </ul>
          </li>

        </ul>
      </div>
      <div class="ui-nav-right clearfix">
        <div class="ui-nav-user">
          <div class="ui-user-System clearfix">
            <span class="ui-nav-userimg"></span>
            <span class="ui-system" v-show="!logined" @click="tologin"
              >请登录</span
            >
            <span class="ui-system" v-show="logined">{{ userName }}</span>
          </div>
          <div class="header_icon_logout fn-ml20" @click="logoutComFirm"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listSearchMixin } from "../mixin"; //混淆请求
import { api } from "../api/api"; //api配置请求的路径

export default {
  name: "indexNav",
  mixins: [listSearchMixin],
  data() {
    return {
      logined: false,
      userName: "",
      isShowSystemManagement:false,//是否展示系统管理
      isShowOrgManagement:false,//是否展示机构管理
      isShowRoleManagement:false,//是否展示角色管理
      isShowSysUserManagement:false,//是否展示用户管理

      isShowPlanManagement:false,//是否展示规划使用管理
      isShowLbsMapView:false,//是否展示微机楼可视化

      isShowResourcesManagement:false,//是否展示资源管理
      isShowApplicationList:false,//是否展示申请单
      isShowpreemptMessageList:false,//是否展示预占设备
      isShowMaintainList:false, //是否展示可维护列表
    };
  },
  mounted() { 
    let isLogin = sessionStorage.getItem("logined");
    var headers = JSON.parse(sessionStorage.getItem("headers"));
    if (
      isLogin &&
      headers != null &&
      headers.userId != null &&
      headers.userName != null
    ) {
      this.logined = true;
      this.userName = headers.userName;
    }
    if (!headers) {
      return;
    }
    let menuList = JSON.parse(headers.menuList);
    let buttonList = JSON.parse(headers.buttonList);
    // this.menuList = menuList;
    // console.log(menuList);
    // console.log(buttonList);
    for (var i = 0; i < menuList.length; i++) {
      if (menuList[i] == null || menuList[i].url == null) {
        continue;
      }
      // console.log(menuList[i]);
      let flag = 0; //无查看权限
      if (menuList[i].parenId != 0) {
        //二级目录
        for (var j = 0; j < buttonList.length; j++) {
          if (
            menuList[i].id == buttonList[j].parentMenuId &&
            buttonList[j].name == "查看"
          ) {
            flag = 1;
          }
        }
      } else {
        flag = 1;
      }

    //系统管理-二级
      if(menuList[i].url.indexOf('/orgManagement')>=0 && flag==1){
          this.isShowOrgManagement = true;
      }
      if(menuList[i].url.indexOf('/roleManagement')>=0 && flag==1){
          this.isShowRoleManagement = true;
      }
      if(menuList[i].url.indexOf('/sysUserManagement')>=0 && flag==1){
          this.isShowSysUserManagement = true;
      }
      
      //规划使用管理-二级
      if(menuList[i].url.indexOf('/lbsMapView')>=0){//这个无须查看
          this.isShowLbsMapView = true;
      }

      //资源管理-二级
      if(menuList[i].url.indexOf('/application')>=0){
          this.isShowApplicationList = true;
      }
      if(menuList[i].url.indexOf('/preemptMessage')>=0){
        this.isShowpreemptMessageList = true;
      }
      if(menuList[i].url.indexOf('/maintainList')>=0){
          this.isShowMaintainList = true;
      }
    }  
    if(this.isShowOrgManagement || this.isShowRoleManagement || this.isShowSysUserManagement){
      this.isShowSystemManagement = true;
    }
    if(this.isShowLbsMapView){
      this.isShowPlanManagement = true;
    }
    if(this.isShowApplicationList || this.isShowpreemptMessageList || this.isShowMaintainList){
      this.isShowResourcesManagement = true;
    }
  },
  methods: {
    pushPage(url, param) {
      this.$router.push({ path: url, query: param });
    },
    tologin() {
      this.$router.push("/login");
    },
    logoutComFirm() {
      this.$confirm("是否确定退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          let param = {
            url: api.logout,
            method: "get"
          };
          self.sendReq(param, res => {
            this.$router.push("/login");
            console.log(res);
          });
          window.sessionStorage.removeItem("headers"); //清除session
          window.sessionStorage.removeItem("logined");
        })
        .catch(() => {});
    }
  },
  computed: {
    currentPath() {
      return this.$route.path;
    }
  }
};
</script>
<style>
.header_icon_logout {
  background-image: url(../assets/common/image/header_icon_logout.png);
  width: 20px;
  height: 20px;
  opacity: 0.6;
}
.header_icon_logout:hover {
  opacity: 1;
  cursor: pointer;
}
</style>
<style scoped>
.header_icon_logout.fn-ml20 {
  display: inline-block;
  float: left;
  margin-top: 24px;
}
</style>
