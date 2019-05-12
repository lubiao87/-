<template>
  <div style="width: 100%;height:100%;">
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <!-- <div id="mainGZ" style="width: 100%;height:100%;" @click="autofocu"></div> -->
    <!-- <div v-show="stops" ref="reference" class="stip-box" :style="{ top:stipY-120 + 'px',left:stipX + 20 + 'px' }">123123</div> -->
  </div>
</template>

<script>
import echarts from "echarts"; // 引入echarts
import "echarts/lib/chart/map";
require("echarts/extension/bmap/bmap");
import GZ_DMQ from "../../components/common/guangzhou";
import dataJson from "../../json/custom_map_config.json";
import imgUrl from "../../assets/common/image/city_platform_rizhi.png";
import { api2 } from "../../api/api"; //api配置请求的路径
import { listSearchMixin } from "../../mixin"; //混淆请求
import * as THREE from "three";
require("three-fbxloader-offical");
import { OrbitControls } from "../../utils/OrbitControls";
// import GKGs from "/static/GKG.GBX";
// import GKGs from "/assets/fbx/GKG.GBX";
// const GKG = require("../../assets/fbx/GKG.GBX");
// import './guangdon.js'
export default {
  name: "olmap",
  props: ["coordinate"],
  mixins: [listSearchMixin],
  data() {
    return {
      // 区域id数据
      regionData: [],
      regionId: "200000000",
      // 机楼图裂大小
      house: [],
      // 机楼定位
      geoCoordMap: {},
      // 地图定位
      bmapGPS: [113.492771, 23.240842],
      myChart: null,
      stipX: 0,
      stipY: 0,
      zoom: 11,
      coordinates: GZ_DMQ
      // stops: false
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  created() {
    // console.log(echarts);
    let self = this;
    // console.log(GKG);
    this.scene = null;
    this.scene = new THREE.Scene(); // 场景
    this.FBXloader = new THREE.FBXLoader(); // fbx加载器
    this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
    this.renderer = new THREE.WebGLRenderer(); // 渲染器
    this.scene.add(this.ambient);
  },
  mounted() {
    this.buildingcount();
    const self = this;
    this.$nextTick(() => {
      self.FBXloader.load("./assets/GKG.FBX", function(param) {
        alert("dg");
        console.log(param);
      });
    });
    //  this.$parent.restaurants = this.$parent.loadAll();
  },
  methods: {
    buildingcount() {
      // console.log()
    },
    loaderObj(obj) {
      console.log(obj);
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
