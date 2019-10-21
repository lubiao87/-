<template>
    <div class="examineDiaLog">
        <el-dialog :title='moduleHandleType == 1 ? "机房添加" : "机房修改"' :visible.sync="dialogTableVisible">
           <el-form :model="machineModule"  ref="machineModule" label-width="140px" > <!-- :rules="rules" -->
            <el-form-item label="机房名称：" auto-complete="off" prop="name">
              <el-input v-model="machineModule.name" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="所在房间号：" prop="moduleRoomName">
              <el-input v-model="machineModule.moduleRoomName" style="margin:0px 26px;width:80%"></el-input>
<!--                 <el-select v-model="machineModule.roomId" filterable style="margin:0px 26px">
                    <el-option  v-for="item in moduleRoomSelectList" :key="item.moduleRoomId" :label="item.name" :value="item.moduleRoomId" ></el-option>
                </el-select> -->
            </el-form-item>
              <el-form-item label="所在楼层：" auto-complete="off" prop="dCPower">
                <el-input v-model="machineModule.dCPower" style="margin:0px 26px;width:80%"></el-input>
              <!-- <span class="nuitFont">Kw</span> -->
            </el-form-item>
            <el-form-item label="所属机楼：" prop="aCPower">
                <el-select v-model="machineModule.aCPower" filterable style="margin:0px 26px">
                    <el-option  v-for="item in buildSelectList" :key="item.buildId" :label="item.name" :value="item.buildId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属区域：" prop="row">
                <el-select v-model="machineModule.row" filterable style="margin:0px 26px">
                    <el-option  v-for="item in areaSelectList" :key="item.areaId" :label="item.name" :value="item.areaId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机房总面积：" prop="area">
              <el-input v-model="machineModule.area" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m²</span>
            </el-form-item>
            <el-form-item label="可放机架总数：" auto-complete="off" prop="totalMachineCount">
              <el-input v-model="machineModule.totalMachineCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="机房长度：" auto-complete="off" prop="longth">
              <el-input v-model="machineModule.longth" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
            <el-form-item label="机房高度：" auto-complete="off" prop="height">
              <el-input v-model="machineModule.height" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
            <el-form-item label="机房宽度：" auto-complete="off" prop="width">
              <el-input v-model="machineModule.width" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
             <el-form-item label="机房规划状态：" prop="planStatus" filterable>
                <el-select v-model="machineModule.planStatus" filterable style="margin:0px 26px">
                    <el-option  v-for="item in statusSelectList" :key="item.planStatusId" :label="item.name" :value="item.planStatusId" ></el-option>
                </el-select>
            </el-form-item>
            
            

<!--             <el-form-item label="额定交流功率：" auto-complete="off" prop="ACPower">
              <el-input v-model="machineModule.ACPower" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">Kw</span>
            </el-form-item>
            <el-form-item label="行号：" auto-complete="off" prop="row">
              <el-input v-model="machineModule.row" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="列号：" auto-complete="off" prop="column">
              <el-input v-model="machineModule.column" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>-->
          </el-form> 
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateMessage">保存</el-button>
            <el-button @click="dialogTableVisible = false">关闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import imageSrc from "../../assets/common/images";
import { api } from "../../api/api"; //请求
import { listSearchMixin } from "../../mixin"; //请求
import qs from "qs";
export default {
  name: "machineModuleUpdateBar",
  mixins: [listSearchMixin],
  components: {},
  props: {
    moduleHandleType: {
      type: Number,
      default: 1
    }
  },
  data() {
    var checkSignlessNumber = (rule, value, callback) => {
      // 校验正整数
      if (!value) {
        return callback(new Error("不能为空"));
      }
      var reg = /^\d+$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    var checkFloatNumber = (rule, value, callback) => {
      // 校验可带小数点数字
      if (!value) {
        return callback(new Error("不能为空"));
      }
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        return callback(new Error("必须为数字"));
      } else {
        callback();
      }
    };
    return {
      dialogTableVisible: false,
      machineModule: {
        moduleId: null,
        name: null,
        roomId: null,
        moduleRoomName: null,
        area: null,
        height: null,
        width: null,
        longth: null,
        row: null,
        column: null,
        totalMachineCount: null,
        dCPower: null,
        aCPower: null,
        code: null,
        planStatus: null
      },
      moduleRoomSelectList: null,
      buildSelectList: [
        { name: "青云机楼", buildId : 1},
        { name: "工业园机楼", buildId : 2},
        { name: "跑马场机楼", buildId : 3}
      ],
      areaSelectList: [
        { name: "天河区", areaId : 1},
        { name: "荔湾区", areaId : 2},
        { name: "白云区", areaId : 3}
      ],
      statusSelectList: [
        { name: "规划中", planStatusId : 0},
        { name: "已规划", planStatusId : 2}
      ],
      // 取消参数校验
/*       rules: {
        name: [
          { required: false, message: "请输入微模块名称", trigger: "blur" }
        ],
        roomId: [
          { required: false, message: "请选择所属微模块间", trigger: "change" }
        ],
        area: [
          { required: false, message: "请输入面积", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        longth: [
          { required: false, message: "请输入长度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        height: [
          { required: false, message: "请输入高度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        width: [
          { required: false, message: "请输入宽度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        totalMachineCount: [
          { required: false, message: "请输入可放机柜总数", trigger: "blur" },
          { validator: checkSignlessNumber, trigger: "blur" }
        ],
        DCPower: [
          { required: false, message: "请输入额定直流功率", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        ACPower: [
          { required: false, message: "请输入额定交流功率", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        row: [{ required: false, message: "请输入行号", trigger: "blur" }],
        column: [{ required: false, message: "请输入列号", trigger: "blur" }]
      } */
    };
  },
  methods: {
    show(row) {
      if (row != null) {
        if (this.$refs["machineModule"] != undefined) {
          this.$refs["machineModule"].resetFields();
        }
        this.machineModule.code = row.code;
        this.machineModule.moduleId = row.moduleId;
        this.machineModule.buildingId = row.buildingId;
        this.machineModule.name = row.name;
        this.machineModule.roomId = row.roomId;
        this.machineModule.moduleRoomName = row.moduleRoomName;
        this.machineModule.area = row.area;
        this.machineModule.height = row.height;
        this.machineModule.width = row.width;
        this.machineModule.longth = row.longth;
        this.machineModule.row = row.row;
        this.machineModule.column = row.column;
        this.machineModule.totalMachineCount = row.totalMachineCount;
        this.machineModule.dCPower = row.dCPower;
        this.machineModule.aCPower = row.aCPower;
        this.machineModule.planStatus = row.planStatus
      } else {
        this.defauleData();
      }
      // this.getModuleRoomSelectList();
      this.dialogTableVisible = true;
    },
    getModuleRoomSelectList() {
      let _this = this;
      let paramData = {};
      paramData["buildingId"] = _this.machineModule.buildingId;
      let param = {
        url: api.moduleRoomSelectList,
        data: qs.stringify(paramData),
        contentType: "application/x-www-form-urlencoded"
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          _this.moduleRoomSelectList = res.respBody.moduleRoomSelectList;
        } else {
          this.$message.error(res.respHeader.message);
        }
      });
    },
    updateMessage() {
      let _this = this;
      _this.$refs["machineModule"].validate(valid => {
        if (valid) {
          _this
            .$confirm(
              this.moduleHandleType == 1 ? "确定添加？" : "确定修改？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
            .then(() => {
              _this.save();
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    save() {
      this.$emit("moduleUpdate", this.machineModule);
      this.dialogTableVisible = false;
    },
    defauleData() {
      //重置校验和默认值
      if (this.$refs["machineModule"] != undefined) {
        this.$refs["machineModule"].resetFields();
      }
      this.machineModule = {
        moduleId: null,
        name: null,
        roomId: null,
        area: null,
        height: null,
        width: null,
        longth: null,
        row: null,
        column: null,
        totalMachineCount: null,
        DCPower: null,
        ACPower: null,
        code: null
      };
    },
    moduleFormatter(row, column, cellValue, index){ 
      if(cellValue == 0){
          return '规划中';
      }else if(cellValue == 1){
          return '已预占';
      }else if(cellValue == 2){
          return '已规划';
      }else{
          return '暂无数据';
      }
    }
  }
};
</script>

<style>
.examineDiaLog .examineNews {
  margin-bottom: 10px;
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
.el-textarea__inner {
  background-color: transparent;
  color: #fff;
}
.examineDiaLog .el-form-item__label {
  color: #fff;
}
.nuitFont {
  color: #fff;
  font-size: 16px;
}
.examineDiaLog .el-button--primary {
  background: #7187f0;
  color: #fff;
}
</style>