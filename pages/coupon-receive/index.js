// pages/coupon-receive/index.js
const util = require('../../utils/util')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: true,
        reduce:'**',
        getSuccess:false
    },
    resultPopup() {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.id = options.id

        this.getCouponInfo()
        this.getCoupon()

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    getCouponInfo(){

              util.wx.get('/api/redpacket/get_redpacket_info', {
                redpacket: this.id,
        }).then(res=>{

              if(res.data.code == 200){

                this.setData({
                    reduce:res.data.data.reduce,
                    start_time:res.data.data.start_time,
                    stop_time:res.data.data.stop_time,
                    store_id: res.data.data.store_id,

                })

                }else{

                }
        })

    },
    useCoupon(){
        wx.redirectTo({
            url:'../userhome/index?id='+this.data.store_id
        })
    },

    /*分配红包*/
    getCoupon() {
        wx.showLoading({
            title: '正在领取...'
        })
        util.wx.post('/api/redpacket/alloc_redpacket', {
                redpacket_id: this.id,
                user_ids: app.globalData.userInfo.user_id
        }).then(res=>{

            wx.hideLoading()

            if(res.data.code == 200){

                this.setData({
                    getSuccess: true
                })

            }else{

                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })

            }


        })
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