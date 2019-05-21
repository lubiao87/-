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
          <div class="scroll-wrap fn-mt10 regionName" @click="addMan">
            增加人物
          </div>
          <div class="scroll-wrap fn-mt10 regionName" @click="removeMan">
            删除人物
          </div>
        </div>
        <div style="margin-top: 30px;">
          <h5 class="ui-city-title ui-height48"  @click="showBuilding()"><span class="ui-linebg"></span>商务大厦楼</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div class="lb-module-list">
                <ul>
                  <li v-for="(item, index) in dataList" :key="index" @click="lookFloor(index)">
                      <span>天河别墅:</span>
                      <span>{{item.name}}</span>
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
      raycaster: null,
      mouse: null,
      clock: null,
      mixer: null,
      FloorOne: null,
      FloorTwo: null,
      FloorThree: null,
      FloorFour: null,
      modernBuilding: null, // 楼层obj
      moderBuild: null, // 大楼obj
      personPre: null, // 人obj
      referenceModel: null, // 人网格模型
      AnimationAction: null, // 动画
      intersects: null, // -----
      timer: 20000,
      loading:true,
      panelShow: true,
      lookAround: false,
      floorIndex: -1,
      cameraX: 40000,
      cameraY: 10000,
      cameraZ: 0,
      dataList: [
        {
          name: "一楼",
          id: 111
        },
        {
          name: "二楼",
          id: 112
        },
        {
          name: "三楼",
          id: 113
        },
        {
          name: "四楼",
          id: 114
        },
      ],
      animationTime: 0,
      animationFlag: true,
      cabinetType: [
        {
          name: "空位",
          size:[600, 800, 600],
          type: 0
        },
        {
          name: "名称1",// 名称
          size:[600, 300, 2500], // 长宽高
          type: 1  // 类型1
        },
        {
          name: "名称2",
          size:[800, 600, 2500],
          type: 2
        },
        {
          name: "名称3",
          size:[800, 600, 2000],
          type: 3
        },
        {
          name: "名称4",
          size:[400, 600, 2000],
          type: 4
        },
        {
          name: "名称5",
          size:[400, 350, 2000],
          type: 5
        },
        {
          name: "名称6",
          size:[400, 850, 2000],
          type: 6
        },
        {
          name: "名称7",
          size:[800, 300, 2500],
          type: 7
        },
        {
          name: "名称8",
          size:[800, 600, 2200],
          type: 8
        },
        {
          name: "名称9",
          size:[350, 250, 2200],
          type: 9
        },
        {
          name: "名称10",
          size:[250, 250, 2200],
          type: 10
        },
        {
          name: "名称11",
          size:[300, 550, 2500],
          type: 11
        },
        {
          name: "名称12",
          size:[300, 300, 2500],
          type: 12
        },
        {
          name: "名称13",
          size:[300, 850, 2500],
          type: 13
        },
        {
          name: "名称14",
          size:[725, 600, 2500],
          type: 14
        },
        {
          name: "名称15",
          size:[730, 300, 2500],
          type: 15
        },
        {
          name: "名称16",
          size:[400, 350, 2500],
          type: 16
        },
        {
          name: "名称17",
          size:[400, 850, 2500],
          type: 17
        },
        {
          name: "名称18",
          size:[400, 600, 2500],
          type: 18
        }

      ],
      cabinetPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      cabinetplaced: [
        // 第一排
          {type: 1, position: [-150, 100]},
          {type: 2, position: [300, 0]},
          {type: 2, position: [900, 0]},
          {type: 2, position: [1500, 0]},
          {type: 3, position: [2100, 0]},
          {type: 2, position: [2700, 0]},
          {type: 2, position: [3300, 0]},
          {type: 2, position: [3900, 0]},

          {type: 2, position: [8600, 0]},
          {type: 2, position: [9200, 0]},
          {type: 2, position: [9800, 0]},
          {type: 2, position: [10400, 0]},
          {type: 2, position: [11000, 0]},
          {type: 2, position: [11600, 0]},
          {type: 1, position: [12050, 0]},
        // 第二排
          {type: 1, position: [-150, 1670]},
          {type: 2, position: [300, 1670]},
          {type: 2, position: [900, 1670]},
          {type: 2, position: [1500, 1670]},

          {type: 4, position: [2400, 1870]},
          {type: 4, position: [3000, 1870]},
          {type: 4, position: [3600, 1870]},
          {type: 4, position: [2400, 1470]},
          {type: 4, position: [3000, 1470]},
          {type: 4, position: [3600, 1470]},
          {type: 2, position: [4200, 1670]},
          {type: 4, position: [4800, 1470]},

          {type: 5, position: [6200, 1470]},
          {type: 6, position: [6800, 1470]},
          {type: 6, position: [7650, 1470]},
          {type: 6, position: [8500, 1470]},
          {type: 4, position: [9170, 1470]},
          {type: 4, position: [9770, 1470]},
          {type: 4, position: [10370, 1470]},

          {type: 2, position: [11570, 1670]},
          {type: 7, position: [12000, 1670]},

          {type: 4, position: [10970, 1870]},
          {type: 4, position: [10370, 1870]},
          {type: 4, position: [9770, 1870]},
          {type: 4, position: [9170, 1870]},
          {type: 4, position: [8570, 1870]},
          {type: 4, position: [7970, 1870]},
          {type: 4, position: [7370, 1870]},
          {type: 4, position: [6770, 1870]},
          {type: 4, position: [6170, 1870]},

        // 第三排
          {type: 7, position: [-170, 3340]},
          {type: 3, position: [300, 3340]},
          {type: 2, position: [900, 3340]},
          {type: 2, position: [1500, 3340]},
          {type: 3, position: [2100, 3340]},
          {type: 3, position: [2700, 3340]},
          {type: 3, position: [3300, 3340]},
          {type: 3, position: [3900, 3340]},
          {type: 3, position: [4500, 3340]},
          {type: 3, position: [5100, 3340]},
          {type: 3, position: [5700, 3340]},
          {type: 3, position: [6300, 3340]},

          {type: 2, position: [7500, 3340]},
          {type: 2, position: [8100, 3340]},
          {type: 2, position: [8700, 3340]},
          {type: 2, position: [9300, 3340]},
          {type: 2, position: [9900, 3340]},
          {type: 2, position: [10500, 3340]},
          {type: 2, position: [11100, 3340]},
          {type: 2, position: [11700, 3340]},
          {type: 7, position: [12150, 3340]},

        // 第四排
          {type: 1, position: [0, 4910]},
          {type: 3, position: [450, 5010]},
          {type: 3, position: [1050, 5010]},
          {type: 3, position: [1650, 5010]},
          {type: 2, position: [2250, 5010]},
          {type: 8, position: [2850, 5010]},
          {type: 3, position: [3450, 5010]},
          {type: 3, position: [4050, 5010]},
          {type: 3, position: [4650, 5010]},
          {type: 3, position: [5250, 5010]},
          {type: 3, position: [5850, 5010]},
          {type: 3, position: [6450, 5010]},
          {type: 3, position: [7050, 5010]},

          {type: 2, position: [8050, 5010]},
          {type: 2, position: [8650, 5010]},
          {type: 2, position: [9250, 5010]},
          {type: 2, position: [9850, 5010]},
          {type: 2, position: [10450, 5010]},
          {type: 2, position: [11050, 5010]},
          {type: 2, position: [11650, 5010]},
          {type: 1, position: [12070, 5010]},

        // 第五排
          {type: 7, position: [-300, 6680]},
          {type: 3, position: [150, 6680]},
          {type: 3, position: [750, 6680]},
          {type: 2, position: [1350, 6680]},
          {type: 3, position: [1950, 6680]},
          {type: 2, position: [2550, 6680]},
          {type: 2, position: [3150, 6680]},

          {type: 5, position: [3900, 6480]},
          {type: 4, position: [3900, 6880]},
          {type: 6, position: [4500, 6480]},
          {type: 6, position: [4625, 6880]},
          {type: 4, position: [5250, 6480]},
          {type: 4, position: [5850, 6480]},
          {type: 4, position: [6450, 6480]},
          {type: 4, position: [6450, 6880]},
          {type: 4, position: [7050, 6480]},
          {type: 4, position: [7050, 6880]},
          {type: 2, position: [7650, 6680]},
          {type: 2, position: [8250, 6680]},
          {type: 2, position: [8850, 6680]},
          {type: 4, position: [9450, 6480]},
          {type: 4, position: [9450, 6880]},
          {type: 2, position: [10050, 6680]},
          {type: 4, position: [10650, 6480]},
          {type: 4, position: [10650, 6880]},
          {type: 2, position: [11250, 6680]},
          {type: 1, position: [11700, 6770]},

        // 第六排
          {type: 16, position: [-100, 8550]},
          {type: 17, position: [500, 8550]},
          {type: 17, position: [1350, 8550]},
          {type: 18, position: [2075, 8550]},
          {type: 17, position: [2800, 8550]},
          {type: 17, position: [3650, 8550]},
          {type: 17, position: [4500, 8550]},
          {type: 17, position: [5350, 8550]},
          {type: 17, position: [6200, 8550]},
          {type: 18, position: [6925, 8550]},
          {type: 18, position: [7525, 8550]},
          {type: 17, position: [8250, 8550]},
          {type: 17, position: [9100, 8550]},
          {type: 17, position: [9950, 8550]},
          {type: 17, position: [10800, 8550]},
          {type: 18, position: [11525, 8550]},
          {type: 16, position: [12000, 8550]},


          {type: 18, position: [-300, 8950]},
          {type: 18, position: [300, 8950]},
          {type: 18, position: [900, 8950]},
          {type: 17, position: [1625, 8950]},
          {type: 18, position: [2350, 8950]},
          {type: 18, position: [2950, 8950]},
          {type: 18, position: [3550, 8950]},
          {type: 17, position: [4300, 8950]},
          {type: 17, position: [5150, 8950]},
          {type: 17, position: [6000, 8950]},
          {type: 17, position: [6850, 8950]},
          {type: 18, position: [7575, 8950]},
          {type: 17, position: [8300, 8950]},
          {type: 17, position: [9150, 8950]},
          {type: 17, position: [10000, 8950]},
          {type: 17, position: [10850, 8950]},
          {type: 18, position: [11575, 8950]},
          {type: 18, position: [12175, 8950]},

        // 第七排
          {type: 7, position: [100, 10620]},
          {type: 3, position: [550, 10620]},
          {type: 3, position: [1150, 10620]},
          {type: 3, position: [1750, 10620]},
          {type: 3, position: [2350, 10620]},

          {type: 8, position: [3450, 10620]},
          {type: 3, position: [4050, 10620]},
          {type: 18, position: [4650, 10420]},
          {type: 18, position: [4650, 10820]},
          {type: 3, position: [5250, 10620]},
          {type: 3, position: [5850, 10620]},
          {type: 3, position: [6450, 10620]},
          {type: 3, position: [7050, 10620]},
          {type: 3, position: [7650, 10620]},
          {type: 3, position: [8250, 10620]},
          {type: 3, position: [8850, 10620]},
          {type: 3, position: [9450, 10620]},
          {type: 3, position: [10050, 10620]},
          {type: 3, position: [10650, 10620]},
          {type: 18, position: [11250, 10420]},
          {type: 18, position: [11850, 10420]},
          {type: 18, position: [11850, 10820]},
          {type: 7, position: [12300, 10620]},

        // 第七排
          {type: 9, position: [-250, 12090]},
          {type: 9, position: [0, 12090]},
          {type: 9, position: [250, 12090]},
          {type: 9, position: [500, 12090]},
          {type: 9, position: [750, 12090]},
          {type: 9, position: [1000, 12090]},
          {type: 9, position: [1250, 12090]},
          {type: 9, position: [1500, 12090]},
          {type: 9, position: [1750, 12090]},
          {type: 9, position: [2000, 12090]},
          {type: 9, position: [2250, 12090]},
          {type: 9, position: [2500, 12090]},
          {type: 9, position: [2750, 12090]},
          {type: 9, position: [3000, 12090]},
          {type: 9, position: [3250, 12090]},
          {type: 9, position: [3500, 12090]},
          {type: 9, position: [3750, 12090]},
          {type: 9, position: [4000, 12090]},
          {type: 9, position: [4250, 12090]},
          {type: 9, position: [4500, 12090]},
          {type: 9, position: [4750, 12090]},
          {type: 9, position: [5000, 12090]},
          {type: 10, position: [5250, 12140]},
          {type: 10, position: [5500, 12140]},
          {type: 10, position: [5750, 12140]},
          {type: 9, position: [6000, 12090]},
          {type: 9, position: [6250, 12090]},
          {type: 9, position: [6500, 12090]},
          {type: 9, position: [6750, 12090]},
          {type: 9, position: [7000, 12090]},
          {type: 9, position: [7250, 12090]},
          {type: 9, position: [7500, 12090]},
          {type: 9, position: [7750, 12090]},
          {type: 10, position: [8000, 12140]},
          {type: 10, position: [8250, 12140]},
          {type: 10, position: [8500, 12140]},
          {type: 10, position: [8750, 12140]},
          {type: 10, position: [9000, 12140]},
          {type: 10, position: [9250, 12140]},
          {type: 10, position: [9500, 12140]},
          {type: 10, position: [9750, 12140]},
          {type: 10, position: [10000, 12140]},
          {type: 10, position: [10250, 12140]},
          {type: 10, position: [10500, 12140]},
          {type: 10, position: [10750, 12140]},
          {type: 10, position: [11000, 12140]},
          {type: 10, position: [11250, 12140]},
          {type: 10, position: [11500, 12140]},
          {type: 10, position: [11750, 12140]},
          {type: 10, position: [12000, 12140]},
          {type: 10, position: [12250, 12140]},

          {type: 9, position: [-250, 12440]},
          {type: 9, position: [0, 12440]},
          {type: 9, position: [250, 12440]},
          {type: 9, position: [500, 12440]},
          {type: 9, position: [750, 12440]},
          {type: 9, position: [1000, 12440]},
          {type: 9, position: [1250, 12440]},
          {type: 9, position: [1500, 12440]},
          {type: 9, position: [1750, 12440]},
          {type: 9, position: [2000, 12440]},
          {type: 9, position: [2250, 12440]},
          {type: 9, position: [2500, 12440]},
          {type: 9, position: [2750, 12440]},
          {type: 9, position: [3000, 12440]},
          {type: 9, position: [3250, 12440]},
          {type: 9, position: [3500, 12440]},
          {type: 9, position: [3750, 12440]},
          {type: 9, position: [4000, 12440]},
          {type: 9, position: [4250, 12440]},
          {type: 9, position: [4500, 12440]},
          {type: 9, position: [4750, 12440]},
          {type: 9, position: [5000, 12440]},
          {type: 9, position: [5250, 12440]},
          {type: 9, position: [5500, 12440]},
          {type: 9, position: [5750, 12440]},
          {type: 9, position: [6000, 12440]},
          {type: 9, position: [6250, 12440]},
          {type: 9, position: [6500, 12440]},
          {type: 9, position: [6750, 12440]},
          {type: 9, position: [7000, 12440]},
          {type: 9, position: [7250, 12440]},
          {type: 9, position: [7500, 12440]},
          {type: 9, position: [7750, 12440]},
          {type: 9, position: [8000, 12440]},
          {type: 10, position: [8250, 12400]},
          {type: 10, position: [8500, 12400]},
          {type: 10, position: [8750, 12400]},
          {type: 10, position: [9000, 12400]},
          {type: 10, position: [9250, 12400]},
          {type: 10, position: [9500, 12400]},
          {type: 10, position: [9750, 12400]},
          {type: 10, position: [10000, 12400]},
          {type: 10, position: [10250, 12400]},
          {type: 10, position: [10500, 12400]},
          {type: 10, position: [10750, 12400]},
          {type: 10, position: [11000, 12400]},
          {type: 10, position: [11250, 12400]},
          {type: 10, position: [11500, 12400]},
          {type: 10, position: [11750, 12400]},
          {type: 10, position: [12000, 12400]},
          {type: 10, position: [12250, 12400]},

        // 最后一排
          {type: 11, position: [0, 13900]},
          {type: 12, position: [425, 13900]},
          {type: 12, position: [725, 13900]},
          {type: 13, position: [1300, 13900]},
          {type: 13, position: [2150, 13900]},
          {type: 14, position: [2875, 14110]},
          {type: 13, position: [3600, 14000]},

          {type: 12, position: [8335, 14000]},
          {type: 13, position: [8910, 14000]},

          {type: 12, position: [-125, 14310]},
          {type: 13, position: [250, 14310]},
          {type: 13, position: [1300, 14310]},
          {type: 13, position: [2150, 14310]},
          {type: 13, position: [3600, 14310]},
          {type: 13, position: [4450, 14310]},

          {type: 13, position: [8060, 14310]},
          {type: 13, position: [8910, 14310]},

          {type: 14, position: [11210, 14110]},
          {type: 14, position: [11810, 14110]},
          {type: 15, position: [12262, 14110]},
      ]

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
        this.FBXloader.load("./assets/fbx/building.FBX", self.loaderObj);
        this.FBXloader.load("./assets/fbx/SambaDancing.fbx", self.loaderMan)
        this.FBXloader.load("./assets/fbx/floorOne.fbx", self.loaderFloor1)
        this.FBXloader.load("./assets/fbx/floorTwo.fbx", self.loaderFloor2)
        this.FBXloader.load("./assets/fbx/floorThree.fbx", self.loaderFloor3)
        this.FBXloader.load("./assets/fbx/floorFour.fbx", self.loaderFloor4)
        this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
        this.renderer = new THREE.WebGLRenderer(); // 渲染器
        this.scene.add(this.ambient);
        this.clock = new THREE.Clock();
        this.setCamera()
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target = new THREE.Vector3(0, 0, 0)
        this.controls.type = 'orbit'
        this.controls.staticMoving = false;
        //再建一个点光源 颜色 强度 照射距离
        this.pointLight = new THREE.PointLight( '#fff', 0.8, 100000 );
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
        obj.name = "跳舞人"
        obj.scale.set(15, 15, 15);
        this.personPre = obj;
        this.referenceModel = obj.children[1];
        this.referenceModel2 = obj.children[2];
        this.mixer = new THREE.AnimationMixer(obj);
        // 查看动画数据
        // console.log(obj.animations)
        // obj.animations[0]：获得剪辑对象clip
        this.AnimationAction = this.mixer.clipAction(obj.animations[0]);
        // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
        this.AnimationAction.play();//播放动画
        if (!obj.traverse) return
        obj.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        // this.scene.add(obj)
        // console.log(obj)
    },
    loaderObj(obj) {
     // console.log(obj);
      this.loading = false
      obj.translateY(-17000);
      obj.name = "整栋楼房"
      this.scene.add(obj)
      this.modernBuilding = this.scene.getObjectByName ( "整栋楼房" );
      this.moderBuild = this.scene.getObjectByName ( "大楼" );
      // console.log(this.scene)
    },
    loaderFloor1 (obj) {
      this.FloorOne = obj
      obj.name = "我家一楼"
      obj.translateY(-16000);
    },
    loaderFloor2 (obj) {
      this.FloorTwo = obj
      obj.name = "我家二楼"
      obj.translateY(-12000);
    },
    loaderFloor3 (obj) {
      this.FloorThree = obj
      obj.name = "我家三楼"
      obj.translateY(-8000);
    },
    loaderFloor4 (obj) {
      this.FloorFour = obj
      obj.name = "我家四楼"
      obj.translateY(-4000);
    },
    setCamera () {
        let width = document.body.clientWidth // 窗口宽度
        let height = document.body.clientHeight // 窗口高度
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
        this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ)
        this.camera.lookAt(this.scene.position)
        this.renderer.setSize(width, height)  // 设置渲染区域尺寸
        this.renderer.setClearColor('#16244a', 1) // 设置背景颜色
        // document.getElementById('pos').removeChild(this.renderer.domElement)
        document.getElementById('buildModel').appendChild(this.renderer.domElement)  // body元素中插入canvas对象
    },
    onWindowResize () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    },
    render () {
      // if (this.scene) {
        // this.renderer.render(this.scene, this.camera)
        let self = this
        window.requestAnimationFrame(this.render)
        //更新控制器
        this.controls.update();
        //渲染场景和相机
        this.renderer.render( this.scene, this.camera );
        if (this.mixer !== null) {
          // console.log(this.clock.getDelta())
          //clock.getDelta()方法获得两帧的时间间隔
          // 更新混合器相关的时间
          this.mixer.update(this.clock.getDelta());
        }

        if (this.lookAround) { // 楼房渐变
          if (this.animationFlag) { // 进入查看楼层
            if (this.cameraX > 0) {
              this.cameraX -= 500
            }
            if (this.cameraZ > -40000) {
              this.cameraZ -= 500
            }
            if (this.cameraY < 20000) {
              this.cameraY += 500
            }
            let number = 1- (Date.now() - self.animationTime) / 2000
            // console.log(this.cameraX)
            this.moderBuild.material.forEach((item, index) => {
              if (number < 0) {
                self.lookAround = false
                self.scene.remove(this.modernBuilding)
                self.moderBuild.material[index].opacity = 0
              } else {
                self.moderBuild.material[index].transparent = true;
                self.moderBuild.material[index].opacity = number
              }
            });
          } else { // 返回查看房子
            if (this.cameraX < 40000) {
              this.cameraX += 500
            }
            if (this.cameraZ < 0) {
              this.cameraZ += 500
            }
            if (this.cameraY > 10000) {
              this.cameraY -= 500
            }
            let number = (Date.now() - self.animationTime) / 2000
            // console.log(this.cameraX)
            this.moderBuild.material.forEach((item, index) => {
              if (number > 1) {
                self.lookAround = false
                // self.scene.remove(this.modernBuilding)
                self.moderBuild.material[index].opacity = 1
              } else {
                self.moderBuild.material[index].transparent = true;
                self.moderBuild.material[index].opacity = number
              }
            });
          }

          this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ)
        }

      // }
    },
    lookFloor (index) { // 查看楼层
      if (!this.lookAround) {
        this.floorIndex = index
        this.animationFlag = true
        // this.setCabinet()
      }

      // console.log(this.camera.position)
    },
    removeObjAll () {
      const self = this
       this.removeMan()
       const list = this.scene.getObjectByName ( "设备集合" );
       if(list) {
         self.scene.remove(list)
       }
      // this.scene.traverse( function ( child ) {
      //       if ( child.isGroup && child.name ) {
      //         self.scene.remove(child)
      //       }
      //   });
      self.scene.remove(this.modernBuilding)
      self.scene.remove(this.FloorTwo)
      self.scene.remove(this.FloorOne)
      self.scene.remove(this.FloorThree)
      self.scene.remove(this.FloorFour)
    },
    removeMan () { // 删除人物
    if (this.scene.getObjectByName ( "跳舞人" )) {
        this.scene.remove(this.personPre)
      }
    },
    showBuilding () {
      if (!this.lookAround) { // 动画中禁止事件
        this.addBuilding()
        this.floorIndex = -1
        this.animationFlag = false
        this.animationTime = Date.now()
        this.lookAround = true // 开启动画
        // console.log(this.scene)
      }
    },
    addBuilding () { // 显示房子
      if(!this.lookAround) { // 动画中禁止增加
        this.removeObjAll()
        if (!this.scene.getObjectByName ( "整栋楼房" )) {
          this.scene.add( this.modernBuilding );
        }
      }
    },
    addMan () { // 显示人物
      if (!this.scene.getObjectByName ( "跳舞人" )) {
        this.scene.add( this.personPre );
      }
      // console.log(this.scene)
    },
    addMeth (item, index) {
      let geometry = new THREE.BoxGeometry(this.cabinetType[item.type].size[0], this.cabinetType[item.type].size[2], this.cabinetType[item.type].size[1]); //创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: "#9fc1dd",
        transparent:true,//开启透明度
        opacity:0.6,//设置透明度具体值
      }); //材质对象Material
      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      mesh.position.set(-item.position[1] + 11200, -2700, item.position[0] + 2300)
      // mesh.position.z = item.position[1]
      mesh.name ="机柜" + index
      return mesh
    },
    setCabinet () {
      const self = this
      // if (!this.listGroup) {
        this.listGroup = new THREE.Group();
        this.listGroup.name = "设备集合"
        // this.listGroup.material.transparent = true
        // this.listGroup.material.opacity = 0
        this.cabinetplaced.forEach((item, index) => {
          let mesh = self.addMeth(item, index)
          self.listGroup.add(mesh)
        })
        this.scene.add(this.listGroup)
        console.log(this.listGroup)
      // }
    }
  },
  watch: {
    floorIndex (val) {
      console.log(val)
      if(val<0) return
      const self = this
      this.removeMan()
      this.removeObjAll()
      this.addBuilding()
      this.animationTime = Date.now()
      this.lookAround = true
      switch (val) {
        case 0:
          self.scene.add(self.FloorOne)
          break;
        case 1:
          self.scene.add(self.FloorTwo)
          break;
        case 2:
          self.scene.add(self.FloorThree)
          break;
        case 3:
          self.scene.add(self.FloorFour)
          self.setCabinet()
          break;

        default:
          break;
      }
      // console.log(this.scene)
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
