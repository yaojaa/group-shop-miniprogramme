const app = getApp()
const util = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        goodslist: [],
        goods_id: "",
        order_id: "",
        link_url: "",
        is_loading: true,
        scrollTop: 0,
        store_money: "",
        pending_money: '***',
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        active:3
    },

    getInfo(){
         util.wx.get('/api/supplier/get_supplier_detail').then(res=>{
      this.setData({
        info:res.data.data,
        supplier_logo:res.data.data.supplier_logo
      })
      this.setData({
        is_loading:false
      })
       })
    },

    toWithdrawal(e) {
        wx.navigateTo({
            url: '../withdrawal/index'
        })
    },

     goSetPrice(){
    wx.navigateTo({
        url:'/business/pages/set-price/index'
    })

  },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {


        if (typeof app.globalData.userInfo == 'undefined' || app.globalData.userInfo == null) {
            app.redirectToLogin()

            return
        } else {


            this.setData({
                nickname : app.globalData.userInfo.nickname
            })


            this.getInfo()

           
        }

    },

    goCreate() {
        wx.redirectTo({
            url: '../create_shop/index'
        })
    },


 
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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