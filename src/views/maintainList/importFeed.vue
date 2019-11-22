<template>
  <div class="selectInput">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <!-- 第一个下拉框 -->
      <el-form-item>
        <el-select v-model="formInline.sourceType" :placeholder="foremost">
          <el-option
            v-for="item in foremostData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 状态拉框 -->
      <span v-if="formInline.sourceType === 1">
        <el-form-item>
          <el-select v-model="formInline.status" :placeholder="statusTip">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.buildId" :placeholder="buildTip">
            <el-option
              v-for="item in buildData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.areaId" :placeholder="areaTip">
            <el-option
              v-for="item in areaData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </span>
      <!-- 输入框 -->
      <el-form-item>
        <el-input
          v-model="formInline.sourceName"
          :placeholder="inputPlaceholder"
        ></el-input>
      </el-form-item>
      <el-form-item class="buttonMar" v-if="formInline.sourceType === 2">
        <!-- 时间选择器 -->
        <el-form-item class="dateTime">
          <el-date-picker
            v-model="formInline.dateVal"
            start-placeholder="上架开始日期"
            end-placeholder="上架结束日期"
            type="datetimerange"
            :placeholder="datePacleholder"
            format="yyyy/MM/dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-button @click="onSubmit" type="primary"
        ><i class="el-icon-search"></i>查询</el-button
      >
    </el-form>
    <el-row style="margin-bottom:8px;">
      <el-button @click="addModule" type="primary"
        ><i class="el-icon-plus"></i>新增机房</el-button
      >
      <el-button @click="addCabinet" type="primary"
        ><i class="el-icon-plus"></i>新增机架</el-button
      >
      <el-button @click="editSource" type="primary"
        ><i class="el-icon-edit"></i>修改</el-button
      >
      <el-button @click="deleteSource" type="primary"
        ><i class="el-icon-delete"></i>删除</el-button
      >
      <el-button type="primary"><i class="el-icon-download"></i>导出</el-button>
      <el-button type="primary" @click="dialogFormVisible = true"
        ><i class="el-icon-upload"></i>导入机房设备</el-button
      >
      <el-button type="primary" @click.native="locationHref"
        ><i class="el-icon-mobile"></i>采集工具</el-button
      >
    </el-row>
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible">
      <el-upload
        class="upload-demo"
        :action="actionUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="uploadSuccess"
        multiple
        :data="uploadParams"
        ref="upload"
        accept=".xlsx"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :auto-upload="false"
        :on-progress="uploadProgress"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传xlsx文件，且不超过500kb
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSearchMixin } from "../../mixin"; //混淆请求
import { api } from "../../api/api"; //api配置请求的路径
export default {
  name: "importFeed",
  mixins: [listSearchMixin],
  props: {
    datePacleholder: {
      type: String,
      default: "请选择上架时间"
    },
    foremost: {
      type: String,
      default: ""
    },
    second: {
      type: String,
      default: ""
    },
    buildTip: {
      type: String,
      default: ""
    },
    statusTip: {
      type: String,
      default: ""
    },
    areaTip: {
      type: String,
      default: ""
    },
    inputPlaceholder: {
      type: String,
      default: "请输入名称关键字"
    },
    //     第一个数组选项值
    foremostData: {
      type: Array,
      default: []
    },
    statusData: {
      type: Array,
      default: []
    },
    buildData: {
      type: Array,
      default: []
    },
    areaData: {
      type: Array,
      default: []
    },
    // 第二个下拉选项
    secondData: {
      type: Array,
      default: []
    },
    //     判断时间选择器和输入框展示的状态码
    IsZoomed: {
      type: Number,
      default: ""
    }
  },
  data() {
    return {
      // actionUrl: api.login, //上传文件接口
      actionUrl: "https://jsonplaceholder.typicode.com/posts/", //上传文件接口
      formInline: {
        sourceType: 1, // 第一个值
        status: "",
        areaId: "",
        buildId: "",
        dateVal: "", // 时间选择器
        sourceName: "" // 输入框的值
      },
      dialogFormVisible: false,
      form: {
        name: "",
        region: ""
      },
      formLabelWidth: "120px",
      fileList: [],
      uploadParams: {
        // 上传文件的参数
        a: 123
      }
    };
  },
  methods: {
    locationHref() {
      window.open("http://hztxfw.gdyuhui.net/AccessData/");
    },
    onSubmit() {
      this.$emit("onSubmit", this.formInline);
    },
    addModule() {
      this.$emit("addModule");
    },
    addCabinet() {
      this.$emit("addCabinet");
    },
    editSource() {
      this.$emit("editSource");
    },
    deleteSource() {
      this.$emit("deleteSource");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitUpload() {
      const self = this;
      this.dialogFormVisible = false;
      // this.$refs.upload.submit();
      this.$emit("loadingFn", true);
      setTimeout(() => {
        self.$router.push({
          name: "buildModel",
          params: { data: null, buildId: 114101 }
        });
        self.$emit("loadingFn", false);
      }, 2000);
    },
    uploadSuccess(e) {
      console.log("上传成功返回的数据", e);
      this.$emit("loadingFn", false);
      this.$router.push({
        name: "buildModel",
        params: { data: e, buildId: 114101 }
      });
    },
    uploadProgress() {
      this.$emit("loadingFn", true);
    }
  }
};
</script>

<style scoped lang="scss">
.selectInput {
  width: 100%;
  border-bottom: 1px dashed rgba(186, 205, 229, 0.23);
  .buttonMar {
    margin-left: 10px;
  }
}
</style>
<style>
.selectInput .buttonMar .el-button--primary {
  color: #fff;
  background-color: #409eff82;
  border-color: #7187f0;
}
.selectInput .el-input__inner {
  background-color: transparent;
  border: 1px solid rgba(186, 205, 229, 0.2);
}
.el-date-table td.current:not(.disabled),
.el-date-table td.end-date,
.el-date-table td.start-date {
  background-color: #7187f0 !important;
}
.el-date-table td.today:before {
  border-top: 0.5em solid #7187f0;
}
</style>
