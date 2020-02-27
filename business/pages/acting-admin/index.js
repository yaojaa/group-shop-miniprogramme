const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainTab: 'homepage',
        user_info: {},
        news: [],
        loading: true,
        list: ''
    },
    handleChange({ detail }) {
        this.setData({
            mainTab: detail.key
        })
    },
    getDetail() {
        util.wx.get('/api/supplier/get_agent_list')
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        list: res.data.data
                    })
                }
            })
    },
 
    authDialog(msg) {
        Dialog.confirm({
            title: '标题',
            message: msg,
            confirmButtonText: '去认证'
        }).then(() => {
            wx.navigateTo({
                url: '../authentication/index'
            })
        }).catch(() => {
            // on cancel
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // let userInfo = wx.getStorageSync('userInfo')
        // this.setData({
        //     userInfo: userInfo
        // })
        //this.getDetail()
        //this.getNews()
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

    }
})