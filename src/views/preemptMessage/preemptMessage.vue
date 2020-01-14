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
                            inputPlaceholder = '请按申请人、申请部门查询'
							fristPlaceholder="请选择申请类型"
							:fristStatusList="fristStatusList"
							secondPlaceholder="请选择申请状态"
							:secondStatusList="secondStatusList"
                            @onSubmit = "submitList">
                    </import-Feed>
                    <!-- 申请信息table数据 -->
                    <div class="parinciRepreTable">
                        <el-table :data="tableData" style="width: 100%" height="550" >
                            <el-table-column prop="code" label="申请单号" width="180" align="center"></el-table-column>
                            <el-table-column prop="applyUser" label="申请人" align="center" ></el-table-column>
                            <el-table-column prop="applyPart" label="申请部门" align="center" ></el-table-column>
                            <el-table-column prop="applyDate" label="申请时间" width="180" align="center"></el-table-column>
                            <el-table-column prop="type" label="申请类型" width="180" align="center"></el-table-column>
                            <el-table-column prop="applyStatus" label="申请状态" width="180" align="center"></el-table-column>                            
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
	import qs from 'qs'
    import StatusBar from './statusBar' // 模块指示栏组件
    import imagesSrc from '../../assets/common/images' // 图片管理文件
    import importFeed from './importFeed' // form表单组件注册
    import paging from './paging' // 分页
    import examine from './examine' // 资源审核
    import {listSearchMixin} from '../../mixin' //请求
    import {api, api3} from '../../api/api' //请求
    export default {
        name: "preemptMessage",
        components: { StatusBar, importFeed, paging, examine },
        mixins: [listSearchMixin],
        data () {
            return {
                barNames: '预占设备信息', // 指示栏名称
                nabarCation: imagesSrc.nabarCation, // 图片
                applicationStatus: '请选择申请状态',
                CampOn: '请选择预占结果',
                currentStatus: 1, // 根据当前判断时间选择器或者输入框那个展示
                tableParams: {
                    total: 0,
                    size: 10,
                    currentPage4: 1
                },
				fristStatusList: [
				  { value: 1, label: "设备申请"},
				  {value: 2, label: "机架申请"},
				  
				],
				secondStatusList: [
				  { value: 1, label: "待审核"},
				  {value: 2, label: "已审核"},
				  {value: 2, label: "已取消"},
				  {value: 2, label: "OA审核中"},
				  
				],
                page : 1,
                pageSize : 10,
                tableData: [],
                code:null,
                equipmentName:"",
				searchName: '',
				type: '',
				applyStatus: '',
                initialTime:"",
				startTime: '',
				endTime: '',
                dateVal:null
            }
        },
        beforeRouteEnter: function(to, from, next) {
          next(vm => {
            vm.init();
          });
        },
		methods: {
			init () {
			    var that = this
				that.findPreemptList();
			},
            examineVerify () {
                this.$refs.examine.show()
            },
            findPreemptList(){
			  var that = this
              let param = {
                url: api3.getApplyListByParamPage,
                method: 'POST',
                contentType : 'application/x-www-form-urlencoded',
                data: qs.stringify({
					'page': that.page,
					'pageSize': that.pageSize,
					'name': that.searchName,
					'type': that.type,
					'applyStatus': that.applyStatus,
					'startTime': that.startTime,
					'endTime': that.endTime,
				})
              }
              that.sendReq( param, (res) => {
              	console.log(res)
              	if (res.respHeader.resultCode == 0) {
					res.respBody.data.list.forEach((val) => {
						
						if (val.applyStatus == 1) {
							val.applyStatus = '待审核'
						} else if (val.applyStatus == 1) {
							val.type = '已审核'
						} else if (val.applyStatus == 1) {
							val.type = '已取消'
						} else if (val.applyStatus == 1) {
							val.type = 'OA审核中'
						}
						if (val.type == 1) {
							val.type = '设备申请'
						} else {
							val.type = '机架申请'
						}
						let data = new Date(val.applyDate)
						val.applyDate = data.getFullYear() + '/' + that.p(data.getMonth() + 1) + '/' + that.p(data.getDate()) 
						                 + ' ' + that.p(data.getHours()) + ':' + that.p(data.getMinutes()) + ':' + that.p(data.getSeconds())
					})
				  that.tableData = res.respBody.data.list
				  that.tableParams.total = res.respBody.data.totals;
              	} else {
              	  that.$message.error(res.respHeader.message);
              	}
              })  
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
				var that = this
                that.searchName = val.name;
                that.type = val.fristStatus;
                that.applyStatus = val.secondStatus;
				console.log(val)
				if (val.initialTime != null && val.initialTime != ''){
				  var d1 = new Date(val.initialTime[0])
				  var d2 = new Date(val.initialTime[1])
				  that.startTime = d1.getFullYear() + '-' + that.p(d1.getMonth() + 1) + '-' + that.p(d1.getDate())
				  that.endTime = d2.getFullYear() + '-' + that.p(d2.getMonth() + 1) + '-' + that.p(d2.getDate())
				}
                that.findPreemptList();
            },
			
			p(s) {
			  return s < 10 ? '0' + s : s
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