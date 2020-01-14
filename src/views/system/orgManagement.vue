<template>
    <div class="orgManagement deleteMassage">
        <div class="principal">
                <div class="principalHeader"></div>
                <div class="principalContent">
                    <!-- 指示栏 -->
                    <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
                </div>
            </div>
        <div class=" container page-container ">
            <div class="center-conten clearfix">
                <el-row :gutter="20">
                    <!-- 树状图开始 -->
                    <el-col :span="6" style="width: 30%;">
                       <div class="grid-content bg_role8 ui-padding0" style="overflow-y: auto;height: 700px;">
                        <el-tree class="haha" accordion  :data="dataTree" accordion highlight-current :expand-on-click-node="true"  @node-click="nodeClick" > </el-tree>
                      </div>
                    </el-col>
                        <el-col :span="18" style="margin-top: 30px;width: 70%;">
                           <div class="grid-content bg-purple bg_role16">
                               <el-col :span="24" class="toolbar col-br">
                                   <el-form @submit.native.prevent :inline="true">
                                        <el-form-item class="plus_input add" style="font-size:18px">
                                           <span style="font-size:18px">{{orgName}}</span>
                                       </el-form-item>
                                   </el-form>
                               </el-col>
                               <el-col :span="24" class="toolbar col-br">
                                   <el-form @submit.native.prevent :inline="true">
                                       <el-form-item class="plus_input add" v-show="isShowUpdateButton">
                                           <el-button  icon="plus" class="orgButton" @click="handleUpdate">
                                               <i class="el-icon-edit orgedit"></i>修改</el-button>
                                       </el-form-item>
                                       <el-form-item class="plus_input delete" v-show="isShowDeleteButton">
                                           <el-button  icon="plus" class="orgButton" @click="handleDelete">
                                               <i class="el-icon-delete orgedit"></i>删除</el-button>
                                       </el-form-item>
                                   </el-form>
                               </el-col>
                                   <div class="el-tabs-Q" style="margin-top: 36px;">
                                         <el-form  label-width="80px" label-color="#fff">
                                           <el-form-item label="机构编码"  auto-complete="off">
                                             <el-input v-model="orgCode" style="cursor: not-allowed;" :disabled="true" readonly></el-input>
                                           </el-form-item>
                                           <el-form-item label="机构名称">
                                             <el-input v-model="orgName" style="cursor: not-allowed;" :disabled="true" readonly></el-input>
                                           </el-form-item>
                                           <el-form-item label="上级机构" auto-complete="off">
                                             <el-input v-model="orgParentName" style="cursor: not-allowed;" :disabled="true" readonly></el-input>
                                           </el-form-item>
                                           <el-form-item label="机构描述"  >
                                             <el-input  v-model="describe" style="cursor: not-allowed;"  :disabled="true" readonly></el-input>
                                           </el-form-item>
                                         </el-form>
                                  </div>
                           </div>
                       </el-col>

                        <!-- 修改机构 -->
                         <el-dialog title="修改" :visible.sync="updateDialog"   class="dialog_sele" custom-class="el-dialog--small">
                           <el-form :model="updateForm" :rules="addFormRules" ref="updateForm" >
                             <el-form-item label="机构编码" :label-width="formLabelWidth" prop="orgCode" auto-complete="off">
                               <el-input v-model="updateForm.orgCode" placeholder="请输入机构编码" readonly="readonly"></el-input>
                             </el-form-item>
                             <el-form-item label="机构名称" :label-width="formLabelWidth"  prop="orgName" auto-complete="off">
                               <el-input v-model="updateForm.orgName" placeholder="请填写机构名称"></el-input>
                             </el-form-item>
                             <el-form-item label="机构描述" class="represent" :label-width="formLabelWidth"  prop="describe"  auto-complete="off">
                               <el-input v-model="updateForm.describe" placeholder="请填写机构描述"></el-input>
                             </el-form-item>
                           </el-form>
                           <div slot="footer" class="dialog-footer">
                             <el-button @click="updateDialog = false">取 消</el-button>
                             <el-button type="primary" class="primary" @click="updateSumbit">确 定</el-button>
                           </div>
                         </el-dialog>
                         <!-- 修改机构结束 -->
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {listSearchMixin} from "../../mixin";//混淆请求
import {api} from "../../api/api";//api配置请求的路径
import StatusBar from './statusBar' // 模块指示栏组件
import paging from './paging' // 分页
import qs from 'qs'
import moment from 'moment'

import {
    Input,
    Button,
    Form,
    Row,
    Col,
    Table,
    Pagination,
    Dialog,
    Select,
    Option
} from 'element-ui'
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)

export default {
    name:"orgManagement",
    mixins: [listSearchMixin],
    components: { StatusBar },
    data() {
        return{
             orgName:'',
             orgCode:'',
             orgParentName:'',
             describe:'',
             barNames: '机构管理', // 指示栏名称
             nabarCation: imagesSrc.nabarCation, // 图片
             dataTree:[],//树节点数据
             updateDialog: false, //设置界面是否显示
             updateForm: {
                orgId:'',
                orgName: '',
                orgCode: '',
                describe: ''
              },
              formLabelWidth: '120',
              addFormRules: {
                  orgCode: [
                    { required: true, message: '请输入机构编码', trigger: 'blur' },
                  { max: 20, message: '长度最大 20' }
                  ],
                  orgName: [
                    { required: true, message: '请输入机构名称', trigger: 'blur' },
                  { max: 20, message: '长度最大 20' }
                  ],
                  describe: [
                    { max: 100, message: '长度最大 100' }
                    ]
                },
                currentOrgId:"",
                isShowUpdateButton:false,
                isShowDeleteButton:false
        }
    },
    mounted(){
         this.getTree();//初始化机构树

         var headers = JSON.parse(sessionStorage.getItem("headers"));
         if(headers==null || headers.buttonList==null){
             return;
         }
         let buttonList = JSON.parse(headers.buttonList);
         for (var i = 0; i < buttonList.length; i++){
            if(buttonList[i].buttonStr=="sys_organ_update"){//修改按钮
                this.isShowUpdateButton = true;
            }
            if(buttonList[i].buttonStr=="sys_organ_delete"){//删除按钮
                this.isShowDeleteButton = true;
            }
        }

    },
    methods: {
         // 获取树节点的索引值开始
         nodeClick(data,node,thistree){
            this.orgName = data.orgName;
            this.orgCode = data.orgCode;
            this.orgParentName = data.orgParentName;
            this.describe = data.describe;
            this.currentOrgId = data.orgId;
          },
         getTree(){
              let self = this
              let param = {
                  url: api.getOrganList,//获取request_url.js文件的请求路径
              }
              self.sendReq(param, (res) => {
                   if(res.respHeader.resultCode!=0){
                       this.$message.error(res.respHeader.message);
                       return;
                   }
                   this.dataTree = util.toTreeNodes(res.respBody.data);
                   if(this.dataTree.length>0){
                       this.orgName = this.dataTree[0].orgName;
                       this.orgCode = this.dataTree[0].orgCode;
                       this.orgParentName = this.dataTree[0].orgParentName;
                       this.describe = this.dataTree[0].describe;
                       this.currentOrgId = this.dataTree[0].orgId;
                   }
              })
         },
         handleUpdate(){
            if(this.currentOrgId==null || this.currentOrgId=='' || this.currentOrgId==undefined){
                return;
            }
              let self = this
              let param = {
                  url: api.getOrganDetail+this.currentOrgId,//获取request_url.js文件的请求路径
                  method:'get'
              }
              self.sendReq(param, (res) => {
                  if(res.respHeader.resultCode==0){
                       this.resetForm('updateForm');
                       this.updateDialog = true;
                       this.updateForm.orgName = res.respBody.data.orgName;
                       this.updateForm.orgCode = res.respBody.data.orgCode;
                       this.updateForm.describe = res.respBody.data.describe;
                   }else{
                     this.$message.error(res.respHeader.message);
                     return;
                  }
              })
         },
          getOrgan(){
             if(this.currentOrgId==null || this.currentOrgId=='' || this.currentOrgId==undefined){
                 return;
             }
               let self = this
               let param = {
                   url: api.getOrganDetail+this.currentOrgId,//获取request_url.js文件的请求路径
                   method:'get'
               }
               self.sendReq(param, (res) => {
                    if(res.respHeader.resultCode!=0){
                         this.$message.error(res.respHeader.message);
                          return;
                    }
                   this.orgName = res.respBody.data.orgName;
                   this.orgCode = res.respBody.data.orgCode;
                   this.describe = res.respBody.data.describe;
               })
          },
         resetForm(formName){
             if (this.$refs[formName]!==undefined) {
               this.$refs[formName].resetFields();
             }
         },
         updateSumbit(){
            console.log(this.updateForm);
            this.$refs['updateForm'].validate((valid) => {
              if (valid) {
                  if(this.currentOrgId==null || this.currentOrgId=='' || this.currentOrgId==undefined){
                      return;
                  }
                  this.updateForm.orgId = this.currentOrgId;
                  let self = this;
                  let param = {
                      url: api.organUpdateCommit,
                      data: qs.stringify(this.updateForm),
                      contentType : 'application/x-www-form-urlencoded'
                  }
                  self.sendReq(param, (res) => {
                     if(res.respHeader.resultCode!=0){
                         this.$message.error(res.respHeader.message);
                         return;
                    }
                    this.updateDialog = false;
                    common.success();
                    this.getOrgan();
                    this.getTree();
                  })
              } else {
                 return ;
              }
            });
         },
         handleDelete(){
              if(this.currentOrgId==null || this.currentOrgId=='' || this.currentOrgId==undefined){
                   return;
               }
               let self = this;
               let curId = this.currentOrgId;
              common.deleted(function (object) {
                    let param = {
                        url: api.deleteOrgan + curId,
                        method:'get'
                    }
                   self.sendReq(param, (res) => {
                      if(res.respHeader.resultCode!=0){
                          Vue.prototype.$message.error(res.respHeader.message);
                          return;
                     }
                     self.getTree();
                     common.success();
                   })
              },this);
          }
    }

}
</script>

<style scoped lang="scss">

    .haha{
        overflow-y: auto;
        height:633px;
    }

    .el-dialog__header {
      padding: 0;
    }

    .el-dialog--small .el-form-item__label {
      font-weight: bold;
      width: 13% !important;
    }

    .el-dialog__headerbtn .el-dialog__close:hover {
      color: #fff;
    }

    .el-input__inner {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #1c324c;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #1c324c;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #fff;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .bg-purple {
      background: rgba(28, 50, 76, 0.5);
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
        line-height: 36px;
    }
    .el-button {
      transition: 0.3s;
      -webkit-transition: 0.3s;
      background: none !important;
      border: 1px solid #264466;
      color: #bacde5;
    }

    .center-conten {
      width: 100%;
    }

    .bg-breadth-6 {
      width: 100%;
    }

    .bg-breadth-18 {
      width: 100%;
      padding: 30px;
      box-sizing: border-box;
    }

      .bg_role16, .bg_role8 {
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
      }

      .roleH {
        height: 64px;
        padding: 15px 30px;
        box-sizing: border-box;
      }

      // 树状图
      .el-checkbox__inner {
        border-radius: 0 !important;
        background: transparent;
      }

      .el-checkbox__inner::after {
        position: absolute;
        left: 6px;
        top: 2px;
      }

      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: none;
        border: 1px solid #2e576f;
      }

      .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
        background-color: transparent;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        border: none;
      }

      .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background: rgba(138, 179, 229, 0.1);
        border-radius: 2px;
        color: #49c1ff;
      }

      .el-tree {
        background: rgba(28, 50, 76, 0.5);
        border: none;
        padding: 15px;
        color: #bacde5;
        box-sizing: border-box;
      }

    .parinciRepresent::-webkit-scrollbar { /*滚动条整体样式*/
        width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 6px;
    }

    .parinciRepresent::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 4px;
        /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
        background: rgba(11,24,41,0.4);
    }

    .parinciRepresent::-webkit-scrollbar-track { /*滚动条里面轨道*/
        /* -webkit-box-shadow: inset 0 0 5px rgba(225,225,225,0.2); */
        border-radius:4px;
        background: transparent;
    }
.principal {
    display: flex;
    flex-direction: column;
    height:100%;
    overflow: hidden;
    .principalHeader{
        height: 70px;
    }
    .principalContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        .parinciRepresent {
            padding: 31px 98px;
            box-sizing: border-box;
            flex: 1;
            overflow-y: auto;
            .parinci {
                padding: 31px 33px 41px 33px;
                box-sizing: border-box;
                background: #152242;
            }
        }


    }
}
</style>

<style>
    /*  chen 2019-2月27 */
.el-dialog--small .el-dialog__header {
    padding: 0;
}
.el-dialog--small .el-form-item__label {
    font-size:14px;
    font-weight:bold;
    color:#BACDE5;
}
.represent .el-form-item__label::before{
    content: '';
    width: 9px;
    display: inline-block;
}
.el-button.primary {
    background:rgba(113,135,240,1) !important;
    border:1px solid rgba(113,135,240,1);
    border-radius:4px;
    font-size:14px;
    font-weight:400;
    color:rgba(255,255,255,1);
    text-align: center;
}
/*.orgManagement .el-form-item__label{*/
    /*color: #BACDE5;*/
/*}*/
.orgManagement .el-input.is-disabled .el-input__inner{
    background:rgba(156,156,156,.1);
    color: #fff;
    border:none;
}
.orgManagement .orgedit{
    margin-right: 10px;
}
.orgManagement .el-button.orgButton{
    padding: 11px 15px;
    box-sizing: border-box;
}
.orgManagement .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background:rgba(113,135,240,0.12);
    border:1px solid rgba(113,135,240,1);
    border-radius:3px;
    color:rgba(255,255,255,1);
}
.orgManagement .el-tree-node:focus>.el-tree-node__content{
    background:rgba(113,135,240,0.12);
}
</style>
