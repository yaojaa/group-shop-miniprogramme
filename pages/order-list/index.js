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
        status: 0,
        order_list: [],
        refund_list: [],
        order_code: '',
        code_img: ''
    },
    handleCodePopup() {
        this.setData({ code: true });
    },
    onClose() {
        this.setData({ code: false });
    },
    handleCancelOrder(event) {
        let { order } = event.target.dataset
       
        Dialog.confirm({
            message: '是否取消当前订单？',
            cancelButtonText: '考虑一下',
            confirmButtonText: '立即取消'
        }).then(() => {
            
            util.wx.get('/api/front/order/cancel', { "order_code": order })
                .then(res => {
                    if (res.data.code == 0) {
                        this.getOrderList()
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
    handleConfirmReceipt(event) {
        let { order } = event.target.dataset
       
        Dialog.confirm({
            message: '请确认商品是否收到？',
            confirmButtonText: '确认收货'
        }).then(() => {
            
            util.wx.get('/api/front/order/confirm', { "order_code": order })
                .then(res => {
                    if (res.data.code == 0) {
                        this.getOrderList()
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
    getOrderList() {
        this.setData({
            loading: true
        })
        util.wx.get('/api/front/order/index', { "page": 1, "page_size": 100, status: this.data.status })
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        loading: false,
                        order_list: res.data.data
                    })
                }
            })
    },
    getRefundList() {
        this.setData({
            loading: true
        })
        util.wx.get('/api/front/order/refundList', { "page": 1, "page_size": 100 })
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        loading: false,
                        refund_list: res.data.data
                    })
                }
            })
    },
    filterOrder(event) {
        let order = event.detail.index
        this.setData({
            status: order
        })
        if (order == 5) {
            this.getRefundList()
        } else {
            this.getOrderList()
        }
    },
    getOrderCode(event) {
        let { order } = event.target.dataset
        this.setData({
            loading: true
        })
        util.wx.get('/api/front/order/getQr', { "order_code": order })
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        loading: false,
                        code: true,
                        code_img: res.data.data
                    })
                } else {
                    this.setData({
                        loading: false
                    })
                    Notify({
                        text: res.data.msg,
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#d0021b'
                    })
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        this.getOrderList()
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