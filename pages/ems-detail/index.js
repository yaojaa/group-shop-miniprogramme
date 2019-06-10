const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        express_company:'',
        express_code:''
    },
    checkExpress() {
        wx.showLoading()
        util.wx.get('/api/order/get_express_info', {
            express_company: this.data.express_company,
            express_code: this.data.express_code,
            order_id: 12345
        }).then(res => {
            if (res.data.code == 200) {
                this.setData({
                    showTraces: true,
                    traces: res.data.data.traces.reverse()
                })
            }
            wx.hideLoading()
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