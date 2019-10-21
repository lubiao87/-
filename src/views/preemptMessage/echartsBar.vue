<template>
    <div :id="EchartsId" style="width: 50%;height: 142px;margin:0 auto;"></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "echartsBar",
        props: {
            EchartsId: {
                type: String,
                default: ''
            },
            formatterText: {
                type: Number,
                default: null
            }
        },
        data () {
            return {
                myChartBar: null
            }
        },
        methods: {
            getPassEcharts() {
                // 绘制图表
                    this.myNoPassChartBar = echarts.dispose(document.getElementById(this.EchartsId));
                    this.myNoPassChartBar = echarts.init(document.getElementById(this.EchartsId));
                    let $_this = this
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '10%',
                            right: '10%',
                            top: 24,
                            bottom: 10,
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: ['20%', '20%'],
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'rgba(186,205,229,0.4)'
                                }
                            },
                            data: ['Mon']
                        },
                        yAxis: {
                            show: false,
                            type: 'value'
                        },
                        series: [{
                            data: [20],
                            type: 'bar',
                            barWidth: 25,
                            barGap: '30%',
                            barCategoryGap: '20%',
                            itemStyle: {
                                normal: {
                                    color: '#7187F0',
                                    barBorderRadius: 3
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    color: 'rgba(186,205,229,0.6)',
                                    formatter(params){
                                        if ($_this.formatterText === 1) {
                                            return '申请' + params.data
                                        } else {
                                            return params.data + 'kw'
                                        }
                                    }
                                }
                            },
                        }, {
                            data: [12],
                            type: 'bar',
                            barWidth: 25,
                            itemStyle: {
                                normal: {
                                    color: '#6A40D4',
                                    barBorderRadius: 3
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    color: 'rgba(186,205,229,0.6)',
                                    formatter(params){
                                        if ($_this.formatterText === 1) {
                                            return '申请' + params.data
                                        } else {
                                            return params.data + 'kw'
                                        }
                                    }
                                }
                            },
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    $_this.myNoPassChartBar.setOption(option)
            }
        },
        mounted () {
            this.getPassEcharts()
        }
    }
</script>