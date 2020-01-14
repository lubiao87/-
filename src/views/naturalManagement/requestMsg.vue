<template>
  <div class="requestMsg">
    <!-- 状态栏提示 -->
    <status-Bar :barName="barName" :point="point" :barImg="barImg"></status-Bar>
    <!-- 基本信息 -->
    <div class="contant">
      <div class="requestMsgContant">
        <div class="basicMsg">
          <div class="examE">
            <span class="line"></span><span>基本信息</span>
          </div>
          <ul class="examineUl firstChild">
            <li class="examineLi">
              <label class="lable">申请单号</label>
              <span class="text">20191016002</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请单状态</label>
              <span class="text">待审核</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请类型</label>
              <span class="text">机架申请</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">资源预占结果</label>
              <span class="text">预占申请中</span>
            </li>
            <li class="examineLi">
              <label class="lable">设备名称</label>
              <span class="text">2U服务器机架4</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请人</label>
              <span class="text">李四</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">申请单位</label>
              <span class="text">网络部</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请时间</label>
              <span class="text">2019-10-11 17:08:19</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请备注</label>
              <span class="text">现有资源不够</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">机房编号</label>
              <span class="text"> 001DC</span>
            </li>
            <li class="examineLi">
              <label class="lable">机架编号</label>
              <span class="text"> jc-62</span>
            </li>
            <li class="examineLi">
              <label class="lable">设备编号</label>
              <span class="text">eq-110</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="requestMsgContant">
        <div class="basicMsg">
          <div class="examE">
            <span class="line"></span><span>资源审核信息</span>
          </div>
          <ul class="examineUl firstChild">
            <li class="examineLi2">
              <label class="lable">申请机架名称</label>
              <span class="text">2U服务器机架</span>
            </li>
            <li class="examineLi2">
              <label class="lable">机房名称</label>
              <span class="text">天河花山002DC</span>
            </li>
            <li class="examineLi2">
              <label class="lable">机柜名称</label>
              <span class="text"> jc-62</span>
            </li>
            <li class="examineLi2">
              <label class="lable">所属区域</label>
              <span class="text">天河</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi2">
              <label class="lable">申请机架专业</label>
              <span class="text"> 机柜</span>
            </li>
            <li class="examineLi2">
              <label class="lable">机柜专业</label>
              <span class="text">服务器</span>
            </li>
            <li class="examineLi2">
              <label class="lable">专业审核结果</label>
              <span class="text">待审核</span>
            </li>
          </ul>
          <div class="requestMsgEchart">
            <!--功率申请审核结果-->
            <div class="passStatus Pass">
              <p class="passText noPass">功率申请审核结果：<span>通过</span></p>
              <div style="margin-top: 24px">
                <echarts-Bar
                  v-if="hackReset"
                  :charts="chart2"
                  :EchartsId="msgPassEcharts"
                  :formatterText="formatterNumber"
                ></echarts-Bar>
              </div>
            </div>
          </div>
          <!-- 审核记录 -->
          <div class="parinciRepreTable">
            <el-table
              :data="recordLogList"
              height="250"
              border
              style="width: 100%"
            >
              <!-- <el-table-column prop="auditingStatus" label="操作类型" width="180" :formatter="auditingStatusFormatter"></el-table-column>
					<el-table-column prop="operatorUserName"  label="操作人"  width="180"></el-table-column>
					<el-table-column prop="operatorTime" label="操作时间" :formatter="dateFormat"></el-table-column>
					<el-table-column prop="occupyStatus" label="资源预占状态" :formatter="occupyStatusFormatter"></el-table-column>
					<el-table-column prop="remarks" label="备注"></el-table-column> -->
              <el-table-column
                prop="czlx"
                label="操作类型"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="czr"
                label="操作人"
                width="180"
              ></el-table-column>
              <el-table-column prop="czsj" label="操作时间"></el-table-column>
              <el-table-column
                prop="zyyzzt"
                label="资源预占状态"
              ></el-table-column>
              <el-table-column prop="bz" label="备注"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import statusBar from "../preemptMessage/statusBar";
import echartsBar from "./echartsBar";
import imgSrc from "../../assets/common/images";
// import {api} from '../../api/api' //请求
import qs from "qs";
// import {listSearchMixin} from '../../mixin' //请求
import moment from "moment";

export default {
  name: "requestMsg",
  components: { statusBar, echartsBar },
  // mixins: [listSearchMixin],
  data() {
    return {
      oaAgent: {
        operatorUserName: null,
        createDate: null,
        auditingPeople: null,
        applyDate: null,
        auditingResult: null,
        auditingComment: null
      },
      orgName: null,
      isShowOaAgent: true,
      recordLogList: [
        {
          czlx: "生成预占信息",
          czr: "李四",
          czsj: "2019-10-11 17:08:19",
          zyyzzt: "已预占",
          bz: "现有资源不够"
        },
        {
          czlx: "初步审核",
          czr: "赵六",
          czsj: "2019-10-12 09:38:25",
          zyyzzt: "已预占",
          bz: "同意"
        }
      ],
      barName: "申请单列表 ",
      point: " / 详情",
      barImg: imgSrc.navbarIconZero,
      //     echartsId
      msgNopassEcharts: "msgNopassEcharts",
      msgPassEcharts: "msgPassEcharts", // 图标ID
      formatterNumberNo: 1, // 判断提示语展示格式
      formatterNumber: 2,
      chart1: {},
      chart2: {},
      hackReset: false, // 是否展示
      applyId: null, //申请单ID
      applyStatus: null, //申请单状态
      applyType: null, //申请单类型
      occupyStatus: null, //资源预占结果
      pass1: false, //审核1是否通过
      pass2: false, //审核2是否通过
      applyDeviceType: null, //申请类型(1:设备申请,2:机架申请)
      applyMajor: null, //申请专业
      planMajor: null, //机柜专业
      majorApplyStatus: null, //专业审核结果
      applyEquipmentName: null, //申请设备名称
      moduleName: null, //机房名称
      cabinetName: null, //机柜名称
      currentType: null, //电流类型
      tbSysApply: {
        code: "",
        equipmentName: "",
        applyUser: "",
        applyEmployer: "",
        applyDate: "",
        applyComment: "",
        moduleCode: "",
        cabinetCode: "",
        equipmentCode: ""
      }
    };
  },
  mounted() {
    //this.applyId = this.$route.query.applyId;
    this.init();
  },
  methods: {
    init() {
      this.defaultData();
      let self = this;
      this.applyDetail();
      // this.openRecordDialog();
    },
    defaultData() {
      (this.oaAgent = {
        operatorUserName: null,
        createDate: null,
        auditingPeople: null,
        applyDate: null,
        auditingResult: null,
        auditingComment: null
      }),
        (this.isShowOaAgent = true),
        (this.recordLogList = [
          {
            czlx: "生成预占信息",
            czr: "李四",
            czsj: "2019-10-11 17:08:19",
            zyyzzt: "已预占",
            bz: "现有资源不够"
          },
          {
            czlx: "初步审核",
            czr: "赵六",
            czsj: "2019-10-12 09:38:25",
            zyyzzt: "已预占",
            bz: "同意"
          }
        ]),
        (this.barImg = imgSrc.navbarIconZero),
        (this.formatterNumberNo = 1), // 判断提示语展示格式
        (this.formatterNumber = 2),
        (this.chart1 = {}),
        (this.chart2 = {}),
        (this.hackReset = false), // 是否展示
        (this.applyStatus = null), //申请单状态
        (this.applyType = null), //申请单类型
        (this.occupyStatus = null), //资源预占结果
        (this.pass1 = false), //审核1是否通过
        (this.pass2 = false), //审核2是否通过
        (this.applyDeviceType = null), //申请类型(1:设备申请,2:机架申请)
        (this.applyMajor = null), //申请专业
        (this.planMajor = null), //机柜专业
        (this.majorApplyStatus = null), //专业审核结果
        (this.applyEquipmentName = null), //申请设备名称
        (this.moduleName = null), //机房名称
        (this.cabinetName = null), //机柜名称
        (this.currentType = null), //电流类型
        (this.tbSysApply = {
          code: "",
          equipmentName: "",
          applyUser: "",
          applyEmployer: "",
          applyDate: "",
          applyComment: "",
          moduleCode: "",
          cabinetCode: "",
          equipmentCode: ""
        });
    },
    applyDetail() {
      let _this = this;
      let chart1List1 = [];
      let applyCount = 88;
      chart1List1.push(applyCount); //申请u位数量
      _this.chart1["list1"] = chart1List1;

      let chart1List2 = [];
      let unUseCount = 120;
      chart1List2.push(unUseCount); //剩余u位数量
      _this.chart1["list2"] = chart1List2;
      if (parseFloat(applyCount) <= parseFloat(unUseCount)) {
        _this.pass1 = true;
      }

      let chart2List1 = [];
      let applyPower = 26;
      chart2List1.push(applyPower); //申请功率
      _this.chart2["list1"] = chart2List1;

      let chart2List2 = [];
      let unUsePower = 78;
      chart2List2.push(unUsePower); //剩余功率
      if (parseFloat(applyPower) <= parseFloat(unUsePower)) {
        _this.pass2 = true;
      }

      _this.chart2["list2"] = chart2List2;
      _this.hackReset = true;

      _this.applyMajor = 1; //申请专业
      _this.planMajor = 2; //规划专业
    }
  }
};
</script>

<style scoped lang="scss">
.contant::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}

.contant::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 4px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
  background: rgba(11, 24, 41, 0.4);
}

.contant::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
  border-radius: 4px;
  background: transparent;
}
.requestMsg {
  padding-top: 70px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
  .contant {
    padding: 30px 130px;
    box-sizing: border-box;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .requestMsgContant {
      margin-bottom: 20px;
      .basicMsg {
        padding: 30px;
        box-sizing: border-box;
        background: rgba(21, 34, 66, 0.5);
        .examE {
          font-size: 14px;
          color: #fff;
          display: flex;
          flex-direction: row;
          .line {
            width: 6px;
            height: 20px;
            background: #7187f0;
            margin-right: 14px;
          }
        }
        .examineUl {
          height: 56px;
          line-height: 56px;
          padding: 0 26px;
          box-sizing: border-box;
          border-bottom: 1px dashed rgba(186, 205, 229, 0.23);
          zoom: 1;
          .examineLi {
            float: left;
            width: 33.3%;
            .lable {
              font-size: 14px;
              color: #bacde5;
              text-align: left;
              margin-right: 25px;
              min-height: 56px;
              width: 84px;
              display: inline-block;
            }
            .text {
              font-size: 14px;
              color: #fff;
              text-align: left;
              margin-right: 47px;
              min-height: 56px;
            }
          }
          .examineLi2 {
            float: left;
            width: 25%;
            .lable {
              font-size: 14px;
              color: #bacde5;
              text-align: left;
              margin-right: 25px;
              min-height: 56px;
              width: 84px;
              display: inline-block;
            }
            .text {
              font-size: 14px;
              color: #fff;
              text-align: left;
              margin-right: 47px;
              min-height: 56px;
            }
          }
        }
        .examineUl::after {
          content: "";
          height: 0;
          display: block;
          clear: both;
        }
        .firstChild {
          margin-top: 20px;
        }
        .examineUl:last-child {
          margin-bottom: 20px;
        }
        /* 柱状图样式 */
        .requestMsgEchart {
          margin-top: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .passStatus {
            width: 33%;
            p {
              text-align: center;
            }
            .noPass {
              display: inherit;
              span {
                color: #f83535;
              }
            }
            .passText {
              span {
                color: #3bc66d;
              }
            }
          }
        }
      }
    }
  }
}
</style>
