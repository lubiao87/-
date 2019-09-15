<template>
  <div style="width: 100%;height:100%;">
    <!-- <input type="flies" src="/assets/GKG.FBX" ref="mapID" alt="" /> -->
    <div id="cesiumContainer" style="position:absolute; top: 0; width: 100%;height:100%;" v-show="!panelFlag"></div>
    <div id="cesiumContainer2" style="position:absolute; top: 0; width: 100%;height:100%;" v-show="panelFlag"></div>
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
    <div class="ui-shrinkBar" v-bind:class="{'ui-shrinkBar-right':panelShow}" v-show="panelFlag">
      <div @click="panelShow = !panelShow" class="ui-shrinkBar-close"
           v-bind:class="{'ui-shrinkBar-open':panelShow, 'ui-shrinkBar-close': !panelShow }"></div>
        <div class="ui-citytol">
          <h5 class="ui-city-title"><span class="icon-location"></span> 当前区域</h5>
          <div class="scroll-wrap fn-mt10 regionName">
            {{selectValueName}}
          </div>
        </div>
        <div style="margin-top: 30px;">
          <h5 class="ui-city-title ui-height48"><span class="ui-linebg"></span>模房列表</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div class="lb-module-list">
                <ul>
                  <li @click="rountGo(item)">
                      <span>1. </span>
                      <span>台山台城机房</span>
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
  // import { listSearchMixin } from "../../mixin"; //混淆请求
 // 局部组件引用
  import Cesium from 'cesium/Cesium'
  // noinspection ES6UnusedImports
  import widget from 'cesium/Widgets/widgets.css'
export default {
  name: "olmap2",
  props: ["coordinate"],
  // mixins: [listSearchMixin],
  data() {
    return {
      panelShow: true,
      item: {
        path: "/buildModel",
        query: {
          id: 123
        }
      },
      panelFlag: false,
      district: null,
      polygons: [],
      selectValue: "440700",
      selectValueName: "江门市",
      areas: [{
          value: '440700',
          label: '江门市',
          // name: 'jiangmen'
          coordinate: [113.094942, 22.590431]
        }, {
          value: '440784',
          label: '鹤山市',
          coordinate: [1112.961795, 22.768104]
          // name: 'pengjiang'
        }, {
          value: '440783',
          label: '开平市',
          coordinate: [112.692262, 22.366286]
          // name: 'jianghai'
        }, {
          value: '440704',
          label: '江海区',
          coordinate: [113.120601, 22.572211]
          // name: 'xinhui'
        }, {
          value: '440781',
          label: '台山市',
          coordinate: [112.793414, 22.250713]
          // name: 'taishan'
        }, {
          value: '440785',
          label: '恩平市',
          // name: 'kaiping'
          coordinate: [112.314051, 22.182956]
        }, {
          value: '440703',
          label: '蓬江区',
          coordinate: [113.07859, 22.59677]
          // name: 'heshan'
        }, {
          value: '440705',
          label: '新会区',
          coordinate: [113.038584, 22.520247]
          // name: 'enping'
        }
        ],
      // stops: false
    };
  },
  computed: {
    overInfoId() {
      return "-over-info-";
    }
  },
  created() {
    this.$emit('getNavShow', true)
  },
  mounted() {
    this.$nextTick(() => {
        this.cesiumInit()
      })
  },
  methods: {
    rountGo (item) {
      this.$router.push({path: item.path, query: item.query})
    },
    cesiumInit(){
      const that = this;
      var viewer = new Cesium.Viewer('cesiumContainer',
        {
            imageryProvider: new Cesium.SingleTileImageryProvider({
               url: './assets/img/worldimage.png'
            }),

            homeButton: false,
            //sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            vrButton: false
        });
        // var scene = viewer.scene;
        var height = 40000000;

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(-100.0, 5.0, height)
        });
        that.mapInit();
        setTimeout(function() {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(113.377078, 23.128803, 500000),
                maximumHeight: height,
                pitchAdjustHeight: 20000000,
                complete: function () {
                  // console.log("完成飞行");

                  // that.mapInit();
                  that.panelFlag = true;
                  that.$emit('getNavShow', false);

                }
            });
        }, 3000);
    },
    mapInit() {
      const that = this;
              // 创建地图实例
        that.map = new AMap.Map("cesiumContainer2", {
            viewMode: '3D',
            pitch: 30,
            rotation: 25,
            zoom: 10,
            center: [113.094942, 22.590431],
            mapStyle: 'amap://styles/macaron',
            showIndoorMap: false
        });
        that.selectColor = [51 / 255, 133 / 255, 255 / 255, 0.8];
        that.clearColor = [0 / 255, 0 / 255, 0 / 255, 0.6];
        // 创建Object3DLayer图层
        that.object3Dlayer = new AMap.Object3DLayer();
        that.map.add(that.object3Dlayer);
        that.drawBounds();
        that.map.plugin(["AMap.GltfLoader"], function () {
			      var urlDuck2 = './assets/gltf/dianxin.gltf';

            var paramDuck = {
                position: new AMap.LngLat(113.094942, 22.590431), // 必须
                scale: 0.1, // 非必须，默认1
                height: 100,  // 非必须，默认0
                scene: 0, // 非必须，默认0
            };

            var gltfObj = new AMap.GltfLoader();

			      gltfObj.load(urlDuck2, function (gltfDuck) {
                gltfDuck.setOption(paramDuck);
                gltfDuck.rotateX(90);
                gltfDuck.rotateZ(10);
                gltfDuck.setName = "设置的名称"
                that.object3Dlayer.add(gltfDuck);

                console.log("加载出来的模型", gltfDuck)
                gltfDuck.layerMesh.forEach((element, i, arr) => {
                  gltfDuck.layerMesh[i].transparent = true;
                  that.updateMeshColor(gltfDuck.layerMesh[i], that.clearColor);
                });
                that.gltfDucks = gltfDuck;
            });

            // 绑定事件
            // that.map.on('click', that.clickHandler);
            // prism 拾取
            that.map.on('mousemove', that.mapMousemove);
            // 缩放事件
            // that.map.on('zoomstart', that.mapZoomstart);
            that.map.on('zoomchange', that.mapZoom);
            // that.map.on('zoomend', that.mapZoomend);
        });


    },
    clickHandler(e) {
        const that = this;
        var ev = e;
        var pixel = ev.pixel;
        var px = new AMap.Pixel(pixel.x, pixel.y);
        var obj = that.map.getObject3DByContainerPos(px, [that.object3Dlayer], false) || {};
        // var object = obj.object;
        console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        // console.log(obj)
        if(obj.object) {
          that.rountGo(that.item);
        }
    },
    mapMousemove(ev) {
      const that = this;
      var pixel = ev.pixel;
      var px = new AMap.Pixel(pixel.x, pixel.y);
      var obj = that.map.getObject3DByContainerPos(px, [that.object3Dlayer], false) || {};

      // 选中的 face 所在的索引
      // var index = obj.index;
      // 选中的 object3D 对象，这里为当前 Mesh
      var object = obj.object;
      // 被拾取到的对象和拾取射线的交叉点的3D坐标
      // var point = obj.point;
      // 交叉点距透视原点的距离
      // var distance = obj.distance;

      if(obj.object) {
        object.transparent = true;
        // console.log("悬停选中的 object3D 对象", object)
        that.gltfDucks.layerMesh.forEach((element, i, arr) => {
            that.updateMeshColor(that.gltfDucks.layerMesh[i], that.clearColor);
          });
        that.updateMeshColor(object, that.selectColor);
      } else {
        if (that.gltfDucks) {
          that.gltfDucks.layerMesh.forEach((element, i, arr) => {
            that.updateMeshColor(that.gltfDucks.layerMesh[i], that.clearColor);
          });
        }

      }
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
    mapZoomstart() {
      console.log("缩放开始")
    },
    mapZoom() {
      const that = this;
      var zoom = that.map.getZoom(); //获取当前地图级别
      console.log("正在缩放", zoom);
    },
    drawBounds() {
      const that = this;
      //加载行政区划插件
        if(!that.district){
            //实例化DistrictSearch
            var opts = {
                subdistrict: 0,   //获取边界不需要返回下级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'district'  //查询行政级别为 市
            };
            that.district = new AMap.DistrictSearch(opts);
        }
        //行政区查询
        that.district.setLevel("city");
        that.district.setExtensions('all');
        that.district.search(that.selectValue, function(status, result) {
            that.map.remove(that.polygons)//清除上次结果
            that.polygons = [];
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        strokeWeight: 2,
                        path: bounds[i],
                        fillOpacity: 0.4,
                        fillColor: '#80d8ff',
                        strokeColor: '#0091ea'
                    });
                    polygon.on('click', that.clickHandler);
                    that.polygons.push(polygon);
                }
            }
            that.map.add(that.polygons)
            that.map.setFitView(that.polygons);//视口自适应
        });
    }
  },
  watch: {
    selectValue(val) {

      this.drawBounds()
      const data = this.areas.filter(function(item) {
        return item.value === val
      });
      // console.log("data ",data);
      this.selectValueName = data[0].label
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
.model-select {
  position: absolute;
  top: 100px;
  left: 50px;
  min-width: 240px;
}
</style>
