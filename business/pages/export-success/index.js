// pages/paySuccess/index.js
const app = getApp()
const util = require('../../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        link: 'http://www.kaixinma.sdc/sdfsf.success'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.goods_id = options.goods_id



    },


    goback() {

        wx.redirectTo({
            url: '../home/index'
        })

    },
    toDetail() {

        wx.redirectTo({
            url: '../goods/goods?goods_id=' + this.data.goods_id
        })


    },
    // addListener:util.userListner,
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return {
            title: this.data.info.goods_name,
            imageUrl:this.data.info.goods_cover,
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id
        }
    },
    formSubmit: function (e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    addListener: function () {
        wx.requestSubscribeMessage({
            tmplIds: ['17y_mLplxTn0resiR34oUsJMZu2E2W6i0x2YIRZgvZ4', 'Wu_vie78kgoRr8y90IAsxoEn87BJ3nDrEBLP0MK6208'],
            success(res) {}
        })
    }
})