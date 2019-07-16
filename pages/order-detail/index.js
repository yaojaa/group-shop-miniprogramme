import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        info: {},
        addtime: '',
        pay_time: ''
    },
    handleConfirmReceipt() {
        Dialog.confirm({
            message: '是否要取消当前订单？',
            confirmButtonText: '考虑一下'
        }).then(() => {
            // on confirm
        }).catch(() => {
            // on cancel
        });
    },
    pay(id) {
        wx.showLoading()
        util.wx.post('/api/pay/pay', {
            order_sn: id
        }).then(res => {
            var data = res.data.data;
            wx.requestPayment({
                timeStamp: data['timeStamp'],
                nonceStr: data['nonceStr'],
                package: data['package'],
                signType: data['signType'],
                paySign: data['paySign'],
                success: (res) => {
                    wx.hideLoading()
                    util.wx.post('/api/pay/orderpay', {
                        order_sn: id
                    })
                    Notify({
                        text: '支付成功',
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#66c23a'
                    })
                    this.getInfo();
                },
                fail: (res) => {
                    wx.hideLoading()
                    Notify({
                        text: '支付失败，请重新支付',
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#d0021b'
                    })
                }
            })

        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id || ''
        })
        this.getInfo()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    getInfo() {
        wx.showLoading()
        util.wx.get('/api/user/get_order_detail', {
                order_id: this.data.id
            })
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        info: res.data.data,
                        addtime: res.data.data.addtime,
                        pay_time: res.data.data.pay_time 
                    })
                }
                wx.hideLoading()
            })
    },
    orderActions(e) {
        const { opt, order_id, txt,sn } = e.currentTarget.dataset
        console.log(opt, order_id, txt)
        if( opt == 'toset_pay'){
            this.pay(sn)
            return
        }
        wx.showModal({
            title: '确定要' + txt + '吗？',
            success: (res) => {
                if (res.confirm) {
                    util.wx.post('/api/user/set_order_status', {
                        opt,
                        order_id
                    }).then(res => {
                        if (res.data.code == 200) {
                            wx.showToast({ title: '订单操作成功' })
                            this.getInfo()
                        } else {
                            wx.showToast({ title: '订单操作失败' })
                        }
                    })
                }
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