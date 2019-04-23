const app = getApp()

const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address_id: '',
        address: '',
        addressList: [],
    },
    getAddressList() {
        util.wx.get('/api/user/address_list')
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        address: res.data.data.address_list[0]
                    })
                }
            })
    },
    getAddress() {
        util.wx.get('/api/user/address_detail', { address_id: this.data.address_id })
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        address: res.data.data
                    })
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getAddressList()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getAddress();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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