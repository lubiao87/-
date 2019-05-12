/*
 * 列表搜索的 mixin
 */
import Vue from 'vue'
import request from './server'
import {Message} from 'element-ui'
Vue.component(Message)
/* eslint-disable */
export const listSearch = {
  data () {
    return {
      // 加载中
      loading: false,
      // 页面的列表数据
      listData: []
    }
  },
  methods: {
    /*
     * 处理页面序号的变化
     */
    indexMethod (index) {
      if (this.page === 1 || this.page === 0) return index + 1
      return ((this.page - 1) * this.count) + index + 1
    },

    /*
     * 搜索函数
     */
    search () {
      let self = this
      self.page = 0
      let params = self.getParams()
      if (!params) return false
      self.loading = true
      self.sendReq(params, (res) => {
        self.listData = res || []
      })
    },

    /*
     * 改变页面显示的条数
     */
    handleSizeChange (count) {
      this.count = count
      this.searchForPage()
    },

    /*
     * 改变页码
     */
    handleCurrentChange (page) {
      this.page = page
      this.searchForPage()
    },

    /*
     * 获取参数，这个方法必须在组件中去覆盖，不然应该提示错误
     * 可以理解为后台的抽象函数
     */
    getParams () {
      let self = this
      Message({
        showClose: true,
        message: '请在组件的methods中定义获取参数的方法 [ getParams ]',
        type: 'error',
        duration: 1000
      })
      return false
    },

    /*
     * 发送请求
     */
    sendReq (params, callback) {
      let self = this
      request({
        method: params.method || 'POST',
        url: params.url,
        data: params.data || {},
        headers: {
          'Content-type': params.contentType || 'application/json'
        }
      }).then((res) => {
        // 如果该请求不需要干扰到loading，那么需要设置 doNotDisturbLoading 为 true
        if (res && res.data) {
          callback && callback(res.data)
        }
      }, (error) => {
        let res = error.data
        Message({
          showClose: true,
          message: res.error,
          type: 'error',
          duration: 1000
        })
      })
    },
    /**
     * 根据页码、条数 查询
     */
    searchForPage () {
      let self = this
      let params = self.getParams()
      if (!params) return false
      self.loading = true
      self.sendReq(params, (res) => {
        self.listData = res || []
      })
    }
  }
}
