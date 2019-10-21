<template>
    <div class="parinciPaging">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize"
                layout="sizes, total, prev, pager, next"
                :total="paginaTotal">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "paging",
        props: {
            // 分页数据总条数
            paginaTotal: {
                type: Number,
                default: null
            },
        //    分页每页大小
            pageSize: {
                type: Number,
                default: null
            },
        //    当前页
            currentPage4: {
                type: Number,
                default: null
            }
        },
        methods: {
            handleSizeChange(val) {
                this.$emit('handleSizeChange', val)
            },
            handleCurrentChange(val) {
                this.$emit('handleCurrentChange', val)
            }
        },
    }
</script>

<style>
    /* 分页样式 */
    .parinciPaging .el-pagination{
        font-size: 14px;
        color: #BACDE5;
    }
    .parinciPaging .el-pager li.active{
        background-color: #7187F0;
    }
    .parinciPaging .el-pagination button.disabled,
    .parinciPaging .el-pagination .btn-next{
        background-color: transparent;
        border: none;
        color: #BACDE5;
    }
    .parinciPaging .el-pagination .btn-prev,.parinciPaging .el-pager li{
        background-color: transparent;
        border-color: rgba(186,205,229,0.1);
        color: #BACDE5;
    }
    .parinciPaging .el-pagination .el-pagination__total,.el-pagination .el-pagination__sizes{
        float:left;
    }
    .parinciPaging .el-pagination{
        text-align: right;
    }
</style>