<template>
  <div class="examineDiaLog">
    <el-dialog title="资源审核" :visible.sync="dialogTableVisible">
      <div class="examineNews">
        <ul class="examineUl">
          <li class="examineLi">
            <label class="lable">申请类型</label>
            <span class="text">{{tbApplyInfo.type==1?'设备申请':'机架申请'}}</span>
          </li>
		  <li class="examineLi">
		    <label class="lable">设备名称</label>
		    <span class="text">{{tbApplyInfo.equipName}}</span>
		  </li>
          
        </ul>
        <ul class="examineUl">
			<li class="examineLi">
			  <label class="lable">机房名称</label>
			  <span class="text">{{tbApplyInfo.roomName}}</span>
			</li>
            <li class="examineLi">
              <label class="lable">电流类型</label>
            			<!-- 0交流 1直流 -->
              <span class="text">{{tbApplyInfo.currentType==0?'交流':'直流'}}</span>
            </li>
        </ul>
		<ul class="examineUl">
		  <li class="fn-w100" >
		    <label class="lable">申请备注</label>
		    <span class="text">{{tbApplyInfo.applyComment}}</span>
		  </li>
		</ul>
      </div>
      <!-- 审核过程 -->
      <div class="examineEchart">
        <div class="examE"><span class="line"></span><span>对比信息</span></div>
        <!-- 对比信息状况 -->
        <div class="examineBalance">
          <div class="passStatus Pass">
            <p class="passText nowPass">功率申请审核结果：<span>通过</span></p>
            <div style="margin-top: 24px">
              <echarts-Bar
                
                :charts="chart2"
                :EchartsId="passEcharts"
                :formatterText="formatterNumber"
              ></echarts-Bar>
            </div>
            <div class="echarts-title">
              {{ EchartsTitle }}
            </div>
          </div>
          <div class="passStatus Pass">
            <p class="passText nowPass">U位申请审核结果：<span>通过</span></p>
            <div style="margin-top: 24px">
              <echarts-Bar-copy
				
                :charts="chart2"
                :EchartsId="passEcharts2"
                :formatterText="formatterNumber"
              ></echarts-Bar-copy>
            </div>
            <div class="echarts-title">
              {{ EchartsTitle2 }}
            </div>
          </div>
          <div class="passStatus noPass">
            <div class="passParent">
              <div class="passText">
                规划审核结果：
                <el-select
                  v-model="majorApproval"
                  placeholder="请选择"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="sark">
                <div class="sarkMsg">
                  <div class="left"><img :src="cabinetIcon" alt="" /></div>
                  <div class="right">
                    <h2 class="rightH">申请专业</h2>
                    <p class="rightP" v-if="formatterNumber === 1">标准机架</p>
                    <p class="rightP" v-if="formatterNumber === 2">BBU</p>
                  </div>
                </div>
                <div class="sarkMsg">
                  <div class="left"><img :src="conditionerIco" alt="" /></div>
                  <div class="right">
                    <h2 class="rightH">机柜规划专业</h2>
                    <p class="rightP">{{contrastInfo.planMajor}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin:10px 26px;">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="remarks"
          >
          </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelApply">确认</el-button>
          <el-button @click="cancelApply">提交OA审核</el-button>
          <el-button @click="dialogTableVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- EIAC登录请求表单 -->
    <div id="EIACForm" v-show="isShowEIACForm" v-html="formStr"></div>
  </div>
</template>

<script>
import imageSrc from "../../assets/common/images";
import echartsBar from "./echartsBar";
import echartsBarCopy from "./echartsBarCopy";
import {listSearchMixin} from '../../mixin' //请求
import { api3 } from "../../api/api"; //请求
import qs from "qs";
export default {
  name: "examine",
  components: { echartsBar, echartsBarCopy },
  mixins: [listSearchMixin],
  props: {},
  data() {
    return {
      dialogTableVisible: false,
	  contrastInfo: {},
	  tbApplyInfo: {},
      cabinetIcon: imageSrc.cabinetIcon,
      conditionerIco: imageSrc.conditionerIco,
      passEcharts: "passEcharts", // 传送通过ID
      passEcharts2: "passEcharts2", // 传送通过ID
      NopassEcharts: "NopassEcharts", // 传送不通过Id值
      formatterNumberNo: 1, // 判断不通过数据展示格式
      formatterNumber: 2, // 判断通过数据展示格式
      applyIdEsc: null,
      islogineiac: false, //eiac是否已经登录
      isShowEIACForm: false, //是否显示eiac表单
      formStr: "",
      options: [
        {
          value: false,
          label: "不通过"
        },
        {
          value: true,
          label: "通过"
        }
      ],
      hackReset: false, //echarts组件销毁控制
      pass1: false, //审核1是否通过
      pass2: false, //审核2是否通过
      applyEquipmentName: "", //申请设备名称
      moduleName: "", //机房名称
      cabinetName: "", //机柜名称
      currentType: null, //电流类型
      applyMajor: "", //申请机柜专业
      planMajor: "", //规划专业
      majorApproval: null, //专业审核下拉框控制
      applyDeviceType: null, //申请类型(1:设备申请,2:机架申请)
      chart1: {}, //第一个echarts表数据对象
      chart2: {}, //第二个echarts表数据对象
      remarks: null //备注
    };
  },
  computed: {
    EchartsTitle() {
      return this.formatterNumber === 1
        ? "机房使用功率情况"
        : "机架使用功率情况";
    },
    EchartsTitle2() {
      return this.formatterNumber === 1 ? "机房空间占用比例" : "U位占用情况";
    }
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
    },
    init(applyId) {
      var that = this
      that.byIdfindApplyDetail(applyId);
	  that.show()
    },
    checkeiaclogin() {},
    eiaclogin() {},
    submitForm1() {
      document.Form1.submit();
    },
	findApplyDetail() {
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
	  let applyPower = 8;
	  chart2List1.push(applyPower); //申请功率
	  _this.chart2["list1"] = chart2List1;
	  let chart2List2 = [];
	  let unUsePower = 18;
	  chart2List2.push(unUsePower); //剩余功率
	  if (parseFloat(applyPower) <= parseFloat(unUsePower)) {
	    _this.pass2 = true;
	  }
	
	  _this.chart2["list2"] = chart2List2;
	  console.log(_this.chart1)
	  console.log(_this.chart2)
	  _this.hackReset = true;
	
	  _this.applyMajor = 1; //申请专业
	  _this.planMajor = 2; //规划专业
	},
    byIdfindApplyDetail(val) {
      var that = this
	  that.findApplyDetail()
      let param = {
        url: api3.getApplyAuditDetail + '?applyId=' + val.id,
        method: 'GET',
      }
      that.sendReq( param, (res) => {
      	// console.log(res)
      	if (res.respHeader.resultCode == 0) {
		    that.contrastInfo = res.respBody.contrastInfo
		    that.tbApplyInfo = res.respBody.tbApplyInfo
			
			that.geteChartData()
      	} else {
      	    that.$message.error(res.respHeader.message);
      	}
      })
	  
    },
	geteChartData(){
		var that = this
		console.log('进来')
		// console.log(that.contrastInfo)
		// console.log(that.tbApplyInfo)
	   let chart1List1 = [];
	   chart1List1.push((that.contrastInfo.unUseArea)*100); //已用u位数量
	   
	   that.chart1["list1"] = chart1List1;
	   let chart1List2 = [];
	   chart1List2.push((that.contrastInfo.usedArea)*100); //剩余u位数量
	   that.chart1["list2"] = chart1List2;
	   if (parseFloat((that.contrastInfo.unUseArea)*100) <= parseFloat((that.contrastInfo.usedArea)*100)) {
	     that.pass1 = true;
	   }
	   	
	   let chart2List1 = [];
	   chart2List1.push(that.contrastInfo.usedPower); //已用功率
	   that.chart2["list1"] = chart2List1;
	   let chart2List2 = [];
	   chart2List2.push(that.contrastInfo.unUsePower); //剩余功率
	   if (parseFloat(that.contrastInfo.usedPower) <= parseFloat(that.contrastInfo.unUsePower)) {
	     that.pass2 = true;
	   }
	   	
	   that.chart2["list2"] = chart2List2;
	   console.log(that.chart1)
	   console.log(that.chart2)
	   that.hackReset = true;
	   	
	   that.applyMajor = 1; //申请专业
	   that.planMajor = 2; //规划专业
	},
    applyOccupy() {},
    applyOaAgent() {},
    cancelApply() {},
    refresList() {
      this.$emit("refresList");
    },
    closeDialogTable() {
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style>
.echarts-title {
  text-align: center;
  color: #ff9800;
}
.examineDiaLog .examineNews {
  margin-bottom: 30px;
}
.examineDiaLog .el-dialog {
  background: #16284a;
}
.examineDiaLog .el-dialog__title {
  color: #fff;
  font-size: 16px;
}
.examineDiaLog .examineUl {
  height: 56px;
  line-height: 56px;
  padding: 0 26px;
  box-sizing: border-box;
  border-bottom: 1px dashed rgba(186, 205, 229, 0.23);
  zoom: 1;
}
.examineDiaLog .examineUl::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}
.examineDiaLog .examineLi {
  float: left;
  width: 50%;
}
.examineDiaLog .lable {
  font-size: 14px;
  color: #bacde5;
  text-align: left;
  margin-right: 25px;
  min-height: 56px;
  width: 84px;
  display: inline-block;
}
.examineDiaLog .text {
  font-size: 14px;
  color: #fff;
  text-align: left;
  margin-right: 47px;
  min-height: 56px;
}
.examineDiaLog .examineEchart .examE {
  font-size: 14px;
  color: #fff;
  display: flex;
  flex-direction: row;
}
.examineDiaLog .examE .line {
  width: 6px;
  height: 20px;
  background: #7187f0;
  margin-right: 14px;
}
.examineDiaLog .examineBalance {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}
.examineDiaLog .passStatus {
  width: 33%;
}
.examineDiaLog .passText {
  font-size: 14px;
  color: #fff;
  text-align: center;
  height: 36px;
  line-height: 36px;
}
.examineDiaLog .passText span {
  color: #f83535;
  font-size: 14px;
}
.examineDiaLog .nowPass span {
  color: #3bc66d;
}
.examineDiaLog .sark {
  margin-top: 24px;
}
.examineDiaLog .sarkMsg {
  display: flex;
  flex-direction: row;
  margin-bottom: 28px;
}
.examineDiaLog .sark .left {
  width: 46px;
  height: 46px;
  margin-right: 16px;
}
.examineDiaLog .sark .left img {
  width: 100%;
  height: 100%;
}
.examineDiaLog .right .rightH {
  font-size: 18px;
  color: #bacde5;
  margin-bottom: 7px;
  line-height: inherit;
}
.examineDiaLog .right .rightP {
  color: rgba(186, 205, 229, 0.5);
  font-size: 14px;
}
.examineDiaLog .dialog-footer {
  text-align: right;
}
.examineDiaLog .el-button {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  border: 1px solid rgba(186, 205, 229, 0.1);
  color: rgba(186, 205, 229, 1);
  background: rgba(22, 40, 74, 1);
  border-radius: 4px;
}
.examineDiaLog .el-button--primary {
  background: #7187f0;
  color: #fff;
}
.examineDiaLog .el-input__inner {
  background-color: transparent;
  border: 1px solid rgba(186, 205, 229, 0.2);
}
.el-textarea__inner {
  background-color: transparent;
  color: #fff;
}
.noPass {
  display: flex;
}
.passParent {
  display: inline-block;
  margin: 0 auto;
}
</style>
