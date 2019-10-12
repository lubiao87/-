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
          <h5 class="ui-city-title ui-height48"><span class="ui-linebg"></span>机楼列表</h5>
          <div class="clearfix module-statis" style="padding-left: 0;">
              <div class="lb-module-list page-index">
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
      modelData: [{
        "modelName": "青云机楼",
        "iconLocation": [],
        "modeLocation": ["113.579681238758", "23.5409091642032"]
      }, {
        "modelName": "大岗机楼",
        "iconLocation": [{
          "name": "棠下解困小区远端机房",
          "location": ["113.377603832452", "23.1352856125418"]
        }],
        "modeLocation": ["113.40083225568", "22.8025218558178"]
      }, {
        "modelName": "荔城1机楼",
        "iconLocation": [],
        "modeLocation": ["113.830949516789", "23.2906952874569"]
      }, {
        "modelName": "新街机楼",
        "iconLocation": [],
        "modeLocation": ["113.191544244205", "23.3772507477905"]
      }, {
        "modelName": "大石机楼",
        "iconLocation": [],
        "modeLocation": ["113.313676378496", "23.0298473509556"]
      }, {
        "modelName": "东涌机楼",
        "iconLocation": [],
        "modeLocation": ["113.449101157069", "22.8884343653125"]
      }, {
        "modelName": "金洲机楼",
        "iconLocation": [],
        "modeLocation": ["113.534880146617", "22.799662636603"]
      }, {
        "modelName": "洛溪机楼",
        "iconLocation": [],
        "modeLocation": ["113.294934554777", "23.0448418380042"]
      }, {
        "modelName": "南村机楼",
        "iconLocation": [],
        "modeLocation": ["113.387651694508", "23.0059124095889"]
      }, {
        "modelName": "沙湾机楼",
        "iconLocation": [],
        "modeLocation": ["113.340020995373", "22.9087718376512"]
      }, {
        "modelName": "石基机楼",
        "iconLocation": [],
        "modeLocation": ["113.43089386113", "22.9555904621901"]
      }, {
        "modelName": "石楼机楼",
        "iconLocation": [],
        "modeLocation": ["113.480928273369", "22.9622116377878"]
      }, {
        "modelName": "荔城2机楼",
        "iconLocation": [],
        "modeLocation": ["113.822395828206", "23.2877681765868"]
      }, {
        "modelName": "市桥北城机楼",
        "iconLocation": [],
        "modeLocation": ["113.353336759648", "22.9525827055048"]
      }, {
        "modelName": "市桥东城机楼",
        "iconLocation": [],
        "modeLocation": ["113.372665332314", "22.9372857286179"]
      }, {
        "modelName": "市桥南城机楼",
        "iconLocation": [],
        "modeLocation": ["113.359637577159", "22.9369643785506"]
      }, {
        "modelName": "万顷沙机楼",
        "iconLocation": [],
        "modeLocation": ["113.544955511234", "22.7108461309779"]
      }, {
        "modelName": "钟村机楼",
        "iconLocation": [],
        "modeLocation": ["113.31459669402", "22.9812953766368"]
      }, {
        "modelName": "新华机楼",
        "iconLocation": [],
        "modeLocation": ["113.207801824893", "23.3801806773837"]
      }, {
        "modelName": "江埔机楼",
        "iconLocation": [],
        "modeLocation": ["113.601800610504", "23.5334753206999"]
      }, {
        "modelName": "新都机楼",
        "iconLocation": [],
        "modeLocation": ["113.196575769013", "23.4031489945134"]
      }, {
        "modelName": "横沥2远端机房",
        "iconLocation": [],
        "modeLocation": ["113.492274447926", "22.7508688141883"]
      }, {
        "modelName": "狮岭机楼",
        "iconLocation": [],
        "modeLocation": ["113.148738899118", "23.4636449292284"]
      }, {
        "modelName": "花东机楼",
        "iconLocation": [],
        "modeLocation": ["113.319910161989", "23.439032781381"]
      }, {
        "modelName": "化龙新局远端机房1",
        "iconLocation": [],
        "modeLocation": ["113.46093 ", "23.03086 "]
      }, {
        "modelName": "炭步机楼",
        "iconLocation": [],
        "modeLocation": ["113.100435432984", "23.3370833760147"]
      }, {
        "modelName": "赤坭机楼",
        "iconLocation": [{
            "location": ["113.062194036127", "23.2592018599787"],
            "name": "文岗村接入网机房"
          },
          {
            "location": ["113.070178532914", "23.4414901309656"],
            "name": "瑞岭村接入网机房"
          },
          {
            "location": ["113.076640750871", "23.4724360247037"],
            "name": "花都碧桂园接入网机房"
          },
          {
            "location": ["113.086376629679", "23.4124907730316"],
            "name": "培正商学院接入网机房"
          },
          {
            "location": ["113.091310831131", "23.370640041006"],
            "name": "广州花都珠江轮胎厂远端机房"
          },
          {
            "location": ["113.099161093311", "23.3178317695214"],
            "name": "茶塘村远端机房"
          }
        ],
        "modeLocation": ["113.077061455655", "23.386938013166"]
      }, {
        "modelName": "黄阁新局远端机房1",
        "iconLocation": [],
        "modeLocation": ["113.507626512954", "22.8255037304042"]
      }, {
        "modelName": "榄核远端机房1",
        "iconLocation": [],
        "modeLocation": ["113.333259995406", "22.8396974547342"]
      }, {
        "modelName": "福和机楼",
        "iconLocation": [],
        "modeLocation": ["113.630801660945", "23.3566438046483"]
      }, {
        "modelName": "神岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.528156168142", "23.4925483074673"]
      }, {
        "modelName": "温泉机楼",
        "iconLocation": [],
        "modeLocation": ["113.652419923163", "23.6444805801455"]
      }, {
        "modelName": "云星远端机房",
        "iconLocation": [],
        "modeLocation": ["113.62709612155", "23.6182741658251"]
      }, {
        "modelName": "灌村机楼",
        "iconLocation": [],
        "modeLocation": ["113.706524389246", "23.5838858088288"]
      }, {
        "modelName": "东明机楼",
        "iconLocation": [],
        "modeLocation": ["113.869628278424", "23.8948380945255"]
      }, {
        "modelName": "良口机楼",
        "iconLocation": [],
        "modeLocation": ["113.730354231153", "23.7196950170441"]
      }, {
        "modelName": "宁西机楼",
        "iconLocation": [],
        "modeLocation": ["113.654273909803", "23.2222905572254"]
      }, {
        "modelName": "派潭机楼",
        "iconLocation": [],
        "modeLocation": ["113.776579814962", "23.4907345801742"]
      }, {
        "modelName": "三江机楼",
        "iconLocation": [],
        "modeLocation": ["113.857250075124", "23.1883119651019"]
      }, {
        "modelName": "吕田机楼",
        "iconLocation": [],
        "modeLocation": ["113.945869041863", "23.8119620582121"]
      }, {
        "modelName": "沙埔机楼",
        "iconLocation": [],
        "modeLocation": ["113.656447321824", "23.1613136011562"]
      }, {
        "modelName": "石滩机楼",
        "iconLocation": [],
        "modeLocation": ["113.790509634816", "23.1753139377989"]
      }, {
        "modelName": "三江沙庄机楼",
        "iconLocation": [],
        "modeLocation": ["113.816945026087", "23.1365401375522"]
      }, {
        "modelName": "鳌头机楼",
        "iconLocation": [],
        "modeLocation": ["113.42159626991", "23.6198951926465"]
      }, {
        "modelName": "仙村机楼",
        "iconLocation": [],
        "modeLocation": ["113.712303517451", "23.1794840662287"]
      }, {
        "modelName": "小楼机楼",
        "iconLocation": [],
        "modeLocation": ["113.828316508394", "23.3808727520097"]
      }, {
        "modelName": "新塘2机楼",
        "iconLocation": [],
        "modeLocation": ["113.618284330749", "23.126375725921"]
      }, {
        "modelName": "民乐机楼",
        "iconLocation": [],
        "modeLocation": ["113.464971786083", "23.6592401570649"]
      }, {
        "modelName": "新塘1机楼",
        "iconLocation": [],
        "modeLocation": ["113.608090644158", "23.1105927959377"]
      }, {
        "modelName": "棋杆机楼",
        "iconLocation": [],
        "modeLocation": ["113.50373841632", "23.5795757389109"]
      }, {
        "modelName": "龙潭机楼",
        "iconLocation": [],
        "modeLocation": ["113.409390919982", "23.6690423458153"]
      }, {
        "modelName": "永和机楼",
        "iconLocation": [],
        "modeLocation": ["113.586881718916", "23.1798851870287"]
      }, {
        "modelName": "正果机楼",
        "iconLocation": [],
        "modeLocation": ["113.890056298663", "23.418639777658"]
      }, {
        "modelName": "东成机楼",
        "iconLocation": [],
        "modeLocation": ["113.585604439638", "23.5502767879333"]
      }, {
        "modelName": "镇龙机楼",
        "iconLocation": [],
        "modeLocation": ["113.562855014536", "23.281844609161"]
      }, {
        "modelName": "朱村机楼",
        "iconLocation": [],
        "modeLocation": ["113.695088856262", "23.2756925035706"]
      }, {
        "modelName": "跑马场机楼",
        "iconLocation": [],
        "modeLocation": ["113.337570782265", "23.1262897523415"]
      }, {
        "modelName": "新太平机楼",
        "iconLocation": [],
        "modeLocation": ["113.484507519873", "23.445349997359"]
      }, {
        "modelName": "晓港机楼",
        "iconLocation": [],
        "modeLocation": ["113.278963731181", "23.0925053525051"]
      }, {
        "modelName": "较场西机楼",
        "iconLocation": [],
        "modeLocation": ["113.276533433667", "23.1264874028259"]
      }, {
        "modelName": "农林机楼",
        "iconLocation": [],
        "modeLocation": ["113.291024026833", "23.1292273059697"]
      }, {
        "modelName": "东晓机楼",
        "iconLocation": [],
        "modeLocation": ["113.282853662173", "23.104045588339"]
      }, {
        "modelName": "电信大厦机楼",
        "iconLocation": [],
        "modeLocation": ["113.323797109378", "23.1402883279967"]
      }, {
        "modelName": "天河机楼",
        "iconLocation": [],
        "modeLocation": ["113.329624116323", "23.1365740612017"]
      }, {
        "modelName": "天香街机楼",
        "iconLocation": [],
        "modeLocation": ["113.265894902843", "23.1361724722417"]
      }, {
        "modelName": "客村机楼",
        "iconLocation": [],
        "modeLocation": ["113.309209341768", "23.1020835713711"]
      }, {
        "modelName": "江南机楼",
        "iconLocation": [],
        "modeLocation": ["113.267438105311", "23.1017091916215"]
      }, {
        "modelName": "鹭江机楼",
        "iconLocation": [],
        "modeLocation": ["113.300799211289", "23.0974545083542"]
      }, {
        "modelName": "五羊机楼",
        "iconLocation": [],
        "modeLocation": ["113.309214579526", "23.1215709732335"]
      }, {
        "modelName": "北京路机楼",
        "iconLocation": [],
        "modeLocation": ["113.26293700695", "23.1275574748982"]
      }, {
        "modelName": "流花机楼",
        "iconLocation": [],
        "modeLocation": ["113.252622378512", "23.1488884424523"]
      }, {
        "modelName": "广园机楼",
        "iconLocation": [],
        "modeLocation": ["113.2588905707", "23.1631942137906"]
      }, {
        "modelName": "工业园机楼",
        "iconLocation": [{
            "location": ["113.377468854055", "23.114265554063"],
            "name": "美林花园远端机房"
          },
          {
            "location": ["113.386872581306", "23.1477018208333"],
            "name": "棠下荷光路远端机房"
          },
          {
            "location": ["113.35224653287395", "23.115129095177218"],
            "name": "百合苑接入网机房"
          },
          {
            "location": ["113.345509061595", " 23.1469763309438"],
            "name": "职业技术师范接入网机房"
          }
        ],
        "modeLocation": ["113.366016977858", "23.1274220838625"]
      }, {
        "modelName": "沙河机楼",
        "iconLocation": [],
        "modeLocation": ["113.318247631221", "23.1668891037351"]
      }, {
        "modelName": "东圃机楼",
        "iconLocation": [],
        "modeLocation": ["113.397066790398", "23.1262448064755"]
      }, {
        "modelName": "槎龙机楼",
        "iconLocation": [],
        "modeLocation": ["113.220571369841", "23.1754895477239"]
      }, {
        "modelName": "同德机楼",
        "iconLocation": [],
        "modeLocation": ["113.229344598812", "23.1598128219894"]
      }, {
        "modelName": "石井机楼",
        "iconLocation": [],
        "modeLocation": ["113.228914359268", "23.2070672776627"]
      }, {
        "modelName": "新市机楼",
        "iconLocation": [],
        "modeLocation": ["113.253088508792", "23.1884384542777"]
      }, {
        "modelName": "汇侨机楼",
        "iconLocation": [],
        "modeLocation": ["113.253549620509", "23.2002157632738"]
      }, {
        "modelName": "西华机楼",
        "iconLocation": [],
        "modeLocation": ["113.244095244852", "23.1339103884079"]
      }, {
        "modelName": "观绿机楼",
        "iconLocation": [],
        "modeLocation": ["113.24818118014", "23.1214301091517"]
      }, {
        "modelName": "荔枝湾机楼",
        "iconLocation": [],
        "modeLocation": ["113.228948766471", "23.1277350411807"]
      }, {
        "modelName": "淘金机楼",
        "iconLocation": [],
        "modeLocation": ["113.279778246568", "23.1469971902575"]
      }, {
        "modelName": "中山四长话机楼",
        "iconLocation": [],
        "modeLocation": ["113.265415387307", "23.129547664648"]
      }, {
        "modelName": "花地机楼",
        "iconLocation": [],
        "modeLocation": ["113.229650379432", "23.0839844338088"]
      }, {
        "modelName": "芳村机楼",
        "iconLocation": [],
        "modeLocation": ["113.232654269309", "23.10085492864"]
      }, {
        "modelName": "宝岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.259682931142", "23.1011571442131"]
      }, {
        "modelName": "大沙东机楼",
        "iconLocation": [],
        "modeLocation": ["113.451864294394", "23.108291882949"]
      }, {
        "modelName": "人和机楼",
        "iconLocation": [],
        "modeLocation": ["113.293783464267", "23.332282780761"]
      }, {
        "modelName": "江村机楼",
        "iconLocation": [{
            "location": ["113.225772731228", "23.4053855533015"],
            "name": "南航花园接入网机房"
          },
          {
            "location": ["113.225710927119", "23.1635179440987"],
            "name": "岭南花园接入网机房"
          },
          {
            "location": ["113.228370418461", "23.2586382224769"],
            "name": "驿迅物流接入网机房"
          }
        ],
        "modeLocation": ["113.2266314506", "23.2777316928436"]
      }, {
        "modelName": "太和机楼",
        "iconLocation": [],
        "modeLocation": ["113.350915743905", "23.2943239338532"]
      }, {
        "modelName": "竹料机楼",
        "iconLocation": [],
        "modeLocation": ["113.367054355486", "23.3583154104678"]
      }, {
        "modelName": "钟落潭机楼",
        "iconLocation": [],
        "modeLocation": ["113.407914292975", "23.383482532325"]
      }, {
        "modelName": "同和机楼",
        "iconLocation": [],
        "modeLocation": ["113.407914292975", "23.1981089150085"]
      }, {
        "modelName": "黄埔机楼",
        "iconLocation": [],
        "modeLocation": ["113.442009058873", "23.0983470383287"]
      }, {
        "modelName": "元岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.342526225367", "23.1771318132455"]
      }, {
        "modelName": "庄头机楼",
        "iconLocation": [],
        "modeLocation": ["113.261296618469", "23.0820950598017"]
      }, {
        "modelName": "南岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.532997064687", "23.095602196311"]
      }, {
        "modelName": "数据大楼",
        "iconLocation": [],
        "modeLocation": ["113.277121691283", "23.1269091491465"]
      }, {
        "modelName": "克山机楼",
        "iconLocation": [],
        "modeLocation": ["113.241687222271", "23.1507193675631"]
      }, {
        "modelName": "新港机楼",
        "iconLocation": [],
        "modeLocation": ["113.520933824758", "23.0650753873621"]
      }, {
        "modelName": "新机场机楼",
        "iconLocation": [],
        "modeLocation": ["113.296988871003", "23.3760298753955"]
      }, {
        "modelName": "云景机楼",
        "iconLocation": [],
        "modeLocation": ["113.248637155182", "23.1744933063219"]
      }, {
        "modelName": "石基新机楼",
        "iconLocation": [],
        "modeLocation": ["113.431225872712", "22.9528695189696"]
      }, {
        "modelName": "萝岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.492005160951", "23.17870312056"]
      }, {
        "modelName": "天河软件园IDC机楼(亚太信息引擎)",
        "iconLocation": [],
        "modeLocation": ["113.408859995119", "23.1764591446515"]
      }, {
        "modelName": "大岗新机楼",
        "iconLocation": [],
        "modeLocation": ["113.396689196172", "22.8068813185154"]
      }, {
        "modelName": "石溪机楼",
        "iconLocation": [],
        "modeLocation": ["113.283449587463", "23.0690991372716"]
      }, {
        "modelName": "七星岗机楼",
        "iconLocation": [],
        "modeLocation": ["113.341492903444", "23.0845743088283"]
      }, {
        "modelName": "人民中机楼",
        "iconLocation": [],
        "modeLocation": ["113.248062938462", "23.1196531174581"]
      }, {
        "modelName": "三江2机楼",
        "iconLocation": [],
        "modeLocation": ["113.848007184961", "23.1877469709293"]
      }, {
        "modelName": "花山机楼",
        "iconLocation": [],
        "modeLocation": ["113.269809307186", "23.4535656349382"]
      }, {
        "modelName": "石滩2机楼",
        "iconLocation": [],
        "modeLocation": ["113.781923259115", "23.1827486409413"]
      }, {
        "modelName": "东莞庄机楼",
        "iconLocation": [],
        "modeLocation": ["113.330756045005", "23.158281357132"]
      }, {
        "modelName": "中新电信",
        "iconLocation": [],
        "modeLocation": ["113.6142486842", "23.2892055403827"]
      }, {
        "modelName": "龙洞机楼",
        "iconLocation": [],
        "modeLocation": ["113.366303037956", "23.1958271992667"]
      }, {
        "modelName": "沙溪IDC机楼",
        "iconLocation": [],
        "modeLocation": ["113.280273827176", "23.0758740788265"]
      }, {
        "modelName": "加速器IDC机楼",
        "iconLocation": [],
        "modeLocation": ["113.489723042186", "23.1561942061985"]
      }, {
        "modelName": "较场西IDC机楼(广州数据中心)",
        "iconLocation": [],
        "modeLocation": ["113.277113011457", "23.1271493003009"]
      }, {
        "modelName": "广州番禺东涌（德昇）数据中心",
        "iconLocation": [],
        "modeLocation": ["113.42394", "22.896573"]
      }, {
        "modelName": "广州永顺（腾讯定制）数据中心",
        "iconLocation": [],
        "modeLocation": ["113.532977", "23.214335"]
      }, {
        "modelName": "广州南沙云谷（百度定制）数据中心（一期）",
        "iconLocation": [],
        "modeLocation": ["113.526514", "22.725144"]
      }, {
        "modelName": "中国电信广州莲花山数据中心",
        "iconLocation": [],
        "modeLocation": ["113.483263", "22.985223"]
      }, {
        "modelName": "广州番禺化龙（中鼎）数据中心",
        "iconLocation": [],
        "modeLocation": ["113.467007", "23.02233"]
      }, {
        "modelName": "中国电信广州起云数据中心",
        "iconLocation": [],
        "modeLocation": ["113.42760", "23.16764"]
      }],
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
                  position: new AMap.LngLat(JSON.parse(parent.modeLocation[0]),JSON.parse(parent.modeLocation[1])), // 必须
                  scale: 0.02, // 非必须，默认1
                  height: 100,  // 非必须，默认0
                  scene: 0, // 非必须，默认0
                };
                gltfDuck.setOption(paramDuck);
                gltfDuck.rotateX(90);
                gltfDuck.rotateZ(10);
                // gltfDuck.setName = "设置的名称"
                that.object3Dlayer.add(gltfDuck);

                // console.log("加载出来的模型", gltfDuck)
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
          if((Math.abs(item.modeLocation[0] - obj.object.yl.lng) < 0.001) && (Math.abs(item.modeLocation[1] - obj.object.yl.lat) < 0.001) ) {
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
            new AMap.LngLat(JSON.parse(that.modelData[that.objIndex].modeLocation[0]), JSON.parse(that.modelData[that.objIndex].modeLocation[1])),
            new AMap.LngLat(JSON.parse(that.modelData[that.objIndex].modeLocation[0]) + deepX, JSON.parse(that.modelData[that.objIndex].modeLocation[1]) + deepY),
            new AMap.LngLat(JSON.parse(that.modelData[that.objIndex].modeLocation[0]) + deepX * 2,JSON.parse(that.modelData[that.objIndex].modeLocation[1]) + deepY * 2),
            new AMap.LngLat(JSON.parse(item.location[0]),JSON.parse(item.location[1]))
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
    // mapZoomstart() {
    //   console.log("缩放开始")
    // },
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
  .lb-module-list {
    max-height: 22rem;
    overflow: auto;
    background: inherit;
    padding-bottom: 40px;
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
