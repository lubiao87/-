<template>
  <div
    style="width: 100%;height:100%;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div style="width: 100%;height:100%;" id="buildModel"></div>
    <!-- 机房 2d页面 -->
    <div
      class="cad-img ui-busin-ul"
      v-show="isCollapse === '2D平面图'"
      ref="isCollapse2d"
    >
      <build-model2d
        ref="buildModel2d"
        class="img-box2  ui-busin-ul"
        @propsFlag="propsFlagFn"
        :foremostData="cabinetplaced"
      ></build-model2d>
    </div>
    <!-- 右键html -->
    <div class="menu" v-show="showMenu" ref="menu">
      <ul>
        <li @click="deleteMeth">删除机架</li>
        <li @click="setMethPositon">修改位置</li>
        <li @click="showProps">查看详情</li>
      </ul>
    </div>
    <!-- 列头柜鼠标悬停html  -->
    <div class="menu menu2" v-show="showMenu2" ref="menu2">
      <ul>
        <li
          v-for="(item, index) in dataMeth"
          :key="index"
          @click="zlLiFn(item)"
        >
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
        <li><label for="">已用/未用：</label> {{ occuRate || "-" }}</li>
      </ul>
    </div>
    <div class="lable-title">{{ floorName }}</div>
    <!-- 按钮组 -->
    <el-radio-group
      class="capacity-btn2"
      v-model="isCollapse"
      style="margin-bottom: 20px;"
      v-show="floorIndex > -1"
    >
      <el-radio-button size="small" label="模块间视图"
        >模块间视图</el-radio-button
      >
      <el-radio-button size="small" label="机柜容量图"
        >机柜容量图</el-radio-button
      >
      <el-radio-button size="small" label="2D平面图">2D平面图</el-radio-button>
    </el-radio-group>
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
        <!-- <h5 class="ui-city-title ui-height48 none-hover">
          <span class="ui-linebg"></span>{{ boxTitle }}
        </h5> -->
        <div id="powerCharts" class="powerCharts"></div>
      </div>
    </div>
    <div class="yhui-real-timeimg"></div>
    <el-button class="model-select1" type="primary" v-show="floorIndex > -1">
      <i class="el-icon-folder-add"></i> 增加模型
    </el-button>
    <el-select
      v-model="selectValue"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="请选择机柜类型"
      class="model-select"
      size="large"
      v-show="floorIndex > -1"
    >
      <el-option
        v-for="item in cabinetType"
        :key="item.type"
        :label="item.name"
        :value="item.name"
        :class="{ hide: item.index === 1 || item.index === 2 }"
      >
      </el-option>
    </el-select>
    <popup :propsFlag="propsFlag" />
  </div>
  <!-- 右边收缩栏结束 -->
</template>

<script>
import echarts from "echarts"; // 引入echarts
// import { listSearchMixin } from "../../mixin"; //混淆请求
import * as THREE from "three";
// import "three-obj-mtl-loader";
import {
  _debounce,
  _getTextCanvas,
  _drawArrow,
  _NowRoom
} from "@/utils/public.js";
import cabinetplaced from "@/json/dataList.js";
import "@/utils/control/TrackballControls.js";
import "@/utils/control/DragControls.js";
import "@/utils/control/TransformControls.js";
import "@/utils/renderers/CSS3DRenderer.js";
import "@/utils/threebsp.js";
// import "@/utils/renderers/CSS2DRenderer.js";

// import "@/utils/postprocessing/EffectComposer.js";
// import "@/utils/postprocessing/RenderPass.js";
// import "@/utils/postprocessing/ShaderPass.js";
// import "@/utils/shaders/CopyShader.js";
// import "@/utils/postprocessing/OutlinePass.js";
require("three-fbxloader-offical");
import { OrbitControls } from "../../utils/OrbitControls";
import popup from "../../components/popup/popup";
import buildModel2d from "./build-model-2d";
// import { api2 } from "../../api/api"; //api配置请求的路径
export default {
  name: "olmap",
  props: ["coordinate"],
  // mixins: [listSearchMixin],
  components: {
    popup,
    buildModel2d
  },
  data() {
    return {
      animationMenTop: true, // 开门右动画
      animationMenTop2: true, // 开门左动画
      animationZF: true, // 开门右正负
      animationZF2: true, // 开门左正负
      methName: "", // 鼠标悬停字段1
      location: "", // 鼠标悬停字段2
      occuRate: "", // 鼠标悬停字段2
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
      showMenu: false,
      buildId: null,
      propsFlag: false,
      barData: [
        { value: 589, name: "未用" },
        { value: 286, name: "已用" },
        { value: 280, name: "预占" }
      ],
      myChart: null,
      activeIndex: 0,
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
      referenceModel: null, // 人网格模型
      AnimationAction: null, // 动画
      // intersects: null, // -----
      timer: 20000,
      loading: true,
      panelShow: true,
      lookAround: false,
      floorIndex: 4,
      cameraX: 0,
      cameraY: -14000,
      cameraZ: 6000,
      floorName: "工业园机楼",
      animationTime: 4,
      animationFlag: true,
      cabinetType: [
        {
          name: "全部",
          size: [0, 0, 0],
          index: 0
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          index: 1 // 类型1对应的索引，目的为了减少遍历
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.2], // 长宽高
          index: 2
        },
        {
          name: "标准机架 - 56个", // 机柜类型
          size: [0.6, 0.6, 2.0], // 长宽高
          index: 3
        },
        {
          name: "DDF机架 - 12个", // 机柜类型
          size: [0.3, 0.24, 2.6], // 长宽高
          index: 4
        },
        {
          name: "空调 - 12个", // 机柜类型
          size: [0.5, 0.5, 2.6], // 长宽高
          index: 5
        },
        {
          name: "列头机架 - 14个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          index: 6
        },
        {
          name: "ODF机架 - 32个", // 机柜类型
          size: [0.3, 0.84, 2.6], // 长宽高
          index: 7
        },
        {
          name: "配线机架 - 12个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          index: 8
        }
      ],
      cabinetPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      cabinetplaced: [],
      floorData2: [
        {
          name: "机房门",
          center: [15000, 1000, 9000]
        },
        {
          name: "机房门",
          center: [-2000, 1000, 10000]
        }
      ],
      analyser: null,
      superman: false,
      // froomData: [ // 四边形
      //   [0, 0],
      //   [0, 18000],
      //   [20000, 18000],
      //   [20000, 0]
      // ],
      // froomData: [ // 7 六边形
      //   [0, 0],
      //   [0, 18000],
      //   [20000, 18000],
      //   [20000, 24000],
      //   [40000, 24000],
      //   [40000, 0]
      // ],
      // froomData: [ // L 六边形
      //   [0, 0],
      //   [0, 24000],
      //   [20000, 24000],
      //   [20000, 18000],
      //   [40000, 18000],
      //   [40000, 0]
      // ],
      froomData: [
        // N 八边形 （单位：毫米）
        [0, 0],
        [0, 25000],
        [18000, 25000],
        [18000, 35000],
        [25000, 35000],
        [25000, 18000],
        [18000, 18000],
        [18000, 0]
      ]
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  created() {
    const self = this;
    console.log("this.$route.params---", this.$route.params);
    this.floorName = this.$route.params.name;
    self.cabinetplaced = cabinetplaced;
    self.cabinetType = self.cabinetType.map(item => {
      let items = item;
      items.size = [
        item.size[0] * 1000,
        item.size[1] * 1000,
        item.size[2] * 1000
      ];
      return items;
    });
    self.cabinetplaced = self.cabinetplaced.map(item => {
      let items = item;
      items.position = [item.posX * 1000, item.posY * 1000];
      return items;
    });
    this.buildId = this.$route.params.buildId;
    if (sessionStorage.getItem("username") === "lubiao87") {
      this.superman = true;
    }
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      this.myChart = echarts.init(document.getElementById("powerCharts"));
      this.newMap();
      self.createHtml();
    });
    //  this.$parent.restaurants = this.$parent.loadAll();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      // 查看楼层
      // if (!this.lookAround) {
      this.floorIndex = data.floor;
      if (data.buildId > 114) {
        this.buildId = data.buildId;
        this.floorName = "工业园机楼 - " + data.label;
        this.scene.remove(this.FloorFour);
        this.scene.add(this.roomModel);
      } else {
        this.animationFlag = true;
        this.buildId = data.buildId;
        this.floorName = "工业园机楼 - " + data.label;
      }
      this.isCollapse = "模块间视图";
      // }
    },
    createHtml() {
      const self = this;
      // console.log(GKG);
      this.scene = null;
      this.scene = new THREE.Scene(); // 场景
      this.FBXloader = new THREE.FBXLoader(); // fbx加载器
      this.FBXloader.load("./Assets/fbx/1.FBX", self.loaderCabinet1);
      this.FBXloader.load("./Assets/fbx/2.FBX", self.loaderCabinet2);
      this.FBXloader.load("./Assets/fbx/3.FBX", self.loaderCabinet3);
      this.FBXloader.load("./Assets/fbx/DDF.FBX", self.loaderDDF);
      this.FBXloader.load("./Assets/fbx/kongtiao.FBX", self.loaderKongtiao);
      this.FBXloader.load("./Assets/fbx/lietou.FBX", self.loaderLieTou);
      this.FBXloader.load("./Assets/fbx/ODF.FBX", self.loaderODF);
      this.FBXloader.load("./Assets/fbx/peixian.FBX", self.loaderPeixian);
      this.FBXloader.load(
        "./Assets/fbx/floorFourChilder.FBX",
        self.floorFourChilder
      );
      this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
      this.renderer = new THREE.WebGLRenderer(); // 渲染器
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
    propsFlagFn(e) {
      console.log("propsFlag-------", e);
      this.propsFlag = e;
    },
    // 整流器
    zlLiFn(item) {
      const that = this;
      if (item === "整流器01") {
        // console.log("你想看整流器？");
        // console.log("this.meshZL.position", this.meshZL);
        // this.camera.lookAt(this.meshZL.position);
        this.scene.position.set(
          -this.meshZL.position.x,
          -this.meshZL.position.y,
          -this.meshZL.position.z
        );

        this.meshZL.material.transparent = true;
        this.meshZL.material.opacity = 0.1;
        window.startTime = 0;
        window.ns = 0;
        let times = setInterval(function() {
          window.startTime += 0.05;
          window.ns += 0.02;
          if (window.ns >= 1) {
            window.ns = 0.1;
          }
          that.meshZL.material.opacity = window.ns;
          if (window.startTime >= 10) {
            window.clearInterval(times);
            that.meshZL.material.opacity = 1;
          }
        });
      }
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
      this.boxTitle = this.moduleStatistics[index].name;
      if (this.moduleStatistics[index].name === "机房总数") {
        this.boxTitle = "机房列表";
      }
      switch (index) {
        case 0:
          this.barData = [
            { value: 70, name: "未用" },
            { value: 30, name: "已用" }
          ];
          this.newMap();
          break;
        case 1:
          this.barData = [
            { value: 400, name: "未用" },
            { value: 560, name: "已用" },
            { value: 40, name: "预占" }
          ];
          this.newMap();
          break;
        case 2:
          this.barData = [
            { value: 5, name: "电池" },
            { value: 2, name: "空调" }
          ];
          this.newMap();
          break;
        case 3:
          this.barData = [
            { value: 6, name: "传输机架" },
            { value: 2, name: "数据机架" }
          ];
          this.newMap();
          break;

        default:
          break;
      }
    },
    // OutlinePass通道
    setOutlinePass() {
      // 创建一个渲染器通道，场景和相机作为参数
      this.renderPass = new THREE.RenderPass(this.scene, this.camera);
      // 创建OutlinePass通道,显示外轮廓边框
      this.OutlinePass = new THREE.OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
      );
      var effectCopy = new THREE.ShaderPass(THREE.CopyShader); //CopyShader是为了能将结果输出，普通的通道一般都是不能输出的，要靠CopyShader进行输出
      effectCopy.renderToScreen = true; //设置这个参数的目的是马上将当前的内容输出

      // 后处理完成，设置renderToScreen为true，后处理结果在Canvas画布上显示
      this.OutlinePass.renderToScreen = true;
      //OutlinePass相关属性设置
      this.OutlinePass.visibleEdgeColor = new THREE.Color(0, 1, 0);
      this.OutlinePass.hiddenEdgeColor = new THREE.Color(0, 1, 0);
      this.OutlinePass.edgeThickness = 3.0;
      // 创建后处理对象EffectComposer，WebGL渲染器作为参数
      this.composer = new THREE.EffectComposer(this.renderer);
      // 设置renderPass通道
      this.composer.addPass(this.renderPass);
      // 设置OutlinePass通道
      this.composer.addPass(this.OutlinePass);
    },
    render() {
      // if (this.scene) {

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
      // var delta = this.clock.getDelta();
      // this.composer.render(delta);
      if (this.analyser) {
        // console.log(analyser)
        // 获得频率数据N个
        var arr = this.analyser.getFrequencyData();
        // 遍历组对象，每个网格子对象设置一个对应的频率数据
        this.musicGroup.children.forEach((elem, index) => {
          elem.scale.y = arr[index] / 80;
          elem.material.color.r = arr[index] / 200;
        });
      }
      window.requestAnimationFrame(this.render);
    },
    floorFourChilder(obj) {
      console.log("floorFourChilder", obj);
      // obj.scale.set(10, 10, 10)
      this.roomModel = obj;
      this.roomModel.position.y = -4000;
      this.roomModel.position.z = -10000;
      // this.roomModel.children[6].geometry.position(820, 0, 0);
      // this.roomModel.children[6].position(-820, 0, 0);
    },
    // 4
    loaderDDF(obj) {
      const that = this;
      this.DDF = obj;
      that.setCabinet();
    },
    // 5
    loaderKongtiao(obj) {
      this.kongtiao = obj;
    },
    // 6
    loaderLieTou(obj) {
      this.lietou = obj;
    },
    // 7
    loaderODF(obj) {
      this.ODF = obj;
    },
    // 8
    loaderPeixian(obj) {
      this.peixian = obj;
    },
    // 1
    loaderCabinet1(obj) {
      this.cabinet1 = obj;
    },
    // 2
    loaderCabinet2(obj) {
      this.cabinet2 = obj;
    },
    // 3
    loaderCabinet3(obj) {
      this.cabinet3 = obj;
    },
    loaderJIGUI(obj) {
      // obj.children[0].material[0].color.set("#1e222b"); // 设置材质颜色
      this.JIGUI = obj;
      this.JIGUI.name = "机柜类型all";
      // this.scene.add(this.JIGUI);
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
    // 右键查看机架详情
    showProps() {
      this.propsFlag = true;
      this.showMenu = false;
    },
    addMeth(item) {
      let geometry = new THREE.BoxGeometry(
        this.cabinetType[item.index].size[0],
        this.cabinetType[item.index].size[2],
        this.cabinetType[item.index].size[1]
      ); //创建一个立方体几何对象Geometry
      let material = new THREE.MeshLambertMaterial({
        color: "#9fc1dd",
        transparent: true, //开启透明度
        opacity: 0.8 //设置透明度具体值
      }); //材质对象Material
      let mesh = null;
      if (item.index === 1) {
        geometry = this.cabinet1.children[0].geometry;
        material = this.cabinet1.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 2) {
        geometry = this.cabinet2.children[0].geometry;
        material = this.cabinet2.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 3) {
        geometry = this.cabinet3.children[0].geometry;
        material = this.cabinet3.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 4) {
        geometry = this.DDF.children[0].geometry;
        material = this.DDF.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 5) {
        geometry = this.kongtiao.children[0].geometry;
        material = this.kongtiao.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 6) {
        geometry = this.lietou.children[0].geometry;
        material = this.lietou.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 7) {
        geometry = this.ODF.children[0].geometry;
        material = this.ODF.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      } else if (item.index === 8) {
        geometry = this.peixian.children[0].geometry;
        material = this.peixian.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      }
      // mesh.rotateX(-Math.PI / 2);
      let positionY = this.cabinetType[item.index].size[1] / 2;
      // }
      mesh.position.set(
        item.position[1] - this.cabinetType[item.index].size[0] / 2,
        item.position[0] + this.cabinetType[item.index].size[1] / 2,
        positionY
      );
      mesh.TYPE = this.cabinetType[item.index].name;
      mesh.name = item.name;
      mesh.dataInfo = item;
      if (item.parentId) {
        mesh.parentId = item.parentId;
        // 创建精灵图标
        this.newCSS3DSprite3(
          "子",
          item.position[1] - this.cabinetType[item.index].size[0] / 2,
          item.position[0] + 2000 + this.cabinetType[item.index].size[1] / 2,
          positionY
        );
      }
      if (item.setId) {
        mesh.setId = item.setId;
      }
      return mesh;
    },
    deleteMeth(event) {
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      event.preventDefault();
      // console.log(this.selectedObject);
      this.listGroup.remove(this.selectedObject);
      this.showMenu = false;
      return false;
    },
    setCabinet() {
      const self = this;
      this.listGroup = new THREE.Group();
      this.listGroup.name = "设备集合";
      this.capacityGroup = new THREE.Group();
      this.capacityGroup.name = "容量集合";
      this.spriteGroup = new THREE.Group();
      this.spriteGroup.name = "图标集合";

      this.spriteArr = new THREE.Group();

      // console.log("this.scene ---------- ", this.scene);
      this.floorData2.forEach((item, index) => {
        let width = 4000,
          height = 1200,
          r = 200;
        var spriteMaterial = new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(
            _getTextCanvas(item.name, width, height, r)
          ) //设置精灵纹理贴图
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(width, height, 1); // 只需要设置x、y两个分量就可以
        sprite.position.set(item.center[0], item.center[1], item.center[2]);
        self.spriteGroup.add(sprite);
        let width2 = 400,
          height2 = 3200;
        // 线条
        //注意注意矩形几何体宽高比例和canvas宽高比例一致，以免压缩或拉伸
        var plane = new THREE.PlaneGeometry(width2, height2);
        var planeMaterial = new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(_drawArrow(width2, height2)), //设置精灵纹理贴图
          side: THREE.DoubleSide, // 双面显示
          transparent: true // 开启透明效果，否则颜色贴图map的透明不起作用
        });
        var planeMesh = new THREE.Mesh(plane, planeMaterial);
        // planeMesh.scale.set(width2, height2, 1); // 只需要设置x、y两个分量就可以
        planeMesh.position.set(
          item.center[0] - 500,
          item.center[1] - height2 / 2 - 400,
          item.center[2]
        );
        planeMesh.rotateZ(-Math.PI / 6);
        self.spriteGroup.add(planeMesh);
      });

      this.controls.addEventListener("change", this.tag);
      // 整流器
      var geometryZL = new THREE.BoxGeometry(1000, 600, 400); //创建一个立方体几何对象Geometry
      var materialZL = new THREE.MeshLambertMaterial({
        color: "#666"
      }); //材质对象Material
      this.meshZL = new THREE.Mesh(geometryZL, materialZL); //网格模型对象Mesh
      if (self.buildId === 114102) {
        this.cabinetplaced.forEach((item, index) => {
          let mesh = self.addMeth(item, index);
          self.listGroup.add(mesh);
          if (item.capacity) {
            self.addBox(item);
          }
        });
        this.scene.add(this.listGroup);
        this.scene.add(this.meshZL);
      } else if (sessionStorage.getItem("buildId") && self.buildId === 114101) {
        this.cabinetplaced.forEach((item, index) => {
          let mesh = self.addMeth(item, index);
          self.listGroup.add(mesh);
          if (item.capacity) {
            self.addBox(item);
          }
        });

        this.scene.add(this.listGroup);
        this.scene.add(this.meshZL);
      }
      let methNow2 = _NowRoom(this.froomData, [100, 5000]);
      // methNow2.rotateX(Math.PI / 2);
      methNow2.position.x = -4000;
      methNow2.position.y = -1580;
      methNow2.position.z = -1400;
      this.loading = false;

      this.scene.add(this.spriteGroup);
      this.scene.add(methNow2);
      //创建一个屏幕和场景转换工具
      // self.projector = new THREE.Projector();
      self.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      //加入鼠标拖动对象的一系列监听事件
      document.oncontextmenu = function() {
        return false;
      };
      this.removeEventListenerFn();
      this.addEventListenerFn();
      this.setOutlinePass();
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
      self.renderer.domElement.removeEventListener(
        "mousedown",
        self.onDocumentMusedown,
        false
      );
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
      self.renderer.domElement.addEventListener(
        "mousedown",
        self.onDocumentMusedown,
        false
      );
    },
    addBox(item) {
      // console.log("addBox", item);
      let geometry = new THREE.BoxGeometry(
        this.cabinetType[item.index].size[1],
        this.cabinetType[item.index].size[0],
        this.cabinetType[item.index].size[2]
      ); //创建一个立方体几何对象Geometry
      let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      }); //材质对象Material
      let geometry1 = new THREE.BoxGeometry(
        this.cabinetType[item.index].size[1],
        this.cabinetType[item.index].size[0],
        item.capacity * this.cabinetType[item.index].size[2]
      ); //创建一个立方体几何对象Geometry
      let material1 = new THREE.MeshBasicMaterial({
        color: 0x0000ff
      }); //材质对象Material
      if (item.capacity > 0.7) {
        material1 = new THREE.MeshBasicMaterial({
          color: 0xff3030
        }); //材质对象Material
      }

      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      let mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
      let positionY1 =
        (this.cabinetType[item.index].size[2] * item.capacity) / 2;
      let positionY = this.cabinetType[item.index].size[2] / 2;

      mesh.position.set(
        item.position[1] - this.cabinetType[item.index].size[0] / 2,

        item.position[0] + this.cabinetType[item.index].size[1] / 2,
        positionY
      );
      mesh1.position.set(
        item.position[1] - this.cabinetType[item.index].size[0] / 2,

        item.position[0] + this.cabinetType[item.index].size[1] / 2,
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

        this.selectedObject.getWorldPosition(worldVector);
        var standardVector2 = worldVector.project(this.camera);
        var a2 = window.innerWidth / 2;
        var b2 = window.innerHeight / 2;
        var x2 = Math.round(standardVector2.x * a2 + a2); //标准设备坐标转屏幕坐标
        var y2 = Math.round(-standardVector2.y * b2 + b2); //标准设备坐标转屏幕坐标

        this.$refs.menu.style.left = x2 + "px";
        this.$refs.menu.style.top = y2 + "px";
        //这里的130px主要是为了标签和模型有一定偏移，当然也可以不设置，两者叠加在一起
      }
    },
    onDocumentMusedown(ev) {
      if (ev.button === 2) {
        console.log("你点了右键");
        var ev = ev || event;
        ev.preventDefault();
        const self = this;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
          self.listGroup.children
        );
        if (intersects.length > 0) {
          this.selectedObject = intersects[0].object;
          var scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
          this.$refs.menu.style.left = ev.clientX + "px";
          this.$refs.menu.style.top = ev.clientY + scrollTop + "px";
          this.showMenu = true;
          if (!this.transformControls) {
            this.transformControls = new THREE.TransformControls(
              this.camera,
              this.renderer.domElement
            );
            this.transformControls.attach(intersects[0].object);
            this.transformControls.setSpace("local");
            console.log("getMode", this.transformControls);
          }
        } else {
          this.showMenu = false;
        }
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
        if (intersects[0].object.name !== "擎天柱") {
          const geometry = intersects[0].object.geometry;
          const material = intersects[0].object.material;
          const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
          this.scene.updateMatrixWorld(true);
          const worldPosition = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPosition);

          this.methName = intersects[0].object.name;
          this.location = intersects[0].object.dataInfo.location;
          this.occuRate = intersects[0].object.dataInfo.occuRate;
          mesh.position.set(worldPosition.x, worldPosition.y, worldPosition.z); //点光源位置
          this.border = new THREE.BoxHelper(mesh, "#5b78e7"); //设置边框，这个边框不会旋转
          this.border.name = "高亮显示柜";
          this.scene.add(this.border); //网格模型添加到场景中
          var scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
          if (intersects[0].object.name === "列头机架") {
            this.$refs.menu2.style.left = event.clientX + 20 + "px";
            this.$refs.menu2.style.top = event.clientY + scrollTop - 200 + "px";
            this.showMenu2 = true;
            this.showMenu3 = false;
          } else {
            var scrollTop =
              document.documentElement.scrollTop || document.body.scrollTop;
            this.$refs.menu3.style.left = event.clientX - 77 + "px";
            this.$refs.menu3.style.top = event.clientY + scrollTop - 130 + "px";
            this.showMenu3 = true;
            if (!this.freezeShowMenu2) {
              this.showMenu2 = false;
            }
          }
          // 朔源
          if (intersects[0].object.setId === 22) {
            this.scene.add(this.spriteArr);
          } else {
            this.scene.remove(this.spriteArr);
          }
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
        if (this.spriteArr) {
          this.scene.remove(this.spriteArr);
        }
        if (!this.freezeShowMenu2) {
          this.showMenu2 = false;
        }
        this.showMenu3 = false;
        this.showMenu = false;
      }
    },
    setMethPositon() {
      this.scene.add(this.transformControls);
      this.showMenu = false;
    },
    // 创建朔源精灵图标3
    newCSS3DSprite3(name, x, y, z) {
      let canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      let ctx = canvas.getContext("2d");
      let arrText = name;
      ctx.beginPath();
      ctx.fillStyle = "rgba(91, 120, 231, 0.95)";
      // ctx.fillRect(0, 0, width, height);
      ctx.arc(200, 200, 200, 0, 2 * Math.PI);
      // this.drawRoundRect(ctx, 0, 0, width, height, 200);
      ctx.closePath(); //关闭路径
      ctx.fill(); //开始填充
      ctx.font = 160 + 'px " bold';
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(arrText, 200, 200);
      // ctx.strokeStyle = "#0078AA";
      ctx.stroke();

      this.spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas) //设置精灵纹理贴图
      });
      let sprite = new THREE.Sprite(this.spriteMaterial);
      this.spriteArr.add(sprite);
      sprite.scale.set(400, 400, 1); // 只需要设置x、y两个分量就可以
      sprite.position.set(x, y, z);
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
        // console.log(intersects);
        // window.open(
        //   "http://www.yijushch.com/jmrv/www_wmk/#/device-module-details"
        // );
        // this.scene.updateMatrixWorld(true);
        // const worldPosition = new THREE.Vector3();
        // intersects[0].object.getWorldPosition(worldPosition);
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
      // const intersects2 = this.raycaster.intersectObjects(
      //   self.roomModel.children
      // );
      // if (intersects2.length > 0) {
      //   // console.log(intersects2[0]);
      //   if (intersects2[0].object.name.indexOf("右") > -1) {
      //     this.intersects2 = intersects2[0].object;
      //     this.animationMenTop = false;
      //     this.animationZF = !this.animationZF;
      //   } else if (intersects2[0].object.name.indexOf("左") > -1) {
      //     this.intersects3 = intersects2[0].object;
      //     this.animationMenTop2 = false;
      //     this.animationZF2 = !this.animationZF2;
      //   }
      // }
      if (intersects.length && intersects[0].object.name === "列头机架") {
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
    getCabinetType() {
      let self = this;
      // let params = {
      //   url: api2.getFrameList, //获取request_url.js文件的请求路径
      //   method: "GET"
      // };
      // this.sendReq(params, res => {
      //   console.log("获取机柜类型", res);
      //   if (res.respHeader.resultCode === 0) {
      //     self.cabinetType = res.respBody.cabinetType.map(item => {
      //       let items = item;
      //       items.size = [
      //         item.size[0] * 1000,
      //         item.size[1] * 1000,
      //         item.size[2] * 1000
      //       ];
      //       return items;
      //     });
      //     self.cabinetplaced = res.respBody.cabinetList.map(item => {
      //       let items = item;
      //       items.position = [item.posX * 1000, item.posY * 1000];
      //       return items;
      //     });
      //     self.scene.add(obj);
      //     self.setCabinet();
      //   }
      // });
    },
    newMap() {
      this.myChart.clear();
      let option = this.setOption();
      this.myChart.setOption(option);
    },
    // tabbar切换数据
    tabbarActive(index) {
      this.activeIndex = index;
      this.newMap();
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
    }
  },
  watch: {
    selectValue(val) {
      console.log("selectValue", val);
      if (val.length >= 0 && this.floorIndex) {
        if (!this.listGroup.traverse) {
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
  padding-left: 30px;
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
