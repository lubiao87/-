<template>
  <div class="principal">
    <div class="principalHeader"></div>
    <div class="principalContent">
      <!-- 指示栏 -->
      <!--
            <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
            -->
      <!-- 中间模块 start -->
      <div class="parinciRepresent">
        <div class="parinci">
          <import-Feed
			    inputPlaceholder = '请按申请单号、申请人、申请部门查询'
          		fristPlaceholder="请选择申请类型"
          		:fristStatusList="fristStatusList"
          		secondPlaceholder="请选择申请状态"
          		:secondStatusList="secondStatusList"
                  @onSubmit = "submitList">
          </import-Feed>
          <div class="parinciRepreTable parinciRepresent">
            <el-table
              :data="tableData"
              style="width: 100%"
			  height="550"
              @row-click="tableThink"
            >
              <el-table-column prop="code" label="申请单号" width="180" align="center"></el-table-column>
              <el-table-column prop="applyUser" label="申请人" align="center" ></el-table-column>
              <el-table-column prop="applyPart" label="申请部门" align="center" ></el-table-column>
              <el-table-column prop="applyDate" label="申请时间" width="180" align="center"></el-table-column>
              <el-table-column prop="type" label="申请类型" width="180" align="center"></el-table-column>
              <el-table-column prop="applyStatus" label="申请状态" width="180" align="center"></el-table-column>
              
              <el-table-column label="操作" width="190" header-align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click.stop="examineVerify(scope.row)"
                    :class="'applyButton'"
                    >审核</el-button
                  >
                  <el-button type="text" @click.stop="openRecordDialog()"
                    >审核记录</el-button
                  >
                  <el-button
                    type="text"
                    @click.stop="requestApplyInfo(scope.row)"
                    :class="'applyButton'"
                    >修改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <paging
            :paginaTotal="tableParams.total"
            :pageSize="tableParams.size"
            :currentPage4="tableParams.currentPage4"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          >
          </paging>
        </div>
      </div>
      <!-- 中间模块 end -->
    </div>
    <examine ref="examine" @refresList="refresList"></examine>
    <modifyApplyInfo
      ref="modifyApplyInfo"
      @refresList="refresList"
    ></modifyApplyInfo>

    <el-dialog
      title="审核记录"
      :visible.sync="recordDialog"
      :close-on-click-modal="false"
      class="dialog_sele"
      custom-class="el-dialog--small"
    >
      <div class="parinciRepreTable parinciRepresent">
        <div style="color: #BACDE5;height: 32px;">申请单号：20191016002</div>
        <el-table :data="recordLogList" height="250" border style="width: 100%">
          <el-table-column prop="czlx" label="操作类型"></el-table-column>
          <el-table-column prop="czr" label="操作人"></el-table-column>
          <el-table-column
            prop="czsj"
            label="操作时间"
            width="100"
          ></el-table-column>
          <el-table-column prop="zyyzzt" label="资源预占状态"></el-table-column>
          <el-table-column prop="bz" label="备注" width="100"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import StatusBar from "./statusBar"; // 模块指示栏组件
import imagesSrc from "../../assets/common/images"; // 图片管理文件
import importFeed from "../preemptMessage/importFeed"; // form表单组件注册
import paging from "./paging"; // 分页
import {api3} from '../../api/api' //请求
import { listSearchMixin } from "../../mixin"; //请求
import examine from "./examine"; // 资源审核
import modifyApplyInfo from "./modifyApplyInfo"; // 申请单基本信息
export default {
  name: "userManagement",
  components: { StatusBar, importFeed, paging, examine, modifyApplyInfo },
  mixins: [listSearchMixin],
  mounted: function() {
    // document.Form1.submit()
    //this.init();
  },
  data() {
    return {
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
      ], //审核记录
      applyCode: "", //申请单号
      recordDialog: false, //审核记录弹窗
      barNames: "申请单信息", // 指示栏名称
      nabarCation: imagesSrc.nabarCation, // 图片
      applicationStatus: "请选择申请状态",
      sqlxOn: "请选择申请类型",
      CampOn: "请选择预占结果",
      flowState: null,
      occupyStatus: null,
      dateVal: null,
      state: null, //浏览器业务回调参数，当前代表审核单id
      page: 1,
      pageSize: 10,
      currentStatus: 1, // 根据当前判断时间选择器或者输入框那个展示
	  searchName: '',
	  type: '',
	  applyStatus: '',
	  initialTime:"",
	  startTime: '',
	  endTime: '',
	  fristStatusList: [
	    { value: 1, label: "设备申请"},
	    {value: 2, label: "机架申请"},
	    
	  ],
	  secondStatusList: [
	    { value: 1, label: "待审核"},
	    {value: 2, label: "已审核"},
	    {value: 3, label: "已取消"},
	    {value: 4, label: "OA审核中"},
	    
	  ],
      tableParams: {
        total: 0,
        size: 10,
        currentPage4: 1
      },
      tableData: [],
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  methods: {
	init () {
	   var that = this
	   that.findApplyList();
	},
    submitList(val) {
      var that = this
      that.searchName = val.name;
      that.type = val.fristStatus;
      that.applyStatus = val.secondStatus;
      console.log(val)
      if (val.initialTime != null && val.initialTime != ''){
        var d1 = new Date(val.initialTime[0])
        var d2 = new Date(val.initialTime[1])
        that.startTime = d1.getFullYear() + '-' + that.p(d1.getMonth() + 1) + '-' + that.p(d1.getDate())
        that.endTime = d2.getFullYear() + '-' + that.p(d2.getMonth() + 1) + '-' + that.p(d2.getDate())
      }
      that.findApplyList();
    },
	p(s) {
	  return s < 10 ? '0' + s : s
	},
	findApplyList(){
	  var that = this
	  let param = {
	    url: api3.getApplyListByParamPage,
	    method: 'POST',
	    contentType : 'application/x-www-form-urlencoded',
	    data: qs.stringify({
			'page': that.page,
			'pageSize': that.pageSize,
			'name': that.searchName,
			'type': that.type,
			'applyStatus': that.applyStatus,
			'startTime': that.startTime,
			'endTime': that.endTime,
		})
	  }
	  that.sendReq( param, (res) => {
	  	console.log(res)
	  	if (res.respHeader.resultCode == 0) {
			res.respBody.data.list.forEach((val) => {
				
				if (val.applyStatus == 1) {
					val.applyStatus = '待审核'
				} else if (val.applyStatus == 2) {
					val.applyStatus = '已审核'
				} else if (val.applyStatus == 3) {
					val.applyStatus = '已取消'
				} else if (val.applyStatus == 4) {
					val.applyStatus = 'OA审核中'
				}
				if (val.type == 1) {
					val.type = '设备申请'
				} else {
					val.type = '机架申请'
				}
				let data = new Date(val.applyDate)
				val.applyDate = data.getFullYear() + '/' + that.p(data.getMonth() + 1) + '/' + that.p(data.getDate()) 
				                 + ' ' + that.p(data.getHours()) + ':' + that.p(data.getMinutes()) + ':' + that.p(data.getSeconds())
			})
		  that.tableData = res.respBody.data.list
		  that.tableParams.total = res.respBody.data.totals;
	  	} else {
	  	  that.$message.error(res.respHeader.message);
	  	}
	  })  
	},
    refresList() {
      this.init();
    },
    tableThink(row, column, event) {
      this.$router.push({ path: "/requestMsg", 
	  query: {
		  row: row,
		  column: column,
		  event: event,
		  } ,
	  });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.findApplyList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findApplyList();
    },
    requestApplyInfo(data) {
      this.$refs.modifyApplyInfo.init(data);
    },
    examineVerify(data) {
      //alert("hjk");
      // console.log(data);
      this.$refs.examine.init(data);
    },
    openRecordDialog() {
      this.recordDialog = true;
    }
  }
};
</script>

<style scoped lang="scss">
.parinciRepresent::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
  display: none;
}

.parinciRepresent::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 4px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
  background: rgba(11, 24, 41, 0.4);
}

.parinciRepresent::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
  border-radius: 4px;
  background: transparent;
}
.principal {
  display: flex;
  flex-direction: column;
  // height:100%;
  width: 100%;
  overflow: hidden;
  .principalHeader {
    height: 70px;
  }
  .principalContent {
    flex: 1;
    display: flex;
    flex-direction: column;
    // height: 100%;
    .parinciRepresent {
      padding: 30px 98px;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
      height: 100%;
      .parinci {
        padding: 31px 33px 41px 33px;
        box-sizing: border-box;
        background: rgba(29, 45, 85, 0.5);
      }
    }

    /* 表格样式 */
    .parinciRepreTable {
      padding: 27px 0 20px 0;
      box-sizing: border-box;
      overflow: scroll;
      height: 100%;
    }
  }
}
</style>

<style>
/*表格样式 */
.parinciRepreTable .el-table tr {
  background-color: transparent;
  cursor: pointer;
}
.parinciRepreTable .el-table th {
  background-color: #2e3a62;
}
.parinciRepreTable .el-table__footer-wrapper thead div,
.el-table__header-wrapper thead div {
  background-color: #2e3a62;
  font-size: 14px;
  font-weight: normal;
  color: #fff;
}
.parinciRepreTable .el-table {
  color: #bacde5;
  font-size: 14px;
}
/* .parinciRepreTable .el-button span{
        color: #7187F0;
    } */
.applyButton {
  color: #7187f0;
}
.unApplyButton {
  color: #7187f0;
  opacity: 0.5;
}
</style>
