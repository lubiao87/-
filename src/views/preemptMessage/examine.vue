<template>
    <div class="examineDiaLog">
        <el-dialog title="资源审核" :visible.sync="dialogTableVisible">
           <div class="examineNews">
               <ul class="examineUl">
                   <li class="examineLi">
                       <label class="lable">申请设备名称</label>
                       <span class="text">XXXX设备名称</span>
                   </li>
                   <li class="examineLi">
                       <label class="lable">机房名称</label>
                       <span class="text">XXXX设备名称</span>
                   </li>
               </ul>
               <ul class="examineUl">
               <li class="examineLi">
                   <label class="lable">机柜名称</label>
                   <span class="text">XXXX设备名称</span>
               </li>
               <li class="examineLi">
                   <label class="lable">电流类型</label>
                   <span class="text">交流</span>
               </li>
           </ul>
           </div>
            <!-- 审核过程 -->
            <div class="examineEchart">
                <div class="examE"><span class="line"></span><span>对比信息</span></div>
                <!-- 对比信息状况 -->
                <div class="examineBalance">
                    <div class="passStatus Pass">
                        <p class="passText">U位申请审核结果：<span>不通过</span></p>
                        <div style="margin-top: 24px">
                            <echarts-Bar :EchartsId="NopassEcharts" :formatterText="formatterNumberNo"></echarts-Bar>
                        </div>
                    </div>
                    <div class="passStatus Pass">
                    <p class="passText nowPass">功率申请审核结果：<span>通过</span></p>
                        <div style="margin-top: 24px">
                            <echarts-Bar :EchartsId="passEcharts" :formatterText="formatterNumber"></echarts-Bar>
                        </div>
                    </div>
                    <div class="passStatus noPass">
                    <div class="passParent">
                    <div class="passText">
                        规划审核结果：
                        <el-select v-model="value" placeholder="请选择" style="width: 100px">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                        <div class="sark">
                            <div class="sarkMsg">
                                <div class="left"><img :src="cabinetIcon" alt=""></div>
                                <div class="right">
                                    <h2 class="rightH">机柜</h2>
                                    <p class="rightP">申请机柜专业</p>
                                </div>
                            </div>
                            <div class="sarkMsg">
                            <div class="left"><img :src="conditionerIco" alt=""></div>
                            <div class="right">
                                <h2 class="rightH">空调</h2>
                                <p class="rightP">剩余机柜专业</p>
                            </div>
                            </div>
                        </div>
                    </div>
                     </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消申请</el-button>
                    <el-button @click="dialogTableVisible = false">关闭</el-button>
                    <el-button type="primary" @click="dialogTableVisible = false">提交OA审核</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import imageSrc from '../../assets/common/images'
    import echartsBar from './echartsBar'
    export default {
        name: "examine",
        components: {echartsBar},
        data () {
            return {
                dialogTableVisible: false,
                cabinetIcon: imageSrc.cabinetIcon,
                conditionerIco: imageSrc.conditionerIco,
                passEcharts: 'passEcharts', // 传送通过ID
                NopassEcharts: 'NopassEcharts', // 传送不通过Id值
                formatterNumberNo: 1, // 判断不通过数据展示格式
                formatterNumber: 2, // 判断通过数据展示格式
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }],
                value: ''
            }
        },
        methods:{
            show () {
                this.dialogTableVisible = true
            }
        }
    }
</script>

<style>
.examineDiaLog .examineNews{
    margin-bottom:30px;
}
.examineDiaLog .el-dialog{
    background: #16284A;
}
.examineDiaLog .el-dialog__title{
   color: #fff;
    font-size: 16px;
}
.examineDiaLog .examineUl {
    height: 56px;
    line-height:56px;
    padding:0 26px;
    box-sizing: border-box;
    border-bottom: 1px dashed rgba(186,205,229,0.23);;
    zoom:1;
}
.examineDiaLog .examineUl::after{
    content: '';
    height:0;
    display: block;
    clear: both;
}
 .examineDiaLog .examineLi {
     float:left;
     width:50%;
 }
 .examineDiaLog .lable{
        font-size:14px;
        color: #BACDE5;
        text-align: left;
        margin-right:25px;
        min-height:56px;
         width: 84px;
         display: inline-block;
    }
 .examineDiaLog .text {
        font-size:14px;
        color: #fff;
        text-align: left;
        margin-right:47px;
        min-height:56px;
    }
  .examineDiaLog .examineEchart .examE{
        font-size:14px;
        color: #fff;
        display: flex;
        flex-direction: row;
    }
.examineDiaLog .examE .line{
        width: 6px;
        height: 20px;
        background: #7187F0;
        margin-right: 14px;
    }
 .examineDiaLog .examineBalance{
        margin-top: 10px;
        display:flex;
        flex-direction: row;
    }
 .examineDiaLog .passStatus {
        width: 33%;
    }
 .examineDiaLog .passText{
        font-size: 14px;
        color: #fff;
        text-align: center;
        height: 36px;
        line-height: 36px;
    }
 .examineDiaLog .passText span {
        color: #F83535;
        font-size: 14px;
    }
 .examineDiaLog .nowPass span {
        color: #3BC66D;
    }
 .examineDiaLog .sark{
        margin-top:24px;
    }
.examineDiaLog  .sarkMsg{
        display: flex;
        flex-direction: row;
        margin-bottom: 28px;
    }
.examineDiaLog .sark .left{
        width:46px;
        height: 46px;
        margin-right: 16px;
    }
.examineDiaLog .sark .left img{
         width:100%;
         height: 100%;
     }
.examineDiaLog .right .rightH {
        font-size: 18px;
        color: #BACDE5;
        margin-bottom: 7px;
        line-height: inherit;
    }
.examineDiaLog .right .rightP {
        color:rgba(186,205,229,0.5);
        font-size: 14px;
    }
    .examineDiaLog .dialog-footer{
        text-align: right;
    }
     .examineDiaLog .el-button{
         font-size:14px;
         font-family:MicrosoftYaHei;
         font-weight:400;
         border:1px solid rgba(186,205,229,.1);
         color:rgba(186,205,229,1);
         background:rgba(22,40,74,1);
         border-radius:4px;
     }
     .examineDiaLog .el-button--primary{
         background: #7187F0;
         color: #fff;
     }
     .examineDiaLog .el-input__inner{
         background-color: transparent;
         border:1px solid rgba(186, 205, 229, 0.2);
     }
     .noPass {
         display: flex;
     }
    .passParent{
        display: inline-block;
        margin:0 auto;
    }
</style>