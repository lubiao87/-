<template>
  <div class="sysUserManagement deleteMassage">
        <div class="principal">
               <div class="principalHeader"></div>
               <div class="principalContent">
                   <!-- 指示栏 -->
                   <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
               </div>
           </div>

           <!-- 上方数据结束 -->
            <div class=" container page-container " style=" width: 1388px;">
                <div class="center-conten">
                  <el-row v-bind:gutter="20" style="margin-top: 30px;">
                    <!-- <el-col :span="6">
                          <div class="grid-content bg_role8 ui-padding0" style="padding: 0px;overflow-y: auto;height: 700px;">
                           <el-tree accordion  :data="dataTree" class="haha" accordion highlight-current :expand-on-click-node="true"  @node-click="nodeClick"> </el-tree>
                         </div>
                     </el-col> -->
                     <el-col :span="18" style="overflow-y: auto;height: 727px;">
                       <div class="grid-content bg-purple bg-breadth-18">
                         <!--工具条开始-->
                         <el-col :span="24" class="toolbar col-br">
                           <el-form :inline="true" >
                               <!-- 按钮组 -->
                               <el-button-group>
                               <el-button  icon="plus" @click="handleAdd" class="button" v-show="isShowAddButton">
                                   <i class="el-icon-plus rightMar"></i>添加
                               </el-button>
                                <el-button  icon="plus" @click="handleUpdate" class="button" v-show="isShowUpdateButton">
                                    <i class="el-icon-edit rightMar"></i>修改
                                </el-button>
                                  <el-button  icon="plus" @click="handleDelete"  class="button" v-show="isShowDeleteButton">
                                      <i class="el-icon-delete rightMar"></i>删除
                                  </el-button>
                               </el-button-group>
                               <!-- 输入框 -->
                               <el-form-item class="sysInput">
                                   <el-input v-model="userName" placeholder="姓名/用户名/手机号码"
                                             @keyup.enter.native="handleIconClick" icon="search"
                                             suffix-icon="el-icon-search"
                                             v-on:focus="chagecolor=false" v-on:blur="chagecolor=true"
                                             v-bind:class="{'writeColor':chagecolor, 'activeColor': !chagecolor }">
                                   </el-input>
                               </el-form-item>
                           </el-form>
                         </el-col>
                         <!--工具条结束-->
                         <!-- 表格内容开始 -->
                           <el-table :data="userTableData"  style="width: 100%"  v-loading="listLoading" @selection-change="handleSelectionChange">
                                <el-table-column type="selection"  width="55"></el-table-column>
                                <el-table-column prop="useName" label="姓名" width="130"> </el-table-column>
                                <el-table-column prop="useId" label="用户名" width="150"> </el-table-column>
                                <el-table-column prop="phone" label="手机号" width="120"> </el-table-column>
                                <el-table-column prop="roleName" label="角色" width="110"> </el-table-column>
                                <el-table-column prop="updateTime" label="更新时间" width="170" :formatter="dateFormat"> </el-table-column>
                                <el-table-column prop="updateUseId" label="更新人" > </el-table-column>
                            </el-table>
                            <!-- 分页 -->
                            <paging :paginaTotal="tableParams.total"
                                    :pageSize="tableParams.size"
                                    :currentPage4="tableParams.currentPage4" @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange">
                            </paging>
                       </div>
                     </el-col>

                  </el-row>
                </div>
            </div>

        <!--新增界面-->
        <el-dialog title="添加" v-model="addDialog" :visible.sync="addDialog" class="dialog_sele" custom-class="el-dialog--small">
          <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
            <el-form-item label="姓名" prop="useName" auto-complete="off">
              <el-input v-model="addForm.useName" ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="addForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="useId" auto-complete="off">
              <el-input v-model="addForm.useId" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" auto-complete="off">
              <el-input v-model="addForm.password" ></el-input>
            </el-form-item>
            <el-form-item label="平台角色" prop="roleId">
              <el-select v-model="addForm.roleId" >
                    <el-option  v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="机构" prop="useOrgId">
                  <el-select v-model="addForm.useOrgId">
                        <el-option  v-for="item in organOptions" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                  </el-select>
                </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addDialog = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>
        <!-- 增加内容结束 -->

        <!--修改界面-->
            <el-dialog title="修改" v-model="updateDialog" :visible.sync="updateDialog" class="dialog_sele" custom-class="el-dialog--small">
              <el-form :model="updateForm" label-width="80px" :rules="updateFormRules" ref="updateForm">
                <el-form-item label="姓名" prop="userName" auto-complete="off">
                  <el-input v-model="updateForm.userName" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobilePhone">
                  <el-input v-model="updateForm.mobilePhone"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userId" auto-complete="off" >
                  <el-input v-model="updateForm.userId" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password"  auto-complete="off">
                  <el-input v-model="updateForm.password" placeholder="为空代表不修改密码"></el-input>
                </el-form-item>
                 <el-form-item label="CRM工号" prop="crmCode"  auto-complete="off">
                  <el-input v-model="updateForm.crmCode" ></el-input>
                </el-form-item>
                <el-form-item label="平台角色">
                  <el-select v-model="updateForm.roleId" >
                        <el-option  v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                  </el-select>
                </el-form-item>
                 <el-form-item label="机构">
                      <el-select v-model="updateForm.useOrgId" >
                            <el-option  v-for="item in organOptions" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                      </el-select>
                    </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateDialog = false">取消</el-button>
                <el-button type="primary" @click.native="updateSubmit" :loading="updateLoading">提交</el-button>
              </div>
            </el-dialog>
            <!-- 修改内容结束 -->

  </div>
</template>

<script>
import Vue from 'vue'
import {listSearchMixin} from "../../mixin";//混淆请求
import {api} from "../../api/api";//api配置请求的路径
import StatusBar from './statusBar' // 模块指示栏组件
import imagesSrc from '../../assets/common/images' // 图片管理文件
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
     name:"sysUserManagement",
     mixins: [listSearchMixin],
     components: { StatusBar,paging},
     data() {
         return{
            barNames: '用户管理',
            nabarCation: imagesSrc.nabarCation,
            formLabelWidth: '120',
            userName:'',//搜索条件
            orgId:'',
            dataTree:[],
            userTableData: [],
            chagecolor:true,
            listLoading:false,
            roleOptions: [],//角色选项
            organOptions: [],//机构选项
            addLoading:false,
            updateLoading:false,
            addDialog: false,//添加界面是否显示
            updateDialog: false,//添加界面是否显示
            multipleSelection: [],//勾选的记录
            tableParams: {
                total: 10,     //总数量
                size: 10,       //每页显示数量
                currentPage4: 1 //当前页
            },
            addForm: { //添加界面数据
                useId: '',
                useName:'',
                useOrgId:'',
                roleId:'',
                password:'',
                phone: ''
            },
            updateForm: { //添加界面数据
                userName: '',
                mobilePhone:'',
                crmCode:'',
                userId: '',
                roleId:'',
                useOrgId:'',
                password:'',
            },
            addFormRules: {
                useName: [
                  { required: true, message: '请输入姓名', trigger: 'blur' },
                  { max: 20, message: '长度最大 20' }
                ],
                useId: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  {pattern:/^[A-Za-z][A-Za-z0-9_]{1,14}$/,message:'用户名长度2到15位,以字母开头,由字母、数字、下划线组成'}
                ],
                phone: [
                  { required: true, message: '请输入电话号码', trigger: 'blur' },
                  {pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,message:'请输入正确的手机号码'}
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  {pattern: /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*))[0-9A-Za-z]{6,10}$/, message: '密码长度6-10位,必须包含数字字母'}
                ],
                roleId: [
                  { required: true, message: '请选择角色', trigger: 'change' }
                ],
                useOrgId: [
                  { required: true, message: '请选择机构', trigger: 'change' }
                ]
              },
             updateFormRules: {
                userName: [
                  { required: true, message: '请输入姓名', trigger: 'blur' },
                  { max: 20, message: '长度最大 20' }
                ],
                userId: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  {pattern:/^[A-Za-z][A-Za-z0-9_]{1,14}$/,message:'用户名长度2到15位,以字母开头,由字母、数字、下划线组成'}
                ],
                mobilePhone: [
                  { required: true, message: '请输入电话号码', trigger: 'blur' },
                  {pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,message:'请输入正确的手机号码'}
                ],
                crmCode: [
                  {max: 32, message: '长度最大 32' }
                ],
                password: [
                  {pattern: /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[\~\`\-\=\[\]\\\'\;\,\.\/\~\!\@\#\$\%\^\&\*\(\)\_\+\|\}\{\:\"\?\>\<].*))[\~\`\-\=\[\]\\\'\;\,\.\/\~\!\@\#\$\%\^\&\*\(\)\_\+\|\}\{\:\"\?\>\<0-9A-Za-z]{8,16}$/, message: '密码长度8-16位,必须包含数字字母和英文标点'}
                ],
                role: [
                  { required: true, message: '请选择角色', trigger: 'change' }
                ],
                useOrgId: [
                  { required: true, message: '请选择机构', trigger: 'change' }
                ]
              },
              isShowAddButton:false,
              isShowUpdateButton:false,
              isShowDeleteButton:false

         }
     },
     mounted(){
           //this.getTree();
           this.getUsers();
           //this.getAllRole();
           //this.getAllOrgan();

           var headers = JSON.parse(sessionStorage.getItem("headers"));
            if(headers==null || headers.buttonList==null){
                return;
            }
            let buttonList = JSON.parse(headers.buttonList);
            for (var i = 0; i < buttonList.length; i++){
               if(buttonList[i].buttonStr=="sys_use_insert"){//添加按钮
                   this.isShowAddButton = true;
               }
               if(buttonList[i].buttonStr=="sys_use_update"){//修改按钮
                   this.isShowUpdateButton = true;
               }
               if(buttonList[i].buttonStr=="sys_use_delete"){//删除按钮
                   this.isShowDeleteButton = true;
               }
           }

     },
     beforeRouteEnter:function(to, from, next){
         next(vm => {
               vm.getTree();
               vm.getAllRole();
               vm.getAllOrgan();
         });
      },
      methods: {
         nodeClick(data,node,thistree){// 获取树节点的索引值开始
            this.orgId = data.orgId;
            console.log(this.orgId);
            this.tableParams.currentPage4=1;
            this.getUsers();
        },
        handleIconClick(){
             this.getUsers();
         },
         getTree(){
              let self = this
              let param = {
                  url: api.getOrganList,//获取request_url.js文件的请求路径
              }
              self.sendReq(param, (res) => {
                    let all = new Array();
                    all.push({
                       orgId:null,
                       orgParentId:null,
                       orgName:'全部',
                       label:'全部',
                       children: util.toTreeNodes(res.respBody.data)
                     });
                   this.dataTree = all;
              })
         },
        getUsers() {
                 let obj = {
                       'page': this.tableParams.currentPage4,
                       'pageSize': this.tableParams.size,
                       'userName':this.userName,
                       'orgId':this.orgId
                  }
                 let self = this;
                 let param = {
                     url: api.queryTbSysUserList,
                     data: qs.stringify(obj),
                     contentType : 'application/x-www-form-urlencoded'
                 }
                 self.sendReq(param, (res) => {
                 console.log(res);
                        if(res.respHeader.resultCode!=0){
                            this.$message.error(res.respHeader.message);
                            return;
                        }
                       this.tableParams.currentPage4 = res.respBody.data.page,
                       this.tableParams.size = res.respBody.data.pageSize;
                       this.tableParams.total = res.respBody.data.totals;
                       this.userTableData = res.respBody.data.list;
                 })
        },
        handleCurrentChange(val){
              this.tableParams.currentPage4 = val;
              this.getUsers();
        },
        handleSizeChange(val){
            this.tableParams.size = val;
            this.getUsers();
          },
        handleAdd(){//打开添加窗口
            this.addDialog = true;
            this.resetForm('addForm');
            this.addForm =  {
                   useName: '',
                   phone:'',
                   useId: '',
                   roleId:'',
                   password:'',
                   useOrgId:''
            };
        },
        getAllRole(){
          let self = this
          let param = {
              url: api.getAllRole,
              method:'get'
          }
          self.sendReq(param, (res) => {
              this.roleOptions = res.respBody.data;
          })
        },
        getAllOrgan(){
          let self = this
          let param = {
              url: api.getAllOrgan,
              method:'get'
          }
          self.sendReq(param, (res) => {
              this.organOptions = res.respBody.data;
          })
       },
       addSubmit(){ //新增用户
             this.addLoading = true;
             this.$refs['addForm'].validate((valid) => {
                 if (!valid) {
                     return ;
                 }
                 if(this.addForm.roleId==null || this.addForm.roleId==""){
                     this.$message.error("请选择角色");
                     return ;
                  }
                 if(this.addForm.useOrgId==null || this.addForm.useOrgId==""){
                    this.$message.error("请选择机构");
                    return ;
                 }
                  let self = this;
                  let param = {
                      url: api.addUserCommit,
                      data: this.addForm,
                      method:'post'
                  }
                  self.sendReq(param, (res) => {
                     console.log(res);
                     if(res.respHeader.resultCode!=0){
                         this.$message.error(res.respHeader.message);
                         return;
                    }
                    this.addDialog = false;
                    this.$message({type: 'success',message: '添加成功'});
                    this.getUsers();
                  })
             });
            this.addLoading = false;
       },
       updateSubmit(){
         this.updateLoading = true;
         this.$refs['updateForm'].validate((valid) => {
             if (!valid) {
                 return ;
             }
             if(this.updateForm.roleId==null || this.updateForm.roleId==""){
                 this.$message.error("请选择角色");
                 return ;
              }
             if(this.updateForm.userOrgid==null || this.updateForm.userOrgid==""){
                this.$message.error("请选择机构");
                return ;
             }
              let self = this;
              let param = {
                  url: api.updateUserCommit,
                  data: qs.stringify(this.updateForm),
                  contentType : 'application/x-www-form-urlencoded'
              }
              self.sendReq(param, (res) => {
                 console.log(res);
                 if(res.respHeader.resultCode!=0){
                     this.$message.error(res.respHeader.message);
                     return;
                }
                this.updateDialog = false;
                common.success();
                this.getUsers();
              })
         });
        this.updateLoading = false;
       },
       resetForm(formName){
          if (this.$refs[formName]!==undefined) {
            this.$refs[formName].resetFields();
          }
       },
       handleUpdate(){
            console.log(this.multipleSelection);
            if(this.multipleSelection!=null && this.multipleSelection.length>1){
                this.$message.error("只能勾选1条记录");
                return;
            }
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要修改的用户");
                 return;
            }
            this.updateDialog = true;
            this.resetForm('updateForm');
            this.updateForm =  {
               userName: this.multipleSelection[0].userName,
               mobilePhone:this.multipleSelection[0].mobilePhone,
               crmCode: this.multipleSelection[0].crmCode,
               userId: this.multipleSelection[0].userId,
               roleId: this.multipleSelection[0].roleId,
               userOrgid: this.multipleSelection[0].userOrgid,
               password:'',
            };
       },
       handleSelectionChange(val){ //用户列表勾选触发事件
            this.multipleSelection = val;
       },
       handleDelete(){
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要删除的用户");
                return;
            }
            let userIds = [];
           for(let i=0;i<this.multipleSelection.length;i++){
               userIds.push(this.multipleSelection[i].userId);
            }
            let self = this;
            common.deleted(function (object) {
               let param = {
                    url: api.batchDeleteUsers ,
                    data:{ 'userIds':userIds},
                }
                self.sendReq(param, (res) => {
                   if(res.respHeader.resultCode!=0){
                       object.$message.error(res.respHeader.message);
                       return;
                  }
                 common.success();
                 object.getUsers();
                })
            },this);
       },
       dateFormat(row, column) {
                var date = row[column.property];
                if (date === undefined || date == "" || date == null) {
                  return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
          }

    }

}



</script>

<style scoped lang="scss">

    .haha{
        overflow-y: auto;
        height: 633px;
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

    .bg-purple{
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
 /*表格样式 */
.el-table tr{
   background-color: transparent !important;
}
.el-table th{
   background-color: #2E3A62;
}
.el-table__footer-wrapper thead div, .el-table__header-wrapper thead div{
   background-color: #2E3A62;
   font-size: 14px;
   font-weight: normal;
   color: #fff;
}
.el-table{
   color: #BACDE5;
   font-size: 14px;
}
/*  chen 2019-2月27 */
.button{
 font-size:14px;
 font-weight:400;
 color:rgba(186,205,229,1);
}
.rightMar {
margin-right: 10px;
}
.sysInput{
 float: right;
}
.sysInput .el-input__inner{
 background: transparent;
 border:1px solid rgba(186, 205, 229, 0.2);
}
.sysInput .el-input__inner::placeholder{
 color: #8694A6;
}
 .sysUserManagement .el-checkbox__inner:hover{
     border-color: #7187F0;
 }
.sysUserManagement .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
 background:rgba(113,135,240,0.12);
 border:1px solid rgba(113,135,240,1);
 border-radius:3px;
 color:rgba(255,255,255,1);
}
.sysUserManagement .el-tree-node:focus>.el-tree-node__content{
 background:rgba(113,135,240,0.12);
}
.sysUserManagement .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
 background-color: #7187F0;
 border-color: #7187F0;
}
</style>