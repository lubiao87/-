<template>
    <div class="examineDiaLog">
        <el-dialog :title='this.cabinetHandleType == 1?"机架添加":"机架修改"' :visible.sync="dialogTableVisible">
           <el-form :model="cabinetData"  ref="cabinetData" label-width="140px" > <!-- :rules="rules" -->
            <el-form-item label="机架名称：" auto-complete="off" prop="name">
              <el-input v-model="cabinetData.name" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="所属机房：" auto-complete="off" prop="moduleName">
              <el-input v-model="cabinetData.moduleName" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="所属机楼：" auto-complete="off" prop="buildName">
              <el-input v-model="cabinetData.buildName" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            
            
            <el-form-item label="机架类型：" prop="major">
                <el-select v-model="cabinetData.major" filterable style="margin:0px 26px">
                    <el-option  v-for="item in majorSelectList" :key="item.majorId" :label="item.name" :value="item.majorId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="剩余可放标准机柜数：" auto-complete="off" prop="remainStandCabient">
              <el-input v-model="cabinetData.remainStandCabient" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="可放标准机柜总数：" auto-complete="off" prop="totalStandCabient">
              <el-input v-model="cabinetData.totalStandCabient" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="额定功率：" auto-complete="off" prop="power">
              <el-input v-model="cabinetData.power" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">Kw</span>
            </el-form-item>
            <el-form-item label="使用功率：" auto-complete="off" prop="usePower">
              <el-input v-model="cabinetData.usePower" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">Kw</span>
            </el-form-item>
            <el-form-item label="行号：" auto-complete="off" prop="row">
              <el-input v-model="cabinetData.row" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="列号：" prop="column">
                <el-select v-model="cabinetData.column" filterable style="margin:0px 26px">
                    <el-option  v-for="item in columnList" :key="item.columnType" :label="item.columnName" :value="item.columnType" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机架长度：" auto-complete="off" prop="longth">
              <el-input v-model="cabinetData.longth" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
            <el-form-item label="机架高度：" auto-complete="off" prop="height">
              <el-input v-model="cabinetData.height" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
            <el-form-item label="机架宽度：" auto-complete="off" prop="width">
              <el-input v-model="cabinetData.width" style="margin:0px 26px;width:80%"></el-input>
              <span class="nuitFont">m</span>
            </el-form-item>
            <el-form-item label="机架总U位：" auto-complete="off" prop="totalUnitCount">
              <el-input v-model="cabinetData.totalUnitCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="机架可用U位：" auto-complete="off" prop="unuseUnitCount">
              <el-input v-model="cabinetData.unuseUnitCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="所属区域：" prop="area">
                <el-select v-model="cabinetData.area" filterable style="margin:0px 26px">
                    <el-option  v-for="item in areaSelectList" :key="item.areaId" :label="item.name" :value="item.areaId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="整流器数：" auto-complete="off" prop="unuseUnitCount">
              <el-input v-model="cabinetData.unuseUnitCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="退网设备数：" auto-complete="off" prop="unuseUnitCount">
              <el-input v-model="cabinetData.unuseUnitCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
            <el-form-item label="退网设备所占U位：" auto-complete="off" prop="unuseUnitCount">
              <el-input v-model="cabinetData.unuseUnitCount" style="margin:0px 26px;width:80%"></el-input>
            </el-form-item>
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
  name: "cabinetUpdateBar",
  mixins: [listSearchMixin],
  components: {},
  props: {
    cabinetHandleType: {
      type: Number,
      default: 1
    }
  },
  data() {
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
    return {
      cabinetTitle: "微模块添加",
      dialogTableVisible: false,
      currentTypeList: [
        {
          currentType: 1,
          currentName: "直流"
        },
        {
          currentType: 2,
          currentName: "交流"
        }
      ],
      columnList: [
        {
          columnType: "A",
          columnName: "A"
        },
        {
          columnType: "B",
          columnName: "B"
        }
      ],
      cabinetData: {
        moduleId: null,
        name: null,
        moduleName: null,
        buildName: null,
        roomId: null,
        area: null,
        height: null,
        width: null,
        longth: null,
        row: null,
        column: null,
        power: null,
        code: null,
        major: null,
        currentType: null,
        totalUnitCount: null,
        remainStandCabient: null,
        totalStandCabient: null,
        usePower: null,
        unuseUnitCount: null
      },
      moduleSelectList: null,
      majorSelectList: [
        { name: "DDF机架", majorId : 1},
        { name: "ODF机架", majorId : 2},
        { name: "OGE机架", majorId : 3}
      ],
      areaSelectList: [
        { name: "天河区", areaId : 1},
        { name: "荔湾区", areaId : 2},
        { name: "白云区", areaId : 3}
      ],
      rules: {
        name: [{ required: true, message: "请输入机柜名称", trigger: "blur" }],
        moduleId: [
          { required: true, message: "请选择所属微模块", trigger: "change" }
        ],
        currentType: [
          { required: true, message: "请选择电流类型", trigger: "change" }
        ],
        longth: [
          { required: true, message: "请输入长度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        height: [
          { required: true, message: "请输入高度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        width: [
          { required: true, message: "请输入宽度", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        major: [{ required: true, message: "请输入机柜专业", trigger: "blur" }],
        power: [
          { required: true, message: "请输入额定功率", trigger: "blur" },
          { validator: checkFloatNumber, trigger: "blur" }
        ],
        row: [{ required: true, message: "请输入行号", trigger: "blur" }],
        column: [{ required: true, message: "请选择列号", trigger: "change" }],
        totalUnitCount: [
          { required: true, message: "请输入最大U位数", trigger: "blur" },
          { validator: checkSignlessNumber, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    show(row) {
      if (row != null) {
        if (this.$refs["cabinetData"] != undefined) {
          this.$refs["cabinetData"].resetFields();
        }
        this.cabinetData.cabinetId = row.cabinetId;
        this.cabinetData.code = row.code;
        this.cabinetData.moduleId = row.moduleId;
        this.cabinetData.name = row.name;
        this.cabinetData.moduleName = row.moduleName;
        this.cabinetData.buildName = row.buildName;
        this.cabinetData.roomId = row.roomId;
        this.cabinetData.area = row.area;
        this.cabinetData.height = row.height;
        this.cabinetData.width = row.width;
        this.cabinetData.longth = row.longth;
        this.cabinetData.row = row.row;
        this.cabinetData.column = row.column;
        this.cabinetData.power = row.power;
        this.cabinetData.major = row.major;
        this.cabinetData.currentType = row.currentType;
        this.cabinetData.totalUnitCount = row.totalUnitCount;
        this.cabinetData.remainStandCabient = row.remainStandCabient;
        this.cabinetData.totalStandCabient = row.totalStandCabient;
        this.cabinetData.usePower = row.usePower;
        this.cabinetData.unuseUnitCount = row.unuseUnitCount;
      } else {
        this.defauleData();
      }
      this.getModuleSelectList();
      this.dialogTableVisible = true;
    },
    getModuleSelectList() {
      let _this = this;
      let paramData = {};
      paramData["roomId"] = _this.cabinetData.roomId;
      let param = {
        url: api.moduleSelectList,
        data: qs.stringify(paramData),
        contentType: "application/x-www-form-urlencoded"
      };
      _this.sendReq(param, res => {
        if (res.respHeader.resultCode == 0) {
          _this.moduleSelectList = res.respBody.moduleSelectList;
        } else {
          this.$message.error(res.respHeader.message);
        }
      });
    },
    updateMessage() {
      let _this = this;
      _this.$refs["cabinetData"].validate(valid => {
        if (valid) {
          _this
            .$confirm(
              this.cabinetHandleType == 1 ? "确定添加？" : "确定修改？",
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
      this.$emit("cabinetUpdate", this.cabinetData);
      this.dialogTableVisible = false;
    },
    defauleData() {
      //重置校验和默认值
      if (this.$refs["cabinetData"] != undefined) {
        this.$refs["cabinetData"].resetFields();
      }
      this.cabinetData = {
        moduleId: null,
        name: null,
        roomId: null,
        area: null,
        height: null,
        width: null,
        longth: null,
        row: null,
        column: null,
        power: null,
        code: null,
        major: null,
        currentType: null,
        totalUnitCount: null
      };
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