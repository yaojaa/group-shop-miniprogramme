import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: false,
        status: 0,
        order_list: [],
        refund_list: [],
        order_code: '',
        code_img: '',
        loading: false
    },
    handleCodePopup() {
        this.setData({ code: true });
    },
    onClose() {
        this.setData({ code: false });
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
    _set_order_status(){

         util.wx.get('/api/seller/set_order_status', { 
                "order_code": order_id ,
                "opt":opt
            })
                .then(res => {
                    if (res.data.code == 200) {
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

            this._set_order_status(order_id,opt)
        })
           
    },
    toset_received(order_id, opt) {

        Dialog.confirm({
            message: '请确认商品是否收到？',
            confirmButtonText: '确认收货'
        }).then(() => {

          this._set_order_status(order_id,opt)
      })

       
    },
    getOrderList() {
        this.setData({
            loading: true
        })

        util.wx.get('/api/user/get_order_list', {
                search_status: this.data.search_status
            })
            .then(res => {
                console.log('order res.data', res.data)
                if (res.data.code == 200) {
                    this.setData({
                        loading: false,
                        order_list: res.data.data.order_list
                    })
                }
            })

    },
    getRefundList() {
        this.setData({
            loading: true
        })
        // util.wx.get('/api/front/order/refundList', { "page": 1, "page_size": 100 })
        //     .then(res => {
        //         if (res.data.code == 0) {
        //             this.setData({
        //                 loading: false,
        //                 refund_list: res.data.data
        //             })
        //         }
        //     })
    },
    filterOrder(event) {
        let order = event.detail.index
        this.setData({
            search_status: order
        })

        this.getOrderList()
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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },


})