<template>
  <div style="width: 100%;height:100%;">
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <div
      id="cesiumContainer"
      class="cesiumContainer"
      style="position:absolute; top: 0; width: 100%;height:100%;"
    ></div>
    <!-- v-show="!panelFlag" -->
    <!-- <div
      id="cesiumContainer2"
      class="cesiumContainer2"
      ref="cesiumContainer2"
      style="position:absolute; top: 0; width: 100%;height:100%;"
      v-show="panelFlag"
    ></div> -->
    <el-select
      class="model-select"
      v-model="selectValue"
      placeholder="请选择"
      v-show="panelFlag"
    >
      <el-option
        v-for="item in areas"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <!-- 右边收缩栏开始 -->
    <div
      class="ui-shrinkBar"
      v-bind:class="{ 'ui-shrinkBar-right': panelShow }"
      v-show="panelFlag"
    >
      <div
        @click="panelShow = !panelShow"
        class="ui-shrinkBar-close"
        v-bind:class="{
          'ui-shrinkBar-open': panelShow,
          'ui-shrinkBar-close': !panelShow
        }"
      ></div>
      <!-- <div class="ui-citytol">
          <h5 class="ui-city-title"><span class="icon-location"></span> 当前区域</h5>
          <div class="scroll-wrap fn-mt10 regionName">
            {{selectValueName}}
          </div>
        </div> -->
      <!-- 微机楼统计 -->
      <div style="margin-top: 20px;">
        <h5 class="ui-city-title ui-height48">
          <span class="ui-linebg"></span>接入间统计
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <div
            v-for="(item, index) in moduleStatistics"
            :key="index"
            class="modal"
            :class="'module'"
          >
            <div calss="name" style="font-size: 12px;color: #fff;">
              {{ item.name }}
            </div>
            <div class="number">{{ item.value }}</div>
            <div :class="item.class"></div>
          </div>
        </div>
      </div>

      <!-- 接入间列表 -->
      <div style="margin-top: 20px; ">
        <h5 class="ui-city-title ui-height48">
          <span class="ui-linebg"></span>接入间列表
        </h5>
        <div class="clearfix module-statis" style="padding-left: 0;">
          <!-- <el-autocomplete
            popper-class="my-autocomplete"
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入机楼"
            @select="handleSelect"
          >
            <i
              class="el-icon-circle-close el-input__icon"
              slot="suffix"
              @click="handleIconClick"
            >
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.modelName }}</div>
            </template>
          </el-autocomplete> -->
          <div class="lb-module-list page-index" style="margin-top: 12px;">
            <ul>
              <!-- <li
                v-for="(items, index) in modelData"
                :key="index"
                @click="rountGo(items)"
              >
                <span>{{ index + 1 }}. </span>
                <span>{{ items.modelName }}</span>
                <span class="lb-icon"></span>
              </li> -->
              <li
                @click="rountGo(modelData[0])"
                @dblclick="liClick(modelData[0].iconLocation[0])"
              >
                美林花园接入间
              </li>
              <li
                @click="rountGo(modelData[0])"
                @dblclick="liClick(modelData[0].iconLocation[1])"
              >
                棠下荷光路接入间
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="yhui-real-timeimg"></div>
    </div>
    <!-- 右边收缩栏结束 -->
    <!-- <div class="menu" v-show="showMenu" ref="menu">
      <ul>
        <li @mouseover="mapMousemoveLi" @mouseleave="mapMοuseοutLi()" :data="3">
          5G BBU <span>3</span>
        </li>

        <li @mouseover="mapMousemoveLi" @mouseleave="mapMοuseοutLi()" :data="1">
          综合接入间 <span>1</span>
        </li>
        <li>其它 <span>0</span></li>
      </ul>
      <div class="close-btn" @click="hineMenuFn" v-show="MarkerClick">X</div>
      <div class="jianTou"></div>
    </div> -->
  </div>
</template>

<script>
// import { listSearchMixin } from "../../mixin"; //混淆请求
// 局部组件引用
import Cesium from "cesium/Cesium";
// noinspection ES6UnusedImports
import widget from "cesium/Widgets/widgets.css";
export default {
  name: "olmap2",
  props: ["coordinate"],
  // mixins: [listSearchMixin],
  data() {
    return {
      restaurants: [],
      state: "",
      // showMenu: false,
      MarkerClick: false,
      modelData: [
        {
          modelName: "工业园机楼",
          iconLocation: [
            {
              location: ["113.377468854055", "23.114265554063"],
              name: "美林花园接入间",
              buildId: 114102
            },
            {
              location: ["113.386872581306", "23.1477018208333"],
              name: "棠下荷光路接入间",
              buildId: 114101
            }
          ],
          modeLocation: ["113.366016977858", "23.1274220838625"]
        }
      ],
      moduleStatistics: [
        { name: "机楼数", value: 132, class: "right_building" },
        { name: "接入间数", value: 2837, class: "right_module" },
        // { name: "核心DC数", value: 15, class: "right_planning" },
        // { name: "接入局所数", value: 150, class: "right_cabinet" },
        { name: "空间利用率", value: "30%", class: "right_mokuai" },
        {
          name: "功率利用率",
          value: "63%",
          class: "right_delivery"
        }
      ],
      panelShow: true,
      item: {
        path: "buildModel",
        query: {
          id: 123
        }
      },

      panelFlag: false,
      district: null,
      polygons: [],
      selectValue: "440100",
      selectValueName: "广州市",
      areas: [
        {
          value: "440100",
          label: "广州市",
          // name: 'jiangmen'
          coordinate: [113.280637, 23.125178]
        },
        {
          value: "440117",
          label: "从化区",
          coordinate: [113.587386, 23.545283]
          // name: 'pengjiang'
        },
        {
          value: "440115",
          label: "南沙区",
          coordinate: [113.53738, 22.794531]
          // name: 'jianghai'
        },
        {
          value: "440114",
          label: "花都区",
          coordinate: [113.211184, 23.39205]
          // name: 'xinhui'
        },
        {
          value: "440113",
          label: "番禺区",
          coordinate: [113.364619, 22.938582]
          // name: 'taishan'
        },
        {
          value: "440103",
          label: "荔湾区",
          coordinate: [113.243038, 23.124943]
          // name: 'heshan'
        },
        {
          value: "440111",
          label: "白云区",
          coordinate: [113.262831, 23.162281]
          // name: 'enping'
        },
        {
          value: "440105",
          label: "海珠区",
          coordinate: [113.262008, 23.103131]
          // name: 'enping'
        },
        {
          value: "440112",
          label: "黄埔区",
          coordinate: [113.450761, 23.103239]
          // name: 'enping'
        },
        {
          value: "440118",
          label: "增城区",
          coordinate: [113.829579, 23.290497]
          // name: 'enping'
        },
        {
          value: "440106",
          label: "天河区",
          coordinate: [113.335367, 23.13559]
          // name: 'enping'
        },
        {
          value: "440104",
          label: "越秀区",
          coordinate: [113.280714, 23.125624]
          // name: 'enping'
        }
      ],
      clickFlag: null
      // stops: false
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  created() {
    this.$emit("getNavShow", true);
  },
  mounted() {
    this.restaurants = this.loadAll();
    this.$nextTick(() => {
      this.cesiumInit();
    });
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.modelName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    loadAll() {
      return this.modelData;
    },
    handleSelect(item) {
      console.log(item);
      this.state = item.modelName;
      this.map.setZoomAndCenter(12.9, [
        parseFloat(item.modeLocation[0]),
        parseFloat(item.modeLocation[1])
      ]); //同时设置地图层级与中心点
    },
    handleIconClick(ev) {
      console.log(ev);
      this.state = "";
    },
    rountGo(item) {
      this.state = item.modelName;
      this.map.setZoomAndCenter(12.9, [
        parseFloat(item.modeLocation[0]),
        parseFloat(item.modeLocation[1])
      ]); //同时设置地图层级与中心点
      // this.$router.push({ path: item.path, query: item.query });
    },
    cesiumInit() {
      const that = this;
      var viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: new Cesium.SingleTileImageryProvider({
          url: "./Assets/img/worldimage.png"
        }),

        homeButton: false,
        //sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationInstructionsInitiallyVisible: false
      });
      // var scene = viewer.scene;
      var height = 40000000;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-100.0, 5.0, height)
      });
      // that.mapInit();
      setTimeout(function() {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            113.370565,
            23.122751,
            2000000
          ),
          maximumHeight: height,
          pitchAdjustHeight: 2000000,
          complete: function() {
            // console.log("完成飞行");

            that.mapInit();
            that.panelFlag = true;
            that.$emit("getNavShow", false);
          }
        });
      }, 3000);
      // that.mapInit();
      //   that.panelFlag = true;
      //   that.$emit('getNavShow', false);
    },
    mapInit() {
      const that = this;
      document.getElementById("cesiumContainer").innerHTML = "";
      // 创建地图实例
      that.map = new AMap.Map("cesiumContainer", {
        viewMode: "3D",
        pitch: 30,
        rotation: 25,
        zoom: 12.9,
        zooms: [11, 20],
        center: [113.370565, 23.122751],
        // mapStyle: "amap://styles/macaron",
        showIndoorMap: true,
        // features: ['road', 'bg'],
        defaultCursor: "pointer",
        turboMode: true,
        showBuildingBlock: true,
        forceVector: true,
        showLabel: true,
        resizeEnable: true
        // mapStyle: "amap://styles/f92fafd270beb106283db716d8da5234" //设置地图的显示样式
      });
      // var toolbar = new AMap.ToolBar();
      // that.map.plugin(toolbar);
      AMap.plugin(["AMap.ControlBar"], function() {
        // 添加 3D 罗盘控制
        that.map.addControl(
          new AMap.ControlBar({ position: { top: "100px", right: "300px" } })
        );
      });
      // 创建Object3DLayer图层
      that.object3Dlayer = new AMap.Object3DLayer({
        zIndex: 110,
        opacity: 0.8
      });
      that.map.add(that.object3Dlayer);

      var parenTimg = "./Assets/img/parent-build.png";
      var zoomStyleMapping2 = {
        11: 1,
        12: 1,
        13: 1,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
        18: 1
      };
      var spots = [];
      that.modelData.forEach((parent, index) => {
        var marker = new AMap.ElasticMarker({
          position: [parent.modeLocation[0], parent.modeLocation[1]],
          zooms: [11, 20],
          styles: [
            {
              icon: {
                img: parenTimg,
                size: [32, 32], //可见区域的大小
                ancher: [16, 16], //锚点
                // imageSize:[24,24],
                fitZoom: 12, //最合适的级别
                scaleFactor: 2, //地图放大一级的缩放比例系数
                maxScale: 1.5, //最大放大比例
                minScale: 1 //最小放大比例
              },
              label: {
                content: `<div class="lb-label2" style="width:${
                  parent.modelName.length
                }em; margin-left: -${(parent.modelName.length - 4) / 2}em;">${
                  parent.modelName
                }</div>`,
                offset: [-16, 0],
                position: "BM",
                minZoom: 12.5
              }
            },
            {
              icon: {
                img: parenTimg,
                size: [40, 40],
                ancher: [20, 20],
                fitZoom: 13,
                scaleFactor: 2,
                maxScale: 1.5,
                minScale: 0.5
              },
              label: {
                content: `<div class="lb-label2" style="width:${
                  parent.modelName.length
                }em; margin-left: -${(parent.modelName.length - 4) / 2}em;">${
                  parent.modelName
                }</div>`,
                offset: [-20, 0],
                position: "BM",
                minZoom: 12.5
              }
            }
          ],
          zoomStyleMapping: zoomStyleMapping2
          // extData: {
          //   name: parent.modelName
          // }
        });
        marker.setExtData(parent.modelName);
        spots.push(marker);
        // 绑定事件
        // marker.on("mouseover", that.mapMοuseοutMarker);
        // marker.on("mousemove", that.mapMοuseοutMarker);

        marker.on("click", that.mapClickMarker);
        // marker.on("dblclick", that.mapDbllickMarker);
      });
      that.map.add(spots);
      // this.$refs.cesiumContainer2.addEventListener("click", this.hiddenMapImg);
      // 缩放事件
      // that.map.on('zoomstart', that.mapZoomstart);
      // that.map.on("zoomchange", that.mapZoom);
      that.mapMousemoveLi();
      that.drawBounds();
      // that.map.on('zoomend', that.mapZoomend);
    },
    showMarker3Fn(event) {
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      event.preventDefault();
      this.showMarker3 = true;
      return false;
    },
    lnglatToG20(lnglat) {
      var lnglat = this.map.lngLatToGeodeticCoord(lnglat);
      lnglat.x = AMap.Util.format(lnglat.x, 3);
      lnglat.y = AMap.Util.format(lnglat.y, 3);
      return lnglat;
    },
    pointOnCubicBezier(cp, t) {
      var ax, bx, cx;
      var ay, by, cy;
      var tSquared, tCubed;

      cx = 3.0 * (cp[1].lng - cp[0].lng);
      bx = 3.0 * (cp[2].lng - cp[1].lng) - cx;
      ax = cp[3].lng - cp[0].lng - cx - bx;

      cy = 3.0 * (cp[1].lat - cp[0].lat);
      by = 3.0 * (cp[2].lat - cp[1].lat) - cy;
      ay = cp[3].lat - cp[0].lat - cy - by;

      tSquared = t * t;
      tCubed = tSquared * t;

      var lng = ax * tCubed + bx * tSquared + cx * t + cp[0].lng;
      var lat = ay * tCubed + by * tSquared + cy * t + cp[0].lat;

      return new AMap.LngLat(lng, lat);
    },
    computeBezier(points, numberOfPoints) {
      var dt;
      var i;
      var curve = [];

      dt = 1.0 / (numberOfPoints - 1);

      for (i = 0; i < numberOfPoints; i++) {
        curve[i] = this.pointOnCubicBezier(points, i * dt);
      }

      return curve;
    },
    clickHandler(e) {
      const that = this;
      var ev = e;
      var pixel = ev.pixel;
      var px = new AMap.Pixel(pixel.x, pixel.y);
      var obj =
        that.map.getObject3DByContainerPos(px, [that.object3Dlayer], false) ||
        {};
      // var object = obj.object;
      // console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
      console.log(obj);
      // if(obj.object && obj.object.type === "lightmesh") {
      //   that.rountGo(that.item);
      // }
    },
    hineMenuFn() {
      // this.showMenu = false;
      this.MarkerClick = false;
      this.showMarker3 = false;
      this.mapMοuseοutLi();
    },
    mapMοuseοutMarker(ev) {
      const that = this;
      if (this.MarkerClick) {
        return;
      }
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.$refs.menu.style.left = ev.pixel.x - 80 + "px";
      this.$refs.menu.style.top = ev.pixel.y - 180 + scrollTop + "px";
      this.getExtData = ev.target.getExtData();
      that.modelData.forEach((item, i) => {
        if (item.modelName === this.getExtData) {
          that.objIndex = i;
        }
      });
      ev.target.on("mouseout", that.mouseleveMarker);
    },
    mapClickMarker(ev) {
      //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
      const that = this;
      event.preventDefault();
      if (this.clickFlag) {
        //取消上次延时未执行的方法
        this.clickFlag = clearTimeout(this.clickFlag);
      }
      this.clickFlag = setTimeout(function() {
        // click 事件的处理
        that.MarkerClick = true;
        var scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        that.$refs.menu.style.left = ev.pixel.x - 80 + "px";
        that.$refs.menu.style.top = ev.pixel.y - 180 + scrollTop + "px";
        that.getExtData = ev.target.getExtData();
        that.modelData.forEach((item, i) => {
          if (item.modelName === that.getExtData) {
            that.objIndex = i;
          }
        });
        // that.showMenu = true;
      }, 300); //延时300毫秒执行

      return false;
    },
    mapDbllickMarker(e) {
      console.log("双击", e.target.getExtData());
      if (this.clickFlag) {
        //取消上次延时未执行的方法
        this.clickFlag = clearTimeout(this.clickFlag);
      }
      this.$router.push({ name: "buildModel", params: e.target.getExtData() });
    },
    liClick(e) {
      console.log(e);
      if (this.clickFlag) {
        //取消上次延时未执行的方法
        this.clickFlag = clearTimeout(this.clickFlag);
      }
      this.$router.push({ name: "buildModel", params: e });
    },
    mapMousemoveLi() {
      // console.log(e);
      const that = this;
      // if (that.objIndex === null) {
      //   return;
      // }
      // let numberIndex = [];
      // const textLi = e.target.innerText;
      // if (textLi.indexOf("综合接入间") > -1) {
      //   numberIndex = [0, 5, 5, 5];
      // } else {
      //   numberIndex = [5, 1, 2, 3];
      // }
      that.markers = [];
      var img = "./Assets/img/search-map-icon.png";
      that.modelData[0].iconLocation.forEach((item, index) => {
        // if (index === numberIndex[index]) {
        var deepX = (item.location[0] - that.modelData[0].modeLocation[0]) / 4;
        var deepY = (item.location[1] - that.modelData[0].modeLocation[1]) / 4;
        var points = [
          new AMap.LngLat(
            JSON.parse(that.modelData[0].modeLocation[0]),
            JSON.parse(that.modelData[0].modeLocation[1])
          ),
          new AMap.LngLat(
            JSON.parse(that.modelData[0].modeLocation[0]) + deepX,
            JSON.parse(that.modelData[0].modeLocation[1]) + deepY
          ),
          new AMap.LngLat(
            JSON.parse(that.modelData[0].modeLocation[0]) + deepX * 2,
            JSON.parse(that.modelData[0].modeLocation[1]) + deepY * 2
          ),
          new AMap.LngLat(
            JSON.parse(item.location[0]),
            JSON.parse(item.location[1])
          )
        ];
        var numberOfPoints = 180;
        var minHeight = 5;
        if (item.meshLine) {
          that.object3Dlayer.remove(item.meshLine);
        }
        that.modelData[0].iconLocation[
          index
        ].meshLine = new AMap.Object3D.MeshLine({
          path: that.computeBezier(points, numberOfPoints, minHeight),
          height: that.getEllipseHeight(numberOfPoints, 2000, minHeight),
          color: "rgba(55,129,240, 0.9)",
          width: 2
        });
        that.modelData[0].iconLocation[index].meshLine.transparent = true;
        that.modelData[0].iconLocation[index].meshLine["backOrFront"] = "both";
        that.object3Dlayer.add(that.modelData[0].iconLocation[index].meshLine);

        // 图标
        var marker2 = new AMap.Marker({
          position: new AMap.LngLat(
            JSON.parse(item.location[0]),
            JSON.parse(item.location[1])
          ),
          icon: img,
          //  animation: "AMAP_ANIMATION_BOUNCE",
          extData: {
            buildId: item.buildId,
            name: item.name
          },
          offset: new AMap.Pixel(-20, -30)
        });
        // marker2.setTitle(item.name);
        marker2.setLabel({
          offset: new AMap.Pixel(0, 40), //设置文本标注偏移量
          content: `<div class="lb-label2" style="width:${
            item.name.length
          }em; margin-left: -${(item.name.length - 4) / 2}em;">${
            item.name
          }</div>` //设置文本标注内容
          // direction: 'right' //设置文本标注方位
        });
        that.markers.push(marker2);
        marker2.on("dblclick", that.mapDbllickMarker);
        // }
      });
      if (!that.overlayGroups) {
        that.overlayGroups = new AMap.OverlayGroup(that.markers);
        that.map.add(that.overlayGroups);
      }
    },
    mapMοuseοutLi() {
      const that = this;
      // var pixel = ev.pixel;
      console.log("鼠标离开li");
      // ev.target.setAnimation("AMAP_ANIMATION_NONE");
      // console.log("getMapScreenMarkers", that.markers.getMap());
      // ev.target.show();
      if (this.showMarker3) {
        return false;
      }
      if (that.objIndex != null) {
        that.modelData[that.objIndex].iconLocation.forEach((item, index) => {
          if (item.meshLine) {
            that.object3Dlayer.remove(item.meshLine);
            that.modelData[that.objIndex].iconLocation[index].meshLine = null;
          }
          // that.map.remove(that.markers[index]);
        });
        if (that.overlayGroups) {
          that.map.remove(that.overlayGroups);
          that.overlayGroups = null;
        }
        // that.objIndex = null;
      }
      if (that.marker3) {
        that.map.remove(that.marker3);
        that.marker3 = null;
      }
    },
    mouseleveMarker(ev) {
      const that = this;
      // var pixel = ev.pixel;
      console.log("鼠标离开Marker");
      // if (!this.MarkerClick) {
      //   this.showMenu = false;
      // }
    },
    getEllipseHeight(count, maxHeight, minHeight) {
      var height = [];
      var radionUnit = Math.PI / 180;

      for (var i = 0; i < count; i++) {
        var radion = i * radionUnit;

        height.push(minHeight + Math.sin(radion) * maxHeight);
      }

      return height;
    },
    updateMeshColor(mesh, color) {
      var vertexColors = mesh.geometry.vertexColors;
      var len = vertexColors.length;
      for (var i = 0; i < len / 4; i++) {
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];
        // 不能重新赋值，只允许修改内容
        vertexColors.splice(i * 4, 4, r, g, b, a);
      }

      mesh.needUpdate = true;
      mesh.reDraw();
    },
    // 缩放开始
    // mapZoomstart() {
    //   console.log("缩放开始")
    // },
    mapZoom() {
      const that = this;
      this.zoom = that.map.getZoom(); //获取当前地图级别
      console.log("正在缩放", this.zoom);
    },
    drawBounds() {
      const that = this;
      //加载行政区划插件
      if (!that.district) {
        //实例化DistrictSearch
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "district" //查询行政级别为 市
        };
        that.district = new AMap.DistrictSearch(opts);
      }
      //行政区查询
      that.district.setLevel("city");
      that.district.setExtensions("all");
      that.district.search(that.selectValue, function(status, result) {
        that.map.remove(that.polygons); //清除上次结果
        that.polygons = [];
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon
            var polygon = new AMap.Polygon({
              strokeWeight: 8,
              path: bounds[i],
              fillOpacity: 0,
              fillColor: "#80d8ff",
              strokeColor: "#4c66c7"
            });
            polygon.on("click", that.clickHandler);
            that.polygons.push(polygon);
          }
        }
        that.map.add(that.polygons);

        that.map.setFitView(that.polygons); //视口自适应
        // that.map.setZoom(12.9);
      });
    }
  },
  watch: {
    selectValue(val) {
      const that = this;
      this.drawBounds();
      const data = this.areas.filter(function(item) {
        return item.value === val;
      });
      console.log(val);

      // console.log("data ",data);
      this.selectValueName = data[0].label;
      switch (this.selectValueName) {
        case "番禺区":
          setTimeout(() => {
            that.map.setZoom(12.9);
          }, 400);
          break;
        case "荔湾区":
          setTimeout(() => {
            that.map.setZoom(12.9);
          }, 400);
          break;
        case "海珠区":
          setTimeout(() => {
            that.map.setZoom(12.9);
          }, 400);
          break;
        case "天河区":
          setTimeout(() => {
            that.map.setZoom(12.9);
          }, 400);
          break;
        case "越秀区":
          setTimeout(() => {
            that.map.setZoom(14);
          }, 400);
          break;

        default:
          setTimeout(() => {
            that.map.setZoom(12);
          }, 400);
          break;
      }
      // console.log(this.selectValueName);
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

.cesiumContainer .amap-marker-label {
  border: 0px solid transparent;
  background-color: transparent;
  color: #4c66c7;
  margin: auto;
  width: 40px;
  padding: 0;
  font-weight: 600;
  font-size: 14px;
  /* text-shadow: 0 0 0.5em #359cdf, -0 -0 0.5em #359cdf; */
}
.cesiumContainer .amap-icon img {
  height: 2.6rem;
  width: 2.6rem;
}
.cesiumContainer .lb-label2 {
  /* width: 160px;
  text-align: center; */
  margin-left: -50%;
  /* background-color: #fff; */
  /* background-color: transparent; */
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
<style scoped lang="scss">
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.close-btn {
  width: 30px;
  height: 30px;
  background: rgba(113, 135, 240, 0.5);
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
.jianTou {
  width: 0;
  height: 0;
  border-width: 10px 10px 0px;
  border-style: solid;
  border-color: rgba(113, 135, 240, 0.5) transparent transparent;
  position: absolute;
  left: 50%;
  bottom: -10px;
  margin-left: -10px;
}
.menu {
  width: 180px;
  height: 138px;
  background: rgba(75, 91, 171, 0.7);
  position: absolute;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}
.menu li {
  padding: 10px;
  overflow: hidden;
  font-size: 14px;
  cursor: pointer;
}
.menu li span {
  float: right;
}
.menu li:hover {
  background: rgba(113, 135, 240, 0.4);
}
.module-statis .modal {
  width: 119px;
  height: 65px;
  /* opacity:0.8; */
  border-radius: 4px;
  padding: 10px;
  position: relative;
  float: left;
  margin-bottom: 15px;
}
.module-statis .modal:nth-child(2n + 1) {
  margin-right: 15px;
}
.lb-module-list {
  max-height: 240px;
  overflow: auto;
  background: inherit;
  padding-bottom: 40px;
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
</style>
