const util = require('../../utils/util')
import secen from '../../utils/secen'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getDataList()
    },

    getDataList() {

        util.wx.get('/api/seller/get_fans_list').then(res => {
            if (res.data.code == 200) {
                console.log(res.data.data)
                if (res.data.data.page.total > 0) {
                    res.data.data.lists.forEach(e => {
                        e.updatetime = this.fTime(e.updatetime);
                    })
                    this.setData({
                        list: res.data.data.lists
                    })
                    wx.setNavigationBarTitle({
                        title: '粉丝管理' + (res.data.data.page.total)
                    })
                }
            }
        })
    },

    fTime(t) {
        let h = 0,
            m = 0,
            mm = 0;
        if (t && t > 0) {
            t = Math.ceil(t / 1000);
            h = parseInt(t / 60 / 60);
            m = parseInt(t % 3600 / 60);
            mm = parseInt(t % 60);
        }
        if (h > 0) {
            return h + "小时" + m + "分" + mm + "秒"
        } else if (m > 0) {
            return m + "分" + mm + "秒"
        } else {
            return mm > 0 ? mm + "秒" : "1秒"
        }

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
    // 下拉刷新
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getDataList()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.getDataList(++this.data.pullDownOpt.cpage);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})