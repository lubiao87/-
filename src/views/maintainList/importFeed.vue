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
                            :value="item.value">
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
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.buildId" :placeholder="buildTip">
                        <el-option
                                v-for="item in buildData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.areaId" :placeholder="areaTip">
                        <el-option
                                v-for="item in areaData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </span>
            <!-- 输入框 -->
            <el-form-item>
                <el-input v-model="formInline.sourceName" :placeholder="inputPlaceholder"></el-input>
           </el-form-item>
            <el-form-item class="buttonMar">
                <el-button @click="onSubmit" type="primary"><i class="el-icon-search"></i>查询</el-button>
            </el-form-item>
        </el-form>
        <el-row style="margin-bottom:8px;">
            <el-button @click="addModule" type="primary"><i class="el-icon-plus"></i>新增机房</el-button>
            <el-button @click="addCabinet" type="primary"><i class="el-icon-plus"></i>新增机架</el-button>
            <el-button @click="editSource" type="primary"><i class="el-icon-edit"></i>修改</el-button>
            <el-button @click="deleteSource" type="primary"><i class="el-icon-delete"></i>删除</el-button>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "importFeed",
        props: {
            foremost: {
                type: String,
                default: ''
            },
            second: {
                type: String,
                default: ''
            },
            buildTip: {
                type: String,
                default: ''
            },
            statusTip: {
                type: String,
                default: ''
            },
            areaTip: {
                type: String,
                default: ''
            },
            inputPlaceholder: {
                type: String,
                default: '请输入名称关键字'
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
                default: ''
            }
        },
        data() {
            return {
                formInline: {
                    sourceType: 1, // 第一个值
                    status: '',
                    areaId: '',
                    buildId: '',
                    sourceName: '', // 输入框的值

                }
            }
        },
        methods: {
            onSubmit() {
                this.$emit('onSubmit',this.formInline)
            },
            addModule(){
                this.$emit('addModule')
            },
            addCabinet(){
                this.$emit('addCabinet')
            },
            editSource(){
                this.$emit('editSource')
            },
            deleteSource(){
                this.$emit('deleteSource')
            }
        }
    }
</script>

<style scoped lang="scss">
.selectInput{
    width: 100%;
    border-bottom: 1px dashed rgba(186,205,229,0.23);
    .buttonMar{
        margin-left:10px;
    }
}
</style>
<style>
    .selectInput .buttonMar .el-button--primary{
        color: #fff;
        background-color: #7187F0;
        border-color: #7187F0;
    }
    .selectInput .el-input__inner{
        background-color: transparent;
        border: 1px solid rgba(186, 205, 229, 0.2);
    }
    .el-date-table td.current:not(.disabled),
    .el-date-table td.end-date, .el-date-table td.start-date{
        background-color: #7187F0 !important;
    }
    .el-date-table td.today:before{
        border-top: .5em solid #7187F0;
    }
</style>