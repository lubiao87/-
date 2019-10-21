<template>
  <div class="examineDiaLog">
    <el-dialog title="申请单基本信息" :visible.sync="dialogTableVisible">
      <div class="requestMsgContant">
        <div class="basicMsg">
          <ul class="examineUl">
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
              <span class="text">设备申请</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">机房编号</label>
              <span class="text">001DC</span>
            </li>
            <li class="examineLi">
              <label class="lable">机架编号</label>
              <span class="text">jc-62</span>
            </li>
            <li class="examineLi">
              <label class="lable">设备编号</label>
              <span class="text">eq-110</span>
            </li>
          </ul>
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">资源预占结果</label>
              <span class="text">已成功</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请时间</label>
              <span class="text">2019-10-11 17:08</span>
            </li>
          </ul>
        </div>
        <!-- 可修改的信息 -->
        <ul class="examineUL2">
          <li class="examineLi2">
            <label class="examineLi2 lable">申请人</label>
            <el-input v-model="tbSysApply.sqr" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">申请单位</label>
            <el-input v-model="tbSysApply.sqdw" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">设备名称</label>
            <el-input v-model="tbSysApply.sbmc" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">申请备注</label>
            <el-input v-model="tbSysApply.sqbz" class="examineLi2" ></el-input>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
        <el-button @click="modifyApplyInfo">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imageSrc from "../../assets/common/images";
import echartsBar from "./echartsBar";
import { api } from "../../api/api"; //请求
import qs from "qs";
import moment, { relativeTimeThreshold } from "moment";
import statusBar from "../preemptMessage/statusBar";
export default {
  name: "modifyApplyInfo",
  components: { echartsBar, statusBar },
  //mixins: [listSearchMixin],
  props: {},
  data() {
    return {
      dialogTableVisible: false,
      applyId: null, //申请单ID
      applyStatus: null, //申请单状态
      applyType: null, //申请单类型
      occupyStatus: null, // 资源预占结果
      tbSysApply: {
        code: null,
        equipmentName: null,
        applyUser: null,
        moduleCode: null, // 机房编号
        cabinetCode: null, // 机架编号
        equipmentCode: null, // 设备编号
        applyEmployer: null, // 申请单位
        applyDate: null,
        applyComment: null,
        sqr:'李四',
        sqdw:'网络部',
        sbmc:'2U服务器机架4',
        sqbz:'现有资源不够'
      },
      isBlank1: false,
      isBlank2: false,
      isBlank3: false,
      isBlank4: false
    };
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
    },
    init() {
      //this.applyId = applyId;
      // this.findApplyDetail();
      this.show();
    },
    modifyApplyInfo() {
      
    },
    closeDialogTable() {
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style>
.examineDiaLog .examineNews {
  margin-bottom: 30px;
}
.examineDiaLog .el-dialog {
  background: #16284a;
  min-width: 670px;
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
.examineDiaLog .examineUL2 {
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
.examineDiaLog .examineLi2 {
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