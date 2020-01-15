<template>
  <div
    style="width: 100%;height:100%;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div style="width: 100%;height:100%;" id="buildModel"></div>
    <!-- 列头柜鼠标悬停html  -->
    <div class="menu menu2" v-show="showMenu2" ref="menu2">
      <ul>
        <li v-for="(item, index) in dataMeth" :key="index">
          <span class="raius"></span>
          <span class="dowon"></span>
          {{ item }}
        </li>
      </ul>
      <div class="close-btn" @click="hineMenu2" v-show="freezeShowMenu2">X</div>
    </div>
    <!-- 机柜悬停html -->
    <div class="menu menu3" v-show="showMenu3" ref="menu3">
      <ul>
        <li><label for="">名称：</label> {{ methName || "-" }}</li>
        <li><label for="">位置：</label> {{ location || "-" }}</li>
        <li v-show="showOccuRate">
          <label for="">已用/未用：</label> {{ occuRate || "-" }}
        </li>
      </ul>
    </div>
    <div class="lable-title">{{ floorName }}</div>
    <!-- 按钮组 -->
    <el-radio-group
      class="capacity-btn2"
      v-model="isCollapse"
      style="margin-bottom: 20px;"
      v-show="showCollapse"
    >
      <el-radio-button size="small" label="模块间视图"
        >模块间视图</el-radio-button
      >
      <el-radio-button size="small" label="机柜容量图"
        >机柜容量图</el-radio-button
      >
      <!-- <el-radio-button size="small" label="2D平面图">2D平面图</el-radio-button> -->
    </el-radio-group>
    <div class="lb-back" @click="backShow"></div>
    <!-- 右边收缩栏开始 -->
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

      <!-- 微机楼统计 -->
      <div>
        <h5 class="ui-city-title ui-height48 none-hover">
          <span class="ui-linebg"></span>统计
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <div
            v-for="(item, index) in moduleStatistics"
            :key="index"
            class="modal module"
            :class="{ select: item.select }"
            @click="setSelectBox(index)"
          >
            <div calss="name" style="font-size: 12px;color: #fff;">
              {{ item.name }}
            </div>
            <div class="number">{{ item.value }}</div>
            <div :class="item.class"></div>
          </div>
        </div>

        <!-- 通用搜索框开始 -->
      </div>
      <div class="show1" v-show="!moduleStatistics[4]">
        <div id="powerCharts" class="powerCharts"></div>
      </div>
      <h5
        class="ui-city-title ui-height48"
        :class="{ 'none-hover': modelType != 2 }"
        @click="showBuilding"
      >
        <span class="ui-linebg"></span>{{ boxTitle }}
      </h5>
      <el-tree
        :data="floorTreeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        node-key="buildId"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
        v-if="modelType === 2"
      ></el-tree>
    </div>
    <div class="yhui-real-timeimg"></div>
    <!-- <el-button class="model-select1" type="primary">
      <i class="el-icon-folder-add"></i> 增加模型
    </el-button> -->
    <el-select
      v-model="selectValue"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="请选择机柜类型"
      class="model-select"
      size="large"
      v-show="showCollapse"
    >
      <el-option
        v-for="item in cabinetType"
        :key="item.type"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
    <popup :propsFlag="propsFlag" :dataInfo="dataInfo" />
  </div>
  <!-- 右边收缩栏结束 -->
</template>

<script>
import echarts from "echarts"; // 引入echarts
import { listSearchMixin } from "../../mixin"; //混淆请求
import * as THREE from "three";
// import "three-obj-mtl-loader";
import {
  _debounce,
  // _getTextCanvas,
  // _drawArrow,
  _NowRoom
} from "@/utils/public.js";
import "@/utils/threebsp.js";
import "three-fbxloader-offical";
// require("three-fbxloader-offical");
import { OrbitControls } from "../../utils/OrbitControls";
import popup from "../../components/popup/popup";
// import buildModel2d from "./build-model-2d";
import { api2 } from "../../api/api"; //api配置请求的路径
import { Message } from "element-ui";
export default {
  name: "olmap",
  // props: ["coordinate"],
  mixins: [listSearchMixin],
  components: {
    popup
    // buildModel2d
  },
  data() {
    return {
      methName: "", // 鼠标悬停字段1
      location: "", // 鼠标悬停字段2
      occuRate: "", // 鼠标悬停字段2
      showOccuRate: false,
      expandedKeys: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      moderShow: true,
      isCollapse: "模块间视图",
      freezeShowMenu2: false,
      showMenu3: false,
      boxTitle: "工业园机楼",
      showChartFlag: false,
      dataMeth: [
        "输出屏01",
        "整流器01",
        "低压系统开关01",
        "变压器1#",
        "变电站-天河F4"
      ],
      showMenu2: false,
      // showMenu: false,
      buildId: null,
      propsFlag: false,
      barData: [
        { value: 589, name: "未用" },
        { value: 286, name: "已用" },
        { value: 280, name: "预占" }
      ],
      myChart: null,
      moduleStatistics: [
        {
          name: "空间利用率",
          value: "30%",
          class: "right_planning",
          select: true
        },
        { name: "功率利用率", value: "56%", class: "right_module" },
        { name: "非专业机柜总数", value: "7个", class: "right_planning" },
        { name: "专业机柜总数", value: "8个", class: "right_cabinet" }
      ],
      selectValue: ["全部"],
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
      loading: true,
      panelShow: true,
      lookAround: false,
      cameraX: 0,
      cameraY: 30000,
      cameraZ: 20000,
      floorName: "工业园机楼",
      showCollapse: false,
      cabinetType: [
        {
          name: "全部",
          size: [0, 0, 0],
          type_index: 0
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          type_index: 1 // 类型1对应的索引，目的为了减少遍历
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.2], // 长宽高
          type_index: 2
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.0], // 长宽高
          type_index: 3
        },
        {
          name: "DDF机架 - 12个", // 机柜类型
          size: [0.3, 0.24, 2.6], // 长宽高
          type_index: 4
        },
        {
          name: "空调 - 12个", // 机柜类型
          size: [0.5, 0.5, 2.6], // 长宽高
          type_index: 5
        },
        {
          name: "列头柜 - 14个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          type_index: 6
        },
        {
          name: "ODF机架 - 32个", // 机柜类型
          size: [0.3, 0.84, 2.6], // 长宽高
          type_index: 7
        },
        {
          name: "配线机架 - 12个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          type_index: 8
        }
      ],
      cabinetPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      cabinetplaced: [],
      froomData: [
        // 四边形
        [0, 0],
        [0, 18000],
        [20000, 18000],
        [20000, 0]
      ],
      floorTreeData: [
        // {
        //   label: "一楼楼层", // 名称
        //   buildId: 111, // id
        //   floor: 1, // 楼层
        //   modelType: 3, // 类型： 1为接入间 2为机楼 3 楼层
        //   children: [
        //     {
        //       label: "1楼101机房",
        //       modelType: 1,
        //       buildId: 111101
        //     }
        //   ]
        // }
      ],
      modelType: 1,
      dataInfo: null // 选择的机架信息
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  created() {
    // const self = this;
    console.log("this.$route.params---", this.$route.params);
    this.floorName = this.$route.params.modelName;
    this.modelType = this.$route.params.modelType;
    this.buildId = this.$route.params.modelId;
    this.boxTitle = this.$route.params.modelName;

    this.getFrameTypeList();
    this.getJieRuJianStatistics();
    if (this.modelType === 2) {
      this.cameraZ = -40000;
      this.cameraY = 40000;
    } else if (this.modelType === 1) {
      this.showCollapse = true;
      this.floorHeight = this.$route.params.height * 10;
    }
  },
  methods: {
    // 获取模型地址列表
    getFrameTypeList() {
      const self = this;
      // this.loading = true;
      let param = {
        url: api2.getFrameTypeList
      };
      self.cabinetType = [];
      self.sendReq(param, res => {
        // this.loading = false;
        // console.log("--------", res);
        if (res.respHeader.resultCode === 0) {
          if (!res.respBody.cabinetType) {
            Message({
              showClose: true,
              message: "缺少机房数据",
              type: "error",
              duration: 2000
            });
            return;
          }
          self.cabinetType.push(
            ...[
              {
                name: "全部",
                size: [0, 0, 0],
                type_index: 0
              }
            ]
          );
          let arr1 = res.respBody.cabinetType;
          arr1.forEach((item, index) => {
            arr1[index].size = [
              item.size[0] * 10,
              item.size[1] * 10,
              item.size[2] * 10
            ];
          });
          self.cabinetType.push(...arr1);
          self.$nextTick(() => {
            self.myChart = echarts.init(document.getElementById("powerCharts"));
            self.newMap();
            self.createHtml();
            if (self.modelType === 1) {
              self.loaderAur();
            } else {
              self.getFloorTreeData();
              self.getBuildData();
            }
          });
        }
      });
    },
    // 获取区域其它数据
    getJieRuJianStatistics() {
      const self = this;
      let param = {
        url:
          api2.getJieRuJianStatistics +
          `?id=${this.buildId}&queryType=${this.modelType}` //获取request_url.js文件的请求路径
      };
      self.sendReq(param, res => {
        if (res.respHeader.resultCode === 0) {
          if (!res.respBody.moduleStatistics) {
            Message({
              showClose: true,
              message: "缺少机房数据",
              type: "error",
              duration: 2000
            });
            return;
          }
          self.moduleStatistics = res.respBody.moduleStatistics;
        }
      });
    },
    // 获取机房设备分布
    getRoomByIdData() {
      const self = this;
      let formData = new FormData();
      formData.append("roomId", this.buildId);
      let param = {
        url: api2.getRoomByIdData, //获取request_url.js文件的请求路径
        data: formData
      };
      // this.loading = true;
      self.sendReq(param, res => {
        // this.loading = false;
        // console.log("--------", res);
        // self.cabinetplaced = cabinetplaced;
        // self.cabinetType = [];
        self.cabinetplaced = [];
        if (res.respHeader.resultCode === 0) {
          if (!res.respBody.froomData || !res.respBody.cabinetplaced) {
            Message({
              showClose: true,
              message: "缺少机房数据",
              type: "error",
              duration: 2000
            });
            return;
          }
          let arr2 = res.respBody.cabinetplaced.map(item => {
            let items = item;
            items.position = [item.posX * 10, item.posY * 10];
            items.size = [
              item.size[0] * 10,
              item.size[1] * 10,
              item.size[2] * 10
            ];
            return items;
          });
          self.cabinetplaced.push(...arr2);
          self.froomData = [];

          let arr3 = res.respBody.froomData.split(",");
          arr3.forEach(item => {
            let arr = [
              JSON.parse(item.split(" ")[0]) * 10,
              JSON.parse(item.split(" ")[1]) * 10
            ];
            self.froomData.push(arr);
          });
          this.floorHeight = res.respBody.roomheight * 10;
          this.setCabinet(); // 设置机房可视化
        } else {
          Message({
            showClose: true,
            message: res.respHeader.message,
            type: "error",
            duration: 2000
          });
        }
      });
    },
    // 获取机楼楼层列表
    getFloorTreeData() {
      const self = this;
      let param = {
        url: api2.getFloorTreeData + `?buildId=${this.buildId}` //获取request_url.js文件的请求路径
      };
      // this.loading = true;
      self.sendReq(param, res => {
        console.log("菜单数据", res);
        if (res.respHeader.resultCode === 0) {
          if (!res.respBody.floorTreeData) {
            Message({
              showClose: true,
              message: "缺少机房数据",
              type: "error",
              duration: 2000
            });
            return;
          }
          self.floorTreeData = res.respBody.floorTreeData;
        }
        // this.loading = false;
      });
    },
    handleNodeClick(data) {
      console.log("handleNodeClick", data);
      // 查看楼层
      this.buildId = data.buildId;
      this.floorName = "工业园机楼 - " + data.label;
      this.removeObjAll();

      if (data.modelType === 1) {
        this.isCollapse = "模块间视图";
        this.getRoomByIdData();
        this.showCollapse = true;
      } else if (data.modelType === 3) {
        this.scene.add(this.FloorFour);
        this.showCollapse = false;
      }
    },
    createHtml() {
      const self = this;
      // console.log(GKG);
      this.scene = null;
      this.scene = new THREE.Scene(); // 场景
      this.FBXloader = new THREE.FBXLoader(); // fbx加载器

      this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
      this.renderer = new THREE.WebGLRenderer({
        //增加下面两个属性，可以抗锯齿
        antialias: true,
        alpha: true
      }); // 渲染器
      this.scene.add(this.ambient);
      this.clock = new THREE.Clock();
      this.setCamera();

      this.controls = new OrbitControls(this.camera);
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.type = "orbit";
      this.controls.staticMoving = false;
      //     // 方向光
      // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      // // 设置光源位置
      // directionalLight.position.set(20000, 10000, 0);
      // this.scene.add(directionalLight);

      //灯光属性
      this.SpotLight = new THREE.SpotLight("#fff", 0.6);
      this.SpotLight.castShadow = true;
      this.SpotLight.shadowCameraVisible = true;
      this.SpotLight.position.set(20000, 40000, 0);
      //设置阴影贴图精度
      // this.SpotLight.shadowMapWidth = this.SpotLight.shadowMapHeight = 1024;
      this.scene.add(this.SpotLight);

      this.axisHelper = new THREE.AxisHelper(8000); // 辅助线
      this.scene.add(this.axisHelper);

      // this.pushLineBox()  // 虚线框
      window.onresize = this.onWindowResize;
      // window.requestAnimationFrame(this.render);
      this.render();
      this.raycaster = new THREE.Raycaster();
    },
    getBuildData() {
      this.FBXloader.load("./Assets/model/building.FBX", this.loaderObj);
      this.FBXloader.load("./Assets/model/floorFour.FBX", this.loaderFloor4);
    },
    // 加载楼层
    loaderFloor4(obj) {
      this.FloorFour = obj;
    },
    removeObjAll() {
      const self = this;
      // this.removeMan();
      const list = this.scene.getObjectByName("设备集合");
      if (list) {
        self.scene.remove(list);
      }
      self.scene.remove(this.modernBuilding);
      self.scene.remove(this.FloorTwo);
      self.scene.remove(this.FloorOne);
      self.scene.remove(this.FloorThree);
      self.scene.remove(this.FloorFour);
      self.scene.remove(this.meshZL);
      self.scene.remove(this.roomModel);
      // self.scene.remove(this.spriteGroup);
      self.scene.remove(this.capacityGroup);
      self.scene.remove(this.methNow2);
      this.removeEventListenerFn();
    },
    loaderAur() {
      const self = this;
      this.OBjMethmap = new Map();
      this.DataMethmap = new Map();
      self.cabinetType.forEach(item => {
        switch (item.type_index) {
          case "BZJJ":
            self.OBjMethmap.set("BZJJ", item);
            self.FBXloader.load(item.model_path, self.loaderCabinet1);
            break;
          case "LTG":
            self.OBjMethmap.set("LTG", item);
            self.FBXloader.load(item.model_path, self.loaderLieTou);
            break;
          case "PXJJ":
            self.OBjMethmap.set("PXJJ", item);
            self.FBXloader.load(item.model_path, self.loaderPeixian);
            break;
          case "ODF":
            self.OBjMethmap.set("ODF", item);
            self.FBXloader.load(item.model_path, self.loaderODF);
            break;
          case "MEN":
            self.OBjMethmap.set("MEN", item);
            self.FBXloader.load(item.model_path, self.loaderMen);
            break;
          case "KONGTIAO":
            self.OBjMethmap.set("KONGTIAO", item);
            self.FBXloader.load(item.model_path, self.loaderKongtiao);
            break;
          case "DCZ":
            self.OBjMethmap.set("DCZ", item);
            self.FBXloader.load(item.model_path, self.loaderDCZ);
            break;
          case "DDF":
            self.OBjMethmap.set("DDF", item);
            self.FBXloader.load(item.model_path, self.loaderDDF);
            break;
          case "ZLQ":
            self.OBjMethmap.set("ZLQ", item);
            self.FBXloader.load(item.model_path, self.loaderzhengliuqi);
            break;
          case "UPS":
            self.OBjMethmap.set("UPS", item);
            self.FBXloader.load(item.model_path, self.loaderUPS);
            break;
          case "ZLPDP":
            self.OBjMethmap.set("ZLPDP", item);
            self.FBXloader.load(item.model_path, self.loaderPDP);
            break;
          default:
            break;
        }
      });
      // if (this.buildId === "ADSMLHYUR01") {
      this.FBXloader.load(
        "./Assets/model/ADSMLHYUR01.FBX",
        self.loaderADSMLHYUR01
      );
      // }
    },
    propsFlagFn(e) {
      console.log("propsFlag-------", e);
      this.propsFlag = e;
    },
    // 选择统计
    setSelectBox(index) {
      const that = this;
      this.moduleStatistics.forEach((item, i, arr) => {
        that.$set(arr[i], "select", false);
        if (index === i) {
          that.$set(arr[index], "select", true);
        }
      });
      this.barData = this.moduleStatistics[index].barData;
      this.newMap();
    },
    render() {
      //更新控制器
      this.controls.update();
      //渲染场景和相机
      this.renderer.render(this.scene, this.camera);
      // this.CSS3Renderer.render(this.scene, this.camera); //执行渲染操作
      if (this.mixer !== null) {
        // 更新混合器相关的时间
        this.mixer.update(this.clock.getDelta());
      }
      window.requestAnimationFrame(this.render);
    },
    loaderObj(obj) {
      // console.log(obj);
      this.loading = false;
      // obj.translateY(-17000);
      obj.name = "整栋楼房";
      this.scene.add(obj);
      this.modernBuilding = obj;
      // obj.rotateX(Math.PI / 2);
      obj.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.loaderAur();
    },
    loaderUPS(obj) {
      this.UPS = obj;
      self.DataMethmap.set("UPS", obj);
    },
    // 整流器
    loaderzhengliuqi(obj) {
      this.ZLQ = obj;
      this.DataMethmap.set("ZLQ", obj);
    },
    loaderADSMLHYUR01(obj) {
      this.ADSMLHYUR01 = obj;
      // this.DataMethmap.set("ADSMLHYUR01", obj);
    },
    // 配电瓶
    loaderPDP(obj) {
      this.ZLPDP = obj;
      this.DataMethmap.set("ZLPDP", obj);
    },
    // 电池组
    loaderDCZ(obj) {
      this.DCZ = obj;
      this.DataMethmap.set("DCZ", obj);
    },
    // 4
    loaderDDF(obj) {
      this.DDF = obj;
      this.DataMethmap.set("DDF", obj);
      if (this.modelType === 1) {
        this.getRoomByIdData();
      }
    },
    // 5
    loaderKongtiao(obj) {
      this.kongtiao = obj;
      this.DataMethmap.set("KONGTIAO", obj);
    },
    // 6
    loaderLieTou(obj) {
      this.lietou = obj;
      this.DataMethmap.set("LTG", obj);
    },
    // 7
    loaderODF(obj) {
      this.ODF = obj;
      this.DataMethmap.set("ODF", obj);
    },
    // 8
    loaderPeixian(obj) {
      this.peixian = obj;
      this.DataMethmap.set("PXJJ", obj);
    },
    loaderMen(obj) {
      this.Men = obj;
      // obj.children[0].rotateX(-Math.PI / 2);
      this.DataMethmap.set("MEN", obj);
    },
    // 1
    loaderCabinet1(obj) {
      this.cabinet1 = obj;
      this.DataMethmap.set("BZJJ", obj);
    },
    setCamera() {
      const self = this;
      var width = window.innerWidth; //窗口宽度
      var height = window.innerHeight; //窗口高度
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
      this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
      this.camera.lookAt(this.scene.position);
      this.renderer.setSize(width, height); // 设置渲染区域尺寸
      this.renderer.setClearColor("#16244a", 1); // 设置背景颜色
      document
        .getElementById("buildModel")
        .appendChild(this.renderer.domElement); // body元素中插入canvas对象
      this.renderer.shadowMap.enabled = true;
      this.renderer.domElement.style.position = "absolute";
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // this.CSS3Renderer.setSize(window.innerWidth, window.innerHeight);
    },
    showBuilding() {
      // if (!this.lookAround) {
      this.removeObjAll();
      this.scene.add(this.modernBuilding);
      this.selectValue = ["全部"];
      // }
    },
    addMeth(item) {
      let geometry = null;
      let material = null;
      let mesh = null;
      // debugger;
      if (item.type_index === "QT") {
        //其它
        material = new THREE.MeshLambertMaterial({
          color: "#9fc1dd",
          transparent: true, //开启透明度
          opacity: 0.8 //设置透明度具体值
        }); //材质对象Material
        if (item.IsParallelX === "N") {
          geometry = new THREE.BoxGeometry(
            item.size[1],
            item.size[0],
            item.size[2]
          ); //创建一个立方体几何对象Geometry
        } else {
          geometry = new THREE.BoxGeometry(
            item.size[0],
            item.size[1],
            item.size[2]
          ); //创建一个立方体几何对象Geometry
        }
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.type_index === "ZHUZI") {
        //柱子
        material = new THREE.MeshLambertMaterial({
          color: "#CCC"
        }); //材质对象Material
        if (item.IsParallelX === "N") {
          geometry = new THREE.BoxGeometry(
            item.size[1],
            item.size[0],
            item.size[2]
          ); //创建一个立方体几何对象Geometry
        } else {
          geometry = new THREE.BoxGeometry(
            item.size[0],
            item.size[1],
            item.size[2]
          ); //创建一个立方体几何对象Geometry
        }
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else {
        material = this.DataMethmap.get(item.type_index).children[0].material;
        geometry = this.DataMethmap.get(item.type_index).children[0].geometry;

        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        switch (item.orientation) {
          case "东":
            mesh.rotateZ(Math.PI / 2);
            break;
          case "西":
            mesh.rotateZ(-Math.PI / 2);
            break;
          case "北":
            mesh.rotateZ(Math.PI);
            break;

          default:
            break;
        }
        const size = this.OBjMethmap.get(item.type_index).size;
        // if (item.IsParallelX === "N") {
        //   mesh.scale.set(item.size[1] / size[0], item.size[0] / size[1], 1);
        // } else {
        //   mesh.scale.set(item.size[0] / size[0], item.size[1] / size[1], 1);
        // }
        mesh.scale.set(
          item.size[0] / size[0],
          item.size[1] / size[1],
          item.size[2] / size[2]
        );
      }
      let positionY = item.size[2] / 2;
      // }
      if (item.IsParallelX === "N") {
        // 不平行x
        mesh.position.set(
          item.position[0] + item.size[1] / 2,
          item.position[1] + item.size[0] / 2,
          positionY
        );
      } else {
        // if (item.type_index === "MEN") {
        //   mesh.position.set(
        //     item.position[0] + item.size[0] / 2,
        //     item.position[1] + item.size[1] / 2 - 220,
        //     positionY
        //   );
        //   // mesh.scale.set(1, 1.2, 1);
        // } else {

        // }
        mesh.position.set(
          item.position[0] + item.size[0] / 2,
          item.position[1] + item.size[1] / 2,
          positionY
        );
      }

      mesh.TYPE = item.type;
      mesh.name = item.name;
      mesh.dataInfo = item;
      return mesh;
    },
    //设置接入间模型位置
    setCabinet() {
      const self = this;
      this.listGroup = new THREE.Group();
      this.listGroup.name = "设备集合";
      this.capacityGroup = new THREE.Group();
      this.capacityGroup.name = "容量集合";

      this.listGroup.rotateX(-Math.PI / 2); //------------旋转
      this.capacityGroup.rotateX(-Math.PI / 2); //------------旋转
      this.spriteArr = new THREE.Group();

      this.controls.addEventListener("change", this.tag);
      // console.log("this.OBjMethmap ", this.OBjMethmap);
      // console.log("this.DataMethmap ", this.DataMethmap);
      this.cabinetplaced.forEach((item, index) => {
        let mesh = self.addMeth(item, index);

        self.listGroup.add(mesh);
        if (self.buildId === "ADSMLHYUR01" && item.type_index === "MEN") {
          self.listGroup.remove(mesh);
        }
        if (item.capacity) {
          self.addBox(item);
        }
      });
      this.methNow2 = null;
      if (this.buildId === "ADSMLHYUR01") {
        this.methNow2 = this.ADSMLHYUR01;
        this.methNow2.position.y = 1200;
      } else {
        this.methNow2 = _NowRoom(this.froomData, this.floorHeight);
        // this.methNow2.position.y = -200;
        this.methNow2.rotateX(-Math.PI / 2); //------------旋转
      }
      this.loading = false;

      this.scene.add(this.listGroup); // 设备列表
      this.scene.add(this.methNow2); // 机房
      //创建一个屏幕和场景转换工具
      self.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      //加入鼠标拖动对象的一系列监听事件
      document.oncontextmenu = function() {
        return false;
      };
      this.removeEventListenerFn();
      this.addEventListenerFn();
    },
    // 改变场数
    changefield: _debounce(function(e) {
      // 模糊匹配，通过接口获取数据
      this.onDocumentMouseMove(e);
    }),
    removeEventListenerFn() {
      const self = this;
      self.renderer.domElement.removeEventListener(
        "mousemove",
        self.changefield,
        false
      );
      self.renderer.domElement.removeEventListener(
        "dblclick",
        self.onDocumentDblclick,
        false
      );
      self.renderer.domElement.removeEventListener(
        "click",
        self.onDocumentClick,
        false
      );
      // self.renderer.domElement.removeEventListener(
      //   "mousedown",
      //   self.onDocumentMusedown,
      //   false
      // );
    },
    addEventListenerFn() {
      const self = this;
      // ----------------
      self.renderer.domElement.addEventListener(
        "mousemove",
        self.changefield,
        false
      );
      self.renderer.domElement.addEventListener(
        "dblclick",
        self.onDocumentDblclick,
        false
      );
      self.renderer.domElement.addEventListener(
        "click",
        self.onDocumentClick,
        false
      );
      // self.renderer.domElement.addEventListener(
      //   "mousedown",
      //   self.onDocumentMusedown,
      //   false
      // );
    },
    addBox(item) {
      let geometry = null;
      let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      }); //材质对象Material
      let geometry1 = null;
      let material1 = new THREE.MeshBasicMaterial({
        color: 0x0000ff
      }); //材质对象Material
      if (item.IsParallelX === "N") {
        geometry = new THREE.BoxGeometry(
          item.size[1],
          item.size[0],
          item.size[2]
        ); //创建一个立方体几何对象Geometry
        geometry1 = new THREE.BoxGeometry(
          item.size[1],
          item.size[0],
          item.capacity * item.size[2]
        ); //创建一个立方体几何对象Geometry
      } else {
        geometry = new THREE.BoxGeometry(
          item.size[0],
          item.size[1],
          item.size[2]
        ); //创建一个立方体几何对象Geometry
        geometry1 = new THREE.BoxGeometry(
          item.size[0],
          item.size[1],
          item.capacity * item.size[2]
        ); //创建一个立方体几何对象Geometry
      }
      if (item.capacity > 0.7) {
        material1 = new THREE.MeshBasicMaterial({
          color: 0xff3030
        }); //材质对象Material
      }

      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      let mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
      let positionY1 = (item.size[2] * item.capacity) / 2;
      let positionY = item.size[2] / 2;

      mesh.position.set(
        item.position[0],

        item.position[1],
        positionY
      );
      mesh1.position.set(
        item.position[0],

        item.position[1],
        positionY1
      );
      this.capacityGroup.add(mesh); //网格模型添加到场景中
      this.capacityGroup.add(mesh1); //网格模型添加到场景中
    },
    tag() {
      //创建一个三维向量作为世界坐标
      var worldVector = new THREE.Vector3();
      //获取网格模型boxMesh的世界坐标，赋值给worldVector
      if (this.intersectsObj) {
        this.intersectsObj.getWorldPosition(worldVector);
        //世界坐标转标准设备坐标，standardVector是WebGL设备坐标
        var standardVector = worldVector.project(this.camera);
        // 根据WebGL标准设备坐标standardVector计算div标签在浏览器页面的坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a); //标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b); //标准设备坐标转屏幕坐标
        /**
         * 设置标签元素的位置
         */
        this.$refs.menu2.style.left = x + "px";
        this.$refs.menu2.style.top = y - 200 + "px";

        this.$refs.menu.style.left = x + "px";
        this.$refs.menu.style.top = y + "px";
        this.$refs.menu3.style.left = x + "px";
        this.$refs.menu3.style.top = y + "px";
        this.selectedObject.getWorldPosition(worldVector);
        //这里的130px主要是为了标签和模型有一定偏移，当然也可以不设置，两者叠加在一起
      }
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
        if (this.showMenu2) {
          return;
        }
        const geometry = intersects[0].object.geometry;
        const material = intersects[0].object.material;
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        let size = null;
        if (
          intersects[0].object.dataInfo.type_index === "QT" ||
          intersects[0].object.dataInfo.type_index === "ZHUZI"
        ) {
          size = intersects[0].object.dataInfo.size;
        } else {
          size = this.OBjMethmap.get(intersects[0].object.dataInfo.type_index)
            .size;
          switch (intersects[0].object.dataInfo.orientation) {
            case "东":
              mesh.rotateY(Math.PI / 2);
              break;
            case "西":
              mesh.rotateY(-Math.PI / 2);
              break;
            case "北":
              mesh.rotateY(Math.PI);
              break;

            default:
              break;
          }
          // mesh.rotateY(-Math.PI / 2);
          mesh.scale.set(
            intersects[0].object.dataInfo.size[0] / size[0],
            intersects[0].object.dataInfo.size[1] / size[1],
            intersects[0].object.dataInfo.size[2] / size[2]
          );
        }
        mesh.rotateX(-Math.PI / 2); //------------旋转
        this.scene.updateMatrixWorld(true);
        const worldPosition = new THREE.Vector3();
        intersects[0].object.getWorldPosition(worldPosition);

        this.methName = intersects[0].object.name;
        this.location = intersects[0].object.dataInfo.location;
        this.occuRate = intersects[0].object.dataInfo.occuRate;
        if (
          intersects[0].object.dataInfo.type_index === "BZJJ" ||
          intersects[0].object.dataInfo.type_index === "ODF"
        ) {
          this.showOccuRate = true;
        } else {
          this.showOccuRate = false;
        }
        mesh.position.set(worldPosition.x, worldPosition.y, worldPosition.z); //点光源位置

        this.border = new THREE.BoxHelper(mesh, "#5b78e7"); //设置边框，这个边框不会旋转
        this.border.name = "高亮显示柜";
        this.scene.add(this.border); //网格模型添加到场景中
        var scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;

        this.$refs.menu3.style.left = event.clientX - 77 + "px";
        this.$refs.menu3.style.top = event.clientY + scrollTop - 130 + "px";
        this.showMenu3 = true;
        if (!this.freezeShowMenu2) {
          this.showMenu2 = false;
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
        if (!this.freezeShowMenu2) {
          this.showMenu2 = false;
        }
        this.showMenu3 = false;
        this.showMenu = false;
      }
    },
    onDocumentDblclick(event) {
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
        // console.log(intersects[0].object);
        this.dataInfo = intersects[0].object.dataInfo;
        this.propsFlag = true;
      }
    },
    onDocumentClick(event) {
      const self = this;
      event.preventDefault();
      // this.showMenu = false;
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        self.listGroup.children
      );
      if (intersects.length && intersects[0].object.name === "列头柜") {
        this.freezeShowMenu2 = true;
        this.intersectsObj = intersects[0].object;
        this.selectedObject = intersects[0].object;
        // this.showMenu2 = true;
        // console.log("点击了啥", intersects);
      } else {
        if (this.transformControls) {
          this.scene.remove(this.transformControls);
          this.transformControls.dispose();
          this.transformControls = null;
        }
      }
    },
    hineMenu2() {
      this.showMenu2 = false;
      this.freezeShowMenu2 = false;
    },
    newMap() {
      this.myChart.clear();
      let option = this.setOption();
      this.myChart.setOption(option);
    },
    setOption() {
      let data = [];
      this.barData.forEach(item => {
        data.push(item.name);
      });
      let $this = this;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "center",
          right: 30,
          trigger: "item",
          icon: "rect",
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          data: data,
          textStyle: {
            //图例文字的样式
            // color: ["#13A86E", "#7B91FF", "#35a0e4", "#E5A73B"],
            color: "#fff",
            fontSize: 14
          },
          formatter: function(params) {
            let str = "kw";
            // console.log("$this.moduleStatistics", $this.moduleStatistics);
            if ($this.moduleStatistics[0].select) {
              str = " ㎡";
            } else if ($this.moduleStatistics[1].select) {
              str = "kw";
            } else if ($this.moduleStatistics[2].select) {
              str = "";
            } else if ($this.moduleStatistics[3].select) {
              str = "";
            }
            for (var i = 0; i < option.series[0].data.length; i++) {
              if (option.series[0].data[i].name == params) {
                return params + " " + option.series[0].data[i].value + str;
              }
            }
          }
        },
        color: ["#13A86E", "#6B7FE3", "#35a0e4", "#E5A73B"],
        series: [
          {
            name: "",
            type: "pie",
            selectedMode: "single",
            radius: ["50%", "80%"],
            center: ["25%", "55%"],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            // itemStyle: {
            //   // 此配置
            //   normal: {
            //     borderWidth: 3,
            //     borderColor: "rgba(76, 102, 199, 0.9)"
            //   },
            //   emphasis: {
            //     borderWidth: 0
            //   }
            // },
            data: $this.barData
          }
        ]
      };
      return option;
    },
    showChart() {
      this.showChartFlag = !this.showChartFlag;
    },
    backShow() {
      this.$router.back(-1);
    }
  },
  destroyed: function() {
    this.removeObjAll();
    this.removeEventListenerFn();
    document.getElementById("buildModel").innerHTML = "";
  },
  watch: {
    selectValue(val) {
      console.log("selectValue", val);
      if (val.length >= 0) {
        if (!this.listGroup) {
          return;
        }
        if (val.indexOf("全部") > -1) {
          this.listGroup.traverse(function(child) {
            if (child.isMesh && child.TYPE) {
              if (child.material instanceof Array) {
                child.material.forEach((item, index) => {
                  child.material[index].transparent = true;
                  child.material[index].opacity = 1;
                });
              } else {
                child.material.transparent = true; // 设置材质颜色
                child.material.opacity = 1;
              }
            }
          });
          return;
        }
        this.listGroup.traverse(function(child) {
          if (child.isMesh && child.TYPE) {
            const length = val.filter(v => child.TYPE.indexOf(v) > -1).length;
            // if (val.length > 0) {
            if (child.material instanceof Array) {
              child.material.forEach((item, index) => {
                child.material[index].transparent = true;
                child.material[index].opacity = 0.1;
              });
            } else {
              child.material.transparent = true; // 设置材质颜色
              child.material.opacity = 0.1;
            }
            // }
            if (length) {
              if (child.material instanceof Array) {
                child.material.forEach((item, index) => {
                  child.material[index].transparent = true;
                  child.material[index].opacity = 1;
                });
              } else {
                child.material.transparent = true; // 设置材质颜色
                child.material.opacity = 1;
              }
            }
          }
        });
      }
    },
    isCollapse(val) {
      if (val === "机柜容量图") {
        this.removeEventListenerFn();
        const list = this.scene.getObjectByName("设备集合");
        this.scene.remove(list);
        this.scene.add(this.capacityGroup);
        this.controls.enabled = true;
      } else if (val === "模块间视图") {
        this.scene.remove(this.capacityGroup);
        this.scene.add(this.listGroup);
        this.addEventListenerFn();
        this.controls.enabled = true;
      } else {
        this.controls.enabled = false;
      }
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
  height: 26px;
  /* line-height: 30px; */
}
.stip-formatter > div:last-child {
  padding-bottom: 15px;
}
.stip-formatter div .span {
  width: 28%;
  text-align: left;
}
.stip-formatter div span {
  float: left;
  width: 60%;
}
.el-select__tags {
  max-width: 440px !important;
}
.capacity-btn {
  position: absolute;
  top: 140px;
  font-size: 12px;
  padding: 5px;
  right: 330px;
  height: 34px;
}
.capacity-btn span {
  font-size: 12px;
}
.capacity-btn .el-switch__core {
  height: 14px;
  width: 30px !important;
}
.capacity-btn .el-switch__core:after {
  width: 10px;
  height: 10px;
}
.capacity-btn.el-switch.is-checked .el-switch__core::after {
  margin-left: -12px;
}
</style>
<style scoped lang="scss">
.cad-img {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #16244a;
  left: 0;
  top: 0;
  padding-right: 300px;
  padding-top: 70px;
  .img-box {
    height: 705px;
    width: 700px;
    margin: 110px auto;
    background: url("../../assets/common/image/weimojian/cad-img.png") no-repeat
      center;
    background-size: 100%;
  }
  .img-box2 {
    height: 700px;
    width: 700px;
    margin: 120px auto;
    background: url("../../assets/common/image/weimojian/floor.png") no-repeat;
    // border: 10px solid #ced9e5;
    overflow: hidden;
    background-size: 100%;
  }
}

// @import "@/assets/theme/common.scss";
@media screen and (max-height: 769px) {
  .lb-module-list {
    height: 160px;
  }
  .cad-img {
    overflow-y: scroll;
    .img-box {
      height: 505px;
      width: 500px;
    }
  }
}

.capacity-btn2 {
  position: absolute;
  top: 83px;
  font-size: 14px;
  padding: 5px;
  right: 330px;
  height: 34px;
}
.lable-title {
  width: 100%;
  height: 60px;
  background-color: rgba(35, 52, 98, 0.7);
  position: absolute;
  top: 70px;
  font-size: 20px;
  line-height: 60px;
  padding-left: 55px;
  left: 0;
}
.close-btn {
  width: 30px;
  height: 30px;
  background: rgba(22, 36, 74, 0.7);
  border-radius: 4px;
  position: absolute;
  right: -35px;
  top: 0;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.powerCharts {
  height: 116px;
  width: 270px;
}
.lb-module-list {
  max-height: 360px;
  overflow: auto;
  padding-bottom: 30px;
}
.hide {
  display: none;
}
.menu {
  width: 80px;
  background: #00bcd4;
  position: absolute;
  color: #000;
  padding: 10px 0;
  border-radius: 5px;
}
.menu li {
  padding: 4px 10px;
}
.menu2 li {
  cursor: inline;
  text-indent: 5px;
}
.menu li:hover {
  background: #7187f0;
  cursor: pointer;
}
.menu2 li:hover {
  background: transparent;
  cursor: inherit;
}
.menu2 li:nth-child(2):hover {
  background: #7187f0;
  background-clip: content-box;
  cursor: pointer;
}
.menu2 {
  width: 150px;
  background: rgba(22, 36, 74, 0.7);
  border-radius: 4px;
}
.menu2 .raius {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 1);
  border: 3px solid rgba(113, 135, 240, 1);
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 10px;
}
.menu2 li {
  color: #fff;
  position: relative;
  padding-left: 30px;
  font-size: 14px;
}
.menu2 li .dowon {
  width: 8px;
  height: 9px;
  background: url(../../assets/common/image/arrow.png) no-repeat center;
  background-size: 100%;
  position: absolute;
  bottom: -4px;
  left: 12px;
}
.menu2 ul li:last-child .dowon {
  display: none;
}
.menu3 {
  width: 154px;
  background: rgba(22, 36, 74, 0.6);
  color: #fff;
}
.menu3 li label {
  color: rgba(255, 255, 255, 0.4);
}
.menu3::after {
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  margin-left: -5px;
  bottom: -20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: rgba(22, 36, 74, 0.6);
}
.none-hover.ui-height48:hover {
  background-color: inherit;
  cursor: inherit;
}
.module-statis .modal {
  width: 119px;
  height: 65px;
  opacity: 0.8;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  float: left;
  margin-bottom: 15px;
  cursor: pointer;
}

.module-statis .modal:nth-child(2n + 1) {
  margin-right: 15px;
}
.right_building,
.right_module,
.right_planning,
.right_cabinet,
.right_mokuai,
.right_delivery {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  background-size: 100%;
  float: left;
}
.module-statis .number {
  font-size: 22px;
  font-family: "MicrosoftYaHei";
  font-weight: 400;
  color: rgb(255, 255, 255);
  /*opacity:0.6;*/
}
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
.model-select {
  position: absolute;
  top: 140px;
  left: 50px;
  min-width: 240px;
}
.model-select1 {
  position: absolute;
  top: 140px;
  left: 320px;
  min-width: 100px;
}
.ui-city-tabbar-ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
}
.ui-city-tabbar-li {
  padding: 9px 0;
  background: rgba(107, 127, 227, 0);
  border: 1px solid rgba(113, 135, 240, 1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  width: 46%;
  margin-right: 12px;
  cursor: pointer;
  float: left;
}
.ui-city-tabbar-li:last-child {
  margin-right: 0;
}
.ui-active {
  background: #7187f0;
  border: 0;
}
</style>
