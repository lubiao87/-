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
			  <el-radio-group v-model="radio" @change="radioChange">
			      <el-radio label="1">新增机架</el-radio>
			      <el-radio label="2">新增其他物体</el-radio>
			  </el-radio-group>
			  
		  </div>
		  <!-- <div class="sub-title">输入后匹配输入建议</div> -->
		  <el-autocomplete style="width: 20%; "
			class="fn-d-i-b"
			v-model="searchName"
			:fetch-suggestions="querySearch"
			:placeholder=placeholder
			:trigger-on-focus="false"
			@select="handleSelect"
		  ></el-autocomplete>
		  
		  <el-select v-if="radio === '1'" v-model="frameSource" placeholder="请选择机架来源" @change='frameSourceListChange'>
		   <el-option 
			v-for="item in frameSourceList"
			:key="item.value"
			:label="item.label"
			:value="item.value">
		   </el-option>
		  </el-select>
		  
		  <el-select v-if="radio === '1'" class="fn-mr025" v-model="frameType" placeholder="请选择机架类型" @change='frameTypeListChange'>
		   <el-option 
				v-for="item in frameTypeList"
				:key="item.name"
				:label="item.name"
				:value="item.name">
		   </el-option>
		  </el-select>
		  
		  <el-select v-if="radio === '2'" class="fn-mr025" v-model="substanceType" placeholder="请选择物体类型" @change='substanceTypeListChange'>
		   <el-option 
		  			v-for="item in substanceTypeList"
		  			:key="item.name"
		  			:label="item.name"
		  			:value="item.name">
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
			  height= '550'
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
			    prop="length"
			    label="物体长度(cm)"
				align="center"
			    :key="13"
			  ></el-table-column>
              <el-table-column
                v-if=" radio === '2'"
                prop="width"
                label="物体宽度(cm)"
				align="center"
                :key="14"
              ></el-table-column>
			  <el-table-column
			    v-if=" radio === '2'"
			    prop="height"
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
	  placeholder: '请按机架名称查询',
      district: "所属区域",
	  searchName: '',
	  searchNameList: [],
      frameSource: "",
      frameType: "",
      substanceType: "",
	  frameTypeList: [],
	  substanceTypeList: [],
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
      frameSourceList: [
        { label: "机架来源", value: "" },
        { label: "手动录入", value: '0' },
        { label: "资源生成", value: '1' },
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
	 var that = this
	 that.radio = '1'
	 that.getFrameTypeList();
	 that.getSubstanceTypeList();
	 that.getTableList(); 
  },
  methods: {
    init() {
		var that = this
		let query = that.$route.query
		that.sourceType = query.sourceType
		// this.getOrganList();
		
		that.getFrameTypeList();
		that.getSubstanceTypeList();
		that.getTableList(); 
    },
	radioChange (val) {
		var that = this
		that.radio = val
		that.searchName = ''
		if (that.radio === '2') {
			that.placeholder = '请按物体名称查询'
			that.frameSource = ''
			// that.frameType = ''
		} else {
			that.placeholder = '请按机架名称查询'
			that.substanceType = ''
		}
		that.getTableList(); 
	},
	getFrameTypeList () {
		var that = this
		console.log(that.$route.query)
		let param = {
			url: api3.getFrameName,
			method: 'GET',
		}
		that.sendReq( param, (res) => {
			console.log(res)
			if (res.respHeader.resultCode == 0) {
			  that.frameTypeList = res.respBody.frameNameList
			} else {
			  that.$message.error(res.respHeader.message);
			}
		})
	},
	getSubstanceTypeList () {
		var that = this
		console.log(that.$route.query)
		let param = {
			url: api3.getOtherName,
			method: 'GET',
		}
		that.sendReq( param, (res) => {
			console.log(res)
			if (res.respHeader.resultCode == 0) {
			  that.substanceTypeList = res.respBody.OtherNameList
			} else {
			  that.$message.error(res.respHeader.message);
			}
		})
	},
	getTableList () {
	  var that = this
	  console.log(that.$route.query)
	  let param = {};
	  if ( that.radio === '2') {
		  param = {
			  url: api3.getOtherListByParamPage,
			  method: 'POST',
			  contentType : 'application/x-www-form-urlencoded',
			  data: qs.stringify({
				  'page': that.page,
				  'pageSize': that.pageSize,
				  'name': that.searchName, // 机房名称
				  'type': that.substanceType, // 物体类型
				  'roomId': that.$route.query.rsId // 机房rsId
			  })
		  }
	  } else {
		  param = {
			  url: api3.getFrameListByParamPage,
			  method: 'POST',
			  contentType : 'application/x-www-form-urlencoded',
			  data: qs.stringify({
				  'page': that.page,
				  'pageSize': that.pageSize,
				  'frameName': that.searchName, // 机架名称（支持模糊匹配）
				  'roomId': that.$route.query.rsId, // 机房/接入间rsId
				  'frameSource': that.frameSource, // 机架来源（0：手动录入，1：资源生成）
				  'frameType': that.frameType, // 机架类型
			  })
		  }
	  }
	  that.sendReq( param, (res) => {
		console.log(res)
		if (res.respHeader.resultCode == 0) {
			res.respBody.data.list.forEach((val) =>{
				console.log(val.createTime)
				let data = new Date(val.createTime)
				val.createTime = data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + data.getDate()
				// let time = new Date(parseInt(val.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
				if (that.radio === '1') {
					if (val.frameSource == 0) {
						val.frameSource = '手动录入'
					} else {
						val.frameSource = '资源生成'
					}
				}
				
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
	  console.log(that.$route.query)
	  let param = {};
	  if ( that.radio === '2') {
		  param = {
			  url: api3.getOtherListByParamPage,
			  method: 'POST',
			  contentType : 'application/x-www-form-urlencoded',
			  data: qs.stringify({
				  'page': 1,
				  'pageSize': 50,
				  'name': queryString, // 机房名称
				  'type': '', // 物体类型
				  'roomId': that.$route.query.rsId // 机房rsId
			  })
		  }
	    } else {
		  param = {
			  url: api3.getFrameListByParamPage,
			  method: 'POST',
			  contentType : 'application/x-www-form-urlencoded',
			  data: qs.stringify({
				  'page': 1,
				  'pageSize': 100,
				  'frameName': that.searchName, // 机架名称（支持模糊匹配）
				  'roomId': that.$route.query.rsId, // 机房/接入间rsId
				  'frameSource': '', // 机架来源（0：手动录入，1：资源生成）
				  'frameType': '', // 机架类型
			  })
		    }
	    }
	    that.sendReq( param, (res) => {
	  		console.log(res)
	  		if (res.respHeader.resultCode == 0) {
	  			res.respBody.data.list.forEach((val) =>{
	  				val.value = val.name
	  			})
	  		  that.searchNameList = res.respBody.data.list
			  cb(that.searchNameList)
	  		} else {
	  		  that.$message.error(res.respHeader.message);
	  		}
	    })
	},
	handleSelect(item) {
	  console.log('开始搜索');
	  console.log(item);
	  this.getTableList()
	},
	handleEdit(index, row) {
	  console.log(index, row);
	  row.sourceType = this.sourceType
	  this.pushPage('/lookEquipment', row)
	},
	frameSourceListChange (e) {
	  this.frameSource = e
	  this.getTableList();
	},
	frameTypeListChange (e) {
	  this.frameType = e
	  this.getTableList();
	},
	substanceTypeListChange (e) {
	  this.substanceType = e
	  this.getTableList();
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

