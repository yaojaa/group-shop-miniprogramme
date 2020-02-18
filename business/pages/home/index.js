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
        info: '',
        active:0
    },
    handleChange({ detail }) {
        this.setData({
            mainTab: detail.key
        })
    },
    getDetail() {
        util.wx.get('/api/business/business/myBusinessDetail')
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        info: res.data.data
                    })
                }
            })
    },
    getNews() {
        util.wx.get('/api/business/news/index')
            .then((res) => {
                if (res.data.code == 0) {
                    this.setData({
                        news: res.data.data,
                        loading: false
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
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo: userInfo
        })
        //this.getDetail()
        //this.getNews()
    },
    goOrder(){
          wx.navigateTo({
                url:'/business/pages/order-manage/index'
            })

    },
    goAdd(){

         wx.navigateTo({
                url:'/business/pages/publish/publish'
            })

    },

    goActing(){
          wx.navigateTo({
                url:'/business/pages/acting-admin/index'
            })
    },
    gowithdrawal(){
          wx.navigateTo({
                url:'/business/pages/withdrawal/index'
            })
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

      this.data.active = 0

      console.log(this.data.active)

      this.setData({
        active:0
      })

      wx.hideHomeButton()

        
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