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
        <!-- 微机楼统计 -->
        <div style="margin-top: 20px;">
          <h5 class="ui-city-title ui-height48"><span class="ui-linebg"></span>微机楼统计</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div v-for="(item, index) in moduleStatistics" :key="index"  class="modal" :class="'module' + (index + 1)">
                  <div calss="name" style="font-size: 12px;color: #fff;">{{item.name}}</div>
                  <div class="number">{{item.value}}</div>
                  <div :class="item.class"></div>

              </div>
          </div>
        </div>

        <!-- 机楼列表 -->
        <div style="margin-top: 20px;">
          <h5 class="ui-city-title ui-height48"><span class="ui-linebg"></span>模房列表</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div class="lb-module-list">
                <ul>
                  <li v-for="(items, index) in modelData" :key="index" @click="rountGo(item)">
                      <span>{{index + 1}}. </span>
                      <span>{{items.modelName}}</span>
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
      modelData: [
        {
          modeLocation: [113.365976669489, 23.1273897880092],
          modelName: "工业园机楼",
          iconLocation: [
            {
              location: [113.366468854055, 23.117265554063],
              name: "美林花园远端机房"
            },
            {
              location: [113.366872581306, 23.1367018208333],
              name: "棠下荷光路远端机房"
            },
            {
              location: [113.36554653287395, 23.119129095177218],
              name: "百合苑接入网机房"
            },
            {
              location: [113.365509061595, 23.1339763309438],
              name: "职业技术师范接入网机房"
            }
          ]
        },
        {
          modeLocation: [113.077027360425,23.3868981882017],
          modelName: "赤坭机楼",
          iconLocation: [
            {
              location: [113.062194036127,23.2592018599787],
              name: "文岗村接入网机房"
            },
            {
              location: [113.070178532914,23.4414901309656],
              name: "瑞岭村接入网机房"
            },
            {
              location: [113.076640750871,23.4724360247037],
              name: "花都碧桂园接入网机房"
            },
            {
              location: [113.086376629679,23.4124907730316],
              name: "培正商学院接入网机房"
            },
             {
              location: [113.091310831131,23.370640041006],
              name: "广州花都珠江轮胎厂远端机房"
            },
             {
              location: [113.099161093311,23.3178317695214],
              name: "茶塘村远端机房"
            }
          ]
        },
        {
          modeLocation: [113.226591230302,23.277700871299],
          modelName: "江村机楼",
          iconLocation: [
            {
              location: [113.225772731228,23.4053855533015],
              name: "南航花园接入网机房"
            },
            {
              location: [113.225710927119,23.1635179440987],
              name: "岭南花园接入网机房"
            },
             {
              location: [113.228370418461,23.2586382224769],
              name: "驿迅物流接入网机房"
            }
          ]
        },
      ],
      moduleStatistics: [
        {name:"机楼数", value:3, class: 'right_building'},
        {name:"接入间数", value:10, class: 'right_module'},
        {name:"核心DC数", value:15, class: 'right_planning'},
        {name:"接入局所数", value:150, class: 'right_cabinet'}
      ],
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
      selectValue: "440100",
      selectValueName: "广州市",
      areas: [{
          value: '440100',
          label: '广州市',
          // name: 'jiangmen'
          coordinate: [113.280637, 23.125178]
        }, {
          value: '440117',
          label: '从化区',
          coordinate: [113.587386, 23.545283]
          // name: 'pengjiang'
        }, {
          value: '440115',
          label: '南沙区',
          coordinate: [113.53738, 22.794531]
          // name: 'jianghai'
        }, {
          value: '440114',
          label: '花都区',
          coordinate: [113.211184, 23.39205]
          // name: 'xinhui'
        }, {
          value: '440113',
          label: '番禺区',
          coordinate: [113.364619, 22.938582]
          // name: 'taishan'
        }, {
          value: '440103',
          label: '荔湾区',
          coordinate: [113.243038, 23.124943]
          // name: 'heshan'
        }, {
          value: '440111',
          label: '白云区',
          coordinate: [113.262831, 23.162281]
          // name: 'enping'
        }, {
          value: '440105',
          label: '海珠区',
          coordinate: [113.262008, 23.103131]
          // name: 'enping'
        }, {
          value: '440112',
          label: '黄埔区',
          coordinate: [113.450761, 23.103239]
          // name: 'enping'
        }, {
          value: '440118',
          label: '增城区',
          coordinate: [113.829579, 23.290497]
          // name: 'enping'
        }, {
          value: '440106',
          label: '天河区',
          coordinate: [113.335367, 23.13559]
          // name: 'enping'
        }, {
          value: '440104',
          label: '越秀区',
          coordinate: [113.280714, 23.125624]
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
               url: './Assets/img/worldimage.png'
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
                destination: Cesium.Cartesian3.fromDegrees(113.370565, 23.122751, 500000),
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
            zoom: 12,
            zooms: [3, 20],
            center: [113.370565, 23.122751],
            mapStyle: 'amap://styles/macaron',
            showIndoorMap: false,
            features: ['road', 'bg'],
        });
        that.selectColor = [51 / 255, 133 / 255, 255 / 255, 0.8];
        that.clearColor = [71 / 255, 193 / 255, 76 / 255, 0.8];
        that.clearColor2 = [64 / 255, 64 / 255, 64 / 255, 0.8];
        // 创建Object3DLayer图层
        that.object3Dlayer = new AMap.Object3DLayer({
            zIndex: 110,
            opacity: 0.8
        });
        that.map.add(that.object3Dlayer);
        that.drawBounds();
        that.map.plugin(["AMap.GltfLoader"], function () {
			      var urlDuck2 = './Assets/gltf/dianxin.gltf';



            var gltfObj = new AMap.GltfLoader();

			      gltfObj.load(urlDuck2, function (gltfDuck) {
              that.modelData.forEach((parent, index) => {
                var paramDuck = {
                  position: new AMap.LngLat(parent.modeLocation[0],parent.modeLocation[1]), // 必须
                  scale: 0.02, // 非必须，默认1
                  height: 100,  // 非必须，默认0
                  scene: 0, // 非必须，默认0
                };
                gltfDuck.setOption(paramDuck);
                gltfDuck.rotateX(90);
                gltfDuck.rotateZ(10);
                gltfDuck.setName = "设置的名称"
                that.object3Dlayer.add(gltfDuck);

                console.log("加载出来的模型", gltfDuck)
                // gltfDuck.layerMesh.forEach((element, i, arr) => {
                  gltfDuck.layerMesh[0].transparent = true;
                  that.updateMeshColor(gltfDuck.layerMesh[0], that.clearColor);
                  that.updateMeshColor(gltfDuck.layerMesh[1], that.clearColor2);
                // });
                that.gltfDucks = gltfDuck;
                var img = './Assets/img/search-map-icon.png';
                var points3D = new AMap.Object3D.Points();
                points3D.transparent = true;
                // 创建纯文本标记  ---------------
                var parentName = new AMap.Text({
                    text: parent.modelName,
                    anchor:'center', // 设置文本标记锚点
                    draggable:true,
                    cursor:'pointer',
                    angle:10,
                    style:{

                        'background-color': 'transparent',
                        'border-width': 0,
                        'text-align': 'center',
                        'font-size': '14px',
                        'color': '#e91e63',
                        'margin-top': '30px'
                    },
                    position: parent.modeLocation
                });
                parentName.setMap(that.map);
                parent.iconLocation.forEach((item, p) => {
                  // let point = new BMap.Point(item.location[0], item.location[1]);
                  // map.centerAndZoom(point, 15);
                  // that.makeMark(point, map, item);
                  var coords = [JSON.parse(item.location[0]), JSON.parse(item.location[1])]; // 天安门;
                  // 创建纯文本标记  ---------------
                  var geometry = points3D.geometry;
                  points3D.textures.push(img);
                  var center = that.lnglatToG20(coords);
                  geometry.vertices.push(center.x, center.y, 0);
                  geometry.pointSizes.push(30);
                  geometry.vertexColors.push(p * 0.029, p * 0.015, p * 0.01, 0.5);
                  geometry.pointAreas.push(0, 0, 1, 1);
                  // 每两个元素描述一个顶点的纹理坐标信息，纹理坐标以图片左上角为原点。分别是左上角和右下角。
                  geometry.vertexUVs.push(0, 0, 1, 1);
                  // 每个元素描述一个顶点的纹理索引信息，多纹理时使用，取值范围[0-7]。单纹理或者无纹理时不需要设值。
                  geometry.textureIndices.push(p);

                  // 创建纯文本标记  ---------------
                  var text = new AMap.Text({
                      text: item.name,
                      anchor:'center', // 设置文本标记锚点
                      draggable:true,
                      cursor:'pointer',
                      angle:10,
                      style:{

                          'background-color': 'transparent',
                          'border-width': 0,
                          'text-align': 'center',
                          'font-size': '12px',
                          'color': 'blue',
                          'margin-top': '20px'
                      },
                      position: item.location
                  });
                  text.setMap(that.map);
                });
                that.object3Dlayer.add(points3D);
              })
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

        var lng = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].lng;
        var lat = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].lat;

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
        var obj = that.map.getObject3DByContainerPos(px, [that.object3Dlayer], false) || {};
        // var object = obj.object;
        // console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        console.log(obj.object)
        if(obj.object && obj.object.type === "lightmesh") {
          that.rountGo(that.item);
        }
    },
    mapMousemove(ev) {
      const that = this;
      var pixel = ev.pixel;
      var px = new AMap.Pixel(pixel.x, pixel.y);
      var obj = that.map.getObject3DByContainerPos(px, [that.object3Dlayer], false) || {};


      // 选中的 object3D 对象，这里为当前 Mesh
      var object = obj.object;
      // 被拾取到的对象和拾取射线的交叉点的3D坐标
      // var point = obj.point;
      // 交叉点距透视原点的距离
      // var distance = obj.distance;
      // var target = ev.target;
      if(obj.object && obj.object.type === "lightmesh") {
        // 选中的 face 所在的索引
        that.modelData.forEach((item, i) => {
          if(Math.abs(item.modeLocation[0] - obj.object.yl.lng) < 0.001 ) {
            that.objIndex = i;
          }
        })

        object.transparent = true;
        // console.log("悬停选中的 object3D 对象", object)
        // console.log(" object3D 对象的target", target)
        console.log(" object3D index", that.objIndex)
        // // that.gltfDucks.layerMesh.forEach((element, i, arr) => {
        //     that.updateMeshColor(that.gltfDucks.layerMesh[0], that.clearColor);
        //     that.updateMeshColor(that.gltfDucks.layerMesh[1], that.clearColor2);
        //   // });
        // that.updateMeshColor(object, that.selectColor);
        that.modelData[that.objIndex].iconLocation.forEach((item, index) => {
          var deepX = (item.location[0] - that.modelData[that.objIndex].modeLocation[0]) / 4;
          var deepY = (item.location[1] - that.modelData[that.objIndex].modeLocation[1]) / 4;
           var points = [
            new AMap.LngLat(that.modelData[that.objIndex].modeLocation[0], that.modelData[that.objIndex].modeLocation[1]),
            new AMap.LngLat(that.modelData[that.objIndex].modeLocation[0] + deepX, that.modelData[that.objIndex].modeLocation[1] + deepY),
            new AMap.LngLat(that.modelData[that.objIndex].modeLocation[0] + deepX * 2, that.modelData[that.objIndex].modeLocation[1] + deepY * 2),
            new AMap.LngLat(item.location[0], item.location[1])
          ];
          var numberOfPoints = 180;
          var minHeight = 5;
          if(item.meshLine) {
            that.object3Dlayer.remove(item.meshLine);
          }
          that.modelData[that.objIndex].iconLocation[index].meshLine = new AMap.Object3D.MeshLine({
            path: that.computeBezier(points, numberOfPoints, minHeight),
            height: that.getEllipseHeight(numberOfPoints, 2000, minHeight),
            color: 'rgba(55,129,240, 0.9)',
            width: 2
          });
          that.modelData[that.objIndex].iconLocation[index].meshLine.transparent = true;
          that.modelData[that.objIndex].iconLocation[index].meshLine['backOrFront'] = 'both';
          that.object3Dlayer.add(that.modelData[that.objIndex].iconLocation[index].meshLine);
        })

        // that.map.add(that.object3Dlayer);

      } else {
        if (that.gltfDucks) {
            // that.updateMeshColor(that.gltfDucks.layerMesh[0], that.clearColor);
            // that.updateMeshColor(that.gltfDucks.layerMesh[1], that.clearColor2);
            // console.log("typeof that.objIndex", that.objIndex );
            if(typeof that.objIndex === 'number') {
              that.modelData[that.objIndex].iconLocation.forEach((item, index) => {
                if(item.meshLine) {
                  that.object3Dlayer.remove(item.meshLine);
                  that.modelData[that.objIndex].iconLocation[index].meshLine = null;
                }
              })
              that.objIndex = null
            }



        }

      }
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
    mapZoomstart() {
      console.log("缩放开始")
    },
    mapZoom() {
      const that = this;
      var zoom = that.map.getZoom(); //获取当前地图级别
      // console.log("正在缩放", zoom);
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
                        strokeWeight: 5,
                        path: bounds[i],
                        fillOpacity: 0.2,
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
  .module-statis .modal {
    width:119px;
    height:65px;
    opacity:0.8;
    border-radius:4px;
    padding: 10px;
    position: relative;
    float: left;
    margin-bottom: 15px;
  }
  .module-statis .modal:nth-child(2n+1){
    margin-right: 15px;
  }
  .right_building, .right_module , .right_planning, .right_cabinet, .right_mokuai, .right_delivery {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 0;
    bottom: 0;
    background-size: 100%;
    float: left;
  }
  .module-statis .number {
    font-size:24px;
    font-family:'MicrosoftYaHei';
    font-weight:400;
    color:rgb(255,255,255);
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
