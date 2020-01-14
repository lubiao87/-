import Vue from "vue";
import Router from "vue-router";
import resourcePlanList from "./views/resourcePlanning/resourcePlanList"; // 资源管理 /资源规划

import maintainList from "./views/maintainList/maintainList"; // 资源管理 /可维护列表
import machineRoomList from "./views/maintainList/machineRoomList"; // 资源管理 /机房可维护列表
import frameList from "./views/maintainList/frameList"; // 资源管理 /机架可维护列表
import lookEquipment from "./views/maintainList/lookEquipment"; // 资源管理 /设备可维护列表
import preemptMessage from "./views/preemptMessage/preemptMessage"; //资源管理 /预占设备信息
import application from "./views/naturalManagement/application"; // 资源管理 /申请单信息

import requestMsg from "./views/naturalManagement/requestMsg"; // 资源管理 /详情

import orgManagement from './views/system/orgManagement' //平台管理/权限管理
import roleManagement from './views/system/roleManagement' //平台管理/角色管理
import sysUserManagement from './views/system/sysUserManagement' //平台管理/用户管理

Vue.use(Router);

const routes = [
  // 入口
  {
    path: "/",
    redirect: "/index"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("./views/Home.vue"),
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/index",
    name: "index",
    component: () => import("./components/index.vue"),
    // redirect: () => import("./views/map/mapView.vue"),
    redirect: "/login",
    meta: {
      auth: false // 这里设置，当前路由需要校验
    },
    children: [
      //高德地图页面
      {
        path: "/lbsMapView",
        name: "lbsMapView",
        component: () => import("./views/map/lbsMapView.vue"),
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true // 缓存
        }
      },
      //机构管理
      {
        path: '/orgManagement',
        name: 'orgManagement',
        component: orgManagement,
        meta: {
          keepAlive: true,
        }
      },
      //角色管理
      {
        path: '/roleManagement',
        name: 'roleManagement',
        component: roleManagement,
        meta: {
          keepAlive: true,
          auth: true // 这里设置，当前路由需要校验
        }
      },
      //用户管理
      {
        path: '/sysUserManagement',
        name: 'sysUserManagement',
        component: sysUserManagement,
        meta: {
          keepAlive: true,
          auth: true // 这里设置，当前路由需要校验
        }
      },
      {
        path: "/resourcePlanList",
        name: "resourcePlanList",
        component: resourcePlanList,
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true
        }
      },
      {
        path: "/maintainList",
        name: "maintainList",
        component: maintainList,
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true
        }
      },
	  {
	    path: "/machineRoomList",
	    name: "machineRoomList",
	    component: machineRoomList,
	    meta: {
	      auth: true, // 这里设置，当前路由需要校验
	      keepAlive: true
	    }
	  },{
	    path: "/frameList",
	    name: "frameList",
	    component: frameList,
	    meta: {
	      auth: true, // 这里设置，当前路由需要校验
	      keepAlive: true
	    }
	  },{
	    path: "/lookEquipment",
	    name: "lookEquipment",
	    component: lookEquipment,
	    meta: {
	      auth: true, // 这里设置，当前路由需要校验
	      keepAlive: true
	    }
	  },
      {
        path: "/buildModel",
        name: "buildModel",
        component: () => import("./views/webGL/build-model.vue"),
        meta: {
          auth: true,
          keepAlive: false
        }
      },
      //  资源管理模块
      {
        path: "/application",
        name: "application",
        component: application,
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true
        }
      },
      {
        path: "/requestMsg",
        name: "requestMsg",
        component: requestMsg,
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: false
        }
      },
      //预占设备信息
      {
        path: "/preemptMessage",
        name: "preemptMessage",
        component: preemptMessage,
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true
        }
      }
    ]
  },
  //登录
  {
    path: "/login",
    name: "login",
    component: () => import("./components/login/login.vue")
  }
];
const router = new Router({
  routes,
  // mode: "history",
  // base:
  //   process.env.NODE_ENV === "development" ? process.env.BASE_URL : "/transWeb" //transWeb是生产环境放代码的目录
});
router.beforeResolve((to, from, next) => {
  // console.log(to.matched, "to.matched");
  if (to.matched.some(m => m.meta.auth)) {
    if (sessionStorage.getItem("logined")) {
      //已经登陆
      // console.log("--------------------------------------------");
      var headers = JSON.parse(sessionStorage.getItem("headers"));
      let menuList = JSON.parse(headers.menuList);
      let isAccess = false;
      for (var i = 0; i < menuList.length; i++) {
        if (menuList[i] == null) {
          continue;
        }
        if (
          menuList[i].url != null &&
          menuList[i].url.indexOf(to.fullPath) >= 0
        ) {
          //允许访问
          isAccess = true;
        }
      }
      if (to.fullPath.indexOf("/index") >= 0) {
        //主页权限
        isAccess = true;
      }
      if (to.fullPath.indexOf("/mapView") >= 0) {
        //主页权限
        isAccess = true;
      }
      if (to.fullPath.indexOf("/buildModel") >= 0) {
        //主页权限
        isAccess = true;
      }
      if (to.fullPath.indexOf("/lbsMapView") >= 0) {
        //主页权限
        isAccess = true;
      }
      if (to.fullPath.indexOf("/resourcePlanList") >= 0) {
        isAccess = true;
      }
      if (to.fullPath.indexOf("/machineRoomList") >= 0) {
        isAccess = true;
      }
      if (to.fullPath.indexOf("/frameList") >= 0) {
        isAccess = true;
      }
      if (to.fullPath.indexOf("/lookEquipment") >= 0) {
        isAccess = true;
      }
      if (to.fullPath.indexOf("/requestMsg") >= 0) {
        isAccess = true;
      }
      if (isAccess) {
        // console.log("有权限");
        next();
      } else {
        // console.log("无权限");
        next({ path: "/login", query: { referrer: to.fullPath } });
      }
    } else {
      next({ path: "/login", query: { referrer: to.fullPath } });
    }
  } else {
    next();
  }
});
export default router;
