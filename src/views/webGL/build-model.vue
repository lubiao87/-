<template>
  <div
    style="width: 100%;height:100%;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <!-- 右边收缩栏开始 -->
    <div style="width: 100%;height:100%;" id="buildModel"></div>
    <div
      class="ui-shrinkBar"
      v-bind:class="{ 'ui-shrinkBar-right': panelShow }"
    >
      <div
        @click="panelShow = !panelShow"
        class="ui-shrinkBar-close"
        v-bind:class="{
          'ui-shrinkBar-open': panelShow,
          'ui-shrinkBar-close': !panelShow
        }"
      ></div>
      <div class="ui-citytol">
        <h5 class="ui-city-title">
          <span class="icon-location"></span> 当前区域
        </h5>
        <!-- <div class="scroll-wrap fn-mt10 regionName" @click="addMan">
            增加人物
          </div>
          <div class="scroll-wrap fn-mt10 regionName" @click="removeMan">
            删除人物
          </div> -->
      </div>
      <div style="margin-top: 30px;">
        <h5 class="ui-city-title ui-height48" @click="showBuilding()">
          <span class="ui-linebg"></span>商务大厦楼
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <div class="lb-module-list">
            <ul>
              <li
                v-for="(item, index) in dataList"
                :key="index"
                @click="lookFloor(index)"
              >
                <span>天河别墅:</span>
                <span>{{ item.name }}</span>
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
// require("../../utils/CSS3DRenderer");
export default {
  name: "olmap",
  props: ["coordinate"],
  mixins: [listSearchMixin],
  data() {
    return {
      scene: null, // 场景
      FBXloader: null, // fbx加载器
      ambient: null, // 环境光
      camera: null, // 相机视角
      renderer: null, // 创建渲染器对象
      controls: null, // 创建控件对象
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
      loading: true,
      panelShow: true,
      lookAround: false,
      floorIndex: -1,
      cameraX: 40000,
      cameraY: 10000,
      cameraZ: -1000,
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
        }
      ],
      animationTime: 0,
      animationFlag: true,
      cabinetType: [
        {
          name: "空位",
          size: [600, 800, 600],
          type: 0
        },
        {
          name: "机柜类型a", // 机柜类型
          size: [600, 300, 2500], // 长宽高
          type: 1 // 类型1
        },
        {
          name: "机柜类型b",
          size: [800, 600, 2500],
          type: 2
        },
        {
          name: "机柜类型c",
          size: [800, 600, 2000],
          type: 3
        },
        {
          name: "机柜类型d",
          size: [400, 600, 2000],
          type: 4
        },
        {
          name: "机柜类型e",
          size: [400, 350, 2000],
          type: 5
        },
        {
          name: "机柜类型f",
          size: [400, 850, 2000],
          type: 6
        },
        {
          name: "机柜类型g",
          size: [800, 300, 2500],
          type: 7
        },
        {
          name: "机柜类型h",
          size: [800, 600, 2200],
          type: 8
        },
        {
          name: "机柜类型i",
          size: [350, 250, 2200],
          type: 9
        },
        {
          name: "机柜类型j",
          size: [250, 250, 2200],
          type: 10
        },
        {
          name: "机柜类型k",
          size: [300, 550, 2500],
          type: 11
        },
        {
          name: "机柜类型l",
          size: [300, 300, 2500],
          type: 12
        },
        {
          name: "机柜类型m",
          size: [300, 850, 2500],
          type: 13
        },
        {
          name: "机柜类型n",
          size: [725, 600, 2500],
          type: 14
        },
        {
          name: "机柜类型o",
          size: [730, 300, 2500],
          type: 15
        },
        {
          name: "机柜类型p",
          size: [400, 350, 2500],
          type: 16
        },
        {
          name: "机柜类型q",
          size: [400, 850, 2500],
          type: 17
        },
        {
          name: "机柜类型r",
          size: [400, 600, 2500],
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
        { type: 1, position: [-150, 100] },
        { type: 2, position: [300, 0] },
        { type: 2, position: [900, 0] },
        { type: 2, position: [1500, 0] },
        { type: 3, position: [2100, 0] },
        { type: 2, position: [2700, 0] },
        { type: 2, position: [3300, 0] },
        { type: 2, position: [3900, 0] },

        { type: 2, position: [8600, 0] },
        { type: 2, position: [9200, 0] },
        { type: 2, position: [9800, 0] },
        { type: 2, position: [10400, 0] },
        { type: 2, position: [11000, 0] },
        { type: 2, position: [11600, 0] },
        { type: 1, position: [12050, 0] },
        // 第二排
        { type: 1, position: [-150, 1670] },
        { type: 2, position: [300, 1670] },
        { type: 2, position: [900, 1670] },
        { type: 2, position: [1500, 1670] },

        { type: 4, position: [2400, 1870] },
        { type: 4, position: [3000, 1870] },
        { type: 4, position: [3600, 1870] },
        { type: 4, position: [2400, 1470] },
        { type: 4, position: [3000, 1470] },
        { type: 4, position: [3600, 1470] },
        { type: 2, position: [4200, 1670] },
        { type: 4, position: [4800, 1470] },

        { type: 5, position: [6200, 1470] },
        { type: 6, position: [6800, 1470] },
        { type: 6, position: [7650, 1470] },
        { type: 6, position: [8500, 1470] },
        { type: 4, position: [9170, 1470] },
        { type: 4, position: [9770, 1470] },
        { type: 4, position: [10370, 1470] },

        { type: 2, position: [11570, 1670] },
        { type: 7, position: [12000, 1670] },

        { type: 4, position: [10970, 1870] },
        { type: 4, position: [10370, 1870] },
        { type: 4, position: [9770, 1870] },
        { type: 4, position: [9170, 1870] },
        { type: 4, position: [8570, 1870] },
        { type: 4, position: [7970, 1870] },
        { type: 4, position: [7370, 1870] },
        { type: 4, position: [6770, 1870] },
        { type: 4, position: [6170, 1870] },

        // 第三排
        { type: 7, position: [-170, 3340] },
        { type: 3, position: [300, 3340] },
        { type: 2, position: [900, 3340] },
        { type: 2, position: [1500, 3340] },
        { type: 3, position: [2100, 3340] },
        { type: 3, position: [2700, 3340] },
        { type: 3, position: [3300, 3340] },
        { type: 3, position: [3900, 3340] },
        { type: 3, position: [4500, 3340] },
        { type: 3, position: [5100, 3340] },
        { type: 3, position: [5700, 3340] },
        { type: 3, position: [6300, 3340] },

        { type: 2, position: [7500, 3340] },
        { type: 2, position: [8100, 3340] },
        { type: 2, position: [8700, 3340] },
        { type: 2, position: [9300, 3340] },
        { type: 2, position: [9900, 3340] },
        { type: 2, position: [10500, 3340] },
        { type: 2, position: [11100, 3340] },
        { type: 2, position: [11700, 3340] },
        { type: 7, position: [12150, 3340] },

        // 第四排
        { type: 1, position: [0, 4910] },
        { type: 3, position: [450, 5010] },
        { type: 3, position: [1050, 5010] },
        { type: 3, position: [1650, 5010] },
        { type: 2, position: [2250, 5010] },
        { type: 8, position: [2850, 5010] },
        { type: 3, position: [3450, 5010] },
        { type: 3, position: [4050, 5010] },
        { type: 3, position: [4650, 5010] },
        { type: 3, position: [5250, 5010] },
        { type: 3, position: [5850, 5010] },
        { type: 3, position: [6450, 5010] },
        { type: 3, position: [7050, 5010] },

        { type: 2, position: [8050, 5010] },
        { type: 2, position: [8650, 5010] },
        { type: 2, position: [9250, 5010] },
        { type: 2, position: [9850, 5010] },
        { type: 2, position: [10450, 5010] },
        { type: 2, position: [11050, 5010] },
        { type: 2, position: [11650, 5010] },
        { type: 1, position: [12070, 5010] },

        // 第五排
        { type: 7, position: [-300, 6680] },
        { type: 3, position: [150, 6680] },
        { type: 3, position: [750, 6680] },
        { type: 2, position: [1350, 6680] },
        { type: 3, position: [1950, 6680] },
        { type: 2, position: [2550, 6680] },
        { type: 2, position: [3150, 6680] },

        { type: 5, position: [3900, 6480] },
        { type: 4, position: [3900, 6880] },
        { type: 6, position: [4500, 6480] },
        { type: 6, position: [4625, 6880] },
        { type: 4, position: [5250, 6480] },
        { type: 4, position: [5850, 6480] },
        { type: 4, position: [6450, 6480] },
        { type: 4, position: [6450, 6880] },
        { type: 4, position: [7050, 6480] },
        { type: 4, position: [7050, 6880] },
        { type: 2, position: [7650, 6680] },
        { type: 2, position: [8250, 6680] },
        { type: 2, position: [8850, 6680] },
        { type: 4, position: [9450, 6480] },
        { type: 4, position: [9450, 6880] },
        { type: 2, position: [10050, 6680] },
        { type: 4, position: [10650, 6480] },
        { type: 4, position: [10650, 6880] },
        { type: 2, position: [11250, 6680] },
        { type: 1, position: [11700, 6770] },

        // 第六排
        { type: 16, position: [-100, 8550] },
        { type: 17, position: [500, 8550] },
        { type: 17, position: [1350, 8550] },
        { type: 18, position: [2075, 8550] },
        { type: 17, position: [2800, 8550] },
        { type: 17, position: [3650, 8550] },
        { type: 17, position: [4500, 8550] },
        { type: 17, position: [5350, 8550] },
        { type: 17, position: [6200, 8550] },
        { type: 18, position: [6925, 8550] },
        { type: 18, position: [7525, 8550] },
        { type: 17, position: [8250, 8550] },
        { type: 17, position: [9100, 8550] },
        { type: 17, position: [9950, 8550] },
        { type: 17, position: [10800, 8550] },
        { type: 18, position: [11525, 8550] },
        { type: 16, position: [12000, 8550] },

        { type: 18, position: [-300, 8950] },
        { type: 18, position: [300, 8950] },
        { type: 18, position: [900, 8950] },
        { type: 17, position: [1625, 8950] },
        { type: 18, position: [2350, 8950] },
        { type: 18, position: [2950, 8950] },
        { type: 18, position: [3550, 8950] },
        { type: 17, position: [4300, 8950] },
        { type: 17, position: [5150, 8950] },
        { type: 17, position: [6000, 8950] },
        { type: 17, position: [6850, 8950] },
        { type: 18, position: [7575, 8950] },
        { type: 17, position: [8300, 8950] },
        { type: 17, position: [9150, 8950] },
        { type: 17, position: [10000, 8950] },
        { type: 17, position: [10850, 8950] },
        { type: 18, position: [11575, 8950] },
        { type: 18, position: [12175, 8950] },

        // 第七排
        { type: 7, position: [100, 10620] },
        { type: 3, position: [550, 10620] },
        { type: 3, position: [1150, 10620] },
        { type: 3, position: [1750, 10620] },
        { type: 3, position: [2350, 10620] },

        { type: 8, position: [3450, 10620] },
        { type: 3, position: [4050, 10620] },
        { type: 18, position: [4650, 10420] },
        { type: 18, position: [4650, 10820] },
        { type: 3, position: [5250, 10620] },
        { type: 3, position: [5850, 10620] },
        { type: 3, position: [6450, 10620] },
        { type: 3, position: [7050, 10620] },
        { type: 3, position: [7650, 10620] },
        { type: 3, position: [8250, 10620] },
        { type: 3, position: [8850, 10620] },
        { type: 3, position: [9450, 10620] },
        { type: 3, position: [10050, 10620] },
        { type: 3, position: [10650, 10620] },
        { type: 18, position: [11250, 10420] },
        { type: 18, position: [11850, 10420] },
        { type: 18, position: [11850, 10820] },
        { type: 7, position: [12300, 10620] },

        // 第七排
        { type: 9, position: [-250, 12090] },
        { type: 9, position: [0, 12090] },
        { type: 9, position: [250, 12090] },
        { type: 9, position: [500, 12090] },
        { type: 9, position: [750, 12090] },
        { type: 9, position: [1000, 12090] },
        { type: 9, position: [1250, 12090] },
        { type: 9, position: [1500, 12090] },
        { type: 9, position: [1750, 12090] },
        { type: 9, position: [2000, 12090] },
        { type: 9, position: [2250, 12090] },
        { type: 9, position: [2500, 12090] },
        { type: 9, position: [2750, 12090] },
        { type: 9, position: [3000, 12090] },
        { type: 9, position: [3250, 12090] },
        { type: 9, position: [3500, 12090] },
        { type: 9, position: [3750, 12090] },
        { type: 9, position: [4000, 12090] },
        { type: 9, position: [4250, 12090] },
        { type: 9, position: [4500, 12090] },
        { type: 9, position: [4750, 12090] },
        { type: 9, position: [5000, 12090] },
        { type: 10, position: [5250, 12140] },
        { type: 10, position: [5500, 12140] },
        { type: 10, position: [5750, 12140] },
        { type: 9, position: [6000, 12090] },
        { type: 9, position: [6250, 12090] },
        { type: 9, position: [6500, 12090] },
        { type: 9, position: [6750, 12090] },
        { type: 9, position: [7000, 12090] },
        { type: 9, position: [7250, 12090] },
        { type: 9, position: [7500, 12090] },
        { type: 9, position: [7750, 12090] },
        { type: 10, position: [8000, 12140] },
        { type: 10, position: [8250, 12140] },
        { type: 10, position: [8500, 12140] },
        { type: 10, position: [8750, 12140] },
        { type: 10, position: [9000, 12140] },
        { type: 10, position: [9250, 12140] },
        { type: 10, position: [9500, 12140] },
        { type: 10, position: [9750, 12140] },
        { type: 10, position: [10000, 12140] },
        { type: 10, position: [10250, 12140] },
        { type: 10, position: [10500, 12140] },
        { type: 10, position: [10750, 12140] },
        { type: 10, position: [11000, 12140] },
        { type: 10, position: [11250, 12140] },
        { type: 10, position: [11500, 12140] },
        { type: 10, position: [11750, 12140] },
        { type: 10, position: [12000, 12140] },
        { type: 10, position: [12250, 12140] },

        { type: 9, position: [-250, 12440] },
        { type: 9, position: [0, 12440] },
        { type: 9, position: [250, 12440] },
        { type: 9, position: [500, 12440] },
        { type: 9, position: [750, 12440] },
        { type: 9, position: [1000, 12440] },
        { type: 9, position: [1250, 12440] },
        { type: 9, position: [1500, 12440] },
        { type: 9, position: [1750, 12440] },
        { type: 9, position: [2000, 12440] },
        { type: 9, position: [2250, 12440] },
        { type: 9, position: [2500, 12440] },
        { type: 9, position: [2750, 12440] },
        { type: 9, position: [3000, 12440] },
        { type: 9, position: [3250, 12440] },
        { type: 9, position: [3500, 12440] },
        { type: 9, position: [3750, 12440] },
        { type: 9, position: [4000, 12440] },
        { type: 9, position: [4250, 12440] },
        { type: 9, position: [4500, 12440] },
        { type: 9, position: [4750, 12440] },
        { type: 9, position: [5000, 12440] },
        { type: 9, position: [5250, 12440] },
        { type: 9, position: [5500, 12440] },
        { type: 9, position: [5750, 12440] },
        { type: 9, position: [6000, 12440] },
        { type: 9, position: [6250, 12440] },
        { type: 9, position: [6500, 12440] },
        { type: 9, position: [6750, 12440] },
        { type: 9, position: [7000, 12440] },
        { type: 9, position: [7250, 12440] },
        { type: 9, position: [7500, 12440] },
        { type: 9, position: [7750, 12440] },
        { type: 9, position: [8000, 12440] },
        { type: 10, position: [8250, 12400] },
        { type: 10, position: [8500, 12400] },
        { type: 10, position: [8750, 12400] },
        { type: 10, position: [9000, 12400] },
        { type: 10, position: [9250, 12400] },
        { type: 10, position: [9500, 12400] },
        { type: 10, position: [9750, 12400] },
        { type: 10, position: [10000, 12400] },
        { type: 10, position: [10250, 12400] },
        { type: 10, position: [10500, 12400] },
        { type: 10, position: [10750, 12400] },
        { type: 10, position: [11000, 12400] },
        { type: 10, position: [11250, 12400] },
        { type: 10, position: [11500, 12400] },
        { type: 10, position: [11750, 12400] },
        { type: 10, position: [12000, 12400] },
        { type: 10, position: [12250, 12400] },

        // 最后一排
        { type: 11, position: [0, 13900] },
        { type: 12, position: [425, 13900] },
        { type: 12, position: [725, 13900] },
        { type: 13, position: [1300, 13900] },
        { type: 13, position: [2150, 13900] },
        { type: 14, position: [2875, 14110] },
        { type: 13, position: [3600, 14000] },

        { type: 12, position: [8335, 14000] },
        { type: 13, position: [8910, 14000] },

        { type: 12, position: [-125, 14310] },
        { type: 13, position: [250, 14310] },
        { type: 13, position: [1300, 14310] },
        { type: 13, position: [2150, 14310] },
        { type: 13, position: [3600, 14310] },
        { type: 13, position: [4450, 14310] },

        { type: 13, position: [8060, 14310] },
        { type: 13, position: [8910, 14310] },

        { type: 14, position: [11210, 14110] },
        { type: 14, position: [11810, 14110] },
        { type: 15, position: [12262, 14110] }
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
    createHtml() {
      const self = this;
      // console.log(GKG);
      this.scene = null;
      this.scene = new THREE.Scene(); // 场景
      this.FBXloader = new THREE.FBXLoader(); // fbx加载器
      this.FBXloader.load("./assets/fbx/building.FBX", self.loaderObj);
      this.FBXloader.load("./assets/fbx/SambaDancing.FBX", self.loaderMan);
      this.FBXloader.load("./assets/fbx/floorOne.FBX", self.loaderFloor1);
      this.FBXloader.load("./assets/fbx/floorTwo.FBX", self.loaderFloor2);
      this.FBXloader.load("./assets/fbx/floorThree.FBX", self.loaderFloor3);
      this.FBXloader.load("./assets/fbx/floorFour.FBX", self.loaderFloor4);
      this.FBXloader.load("./assets/fbx/air.FBX", self.loaderAir);
      this.FBXloader.load("./assets/fbx/device1.FBX", self.loaderDevice1);
      this.FBXloader.load("./assets/fbx/device2.FBX", self.loaderDevice2);
      this.FBXloader.load("./assets/fbx/device3.FBX", self.loaderDevice3);
      this.FBXloader.load("./assets/fbx/device4.FBX", self.loaderDevice4);
      this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
      this.renderer = new THREE.WebGLRenderer(); // 渲染器
      this.scene.add(this.ambient);
      this.clock = new THREE.Clock();
      this.setCamera();
      // 创建CSS3渲染器
      // this.CSS3Renderer = new THREE.CSS3DRenderer();
      // this.CSS3Renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染区域尺寸
      // // document.body.appendChild(this.CSS3Renderer.domElement); //body元素中插入canvas对象
      // document
      //   .getElementById("buildModel")
      //   .appendChild(this.CSS3Renderer.domElement); // body元素中插入canvas对象

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.type = "orbit";
      this.controls.staticMoving = false;
      //     // 方向光
      // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      // // 设置光源位置
      // directionalLight.position.set(20000, 10000, 0);
      // this.scene.add(directionalLight);

      //灯光属性
      this.SpotLight = new THREE.SpotLight(0xffffff, 0.6);
      this.SpotLight.castShadow = true;
      this.SpotLight.shadowCameraVisible = true;
      this.SpotLight.position.set(20000, 20000, 0);
      //设置阴影贴图精度
      this.SpotLight.shadowMapWidth = this.SpotLight.shadowMapHeight = 1024;
      this.scene.add(this.SpotLight);

      // //创建一个平面几何体作为投影面
      // let planeGeometry = new THREE.PlaneGeometry(80000, 100000);
      // let planeMaterial = new THREE.MeshLambertMaterial({
      //   color: 0x999999
      // }); //材质对象Material
      // // 平面网格模型作为投影面
      // let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); //网格模型对象Mesh
      // this.scene.add(planeMesh); //网格模型添加到场景中
      // // 设置接收阴影的投影面
      // planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
      // planeMesh.position.y = -17800; //设置网格模型y坐标
      // planeMesh.receiveShadow = true;

      this.axisHelper = new THREE.AxisHelper(8000); // 辅助线
      this.scene.add(this.axisHelper);

      // this.pushLineBox()  // 虚线框
      window.onresize = this.onWindowResize;
      window.requestAnimationFrame(this.render);
      this.render();
      this.raycaster = new THREE.Raycaster();
    },
    loaderMan(obj) {
      // console.log(obj)
      obj.name = "跳舞人";
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
      this.AnimationAction.play(); //播放动画
      if (!obj.traverse) return;
      obj.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // this.scene.add(obj)
      // console.log(obj)
    },
    loaderObj(obj) {
      // console.log(obj);
      this.loading = false;
      obj.translateY(-17000);
      obj.name = "整栋楼房";
      this.scene.add(obj);
      this.modernBuilding = this.scene.getObjectByName("整栋楼房");
      this.moderBuild = this.scene.getObjectByName("大楼");
      obj.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    },
    loaderFloor1(obj) {
      this.FloorOne = obj;
      obj.name = "我家一楼";
      obj.translateY(-16000);
    },
    loaderFloor2(obj) {
      this.FloorTwo = obj;
      obj.name = "我家二楼";
      obj.translateY(-12000);
    },
    loaderFloor3(obj) {
      this.FloorThree = obj;
      obj.name = "我家三楼";
      obj.translateY(-8000);
    },
    loaderFloor4(obj) {
      this.FloorFour = obj;
      obj.name = "我家四楼";
      obj.translateY(-4000);
    },
    loaderAir(obj) {
      this.Air = obj;
      // console.log(obj)
      this.Air.name = "空调柜";
    },
    loaderDevice1(obj) {
      this.device1 = obj;
      this.device1.name = "配电柜呢1";
      this.device1.translateY(-3900);
    },
    loaderDevice2(obj) {
      this.device2 = obj;
      this.device2.name = "配电柜呢2";
      this.device2.translateY(-3900);
    },
    loaderDevice3(obj) {
      this.device3 = obj;
      this.device3.name = "配电柜呢3";
      this.device3.translateY(-3900);
    },
    loaderDevice4(obj) {
      this.device4 = obj;
      this.device4.name = "配电柜呢4";
      this.device4.translateY(-3900);
    },
    setCamera() {
      let width = document.body.clientWidth; // 窗口宽度
      let height = document.body.clientHeight; // 窗口高度
      // var k = width / height; //窗口宽高比
      // var s = 20000; //三维场景显示范围控制系数，系数越大，显示的范围越大
      // this.camera = new THREE.OrthographicCamera(
      //   -s * k,
      //   s * k,
      //   s,
      //   -s,
      //   1,
      //   1000000
      // );
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
      this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
      this.camera.lookAt(this.scene.position);
      this.renderer.setSize(width, height); // 设置渲染区域尺寸
      this.renderer.setClearColor("#16244a", 1); // 设置背景颜色
      // document.getElementById('pos').removeChild(this.renderer.domElement)
      document
        .getElementById("buildModel")
        .appendChild(this.renderer.domElement); // body元素中插入canvas对象
      this.renderer.shadowMap.enabled = true;
      // this.renderer.domElement.style.position = "absolute";
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    render() {
      // if (this.scene) {

      window.requestAnimationFrame(this.render);
      //更新控制器
      this.controls.update();
      //渲染场景和相机
      this.renderer.render(this.scene, this.camera);
      // this.CSS3Renderer.render(this.scene, this.camera); //执行渲染操作
      if (this.mixer !== null) {
        // console.log(this.clock.getDelta())
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        this.mixer.update(this.clock.getDelta());
      }
      this.lookAroundFn(); // 楼房渐变
      if (typeof this.selectBorder !== "undefined") {
        this.lookCabinetfn();
      }
    },
    lookAroundFn() {
      // 楼房渐变
      const self = this;
      if (this.lookAround) {
        if (this.animationFlag) {
          // 进入查看楼层
          if (this.cameraX > 0) {
            this.cameraX -= 500;
          }
          if (this.cameraZ > -10000) {
            this.cameraZ -= 500;
          }
          if (this.cameraY < 20000) {
            this.cameraY += 500;
          }
          let number = 1 - (Date.now() - self.animationTime) / 4000;
          // console.log(this.cameraX)
          this.moderBuild.material.forEach((item, index) => {
            if (number < 0) {
              self.lookAround = false;
              self.scene.remove(this.modernBuilding);
              self.moderBuild.material[index].opacity = 0;
            } else {
              self.moderBuild.material[index].transparent = true;
              self.moderBuild.material[index].opacity = number;
            }
          });
        } else {
          // 返回查看房子
          if (this.cameraX < 40000) {
            this.cameraX += 500;
          }
          if (this.cameraZ < 0) {
            this.cameraZ += 500;
          }
          if (this.cameraY > 10000) {
            this.cameraY -= 500;
          }
          console.log(this.cameraX);
          let number = (Date.now() - self.animationTime) / 2000;
          // console.log(this.cameraX)
          this.moderBuild.material.forEach((item, index) => {
            if (number > 1) {
              self.lookAround = false;
              // self.scene.remove(this.modernBuilding)
              self.moderBuild.material[index].opacity = 1;
            } else {
              self.moderBuild.material[index].transparent = true;
              self.moderBuild.material[index].opacity = number;
            }
          });
        }

        this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
      }
    },
    lookFloor(index) {
      // 查看楼层
      if (!this.lookAround) {
        this.floorIndex = index;
        this.animationFlag = true;
        // this.setCabinet()
      }
    },
    removeObjAll() {
      const self = this;
      this.removeMan();
      const list = this.scene.getObjectByName("设备集合");
      if (list) {
        self.scene.remove(list);
      }
      // this.scene.traverse( function ( child ) {
      //       if ( child.isGroup && child.name ) {
      //         self.scene.remove(child)
      //       }
      //   });
      self.scene.remove(this.modernBuilding);
      self.scene.remove(this.FloorTwo);
      self.scene.remove(this.FloorOne);
      self.scene.remove(this.FloorThree);
      self.scene.remove(this.FloorFour);
    },
    removeMan() {
      // 删除人物
      if (this.scene.getObjectByName("跳舞人")) {
        this.scene.remove(this.personPre);
      }
    },
    showBuilding() {
      if (!this.lookAround) {
        // 动画中禁止事件
        this.addBuilding();
        this.floorIndex = -1;
        this.animationFlag = false;
        this.animationTime = Date.now();
        this.lookAround = true; // 开启动画
        // console.log(this.scene)
      }
    },
    addBuilding() {
      // 显示房子
      if (!this.lookAround) {
        // 动画中禁止增加
        this.removeObjAll();
        if (!this.scene.getObjectByName("整栋楼房")) {
          this.scene.add(this.modernBuilding);
        }
      }
    },
    addMan() {
      // 显示人物
      if (!this.scene.getObjectByName("跳舞人")) {
        this.scene.add(this.personPre);
      }
      // console.log(this.scene)
    },
    addMeth(item, index) {
      let geometry = new THREE.BoxGeometry(
        this.cabinetType[item.type].size[0],
        this.cabinetType[item.type].size[2],
        this.cabinetType[item.type].size[1]
      ); //创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: "#9fc1dd",
        transparent: true, //开启透明度
        opacity: 0.8 //设置透明度具体值
      }); //材质对象Material
      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      // let positionY = -2700
      // if (this.cabinetType[item.type].size[2] < 2500) {
      let positionY = -2700 + (this.cabinetType[item.type].size[2] - 2500) / 2;
      // }
      mesh.position.set(
        -item.position[1] + 11200,
        positionY,
        item.position[0] + 2300
      );
      // mesh.position.z = item.position[1]
      mesh.name = this.cabinetType[item.type].name + index;
      return mesh;
    },
    setCabinet() {
      const self = this;
      // if (!this.listGroup) {
      this.listGroup = new THREE.Group();
      this.listGroup.name = "设备集合";
      // this.listGroup.material.transparent = true
      // this.listGroup.material.opacity = 0
      this.cabinetplaced.forEach((item, index) => {
        let mesh = self.addMeth(item, index);
        self.listGroup.add(mesh);
      });
      for (let index = 0; index < 4; index++) {
        let air = self.Air.clone();
        air.name = "空调柜呢" + index;
        switch (index) {
          case 0:
            // air.translateZ(-17200); //沿着z轴平移
            air.translateX(-600); //沿着x轴平移
            air.translateY(-3900); //沿着y轴平移
            break;
          case 1:
            // air.translateZ(-17200); //沿着z轴平移
            air.translateX(2500); //沿着x轴平移
            air.translateY(-3900); //沿着y轴平移
            break;
          case 2:
            // air.translateZ(-17200); //沿着z轴平移
            air.translateX(5500); //沿着x轴平移
            air.translateY(-3900); //沿着y轴平移
            break;
          case 3:
            air.translateZ(17000); //沿着z轴平移
            air.translateX(9000); //沿着x轴平移
            air.translateY(-3900); //沿着y轴平移
            air.rotateY(Math.PI); //每次绕y轴旋转180弧度
            break;

          default:
            break;
        }
        self.listGroup.add(air);
      }
      self.listGroup.add(self.device1);
      self.listGroup.add(self.device2);
      let device22 = self.device2.clone();
      device22.translateX(1700);
      let device222 = self.device2.clone();
      device222.translateX(2550);
      self.listGroup.add(device22);
      self.listGroup.add(device222);
      self.listGroup.add(self.device3);
      self.listGroup.add(self.device4);
      let geometry = new THREE.BoxGeometry(700, 4000, 740); //创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: "#ccc"
      }); //材质对象Material
      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      mesh.name = "擎天柱";
      mesh.translateX(10000);
      mesh.translateZ(7800);
      mesh.translateY(-2000);
      this.listGroup.add(mesh); //网格模型添加到场景中
      this.scene.add(this.listGroup);

      // setTimeout(() => {

      //创建一个屏幕和场景转换工具
      // self.projector = new THREE.Projector();
      self.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      //加入鼠标拖动对象的一系列监听事件
      self.renderer.domElement.removeEventListener("mousemove", null);
      self.renderer.domElement.removeEventListener("mousedown", null);
      self.renderer.domElement.addEventListener(
        "mousemove",
        self.onDocumentMouseMove,
        false
      );
      self.renderer.domElement.addEventListener(
        "mousedown",
        self.onDocumentClick,
        false
      );
      // }, 2000);

      // console.log(this.listGroup)
      // }
    },
    onDocumentMouseMove(event) {
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      event.preventDefault();
      const self = this;
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        self.listGroup.children
      );
      // console.log(intersects)
      if (intersects.length > 0) {
        if (this.border) {
          self.scene.remove(this.border);
        }
        if (
          intersects[0].object.name === "擎天柱" ||
          intersects[0].object.name === "选中柜"
        ) {
          // console.log(23);
        } else {
          const geometry = intersects[0].object.geometry;
          const material = intersects[0].object.material;
          const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
          this.scene.updateMatrixWorld(true);
          const worldPosition = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPosition);
          // console.log('世界坐标',worldPosition);
          mesh.position.set(worldPosition.x, worldPosition.y, worldPosition.z); //点光源位置
          this.border = new THREE.BoxHelper(mesh, "#e54949"); //设置边框，这个边框不会旋转
          this.border.name = "高亮显示柜";
          this.scene.add(this.border); //网格模型添加到场景中
          // 创建精灵图标
          this.newCSS3DSprite(
            intersects,
            worldPosition.x,
            worldPosition.y + 2000,
            worldPosition.z
          );
          // console.log(this.scene);
        }
      } else {
        // if (this.objCSS3D) {
        //   this.scene.remove(this.objCSS3D);
        // }
        if (this.border) {
          self.scene.remove(this.border);
        }
        if (this.sprite) {
          this.scene.remove(this.sprite);
        }
      }
    },
    // 创建精灵图标
    newCSS3DSprite(obj, x, y, z) {
      let width = 3000,
        height = 1000;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      let arrText = obj[0].object.name;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);
      // this.drawRoundRect(ctx, 0, 0, width, height, 200);
      ctx.font = 400 + 'px " bold';
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(arrText, width / 2, height / 2);
      // ctx.strokeStyle = "#0078AA";
      ctx.stroke();
      this.spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas) //设置精灵纹理贴图
      });
      if (this.sprite) {
        this.scene.remove(this.sprite);
      }
      this.sprite = new THREE.Sprite(this.spriteMaterial);
      this.scene.add(this.sprite);
      this.sprite.scale.set(3000, 1000, 1); // 只需要设置x、y两个分量就可以
      this.sprite.position.set(x, y, z);
    },
    // 圆角矩形
    drawRoundRect(cxt, x, y, width, height, radius) {
      cxt.beginPath();
      cxt.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
      cxt.lineTo(width - radius + x, y);
      cxt.arc(
        width - radius + x,
        radius + y,
        radius,
        (Math.PI * 3) / 2,
        Math.PI * 2
      );
      cxt.lineTo(width + x, height + y - radius);
      cxt.arc(
        width - radius + x,
        height - radius + y,
        radius,
        0,
        (Math.PI * 1) / 2
      );
      cxt.lineTo(radius + x, height + y);
      cxt.arc(
        radius + x,
        height - radius + y,
        radius,
        (Math.PI * 1) / 2,
        Math.PI
      );
      ctx.closePath();
    },
    // 创建固定一个精灵图标2
    newCSS3DSprite2(obj, x, y, z) {
      let width = 3000,
        height = 1000;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      let arrText = obj[0].object.name;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);
      // this.drawRoundRect(ctx, 0, 0, width, height, 200);
      ctx.font = 400 + 'px " bold';
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(arrText, width / 2, height / 2);
      // ctx.strokeStyle = "#0078AA";
      ctx.stroke();
      this.spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas) //设置精灵纹理贴图
      });
      if (this.sprite2) {
        this.scene.remove(this.sprite2);
      }
      this.sprite2 = new THREE.Sprite(this.spriteMaterial);
      this.scene.add(this.sprite2);
      this.sprite2.scale.set(3000, 1000, 1); // 只需要设置x、y两个分量就可以
      this.sprite2.position.set(x, y, z);
    },
    onDocumentClick(event) {
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      event.preventDefault();
      const self = this;
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        self.listGroup.children
      );
      if (intersects.length > 0) {
        console.log(intersects);
        this.scene.updateMatrixWorld(true);
        const worldPosition = new THREE.Vector3();
        intersects[0].object.getWorldPosition(worldPosition);
        if (!intersects[0].object.flag) {
          // 如果未选中则选中
          if (this.meshborder) {
            self.scene.remove(this.meshborder);
          }
          intersects[0].object.flag = true;
          const geometry = intersects[0].object.geometry;
          const material = new THREE.MeshLambertMaterial({
            color: "#e54949"
          }); //材质对象Material
          this.meshborder = new THREE.Mesh(geometry, material); //网格模型对象Mesh
          this.meshborder.name = "选中柜";
          this.scene.updateMatrixWorld(true);
          const worldPosition = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPosition);
          // console.log('世界坐标',worldPosition);
          this.meshborder.position.set(
            worldPosition.x,
            worldPosition.y,
            worldPosition.z
          );
          this.scene.add(this.meshborder); //网格模型添加到场景中
          this.cameraPosition2 = this.camera.position;
          // this.camera.position.set(worldPosition.x - 3000, 10000, worldPosition.z)
          this.controls.target = new THREE.Vector3().addVectors(
            intersects[0].object.position,
            intersects[0].object.getWorldDirection()
          );
          this.camera.lookAt(intersects[0].object.position);

          // 创建精灵图标2
          this.newCSS3DSprite2(
            intersects,
            worldPosition.x,
            worldPosition.y + 2000,
            worldPosition.z
          );
        } else {
          intersects[0].object.flag = false;
          if (this.meshborder) {
            self.scene.remove(this.meshborder);
          }
          if (this.sprite2) {
            this.scene.remove(this.sprite2);
          }
          // this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ)
          this.controls.target = new THREE.Vector3(0, 0, 0);
          this.camera.lookAt(this.scene.position);
        }
        this.selectBorder = intersects[0].object.flag;
      }
    },
    lookCabinetfn() {
      let flagArr = [];
      if (this.selectBorder) {
        if (this.meshborder.position.x - 3000 - this.camera.position.x > 500) {
          this.cameraPosition2.x += 500;
        } else if (
          this.camera.position.x - (this.meshborder.position.x - 3000) <
          -500
        ) {
          this.cameraPosition2.x -= 500;
        } else {
          flagArr[0] = true;
        }
        if (this.camera.position.y - this.meshborder.position.y > 500) {
          this.cameraPosition2.y -= 500;
        } else if (this.camera.position.y - this.meshborder.position.y < -500) {
          this.cameraPosition2.y += 500;
        } else {
          flagArr[0] = true;
        }
        if (this.camera.position.z - this.meshborder.position.z > 500) {
          this.cameraPosition2.z -= 500;
        } else if (this.camera.position.z - this.meshborder.position.z < -500) {
          this.cameraPosition2.z += 500;
        } else {
          flagArr[0] = true;
        }
        this.camera.position.set(
          this.cameraPosition2.x,
          10000,
          this.cameraPosition2.z
        );
      } else {
        if (this.camera.position.x - this.cameraX > 500) {
          this.cameraPosition2.x -= 500;
        } else if (this.camera.position.x - this.cameraX < -500) {
          this.cameraPosition2.x += 500;
        } else {
          flagArr[0] = true;
        }
        if (this.camera.position.y - this.cameraY > 500) {
          this.cameraPosition2.y -= 500;
        } else if (this.camera.position.y - this.cameraY < -500) {
          this.cameraPosition2.y += 500;
        } else {
          flagArr[1] = true;
        }
        if (this.camera.position.z - this.cameraZ > 500) {
          this.cameraPosition2.z -= 500;
        } else if (this.camera.position.z - this.cameraZ < -500) {
          this.cameraPosition2.z += 500;
        } else {
          flagArr[2] = true;
        }

        this.camera.position.set(
          this.cameraPosition2.x,
          this.cameraPosition2.y,
          this.cameraPosition2.z
        );
      }
      if (flagArr[0] && flagArr[1] && flagArr[2]) {
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.selectBorder = undefined;
        console.log("undefined");
      }
    }
  },
  watch: {
    floorIndex(val) {
      // console.log(val)
      if (val < 0) return;
      const self = this;
      this.removeMan();
      this.removeObjAll();
      this.addBuilding();
      this.animationTime = Date.now();
      this.lookAround = true;
      switch (val) {
        case 0:
          self.scene.add(self.FloorOne);
          break;
        case 1:
          self.scene.add(self.FloorTwo);
          break;
        case 2:
          self.scene.add(self.FloorThree);
          break;
        case 3:
          self.scene.add(self.FloorFour);
          self.setCabinet();
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
