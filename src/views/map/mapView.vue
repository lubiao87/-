<template>
  <div style="width: 100%;height:100%;">
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <div id="mainGZ" style="width: 100%;height:100%;"></div>
    <!-- 右边收缩栏开始 -->
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
    <!-- <div v-show="stops" ref="reference" class="stip-box" :style="{ top:stipY-120 + 'px',left:stipX + 20 + 'px' }">123123</div> -->
  </div>
</template>

<script>
import echarts from "echarts"; // 引入echarts
import "echarts/lib/chart/map";
require("echarts/extension/bmap/bmap");
import GZ_DMQ from "../../components/common/guangzhou";
import dataJson from "../../json/custom_map_config.json";
// import imgUrl from "../../assets/common/image/city_platform_rizhi.png";
// import { api2 } from "../../api/api"; //api配置请求的路径
import { listSearchMixin } from "../../mixin"; //混淆请求
// import * as THREE from "three";
require("three-fbxloader-offical");
// import { OrbitControls } from "../../utils/OrbitControls";
// import './guangdon.js'
export default {
  name: "olmap",
  props: ["coordinate"],
  mixins: [listSearchMixin],
  data() {
    return {
      // 机楼定位
      geoCoordMap: {},
      // 地图定位
      bmapGPS: [113.324321, 23.132146],
      myChart: null,
      coordinates: GZ_DMQ,
      myChart: null,
      panelShow: true,
      lines: [
        {
          coords: [
            [113.324321, 23.132146],
            [113.340131, 23.132146],
            [113.339844, 23.144641],
            [113.339844, 23.153945],
            [113.350767, 23.157933],
            [113.353067, 23.152882],
            [113.353354, 23.143844],
            [113.353642, 23.134804],
            [113.353642, 23.132146],
            [113.370602, 23.13188],
            [113.375201, 23.136134],
            [113.377788, 23.136134],
            [113.378075, 23.128689],
            [113.377788, 23.119649],
            [113.371176, 23.122308],
            [113.367727, 23.123106],
            [113.357379, 23.123372],
            [113.355366, 23.12284],
            [113.354504, 23.123106],
            [113.354216, 23.072046],
            [113.346455, 23.050233],
            [113.343293, 23.071514],
            [113.340706, 23.122574],
            [113.324896, 23.124169],
            [113.317997, 23.122042],
            [113.318284, 23.13507],
            [113.324321, 23.132146]
          ]
        }
      ]
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
    const self = this;
    // console.log(GKG);
    // this.scene = null;
    // this.scene = new THREE.Scene(); // 场景
    // this.FBXloader = new THREE.FBXLoader(); // fbx加载器
    // this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
    // this.renderer = new THREE.WebGLRenderer(); // 渲染器
    // this.scene.add(this.ambient);
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      // self.FBXloader.load("./assets/GKG.FBX", function(param) {
      //   alert("dg");
      //   console.log(param);
      // });
      self.myChart = echarts.init(document.getElementById("mainGZ"));
      self.newCharts();
      window.onresize = function(){
          self.myChart.resize();
      }
    });
    //  this.$parent.restaurants = this.$parent.loadAll();
  },
  methods: {
    newCharts() {
      this.myChart.clear();
      let option = this.setOption();
      this.myChart.setOption(option);
    },
    setOption() {
      let option = null;
      const self = this;
      option = {
        bmap: {
          center: self.bmapGPS,
          zoom: 13,
          roam: true,
          mapStyle: {
            styleJson: dataJson
          }
        },
        series: [
          {
            type: "lines",
            coordinateSystem: "bmap",
            data: self.lines,
            polyline: true,
            lineStyle: {
              normal: {
                color: "purple",
                opacity: 0.6,
                width: 5
              }
            }
          }
        ]
      };
      return option;
    }
    // loaderObj(obj) {
    //   console.log(obj);
    // }
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
