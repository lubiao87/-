<template>
  <div
    class="principal"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="principalHeader"></div>
    <div class="principalContent">
      <!-- 指示栏 -->
      <!-- <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar> -->
      <!-- 中间模块 -->
      <div class="parinciRepresent">
        <div class="parinci">
          <!-- form表单组件插入 -->
		  <el-select v-model="sourceType" placeholder="请选择" @change='sourceTypeChange'>
		   <el-option 
			v-for="item in foremostDataVal"
			:key="item.value"
			:label="item.label"
			:value="item.value">
		   </el-option>
		  </el-select>
		  <el-select v-model="district" placeholder="所属区域" @change='districtChange'>
		   <el-option 
				v-for="item in districtSelectList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
		   </el-option>
		  </el-select>
		  <el-row class="demo-autocomplete" style="display: inline-block;top: 14px;margin-left:20px;width: 40%;">
		    
		    <el-col :span="12">
		      <!-- <div class="sub-title">输入后匹配输入建议</div> -->
		      <el-autocomplete
		        class="inline-input"
		        v-model="state2"
		        :fetch-suggestions="querySearch"
		        :placeholder="placeholder"
		        :trigger-on-focus="false"
		        @select="handleSelect"
		      ></el-autocomplete>
		    </el-col>
		  </el-row>
          <!-- 申请信息table数据 -->
          <div class="parinciRepreTable" >
            <el-table 
              :data="tableData"
              style="width: 100%"
              @selection-change="changeFun"
            >
              <!-- <el-table-column type="selection" width="50"></el-table-column> -->
			  <el-table-column
			    v-if="sourceType == 1"
			    prop="name"
			    label="机楼名称"
			  	align="center"
			    :key="1"
			  ></el-table-column>
              <el-table-column
                v-if="sourceType == 1"
                prop="area"
                label="机楼面积（m²）"
				align="center"
                :key="2"
              ></el-table-column>
              <el-table-column
                v-if="sourceType == 1"
                prop="district"
                label="所属区域"
				align="center"
                :key="6"
              ></el-table-column>
              <el-table-column
                v-if="sourceType == 2"
                prop="name"
                label="接入间名称"
				align="center"
                :key="9"
              ></el-table-column>
              <el-table-column
                v-if="sourceType == 2"
                prop="district"
                label="所属区域"
				align="center"
                :key="21"
              ></el-table-column>
              <el-table-column
                v-if="sourceType == 2"
                prop="area"
                label="接入间面积（m²）"
				align="center"
                :key="34"
              ></el-table-column>
			  <el-table-column label="操作" align="center">
			        <template slot-scope="scope">
			          <el-button
			            size="mini" type="primary"
			            @click="handleEdit(scope.$index, scope.row)">{{sourceType==1?'管理机房': '管理机机架'}}</el-button>
			        </template>
			      </el-table-column>
             </el-table>
          </div>
          <!-- 分页 -->
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
    </div>
    <moduleBar
      ref="moduleBar"
      :moduleHandleType="moduleHandleType"
      @moduleUpdate="moduleUpdate"
    >
    </moduleBar>
    <cabinetBar
      ref="cabinetBar"
      :cabinetHandleType="cabinetHandleType"
      @cabinetUpdate="cabinetUpdate"
    >
    </cabinetBar>
  </div>
</template>

<script>
import StatusBar from "./statusBar"; // 模块指示栏组件
import imagesSrc from "../../assets/common/images"; // 图片管理文件
import importFeed from "./importFeed"; // form表单组件注册
import paging from "./paging"; // 分页
import qs from "qs";
import { listSearchMixin } from "../../mixin"; //请求
import { api } from "../../api/api"; //请求
import moduleBar from "./moduleBar"; //微模块修改添加
import cabinetBar from "./cabinetBar"; //机架修改添加
export default {
  name: "maintainList",
  components: { StatusBar, importFeed, paging, moduleBar, cabinetBar },
  mixins: [listSearchMixin],
  mounted: function() {},
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  data() {
    return {
      loading: false,
      barNames: "可维护资源列表", // 指示栏名称
      nabarCation: imagesSrc.nabarCation, // 图片
      applicationStatus: "请选择资源类型",
	  placeholder: '请按机楼名称查询',
      district: "所属区域",
      currentStatus: 2, // 根据当前判断时间选择器或者输入框那个展示
      sourceType: 1, //资源类型（1：微机楼，2：机柜）
      cabinetHandleType: 1, //机柜弹出框操作类型（1：添加，2修改）
      moduleHandleType: 1, //微模块弹出框操作类型（1：添加，2修改）
      county_id: null,
      sourceName: null,
      page: 1,
      pageSize: 10,
      multipleSelection: [], //选择行
      foremostDataVal: [
        {
          value: 1,
          label: "机楼"
        },
        {
          value: 2,
          label: "接入间"
        }
      ], // 资源类型
      buildSelectList: [
        { label: "", value: "" },
        { label: "青云机楼", value: 1 },
        { label: "工业园机楼", value: 2 },
        { label: "跑马场机楼", value: 3 }
      ],
      buildTip: "请选择所属机楼",
      districtSelectList: [
        { label: "所属区域", value: "" },
        { label: "天河区", value: 1 },
        { label: "荔湾区", value: 2 },
        { label: "白云区", value: 3 }
      ],
      districtTip: "请选择所属区域",
      statusSelectList: [
        { label: "", value: "" },
        { label: "规划中", value: 0 },
        { label: "已规划", value: 2 }
      ],
      statusTip: "请选择机房状态",
      secondDataVal: [], // 区域列表
      tableParams: {
        total: 0,
        size: 10,
        currentPage4: 1
      },
      tableData: [],
	  
	  tableHead:[
		  {sourceType: 1, prop: 'name', label: '所属机房',  key: '1'},
		  {sourceType: 1, prop: 'moduleRoomName', label: '所在房间号', key: '2' },
		  {sourceType: 1, prop: 'dCPower', label: '所在楼层', key: '4' },
	  ],
    };
  },
  watch: {},
  methods: {
    init() {
      // this.getOrganList();
      this.findResourceList();
    },
	handleEdit(index, row) {
	  console.log(index, row);
	  row.type = this.sourceType
	  if(this.sourceType === 2){
		  this.pushPage('/frameList', row)
	  } else {
		  this.pushPage('/machineRoomList', row)
	  }
	  
	},
	sourceTypeChange (e) {
	  console.log(e)
	  console.log('我点击了')
	  if(this.sourceType === 2){
		  this.placeholder = '请按接入间名称查询'
	  } else {
		  this.placeholder = '请按机楼名称查询'
	  }
	  this.findResourceList();
	},
    examineVerify() {},
    changeFun(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    // buildingUpdate (row) {
    //     this.$refs.buildingUpdateBar.show(row);
    // },
    // machineModuleRoomUpdate(row){
    //     this.$refs.machineModuleRoomUpdateBar.show(row);
    // },
    moduleUpdateBar(row) {
      this.$refs.moduleBar.show(row);
    },
    cabinetUpdateBar(row) {
      this.$refs.cabinetBar.show(row);
    },
    findResourceList() {
      let _this = this;
	  console.log(_this.sourceType)
      var paramData = {};
      if (_this.sourceName != null && _this.sourceName != "") {
        paramData["sourceName"] = _this.sourceName;
      }
      if (_this.sourceType != null && _this.sourceType != "") {
        paramData["sourceType"] = _this.sourceType;
      }
      paramData["page"] = _this.page;
      paramData["pageSize"] = _this.pageSize;
      let param = {
        url: api.resourcePlaningList,
        data: paramData
      };
      // 模拟数据
      let res = {};
	  console.log("_this.sourceType:",_this.sourceType)
      if (_this.sourceType === 1) {
        res = {
          respBody: {
            total: 2,
            rows: [
              {
                aCPower: "青云机楼",
                area: 300,
                code: "001DC",
                column: "10",
                dCPower: "一楼",
                height: 2,
                longth: 15,
                moduleId: 1,
                moduleRoomName: "001",
                name: "一楼001机楼",
                planStatus: 2,
                roomId: 3,
                district: "天河区",
                totalMachineCount: 200,
                totalMachineTime: "2019年1月11日 12:00",
                width: 20
              },
              {
                aCPower: "青云机楼",
                area: 400,
                code: "002DC",
                column: "1",
                dCPower: "二楼",
                height: 5,
                longth: 20,
                moduleId: 2,
                moduleRoomName: "002",
                name: "二楼002机楼",
                planStatus: 0,
                roomId: 1,
                district: "荔湾区",
                totalMachineCount: 100,
                totalMachineTime: "2019年2月",
                width: 20
              }
            ]
          },
          respHeader: {
            resultCode: 0,
            message: "正确执行"
          }
        };
      }

      if (_this.sourceType === 2) {
        res = {
          respBody: {
            total: 4,
            rows: [
              {
                cabinetId: 1,
                cabinetStatus: 2,
                cabinetType: 1,
                code: "jc-1",
                column: "B",
                currentType: 2,
                height: 1,
                longth: 2,
                major: "DDF机架",
                remainStandCabient: "2",
                totalStandCabient: "100",
                moduleId: 9,
                moduleName: "一楼001机房",
                buildName: "青云机楼",
                district: "天河区",
                area: "306",
                name: "2号接入间",
                power: 100,
                usePower: 40,
                row: "2",
                totalUnitCount: 30,
                unuseUnitCount: 20,
                width: 2,
                totalMachineTime: "2019年1月11日 12:00",
                dataSources: "手动录入"
              },
              {
                cabinetId: 2,
                cabinetStatus: 2,
                cabinetType: 1,
                code: "jc-1",
                column: "B",
                currentType: 2,
                height: 2,
                longth: 3,
                major: "ODF机架",
                remainStandCabient: "34",
                totalStandCabient: "39",
                moduleId: 9,
                moduleName: "二楼002机房",
                buildName: "跑马场机楼",
                district: "荔湾区",
                area: "850",
                name: "3号接入间",
                power: 200,
                usePower: 50,
                row: "2",
                totalUnitCount: 42,
                unuseUnitCount: 22,
                width: 2,
                totalMachineTime: "2019年1月11日 12:00",
                dataSources: "资源同步"
              },
              {
                cabinetId: 3,
                cabinetStatus: 2,
                cabinetType: 1,
                code: "jc-1",
                column: "B",
                currentType: 2,
                height: 1,
                longth: 2,
                major: "ODF机架",
                remainStandCabient: "20",
                totalStandCabient: "100",
                moduleId: 9,
                moduleName: "五楼005机房",
                buildName: "工业园机楼",
                district: "荔湾区",
                area: "560",
                name: "4号接入间",
                power: 200,
                usePower: 30,
                row: "2",
                totalUnitCount: 34,
                unuseUnitCount: 30,
                width: 4,
                totalMachineTime: "2019年1月11日 12:00",
                dataSources: "手动录入"
              },
              {
                cabinetId: 4,
                cabinetStatus: 2,
                cabinetType: 1,
                code: "jc-1",
                column: "B",
                currentType: 2,
                height: 2,
                longth: 2,
                major: "ODF机架",
                remainStandCabient: "20",
                totalStandCabient: "100",
                moduleId: 9,
                moduleName: "三楼003机房",
                buildName: "跑马场机楼",
                district: "白云区",
                area: "450",
                name: "5号接入间",
                power: 290,
                usePower: 80,
                row: "2",
                totalUnitCount: 30,
                unuseUnitCount: 18,
                width: 3,
                totalMachineTime: "2019年1月11日 12:00",
                dataSources: "手动录入"
              }
            ]
          },
          respHeader: {
            resultCode: 0,
            message: "正确执行"
          }
        };
      }
      if (res.respHeader.resultCode == 0) {
        _this.tableData = res.respBody.rows;
        _this.tableParams.total = res.respBody.total;
      } else {
        this.$message.error(res.respHeader.message);
      }
      // 请求后台接口
       _this.sendReq(param, (res) => {
			if(res.respHeader.resultCode == 0){
				_this.tableData = res.respBody.rows;
				_this.tableParams.total = res.respBody.total;
			}else{
				this.$message.error(res.respHeader.message);
			}
		}) 
    },
    submitList(formInline) {
      console.log("submitList");
      console.log(formInline);
      let _this = this;
      _this.countyId = formInline.county_id;
      _this.sourceType = formInline.sourceType;
      _this.sourceName = formInline.sourceName;
      _this.findResourceList();
    },
    getOrganList() {
      let _this = this;
      let param = {
        url: api.getOrganListNoYingFu
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          _this.secondDataVal = res.respBody.data;
        } else {
          this.$message.error(res.respHeader.message);
        }
      });
    },
    tableRow(row, event, column) {
      //跳转详情页面
      let _this = this;
      let param = {};
      param["sourceType"] = _this.sourceType;
      if (_this.sourceType == 1) {
        param["sourceId"] = row["buildingId"];
      } else if (_this.sourceType == 2) {
        param["sourceId"] = row["moduleRoomId"];
      } else if (_this.sourceType == 3) {
        param["sourceId"] = row["moduleId"];
      }
      _this.pushPage("/micromoduleDetal", param);
      // this.$refs.examine.show()
    },
    moduleFormatter(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "规划中";
      } else if (cellValue == 1) {
        return "已预占";
      } else if (cellValue == 2) {
        return "已规划";
      } else {
        return "暂无数据";
      }
    },
    powerFormatter(row, column, cellValue, index) {
      return cellValue + " Kw";
    },
    specFormatter(row, column, cellValue, index) {
      return cellValue + " m";
    },
    currentFormatter(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "直流";
      } else if (cellValue == 2) {
        return "交流";
      } else {
        return "暂无数据";
      }
    },
    cabinetStatusFormatter(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "规划中";
      } else if (cellValue == 1) {
        return "已预占";
      } else if (cellValue == 2) {
        return "已规划";
      } else {
        return "暂无数据";
      }
    },
    pushPage(url, param) {
      this.$router.push({ path: url, query: param });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.findResourceList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findResourceList();
    },
    // updateBuilding(val){
    //     let _this = this;
    //     let param = {
    //         url: api.buildingUpdate,
    //         data: val
    //     }
    //     _this.sendReq(param, (res) => {
    //         if(res.respHeader.resultCode == 0){
    //             this.$message({type: 'success',message: '修改成功'});
    //             _this.findResourceList();
    //         }else{
    //             this.$message.error(res.respHeader.message);
    //         }
    //     })
    // },
    // updateModuleRoom(val){
    //     let _this = this;
    //     let param = {
    //         url: api.moduleRoomUpdate,
    //         data: val
    //     }
    //     _this.sendReq(param, (res) => {
    //         if(res.respHeader.resultCode == 0){
    //             this.$message({type: 'success',message: '修改成功'});
    //             _this.findResourceList();
    //         }else{
    //             this.$message.error(res.respHeader.message);
    //         }
    //     })
    // },
    moduleUpdate(val) {
      let _this = this;
      let param = {
        url: api.moduleUpdate,
        data: val
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          this.$message({ type: "success", message: "修改成功" });
          _this.findResourceList();
        } else {
          this.$message.error(res.respHeader.message);
        }
      });
    },
    cabinetUpdate(val) {
      let _this = this;
      let param = {
        url: api.cabinetUpdate,
        data: val
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          this.$message({ type: "success", message: "修改成功" });
          _this.findResourceList();
        } else {
          this.$message.error(res.respHeader.message);
        }
      });
    },
    addModule() {
      console.log("addModule");
      this.moduleHandleType = 1;
      this.moduleUpdateBar(null);
    },
    addCabinet() {
      console.log("addCabinet");
      this.cabinetHandleType = 1;
      this.cabinetUpdateBar(null);
    },
    loadingFn(e) {
      console.log("loading", e);
      this.loading = e;
    },
    editSource() {
      console.log("editSource");
      //修改资源
      if (this.multipleSelection.length < 1) {
        this.$message.error("请勾选需要修改的资源");
        return;
      } else if (this.multipleSelection.length > 1) {
        this.$message.error("一次只能修改一条资源");
        return;
      }
      if (this.sourceType == 1) {
        this.moduleHandleType = 2;
        this.moduleUpdateBar(this.multipleSelection[0]);
      } else {
        this.cabinetHandleType = 2;
        this.cabinetUpdateBar(this.multipleSelection[0]);
      }
    },
    deleteSource() {
      console.log("editSource");
      let _this = this;
      if (_this.multipleSelection.length < 1) {
        _this.$message.error("请勾选需要修改的资源");
        return;
      }
      this.$confirm(
        this.sourceType == 1
          ? "确定删除所选机房及所属机架和设备？"
          : "确定删除所选机架及所属设备？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (_this.sourceType == 1) {
            let moduleIds = _this.getModuleSelectIdStr();
            _this.deleteModules(moduleIds);
          } else {
            let cabinetIds = _this.getCabinetSelectIdStr();
            _this.deleteCabinets(cabinetIds);
          }
        })
        .catch(() => {});
    },
    getModuleSelectIdStr() {
      //获取选择模块的id拼接字符串 1,2,3,
      let ids = "";
      this.multipleSelection.forEach(function(val, i) {
        ids += val["moduleId"] + ",";
      });
      return ids;
    },
    getCabinetSelectIdStr() {
      //获取选择机架的id拼接字符串 1,2,3,
      let ids = "";
      this.multipleSelection.forEach(function(val, i) {
        ids += val["cabinetId"] + ",";
      });
      return ids;
    },
    deleteModules(ids) {
      //删除勾选微模块
      let _this = this;
      let paramData = {};
      paramData["moduleIds"] = ids;
      let param = {
        url: api.moduleDelete,
        data: qs.stringify(paramData),
        contentType: "application/x-www-form-urlencoded"
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          this.$message({ type: "success", message: "删除成功" });
        } else {
          this.$message.error(res.respHeader.message);
        }
        _this.findResourceList();
      });
    },
    deleteCabinets(ids) {
      //删除勾选机柜
      let _this = this;
      let paramData = {};
      paramData["cabinetIds"] = ids;
      let param = {
        url: api.cabinetDelete,
        data: qs.stringify(paramData),
        contentType: "application/x-www-form-urlencoded"
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          this.$message({ type: "success", message: "删除成功" });
        } else {
          this.$message.error(res.respHeader.message);
        }
        _this.findResourceList();
      });
    }
  },
  watch: {
    applicationStatus(val) {
      console.log("multipleSelection", val);
    }
  }
};
</script>

<style scoped lang="scss">
.parinciRepresent::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
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
  height: 100%;
  width: 100%;
  overflow: hidden;
  .principalHeader {
    height: 70px;
  }
  .principalContent {
    flex: 1;
    display: flex;
    flex-direction: column;
    .parinciRepresent {
      padding: 30px 98px;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
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
.parinciRepreTable .el-button span {
  color: #7187f0;
}
</style>
