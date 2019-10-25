<template>
    <div class="principal">
        <div class="principalHeader"></div>
        <div class="principalContent">
            <!-- 指示栏 -->
			<!--
			<Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
			-->
            <!-- 中间模块 -->
            <div class="parinciRepresent">
                <div class="parinci">
                    <!-- form表单组件插入 -->
                    <import-Feed
                            :foremost="applicationStatus"
                            :second="CampOn"
                            :IsZoomed="currentStatus"
                            @onSubmit = "submitList">
                    </import-Feed>
                    <!-- 申请信息table数据 -->
                    <div class="parinciRepreTable">
                        <el-table :data="tableData" style="width: 100%" @row-click="tableThink">
                            <el-table-column prop="sqdh" label="申请单号" width="180"></el-table-column>
                            <el-table-column prop="sqr" label="申请人"  ></el-table-column>
                            <el-table-column prop="sqdw" label="申请单位"  ></el-table-column>
                            <el-table-column prop="sqsj" label="申请时间" width="180" ></el-table-column>
                            <el-table-column prop="sqlx" label="申请类型" ></el-table-column>
                            <el-table-column prop="sqlxmc" label="申请类型名称" width="180"></el-table-column>
                            <el-table-column prop="zyyzzt" label="资源占用状态" width="180"></el-table-column>                            
                        </el-table>
                    </div>
                    <!-- 分页 -->
                    <paging :paginaTotal="tableParams.total"
                            :pageSize="tableParams.size"
                            :currentPage4="tableParams.currentPage4">
                    </paging>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import StatusBar from './statusBar' // 模块指示栏组件
    import imagesSrc from '../../assets/common/images' // 图片管理文件
    import importFeed from './importFeed' // form表单组件注册
    import paging from './paging' // 分页
    import examine from './examine' // 资源审核
    import {listSearchMixin} from '../../mixin' //请求
    import {api} from '../../api/api' //请求
    export default {
        name: "preemptMessage",
        components: { StatusBar, importFeed, paging, examine },
        //mixins: [listSearchMixin],
        data () {
            return {
                barNames: '预占设备信息', // 指示栏名称
                nabarCation: imagesSrc.nabarCation, // 图片
                applicationStatus: '请选择申请状态',
                CampOn: '请选择预占结果',
                currentStatus: 1, // 根据当前判断时间选择器或者输入框那个展示
                tableParams: {
                    total: 2,
                    size: 10,
                    currentPage4: 1
                },
                page : 1,
                pageSize : 10,
                tableData: [
					{'sqdh':'20191016001','sqr':'张三','sqdw':'网络部','sqsj':'2019-10-16 14:45:26','sqlx':'机架申请','sqlxmc':'ODF-07-25','zyyzzt':'已成功'},
                    {'sqdh':'20191016002','sqr':'李四','sqdw':'网络部','sqsj':'2019-10-11 17:08:19','sqlx':'机架申请','sqlxmc':'DDF-03-12','zyyzzt':'已成功'},
                ],
                code:null,
                equipmentName:"",
                dateVal:null
            }
        },
        methods: {
            examineVerify () {
                this.$refs.examine.show()
            },
            findPreemptList(){
                
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.page = 1;
                this.findPreemptList();
            },
            handleCurrentChange(val){
                this.page = val;
                this.findPreemptList();
            },
            submitList(val){
                //this.code = val.code;
                //this.equipmentName = val.equipmentName;
                //this.dateVal = val.dateVal;
                //this.findPreemptList();
            },
            // 跳转申请单对应的详情界面
            tableThink (row, column, event) {
                // console.log(row);
                this.$router.push({path: '/requestMsg',query:{}});
            }
        },
        mounted:function(){
            this.findPreemptList();
        },
    }
</script>

<style scoped lang="scss">
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
    width: 100%;
    overflow: hidden;
    .principalHeader{
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
                background: rgba(29,45,85,0.5);
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
   .parinciRepreTable .el-table tr{
       background-color: transparent;
       cursor: pointer;
   }
   .parinciRepreTable .el-table th{
       background-color: #2E3A62;
   }
   .parinciRepreTable .el-table__footer-wrapper thead div, .el-table__header-wrapper thead div{
       background-color: #2E3A62;
       font-size: 14px;
       font-weight: normal;
       color: #fff;
   }
   .parinciRepreTable .el-table{
       color: #BACDE5;
       font-size: 14px;
   }
   .parinciRepreTable .el-button span{
        color: #7187F0;
    }
</style>