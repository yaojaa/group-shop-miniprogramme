const util = require('../../../utils/util')
import Dialog from '../../../vant/dialog/dialog'
import Toast from '../../../vant/toast/toast'
import {
    $wuxCountUp
} from '../../../wux/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: '',
        money: 0,
        disabled: false
    },
    getFinance() {
        util.wx.get('/api/user/get_user_info')
            .then(res => {
                this.setData({
                    money: res.data.data.supplier.pending_money
                })
            })
    },
    takeMoney(e) {
        let money = parseInt(e.detail.value.amount)
        this.setData({
            disabled: true
        })
        util.wx.post('/api/supplier/apply_withdraw', {
                apply_money: money
            })
            .then(res => {
                this.setData({
                    disabled: false
                })
                if (res.data.code == 200) {
                    Dialog.alert({
                        selector: '#dialog-success',
                        confirmButtonText: '好的'
                    }).then(() => {

                    })
                    this.getFinance()
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }, res => {

                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })

            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFinance()

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
})