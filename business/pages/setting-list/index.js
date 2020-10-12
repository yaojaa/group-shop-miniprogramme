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
        CustomBar: app.globalData.CustomBar    
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

            wx.hideHomeButton();





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

    goGroup() {

        if(app.globalData.userInfo.store){

        wx.switchTab({
            url: '/pages/home/index'
        })


        }else{

         wx.redirectTo({
            url: '/pages/create-home/index'
        })
        }

    },


 
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    onShow:function(){
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



    },
   onShareAppMessage: function(e) {
        console.log(e)
        if (app.globalData.userInfo) {
            var _uid = app.globalData.userInfo.user_id
        }

        return {
            title: app.globalData.userInfo.nickname + '推荐您一个代理接单小助手',
            imageUrl: 'https://static.kaixinmatuan.cn/static/share-cover.jpg',
            path: 'business/pages/create-home/index' + '?from_id=' + _uid
        }
    },

})