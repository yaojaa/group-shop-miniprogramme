// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        share: false,
        avatar: '',
        order_id: '',
        ordersInfo: '',
        order_goods: '',
      order_time: '',
      imagePath: "",
      goods_id: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.order_id = options.order_id
        this.getOrderInfo();
        util.getShareImg(options.goods_id, this);
        this.data.goods_id = options.goods_id;
    },
    getOrderInfo() {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_detail',
            data: {
                //token: app.globalData.token,
                token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1fQ.5hiBPB_iUhTuvYhDP4n_0MZvXJGhOL0cLtG62qFpw50',
                order_id: this.data.order_id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        orders_info: res.data.data.order,
                        order_goods: res.data.data.order_goods,
                        order_time: this.timetrans(res.data.data.order.add_time)
                    })
                }
            }
        })

    },
    timetrans(date){
        var date = new Date(date*1000);//如果date为10位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        return {
          title: app.globalData.userInfo.nickname + '刚刚购买了',
          imageUrl: this.data.imagePath,
          path: '/pages/goods/goods?goods_id=' + this.data.goods_id  
        }
    }
})