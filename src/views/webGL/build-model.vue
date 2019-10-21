<template>
  <div
    style="width: 100%;height:100%;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- <input type="flies" src="/Assets/GKG.FBX" ref="mapID" alt="" /> -->
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
      <div>
        <h5 class="ui-city-title ui-height48 none-hover">
          <span class="ui-linebg"></span>功率统计
        </h5>
        <ul class="ui-city-tabbar-ul">
          <li
            class="ui-city-tabbar-li"
            v-for="(item, index) in tabbarData"
            @click="tabbarActive(index)"
            :class="{ 'ui-active': index === activeIndex }"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div id="powerCharts" style="width: 100%;height:100%;"></div>
      </div>
      <!-- 微机楼统计 -->
      <div style="margin-top: 20px;">
        <h5 class="ui-city-title ui-height48 none-hover">
          <span class="ui-linebg"></span>机楼统计
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <div
            v-for="(item, index) in moduleStatistics"
            :key="index"
            class="modal"
            :class="'module' + (index + 1)"
          >
            <div calss="name" style="font-size: 12px;color: #fff;">
              {{ item.name }}
            </div>
            <div class="number">{{ item.value }}</div>
            <div :class="item.class"></div>
          </div>
        </div>
        <!-- <div class="ui-citytol">
          <div class="scroll-wrap fn-mt10 regionName" @click="addMan">
            增加人物
          </div>
          <div class="scroll-wrap fn-mt10 regionName" @click="removeMan">
            删除人物
          </div>
        </div> -->
        <!-- 通用搜索框开始 -->
      </div>

      <div style="margin-top: 20px;">
        <h5
          class="ui-city-title ui-height48"
          @click="showBuilding"
          :class="{ 'select-h': buildId === 100 }"
        >
          <span class="ui-linebg"></span>工业园机楼
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <div class="lb-module-list">
            <ul>
              <li
                v-for="(item, index) in dataList"
                :key="index"
                @click="lookFloor(item, index)"
                :class="{ 'select-li': item.select }"
              >
                <!-- <span>机房:</span> -->
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
import { listSearchMixin } from "../../mixin"; //混淆请求
import * as THREE from "three";
import "three-obj-mtl-loader";
require("three-fbxloader-offical");
import { OrbitControls } from "../../utils/OrbitControls";
import popup from "../../components/popup/popup";
// import { api2 } from "../../api/api"; //api配置请求的路径
// require("../../utils/CSS3DRenderer");
export default {
  name: "olmap",
  props: ["coordinate"],
  mixins: [listSearchMixin],
  components: {
    popup
  },
  data() {
    return {
      buildId: 100,
      propsFlag: false,
      tabbarData: ["直流系统功率", "交流系统功率"],
      barData: [
        { value: 589, name: "未用" },
        { value: 286, name: "已用" },
        { value: 280, name: "预占" }
      ],
      myChart: null,
      activeIndex: 0,
      moduleStatistics: [
        { name: "机房总数", value: 3, class: "right_building" },
        { name: "机柜总数", value: 20, class: "right_module" }
        // {name:"规划微模块数", value:15, class: 'right_planning'},
        // {name:"已交付微模块数", value:150, class: 'right_cabinet'}
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
          name: "一楼001机房",
          id: 111,
          floor: 1
        },
        {
          name: "二楼001机房",
          id: 112,
          floor: 2
        },
        {
          name: "三楼001机房",
          id: 113,
          floor: 3
        },
        {
          name: "四楼001机房",
          id: 114,
          floor: 4
        },
        {
          name: "四楼002机房",
          id: 115,
          floor: 4
        }
      ],
      animationTime: 0,
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
          size: [0.6, 0.24, 2.6], // 长宽高
          index: 4
        },
        {
          name: "空调 - 12个", // 机柜类型
          size: [0.5, 0.5, 1.8], // 长宽高
          index: 5
        },
        {
          name: "列头机架 - 14个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          index: 6
        },
        {
          name: "ODF机架 - 32个", // 机柜类型
          size: [0.6, 0.6, 2.6], // 长宽高
          index: 7
        },
        {
          name: "配线机架 - 12个", // 机柜类型
          size: [0.5, 0.3, 1.8], // 长宽高
          index: 8
        }
      ],
      cabinetPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      cabinetplaced: [
        // 第一排
        {
          index: 6,
          posX: "0",
          posY: "0",
          type: "列头机架",
          name: "HW05-03"
        },
        {
          index: 2,
          posX: "0.9",
          posY: "0",
          type: "标准机架",
          name: "RSS02-02"
        },
        {
          index: 2,
          posX: "1.5",
          posY: "0",
          type: "标准机架",
          name: "RSS01-04"
        },
        {
          index: 2,
          posX: "2.2",
          posY: "0",
          type: "标准机架",
          name: "RSS01-05"
        },
        {
          index: 2,
          posX: "2.9",
          posY: "0",
          type: "标准机架",
          name: "RSS01-01"
        },
        {
          index: 2,
          posX: "3.5",
          posY: "0",
          type: "标准机架",
          name: "RSS01-03"
        },
        {
          index: 2,
          posX: "4.1",
          posY: "0",
          type: "标准机架",
          name: "RSS01-02"
        },

        {
          index: 2,
          posX: "8.6",
          posY: "0",
          type: "标准机架",
          name: "RSS02-01"
        },
        { index: 2, posX: "9.2", posY: "0", type: "标准机架", name: "ZTE03" },
        { index: 2, posX: "9.8", posY: "0", type: "标准机架", name: "HW05-03" },
        {
          index: 2,
          posX: "10.4",
          posY: "0",
          type: "标准机架",
          name: "HW05-03"
        },
        { index: 2, posX: "11", posY: "0", type: "标准机架", name: "HW05-03" },
        {
          index: 2,
          posX: "11.6",
          posY: "0",
          type: "标准机架",
          name: "HW05-03"
        },
        {
          index: 6,
          posX: "12.25",
          posY: "0",
          type: "列头机架",
          name: "HW05-03"
        },

        // 第二排
        {
          index: 6,
          posX: "0",
          posY: "2.4",
          type: "列头机架",
          name: "DDF01-03"
        },
        {
          index: 4,
          posX: "0.6",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF02-01"
        },
        {
          index: 4,
          posX: "0.9",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-02"
        },
        {
          index: 4,
          posX: "1.2",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-01"
        },
        {
          index: 4,
          posX: "1.5",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-04"
        },
        {
          index: 4,
          posX: "1.8",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-05"
        },
        {
          index: 4,
          posX: "2.1",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-06"
        },
        {
          index: 4,
          posX: "2.4",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-07"
        },
        {
          index: 4,
          posX: "2.7",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-08"
        },
        {
          index: 4,
          posX: "3",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-09"
        },
        {
          index: 4,
          posX: "3.3",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-10"
        },
        {
          index: 4,
          posX: "3.6",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-11"
        },
        {
          index: 4,
          posX: "3.9",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-12"
        },
        {
          index: 4,
          posX: "4.2",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-13"
        },
        {
          index: 4,
          posX: "4.5",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-14"
        },
        {
          index: 4,
          posX: "4.8",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-15"
        },
        {
          index: 4,
          posX: "5.1",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-16"
        },
        {
          index: 4,
          posX: "5.4",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-17"
        },
        {
          index: 4,
          posX: "5.7",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-18"
        },
        {
          index: 4,
          posX: "6",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-19"
        },
        {
          index: 4,
          posX: "6.3",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-20"
        },
        {
          index: 4,
          posX: "6.6",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-21"
        },
        {
          index: 4,
          posX: "6.9",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-22"
        },
        {
          index: 4,
          posX: "7.2",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-21"
        },
        {
          index: 4,
          posX: "7.5",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-22"
        },
        {
          index: 4,
          posX: "7.8",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-23"
        },
        {
          index: 4,
          posX: "8.1",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-24"
        },
        {
          index: 4,
          posX: "8.4",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-25"
        },
        {
          index: 4,
          posX: "8.7",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-26"
        },
        {
          index: 4,
          posX: "9",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-27"
        },
        {
          index: 4,
          posX: "9.3",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-28"
        },
        {
          index: 4,
          posX: "9.6",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-28"
        },
        {
          index: 4,
          posX: "9.9",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-29"
        },
        {
          index: 4,
          posX: "10.2",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-30"
        },
        {
          index: 4,
          posX: "10.5",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-31"
        },
        {
          index: 4,
          posX: "10.8",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-32"
        },
        {
          index: 4,
          posX: "11.1",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-33"
        },
        {
          index: 4,
          posX: "11.4",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-36"
        },
        {
          index: 4,
          posX: "11.7",
          posY: "2.2",
          type: "DDF机架",
          name: "DDF03-37"
        },
        {
          index: 6,
          posX: "12.3",
          posY: "2.4",
          type: "列头机架",
          name: "DDF03-37"
        },
        // 第三排
        {
          index: 4,
          posX: "0.6",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF02-07"
        },
        {
          index: 4,
          posX: "0.9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-08"
        },
        {
          index: 4,
          posX: "1.2",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-09"
        },
        {
          index: 4,
          posX: "1.5",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-11"
        },
        {
          index: 4,
          posX: "1.8",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-12"
        },
        {
          index: 4,
          posX: "2.1",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-13"
        },
        {
          index: 4,
          posX: "2.4",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-14"
        },
        {
          index: 4,
          posX: "2.7",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-15"
        },
        {
          index: 4,
          posX: "3",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-16"
        },
        {
          index: 4,
          posX: "3.3",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-17"
        },
        {
          index: 4,
          posX: "3.6",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-18"
        },
        {
          index: 4,
          posX: "3.9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-19"
        },
        {
          index: 4,
          posX: "4.2",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-20"
        },
        {
          index: 4,
          posX: "4.5",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-21"
        },
        {
          index: 4,
          posX: "4.8",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-22"
        },
        {
          index: 4,
          posX: "5.1",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-23"
        },
        {
          index: 4,
          posX: "5.4",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-24"
        },
        {
          index: 4,
          posX: "5.7",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-25"
        },
        {
          index: 4,
          posX: "6",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-26"
        },
        {
          index: 4,
          posX: "6.3",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-27"
        },
        {
          index: 4,
          posX: "6.6",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-28"
        },
        {
          index: 4,
          posX: "6.9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-29"
        },
        {
          index: 4,
          posX: "7.2",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-30"
        },
        {
          index: 4,
          posX: "7.5",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-31"
        },
        {
          index: 4,
          posX: "7.8",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-32"
        },
        {
          index: 4,
          posX: "8.1",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-33"
        },
        {
          index: 4,
          posX: "8.4",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-34"
        },
        {
          index: 4,
          posX: "8.7",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-35"
        },
        {
          index: 4,
          posX: "9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-36"
        },
        {
          index: 4,
          posX: "9.3",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-36"
        },
        {
          index: 4,
          posX: "9.6",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-37"
        },
        {
          index: 4,
          posX: "9.9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-38"
        },
        {
          index: 4,
          posX: "9.9",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-39"
        },
        {
          index: 4,
          posX: "10.2",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-40"
        },
        {
          index: 4,
          posX: "10.5",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-41"
        },
        {
          index: 4,
          posX: "10.8",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-42"
        },
        {
          index: 4,
          posX: "11.1",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-43"
        },
        {
          index: 4,
          posX: "11.4",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-44"
        },
        {
          index: 4,
          posX: "11.7",
          posY: "2.6",
          type: "DDF机架",
          name: "DDF03-45"
        },

        // 第四排
        {
          index: 6,
          posX: "0",
          posY: "4.0",
          type: "列头机架",
          name: "DDF03-04"
        },
        {
          index: 5,
          posX: "0.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-04"
        },
        {
          index: 5,
          posX: "1.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-05"
        },
        {
          index: 5,
          posX: "1.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-06"
        },
        {
          index: 5,
          posX: "2.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-07"
        },
        {
          index: 5,
          posX: "2.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-08"
        },
        {
          index: 5,
          posX: "3.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-09"
        },
        {
          index: 5,
          posX: "3.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-10"
        },
        {
          index: 5,
          posX: "4.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-11"
        },
        {
          index: 5,
          posX: "4.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-12"
        },
        {
          index: 5,
          posX: "5.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-13"
        },
        {
          index: 5,
          posX: "5.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-14"
        },
        {
          index: 5,
          posX: "6.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-15"
        },
        {
          index: 5,
          posX: "6.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-16"
        },
        {
          index: 5,
          posX: "7.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-17"
        },
        {
          index: 5,
          posX: "7.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-18"
        },
        {
          index: 5,
          posX: "8.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-19"
        },
        {
          index: 5,
          posX: "8.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-20"
        },
        {
          index: 5,
          posX: "9.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-21"
        },
        {
          index: 5,
          posX: "9.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-22"
        },
        {
          index: 5,
          posX: "10.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-23"
        },
        {
          index: 5,
          posX: "10.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-24"
        },
        {
          index: 5,
          posX: "11.1",
          posY: "4.0",
          type: "空调",
          name: "DDF03-25"
        },
        {
          index: 5,
          posX: "11.6",
          posY: "4.0",
          type: "空调",
          name: "DDF03-26"
        },
        {
          index: 6,
          posX: "12.2",
          posY: "4.0",
          type: "列头机架",
          name: "DDF03-27"
        },

        // 第五排
        {
          index: 6,
          posX: "0",
          posY: "6.0",
          type: "列头机架",
          name: "ZTE-01"
        },
        {
          index: 7,
          posX: "0.85",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-02"
        },
        {
          index: 7,
          posX: "1.7",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-03"
        },
        {
          index: 7,
          posX: "2.55",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-04"
        },
        {
          index: 7,
          posX: "3.4",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-05"
        },
        {
          index: 7,
          posX: "4.25",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-06"
        },
        {
          index: 7,
          posX: "5.1",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-07"
        },
        {
          index: 7,
          posX: "5.95",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-08"
        },
        {
          index: 7,
          posX: "6.8",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-09"
        },
        {
          index: 7,
          posX: "7.65",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-10"
        },
        {
          index: 7,
          posX: "8.4",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-10"
        },
        {
          index: 7,
          posX: "9.25",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-11"
        },
        {
          index: 7,
          posX: "10.1",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-12"
        },
        {
          index: 7,
          posX: "10.95",
          posY: "6.0",
          type: "ODF机架",
          name: "ODF-13"
        },
        {
          index: 6,
          posX: "11.8",
          posY: "6.0",
          type: "配线机架",
          name: "ZTE-23"
        },
        // 第六排
        {
          index: 6,
          posX: "0",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-01"
        },
        {
          index: 8,
          posX: "0.6",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-02"
        },
        {
          index: 8,
          posX: "1.2",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-03"
        },
        {
          index: 8,
          posX: "1.8",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-04"
        },
        {
          index: 8,
          posX: "2.4",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-05"
        },
        {
          index: 8,
          posX: "3",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-06"
        },
        {
          index: 8,
          posX: "3.6",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-07"
        },
        {
          index: 8,
          posX: "4.2",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-08"
        },
        {
          index: 8,
          posX: "4.8",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-09"
        },

        {
          index: 8,
          posX: "6.6",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-13"
        },
        {
          index: 8,
          posX: "7.2",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-14"
        },
        {
          index: 8,
          posX: "7.8",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-15"
        },
        {
          index: 8,
          posX: "8.4",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-16"
        },
        {
          index: 8,
          posX: "9",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-17"
        },
        {
          index: 8,
          posX: "9.6",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-19"
        },
        {
          index: 8,
          posX: "10.2",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-20"
        },
        {
          index: 8,
          posX: "10.8",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-21"
        },
        {
          index: 8,
          posX: "11.4",
          posY: "8.0",
          type: "配线机架",
          name: "ZTE-22"
        },
        {
          index: 6,
          posX: "12",
          posY: "8.0",
          type: "列头机架",
          name: "ZTE-23"
        },

        // 第七排
        {
          index: 6,
          posX: "0",
          posY: "10",
          type: "列头机架",
          name: "第七直列001/天河工业园整流模块01",
          setId: 22
        },
        {
          index: 1,
          posX: "0.6",
          posY: "10",
          type: "标准机架",
          name: "RSS02-02",
          parentId: 22
        },
        {
          index: 1,
          posX: "1.2",
          posY: "10",
          type: "标准机架",
          name: "RSS02-03",
          parentId: 22
        },
        {
          index: 1,
          posX: "1.8",
          posY: "10",
          type: "标准机架",
          name: "RSS02-04",
          parentId: 22
        },
        {
          index: 1,
          posX: "2.4",
          posY: "10",
          type: "标准机架",
          name: "RSS02-05",
          parentId: 22
        },
        {
          index: 1,
          posX: "3",
          posY: "10",
          type: "标准机架",
          name: "RSS02-06",
          parentId: 22
        },
        {
          index: 1,
          posX: "3.6",
          posY: "10",
          type: "标准机架",
          name: "RSS02-07",
          parentId: 22
        },
        {
          index: 1,
          posX: "4.2",
          posY: "10",
          type: "标准机架",
          name: "RSS02-08"
        },
        {
          index: 1,
          posX: "4.8",
          posY: "10",
          type: "标准机架",
          name: "RSS02-09"
        },
        {
          index: 1,
          posX: "5.4",
          posY: "10",
          type: "标准机架",
          name: "RSS02-10"
        },
        {
          index: 1,
          posX: "6",
          posY: "10",
          type: "标准机架",
          name: "RSS02-11"
        },
        {
          index: 1,
          posX: "6.6",
          posY: "10",
          type: "标准机架",
          name: "RSS02-12"
        },
        {
          index: 1,
          posX: "7.2",
          posY: "10",
          type: "标准机架",
          name: "RSS02-13"
        },
        {
          index: 1,
          posX: "7.8",
          posY: "10",
          type: "标准机架",
          name: "RSS02-14"
        },
        {
          index: 1,
          posX: "8.4",
          posY: "10",
          type: "标准机架",
          name: "RSS02-15"
        },
        {
          index: 1,
          posX: "9",
          posY: "10",
          type: "标准机架",
          name: "RSS02-16"
        },
        {
          index: 1,
          posX: "9.6",
          posY: "10",
          type: "标准机架",
          name: "RSS02-17"
        },
        {
          index: 1,
          posX: "10.2",
          posY: "10",
          type: "标准机架",
          name: "RSS02-18"
        },
        {
          index: 1,
          posX: "10.8",
          posY: "10",
          type: "标准机架",
          name: "RSS02-19"
        },
        {
          index: 1,
          posX: "11.4",
          posY: "10",
          type: "标准机架",
          name: "RSS02-20"
        },
        {
          index: 6,
          posX: "12",
          posY: "10",
          type: "列头机架",
          name: "RSS02-21"
        },
        // 第八排
        {
          index: 6,
          posX: "0",
          posY: "12",
          type: "列头机架",
          name: "RSS02-01"
        },
        {
          index: 3,
          posX: "0.6",
          posY: "12",
          type: "标准机架",
          name: "RSS02-02"
        },
        {
          index: 3,
          posX: "1.2",
          posY: "12",
          type: "标准机架",
          name: "RSS02-03"
        },
        {
          index: 3,
          posX: "1.8",
          posY: "12",
          type: "标准机架",
          name: "RSS02-04"
        },
        {
          index: 3,
          posX: "2.4",
          posY: "12",
          type: "标准机架",
          name: "RSS02-06"
        },
        {
          index: 3,
          posX: "3",
          posY: "12",
          type: "标准机架",
          name: "RSS02-07"
        },
        {
          index: 3,
          posX: "3.6",
          posY: "12",
          type: "标准机架",
          name: "RSS02-08"
        },
        {
          index: 3,
          posX: "4.2",
          posY: "12",
          type: "标准机架",
          name: "RSS02-09"
        },
        {
          index: 3,
          posX: "4.8",
          posY: "12",
          type: "标准机架",
          name: "RSS02-10"
        },
        {
          index: 3,
          posX: "5.4",
          posY: "12",
          type: "标准机架",
          name: "RSS02-11"
        },
        {
          index: 3,
          posX: "6",
          posY: "12",
          type: "标准机架",
          name: "RSS02-12"
        },
        {
          index: 3,
          posX: "6.6",
          posY: "12",
          type: "标准机架",
          name: "RSS02-13"
        },
        {
          index: 3,
          posX: "7.2",
          posY: "12",
          type: "标准机架",
          name: "RSS02-14"
        },
        {
          index: 3,
          posX: "7.8",
          posY: "12",
          type: "标准机架",
          name: "RSS02-15"
        },
        {
          index: 3,
          posX: "8.4",
          posY: "12",
          type: "标准机架",
          name: "RSS02-16"
        },
        {
          index: 3,
          posX: "9",
          posY: "12",
          type: "标准机架",
          name: "RSS02-16"
        },
        {
          index: 3,
          posX: "9.6",
          posY: "12",
          type: "标准机架",
          name: "RSS02-17"
        },
        {
          index: 3,
          posX: "10.2",
          posY: "12",
          type: "标准机架",
          name: "RSS02-18"
        },
        {
          index: 3,
          posX: "10.8",
          posY: "12",
          type: "标准机架",
          name: "RSS02-19"
        },
        {
          index: 3,
          posX: "11.4",
          posY: "12",
          type: "标准机架",
          name: "RSS02-20"
        },
        {
          index: 6,
          posX: "12",
          posY: "12",
          type: "列头机架",
          name: "RSS02-21"
        }
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
    createHtml() {
      const self = this;
      // console.log(GKG);
      this.scene = null;
      this.scene = new THREE.Scene(); // 场景
      this.FBXloader = new THREE.FBXLoader(); // fbx加载器
      this.Objloader = new THREE.OBJLoader();
      // this.Objloader.load("./Assets/obj/dog.obj", self.loaderDog);
      this.FBXloader.load("./Assets/fbx/building.FBX", self.loaderObj);
      // this.FBXloader.load("./Assets/fbx/SambaDancing.FBX", self.loaderMan);
      this.FBXloader.load("./Assets/fbx/1.FBX", self.loaderCabinet1);
      this.FBXloader.load("./Assets/fbx/2.FBX", self.loaderCabinet2);
      this.FBXloader.load("./Assets/fbx/3.FBX", self.loaderCabinet3);
      this.FBXloader.load("./Assets/fbx/DDF.FBX", self.loaderDDF);
      this.FBXloader.load("./Assets/fbx/kongtiao.FBX", self.loaderKongtiao);
      this.FBXloader.load("./Assets/fbx/lietou.FBX", self.loaderLieTou);
      this.FBXloader.load("./Assets/fbx/ODF.FBX", self.loaderODF);
      this.FBXloader.load("./Assets/fbx/peixian.FBX", self.loaderPeixian);
      // this.FBXloader.load("./Assets/fbx/dog.FBX", self.loaderDog);
      // this.FBXloader.load("./Assets/fbx/floorTwo.FBX", self.loaderFloor2);
      // this.FBXloader.load("./Assets/fbx/floorThree.FBX", self.loaderFloor3);
      this.FBXloader.load("./Assets/fbx/floorFour.FBX", self.loaderFloor4);
      this.FBXloader.load("./Assets/fbx/air.FBX", self.loaderAir);
      this.FBXloader.load("./Assets/fbx/device1.FBX", self.loaderDevice1);
      this.FBXloader.load("./Assets/fbx/device2.FBX", self.loaderDevice2);
      this.FBXloader.load("./Assets/fbx/device3.FBX", self.loaderDevice3);
      this.FBXloader.load("./Assets/fbx/device4.FBX", self.loaderDevice4);
      this.FBXloader.load("./Assets/fbx/jigui.FBX", self.loaderJIGUI);
      this.FBXloader.load("./Assets/fbx/guankonggui.FBX", self.loaderGKG);
      this.ambient = new THREE.AmbientLight(0xffffff); // 环境光
      this.renderer = new THREE.WebGLRenderer(); // 渲染器
      this.scene.add(this.ambient);
      this.clock = new THREE.Clock();
      this.setCamera();

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
      this.SpotLight = new THREE.SpotLight("#fff", 0.6);
      this.SpotLight.castShadow = true;
      this.SpotLight.shadowCameraVisible = true;
      this.SpotLight.position.set(20000, 40000, 0);
      //设置阴影贴图精度
      // this.SpotLight.shadowMapWidth = this.SpotLight.shadowMapHeight = 1024;
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
      // this.scene.add(this.axisHelper);

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
    loaderFloor4(obj) {
      this.FloorOne = obj;
      this.FloorTwo = obj;
      this.FloorThree = obj;
      this.FloorFour = obj;
    },
    // 够
    loaderDog(obj) {
      console.log("加载单身狗", obj);
      obj.translateX(5000);
      //加载纹理贴图
      // var texture = new THREE.TextureLoader().load(
      //   "./Assets/img/DiffuseFace.jpg"
      // );
      // // 基础Basic网格材质，不受光照影响   Phong网格材质受光照影响
      // obj.children[0].material = new THREE.MeshBasicMaterial({
      //   map: texture //设置颜色纹理贴图
      // });
      // obj.scale.set(15, 15, 15);
      // obj.children[0].scale.set(5, 5, 5); //网格模型缩放
      this.scene.add(obj);
    },
    // 4
    loaderDDF(obj) {
      this.DDF = obj;
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
    loaderJIGUI(obj) {
      // obj.children[0].material[0].color.set("#1e222b"); // 设置材质颜色
      this.JIGUI = obj;
      this.JIGUI.name = "机柜类型all";
      // this.scene.add(this.JIGUI);
    },
    loaderGKG(obj) {
      // obj.children[0].material[0].color.set("#1e222b"); // 设置材质颜色
      this.GKGModel = obj;
      this.GKGModel.name = "机柜类型j";
      // this.scene.add(this.GKGModel);
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
          // console.log(this.cameraX);
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
    lookFloor(item, index) {
      // 查看楼层
      if (!this.lookAround) {
        this.floorIndex = item.floor;
        this.animationFlag = true;
        this.buildId = item.id;
        this.dataList.forEach((items, i, arr) => {
          arr[i].select = false;
        });
        this.dataList[index].select = true;
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
      self.scene.remove(this.JIGUI);
    },
    removeMan() {
      // 删除人物
      if (this.scene.getObjectByName("跳舞人")) {
        this.scene.remove(this.personPre);
      }
    },
    showBuilding() {
      if (this.buildId === 100) {
        return;
      }
      if (!this.lookAround) {
        // 动画中禁止事件
        this.addBuilding();
        this.floorIndex = -1;
        this.animationFlag = false;
        this.animationTime = Date.now();
        this.lookAround = true; // 开启动画
        // console.log(this.scene)
        this.selectValue = ["全部"];
        this.dataList.forEach((items, i, arr) => {
          arr[i].select = false;
        });
        this.buildId = 100;
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
        // mesh.rotateY(-Math.PI / 2);
        // mesh.rotateY90 = true;
      } else if (item.index === 3) {
        geometry = this.cabinet3.children[0].geometry;
        material = this.cabinet3.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      } else if (item.index === 4) {
        geometry = this.DDF.children[0].geometry;
        material = this.DDF.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      } else if (item.index === 5) {
        geometry = this.kongtiao.children[0].geometry;
        material = this.kongtiao.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      } else if (item.index === 6) {
        geometry = this.lietou.children[0].geometry;
        material = this.lietou.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      } else if (item.index === 7) {
        geometry = this.ODF.children[0].geometry;
        material = this.ODF.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      } else if (item.index === 8) {
        geometry = this.peixian.children[0].geometry;
        material = this.peixian.children[0].material;
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.rotateY(-Math.PI / 2);
      }
      mesh.rotateX(-Math.PI / 2);
      // let positionY = -2700
      // if (this.cabinetType[item.index].size[2] < 2500) {
      let positionY = -2700 + (this.cabinetType[item.index].size[2] - 2500) / 2;
      // }
      mesh.position.set(
        -item.position[1] + 11200,
        positionY,
        item.position[0] + 2300
      );
      // mesh.position.z = item.position[1]
      mesh.TYPE = this.cabinetType[item.index].name;
      mesh.name = item.name;
      if (item.parentId) {
        mesh.parentId = item.parentId;
        // 创建精灵图标
        this.newCSS3DSprite3(
          "子",
          -item.position[1] + 11200,
          positionY + 1600,
          item.position[0] + 2300
        );
      }
      if (item.setId) {
        mesh.setId = item.setId;
      }
      return mesh;
    },
    setCabinet() {
      const self = this;
      // if (!this.listGroup) {
      this.listGroup = new THREE.Group();
      this.listGroup.name = "设备集合";
      // this.listGroup.material.transparent = true
      // this.listGroup.material.opacity = 0
      // this.borderGroup = new THREE.Group();
      this.spriteArr = new THREE.Group();
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
      self.renderer.domElement.removeEventListener("dblclick", null);
      self.renderer.domElement.addEventListener(
        "mousemove",
        self.onDocumentMouseMove,
        false
      );
      self.renderer.domElement.addEventListener(
        "dblclick",
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
        if (intersects[0].object.name !== "擎天柱") {
          const geometry = intersects[0].object.geometry;
          const material = intersects[0].object.material;
          const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
          this.scene.updateMatrixWorld(true);
          const worldPosition = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPosition);
          // console.log('世界坐标',worldPosition);
          // console.log("intersects[0].object", intersects[0].object);
          mesh.position.set(worldPosition.x, worldPosition.y, worldPosition.z); //点光源位置
          // if (intersects[0].object.rotateY90) {
          //   mesh.rotateY(-Math.PI / 2);
          // }
          mesh.rotateX(-Math.PI / 2);
          this.border = new THREE.BoxHelper(mesh, "#e54949"); //设置边框，这个边框不会旋转
          this.border.name = "高亮显示柜";
          this.scene.add(this.border); //网格模型添加到场景中
          // 创建精灵图标
          this.newCSS3DSprite(
            intersects,
            worldPosition.x,
            worldPosition.y + 2800,
            worldPosition.z
          );
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
      }
    },
    // 创建精灵图标
    newCSS3DSprite(obj, x, y, z) {
      let arrText = obj[0].object.name;
      let splitText = arrText.split("/");
      let width = 3000,
        height = splitText.length * 500 + 500;
      splitText.forEach(item => {
        if (item.length > 8) {
          width = 4000;
        }
      });

      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, width, height);
      // this.drawRoundRect(ctx, 0, 0, width, height, 200);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      splitText.forEach((item, index) => {
        ctx.font = 320 + 'px " bold';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item, width / 2, (index + 1) * 500);
      });
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
      this.sprite.scale.set(width, height, 1); // 只需要设置x、y两个分量就可以
      this.sprite.position.set(x, y, z);
    },
    // 创建精灵图标3
    newCSS3DSprite3(name, x, y, z) {
      // let width = 2000,
      //   height = 800;
      let canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      let ctx = canvas.getContext("2d");
      let arrText = name;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
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
      cxt.closePath();
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
        // console.log("undefined");
      }
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
      self.setCabinet();
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
          data: ["未用", "已用", "预占", "规划"],
          textStyle: {
            //图例文字的样式
            color: ["#13A86E", "#7B91FF", "#35a0e4", "#E5A73B"],
            fontSize: 12
          },
          formatter: function(params) {
            for (var i = 0; i < option.series[0].data.length; i++) {
              if (option.series[0].data[i].name == params) {
                return params + " " + option.series[0].data[i].value + "KW";
              }
            }
          }
        },
        color: ["#13A86E", "#6B7FE3", "#35a0e4", "#E5A73B"],
        series: [
          {
            name: "功率统计",
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
            itemStyle: {
              // 此配置
              normal: {
                borderWidth: 3,
                borderColor: "rgba(28, 50, 76, 0.9)"
              },
              emphasis: {
                borderWidth: 0
              }
            },
            data: $this.barData
          }
        ]
      };
      return option;
    }
  },
  watch: {
    buildId(val) {
      // console.log(val)
      if (this.floorIndex < 0) return;
      const self = this;
      this.removeMan();
      this.removeObjAll();
      this.addBuilding();
      this.animationTime = Date.now();
      this.lookAround = true;
      switch (this.floorIndex) {
        case 1:
          self.scene.add(self.FloorOne);
          this.FloorOne.position.y = -16000;
          break;
        case 2:
          self.scene.add(self.FloorTwo);
          this.FloorOne.position.y = -12000;
          break;
        case 3:
          self.scene.add(self.FloorThree);
          this.FloorOne.position.y = -8000;
          break;
        case 4:
          self.scene.add(self.FloorFour);
          this.FloorOne.position.y = -4000;

          break;

        default:
          break;
      }
      self.listGroup = {};
      if (val === 114) {
        self.getCabinetType(); // 对接口
      }
      // console.log(this.scene)
    },
    selectValue(val) {
      console.log("selectValue", val);
      if (val.length >= 0 && this.floorIndex) {
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
.el-select__tags {
  max-width: 440px !important;
}
</style>
<style scoped>
.hide {
  display: none;
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
  font-size: 24px;
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
  top: 100px;
  left: 50px;
  min-width: 240px;
}
.ui-city-tabbar-ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;
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
  width: 49%;
  margin-right: 12px;
  cursor: pointer;
}
.ui-city-tabbar-li:last-child {
  margin-right: 0;
}
.ui-active {
  background: #7187f0;
  border: 0;
}
</style>
