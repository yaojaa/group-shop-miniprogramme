const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        express_company:'',
        express_code:'',
        errorMsg:'',
    },
    checkExpress() {
        wx.showLoading()
        util.wx.get('/api/order/get_express_info', {
            express_company: this.data.express_company,
            express_code: this.data.express_code,
            order_id: this.data.order_id
        }).then(res => {
            if (res.data.status) { // 物流单号正确
                this.setData({
                    // showTraces: true,
                    traces: res.data.data.traces.reverse(),
                    errorMsg: '暂时没有物流信息，请等待物流更新'
                })
            }else{ // 物流单号错误
                this.data.express_code = "";
                this.data.express_company = "";
                this.setData({
                    // showTraces: true,
                    traces: [],
                    errorMsg: '单号有误，请检查单号重新输入'
                })

            }
            wx.hideLoading()
        }, err => {
            console.log('===err===',err)
        })
    },
    copyOrder(event) {
        wx.setClipboardData({
            data: event.currentTarget.dataset.text,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    send() {
        let _this = this;
        wx.showModal({
          content: '是否确认发货？',
          success (res) {
            if (res.confirm) {
                util.wx.post('/api/seller/set_order_status', {
                    order_id: _this.data.order_id,
                    opt: 'toset_send',
                    action_remark: _this.data.action_remark,
                    express_company: _this.data.express_company,
                    express_code: _this.data.express_code
                }).then(res => {
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '发货成功'
                        })
                        wx.navigateBack({delta: 2})
                    }
                })
            }
          }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            express_company:options.name || '',
            express_code:options.code || '',
            order_id:options.id || ''
        })
        this.checkExpress()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})