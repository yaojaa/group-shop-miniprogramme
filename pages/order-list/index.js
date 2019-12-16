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
        totalpage: 1,
        phone: '',
        weChat: ''
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
    goContact(e) {
        const { phone, wx,wx_code } = e.currentTarget.dataset
        this.setData({
            phone: phone,
            weChat: wx,
            wx_code:wx_code
        })
        Dialog.alert({
            selector: '#contact'
        })
    },
    copyWx(event) {
        wx.setClipboardData({
            data: this.data.weChat,
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
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
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
        this.data.order_list = []
        this.data.cpage = 1
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
    },
    checkexpress(e) {
        let data = '';
        let index = e.currentTarget.dataset.index;
        let current = this.data.order_list[index];

        current.express.forEach((e, i) => {
            data += 'code' + i + '=' + e.express_code + '&com' + i + '=' + e.express_company + '&'
        })

        data += 'index=0&order_id=' + e.currentTarget.dataset.id +
            '&user=' + current.consignee +
            '&goods=' + current.order_detail[0].goods_name

        wx.navigateTo({
            url: '/pages/ems-detail/index?' + data
        })

    },
    previewImage(e){
        var current = e.target.dataset.src;  
    wx.previewImage({  
        current: current, // 当前显示图片的http链接 
        urls: [current] // 需要预览的图片http链接列表 
    })

    }

})