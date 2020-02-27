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
        active:0,
        goodsList:[]
    },
    handleChange({ detail }) {
        this.setData({
            mainTab: detail.key
        })
    },

     getInfo(){


    util.wx.get('/api/supplier/get_supplier_detail').then(res=>{
      this.setData({
        info:res.data.data,
        supplier_logo:res.data.data.supplier_logo
      })
    })


  },

    goInfoSet(){

      wx.navigateTo({
        url:'/business/pages/supplier_set/index'
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
    getGoodsList() {
        util.wx.get('/api/supplier/get_goods_list')
            .then((res) => {
                    this.setData({
                        goodsList: res.data.data.goodslist,
                        loading: false
                    })
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


    },
    goOrder(){
          wx.navigateTo({
                url:'/business/pages/order-manage/index'
            })

    },
    goSetting(){

        wx.navigateTo({
                url:'/business/pages/setting-list/index'
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

        this.getInfo()
        //this.getDetail()
        this.getGoodsList()

        
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