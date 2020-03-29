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

    //切换显示隐藏状态事件
    recommendHandle(e) {

        //  console.log(e.detail)

        // this.data.goodslist.forEach((item,index)=>{

        //      if(item.goods_id == e.detail){

        //          const key = 'goodslist['+index+'].is_recommend'

        //          this.setData({
        //              [key]: e.detail.is_recommend
        //          })
        //      }

        // })

        // this.getGoodsList()

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

    goOrders() {
        wx.redirectTo({
            url: '../new-order-list/index'
        })
    },

    goHome() {

        wx.redirectTo({
            url: '../userhome/index'
        })


    },

    managePage(e) {
        let id = e.currentTarget.dataset.id
        let delivery_method = e.currentTarget.dataset.delivery_method
        let goods_name = e.currentTarget.dataset.name.slice(0, 10)

        wx.navigateTo({
            url: '../ordermanage/list?id=' + id + '&delivery_method=' + delivery_method + '&goods_name=' + goods_name
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