<template>
    <div class="principal">
        <div class="principalHeader"></div>
        <div class="principalContent">
            <!-- 指示栏 -->
            <Status-Bar :barName="barNames" :barImg="nabarCation"></Status-Bar>
            <!-- 中间模块 -->
            <div class="parinciRepresent">
                <div class="parinci">
                    <!-- form表单组件插入 -->
                    <import-Feed
                            :foremost="applicationStatus"
                            :foremostData="foremostDataVal"
                            :buildData="buildSelectList"
                            :buildTip="buildTip"
                            :areaData="areaSelectList"
                            :areaTip="areaTip"
                            :statusData="statusSelectList"
                            :statusTip="statusTip"
                            :second="CampOn"
                            :secondData="secondDataVal"
                            :IsZoomed="currentStatus"
                            @onSubmit = "submitList"
                            @addModule = "addModule"
                            @addCabinet = "addCabinet"
                            @editSource = "editSource"
                            @deleteSource = "deleteSource">
                    </import-Feed>
                    <!-- 申请信息table数据 -->
                    <div class="parinciRepreTable">
                        <el-table :data="tableData" style="width: 100%"  @selection-change="changeFun">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="planStatus" label="规划状态" :key="18" :formatter ="moduleFormatter"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="name" label="机房名称" :key="1"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="moduleRoomName" label="所在房间号" :key="2"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="dCPower" label="所在楼层"  :key="4"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="aCPower" label="所属机楼" :key="5"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="row" label="所属区域" :key="6"></el-table-column>
                            <!-- <el-table-column v-if="sourceType == 1" prop="column" label="列号" :key="7"></el-table-column> -->
                            <el-table-column v-if="sourceType == 1" prop="area" label="机房总面积（m²）" :key="3"></el-table-column>
                            <el-table-column v-if="sourceType == 1" prop="totalMachineCount" label="可放机架数" :key="8"></el-table-column>
                            
                            
                            
                            <el-table-column v-if="sourceType == 2" prop="name" label="机架名称" :key="9"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="moduleName" label="所属机房" :key="10"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="buildName" label="所属机楼" :key="20"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="area" label="所属区域" :key="21"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="major" label="机架类型" :key="11"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="remainStandCabient" label="剩余可放标准机柜数" :key="22"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="totalStandCabient" label="可放标准机柜总数" :key="23"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="longth" label="机架长度（m）"  :key="19"></el-table-column> <!-- :formatter ="specFormatter" -->
                            <el-table-column v-if="sourceType == 2" prop="height" label="机架高度（m）"  :key="17"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="width" label="机架宽度（m）"  :key="18"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="totalUnitCount" label="机架总U位" :key="15"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="unuseUnitCount" label="机架可用u位" :key="24"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="power" label="额定功率（kW）" :formatter ="powerFormatter" :key="14"></el-table-column>
                            <el-table-column v-if="sourceType == 2" prop="usePower" label="使用功率（kW）" :formatter ="powerFormatter" :key="13"></el-table-column>
                            <!-- <el-table-column v-if="sourceType == 2" prop="cabinetStatus" label="状态" :formatter="cabinetStatusFormatter" :key="16"></el-table-column> -->
                        </el-table>
                    </div>
                    <!-- 分页 -->
                    <paging :paginaTotal="tableParams.total"
                            :pageSize="tableParams.size"
                            :currentPage4="tableParams.currentPage4"
                            @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange">
                    </paging>
                </div>
            </div>
        </div>
        <moduleBar ref="moduleBar"
                    :moduleHandleType="moduleHandleType"
                    @moduleUpdate="moduleUpdate">
        </moduleBar>
        <cabinetBar ref="cabinetBar"
                    :cabinetHandleType="cabinetHandleType"
                    @cabinetUpdate="cabinetUpdate">
        </cabinetBar>
    </div>
</template>

<script>
    import StatusBar from './statusBar' // 模块指示栏组件
    import imagesSrc from '../../assets/common/images' // 图片管理文件
    import importFeed from './importFeed' // form表单组件注册
    import paging from './paging' // 分页
    import qs from 'qs'
    import {listSearchMixin} from '../../mixin' //请求
    import {api} from '../../api/api' //请求
    import moduleBar from './moduleBar'//微模块修改添加
    import cabinetBar from './cabinetBar' //机架修改添加
    export default {
        name: "resourcePlanList",
        components: { StatusBar, importFeed, paging, moduleBar, cabinetBar},
        mixins: [listSearchMixin],
        mounted:function(){
            
        },
        beforeRouteEnter:function(to, from, next){
            next(vm => {
                vm.init();
            });
        },
        data () {
            return {
                barNames: '资源规划列表', // 指示栏名称
                nabarCation: imagesSrc.nabarCation, // 图片
                applicationStatus: '请选择资源类型',
                CampOn: '请输入所属区域',
                currentStatus: 2, // 根据当前判断时间选择器或者输入框那个展示
                sourceType:1, //资源类型（1：微机楼，2：机柜）
                cabinetHandleType:1, //机柜弹出框操作类型（1：添加，2修改）
                moduleHandleType:1,//微模块弹出框操作类型（1：添加，2修改）
                county_id : null,
                sourceName : null,
                page : 1,
                pageSize : 10,
                multipleSelection: [], //选择行
                foremostDataVal:
                [{
                    value: 1,
                    label: '机房'
                },{
                    value: 2,
                    label: '机架'
                }], // 资源类型
                buildSelectList: [
                  { label: "", value : ""},
                  { label: "青云机楼", value : 1},
                  { label: "工业园机楼", value : 2},
                  { label: "跑马场机楼", value : 3}
                ],
                buildTip: '请选择所属机楼',
                areaSelectList: [
                  { label: "", value : ""},
                  { label: "天河区", value : 1},
                  { label: "荔湾区", value : 2},
                  { label: "白云区", value : 3}
                ],
                areaTip: '请选择所属区域',
                statusSelectList: [
                  { label: "", value : ""},
                  { label: "规划中", value : 0},
                  { label: "已规划", value : 2}
                ],
                statusTip: '请选择机房状态',
                secondDataVal: [], // 区域列表
                tableParams: {
                    total: 0,
                    size: 10,
                    currentPage4: 1
                },
                tableData: []
            }
        },
        methods: {
            init(){
                // this.getOrganList();
                this.findResourceList();
            },
            examineVerify () {
                
            },
            changeFun(val){
                console.log(val);
                this.multipleSelection = val
            },
            // buildingUpdate (row) {
            //     this.$refs.buildingUpdateBar.show(row);
            // },
            // machineModuleRoomUpdate(row){
            //     this.$refs.machineModuleRoomUpdateBar.show(row);
            // },
            moduleUpdateBar(row){
                this.$refs.moduleBar.show(row);
            },
            cabinetUpdateBar(row){
                this.$refs.cabinetBar.show(row);
            },
            findResourceList(){
                let _this = this;
                var paramData = {};
                if(_this.sourceName !=null && _this.sourceName != ''){
                    paramData['sourceName'] = _this.sourceName
                }
                if(_this.sourceType !=null && _this.sourceType != ''){
                    paramData['sourceType'] = _this.sourceType
                }
                paramData['page'] = _this.page;
                paramData['pageSize'] = _this.pageSize;
                let param = {
                    url: api.resourcePlaningList,
                    data: paramData
                }
                // 模拟数据
                let res = {}
                if (_this.sourceType === 1) {
                    res = {
                        "respBody": {
                            "total": 4,
                            "rows": [
                                {
                                    "aCPower": "青云机楼",
                                    "area": 300,
                                    "code": "001DC",
                                    "column": "10",
                                    "dCPower": "一楼",
                                    "height": 2,
                                    "longth": 15,
                                    "moduleId": 1,
                                    "moduleRoomName": "001",
                                    "name": "一楼001机房",
                                    "planStatus": 2,
                                    "roomId": 3,
                                    "row": "天河区",
                                    "totalMachineCount": 200,
                                    "width": 20,
                                    "vitalLevel": "A",
                                    "auditAuthority": 1
                                },
                                {
                                    "aCPower": "青云机楼",
                                    "area": 400,
                                    "code": "002DC",
                                    "column": "1",
                                    "dCPower": "二楼",
                                    "height": 5,
                                    "longth": 20,
                                    "moduleId": 2,
                                    "moduleRoomName": "002",
                                    "name": "二楼002机房",
                                    "planStatus": 0,
                                    "roomId": 1,
                                    "row": "荔湾区",
                                    "totalMachineCount": 100,
                                    "width": 20,
                                    "vitalLevel": "B",
                                    "auditAuthority": 2
                                },
                                {
                                    "aCPower": "跑马场机楼",
                                    "area": 150,
                                    "code": "003DC",
                                    "column": "1",
                                    "dCPower": "三楼",
                                    "height": 6,
                                    "longth": 15,
                                    "moduleId": 3,
                                    "moduleRoomName": "003",
                                    "name": "三楼003机房",
                                    "planStatus": 2,
                                    "roomId": 1,
                                    "row": "荔湾区",
                                    "totalMachineCount": 300,
                                    "width": 10,
                                    "vitalLevel": "C",
                                    "auditAuthority": 1
                                },
                                {
                                    "aCPower": "跑马场机楼",
                                    "area": 250,
                                    "code": "004DC",
                                    "column": "1",
                                    "dCPower": "四楼",
                                    "height": 6,
                                    "longth": 25,
                                    "moduleId": 4,
                                    "moduleRoomName": "004",
                                    "name": "四楼004机房",
                                    "planStatus": 0,
                                    "roomId": 1,
                                    "row": "白云区",
                                    "totalMachineCount": 300,
                                    "width": 10,
                                    "vitalLevel": "A",
                                    "auditAuthority": 2
                                }
                            ]
                        },
                        "respHeader": {
                            "resultCode": 0,
                            "message": "正确执行"
                        }
                    }
                }

                if (_this.sourceType === 2) {
                    res = {
                        "respBody": {
                            "total": 4,
                            "rows": [
                                {
                                    "cabinetId": 1,
                                    "cabinetStatus": 2,
                                    "cabinetType": 1,
                                    "code": "jc-1",
                                    "column": "B",
                                    "currentType": 2,
                                    "height": 1,
                                    "longth": 2,
                                    "major": "DDF机架",
                                    "remainStandCabient": "2",
                                    "totalStandCabient": "100",
                                    "moduleId": 9,
                                    "moduleName": "一楼001机房",
                                    "buildName": "青云机楼",
                                    "area": "天河区",
                                    "name": "DDF03-12",
                                    "power": 100,
                                    "usePower": 40,
                                    "row": "2",
                                    "totalUnitCount": 30,
                                    "unuseUnitCount": 20,
                                    "width": 2,
                                    "rectifier": 1,
                                    "quitEquip": 3,
                                    "quitEquipUnit": 5,
                                    "vitalLevel": "A",
                                    "auditAuthority": 1
                                },
                                {
                                    "cabinetId": 2,
                                    "cabinetStatus": 2,
                                    "cabinetType": 1,
                                    "code": "jc-1",
                                    "column": "B",
                                    "currentType": 2,
                                    "height": 2,
                                    "longth": 3,
                                    "major": "ODF机架",
                                    "remainStandCabient": "34",
                                    "totalStandCabient": "39",
                                    "moduleId": 9,
                                    "moduleName": "二楼002机房",
                                    "buildName": "跑马场机楼",
                                    "area": "荔湾区",
                                    "name": "ODF03-18",
                                    "power": 200,
                                    "usePower": 50,
                                    "row": "2",
                                    "totalUnitCount": 42,
                                    "unuseUnitCount": 22,
                                    "width": 2,
                                    "rectifier": 2,
                                    "quitEquip": 4,
                                    "quitEquipUnit": 7,
                                    "vitalLevel": "B",
                                    "auditAuthority": 2
                                },
                                {
                                    "cabinetId": 3,
                                    "cabinetStatus": 2,
                                    "cabinetType": 1,
                                    "code": "jc-1",
                                    "column": "B",
                                    "currentType": 2,
                                    "height": 1,
                                    "longth": 2,
                                    "major": "ODF机架",
                                    "remainStandCabient": "20",
                                    "totalStandCabient": "100",
                                    "moduleId": 9,
                                    "moduleName": "五楼005机房",
                                    "buildName": "工业园机楼",
                                    "area": "荔湾区",
                                    "name": "ODF08-18",
                                    "power": 200,
                                    "usePower": 30,
                                    "row": "2",
                                    "totalUnitCount": 34,
                                    "unuseUnitCount": 30,
                                    "width": 4,
                                    "rectifier": 3,
                                    "quitEquip": 4,
                                    "quitEquipUnit": 6,
                                    "vitalLevel": "C",
                                    "auditAuthority": 1
                                },
                                {
                                    "cabinetId": 4,
                                    "cabinetStatus": 2,
                                    "cabinetType": 1,
                                    "code": "jc-1",
                                    "column": "B",
                                    "currentType": 2,
                                    "height": 2,
                                    "longth": 2,
                                    "major": "ODF机架",
                                    "remainStandCabient": "20",
                                    "totalStandCabient": "100",
                                    "moduleId": 9,
                                    "moduleName": "三楼003机房",
                                    "buildName": "跑马场机楼",
                                    "area": "白云区",
                                    "name": "ODF09-18",
                                    "power": 290,
                                    "usePower": 80,
                                    "row": "2",
                                    "totalUnitCount": 30,
                                    "unuseUnitCount": 18,
                                    "width": 3,
                                    "rectifier": 5,
                                    "quitEquip": 6,
                                    "quitEquipUnit": 8,
                                    "vitalLevel": "A",
                                    "auditAuthority": 2
                                }
                            ]
                        },
                        "respHeader": {
                            "resultCode": 0,
                            "message": "正确执行"
                        }
                    }
                }
                if(res.respHeader.resultCode == 0){
                    _this.tableData = res.respBody.rows;
                    _this.tableParams.total = res.respBody.total;
                }else{
                    this.$message.error(res.respHeader.message);
                }
                // 请求后台接口
                /* _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        _this.tableData = res.respBody.rows;
                        _this.tableParams.total = res.respBody.total;
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                }) */
            },
            submitList(formInline){
                let _this = this;
                _this.countyId = formInline.county_id;
                _this.sourceType = formInline.sourceType;
                _this.sourceName = formInline.sourceName;
                _this.findResourceList();
            },
            getOrganList(){
                let _this = this;
                let param = {
                    url: api.getOrganListNoYingFu
                }
                _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        _this.secondDataVal = res.respBody.data;
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                })
            },
            tableRow (row, event, column) {
                //跳转详情页面
                let _this = this;
                let param = {};
                param['sourceType'] = _this.sourceType;
                if(_this.sourceType == 1){
                    param['sourceId'] = row['buildingId'];
                }else if(_this.sourceType == 2){
                    param['sourceId'] = row['moduleRoomId'];
                }else if(_this.sourceType == 3){
                    param['sourceId'] = row['moduleId'];
                }
                _this.pushPage('/micromoduleDetal',param);
                // this.$refs.examine.show()
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
            },
            powerFormatter(row, column, cellValue, index){
                return cellValue+' Kw';
            },
            specFormatter(row, column, cellValue, index){
                return cellValue+' m';
            },
            currentFormatter(row, column, cellValue, index){
                if(cellValue == 1){
                    return '直流';
                }else if(cellValue == 2){
                    return '交流';
                }else{
                    return '暂无数据';
                }
            },
            cabinetStatusFormatter(row, column, cellValue, index){
                if(cellValue == 0){
                    return '规划中';
                }else if(cellValue == 1){
                    return '已预占';
                }else if(cellValue == 2){
                    return '已规划';
                }else{
                    return '暂无数据';
                }
            },
            pushPage (url, param) {
                this.$router.push({path: url, query: param})
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.page = 1;
                this.findResourceList();
            },
            handleCurrentChange(val){
                this.page = val;
                this.findResourceList();
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
            moduleUpdate(val){
                let _this = this;
                let param = {
                    url: api.moduleUpdate,
                    data: val
                }
                _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        this.$message({type: 'success',message: '修改成功'});
                        _this.findResourceList();
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                })
            },
            cabinetUpdate(val){
                let _this = this;
                let param = {
                    url: api.cabinetUpdate,
                    data: val
                }
                _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        this.$message({type: 'success',message: '修改成功'});
                        _this.findResourceList();
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                })
            },
            addModule(){
                this.moduleHandleType = 1;
                this.moduleUpdateBar(null);
            },
            addCabinet(){
                this.cabinetHandleType = 1;
                this.cabinetUpdateBar(null);
            },
            editSource(){ 
                //修改资源
                if(this.multipleSelection.length < 1){
                    this.$message.error("请勾选需要修改的资源");
                    return;
                }else if(this.multipleSelection.length > 1){
                    this.$message.error("一次只能修改一条资源");
                    return;
                }
                if(this.sourceType == 1){
                    this.moduleHandleType = 2;
                    this.moduleUpdateBar(this.multipleSelection[0])
                }else{
                    this.cabinetHandleType = 2;
                    this.cabinetUpdateBar(this.multipleSelection[0]);
                }
            },
            deleteSource(){
                let _this = this;
                if(_this.multipleSelection.length < 1){
                    _this.$message.error("请勾选需要修改的资源");
                    return;
                }
                this.$confirm(this.sourceType == 1 ? "确定删除所选机房及所属机架和设备？" : "确定删除所选机架及所属设备？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    if(_this.sourceType == 1){
                        let moduleIds = _this.getModuleSelectIdStr();
                        _this.deleteModules(moduleIds);
                    }else{
                        let cabinetIds = _this.getCabinetSelectIdStr();
                        _this.deleteCabinets(cabinetIds);
                    }
                }).catch(() => {
                         
                });
            },
            getModuleSelectIdStr(){
                //获取选择模块的id拼接字符串 1,2,3,
                let ids = '';
                this.multipleSelection.forEach(function (val, i){
                    ids += val['moduleId'] + ",";
                });
                return ids;
            },
            getCabinetSelectIdStr(){
                //获取选择机架的id拼接字符串 1,2,3,
                let ids = '';
                this.multipleSelection.forEach(function (val, i){
                    ids += val['cabinetId'] + ",";
                });
                return ids;
            },
            deleteModules(ids){
                //删除勾选微模块
                let _this = this;
                let paramData = {};
                paramData['moduleIds'] = ids;
                let param = {
                    url: api.moduleDelete,
                    data: qs.stringify(paramData),
                    contentType : 'application/x-www-form-urlencoded'
                }
                _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        this.$message({type: 'success',message: '删除成功'});
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                    _this.findResourceList();
                })
            },
            deleteCabinets(ids){
                //删除勾选机柜
                let _this = this;
                let paramData = {};
                paramData['cabinetIds'] = ids;
                let param = {
                    url: api.cabinetDelete,
                    data: qs.stringify(paramData),
                    contentType : 'application/x-www-form-urlencoded'
                }
                _this.sendReq(param, (res) => {
                    if(res.respHeader.resultCode == 0){
                        this.$message({type: 'success',message: '删除成功'});
                    }else{
                        this.$message.error(res.respHeader.message);
                    }
                    _this.findResourceList();
                })
            }
        },
        watch: {
            
        }
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