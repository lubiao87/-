import Vue from "vue";
import Router from "vue-router";
// import page1 from "./views/page1.vue";

Vue.use(Router);

  const routes =  [
    // 入口
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () =>
        import("./views/Home.vue"),
      // redirect: () =>
      //   import("./views/page1.vue"),
      meta: {
        auth: true // 这里设置，当前路由需要校验
      },
      children: [
        //机构管理
        // {
        //   path: '/orgManagement',
        //   name: 'orgManagement',
        //   component: orgManagement,
        //   meta: {
        //     keepAlive: true,
        //   }
        // }
      ]
    },
     //登录
    {
      path: '/login',
      name: 'login',
      component: () =>
        import("./components/login/login.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import("./views/About.vue")
    }
  ]
  const router = new Router({
    routes
  })
router.beforeEach((to, from, next) => {
  // 对路由进行验证
  console.log(to.fullPath)
  if (to.matched.some(m => m.meta.auth)) {
    if(sessionStorage.getItem('logined')){//已经登陆
      console.log("--------------------------------------------");
      var headers = JSON.parse(sessionStorage.getItem("headers"));
      let menuList = JSON.parse(headers.menuList);
      // console.log(menuList);
      let isAccess = false;
      // console.log(to);
      for (var i = 0; i < menuList.length; i++){
        if(menuList[i]==null){
            continue;
        }
        if(menuList[i].menuUrl!=null && menuList[i].menuUrl.indexOf(to.fullPath)>=0){//允许访问
            isAccess = true;
        }
      }
      if(to.fullPath.indexOf("populationDistribution")>=0){//第一页，需要修改
        isAccess = true;
      }
      if(to.fullPath.indexOf("micromoduleDetal")>=0){//模块间详情
        isAccess = true;
      }
      if(to.fullPath.indexOf("requestMsg")>=0){//模块间详情
        isAccess = true;
      }
      if(to.fullPath.indexOf("application")>=0){//模块间详情
        isAccess = true;
      }
      if(to.fullPath.indexOf("resourcePlanList")>=0){//模块间详情
        isAccess = true;
      }
      if(isAccess){
        // console.log("有权限");
        next();
      }else{
        // console.log("无权限");
        next({path: '/login', query: {referrer: to.fullPath}});
      }
    }else{
      next({path: '/login', query: {referrer: to.fullPath}});
    }
  }else{
    next();
  }

})
export default router