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
				<el-radio-button label="1">新增机架</el-radio-button>
				<el-radio-button label="2">新增其他物体</el-radio-button>
			  </el-radio-group>
			  <!-- <el-radio-group v-model="radio" @change="radioChange">
			      <el-radio label="1">新增机架</el-radio>
			      <el-radio label="2">新增其他物体</el-radio>
			  </el-radio-group> -->
		  </div>
		  <!-- <div class="sub-title">输入后匹配输入建议</div> -->
		  <el-autocomplete style="width: 20%; "
			class="fn-d-i-b margin_t10"
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
			  <el-button v-if="radio === '1'" @click="showAddList">新增</el-button>
			  <el-button v-if="radio === '2'" @click="showAddList">新增</el-button>
			  <el-button @click="showUpdateList">修改</el-button>
			  <el-button @click='deleteRow'>删除</el-button>
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
	<el-dialog :title="addOrUpdateTitle" :visible.sync="showList" custom-class="dialogClass" width="54%">
	  <el-form v-if="radio === '1'" :model="form" ref="form" label-width="100px" class="demo-ruleForm">
	    <el-form-item class="fn-d-i-b" 
		prop="name" 
		:rules="[ { required: true, message: '机架名称不能为空'}]"
	    label="机架名称:" :label-width="formLabelWidth">
	      <el-input v-model="form.name" placeholder="请输入机架名称" autocomplete="off" class="fn-m-220"></el-input>
	    </el-form-item>
		<el-form-item class="fn-d-i-b" label="编码:"
		 prop="code"
		 :rules="[ { required: true, message: '编码不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.code" placeholder="请输入编码" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="所属区域:" :label-width="formLabelWidth">
		  <el-input v-model="countyName" disabled autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType === 2" class="fn-d-i-b" label="所属接入间:" :label-width="formLabelWidth">
		  <el-input v-model="buildName" disabled autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType === 1" class="fn-d-i-b" label="所属机楼:" :label-width="formLabelWidth">
		  <el-input v-model="buildName" disabled autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType === 1" class="fn-d-i-b" label="所属机房:" :label-width="formLabelWidth">
		  <el-input v-model="roomName" disabled  autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b"
		 prop="rsId"
		 :rules="[ { required: true, message: '资源系统ID不能为空'},]"
		 label="资源系统ID:" :label-width="formLabelWidth">
		  <el-input v-model="form.rsId" :readonly="rsIdReadonly" placeholder="请输入资源系统ID" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		
		<el-form-item class="fn-d-i-b" label="机架类型:" :label-width="formLabelWidth">
		  <el-select v-model="form.type" placeholder="请选择机架类型" class="fn-m-220">
		    <el-option v-for="item in frameNameLists" :key="item.name" :label="item.name" :value="item.name"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="可放标准机柜总数:"
		 prop="standardCabinetTotal"
		 :rules="[ { required: true, message: '可放标准机柜总数不能为空'},
		 		  { type: 'number', message: '可放标准机柜总数必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.standardCabinetTotal" placeholder="请输入可放标准机柜总数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架总U位:"
		 prop="totalU"
		 :rules="[ { required: true, message: '机架总U位不能为空'},
		 		  { type: 'number', message: '机架总U位必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.totalU" placeholder="请输入机架总U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架已用U位:"
		 prop="useU"
		 :rules="[ { required: true, message: '机架已用U位不能为空'},
				  { type: 'number', message: '机架已用U位必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.useU" placeholder="请输入机架已用U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架长度(cm):"
		  prop="length"
		  :rules="[ { required: true, message: '机架长度不能为空'},
				  { type: 'number', message: '机架长度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.length" placeholder="请输入机架长度" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架宽度(cm):"
		  prop="width"
		  :rules="[ { required: true, message: '机架宽度不能为空'},
				  { type: 'number', message: '机架宽度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.width" placeholder="请输入机架宽度" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架高度(cm):"
		 prop="height"
		 :rules="[ { required: true, message: '机架高度不能为空'},
				  { type: 'number', message: '机架高度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.height" placeholder="请输入机架高度" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="额定功率(KW):"
		 prop="ratePower"
		 :rules="[ { required: true, message: '额定功率不能为空'},
				  { type: 'number', message: '额定功率必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.ratePower" placeholder="请输入额定功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="使用功率(KW):"
		 prop="usePower"
		 :rules="[ { required: true, message: '使用功率不能为空'},
				  { type: 'number', message: '使用功率必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.usePower" placeholder="请输入使用功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="列号:"
		  prop="colNo"
		  :rules="[ { required: true, message: '列号不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.colNo" placeholder="请输入列号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="位号:"
		  prop="rowNo"
		  :rules="[ { required: true, message: '位号不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.rowNo" placeholder="请输入位号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
	    
		<el-form-item class="fn-d-i-b" label="退网设备数:"
		  prop="exitDevTotal"
		  :rules="[ { required: true, message: '退网设备数不能为空'},
					{ type: 'number', message: '退网设备数必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.exitDevTotal" placeholder="请输入退网设备数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="退网设备所占U位:" 
		 prop="exitDevU"
		 :rules="[ { required: true, message: '退网设备所占U位不能为空'},
				   { type: 'number', message: '退网设备所占U位必须为数字值'}]"
		:label-width="formLabelWidth">
		  <el-input v-model.number="form.exitDevU" placeholder="请输入退网设备所占U位" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="机架来源:" :label-width="formLabelWidth">
		  <el-select v-model="form.frameSource" placeholder="请选择机架来源" class="fn-m-220">
		    <el-option label="手动录入" value="0"></el-option>
		    <el-option label="资源录入" value="1"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="额定电压(v):"
		 prop="rateVoltage"
		 :rules="[ { required: true, message: '额定电压不能为空'},
				   { type: 'number', message: '额定电压必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.rateVoltage" placeholder="请输入额定电压" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="所属列头柜:" :label-width="formLabelWidth">
		  <el-select v-model="form.upperNo" placeholder="请选择所属列头柜" class="fn-m-220">
		    <el-option label="列头柜1" value="列头柜1"></el-option>
		    <el-option label="列头柜2" value="列头柜2"></el-option>
		    <el-option label="列头柜3" value="列头柜3"></el-option>
		    <el-option label="列头柜4" value="列头柜4"></el-option>
		    <el-option label="列头柜5" value="列头柜5"></el-option>
		    <el-option label="列头柜6" value="列头柜6"></el-option>
		  </el-select>
		</el-form-item>
	  </el-form>
	  <el-form :model="form" ref="form" v-if="radio === '2'" label-width="100px" class="demo-ruleForm">
	    <el-form-item class="fn-d-i-b" label="物体名称:"
		 prop="name" 
	  	 :rules="[ { required: true, message: '物体名称不能为空'}]"
	     :label-width="formLabelWidth">
	      <el-input v-model="form.name" placeholder="请输入物体名称" autocomplete="off" class="fn-m-220"></el-input>
	    </el-form-item>
		<el-form-item class="fn-d-i-b" label="编码:"
		 prop="code"
		 :rules="[ { required: true, message: '物体名称不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.code" placeholder="请输入编码" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b"
		 prop="cjId"
		 :rules="[ { required: true, message: '资源系统ID不能为空'},]"
		 label="资源系统ID:" :label-width="formLabelWidth">
		  <el-input v-model="form.rjId" :disabled="cjIdReadonly" placeholder="请输入资源系统ID" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType == 2" class="fn-d-i-b" label="所属接入间:" :label-width="formLabelWidth">
		  <el-input v-model="buildName" disabled  autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType == 1" class="fn-d-i-b" label="所属机楼:" :label-width="formLabelWidth">
		  <el-input v-model="buildName" disabled  autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="sourceType == 1" class="fn-d-i-b" label="所属机房:" :label-width="formLabelWidth">
		  <el-input v-model="roomName" disabled  autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体类型:" :label-width="formLabelWidth">
		  <el-select v-model="form.type" placeholder="请选择物体类型" :disabled="otherTypeDisabled" class="fn-m-220" @change="otherTypeChange">
			<el-option label="列头柜" value="列头柜"></el-option>
			<el-option label="门" value="门"></el-option>
			<el-option label="柱子" value="柱子"></el-option>
			<el-option label="空调" value="空调"></el-option>
			<el-option label="电池组" value="电池组"></el-option>
			<el-option label="整流器" value="整流器"></el-option>
			<el-option label="UPS" value="UPS"></el-option>
			<el-option label="直流配电屏" value="直流配电屏"></el-option>
			<el-option label="其他" value="其他"></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="输出屏:" :label-width="formLabelWidth">
		  <el-input v-model="form.outputScreen" placeholder="请输入输出屏" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="整流器:" :label-width="formLabelWidth">
		  <el-input v-model="form.rectifier" placeholder="请输入整流器" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="低压系统开关:" :label-width="formLabelWidth">
		  <el-input v-model="form.lowSystemSwitch" placeholder="请输入低压系统开关" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="上联设备编号:" :label-width="formLabelWidth">
		  <el-input v-model="form.upEquipCode" placeholder="请输入上联设备编号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体长度(cm):"
		 prop="length"
		 :rules="[ { required: true, message: '物体长度不能为空'},
				   { type: 'number', message: '物体长度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.length" placeholder="请输入物体长度" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体宽度(cm):"
		 prop="width"
		 :rules="[ { required: true, message: '物体宽度不能为空'},
				   { type: 'number', message: '物体宽度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.width" placeholder="请输入" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item class="fn-d-i-b" label="物体高度(cm):"
		 prop="height"
		 :rules="[ { required: true, message: '物体高度不能为空'},
				   { type: 'number', message: '物体高度必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.height" placeholder="请输入物体高度" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType != '列头柜' && form.type != '列头柜'" class="fn-d-i-b" label="额定功率(KW):"
		 prop="power"
		 :rules="[ { required: true, message: '额定功率不能为空'},
				   { type: 'number', message: '额定功率必须为数字值'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model.number="form.power" placeholder="请输入额定功率" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="变压器:" :label-width="formLabelWidth">
		  <el-input v-model="form.transformer" placeholder="请输入变压器" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="变电站:" :label-width="formLabelWidth">
		  <el-input v-model="form.convertStation" placeholder="请输入变电站" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="整流器数:" :label-width="formLabelWidth">
		  <el-input v-model="form.rectifierNumber" placeholder="请输入整流器数" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="列号:"
		 prop="colNum"
		 :rules="[ { required: true, message: '列号不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.colNum" placeholder="请输入列号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
		<el-form-item v-if="otherType == '列头柜' && form.type == '列头柜'" class="fn-d-i-b" label="位号:"
		 prop="posNum"
		 :rules="[ { required: true, message: '位号不能为空'}]"
		 :label-width="formLabelWidth">
		  <el-input v-model="form.posNum" placeholder="请输入位号" autocomplete="off" class="fn-m-220"></el-input>
		</el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="showList = false">取 消</el-button>
	    <el-button  type="primary" v-if="addOrUpdateTitle === '新增机架'" @click="addFrameList('form')">新 增</el-button>
	    <el-button  type="primary" v-if="addOrUpdateTitle === '新增其他物体'" @click="addOtherList('form')">新 增</el-button>
	    <el-button type="primary" v-if="addOrUpdateTitle === '修改机架'" @click="updateFrameList('form')">修 改</el-button>
	    <el-button type="primary" v-if="addOrUpdateTitle === '修改其他物体'" @click="updateOtherList('form')">修 改</el-button>
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
      showList: false,
	  addOrUpdateTitle: '新增机架',
	  otherType: '其他',
	  radio: '1',
	  rsIdReadonly: false,
	  cjIdReadonly: false,
	  otherTypeDisabled: false,
	  countyName: '',
	  countyId: '',
	  roomId: '',
	  roomName: '', // 所属机房名称
	  buildName: '',
	  buildId: '',
	  frameNameLists: [
            {"name": "标准机架"},
            {"name": "配线架"},
            {"name": "ODF机架"},
            {"name": "DDF机架"},
            {"name": "定制机架"},
            {"name": "配电柜"},
        ],
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
	  form: {},
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
		that.countyName = query.countyName
		that.roomName = query.name
		that.countyId = query.countyId
		that.buildId = query.buildId
		that.roomId = query.roomNo
		if (that.sourceType === 1) {
			// 所属机楼
			that.buildName = query.buildName
		} else {
			// 所属接入间
			that.buildName = query.name
		}
		that.buildId = query.rsId
		that.getFrameTypeList();
		that.getSubstanceTypeList();
		that.getTableList(); 
    },
	otherTypeChange (e) {
		var that = this
		that.otherType = e
		console.log('改变类型：', e)
		if (e === '列头柜') {
			that.form = {
			  "buildId": that.buildId, // 必填
			  "colNum": "",   // 列号 必填
			  "convertStation": "",  // 变电站 必填
			  "height": null,  // 必填
			  "length": null,  // 必填
			  "lowSystemSwitch": "", // 必填 低压系统开关
			  "name": "", // 必填
			  "outputScreen": "", // 必填 输出屏
			  "posNum": "",  // 必填 位号
			  "rectifier": "", // 必填 整流器
			  "rectifierNumber": null,  // 必填 整流器数量
			  "roomId": that.roomId,  // 必填
			  "rsId": "", // 必填 资源系统ID
			  "transformer": "", // 必填 变压器
			  "upEquipCode": "", // 必填 上联设备编码
			  "width": null
			}
		} else {
			that.form = {
			  "buildId": that.buildId,
			  "cjId": "",
			  "code": "",
			  "creator": "admin",
			  "height": null, // 必填
			  "length": null, // 必填
			  "name": "",     // 必填
			  "power": null,
			  "roomId": that.roomId, // 必填
			  "type": "", // 必填
			  "width": null // 必填
			}
		}
	},
	showAddList () {
		var that = this
		if (that.radio === '2') {
			that.addOrUpdateTitle = '新增其他物体'
			that.cjIdReadonly = false
			that.otherTypeDisabled = false
			that.form = {
			  "buildId": that.buildId,
			  "cjId": "",
			  "code": "",
			  "creator": "admin",
			  "height": null, // 必填
			  "length": null, // 必填
			  "name": "",     // 必填
			  "power": null,
			  "roomId": that.roomId, // 必填
			  "type": "", // 必填
			  "width": null // 必填
			}
		} else {
			that.addOrUpdateTitle = '新增机架'
			that.rsIdReadonly = false
			that.form = {
			  "buildId": that.buildId,  // 必填
			  "code": "",
			  "colNo": "",
			  "countyId": that.countyId,
			  "countyName": that.countyName,
			  "creator": "admin",
			  "exitDevTotal": null,
			  "exitDevU": null,
			  "frameSource": "0",
			  "height": null, // 必填
			  "length": null,      // 必填
			  "name": "",        // 必填
			  "ratePower": null,  // 必填
			  "rateVoltage": null,  // 必填
			  "roomId": that.roomId,            // 必填
			  "rowNo": "",
			  "rsId": "",
			  "standardCabinetTotal": null,       // 必填
			  "totalU": null, // 必填
			  "type": "",
			  "upperNo": "", // 必填
			  "usePower": null,  // 必填
			  "useU": null,  // 必填
			  "width": null // 必填
			}
		}
		that.showList = true
	},
	// 展示修改系列
	showUpdateList () {
		var that = this
		if (that.multipleSelection.length < 1) {
		  that.$message.error("请勾选需要修改的资源");
		  return;
		} else if (that.multipleSelection.length > 1) {
		  that.$message.error("一次只能修改一条资源");
		  return;
		}
		if (that.radio === '2') {
			that.byIdForDetails(that.multipleSelection[0].rsId);
		} else {
			that.byIdForDetails(that.multipleSelection[0].rsId);
		}
	},
	// 修改数据
	updateData () {
		var that = this
		if (that.radio === '2') {
			that.addOrUpdateTitle = '修改其他物体'
			that.cjIdReadonly = true
			that.otherTypeDisabled = true
		} else {
			that.addOrUpdateTitle = '修改机架'
			that.rsIdReadonly = true
		}
		that.showList = true
	},
	 // 根据所选行的rsId或者cjId查询机架列详情
	 byIdForDetails (id) {
		 var that = this
		 let param = {}
		if (that.radio === '2') {
			param = {
			  url: api3.getOtherDetailById+'?cjId=' + id,
			  method: 'GET',
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.form = res.respBody.tbOther
					that.updateData()
				} else {
				  that.$message.error(res.respHeader.message);
				}
			})
		} else {
			param = {
			  url: api3.getFrameDetailById+'?frameId=' + id,
			  method: 'GET',
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.form = res.respBody.tbFrame
					that.updateData()
				} else {
				  that.$message.error(res.respHeader.message);
				}
			})
		}
		 
	 },
	 // 修改所选机架
	 updateFrameList (formName) {
		 var that = this
		 this.$refs[formName].validate((valid) => {
		   if (valid) {
		 	// alert('submit!');
		 	let param = {
		 	  url: api3.updateFrameSelective,
		 	  method: 'POST',
		 	  // contentType : 'application/x-www-form-urlencoded',
		 	  data: that.form
		 	}
		 	that.sendReq( param, (res) => {
		 		// console.log(res)
		 		if (res.respHeader.resultCode == 0) {
		 			that.$message({ type: "success", message: "修改成功" });
		 			that.showList = false
		 			that.rsIdReadonly = false
		 			that.getTableList()
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
	 // 修改所选其他物体
	 updateOtherList (formName) {
		var that = this
		this.$refs[formName].validate((valid) => {
		  if (valid) {
			// alert('submit!');
			let param = {
			  url: api3.updateOtherSelective,
			  method: 'POST',
			  // contentType : 'application/x-www-form-urlencoded',
			  data: that.form
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.$message({ type: "success", message: "修改成功" });
					that.showList = false
					that.cjIdReadonly = false
					that.otherTypeDisabled = false
					that.getTableList()
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
	// 新增列表
	addFrameList (formName) {
		var that = this
		console.log(that.form)
		that.$refs[formName].validate((valid) => {
		  if (valid) {
			// alert('submit!');
			let param = {
			  url: api3.insertFrameSelective,
			  method: 'POST',
			  // contentType : 'application/x-www-form-urlencoded',
			  data: that.form
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.$message({ type: "success", message: "新增成功" });
					that.showList = false
					that.getTableList()
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
	// 新增其他物体
	addOtherList (formName) {
		var that = this
		console.log(that.form)
		that.$refs[formName].validate((valid) => {
		  if (valid) {
			// alert('submit!');
			let param = {
			  url: api3.insertOtherSelective,
			  method: 'POST',
			  // contentType : 'application/x-www-form-urlencoded',
			  data: that.form
			}
			that.sendReq( param, (res) => {
				// console.log(res)
				if (res.respHeader.resultCode == 0) {
					that.$message({ type: "success", message: "新增成功" });
					that.showList = false
					that.getTableList()
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
	// 新增类型改变
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
	// 模糊查询
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
	// 按名称搜索
	handleSelect(item) {
	  console.log('开始搜索');
	  console.log(item);
	  this.getTableList()
	},
	// 跳转到设备列表
	handleEdit(index, row) {
	  console.log(index, row);
	  row.sourceType = this.sourceType
	  this.pushPage('/lookEquipment', row)
	},
	// 机架来源切换
	frameSourceListChange (e) {
	  this.frameSource = e
	  this.getTableList();
	},
	// 机架类型切换
	frameTypeListChange (e) {
	  this.frameType = e
	  this.getTableList();
	},
	// 物体类型切换
	substanceTypeListChange (e) {
	  this.substanceType = e
	  this.getTableList();
	},
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
    getFrameSelectIdStr() {
      //获取选择模块的id拼接字符串 1,2,3,
      let ids = "";
      this.multipleSelection.forEach((val) => {
		  console.log(val)
          ids += val["rsId"] + ",";
		  console.log(ids)
      });
      return ids;
    },
    getOtherSelectIdStr() {
      //获取选择机架的id拼接字符串 1,2,3,
      let ids = "";
      this.multipleSelection.forEach((val) => {
		  console.log(val)
          ids += val["cjId"] + ",";
		  console.log(ids)
      });
      return ids;
    },
	deleteRow() {
	  console.log("删除");
	  let _this = this;
	  if (_this.multipleSelection.length < 1) {
	    _this.$message.error("请勾选需要修改的资源");
	    return;
	  }
	  this.$confirm(
	    this.radio == 1
	      ? "确定删除所选机架？"
	      : "确定删除所选物体？",
	    "提示",
	    {
	      confirmButtonText: "确定",
	      cancelButtonText: "取消",
	      type: "warning"
	    }
	  )
	    .then(() => {
	      if (_this.radio == 1) {
	        let frameIdList = _this.getFrameSelectIdStr();
	        _this.deleteFrames(frameIdList);
	      } else {
	        let otherIdList = _this.getOtherSelectIdStr();
	        _this.deleteOthers(otherIdList);
	      }
	    })
	    .catch(() => {});
	},
	deleteFrames(ids) {
	  //删除勾选机架
	  let _this = this;
	  let paramData = {};
	  paramData["frameIdList"] = ids;
	  let param = {
	    url: api3.batchDeleteFrame,
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
    deleteOthers(ids) {
      //删除勾选物体
      let _this = this;
      let paramData = {};
      paramData["otherIdList"] = ids;
      let param = {
        url: api3.batchDeleteOther,
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
.fn-d-i-b .el-input__inner {
  background-color: transparent;
  border: 1px solid rgba(186, 205, 229, 0.2);
}
</style>

