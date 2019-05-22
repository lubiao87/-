import Vue from "vue";
import Router from "vue-router";

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
    redirect: "/mapView",
    meta: {
      auth: false // 这里设置，当前路由需要校验
    },
    children: [
      //地图页面
      {
        path: "/mapView",
        name: "mapView",
        component: () => import("./views/map/mapView.vue"),
        meta: {
          auth: true, // 这里设置，当前路由需要校验
          keepAlive: true // 缓存
        }
      },
      {
        path: "/buildModel",
        name: "buildModel",
        component: () => import("./views/webGL/build-model.vue"),
        meta: {
          auth: false,
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
  routes
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
          menuList[i].menuUrl != null &&
          menuList[i].menuUrl.indexOf(to.fullPath) >= 0
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
