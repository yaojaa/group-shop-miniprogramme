const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'
const app = getApp()
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

      //将自己的供应商信息记录到全局

      app.globalData.userInfo.identity = res.data.data;

      console.log(app.globalData.userInfo)



    },res=>{
              if(res.data.code == -1){

                wx.redirectTo({
                  url:'/business/pages/create-home/index'
                })

              }
            })


  },

    goInfoSet(){

      wx.navigateTo({
        url:'/business/pages/supplier_set/index'
      })


    },

    getGoodsList() {
        util.wx.get('/api/supplier/get_goods_list')
            .then((res) => {
                    this.setData({
                        goodsList: res.data.data.goodslist,
                        loading: false
                    })
            wx.hideLoading()

            },res=>{
              if(res.data.code == -1){

                wx.redirectTo({
                  url:'/business/pages/create-home/index'
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
      wx.showLoading()
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