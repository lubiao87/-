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
		  <!-- <div class="sub-title">输入后匹配输入建议</div> -->
		  <el-autocomplete style="width: 20%; "
			class="fn-d-i-b"
			v-model="searchName"
			:fetch-suggestions="querySearch"
			placeholder="请按机房名称、所属机楼查询"
			:trigger-on-focus="false"
			@select="handleSelect"
		  ></el-autocomplete>
		  <el-select  v-model="importantLevel" placeholder="重要等级" @change='importantLevelListChange'>
		   <el-option 
			v-for="item in importantLevelList"
			:key="item.value"
			:label="item.label"
			:value="item.value">
		   </el-option>
		  </el-select>
		  <el-select class="fn-mr030" v-model="examinePower" placeholder="审核权限" @change='examinePowerListChange'>
		   <el-option 
				v-for="item in examinePowerList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
		   </el-option>
		  </el-select>
		  <div class="fn-mt14 fn-d-i-b">
			  <el-button type='primary' @click="showAddRoom">新增机房</el-button>
			  <el-button type='primary' @click="showUpdateRoomSelective">修改</el-button>
			  <el-button type='primary' @click="deleteLists">删除</el-button>
		  </div>
          <!-- 申请信息table数据 -->
          <div class="parinciRepreTable" >
            <el-table 
              :data="tableData"
              class="fn-w100"
			  height="600"
              @selection-change="changeFun"
            >
              <el-table-column type="selection" width="50"></el-table-column>
			  <el-table-column
			    prop="createTime"
			    label="创建时间"
			  	align="center"
			    :key="1"
			  ></el-table-column>
			  <el-table-column
			    prop="name"
			    label="机房名称"
			  	align="center"
			    :key="2"
			  ></el-table-column>
			  <el-table-column
			    prop="roomNo"
			    label="房间号"
			  	align="center"
			    :key="3"
			  ></el-table-column>
			  <el-table-column
			    prop="floorName"
			    label="所在楼层"
			  	align="center"
			    :key="4"
			  ></el-table-column>
			  <el-table-column
			    prop="buildName"
			    label="所属机楼"
			  	align="center"
			    :key="5"
			  ></el-table-column>
			  <el-table-column
			    prop="countyName"
			    label="所属区域"
			  	align="center"
			    :key="6"
			  ></el-table-column>
              <el-table-column
                prop="measureArea"
                label="机房面积（m²）"
				align="center"
                :key="7"
              ></el-table-column>
              <el-table-column
                prop="frameTotalCount"
                label="可放机架数"
				align="center"
                :key="8"
              ></el-table-column>
              <el-table-column
                prop="importantLevel"
                label="重要等级"
				align="center"
                :key="9"
              ></el-table-column>
              <el-table-column
                prop="examinePower"
                label="审核权限"
				align="center"
                :key="10"
              ></el-table-column>
			  <el-table-column label="操作" align="center">
				<template slot-scope="scope">
				  <el-button
					size="mini" type="primary"
					@click="handleEdit(scope.$index, scope.row)">管理机架</el-button>
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
	<el-dialog :title="addOrUpdateTitle" :visible.sync="addRoom" custom-class="dialogClass" width="54%">
	  <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
	    <el-form-item class="fn-d-i-b"
		prop="name"
		:rules="[ { required: true, message: '机房名称不能为空'},]"
		 label="机房名称:" :label-width="formLabelWidth">
	      <el-input v-model="form.name" placeholder="请输入机房名称" autocomplete="off" class="fn-m-220"></el-input>
	    </el-form-item>
	  		<el-form-item class="fn-d-i-b"
			 prop="frameTotalCount"
			 :rules="[ { required: true, message: '可放机架数不能为空'},{ type: 'number', message: '可放机架数必须为数字值'}]"
			 label="可放机架数:" :label-width="formLabelWidth">
	  		  <el-input v-model.number="form.frameTotalCount" placeholder="请输入可放机架数" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b"
			 prop="frameTotalCount"
			 :rules="[ { required: true, message: '编码不能为空'},]"
			 label="编码:" :label-width="formLabelWidth">
	  		  <el-input v-model="form.code" placeholder="请输入编码" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
			<el-form-item class="fn-d-i-b"
			 prop="rsId"
			 :rules="[ { required: true, message: '资源系统ID不能为空'},]"
			 label="资源系统ID:" :label-width="formLabelWidth">
			  <el-input v-model="form.rsId" :readonly="rsIdReadonly" placeholder="请输入资源系统ID" autocomplete="off" class="fn-m-220"></el-input>
			</el-form-item>
	  		<el-form-item class="fn-d-i-b"
			prop="length" :rules="[{ required: true, message: '机房长度不能为空'},{ type: 'number', message: '机房长度必须为数字值'}]"
			 label="机房长度(cm):" :label-width="formLabelWidth">
	  		  <el-input v-model.number="form.length" placeholder="请输入机房长度" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="房间号:" :label-width="formLabelWidth">
	  		  <el-input v-model="form.roomNo" placeholder="请输入房间号" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="机房宽度(cm):"
			 prop="width" :rules="[{ required: true, message: '机房宽度不能为空'},{ type: 'number', message: '机房宽度必须为数字值'}]"
			 :label-width="formLabelWidth">
	  		  <el-input v-model.number="form.width" placeholder="请输入机房宽度" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
			<el-form-item class="fn-d-i-b" label="所在楼层:" :label-width="formLabelWidth">
			  <el-select v-model="form.floorId"  placeholder="请选择所在楼层" class="fn-m-220">
			    <el-option v-for="item in floorList" :key="item.value" :label="item.name" :value="item.floorId"></el-option>
			  </el-select>
			</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="机房高度(cm):"
			 prop="height" :rules="[{ required: true, message: '机房高度不能为空'},{ type: 'number', message: '机房高度必须为数字值'}]"
			 :label-width="formLabelWidth">
	  		  <el-input v-model.number="form.height" placeholder="请输入机房高度" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
			<el-form-item class="fn-d-i-b" label="所属机楼:" :label-width="formLabelWidth">
			  <el-input v-model="buildName" readonly="true" autocomplete="off" class="fn-m-220 "></el-input>
			</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="外电开关容量:" 
			prop="switchCapacity" :rules="[{ required: true, message: '外电开关容量不能为空'},{ type: 'number', message: '外电开关容量必须为数字值'}]"
			:label-width="formLabelWidth">
	  		  <el-input v-model.number="form.switchCapacity" placeholder="请输入外电开关容量" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="所属区域:" :label-width="formLabelWidth">
	  		  <el-input v-model="countyName" readonly="true" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="是否租用:" :label-width="formLabelWidth">
	  		  <el-select v-model="form.isRent" placeholder="请选择是否租用" class="fn-m-220">
	  		    <el-option label="是" value="Y"></el-option>
	  		    <el-option label="否" value="N"></el-option>
	  		  </el-select>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="机房面积(㎡):"
			 prop="measureArea" :rules="[{ required: true, message: '机房面积不能为空'},{ type: 'number', message: '机房面积必须为数字值'}]"
			 :label-width="formLabelWidth">
	  		  <el-input v-model.number="form.measureArea" placeholder="请输入机房面积" autocomplete="off" class="fn-m-220"></el-input>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="机房类型:" :label-width="formLabelWidth">
	  		  <el-select v-model="form.accessType" placeholder="请选择机房类型" class="fn-m-220">
	  		    <el-option label="综合接入局" value='0'></el-option>
	  		    <el-option label="接入间" value='1'></el-option>
	  		    <el-option label="智慧机房" value='2'></el-option>
	  		  </el-select>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="重要等级:" :label-width="formLabelWidth">
	  		  <el-select v-model="form.importantLevel" placeholder="请选择重要等级" class="fn-m-220">
	  		    <el-option label="A" value="A"></el-option>
	  		    <el-option label="B" value="B"></el-option>
	  		    <el-option label="C" value="C"></el-option>
	  		  </el-select>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="是否直供电:" :label-width="formLabelWidth">
	  		  <el-select v-model="form.isPowerSupply" placeholder="请选择是否直供电" class="fn-m-220">
	  		    <el-option label="是" value="Y"></el-option>
	  		    <el-option label="否" value="N"></el-option>
	  		  </el-select>
	  		</el-form-item>
	  		<el-form-item class="fn-d-i-b" label="审核权限:" :label-width="formLabelWidth">
	  		  <el-select v-model="form.examinePower" placeholder="请选择审核权限" class="fn-m-220">
	  		    <el-option label="省级" value="省级"></el-option>
	  		    <el-option label="市级" value="市级"></el-option>
	  		    <el-option label="县级" value="县级"></el-option>
	  		  </el-select>
	  		</el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="addRoom = false">取 消</el-button>
	    <el-button  type="primary" v-if="addOrUpdateTitle === '新增机房'" @click="addList('form')">新 增</el-button>
	    <el-button type="primary" v-if="addOrUpdateTitle === '修改机房'" @click="updataList('form')">修 改</el-button>
	  </div>
	</el-dialog>
	
  </div>
</template>

<script>
import StatusBar from "./statusBar"; // 模块指示栏组件
import imagesSrc from "../../assets/common/images"; // 图片管理文件
import importFeed from "./importFeed"; // form表单组件注册
import paging from "./paging"; // 分页
import qs from "qs";
import { listSearchMixin } from "../../mixin"; //请求
import { api, api3 } from "../../api/api"; //请求
import moduleBar from "./moduleBar"; //微模块修改添加
import cabinetBar from "./cabinetBar"; //机架修改添加
export default {
  name: "maintainList",
  components: { StatusBar, importFeed, paging, moduleBar, cabinetBar },
  mixins: [listSearchMixin],
  mounted () {},
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  data() {
    return {
      loading: false,
      addRoom: false,
	  buildId:'',
	  countyId: '', // 区域id
	  floorId: '',
	  floorList: [], // 所属机楼所有楼层列表
	  countyName: '', //所属区域名称
	  buildName: '',
	  rsIdReadonly: false,
	  byRoomIdForDetailsList: {}, //根据roomId查询对应详情列表
	  addOrUpdateTitle: '新增机房',
      barNames: "可维护资源列表", // 指示栏名称
      nabarCation: imagesSrc.nabarCation, // 图片
      applicationStatus: "请选择资源类型",
	  placeholder: '请按机楼名称查询',
      district: "所属区域",
      searchName: "",
	  searchNameList: [],
      importantLevel: "",
	  examinePower: "",
      currentStatus: 2, // 根据当前判断时间选择器或者输入框那个展示
      sourceType: 1, //资源类型（1：微机楼，2：机柜）
      cabinetHandleType: 1, //机柜弹出框操作类型（1：添加，2修改）
      moduleHandleType: 1, //微模块弹出框操作类型（1：添加，2修改）
      county_id: null,
      sourceName: null,
      page: 1,
      pageSize: 10,
      multipleSelection: [], //选择行
	  form: {
		"rsId": "",
		"code": "",
		"name": "",
		"roomNo": "",
		"buildId": '',
		"floorId": "",
		"length": '',
		"width": '',
		"height": '',
		"countyId": "",
		"countyName": "",
		"measureArea": '',
		"importantLevel": "A",
		"examinePower": "市级",
		"switchCapacity": '',
		"isRent": "Y",
		"accessType": '2',  // 机房类型(0：综合接入局，1：接入间，2：智慧机房)
		"isPowerSupply": "Y",
		"frameTotalCount": '' // 可放机架总数
	  },
	  formLabelWidth: '140px',
	  // 重要等级列表
      importantLevelList: [
		{value: "", label: "重要等级"},
        {value: 'A', label: "A"},
        {value: 'B', label: "B"},
        {value: 'C', label: "C"},
      ], 
      buildSelectList: [
        { label: "", value: "" },
        { label: "青云机楼", value: 1 },
        { label: "工业园机楼", value: 2 },
        { label: "跑马场机楼", value: 3 }
      ],
      buildTip: "请选择所属机楼",
	  // 审核权限列表
      examinePowerList: [
        { label: "审核权限", value: "" },
        { label: "区级", value: '区级' },
        { label: "省级", value: '省级' },
        { label: "市级", value: '市级' },
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
  created () {},
  methods: {
	init() {
		var that = this
		let query = that.$route.query
		that.sourceType = query.sourceType
		that.countyName = query.countyName
		that.countyId = query.countyId
		that.buildName = query.name
		that.buildId = query.rsId
		that.getRoomListByParamPage();
		that.floorLists();
		that.form = {
			"code": "",
			"name": "",
			"roomNo": "",
			"buildId": that.buildId,
			"floorId": "",
			"length": '',
			"width": '',
			"height": '',
			"countyId": that.countyId,
			"countyName": that.countyName,
			"measureArea": '',
			"importantLevel": "",
			"examinePower": "",
			"switchCapacity": '',
			"isRent": "Y",
			"accessType": '',  // 机房类型(0：综合接入局，1：接入间，2：智慧机房)
			"isPowerSupply": "Y",
			"frameTotalCount": '' // 可放机架总数
	    }
	},
	floorLists () {
		var that = this
		let param = {
		  url: api3.getFloorListByBuildId+'?buildId=' + that.$route.query.rsId,
		  method: 'GET',
		}
		that.sendReq( param, (res) => {
			// console.log(res)
			that.floorList = res.respBody.floorList
		})
	},
	// 修改
	showUpdateRoomSelective() {
	  var that = this
	  // console.log("修改所选行");
	  console.log(that.multipleSelection);
	  //修改资源
	  if (that.multipleSelection.length < 1) {
	    that.$message.error("请勾选需要修改的资源");
	    return;
	  } else if (that.multipleSelection.length > 1) {
	    that.$message.error("一次只能修改一条资源");
	    return;
	  }
	  that.byRoomIdForDetails(that.multipleSelection[0].rsId);
	},
	// 修改数据
	updateRoomData () {
		var that = this
		that.addOrUpdateTitle = '修改机房'
		that.rsIdReadonly = true
		that.addRoom = true
		that.form = that.byRoomIdForDetailsList
	},
	// 根据roomId查询对应列表详情
	byRoomIdForDetails (id) {
		var that = this
		let param = {
		  url: api3.getRoomDetailById+'?roomId=' + id,
		  method: 'GET',
		}
		that.sendReq( param, (res) => {
			// console.log(res)
			if (res.respHeader.resultCode == 0) {
				that.byRoomIdForDetailsList = res.respBody.tbRoom
				that.updateRoomData()
			} else {
			  that.$message.error(res.respHeader.message);
			}
		})
	},
	// 修改列表
	updataList (formName) {
		var that = this
		this.$refs[formName].validate((valid) => {
		  if (valid) {
			// alert('submit!');
			let param = {
			  url: api3.updateRoomSelective,
			  method: 'POST',
			  // contentType : 'application/x-www-form-urlencoded',
			  data: that.form
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.$message({ type: "success", message: "修改成功" });
					that.addRoom = false
					that.rsIdReadonly = false
					that.getRoomListByParamPage()
				} else {
				  that.$message.error(res.respHeader.message);
				}
			})
		  } else {
		    that.$message.error('必填项不可为空');
			// console.log('error submit!!');
			return false;
		  }
		});
	},
	// 显示新增机房列表
	showAddRoom () {
		var that = this
		that.form = {
			"code": "",
			"name": "",
			"roomNo": "",
			"buildId": that.$route.query.buildId,
			"floorId": "",
			"length": '',
			"width": '',
			"height": '',
			"countyId": that.$route.query.countyId,
			"countyName": that.$route.query.countyName,
			"measureArea": '',
			"importantLevel": "",
			"examinePower": "",
			"switchCapacity": '',
			"isRent": "Y",
			"accessType": '',  // 机房类型(0：综合接入局，1：接入间，2：智慧机房)
			"isPowerSupply": "Y",
			"frameTotalCount": '' // 可放机架总数
		}
		that.addRoom = true
		that.rsIdReadonly = false
		that.addOrUpdateTitle = '新增机房'
	},
	// 新增列表
	addList (formName) {
		var that = this
		// console.log(that.form)
		this.$refs[formName].validate((valid) => {
		  if (valid) {
			// alert('submit!');
			let param = {
			  url: api3.insertRoomSelective,
			  method: 'POST',
			  // contentType : 'application/x-www-form-urlencoded',
			  data: that.form
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.$message({ type: "success", message: "新增成功" });
					that.addRoom = false
					that.getRoomListByParamPage()
				} else {
				  that.$message.error(res.respHeader.message);
				}
			})
		  } else {
			that.$message.error('必填项不可为空');
			// console.log('error submit!!');
			return false;
		  }
		});
	},
	getRoomListByParamPage () {
	  var that = this
	  console.log(that.$route.query)
	  let param = {
		  url: api3.getRoomListByParamPage,
		  method: 'POST',
		  contentType : 'application/x-www-form-urlencoded',
		  data: qs.stringify({
			  'page': that.page,
			  'pageSize': that.pageSize,
			  'buildName': that.$route.query.name, // 机楼名称
			  'roomName': that.searchName, // 机房名称
			  'importantLevel': that.importantLevel, // 重要等级
			  'examinePower': that.examinePower, // 审核权限
			  'buildId': that.$route.query.rsId // 机楼rsId
		  })
	  }
	  that.sendReq( param, (res) => {
		// console.log(res)
		if (res.respHeader.resultCode == 0) {
			res.respBody.data.list.forEach((val) =>{
				// console.log(val.createTime)
				let data = new Date(val.createTime)
				val.createTime = data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + data.getDate()
				// let time = new Date(parseInt(val.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
				// console.log(val.createTime)
			})
		    that.tableData = res.respBody.data.list;
		    that.tableParams.total = res.respBody.data.totals;
		} else {
		  that.$message.error(res.respHeader.message);
		}
	  })
	},
	querySearch (queryString, cb) {
	  var that = this
	  let param = {
		  url: api3.getRoomListByParamPage,
		  method: 'POST',
		  contentType : 'application/x-www-form-urlencoded',
		  data: qs.stringify({
			  'page': 1,
			  'pageSize': 100,
			  'buildName': that.$route.query.name, // 机楼名称
			  'roomName': that.searchName, // 机房名称
			  'importantLevel': '', // 重要等级
			  'examinePower': '', // 审核权限
			  'buildId': that.$route.query.rsId // 机楼rsId
		  })
	  }
	  that.sendReq( param, (res) => {
	  		// console.log(res)
	  		if (res.respHeader.resultCode == 0) {
	  			that.searchNameList = res.respBody.data.list;
	  			that.searchNameList.forEach((val) => {
				  val.value = val.name
	  			})
	  			let results = that.searchNameList
	  			cb(results)
	  		} else {
	  		  that.$message.error(res.respHeader.message);
	  		}
	  })
	},
	handleSelect(item) {
	  // console.log('开始搜索');
	  // console.log(item);
	  this.getRoomListByParamPage()
	},
	handleEdit(index, row) {
	  row.sourceType = this.sourceType
	  // console.log(index, row);
	  this.pushPage('/frameList', row)
	},
	importantLevelListChange (e) {
	  this.importantLevel = e
	  // if(this.sourceType === 2){
		 //  this.placeholder = '请按接入间名称查询'
	  // } else {
		 //  this.placeholder = '请按机楼名称查询'
	  // }
	  this.getRoomListByParamPage();
	},
	examinePowerListChange (e) {
	  this.examinePower = e
	  // if(this.sourceType === 2){
		 //  this.placeholder = '请按接入间名称查询'
	  // } else {
		 //  this.placeholder = '请按机楼名称查询'
	  // }
	  this.getRoomListByParamPage();
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
	// 页面跳转封装
    pushPage(url, param) {
      this.$router.push({ path: url, query: param });
    },
	// 改变请求数据返回量
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.getRoomListByParamPage();
    },
	// 改变当前页请求
    handleCurrentChange(val) {
      this.page = val;
      this.getRoomListByParamPage();
    },
	// 选择列表监听
    changeFun(val) {
      // console.log(val);
      this.multipleSelection = val;
    },
	// 批量删除
    deleteLists() {
      // console.log("批量删除");
      let that = this;
      if (that.multipleSelection.length < 1) {
        that.$message.error("请勾选需要删除的机房列表");
        return;
      }
      this.$confirm(
        "确定删除所选机房列表？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
            let roomIds = that.getRoomSelectIdStr();
            that.deleteRoomLists(roomIds);
        })
        .catch(() => {});
    },
    getRoomSelectIdStr() {
      //获取选择机架的id拼接字符串 1,2,3,
      let ids = "";
      this.multipleSelection.forEach((val) => {
        ids += val["rsId"] + ",";
      });
      return ids;
    },
    // 请求接口进行删除数据
    deleteRoomLists(ids) {
      //删除勾选到的机房
      let _this = this;
      let paramData = {};
      paramData["roomIdList"] = ids;
      let param = {
        url: api3.batchDeleteRoom,
        data: qs.stringify(paramData),
        contentType: "application/x-www-form-urlencoded"
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          this.$message({ type: "success", message: "删除成功" });
        } else {
          this.$message.error(res.respHeader.message);
        }
        _this.getRoomListByParamPage();
      });
    }
  },
  watch: {
    applicationStatus(val) {
      console.log("multipleSelection", val);
    }
  },
};
</script>

<style scoped lang="scss">

.button-list {
  margin-top:14px;
  margin-left:30%; 
  // display: inline-block;
}
.display-inline-block {
  display: inline-block;
}
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
	  margin-top: 50px;
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
.el-form-item__label {
	color: #0086B3;
}
.dialogClass {
	background-color: #FFFFFF;
}
.custonStyle>div:nth-child(1){
　　background-color: #FFFFFF;
}
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

