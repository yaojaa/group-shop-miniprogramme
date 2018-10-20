const app = getApp()
const { $Toast } = require('../../iView/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: 'userinfo',
        mobile: '',
        address: '',
        wxnumber: ''
    },
    postInfo() {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/set_user_info',
            method: 'post',
            data: {
                token: app.globalData.token,
                mobile: this.data.mobile,
                wxnumber: this.data.wxnumber,
                address: this.data.address
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Toast({
                        content: '保存存成',
                        type: 'success'
                    });
                }
            }
        })
    },
    getPhoneNumber(e) {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_wx_mobile',
            method: 'post',
            data: {
                token: app.globalData.token,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
            },
            success: (res) => {
                this.setData({
                    mobile: res.data.data.phoneNumber
                })

            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_user_info',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        mobile: res.data.data.userinfo.mobile,
                        wxnumber: res.data.data.userinfo.wxnumber,
                        address: res.data.data.userinfo.address
                    })

                }
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