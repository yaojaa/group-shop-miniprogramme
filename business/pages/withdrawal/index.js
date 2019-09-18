const util = require('../../../utils/util')
import Dialog from '../../../vant/dialog/dialog'
import Toast from '../../../vant/toast/toast'
import { $wuxCountUp } from '../../../wux/index'
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
        util.wx.get('/api/front/finance/index')
            .then(res => {
                if (res.data.code == 0) {
                    this.money = new $wuxCountUp(0, res.data.data.user_wallet_amount / 100, 2, 1, {
                        printValue(value) {
                            this.setData({
                                money: value,
                            })
                        }
                    })
                    this.money.start()
                }
            })
    },
    takeMoney(e) {
        let amount = parseInt(e.detail.value.amount)*100
        this.setData({
            disabled: true
        })
        console.log('amount',amount)
        util.wx.post('/api/front/withdraw/getRedPack', { amount })
            .then(res => {
                this.setData({
                    disabled: false
                })
                if (res.data.code == 0) {
                    Dialog.alert({
                        selector: '#dialog-success',
                        confirmButtonText: '好的'
                    }).then(() => {

                    })
                    this.getFinance()
                } else {
                    Toast(res.data.msg)
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getFinance()

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

    }
})