<template>
  <div class="examineDiaLog">
    <el-dialog title="修改申请单基本信息" :visible.sync="dialogTableVisible">
      <div class="requestMsgContant">
        <div class="basicMsg">
          <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">申请单号</label>
              <span class="text">{{tbSysApply.code}}</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请单状态</label>
              <span class="text">{{tbSysApply.applyStatus}}</span>
            </li>
            <li class="examineLi">
              <label class="lable">申请类型</label>
              <span class="text">{{tbSysApply.type}}</span>
            </li>
			<li class="examineLi">
			  <label class="lable">申请时间</label>
			  <span class="text">{{tbSysApply.applyDate}}</span>
			</li>
          </ul>
          <!-- <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">机房编号</label>
              <span class="text">{{tbSysApply.}}</span>
            </li>
            <li class="examineLi">
              <label class="lable">机架编号</label>
              <span class="text">{{tbSysApply.}}</span>
            </li>
            <li class="examineLi">
              <label class="lable">设备编号</label>
              <span class="text">{{tbSysApply.}}</span>
            </li>
          </ul> -->
          <!-- <ul class="examineUl">
            <li class="examineLi">
              <label class="lable">资源预占结果</label>
              <span class="text">{{tbSysApply.}}</span>
            </li>
          </ul> -->
        </div>
        <!-- 可修改的信息 -->
        <ul class="examineUL2">
          <li class="examineLi2">
            <label class="examineLi2 lable">申请人</label>
            <el-input v-model="tbSysApply.applyUser" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">申请部门</label>
            <el-input v-model="tbSysApply.applyPart" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">设备名称</label>
            <el-input v-model="tbSysApply.equipName" class="examineLi2" ></el-input>
          </li>
          <li class="examineLi2">
            <label class="examineLi2 lable">申请备注</label>
            <el-input v-model="tbSysApply.applyComment" class="examineLi2" ></el-input>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
        <el-button @click="updateApplyList">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imageSrc from "../../assets/common/images";
import echartsBar from "./echartsBar";
import { api3 } from "../../api/api"; //请求
import qs from "qs";
import { listSearchMixin } from "../../mixin"; //请求
import {moment,  relativeTimeThreshold } from "moment";
import statusBar from "../preemptMessage/statusBar";
export default {
  name: "modifyApplyInfo",
  components: { echartsBar, statusBar },
  mixins: [listSearchMixin],
  props: {},
  data() {
    return {
      dialogTableVisible: false,
      applyId: null, //申请单ID
      applyStatus: null, //申请单状态
      applyType: null, //申请单类型
      occupyStatus: null, // 资源预占结果
	  tbSysApply: {},
      isBlank1: false,
      isBlank2: false,
      isBlank3: false,
      isBlank4: false
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
    },
    init(val) {
	  var that = this
	  console.log(val)
      //this.applyId = applyId;
      // this.findApplyDetail();
	  that.byIdfindApplyListDetails(val.id)
      that.show();
    },
	byIdfindApplyListDetails (id) {
	  var that = this
	  let param = {
	    url: api3.getApplyDetailById + '?applyId=' + id,
	    method: 'GET',
	    // contentType : 'application/x-www-form-urlencoded',
	    // data: qs.stringify({
		// 	'applyId': id,
		// })
	  }
	  that.sendReq( param, (res) => {
	  	console.log(res)
	  	if (res.respHeader.resultCode == 0) {
			let val = res.respBody.tbApply
			if (val.applyStatus == 1) {
				val.applyStatus = '待审核'
			} else if (val.applyStatus == 2) {
				val.type = '已审核'
			} else if (val.applyStatus == 3) {
				val.type = '已取消'
			} else if (val.applyStatus == 4) {
				val.type = 'OA审核中'
			}
			if (val.type == 1) {
				val.type = '设备申请'
			} else {
				val.type = '机架申请'
			}
			let data = new Date(val.applyDate)
			val.applyDate = data.getFullYear() + '/' + that.p(data.getMonth() + 1) + '/' + that.p(data.getDate()) 
				                 + ' ' + that.p(data.getHours()) + ':' + that.p(data.getMinutes()) + ':' + that.p(data.getSeconds())
		    that.tbSysApply = val
	  	} else {
	  	    that.$message.error(res.respHeader.message);
	  	}
	  })  
	},
	p(s) {
	  return s < 10 ? '0' + s : s
	},
	// 修改
    updateApplyList() {
      var that = this
	  if (that.tbSysApply.applyUser == '') {
		that.$message.error('申请人不为空');
		return;
	  }
	  if (that.tbSysApply.applyPart == '') {
		that.$message.error('申请部门不为空');
		return;
	  }
	  if (that.tbSysApply.equipName == '') {
		that.$message.error('设备名称不为空');
		return;
	  }
	  if (that.tbSysApply.applyComment == '') {
		that.$message.error('申请备注不为空');
		return;
	  }
	  let applyStatus = 1
	  let applyType = 1
	  if (that.tbSysApply.applyStatus == '待审核') {
	  	applyStatus = 1
	  } else if (that.tbSysApply.applyStatus == '已审核') {
	  	applyStatus = 2
	  } else if (that.tbSysApply.applyStatus == '已取消') {
	  	applyStatus = 3
	  } else if (that.tbSysApply.applyStatus == 'OA审核中') {
	  	applyStatus = 4
	  } else {
		  applyStatus = 1
	  }
	  if (that.tbSysApply.type == '设备申请') {
	  	applyType = 1
	  } else {
	  	applyType = 2
	  }
	  let data = new Date(that.tbSysApply.applyDate)
	  let param = {
	    url: api3.updateApplySelective,
	    method: 'POST',
	    // contentType : 'application/x-www-form-urlencoded',
	    data: {
            "applyComment": that.tbSysApply.applyComment,
            "applyDate": data,
            "applyPart": that.tbSysApply.applyPart,
            "applyStatus": applyStatus,
            "applyUser": that.tbSysApply.applyUser,
            "code": that.tbSysApply.code,
            "currentType": that.tbSysApply.currentType,
            "equipName": that.tbSysApply.equipName,
            "id": that.tbSysApply.id,
            "roomId": that.tbSysApply.roomId,
            "type": applyType
        }
	  }
	  that.sendReq( param, (res) => {
	  	// console.log(res)
	  	if (res.respHeader.resultCode == 0) {
			that.dialogTableVisible = false
	  		that.$message({ type: "success", message: "修改成功" });
			// let NewPage = "_empty" + "?time=" + new Date().getTime() / 500;
			// this.$router.push(NewPage);
			// this.$router.go(-1);
			that.refresList()
			// that.$router.go(0)
			// that.findApplyList();
	  	} else {
	  	  that.$message.error(res.respHeader.message);
	  	}
	  })
    },
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