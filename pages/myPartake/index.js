const app = getApp()
const util = require('../../utils/util.js')
const { $Message } = require('../../iView/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        order_number: res.data.data.order_list.length,
                        orders: res.data.data.order_list

                    })
                }
            }
        })
    },
    getBuyList: function(token) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        order_number: res.data.data.order_list.length,
                        orders: res.data.data.order_list

                    })
                }
            }
        })
    },
    //取消订单

    cancel_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/cancel_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '订单取消成功',
                        type: 'success'
                    })
                    this.getBuyList()

                }
            }
        })
    },

    //确认收货
    confirm_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/confirm_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '确认成功'
                    })
                    this.getBuyList()

                }
            }
        })



    },
    pay({ target }) {


        let order_id = target.dataset.id;
        let goods_id = target.dataset.goods_id;

        let index = target.dataset.idx;
        let _this = this;


        //绘制配置
        wx.login({
            success: res => {
                var code = res.code;
                wx.request({
                    url: 'https://www.daohangwa.com/api/pay/pay',
                    method: "POST",
                    data: {
                        order_id: order_id,
                        code: code,
                        token: app.globalData.token,

                    },
                    success: function(res) { //后端返回的数据 
                        var data = res.data.data;
                        console.log(data);
                        console.log(data["timeStamp"]);
                        wx.requestPayment({
                            timeStamp: data['timeStamp'],
                            nonceStr: data['nonceStr'],
                            package: data['package'],
                            signType: data['signType'],
                            paySign: data['paySign'],
                            success: function(res) {
                                console.log(res)

                                wx.request({
                                    url: 'https://www.daohangwa.com/api/pay/orderpay',
                                    data: {
                                        token: app.globalData.token,
                                        order_id: order_id
                                    }

                                })

                                wx.showLoading()



                                wx.redirectTo({
                                    url: '../paySuccess/index?order_id=' + order_id + '&goods_id=' + goods_id
                                })

                            },
                            fail: function(res) {
                                console.log("fail", res)
                            }

                        });
                    }
                })
            }
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