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
		  <div class="fn-fs16 fn-lh24">
			  <el-radio v-model="radio" label="1">新增机架</el-radio>
			  <el-radio v-model="radio" label="2">新增其他物体</el-radio>
		  </div>
		  <!-- <div class="sub-title">输入后匹配输入建议</div> -->
		  <el-autocomplete style="width: 20%; "
			class="fn-d-i-b"
			v-model="state2"
			:fetch-suggestions="querySearch"
			placeholder="请按机房名称、所属机楼查询"
			:trigger-on-focus="false"
			@select="handleSelect"
		  ></el-autocomplete>
		  <el-select  v-model="sourceType" placeholder="请选择" @change='sourceTypeChange'>
		   <el-option 
			v-for="item in foremostDataVal"
			:key="item.value"
			:label="item.label"
			:value="item.value">
		   </el-option>
		  </el-select>
		  <el-select class="fn-mr025" v-model="district" placeholder="所属区域" @change='districtChange'>
		   <el-option 
				v-for="item in districtSelectList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
		   </el-option>
		  </el-select>
		  <div class="fn-mt14 fn-d-i-b">
			  <el-button>导入</el-button>
			  <el-button v-if="radio === '1'" @click="add1 = true">新增机架</el-button>
			  <el-button v-if="radio === '2'" @click="add1 = true">新增其他物体</el-button>
			  <el-button>修改</el-button>
			  <el-button>删除</el-button>
		  </div>
          <!-- 申请信息table数据 -->
          <div class="parinciRepreTable">
            <el-table 
              :data="tableData"
              class="fn-w100"
			  height= '600'
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
			    v-if=" radio === '1'"
			    prop="name"
			    label="机架名称"
			  	align="center"
			    :key="2"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '2'"
			    prop="name"
			    label="物体名称"
			  	align="center"
			    :key="3"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '1'"
			    prop="frameSource"
			    label="机架来源"
			  	align="center"
			    :key="4"
			  ></el-table-column>
			  <el-table-column
			    v-if="sourceType == 1 "
			    prop="buildName"
			    label="所属机楼"
			  	align="center"
			    :key="6"
			  ></el-table-column>
			  <el-table-column
			    v-if="sourceType == 1"
			    prop="roomName"
			    label="所属机房"
			  	align="center"
			    :key="5"
			  ></el-table-column>
			  
			  <el-table-column
			    v-if="sourceType == 2 "
			    prop="name"
			    label="所属接入间"
			  	align="center"
			    :key="7"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '1'"
			    prop="countyName"
			    label="所属区域"
			  	align="center"
			    :key="8"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '1'"
			    prop="type"
			    label="机架类型"
			  	align="center"
			    :key="9"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '2'"
			    prop="type"
			    label="物体类型"
			  	align="center"
			    :key="10"
			  ></el-table-column>
			  <el-table-column
			    v-if=" radio === '1'"
			    prop="standardCabinetTotal"
			    label="可放标准机柜总数"
			  	align="center"
			    :key="11"
			  ></el-table-column>
              <el-table-column
                v-if=" radio === '1'"
                prop="totalU"
                label="机架总U位"
				align="center"
                :key="12"
              ></el-table-column>
			  <el-table-column
			    v-if=" radio === '2'"
			    prop="area"
			    label="物体长度(cm)"
				align="center"
			    :key="13"
			  ></el-table-column>
              <el-table-column
                v-if=" radio === '2'"
                prop="area"
                label="物体宽度(cm)"
				align="center"
                :key="14"
              ></el-table-column>
			  <el-table-column
			    v-if=" radio === '2'"
			    prop="area"
			    label="物体高度(cm)"
				align="center"
			    :key="15"
			  ></el-table-column>
			  <el-table-column label="操作" align="center">
			        <template slot-scope="scope">
			          <el-button
			            size="mini" type="primary"
			            @click="handleEdit(scope.$index, scope.row)">管理设备</el-button>
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
	<el-dialog title="新增" :visible.sync="add1" custom-class="dialogClass" width="50%">
	  <el-form :model="form" v-if="radio === '1'">
	    <el-form-item class="fn-d-i-b" prop="form.name" 
		:rules="[ { required: true, message: '机架名称不能为空'},
				  { type: 'number', message: '年龄必须为数字值'}]"
	    label="机架名称:" :label-width="formLabelWidth">
	      <el-input v-model="form.name" placeholder="请输入机架名称" autocomplete="off" class="fn-m-220"></el-input>
	    </el-form-item>
		<el-form-item class="fn-d-i-b" label="编码:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入编码" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType === '2'" class="fn-d-i-b" label="所属接入间:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机楼" class="fn-m-220">
		    <el-option label="接入间一" value="shanghai"></el-option>
		    <el-option label="接入间二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item v-if="sourceType === '1'" class="fn-d-i-b" label="所属机楼:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机楼" class="fn-m-220">
		    <el-option label="机楼一" value="shanghai"></el-option>
		    <el-option label="机楼二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		
		<el-form-item v-if="sourceType === '1'" class="fn-d-i-b" label="所属机房:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机房" class="fn-m-220">
		    <el-option label="机房一" value="shanghai"></el-option>
		    <el-option label="机房二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架类型:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择机架类型" class="fn-m-220">
		    <el-option label="机架一" value="shanghai"></el-option>
		    <el-option label="机架二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="可放标准机柜总数:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入可放标准机柜总数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架总U位:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入机架总U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架可用U位:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入机架可用U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架长度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架宽度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架高度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="额定功率(KW):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入额定功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="使用功率(KW):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入使用功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="列号:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入列号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="位号:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入位号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
	    <el-form-item class="fn-d-i-b" label="所属区域:" :label-width="formLabelWidth">
	      <el-select v-model="form.region" placeholder="请选择所属区域" class="fn-m-220">
	        <el-option label="区域一" value="shanghai"></el-option>
	        <el-option label="区域二" value="beijing"></el-option>
	      </el-select>
	    </el-form-item>
		<el-form-item class="fn-d-i-b" label="退网设备数:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入退网设备数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="退网设备所占U位:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入退网设备所占U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架来源:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择机架来源" class="fn-m-220">
		    <el-option label="手动录入" value="shanghai"></el-option>
		    <el-option label="资源录入" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="是否租用:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择活动区域" class="fn-m-220">
		    <el-option label="是" value="shanghai"></el-option>
		    <el-option label="否" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="额定电压(v):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入额定电压" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="所属列头柜:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属列头柜" class="fn-m-220">
		    <el-option label="是" value="shanghai"></el-option>
		    <el-option label="否" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		
	  </el-form>
	  <el-form :model="form" v-if="radio === '2'">
	    <el-form-item class="fn-d-i-b" prop="form.name" 
	  		:rules="[ { required: true, message: '物体名称不能为空'}]"
	    label="物体名称:" :label-width="formLabelWidth">
	      <el-input v-model="form.name" placeholder="请输入物体名称" autocomplete="off" class="fn-m-220"></el-input>
	    </el-form-item>
		<el-form-item class="fn-d-i-b" label="编码:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入编码" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType === 2" class="fn-d-i-b" label="所属接入间:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机楼" class="fn-m-220">
			<el-option label="接入间一" value="shanghai"></el-option>
			<el-option label="接入间二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item v-if="sourceType === 1" class="fn-d-i-b" label="所属机楼:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机楼" class="fn-m-220">
			<el-option label="机楼一" value="shanghai"></el-option>
			<el-option label="机楼二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item v-if="sourceType === 1" class="fn-d-i-b" label="所属机房:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择所属机房" class="fn-m-220">
			<el-option label="机房一" value="shanghai"></el-option>
			<el-option label="机房二" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体类型:" :label-width="formLabelWidth">
		  <el-select v-model="form.region" placeholder="请选择机架类型" class="fn-m-220">
			<el-option label="列头柜" value="shanghai"></el-option>
			<el-option label="其他" value="beijing"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="输出屏:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入输出屏" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="整流器:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入整流器" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="低压系统开关:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入低压系统开关" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="上联设备编号:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入上联设备编号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体长度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体宽度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体高度(cm):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="额定功率(KW):" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入额定功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="变压器:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入变压器" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="变电站:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入变电站" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="整流器数:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入整流器数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="列号:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入列号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if='true' class="fn-d-i-b" label="位号:" :label-width="formLabelWidth">
		  <el-input v-model="form.name" placeholder="请输入位号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="addRoom = false">取 消</el-button>
	    <el-button type="primary" @click="addRoom = false">确 定</el-button>
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
  mounted: function() {},
  beforeRouteEnter: function(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  data() {
    return {
      loading: false,
      add1: false,
	  radio: '1',
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
	  formLabelWidth: '140px',
	  form: {
	  		name: '',
	  		region: '',
	  		date1: '',
	  		date2: '',
	  		delivery: false,
	  		type: [],
	  		resource: '',
	  		desc: ''
	  },
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
  created() {
	 this.getTableList(); 
  },
  watch: {},
  methods: {
    init() {
		var that = this
		let query = that.$route.query
		that.sourceType = query.sourceType
		// this.getOrganList();
		this.getTableList();
    },
	getTableList () {
	  var that = this
	  console.log(that.$route.query)
	  // let data = qs.stringify({
			//   'page': that.page,
			//   'pageSize': that.pageSize,
			//   'buildName': that.$route.query.name, // 机楼名称
			//   'roomName': that.searchName, // 机房名称
			//   'importantLevel': that.searchName, // 重要等级
			//   'examinePower': that.searchName, // 审核权限
			//   'buildId': that.$route.query.rsId // 机楼rsId
		 //  })
	  let param = {
		  // url: api3.getFrameListByParamPage +'?page=' + that.page + '&pageSize =' + that.pageSize + '&buildName =' + that.buildName + '&roomName =' + that.roomName + '&buildId =' + that.$route.query.rsId,
		  url: api3.getFrameListByParamPage,
		  method: 'POST',
		  contentType : 'application/x-www-form-urlencoded',
		  data: qs.stringify({
			  'page': that.page,
			  'pageSize': that.pageSize,
			  'buildName': that.$route.query.name, // 机楼名称
			  'roomName': that.searchName, // 机房名称
			  'importantLevel': that.searchName, // 重要等级
			  'examinePower': that.searchName, // 审核权限
			  'buildId': that.$route.query.rsId // 机楼rsId
		  })
	  }
	  that.sendReq( param, (res) => {
		console.log(res)
		if (res.respHeader.resultCode == 0) {
			res.respBody.data.list.forEach((val) =>{
				console.log(val.createTime)
				let data = new Date(val.createTime)
				val.createTime = data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + data.getDate()
				// let time = new Date(parseInt(val.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
				if (val.frameSource == 0) {
					val.frameSource = '手动录入'
				} else {
					val.frameSource = '资源生成'
				}
			})
		  that.tableData = res.respBody.data.list;
		  that.tableParams.total = res.respBody.data.totals;
		} else {
		  that.$message.error(res.respHeader.message);
		}
	  })
	},
	handleEdit(index, row) {
	  console.log(index, row);
	  row.sourceType = this.sourceType
	  this.pushPage('/lookEquipment', row)
	},
	sourceTypeChange (e) {
	  console.log(e)
	  console.log('我点击了')
	  if(this.sourceType === 2){
		  this.placeholder = '请按接入间名称查询'
	  } else {
		  this.placeholder = '请按机楼名称查询'
	  }
	  this.getFrameListByParamPage();
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
      _this.getFrameListByParamPage();
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
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList();
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
          _this.getTableList();
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
          _this.getTableList();
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
        _this.getTableList();
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
        _this.getTableList();
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
.button-list {
  margin-top:14px;
   
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

