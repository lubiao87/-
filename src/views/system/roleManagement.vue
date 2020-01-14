<template>
    <div class="roleManagement deleteMassage">
       <div class="principal">
           <div class="principalHeader"></div>
           <div class="principalContent">
               <!-- 指示栏 -->
               <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
           </div>
       </div>

        <!-- 角色管理界面名称结束 -->
        <div class=" container page-container ">
        <div class="center-conten clearfix">
            <el-row :gutter="20" style="margin-top: 30px;">
                <el-col :span="16" style="overflow-y: auto;height: 727px;">
                    <div class="grid-content bg-purple bg_role16">
                        <!--工具条开始-->
                        <el-col :span="24" class="toolbar col-br">
                            <el-form  :inline="true">
                                <!-- 按钮组 -->
                                <el-button-group>
                                    <el-button  icon="plus" @click="handleAdd" v-show="isShowAddButton">
                                        <i class="el-icon-plus rightMar"></i>添加</el-button>
                                    <el-button  icon="plus" @click="handleUpdate" v-show="isShowUpdateButton">
                                        <i class="el-icon-edit rightMar"></i>修改</el-button>
                                    <el-button  icon="plus" @click="deleteRole" v-show="isShowDeleteButton">
                                        <i class="el-icon-delete rightMar"></i>删除</el-button>
                                </el-button-group>
                                <!-- 搜索框 -->
                                <el-form-item class="roleInput">
                                    <el-input placeholder="角色名称" v-model="roleNameParam"
                                              @keyup.enter.native="handleIconClick" icon="search"
                                              suffix-icon="el-icon-search"
                                              v-on:focus="chagecolor=false" v-on:blur="chagecolor=true"
                                              v-bind:class="{'writeColor':chagecolor, 'activeColor': !chagecolor }">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!--工具条结束-->
                        <!-- 角色管理表格开始 -->
                        <el-table :data="roleTableData"  style="width: 100%" class="roleTable"  @selection-change="handleSelectionChange">
                             <el-table-column type="selection"  width="55"></el-table-column>
                            <el-table-column prop="name" label="角色名称" width="150"> </el-table-column>
                            <el-table-column prop="code" label="角色编码" width="150"> </el-table-column>
                            <el-table-column prop="roleDes" label="角色描述"> </el-table-column>
                            <el-table-column prop="updateTime" label="更新时间" :formatter="dateFormat"> </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <paging :paginaTotal="tableParams.total"
                                :pageSize="tableParams.size"
                                :currentPage4="tableParams.currentPage4" @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange">
                        </paging>
                    </div>
                </el-col>
                <!-- 角色管理表格结束 -->

                 <!-- 权限开始 -->
                <el-col :span="8">
                    <div class="grid-content bg-purple bg_role8" style="padding:0;">
                        <div class="roleH">
                            <h1>
                                权限
                                <el-button icon="setting" class="roleS rolesetting"  @click="setCheckedNodes">
                                    <i class="el-icon-setting el-role-setting"></i>配置</el-button>
                            </h1>
                        </div>
                        <el-tree :data="permissionTree" ref="tree" accordion show-checkbox node-key="id" :default-checked-keys="selectedPermissionForRole.permissionIds"  :expand-on-click-node="true" :props="defaultProps"></el-tree>
                        <div class="rolebtn">
                            <el-button v-show="cancel" @click="cancelSelect">取消</el-button>
                            <el-button v-show="affirm" type="primary" class="primary" @click="affirmPermission">确认</el-button>
                        </div>
                    </div>
                </el-col>
                <!-- 权限结束 -->

                  <!-- 添加角色开始 -->
                    <el-dialog title="添加" :visible.sync="addDialog" :close-on-click-modal="false"  class="dialog_sele" custom-class="el-dialog--small">
                        <el-form :model="addForm" :rules="addFormRules"  ref="addForm"  class="dialog_selects">
                            <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name" auto-complete="off">
                                <el-input v-model="addForm.name" placeholder="请输入角色名称"></el-input>
                            </el-form-item>
                            <el-form-item label="角色编码" :label-width="formLabelWidth"  prop="code" auto-complete="off">
                                <el-input v-model="addForm.code" placeholder="请填写角色编码"></el-input>
                            </el-form-item>
                            <el-form-item label="角色描述" :label-width="formLabelWidth">
                                <el-input v-model="addForm.roleDes" placeholder="请输入描述"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click=" addDialog = false">取 消</el-button>
                            <el-button type="primary" class="primary" @click.native="addSumbit">确认</el-button>
                        </div>
                    </el-dialog>
                    <!-- 添加角色结束 -->

                    <!--修改角色开始-->
                      <el-dialog title="修改" :visible.sync="updateDialog"   class="dialog_sele" custom-class="el-dialog--small">
                        <el-form :model="updateForm" :rules="addFormRules" ref="updateForm" class="dialog_selects">
                          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name" auto-complete="off">
                            <el-input v-model="updateForm.name" placeholder="请输入角色名称"></el-input>
                          </el-form-item>
                          <el-form-item label="角色编码" :label-width="formLabelWidth" prop="code" auto-complete="off">
                            <el-input v-model="updateForm.code" placeholder="请填写角色编码"></el-input>
                          </el-form-item>
                          <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDes" auto-complete="off">
                            <el-input v-model="updateForm.roleDes" placeholder="请输入描述"></el-input>
                          </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                          <el-button @click="updateDialog = false">取 消</el-button>
                          <el-button type="primary" class="primary" @click.native="updateSumbit">确认</el-button>
                        </div>
                      </el-dialog>
                      <!--修改角色结束-->


            </el-row>
        </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {listSearchMixin} from "../../mixin";//混淆请求
import {api} from "../../api/api" //api配置请求的路径
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
    name:"roleManagement",
    mixins: [listSearchMixin],
    components: {StatusBar,paging},
    data() {
        return{
             barNames: '角色管理', // 指示栏名称
             nabarCation: imagesSrc.nabarCation, // 图片
             formLabelWidth: '120',
             chagecolor:true,
             roleTableData: [],// 表格数据
             size:10,
             roleNameParam: '',
             addDialog: false,// 添加弹框
             updateDialog:false,// 修改弹框
             permissionTree: [], //树节点数据
             //选中角色的的权限
            selectedPermissionForRole:{
             permissionIds:[],
             roleId:''
            },
             addForm: { //添加form
               id: '',
               name: '',
               code: '',
               roleDes: ''
             },
             updateForm: { //修改form
                id :'',
                name: '',
                code: '',
                roleDes: ''
              },
             // 按钮默认不显示开始
             cancel: false,
             affirm: false,
             addFormRules: {
                 name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                     { max: 20, message: '长度最大 20' }
                  ],
                  code: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' },
                     { max: 20, message: '长度最大 20' }
                  ],
                  roleDes: [ { max: 100, message: '长度最大 100' }]
                },
               tableParams: {
                    total: 10,     //总数量
                    size: 10,       //每页显示数量
                    currentPage4: 1 //当前页
                },
              multipleSelection: [],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
             //分配权限
             addRolePermission:[],
             isShowAddButton:false,
             isShowUpdateButton:false,
             isShowDeleteButton:false
        }
    },
    mounted(){
        this.getRoleList();
        this.getPermissionTree();

         var headers = JSON.parse(sessionStorage.getItem("headers"));
         if(headers==null || headers.buttonList==null){
             return;
         }
         let buttonList = JSON.parse(headers.buttonList);
         for (var i = 0; i < buttonList.length; i++){
            if(buttonList[i].buttonStr=="sys_role_insert"){//添加按钮
                this.isShowAddButton = true;
            }
            if(buttonList[i].buttonStr=="sys_role_update"){//修改按钮
                this.isShowUpdateButton = true;
            }
            if(buttonList[i].buttonStr=="sys_role_delete"){//删除按钮
                this.isShowDeleteButton = true;
            }
        }

    },
    methods: {
       handleIconClick(){
            this.getRoleList();
          },
        getRoleList(){
              let obj = {
                   'page': this.tableParams.currentPage4,
                   'pageSize': this.tableParams.size,
                   'roleName':this.roleNameParam
              }
              let self = this;
              let param = {
                  url: api.queryTbRoleList,
                  data: qs.stringify(obj),
                  contentType : 'application/x-www-form-urlencoded'
              }
              self.sendReq(param, (res) => {
                    if(res.respHeader.resultCode!=0){
                        this.$message.error(res.respHeader.message);
                        return;
                    }
                    this.tableParams.currentPage4 = res.respBody.data.page,
                    this.tableParams.size = res.respBody.data.pageSize;
                    this.tableParams.total = res.respBody.data.totals;
                    this.roleTableData = res.respBody.data.list;
              })
        },
        handleCurrentChange(val){
              this.tableParams.currentPage4 = val;
              this.getRoleList();
        },
        handleSizeChange(val){
            this.tableParams.size = val;
            this.getRoleList();
          },
        // 设置点击改变树状图按钮状态开始不能选择
          handleNotSelect: function (obj) {
              obj.disabled = true;
              if (obj.children != undefined) {
                for (var i = 0; i < obj.children.length; i++)
                  this.handleNotSelect(obj.children[i])
              }
          },
        handleSelectionChange(val) {  //角色列表勾选触发事件
                this.$refs.tree.setCheckedKeys([]);
                this.selectedPermissionForRole.permissionIds = [];
                this.multipleSelection = val;
                if(this.multipleSelection!=null && this.multipleSelection.length>1 || this.multipleSelection.length==0){
                    for(let i = 0;i < this.permissionTree.length;i++){
                        this.handleNotSelect(this.permissionTree[i]);
                      }
                      this.cancel = false;
                      this.affirm = false;
                    return;
                }
                this.cancel = false;
                this.affirm = false;
                if(this.cancel === false && this.affirm === false){
                    for(let i = 0;i < this.permissionTree.length;i++){
                      this.handleNotSelect(this.permissionTree[i]);
                    }
                }
                this.selectedPermissionForRole.roleId = this.multipleSelection[0].id;
                let self = this
                 let param = {
                     url: api.getCheckResources + this.multipleSelection[0].id,
                     method:'get'
                 }
                 self.sendReq(param, (res) => {
                     let dbObj = res.respBody.data;//勾选的
                     let tree = this.permissionTree;//全部
                     if(tree==null || tree.length==0 || dbObj==null || dbObj.length==0 ){
                        return;
                     }
                    //组装勾选的
                     for(let obj of dbObj){
                        if(obj.checked){
                            this.selectedPermissionForRole.permissionIds.push(obj.id);
                        }
                        if(obj.children!=null && obj.children.length>0){
                            for(let o of obj.children){
                                if(o.checked){
                                    this.selectedPermissionForRole.permissionIds.push(o.id);
                                }
                                if(o.children!=null && o.children.length>0){
                                    for(let _o of o.children){
                                         if(_o.checked){
                                               this.selectedPermissionForRole.permissionIds.push(_o.id+1000);
                                          }
                                    }
                                }
                            }
                        }
                     }
                     this.$refs.tree.setCheckedKeys(this.selectedPermissionForRole.permissionIds);
                 })

        },
        handleAdd(){
            this.addDialog = true;
            this.resetForm('addForm');
            this.addForm =  {
                name: '',
                code: '',
                roleDes: ''
            };
          },
        resetForm(formName){
              if (this.$refs[formName]!==undefined) {
                this.$refs[formName].resetFields();
              }
        },
        addSumbit(){
            this.$refs['addForm'].validate((valid) => {
                  if (valid) {
                      let self = this;
                      let param = {
                          url: api.roleAddCommit,
                          data: this.addForm,
                          method: "post"
                      }
                      self.sendReq(param, (res) => {
                             console.log(res);
                             if(res.respHeader.resultCode!=0){
                                 this.$message.error(res.respHeader.message);
                                 return;
                            }
                            this.addDialog = false;
                            this.$message({type: 'success',message: '添加成功'});
                            this.getRoleList();
                      })
                  }
                });
        },
        getPermissionTree(){
             let self = this
             let param = {
                 url: api.getPermissionTree,
                 method:'get'
             }
             self.sendReq(param, (res) => {
                 //设置不可选择
                 for(let object of res.respBody.data){
                     object.disabled = true;
                     for(let obj of object.children){
                        obj.disabled = true;
                       if(obj.children!=null && obj.children.length>0){
                           for(let o of obj.children){
                               o.disabled = true;
                               let buttonId = o.id;
                               o.id = buttonId+1000;//按钮ID和目录ID位于不同的表，加1000进行区分
                           }
                       }
                     }
                  }
                  this.permissionTree =res.respBody.data;
             })
        },
      // 设置点击改变树状图按钮状态开始不能选择
       handleNotSelect: function (obj) {
          obj.disabled = true;
          if (obj.children != undefined) {
            for (var i = 0; i < obj.children.length; i++)
              this.handleNotSelect(obj.children[i])
          }
      },
      setCheckedNodes: function () { //点击配置
           if(this.multipleSelection!=null && this.multipleSelection.length>1){
                this.$message.error("只能勾选1条记录");
                return;
            }
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要配置的角色");
                 return;
            }
            for(let i = 0;i < this.permissionTree.length;i++){
              this.handle(this.permissionTree[i]);
            }
          this.cancel = true;
          this.affirm = true;
        },
        // 设置点击改变树状图按钮状态开始
      handle: function (obj) {
          obj.disabled = false;
          if (obj.children != undefined) {
            for (var i = 0; i < obj.children.length; i++)
              this.handle(obj.children[i])
          }
      },
      cancelSelect(){//取消按钮
          for(let i = 0;i < this.permissionTree.length;i++){
            this.handleNotSelect(this.permissionTree[i]);
          }
          this.cancel = false;
          this.affirm = false;
          this.$refs.tree.setCheckedKeys(this.selectedPermissionForRole.permissionIds);
       },
       affirmPermission(){//保存权限
            this.addRolePermission = [];
            if(this.multipleSelection!=null && this.multipleSelection.length>1){
                this.$message.error("只能勾选1条记录");
                return;
            }
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要配置的角色");
                 return;
            }
            let selIds = this.$refs.tree.getCheckedKeys();//选中节点
            let banSelIds = this.$refs.tree.getHalfCheckedKeys();//半选中节点
            for(let i=0;i<selIds.length;i++){
                let obj = {};
                if(selIds[i]>1000){
                    let id = selIds[i]-1000;
                    obj.id = id;
                    obj.isButton = 1;
                }else{
                    obj.id = selIds[i];
                    obj.isButton = 0;
                }
                this.addRolePermission.push(obj);
            }
            for(let j=0;j<banSelIds.length;j++){
                let obj = {};
                obj.id = banSelIds[j];
                obj.isButton = 0;
                this.addRolePermission.push(obj);
            }

          let self = this;
          let param = {
              url: api.updateResourcesCommit + this.multipleSelection[0].id ,
              data: {'permissionIds':this.addRolePermission},
          }
          self.sendReq(param, (res) => {
             if(res.respHeader.resultCode!=0){
                 this.$message.error(res.respHeader.message);
                 return;
            }
            this.$message({type: 'success',message: '操作成功'});
            this.cancel = false;
            this.affirm = false;
            for(let i = 0;i < this.permissionTree.length;i++){
                this.handleNotSelect(this.permissionTree[i]);
              }
          })
       },
       deleteRole(){
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要删除的角色");
                return;
            }
           let roleIds = [];
           for(let i=0;i<this.multipleSelection.length;i++){
               roleIds.push(this.multipleSelection[i].id);
            }

            let self = this;
            self.$confirm("确定删除所选角色？","提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              let param = {
                url: api.batchDeleteRoles ,
                data:{ 'roleIds':roleIds},
              }
              self.sendReq(param, (res) => {
                 if(res.respHeader.resultCode!=0){
                     this.$message.error(res.respHeader.message);
                     return;
                 }
                this.$message({type: 'success',message: '操作成功'});
                this.getRoleList();
                 for(let i = 0;i < this.permissionTree.length;i++){
                     this.handleNotSelect(this.permissionTree[i]);
                   }
                this.cancel = false;
                this.affirm = false;
              })
            }).catch(() => {});
       },
       handleUpdate(){
            if(this.multipleSelection!=null && this.multipleSelection.length>1){
                this.$message.error("只能勾选1条记录");
                return;
            }
            if(this.multipleSelection.length==0){
                this.$message.error("请勾选需要修改的角色");
                 return;
            }
            this.resetForm('updateForm');
            let self = this;
            this.updateDialog = true;
            this.updateForm = this.multipleSelection[0]
       },
        updateSumbit(){ //修改角色提交
            this.$refs['updateForm'].validate((valid) => {
                 if (valid) {
                      let self = this;
                      let param = {
                          url: api.roleUpdateCommit,
                          data: this.updateForm,
                          mehtod : 'post'
                      }
                      self.sendReq(param, (res) => {
                         if(res.respHeader.resultCode!=0){
                             this.$message.error(res.respHeader.message);
                             return;
                        }
                        this.updateDialog = false;
                        this.$message({type: 'success',message: '操作成功'});
                        this.getRoleList();
                      })
                 }
            })
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
.el-dialog__header {
padding: 0;
}
.roleInput {
float: right;
}
.roleInput .el-input__inner{
 background: transparent;
 border:1px solid rgba(186, 205, 229, 0.2);
 border-radius:4px;
}
.roleManagement .rightMar{
 margin-right:10px;
}
.roleInput .el-input__inner::placeholder{
 color:#8694A6;
 font-size: 14px;
}
 /*.roleManagement .el-form-item__label{*/
     /*color: #BACDE5;*/
 /*}*/
 .dialog_selects .el-form-item__label::before{
     content: '';
     width: 9px;
     display: inline-block;
 }
.rolesetting{
    float: right;
}
.el-role-setting{
    margin-right: 10px;
}
.el-button.rolesetting{
    padding:9px 15px;
    box-sizing: border-box;
}
.roleTable .el-checkbox__input.is-checked
.el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #7187F0;
    border-color: #7187F0;
}
.roleTable .el-checkbox__inner:hover{
 border-color: #7187F0;
}
.roleManagement .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
 background:rgba(113,135,240,0.12);
 border:1px solid rgba(113,135,240,1);
 border-radius:3px;
 color:rgba(255,255,255,1);
}
.roleManagement .el-tree-node:focus>.el-tree-node__content{
 background:rgba(113,135,240,0.12);
}
.roleManagement .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #7187F0;
    border-color: #7187F0;
 }
.roleManagement .primary{
 background:#7187F0 !important;
 border:1px solid rgba(113,135,240,1);
 border-radius:4px;
 color: #fff;
}
.roleManagement .rolebtn{
 padding:15px 29px;
 box-sizing: border-box;
 text-align: right;
}
</style>