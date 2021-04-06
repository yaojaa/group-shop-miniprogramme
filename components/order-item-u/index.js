// components/order-panel/index.js
const util = require('../../utils/util')

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: ''
        }
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

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

                    wx.showToast({
                        title:'支付成功'
                    })
                 
                    this.setData({
                        active: 0,
                        cpage: 1,
                        order_list: []
                    })
                  this.triggerEvent('getOrderList',{},{})

                },
                fail: (res) => {
                    wx.hideLoading()
                    wx.showToast({
                        title:'支付失败',
                        icon:'none'
                    })
                }
            })

        })

    },


        toRefund(e) {

            const order_refund_id = e.currentTarget.dataset.order_refund_id || null
            const order_id = e.currentTarget.dataset.order_id

            if (order_refund_id) {

                wx.navigateTo({
                    url: '../refundment-detail/index?order_id=' + order_id + '&id=' + order_refund_id
                })

            } else {
                wx.navigateTo({
                    url: '../refundment/index?order_id=' + order_id
                })
            }

        },

        orderActions(e) {
            const { opt, order_id, txt, sn } = e.currentTarget.dataset
            console.log(opt, order_id, txt)
            if (opt == 'toset_pay') {
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

                                this.data.search_status = 0

                                this.setData({
                                    active: 0,
                                    cpage: 1,
                                    order_list: []
                                })

                                console.log(this)

                                this.triggerEvent('getOrderList',{},{})
                            } else {
                                wx.showToast({ title: '订单操作失败' })
                            }
                        })
                    }
                }
            })
        },

    }
})