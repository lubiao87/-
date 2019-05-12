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
                    '/populationDistribution',
                    '/populationTrends',
                    '/populationPortrait',
                    '/populationFlow'
                  ].indexOf(currentPath) > -1
              }"
              >规划使用管理</a
            >
            <ul class="ui-menu-second">
              <li
                class="ui-menu-secondli"
                v-show="isShowPopulationDistribution"
              >
                <a class="ui-menu-seconda" @click="pushPage('/index')"
                  >微机楼可视化</a
                >
              </li>
            </ul>
          </li>
          <li class="ui-menu-firstli current">
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
                    '/resourcePlanList'
                  ].indexOf(currentPath) > -1
              }"
              >资源管理</a
            >
            <ul class="ui-menu-second"></ul>
          </li>
          <li class="ui-menu-firstli">
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
            <ul class="ui-menu-second"></ul>
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
      isShowPlanManagement: false, //是否展示规划使用管理
      isShowPopulationDistribution: false
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
    let menuList = JSON.parse(headers.menuList);
    let buttonList = JSON.parse(headers.buttonList);
    this.menuList = menuList;
    console.log(menuList);
    // console.log(buttonList);
    for (var i = 0; i < menuList.length; i++) {
      if (menuList[i] == null || menuList[i].menuUrl == null) {
        continue;
      }
      // console.log(menuList[i]);
      let flag = 0; //无查看权限
      if (menuList[i].parenId != 0) {
        //二级目录
        for (var j = 0; j < buttonList.length; j++) {
          if (
            menuList[i].menuId == buttonList[j].parenMenuId &&
            buttonList[j].buttonName == "查看"
          ) {
            flag = 1;
          }
        }
      } else {
        flag = 1;
      }
      //规划使用管理-二级
      if (menuList[i].menuUrl.indexOf("/populationDistribution") >= 0) {
        //这个无须查看
        this.isShowPopulationDistribution = true;
      }
    }
    if (this.isShowPopulationDistribution) {
      this.isShowPlanManagement = true;
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
}
</style>
<style scoped>
.header_icon_logout.fn-ml20 {
  display: inline-block;
  float: left;
  margin-top: 24px;
}
</style>
