import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        code: false,
        order_info: '',
        btn_load: false
    },
    handleCancelOrder(event) {
        let { status } = event.currentTarget.dataset
        Dialog.confirm({
            message: status == 1 ? '是否取消当前订单？' : '是否申请退款？',
            cancelButtonText: '考虑一下',
            confirmButtonText: status == 1 ? '立即取消' : '立即退款'
        }).then(() => {
            util.wx.get('/api/front/order/cancel', { "order_code": this.data.code })
                .then(res => {
                    if (res.data.code == 0) {
                        this.getOrderInfo()
                        Notify({
                            text: '操作成功',
                            duration: 1000,
                            selector: '#custom-selector',
                            backgroundColor: '#66c23a'
                        })

                    } else {
                        Notify({
                            text: res.data.msg,
                            duration: 1000,
                            selector: '#custom-selector',
                            backgroundColor: '#d0021b'
                        })
                    }
                })
        }).catch(() => {
            // on cancel
        });
    },
    getOrderInfo() {
        this.setData({
            loading: true
        })
        util.wx.get('/api/front/order/info', { "order_code": this.data.code })
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        loading: false,
                        order_info: res.data.data
                    })
                }
            })
    },
    copyOrder(event) {
        wx.setClipboardData({
            data: event.currentTarget.dataset.text,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    getWxMiniData(event) {
        this.setData({
            btn_load: true
        })
        let { type } = event.currentTarget.dataset
        console.log('type', type)
        util.wx.post('/api/front/payment/wxMiniData', { 'order_code': this.data.code })
            .then(res => {
                console.log(res)
                if (res.data.code == 0) {
                    const data = res.data.data
                    wx.requestPayment({
                        appId: data['appId'],
                        timeStamp: data['timeStamp'],
                        nonceStr: data['nonceStr'],
                        package: data['package'],
                        signType: data['signType'],
                        paySign: data['paySign'],
                        success: (res) => {
                            if (type == 1) {
                                wx.redirectTo({
                                    url: '../pay-service-success/index?id=' + this.data.code
                                })
                            }else{
                                wx.redirectTo({
                                    url: '../pay-goods-success/index?id=' + this.data.code
                                })
                            }

                        },
                        fail: (err) => {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none'
                            })
                        },
                        complete: () => {
                            this.setData({
                                btn_load: false
                            })
                        }
                    })
                } else if (res.data.code == 31213) {
                    wx.redirectTo({
                        url: '../pay-goods-success/index?id=' + this.data.code
                    })

                } else {
                    wx.showToast({
                        title: '服务器和获取微信minidata错误',
                        icon: 'none'
                    })
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            code: options.id || ''
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
    onShow: function(options) {
        this.getOrderInfo()
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


})