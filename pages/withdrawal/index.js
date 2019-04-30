const app = getApp()
const { $Message } = require('../../iView/base/index');
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {

        store_money: 0,
        inputMoney: 0,
        withdrawalslist: [],
        totalpage: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.get_store_info()
        this.finance_withdrawal_list()

    },
    inputMoneyChange(e) {
        console.log(e.detail.detail.value)
        if (e.detail.detail.value) {
            this.setData({
                inputMoney: e.detail.detail.value
            })
        }

    },
    getMoney() {

        if (this.data.inputMoney) {


            util.wx.post('/api/seller/apply_withdraw', {
                apply_money: this.data.inputMoney
            }).then((res) => {
                if (res.data.code == 200) {

                   wx.showToast({
                        title: '申请提现成功，请耐心等待审核',
                        icon: 'success'
                    })

                    this.get_store_info()

                } else {

                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            })
        }

    },
    get_store_info() {

        util.wx.get('/api/seller/get_store_money')
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        store_money: res.data.data.store_money
                    })
                }

            })



    },
    //获取提醒记录
    finance_withdrawal_list() {

      util.wx.get('/api/seller/withdraw_list')
      .then(res=>{

        if (res.data.code == 200) {

                    this.setData({
                        withdrawalslist: res.data.data.withdraw_list
                    })
                }



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