const util = require('../../utils/util')


const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab:0,
        list: []
    },
    handleTab(e){
        console.log(e)
        this.setData({
            tab:e.detail.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
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
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getDataList(this.data.sortstr).then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.cpage && !this.data.loading) {
            this.setData({
                cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
            })
            if (this.data.cpage > this.data.totalpage) {
                return
            }
            this.getDataList(this.data.sortstr).then(() => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})