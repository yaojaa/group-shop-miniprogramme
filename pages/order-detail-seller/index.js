import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify'
const util = require('../../utils/util')
const app = getApp()

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
    copyTxt(e) {

        const txt = e.target.dataset.text

        wx.setClipboardData({
            data: txt,
            success: function(res) {
                wx.showToast({
                    title: '已复制',
                    icon: 'none'
                });
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        app.globalData.apiPrix = 'seller'
        this.data.id = options.id

        this.setData({
            userStoreId: app.globalData.userInfo.store_id
        })

    },
    onShow: function() {
        this.getInfo()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    getInfo() {
        wx.showLoading()
        util.wx.get('/api/seller/get_order_detail', {
                order_id: this.data.id
            })
            .then(res => {
                if (res.data.code == 200) {

                    var data = res.data.data


                    if (data.link_store.length >= 2) {
                        data.link_store.forEach(it => {
                            if (it && it.store_id == app.globalData.userInfo.store_id) {
                                console.log('你有权限管理')
                                data.showAction = true
                            }
                        })
                    }


                    if (data.link_store.length == 1 && data.link_store[0]==null ) {
                        data.showAction =true
                    } else if (data.link_store.length == 2) {
                        data.link_store.forEach(it => {
                            if (it && it.store_id == app.globalData.userInfo.store_id) {
                                console.log('你有权限管理')
                                data.showAction = true
                            }
                        })
                    }


                    console.log(data.showAction)


                    this.setData({
                        info: data,
                        addtime: data.addtime,
                        pay_time: data.pay_time,
                        goods_id: data.order_detail[0].goods_id,
                        goods_name: data.order_detail[0].goods_name,
                        delivery_method: data.delivery_method
                    })
                }
                wx.hideLoading()
            })
    },
    ordermanage() {
        wx.navigateTo({
            url: '../ordermanage/list?id=' + this.data.goods_id + '&goods_name=' + this.data.goods_name + '&delivery_method=' + this.data.delivery_method
        })

    },
    orderActions(e) {
        const {
            opt,
            order_id,
            txt,
            sn
        } = e.currentTarget.dataset

        wx.showModal({
            title: '您要' + txt + '吗？',
            success: (res) => {
                if (res.confirm) {
                    util.wx.post('/api/seller/set_order_status', {
                        opt,
                        order_id
                    }).then(res => {
                        if (res.data.code == 200) {
                            wx.showToast({
                                title: '订单操作成功'
                            })
                            this.getInfo()
                        } else {
                            wx.showToast({
                                title: '订单操作失败'
                            })
                        }
                    })
                }
            }
        })
    },

    checkexpressorder(e) {

        let data = '';

        //将列表的单号信息保存到

        data += 'order_id=' + e.currentTarget.dataset.id
        data += '&sn=' + e.currentTarget.dataset.sn

        console.log(data)
        wx.navigateTo({
            url: '/pages/express/index?' + data
        })

    },

    checkexpress(e) {

        let data = '';

        data += 'order_sn=' + e.currentTarget.dataset.sn +
            '&user=' + e.currentTarget.dataset

        wx.navigateTo({
            url: '/pages/ems-detail/index?' + data
        })


    },
    to_refund(e) {

        const order_refund_id = e.currentTarget.dataset.order_refund_id || null

        const order_id = e.currentTarget.dataset.order_id

        if (order_refund_id) {
            wx.navigateTo({
                url: '../refundment-detail-seller/index?order_id=' + order_id + '&id=' + order_refund_id
            })

        }
    },
    /**
     * 生命周期函数--监听页面显示
     */

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