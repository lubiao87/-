<template>
  <div style="width: 100%;height:100%;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <!-- 右边收缩栏开始 -->
    <div  style="width: 100%;height:100%;" id="buildModel"></div>
    <div class="ui-shrinkBar" v-bind:class="{'ui-shrinkBar-right':panelShow}">
      <div @click="panelShow = !panelShow" class="ui-shrinkBar-close"
           v-bind:class="{'ui-shrinkBar-open':panelShow, 'ui-shrinkBar-close': !panelShow }"></div>
        <div class="ui-citytol">
          <h5 class="ui-city-title"><span class="icon-location"></span> 当前区域</h5>
          <div class="scroll-wrap fn-mt10 regionName">
            areaName[0].label
          </div>
        </div>
        <div style="margin-top: 30px;">
          <h5 class="ui-city-title ui-height48"><span class="ui-linebg"></span>moduleTitle</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div class="lb-module-list">
                <ul>
                  <li >
                      <span>index + 1</span>
                      <span>item.name</span>
                      <!--<span class="lb-icon" :class="{'danger_icon': item.Situation == '严重警告','warning_icon': item.Situation == '一般警告'}"></span>-->
                      <span class="lb-icon"></span>
                  </li>
                  <li>
                      <span>index + 1</span>
                      <span>item.name</span>
                      <!--<span class="lb-icon" :class="{'danger_icon': item.Situation == '严重警告','warning_icon': item.Situation == '一般警告'}"></span>-->
                      <span class="lb-icon"></span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      <div class="yhui-real-timeimg"></div>

      </div>
    <!-- 右边收缩栏结束 -->
  </div>
</template>

<script>
// import echarts from "echarts"; // 引入echarts
// import "echarts/lib/chart/map";
// require("echarts/extension/bmap/bmap");
// import { api2 } from "../../api/api"; //api配置请求的路径
import { listSearchMixin } from "../../mixin"; //混淆请求
import * as THREE from "three";
require("three-fbxloader-offical");
import { OrbitControls } from "../../utils/OrbitControls";
export default {
  name: "olmap",
  props: ["coordinate"],
  mixins: [listSearchMixin],
  data() {
    return {
      scene: null,  // 场景
      FBXloader: null,  // fbx加载器
      ambient: null, // 环境光
      camera: null, // 相机视角
      renderer: null, // 创建渲染器对象
      controls: null,  // 创建控件对象
      axisHelper: null, // 辅助坐标系
      STLLoader: null,
      windowHalfX: 0,
      windowHalfY: 0,
      raycaster: null,
      mouse: null,
      clock: null,
      mixer: null,
      intersects: null, // -----
      timer: 20000,
      loading:true,
      panelShow: true,
      lookAround: false
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      self.createHtml();
    });
    //  this.$parent.restaurants = this.$parent.loadAll();
  },
  methods: {
    createHtml () {
        const self = this;
        // console.log(GKG);
        this.scene = null;
        this.scene = new THREE.Scene(); // 场景
        this.FBXloader = new THREE.FBXLoader(); // fbx加载器
        self.FBXloader.load("./assets/fbx/building.FBX", self.loaderObj);
         this.FBXloader.load("./assets/fbx/SambaDancing.fbx", self.loaderMan)
        this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
        this.renderer = new THREE.WebGLRenderer(); // 渲染器
        this.scene.add(this.ambient);
        this.clock = new THREE.Clock();
        this.setCamera()
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target = new THREE.Vector3(0, 0, 0)
        this.controls.type = 'orbit'
        //再建一个点光源 颜色 强度 照射距离
        this.pointLight = new THREE.PointLight( '#fff', 1, 100000 );
        //设置点光源的位置
        this.pointLight.position.set(30000,0,0);
        //把点光源加入到场景中
        this.scene.add( this.pointLight );
        // this.camera.position.x = this.timer;
        // this.camera.lookAt( this.scene.position );
        this.axisHelper = new THREE.AxisHelper(8000)   // 辅助线
        // this.scene.add(this.axisHelper)
        //声明raycaster和mouse变量
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        // this.pushLineBox()  // 虚线框
        window.onresize = this.onWindowResize
        window.requestAnimationFrame(this.render)
        this.render();
    },
    loaderMan (obj) {
        // console.log(obj)
        // this.loading = false
        obj.scale.set(15, 15, 15);
        this.scene.add(obj)
        // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
        // console.log(THREE.AnimationMixer, '------+++++-----')
        this.mixer = new THREE.AnimationMixer(obj);
        // 查看动画数据
        // console.log(obj.animations)
        // obj.animations[0]：获得剪辑对象clip
        var AnimationAction = this.mixer.clipAction(obj.animations[0]);
        // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
        AnimationAction.play();//播放动画
    },
    loaderObj(obj) {
    //   console.log(obj);
      this.loading = false
      this.lookAround = true
      obj.translateY(-17000);
      this.scene.add(obj)
    },
    setCamera () {
        let width = document.body.clientWidth // 窗口宽度
        let height = document.body.clientHeight // 窗口高度
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
        this.camera.position.set(-80000, 20800, 20000)
        this.camera.lookAt(this.scene.position)
        this.renderer.setSize(width, height)  // 设置渲染区域尺寸
        this.renderer.setClearColor('#16244a', 1) // 设置背景颜色
        // document.getElementById('pos').removeChild(this.renderer.domElement)
        document.getElementById('buildModel').appendChild(this.renderer.domElement)  // body元素中插入canvas对象
    },
    onWindowResize () {
    //   this.windowHalfX = window.innerWidth / 2;
    //   this.windowHalfY = window.innerHeight / 2;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    },
    render () {
    //   if (this.scene) {
        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.render)
        // console.log(this.mixer, 'this.mixer')
        if (this.mixer !== null) {
          // console.log(this.clock.getDelta())
          //clock.getDelta()方法获得两帧的时间间隔
          // 更新混合器相关的时间
          this.mixer.update(this.clock.getDelta());
        }
        // if (this.lookAround) {
        //   var timer = -0.001 * Date.now();
        //   this.timer =  Math.cos( timer ) * 10000
        //   this.camera.position.x = this.timer;
        //   // this.camera.position.y += -( this.mouseY + this.camera.position.y ) * .2 + 6000;
        //   // this.camera.position.z = 10000 * Math.sin( timer );
        //   this.scene.position.set(-1000, 2000, -2000)
        //   // this.camera.lookAt( this.scene.position );
        //   this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // }

    // }
    }
  }
};
</script>
<style>
.stip-formatter * {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: normal;
}
.stip-formatter {
  position: absolute;
  background-color: #fff;
  color: #000;
  width: 278px;
  border-radius: 5px;
  overflow: hidden;
  /* height: 80px; */
}
.stip-formatter > div {
  margin-top: 10px;
  width: 100%;
  padding-left: 15px;
  /* padding-bottom: 15px; */
  /* height: 30px; */
  /* line-height: 30px; */
}
.stip-formatter > div:last-child {
  padding-bottom: 15px;
}
.stip-formatter div .span {
  width: 40%;
  text-align: left;
}
.stip-formatter div span {
  float: left;
  width: 60%;
}
</style>
<style scoped>
.map {
  position: relative;
  height: 100%;
  width: 100%;
}
.stip-box {
  position: absolute;
  width: 300px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #ddd;
  text-align: right;
}
</style>
