import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status: 0,
        order_list: [],
        loading: false,
        cpage: 1,
        totalpage: 1
    },
    handleCancelOrder(event) {

        //      'toset_cancel'   => '取消订单',
        // 'toset_pay'      => '去支付',
        // 'toset_received' => '确认收货'

        let { order_id, opt } = event.target.dataset

        switch (opt) {
            case 'toset_cancel':
                this.cancelOrder(order_id, opt)
                break;
            case 'toset_pay':
                this.pay(order_id, opt)
                break;
            case 'toset_received':
                this.toset_received(order_id, opt)


        }


    },
    _set_order_status() {

        util.wx.get('/api/user/set_order_status', {
                "order_code": order_id,
                "opt": opt
            })
            .then(res => {
                if (res.data.code == 200) {
                    this.getOrderList()
                    Notify({
                        text: '操作成功',
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#49b34d'
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
            .catch(() => {
                // on cancel
            });


    },
    //取消订单
    cancelOrder(order_id, opt) {

        Dialog.confirm({
            message: '确定要消当前订单吗？',
            cancelButtonText: '考虑一下',
            confirmButtonText: '立即取消'
        }).then(() => {

            this._set_order_status(order_id, opt)
        })

    },
    toset_received(order_id, opt) {

        Dialog.confirm({
            message: '请确认商品是否收到？',
            confirmButtonText: '确认收货'
        }).then(() => {

            this._set_order_status(order_id, opt)
        })


    },
    getOrderList() {
        this.setData({
            loading: true
        })
        return new Promise((resolve, reject) => {
            util.wx.get('/api/user/get_order_list', {
                search_status: this.data.search_status,
                cpage: this.data.cpage,
                pagesize: 10
            }).then((res) => {
                this.setData({
                    loading: false,
                    order_list: this.data.order_list.concat(res.data.data.order_list),
                    totalpage: res.data.data.page.totalpage
                })
                resolve()
            }, (err) => {
                reject(err)
            })
        })
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

                            this.getOrderList()
                        } else {
                            wx.showToast({ title: '订单操作失败' })
                        }
                    })
                }
            }
        })
    },
    filterOrder(event) {
        let order = event.detail.index
        this.setData({
            search_status: order,
            active: order,
            cpage: 1,
            order_list: []
        })
        this.getOrderList()
    },
    pay(id) {
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
                    util.wx.post('/api/pay/orderpay', {
                        order_sn: id
                    })
                    Notify({
                        text: '支付成功',
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#49b34d'
                    })
                    this.setData({
                        active: 0,
                        cpage: 1,
                        order_list: []
                    })
                    this.getOrderList();
                },
                fail: (res) => {
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
        this.data.search_status = options.search_status || 0
        this.setData({
            active: options.search_status || 0
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
    // 下拉刷新
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getOrderList().then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.cpage && !this.data.loading) {
            this.setData({
                cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
            })
            if (this.data.cpage > this.data.totalpage) {
                return
            }
            this.getOrderList().then(() => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    }

})